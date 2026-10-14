import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Railway supplies PORT and its public domain at runtime, after Next.js builds.
export function runtimeEnvironment(source) {
    const env = { ...source };
    const port = env.PORT || '3000';
    if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535)
        throw Error('PORT must be a valid TCP port.');
    env.PORT = port;
    const railway = Boolean(env.RAILWAY_ENVIRONMENT_ID || env.RAILWAY_PUBLIC_DOMAIN);
    if (!env.NEXT_PUBLIC_SITE_URL && env.RAILWAY_PUBLIC_DOMAIN) {
        if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(env.RAILWAY_PUBLIC_DOMAIN))
            throw Error('Invalid RAILWAY_PUBLIC_DOMAIN.');
        env.NEXT_PUBLIC_SITE_URL = `https://${env.RAILWAY_PUBLIC_DOMAIN}`;
    }
    if (railway) {
        for (const name of ['DATABASE_URL', 'BOT_TOKEN', 'NEXT_PUBLIC_SITE_URL'])
            if (!env[name]) throw Error(`Set ${name} in Railway Variables. For the URL, use Generate Domain.`);
        const site = new URL(env.NEXT_PUBLIC_SITE_URL);
        if (site.protocol !== 'https:' || site.username || site.password || site.pathname !== '/' || site.search || site.hash)
            throw Error('NEXT_PUBLIC_SITE_URL must be a public HTTPS origin.');
        const db = new URL(env.DATABASE_URL);
        if (!['postgres:', 'postgresql:'].includes(db.protocol)) throw Error('DATABASE_URL must connect to PostgreSQL.');
        for (const name of ['INTERNAL_API_SECRET', 'CRON_SECRET'])
            if ((env[name]?.length ?? 0) < 32) throw Error(`Set ${name}: generate once with npm run env:railway.`);
        const key = env.DELIVERY_ENCRYPTION_KEY || '';
        if (!/^[A-Za-z0-9+/]{43}=$/.test(key) || Buffer.from(key, 'base64').length !== 32)
            throw Error('Set DELIVERY_ENCRYPTION_KEY: generate once, then keep it across redeploys.');
    }
    // Never infer a trusted origin from the incoming Host/Origin headers.
    env.COMMERCE_WORKER_ORIGIN = `http://127.0.0.1:${port}`;
    return { env, railway, port };
}

export async function launch(source = process.env, options = {}) {
    const { env, railway, port } = runtimeEnvironment(source);
    const spawnChild = options.spawnChild || spawn;
    const fetchHealth = options.fetchHealth || fetch;
    const signals = options.signals || process;
    const finish = options.finish || ((code) => process.exit(code));
    const children = new Set();
    let stopping = false;
    let killTimer;
    const onTerm = () => stop(0);
    function cleanup() {
        clearTimeout(killTimer);
        signals.off('SIGTERM', onTerm);
        signals.off('SIGINT', onTerm);
    }
    function stop(code) {
        if (stopping) return;
        stopping = true;
        for (const child of children) child.kill('SIGTERM');
        if (!children.size) { cleanup(); finish(code); return; }
        killTimer = setTimeout(() => {
            for (const child of children) child.kill('SIGKILL');
            cleanup(); finish(code);
        }, 8000);
        for (const child of children) child.once('exit', () => {
            if (!children.size) { cleanup(); finish(code); }
        });
    }
    signals.once('SIGTERM', onTerm);
    signals.once('SIGINT', onTerm);
    function child(args, persistent = false) {
        const running = spawnChild(process.execPath, args, { env, stdio: 'inherit' });
        children.add(running);
        running.once('exit', () => children.delete(running));
        running.once('error', () => { children.delete(running); stop(1); });
        if (persistent) running.once('exit', () => { if (!stopping) stop(1); });
        return running;
    }
    if (railway) {
        console.log('[startup] Applying PostgreSQL migrations.');
        const migration = child(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
        const ok = await new Promise((resolve) => {
            migration.once('exit', (code) => resolve(code === 0));
            migration.once('error', () => resolve(false));
        });
        if (stopping) return;
        if (!ok) { stop(1); return; }
        console.log('[startup] Initializing catalog without overwriting admin edits.');
        const seed = child(['--import', 'tsx', '--conditions=react-server', 'scripts/tools.ts', 'admin-seed']);
        const seeded = await new Promise((resolve) => {
            seed.once('exit', (code) => resolve(code === 0));
            seed.once('error', () => resolve(false));
        });
        if (stopping) return;
        if (!seeded) { stop(1); return; }
    }
    if (stopping) return;
    child(['node_modules/next/dist/bin/next', 'start', '--hostname', '0.0.0.0', '--port', port], true);
    if (!railway || env.START_COMMERCE_WORKER === 'false') return;
    const deadline = Date.now() + 120000;
    while (!stopping && Date.now() < deadline) {
        try {
            const response = await fetchHealth(`${env.COMMERCE_WORKER_ORIGIN}/api/health`, {
                signal: AbortSignal.timeout(3000), redirect: 'error',
            });
            await response.body?.cancel();
            if (stopping) return;
            if (response.ok) {
                child(['--import', 'tsx', 'scripts/tools.ts', 'worker'], true);
                console.log('[startup] Mini App and commerce worker started.');
                return;
            }
        } catch { /* Wait for the web process and DB-backed health endpoint. */ }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!stopping) { console.error('[startup] Health check timed out.'); stop(1); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    launch().catch(() => {
        console.error('[startup] Configuration/startup failed. Check required Variables and PostgreSQL. Secrets are not logged.');
        process.exitCode = 1;
    });
}
