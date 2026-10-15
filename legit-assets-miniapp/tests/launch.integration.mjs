// Production server with a disposable SQLite database and synthetic Telegram identity.
// Run after npm run build. Never uses real provider credentials or a live database.
import {spawn} from 'node:child_process';
import {createHmac} from 'node:crypto';
import {mkdtemp, stat, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=await mkdtemp(join(tmpdir(),'legit-launch-test-'));
// Explicit allowlist: no inherited provider secrets, database URL or production flags.
const env={PATH:process.env.PATH,HOME:process.env.HOME,DATA_DIR:dir,AUTO_MIGRATE:'true',START_COMMERCE_WORKER:'true',PORT:'3291',NEXT_PUBLIC_SITE_URL:'https://fixture.example.test',BOT_TOKEN:'123456:fixture-only-no-real-token',ADMIN_ID:'42',INTERNAL_API_SECRET:'i'.repeat(64),CRON_SECRET:'c'.repeat(64),DELIVERY_ENCRYPTION_KEY:Buffer.alloc(32,1).toString('base64'),FX_MODE:'manual',FX_MANUAL_RATES_JSON:JSON.stringify({RUB:1,USD:95,USDT:95,UAH:95/41.5}),FX_MANUAL_UPDATED_AT:String(Math.floor(Date.now()/1000)),NEXT_TELEMETRY_DISABLED:'1'};
const base='http://127.0.0.1:3291';
function signed(id) {
  const p=new URLSearchParams({auth_date:String(Math.floor(Date.now()/1000)),user:JSON.stringify({id,first_name:'Fixture'})});
  const key=createHmac('sha256','WebAppData').update(env.BOT_TOKEN).digest();
  p.set('hash',createHmac('sha256',key).update([...p.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+'='+v).join('\n')).digest('hex'));
  return p.toString();
}
async function request(path,body,cookie='') {
  return fetch(base+path,{method:body?'POST':'GET',headers:{origin:env.NEXT_PUBLIC_SITE_URL,'content-type':'application/json','x-legit-channel':'TMA',cookie},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
}
async function boot(check) {
  let logs='';
  const child=spawn(process.execPath,['scripts/start.mjs'],{cwd:root,env,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);
  const exited=new Promise(resolve=>child.once('exit',resolve));
  try {
    let ready=false;
    for(let i=0;i<240;i++) {
      if(child.exitCode!==null)break;
      try {if((await fetch(base+'/api/health',{signal:AbortSignal.timeout(1000)})).ok){ready=true;break;}}catch{}
      await new Promise(r=>setTimeout(r,250));
    }
    assert.ok(ready,logs.slice(-2500));
    await check();
  } finally {
    child.kill('SIGTERM');
    const timer=setTimeout(()=>child.kill('SIGKILL'),12000);
    await exited;clearTimeout(timer);
  }
}
try {
  // Refuse to test against an unrelated process already using this port.
  let occupied=false;try {await fetch(base+'/api/health',{signal:AbortSignal.timeout(500)});occupied=true;}catch{}
  assert.equal(occupied,false,'Port 3291 must be free');
  await boot(async()=>{
    assert.ok((await stat(join(dir,'legit.sqlite'))).size>0);
    for(const path of ['/uk','/uk/nft-gifts','/uk/smm','/uk/account','/uk/history','/admin/login'])assert.equal((await request(path)).status,200,path);
    for(const path of ['/admin','/api/admin/commerce/storage'])assert.equal((await request(path)).status,403,path);
    const login=await request('/api/auth/telegram',{initData:signed(99002)});
    assert.equal(login.status,200,await login.clone().text());
    const cookie=login.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
    assert.ok(cookie);
    assert.equal((await request('/api/profile/onboarding',{completed:true,version:1},cookie)).status,409);
    assert.equal((await request('/api/profile/language',{locale:'uk'},cookie)).status,200);
    assert.equal((await request('/api/profile/onboarding',{completed:true,version:1},cookie)).status,200);
    const me=await (await request('/api/auth/me',null,cookie)).json();
    assert.ok(me.user.onboardingCompletedAt);assert.equal(me.user.isAdmin,false);
    assert.equal((await request('/api/shop/deposit',{},cookie)).status,403);
    assert.equal((await request('/api/admin/login',{initData:signed(99002)})).status,403);
    const admin=await request('/api/admin/login',{initData:signed(42)});
    assert.equal(admin.status,200,await admin.clone().text());
    const adminCookie=admin.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
    for(const path of ['/api/admin/commerce/overview','/api/admin/commerce/orders','/api/admin/commerce/storage','/api/admin/products']) {
      const result=await request(path,null,adminCookie);assert.equal(result.status,200,path+': '+await result.text());
    }
    assert.equal((await request('/api/auth/logout',{},cookie)).status,200);
    assert.equal((await (await request('/api/auth/me',null,cookie)).json()).user,null);
    console.log('PASS client/admin signed login, onboarding, logout, bot-only topup and protected admin APIs');
  });
  await boot(async()=>{
    const db=new DatabaseSync(join(dir,'legit.sqlite'));
    try {
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM "User" WHERE "telegramId"=?').get(99002).n,1);
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM "Product"').get().n,13);
      assert.equal(db.prepare('PRAGMA journal_mode').get().journal_mode,'wal');
    } finally {db.close();}
  });
  console.log('PASS automatic SQLite migration/seed, HTTP routes and restart persistence');
} finally {await rm(dir,{recursive:true,force:true});}
