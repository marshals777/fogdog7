import {spawn} from "node:child_process";
import {fileURLToPath, pathToFileURL} from "node:url";
import {randomBytes, createHash} from "node:crypto";
import {readFile, writeFile, mkdir, readdir, chown, open, unlink} from "node:fs/promises";
import {join, dirname, relative, resolve, isAbsolute} from "node:path";
import assert from "node:assert/strict";

export class StartupError extends Error {}
// Build-only source bundle, never exposed by the public asset API.
export async function projectSources(mode = "extract") {
  const packPath = resolve("project.pack.json");
  const pack = JSON.parse(await readFile(packPath, "utf8"));
  assert(pack.version === 1 && pack.files && typeof pack.files === "object", "Invalid source pack");
  const entries = Object.entries(pack.files);
  // Validate the whole bundle before writing anything.
  for (const [name, entry] of entries) {
    assert(/^(?:src\/|prisma\/|tests\/|scripts\/tools\.ts$|integration-previews\/|next-env\.d\.ts$)/.test(name) && !name.split("/").some(part => part === ".." || !part) && !name.includes("\\"), "Unsafe packed source path");
    assert(entry.encoding === "utf8" || entry.encoding === "base64", "Invalid source encoding");
    assert(typeof entry.content === "string", "Invalid source content");
    const bytes = Buffer.from(entry.content, entry.encoding);
    assert(createHash("sha256").update(bytes).digest("hex") === entry.sha256, `Damaged source pack: ${name}`);
  }
  if (mode === "pack") {
    for (const [name, entry] of entries) {
      const bytes = await readFile(name);
      entry.content = bytes.toString(entry.encoding);
      entry.sha256 = createHash("sha256").update(bytes).digest("hex");
    }
    await writeFile(packPath, JSON.stringify(pack, null, 2) + "\n");
  } else {
    for (const [name, entry] of entries) {
      const bytes = Buffer.from(entry.content, entry.encoding);
      const existing = await readFile(name).catch(e => { if(e.code === "ENOENT") return null; throw e; });
      // Next manages its own declaration file; leave an existing one in place.
      if (existing && name === "next-env.d.ts") continue;
      assert(!existing || existing.equals(bytes), `Edited generated source: ${name}. Run npm run source:pack to preserve your edits.`);
    }
    for (const [name, entry] of entries) {
      await mkdir(dirname(name), {recursive:true});
      try { await writeFile(name, Buffer.from(entry.content, entry.encoding), {flag:"wx"}); }
      catch(e) { if(e.code !== "EEXIST") throw e; }
    }
  }
  return entries.length;
}
// Snapshot includes committed WAL data without stopping the shop.
export async function backupDatabase(source = process.env, destination) {
  if (!destination || !isAbsolute(destination)) throw new StartupError("Pass an absolute backup path outside public/.");
  const target = resolve(destination);
  if (target.split(/[\\/]/).includes("public")) throw new StartupError("Backups must not be publicly served.");
  const url = source.DATABASE_URL || pathToFileURL(join(source.RAILWAY_VOLUME_MOUNT_PATH || source.DATA_DIR || resolve(".data"), "legit.sqlite")).href;
  if (!url.startsWith("file:")) throw new StartupError("Backup supports embedded SQLite only.");
  const databasePath = fileURLToPath(url);
  const {DatabaseSync, backup} = await import("node:sqlite");
  const db = new DatabaseSync(databasePath, {readOnly: true});
  let reserved = false;
  try {
    const handle = await open(target, "wx", 0o600);
    reserved = true;
    await handle.close();
    await backup(db, target);
  } catch (error) {
    if (reserved) await unlink(target).catch(() => {});
    throw error;
  } finally { db.close(); }
  return target;
}
// Railway supplies PORT and its public domain at runtime, after Next.js builds.
export function runtimeEnvironment(source) {
  const env = {...source};
  const port = env.PORT || "3000";
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new StartupError("PORT must be a valid TCP port.");
  env.PORT = port;
  const railway = Boolean(env.RAILWAY_ENVIRONMENT_ID || env.RAILWAY_PUBLIC_DOMAIN);
  if (!env.NEXT_PUBLIC_SITE_URL && env.RAILWAY_PUBLIC_DOMAIN) {
    if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(env.RAILWAY_PUBLIC_DOMAIN))
      throw new StartupError("Invalid RAILWAY_PUBLIC_DOMAIN.");
    env.NEXT_PUBLIC_SITE_URL = `https://${env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  const volume=env.RAILWAY_VOLUME_MOUNT_PATH || env.DATA_DIR;
  if(railway&&!volume) throw new StartupError("Attach a Railway Volume at /data; SQLite connects automatically without Postgres.");
  const folder=volume || resolve(".data");
  if(!isAbsolute(folder)) throw new StartupError("DATA_DIR must be an absolute path.");
  env.DATABASE_URL ||= pathToFileURL(join(folder,"legit.sqlite")).href;
  if(!env.DATABASE_URL.startsWith("file:")) throw new StartupError("Remove the old DATABASE_URL and DIRECT_URL: this version creates SQLite on your Volume.");
  let databasePath;
  try{databasePath=fileURLToPath(env.DATABASE_URL);}catch{throw new StartupError("Invalid SQLite file path.");}
  if(railway&&!databasePath.startsWith(resolve(folder)+"/")) throw new StartupError("SQLite must be inside the attached Railway Volume.");
  if(env.DIRECT_URL) throw new StartupError("Remove DIRECT_URL: SQLite has no remote database connection.");
  if (railway || env.AUTO_MIGRATE === "true" || env.START_COMMERCE_WORKER === "true") {
    for (const name of ["BOT_TOKEN", "NEXT_PUBLIC_SITE_URL"])
      if (!env[name]) throw new StartupError(`Set ${name} in Railway Variables. For the URL, use Generate Domain.`);
    let site;
    try{site=new URL(env.NEXT_PUBLIC_SITE_URL);}catch{throw new StartupError("NEXT_PUBLIC_SITE_URL is invalid; generate the Railway domain.");}
    if (site.protocol !== "https:" || site.username || site.password || site.pathname !== "/" || site.search || site.hash)
      throw new StartupError("NEXT_PUBLIC_SITE_URL must be a public HTTPS origin.");
    for (const name of ["INTERNAL_API_SECRET", "CRON_SECRET"])
      if ((env[name]?.length ?? 0) < 32) throw new StartupError(`Set ${name}: generate once with npm run env:railway.`);
    const key = env.DELIVERY_ENCRYPTION_KEY || "";
    if (!/^[A-Za-z0-9+/]{43}=$/.test(key) || Buffer.from(key, "base64").length !== 32)
      throw new StartupError("Set DELIVERY_ENCRYPTION_KEY: generate once, then keep it across redeploys.");
  }
  // Never infer a trusted origin from the incoming Host/Origin headers.
  env.COMMERCE_WORKER_ORIGIN = `http://127.0.0.1:${port}`;
  return {env, railway, port, databasePath};
}

export async function launch(source = process.env, options = {}) {
  const {env, railway, port, databasePath} = runtimeEnvironment(source);
  if(!options.spawnChild) {
    await mkdir(dirname(databasePath),{recursive:true});
    const {DatabaseSync}=await import("node:sqlite");
    const sqlite=new DatabaseSync(databasePath);
    try{sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=20000; PRAGMA foreign_keys=ON;");}finally{sqlite.close();}
    // Railway mounts may start root-owned. Prepare this folder, then drop privileges.
    if(process.getuid?.()===0 && process.env.NODE_ENV==="production") {
      for(const suffix of ["","-wal","-shm"]) await chown(databasePath+suffix,1000,1000).catch(error=>{if(error.code!=="ENOENT")throw error;});
      await chown(dirname(databasePath),1000,1000);
      process.setgroups?.([]);process.setgid?.(1000);process.setuid?.(1000);
    }
  }
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
    signals.off("SIGTERM", onTerm);
    signals.off("SIGINT", onTerm);
  }
  function stop(code) {
    if (stopping) return;
    stopping = true;
    for (const child of children) child.kill("SIGTERM");
    if (!children.size) {
      cleanup();
      finish(code);
      return;
    }
    killTimer = setTimeout(() => {
      for (const child of children) child.kill("SIGKILL");
      cleanup();
      finish(code);
    }, 8000);
    for (const child of children)
      child.once("exit", () => {
        if (!children.size) {
          cleanup();
          finish(code);
        }
      });
  }
  signals.once("SIGTERM", onTerm);
  signals.once("SIGINT", onTerm);
  function child(args, persistent = false, overrides = {}) {
    const running = spawnChild(process.execPath, args, {env: {...env, ...overrides}, stdio: "inherit"});
    children.add(running);
    running.once("exit", () => children.delete(running));
    running.once("error", () => {
      children.delete(running);
      stop(1);
    });
    if (persistent)
      running.once("exit", () => {
        if (!stopping) stop(1);
      });
    return running;
  }
  if (railway || env.AUTO_MIGRATE === "true") {
    if (!options.spawnChild) {
      const folders = await readdir("prisma/migrations");
      if (folders.some(name => legacyPostgresArchive["legacy-postgresql-migrations"][`migrations/${name}/migration.sql`]))
        throw new StartupError("Replace the old prisma/migrations folder with the SQLite folder from this archive. Do not mix both database schemas.");
    }
    console.log("[startup] Initializing SQLite and applying migrations.");
    const migration = child(["node_modules/prisma/build/index.js", "migrate", "deploy"]);
    const ok = await new Promise((resolve) => {
      migration.once("exit", (code) => resolve(code === 0));
      migration.once("error", () => resolve(false));
    });
    if (stopping) return;
    if (!ok) {
      stop(1);
      return;
    }
    console.log("[startup] Initializing catalog without overwriting admin edits.");
    const seed = child(["--import", "tsx", "--conditions=react-server", "scripts/tools.ts", "admin-seed"]);
    const seeded = await new Promise((resolve) => {
      seed.once("exit", (code) => resolve(code === 0));
      seed.once("error", () => resolve(false));
    });
    if (stopping) return;
    if (!seeded) {
      stop(1);
      return;
    }
  }
  if (stopping) return;
  child(["node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", port], true);
  if ((!railway && env.START_COMMERCE_WORKER !== "true") || env.START_COMMERCE_WORKER === "false") return;
  const deadline = Date.now() + 120000;
  while (!stopping && Date.now() < deadline) {
    try {
      const response = await fetchHealth(`${env.COMMERCE_WORKER_ORIGIN}/api/health`, {
        signal: AbortSignal.timeout(3000),
        redirect: "error",
      });
      await response.body?.cancel();
      if (stopping) return;
      if (response.ok) {
        child(["--import", "tsx", "--conditions=react-server", "scripts/tools.ts", "worker"], true);
        console.log("[startup] Mini App and commerce worker started.");
        return;
      }
    } catch {
      /* Wait for the web process and DB-backed health endpoint. */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (!stopping) {
    console.error("[startup] Health check timed out.");
    stop(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href && !process.argv[2]) {
  launch().catch((error) => {
    if(error instanceof StartupError){console.error("[startup] "+error.message);process.exitCode=1;return;}
    console.error("[startup] Configuration/startup failed. Check required Variables and the writable Railway Volume. Secrets are not logged.");
    process.exitCode = 1;
  });
}

// Native commands work before npm install; start without a command runs the Mini App.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href && process.argv[2]) {
  const command = process.argv[2];
  if (command === "sources") {
    const mode = process.argv[3] || "extract";
    assert(["extract", "pack"].includes(mode), "Use sources extract|pack");
    console.log(`Source bundle: ${await projectSources(mode)} files ${mode === "pack" ? "saved" : "ready"}.`);
  } else if (command === "backup") {
    try { await backupDatabase(process.env, process.argv[3]); console.log("SQLite backup completed. Keep it private and copy it off the service Volume."); }
    catch { console.error("Backup failed: source must exist and destination must be an unused absolute writable path outside public/."); process.exitCode = 1; }
  } else if (command === "deploy-files") {
    // Defer until module initialization so the template constant below is ready.
    queueMicrotask(async () => {
      for (const [name, value] of Object.entries(deploymentTemplates)) {
        try { await writeFile(name, value, {flag: "wx", mode: 0o600}); console.log("Created " + name); }
        catch (error) { if (error.code === "EEXIST") console.log("Kept existing " + name); else { console.error("Cannot create " + name); process.exitCode = 1; } }
      }
    });
  } else if (command === "db") {
    const args = process.argv.slice(3);
    const allowed = new Set(["deploy", "dev", "status"]);
    if (args[0] !== "migrate" || !allowed.has(args[1])) throw new StartupError("Use db migrate deploy|dev|status");
    const database=process.env.DATABASE_URL || pathToFileURL(join(process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || resolve(".data"),"legit.sqlite")).href;
    if(!database.startsWith("file:")) throw new StartupError("Use embedded SQLite; remove the old DATABASE_URL.");
    await mkdir(dirname(fileURLToPath(database)),{recursive:true});
    const child = spawn(process.execPath, ["node_modules/prisma/build/index.js", ...args], {
      env: {...process.env, DATABASE_URL: database}, stdio: "inherit"
    });
    child.once("error", () => { console.error("Could not start database command."); process.exitCode = 1; });
    child.once("exit", code => { process.exitCode = code ?? 1; });
  } else if (command === "env") {
    const domain = process.argv.find((v) => v.startsWith("--domain="))?.slice(9);
    const railway = process.argv.includes("--railway");
    if ((!domain && !railway) || (domain && !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain))) {
      console.error("Usage: npm run env:init -- --domain=your-real-domain.com");
      process.exit(1);
    }
    const values = {

      NEXT_PUBLIC_SITE_URL: domain ? `https://${domain.toLowerCase()}` : "",
      DELIVERY_ENCRYPTION_KEY: randomBytes(32).toString("base64"),
      INTERNAL_API_SECRET: randomBytes(32).toString("hex"),
      CRON_SECRET: randomBytes(32).toString("hex"),
      BOT_WEBHOOK_SECRET: randomBytes(32).toString("hex"),
      BOT_BRIDGE_SECRET: randomBytes(32).toString("hex"),
    };
    let template = await readFile(new URL("../.env.example", import.meta.url), "utf8");
    for (const [name, value] of Object.entries(values)) template = template.replace(new RegExp(`^${name}=.*$`, "m"), `${name}="${value}"`);
    if (railway) {
      template = template.replace(/^POSTGRES_PASSWORD=.*\n?/m, "");
      template = "# Railway Variables → Raw Editor. Attach a Volume at /data. SQLite is automatic.\n" + template;
    }
    try {
      await writeFile(new URL(railway ? "../railway-variables.env" : "../.env", import.meta.url), template, {
        flag: "wx",
        mode: 0o600,
      });
      console.log(
        railway
          ? "Created railway-variables.env. Add BOT_TOKEN, then paste the file into Railway Raw Editor. Keep existing keys for an existing deployment."
          : "Created .env with new private secrets. Add your new provider/bot keys on the server. Existing files are never overwritten.",
      );
    } catch {
      console.error("Did not create .env. If it exists, keep its encryption key and edit it on the server.");
      process.exitCode = 1;
    }
  } else if (command === "assets") {
    const mode = process.argv[3];
    if (mode === "extract") {
      const pack = JSON.parse(await readFile("assets.pack.json", "utf8"));
      for (const [name, value] of Object.entries(pack)) {
        if (name.includes("..") || name.startsWith("/")) throw Error("Invalid asset path");
        const path = join("assets-edit", name);
        await mkdir(dirname(path), {recursive: true});
        await writeFile(path, Buffer.from(value, "base64"));
      }
      console.log("Images and animations extracted to assets-edit.");
    } else if (mode === "pack") {
      const pack = {};
      async function walk(dir) {
        for (const entry of await readdir(dir, {withFileTypes: true})) {
          const p = join(dir, entry.name);
          if (entry.isDirectory()) await walk(p);
          else pack[relative("assets-edit", p).replaceAll("\\", "/")] = (await readFile(p)).toString("base64");
        }
      }
      await walk("assets-edit");
      await writeFile("assets.pack.json", JSON.stringify(pack));
      console.log("Asset pack updated. Rebuild Mini App.");
    } else throw Error("Use: node scripts/start.mjs assets extract | pack");
  } else if (command === "audit") {
    async function files(root) {
      const out = [];
      for (const e of await readdir(root, {withFileTypes: true})) {
        const p = join(root, e.name);
        if (e.isDirectory()) out.push(...(await files(p)));
        else out.push(p);
      }
      return out;
    }
    const bundles = await files(".next/static");
    assert(!bundles.some((p) => p.endsWith(".map")), "Public source map found");
    const names = [
      "LZT_TOKEN",
      "SMM_API_KEY",
      "BOT_TOKEN",
      "CRYPTO_PAY_TOKEN",
      "MONO_TOKEN",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "DATABASE_URL",
      "MARKETAPP_API_TOKEN",
      "BOT_BRIDGE_SECRET",
      "BOT_WEBHOOK_SECRET",
      "DELIVERY_ENCRYPTION_KEY",
      "INTERNAL_API_SECRET",
    ];
    for (const p of bundles.filter((p) => p.endsWith(".js"))) {
      const text = await readFile(p, "utf8");
      for (const name of names) {
        const secret = process.env[name];
        if (secret && secret.length >= 16) assert(!text.includes(secret), `${name} found in client bundle ${p}`);
      }
    }
    const publicFiles = await files("public").catch((e) => {
      if (e.code === "ENOENT") return [];
      throw e;
    });
    assert(
      !publicFiles.some((p) => /(?:^|\/)\.env|(?:^|\/)\.git\/|\.(?:sql|prisma|tsx?|map|sqlite|db|zip)$/i.test(p)),
      "Private file in public",
    );
    const packed = Object.keys(JSON.parse(await readFile("assets.pack.json", "utf8")));
    assert(
      !packed.some((p) => /(?:^|\/)\.env|(?:^|\/)\.git\/|\.(?:sql|prisma|tsx?|map|sqlite|db|zip)$/i.test(p)),
      "Private file in asset pack",
    );
    console.log(
      JSON.stringify({
        clientFiles: bundles.length,
        publicFiles: publicFiles.length,
        packedAssets: packed.length,
        noPublicSourceMaps: true,
        configuredSecretValuesChecked: names.filter((name) => process.env[name] && process.env[name].length >= 16).length,
        configuredSecretsAbsent: names.some((name) => process.env[name] && process.env[name].length >= 16) ? true : null,
        noPrivatePublicFiles: true,
      }),
    );
  } else {
    console.error("Use: start.mjs [env|assets|audit]");
    process.exitCode = 1;
  }
}

// Deployment templates are kept here to reduce the distributed file count.
export const deploymentTemplates = {
  "compose.site.yml": "services:\n  site:\n    build:\n      context: .\n      args:\n        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:?Set HTTPS origin}\n    env_file: .env\n    environment:\n      DATA_DIR: /data\n      AUTO_MIGRATE: \"true\"\n      START_COMMERCE_WORKER: \"true\"\n    volumes: [\"legit_data:/data\"]\n    ports: [\"127.0.0.1:3000:3000\"]\n    restart: unless-stopped\nvolumes:\n  legit_data: {}\n",
  "nginx.conf.example": "# Install in nginx http context. Replace domain/certificate paths before nginx -t.\n# Keep the application and SQLite files private; never serve the project folder as root.\nlimit_req_zone $binary_remote_addr zone=legit_api:10m rate=20r/s;\nlimit_req_zone $binary_remote_addr zone=legit_auth:10m rate=10r/m;\nlimit_conn_zone $binary_remote_addr zone=legit_conn:10m;\nserver {\n    listen 80;\n    server_name shop.example.com;\n    return 301 https://shop.example.com$request_uri;\n}\nserver {\n    listen 443 ssl;\n    server_name shop.example.com;\n    ssl_certificate /etc/letsencrypt/live/shop.example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/shop.example.com/privkey.pem;\n    add_header Strict-Transport-Security \"max-age=15552000\" always;\n    client_max_body_size 2m;\n    limit_conn legit_conn 30;\n    location ~* (^/\\.(env|git|svn|hg)|^/(src|prisma|node_modules|backups?)/|^/_next/server/|\\.(sql|sqlite|db|bak|zip|map)$) {\n        return 404;\n    }\n    location ~ ^/api/(auth/|admin/login) {\n        limit_req zone=legit_auth burst=10 nodelay;\n        limit_req_status 429;\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n    location /api/ {\n        limit_req zone=legit_api burst=40 nodelay;\n        limit_req_status 429;\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_read_timeout 130s;\n    }\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_read_timeout 130s;\n        # Do not cache HTML: CSP nonce and authenticated content must remain per request.\n    }\n}\n"
};

// Historical SQL/templates preserved for reference only; never executed by SQLite startup.
export const legacyPostgresArchive = {
  "legacy-postgresql-migrations": {
    "schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum Role {\n  CUSTOMER\n  ADMIN\n}\n\nenum Locale {\n  uk\n  ru\n  en\n}\n\nenum Currency {\n  USD\n  UAH\n  USDT\n}\n\nenum ProductKind {\n  UNIQUE\n  BULK\n  SERVICE\n}\n\nenum FulfillmentMode {\n  INVENTORY\n  PROVIDER\n  MANUAL\n}\n\nenum OrderStatus {\n  PENDING\n  PAID\n  FULFILLING\n  COMPLETED\n  CANCELLED\n  REFUNDED\n  NEEDS_REVIEW\n}\n\nenum Channel {\n  WEB\n  TMA\n  BOT\n}\n\nenum InventoryStatus {\n  AVAILABLE\n  RESERVED\n  SOLD\n  DISABLED\n}\n\nenum FulfillmentStatus {\n  PENDING\n  PROCESSING\n  DELIVERED\n  FAILED\n}\n\nenum TransactionKind {\n  DEPOSIT\n  PURCHASE\n  REFUND\n  ADJUSTMENT\n}\n\nenum TransactionStatus {\n  PENDING\n  POSTED\n  FAILED\n}\n\nenum PaymentProvider {\n  CRYPTO_PAY\n  MONO\n  FONDY\n  STRIPE\n  TELEGRAM_STARS\n}\n\nmodel User {\n  id              String          @id @default(cuid())\n  telegramId      BigInt?         @unique\n  email           String?         @unique\n  emailVerifiedAt DateTime?\n  passwordHash    String?\n  onboardingStartedAt DateTime?\n  onboardingCompletedAt DateTime?\n  lastActiveAt DateTime @default(now())\n  avatarBytes Bytes?\n  avatarUpdatedAt DateTime?\n  displayName     String?\n  locale          Locale          @default(uk)\n  role            Role            @default(CUSTOMER)\n  sessions        UserSession[]\n  payments        PaymentIntent[]\n  adminSessions   AdminSession[]\n  adminAuditLogs  AdminAuditLog[]\n  wallets         Wallet[]\n  orders          Order[]         @relation(\"Buyer\")\n  assignedItems   OrderItem[]     @relation(\"Assignee\")\n  transactions    Transaction[]\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n\n  @@index([role, lastActiveAt])\n}\n\nmodel Wallet {\n  id           String        @id @default(cuid())\n  userId       String\n  user         User          @relation(fields: [userId], references: [id], onDelete: Restrict)\n  currency     Currency\n  balance      Decimal       @default(0) @db.Decimal(20, 6)\n  version      Int           @default(0)\n  transactions Transaction[]\n\n  @@unique([userId, currency])\n}\n\nmodel Category {\n  id           String                @id @default(cuid())\n  slug         String                @unique\n  parentId     String?\n  parent       Category?             @relation(\"Tree\", fields: [parentId], references: [id], onDelete: Restrict)\n  children     Category[]            @relation(\"Tree\")\n  translations CategoryTranslation[]\n  products     Product[]\n  position     Int                   @default(0)\n  active       Boolean               @default(true)\n}\n\nmodel CategoryTranslation {\n  categoryId  String\n  locale      Locale\n  title       String\n  description String?\n  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@id([categoryId, locale])\n}\n\nmodel Product {\n  id                String               @id @default(cuid())\n  slug              String               @unique\n  categoryId        String\n  category          Category             @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n  brandAssetId      String?\n  brandAsset        BrandAsset?          @relation(fields: [brandAssetId], references: [id], onDelete: Restrict)\n  version           Int                  @default(0)\n  verificationGroup String?\n  translations      ProductTranslation[]\n  kind              ProductKind\n  fulfillmentMode   FulfillmentMode\n  price             Decimal              @db.Decimal(20, 6)\n  currency          Currency             @default(USD)\n  imageUrl          String?\n  active            Boolean              @default(false)\n  provider          String?\n  providerProductId String?\n  // Public filter attributes only; never credentials or API tokens.\n  attributes        Json?\n  minQuantity       Int                  @default(1)\n  maxQuantity       Int                  @default(1)\n  inventory         InventoryItem[]\n  orderItems        OrderItem[]\n  createdAt         DateTime             @default(now())\n  updatedAt         DateTime             @updatedAt\n\n  @@unique([provider, providerProductId])\n  @@index([categoryId, active, price])\n}\n\nmodel ProductTranslation {\n  productId   String\n  locale      Locale\n  title       String\n  description String\n  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  @@id([productId, locale])\n}\n\nmodel InventoryItem {\n  id               String          @id @default(cuid())\n  productId        String\n  product          Product         @relation(fields: [productId], references: [id], onDelete: Restrict)\n  status           InventoryStatus @default(AVAILABLE)\n  // Encrypt server-side using a key outside the DB; never expose in catalog DTOs.\n  encryptedPayload String\n  orderItemId      String?\n  orderItem        OrderItem?      @relation(fields: [orderItemId], references: [id], onDelete: Restrict)\n  reservedUntil    DateTime?\n  soldAt           DateTime?\n  createdAt        DateTime        @default(now())\n\n  @@index([productId, status])\n  @@index([status, reservedUntil])\n}\n\nmodel Order {\n  id             String        @id @default(cuid())\n  userId         String\n  user           User          @relation(\"Buyer\", fields: [userId], references: [id], onDelete: Restrict)\n  status         OrderStatus   @default(PENDING)\n  channel        Channel\n  currency       Currency\n  total          Decimal       @db.Decimal(20, 6)\n  // Client retries reuse this key, scoped to the authenticated buyer.\n  idempotencyKey String\n  payments       PaymentIntent[]\n  requestHash    String?\n  items          OrderItem[]\n  transactions   Transaction[]\n  paidAt         DateTime?\n  completedAt    DateTime?\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  @@unique([userId, idempotencyKey])\n  @@index([userId, createdAt])\n  @@index([status, createdAt])\n}\n\nmodel OrderItem {\n  id                String            @id @default(cuid())\n  orderId           String\n  order             Order             @relation(fields: [orderId], references: [id], onDelete: Restrict)\n  productId         String\n  product           Product           @relation(fields: [productId], references: [id], onDelete: Restrict)\n  requestData       Json?\n  fulfillmentJob    FulfillmentJob?\n  titleSnapshot     String\n  quantity          Int\n  lineTotal         Decimal           @default(0) @db.Decimal(20, 6)\n  unitPrice         Decimal           @db.Decimal(20, 6)\n  fulfillmentMode   FulfillmentMode\n  fulfillmentStatus FulfillmentStatus @default(PENDING)\n  provider          String?\n  providerOrderId   String?\n  assignedToId      String?\n  assignedTo        User?             @relation(\"Assignee\", fields: [assignedToId], references: [id], onDelete: Restrict)\n  encryptedDelivery String?\n  deliveredAt       DateTime?\n  inventory         InventoryItem[]\n  smmJob            SmmJob?\n\n  @@unique([provider, providerOrderId])\n  @@index([fulfillmentMode, fulfillmentStatus])\n}\n\nmodel Transaction {\n  id                String            @id @default(cuid())\n  userId            String\n  user              User              @relation(fields: [userId], references: [id], onDelete: Restrict)\n  walletId          String\n  wallet            Wallet            @relation(fields: [walletId], references: [id], onDelete: Restrict)\n  orderId           String?\n  order             Order?            @relation(fields: [orderId], references: [id], onDelete: Restrict)\n  kind              TransactionKind\n  status            TransactionStatus @default(PENDING)\n  // Signed delta: deposits/refunds > 0, purchases < 0. Currency = wallet.currency.\n  amount            Decimal           @db.Decimal(20, 6)\n  idempotencyKey    String            @unique\n  provider          PaymentProvider?\n  providerReference String?\n  postedAt          DateTime?\n  createdAt         DateTime          @default(now())\n\n  @@unique([provider, providerReference])\n  @@index([walletId, createdAt])\n}\n\nenum SmmJobState {\n  QUEUED\n  PREPARING\n  SENDING\n  RUNNING\n  COMPLETED\n  PARTIAL\n  CANCELED\n  FAILED\n  UNKNOWN\n}\n\nmodel SmmJob {\n  id                  String      @id @default(cuid())\n  orderItemId         String      @unique\n  orderItem           OrderItem   @relation(fields: [orderItemId], references: [id], onDelete: Restrict)\n  serviceKey          String\n  providerServiceId   String\n  providerFingerprint String\n  targetLink          String\n  quantity            Int\n  maxCharge           Decimal     @db.Decimal(20, 6)\n  providerCurrency    String\n  providerOrderId     String?     @unique\n  state               SmmJobState @default(QUEUED)\n  attempts            Int         @default(0)\n  runAt               DateTime    @default(now())\n  leaseUntil          DateTime?\n  remaining           Int?\n  lastErrorCode       String?\n  createdAt           DateTime    @default(now())\n  updatedAt           DateTime    @updatedAt\n\n  @@index([state, runAt])\n}\n\nmodel BrandAsset {\n  id        String    @id\n  name      String\n  imageUrl  String\n  pngBytes  Bytes?\n  color     String    @default(\"#a78bfa\")\n  group     String    @default(\"exchange\")\n  sourceUrl String?\n  products  Product[]\n  createdAt DateTime  @default(now())\n}\n\nmodel AdminSession {\n  id        String   @id @default(cuid())\n  tokenHash String   @unique\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  @@index([userId])\n  @@index([expiresAt])\n}\n\nmodel AdminLoginBucket {\n  id        String   @id\n  attempts  Int      @default(0)\n  expiresAt DateTime\n\n  @@index([expiresAt])\n}\n\nmodel AdminAuditLog {\n  id        String   @id @default(cuid())\n  actorId   String\n  actor     User     @relation(fields: [actorId], references: [id], onDelete: Restrict)\n  action    String\n  entityId  String\n  before    Json?\n  after     Json?\n  createdAt DateTime @default(now())\n\n  @@index([entityId, createdAt])\n  @@index([createdAt])\n}\n\nmodel UserSession {\n  id String @id @default(cuid())\n  tokenHash String @unique\n  userId String\n  user User @relation(fields:[userId], references:[id], onDelete:Cascade)\n  channel Channel @default(WEB)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  @@index([userId])\n  @@index([expiresAt])\n}\n\nenum PaymentState {\n  CREATING\n  PENDING\n  PAID\n  FAILED\n  UNKNOWN\n  REFUNDING\n  REFUNDED\n}\nmodel PaymentIntent {\n  id String @id @default(cuid())\n  userId String\n  user User @relation(fields:[userId], references:[id], onDelete:Restrict)\n  orderId String?\n  order Order? @relation(fields:[orderId], references:[id], onDelete:Restrict)\n  provider PaymentProvider\n  purpose String\n  state PaymentState @default(CREATING)\n  walletCurrency Currency\n  creditAmount Decimal @db.Decimal(20,6)\n  expectedAmount String\n  expectedCurrency String\n  providerReference String?\n  chargeId String? @unique\n  preCheckoutId String? @unique\n  paymentUrl String?\n  idempotencyKey String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  @@unique([userId,idempotencyKey])\n  @@unique([provider,providerReference])\n  @@index([state,expiresAt])\n}\nmodel FulfillmentJob {\n  id String @id @default(cuid())\n  orderItemId String @unique\n  orderItem OrderItem @relation(fields:[orderItemId], references:[id], onDelete:Restrict)\n  state SmmJobState @default(QUEUED)\n  attempts Int @default(0)\n  runAt DateTime @default(now())\n  leaseUntil DateTime?\n  lastErrorCode String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  @@index([state,runAt])\n}\nmodel MarketplaceReservation {\n  itemId String @id\n  orderItemId String @unique\n  expiresAt DateTime?\n  createdAt DateTime @default(now())\n}\nmodel Notification {\n  id String @id @default(cuid())\n  telegramId BigInt\n  orderId String?\n  kind String\n  text String\n  deduplicationKey String @unique\n  deliveredAt DateTime?\n  leaseUntil DateTime?\n  attempts Int @default(0)\n  lastErrorCode String?\n  createdAt DateTime @default(now())\n  @@index([deliveredAt,createdAt])\n}\n\nmodel CartHandoff {\n  tokenHash String @id\n  entries Json\n  locale Locale\n  claimedById String?\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  @@index([expiresAt])\n}\n\nmodel ServiceHeartbeat {\n  id            String   @id\n  lastSeenAt    DateTime @default(now())\n  lastSuccessAt DateTime?\n  lastErrorCode String?\n}\n\nmodel NftWalletProof {\n  userId String @id\n  payload String @unique\n  address String?\n  expiresAt DateTime\n  @@index([expiresAt])\n}\nmodel NftPurchase {\n  id String @id @default(cuid())\n  userId String\n  nftAddress String\n  walletAddress String\n  previousOwner String\n  name String\n  baseNano String\n  feeNano String\n  transaction Json\n  state String @default(\"PREPARED\")\n  expiresAt DateTime\n  deliveredAt DateTime?\n  feeTxHash String? @unique\n  deliveryTxHash String? @unique\n  feePendingUntil DateTime?\n  createdAt DateTime @default(now())\n  @@index([userId,createdAt])\n}\n",
    "migrations/migration_lock.toml": "provider = \"postgresql\"\n",
    "migrations/20261005231000_usdt/migration.sql": "ALTER TYPE \"Currency\" ADD VALUE 'USDT';\n",
    "migrations/20261006030000_commerce_checks/migration.sql": "-- Permit only local bundled images or the authenticated-admin PNG storage endpoint.\nALTER TABLE \"BrandAsset\" DROP CONSTRAINT \"BrandAsset_local_image_check\";\nALTER TABLE \"BrandAsset\" ADD CONSTRAINT \"BrandAsset_local_image_check\"\n  CHECK (\"imageUrl\" LIKE '/assets/%' OR (\"imageUrl\" = '/api/assets/brands/' || \"id\" AND \"pngBytes\" IS NOT NULL));\nUPDATE \"OrderItem\" SET \"lineTotal\" = \"unitPrice\" * \"quantity\" WHERE \"lineTotal\" = 0;\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_line_total_check\" CHECK (\"lineTotal\" >= 0);\nALTER TABLE \"PaymentIntent\" ADD CONSTRAINT \"PaymentIntent_credit_check\" CHECK (\"creditAmount\" > 0);\n",
    "migrations/20261006010000_admin/migration.sql": "-- AlterTable\nALTER TABLE \"Product\" ADD COLUMN     \"brandAssetId\" TEXT,\nADD COLUMN     \"verificationGroup\" TEXT,\nADD COLUMN     \"version\" INTEGER NOT NULL DEFAULT 0;\n\n-- CreateTable\nCREATE TABLE \"BrandAsset\" (\n    \"id\" TEXT NOT NULL,\n    \"name\" TEXT NOT NULL,\n    \"imageUrl\" TEXT NOT NULL,\n    \"color\" TEXT NOT NULL DEFAULT '#a78bfa',\n    \"group\" TEXT NOT NULL DEFAULT 'exchange',\n    \"sourceUrl\" TEXT,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"BrandAsset_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"AdminSession\" (\n    \"id\" TEXT NOT NULL,\n    \"tokenHash\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"expiresAt\" TIMESTAMP(3) NOT NULL,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"AdminSession_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"AdminLoginBucket\" (\n    \"id\" TEXT NOT NULL,\n    \"attempts\" INTEGER NOT NULL DEFAULT 0,\n    \"expiresAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"AdminLoginBucket_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"AdminAuditLog\" (\n    \"id\" TEXT NOT NULL,\n    \"actorId\" TEXT NOT NULL,\n    \"action\" TEXT NOT NULL,\n    \"entityId\" TEXT NOT NULL,\n    \"before\" JSONB,\n    \"after\" JSONB,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"AdminAuditLog_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"AdminSession_tokenHash_key\" ON \"AdminSession\"(\"tokenHash\");\n\n-- CreateIndex\nCREATE INDEX \"AdminSession_userId_idx\" ON \"AdminSession\"(\"userId\");\n\n-- CreateIndex\nCREATE INDEX \"AdminSession_expiresAt_idx\" ON \"AdminSession\"(\"expiresAt\");\n\n-- CreateIndex\nCREATE INDEX \"AdminLoginBucket_expiresAt_idx\" ON \"AdminLoginBucket\"(\"expiresAt\");\n\n-- CreateIndex\nCREATE INDEX \"AdminAuditLog_entityId_createdAt_idx\" ON \"AdminAuditLog\"(\"entityId\", \"createdAt\");\n\n-- CreateIndex\nCREATE INDEX \"AdminAuditLog_createdAt_idx\" ON \"AdminAuditLog\"(\"createdAt\");\n\n-- AddForeignKey\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_brandAssetId_fkey\" FOREIGN KEY (\"brandAssetId\") REFERENCES \"BrandAsset\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"AdminSession\" ADD CONSTRAINT \"AdminSession_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"AdminAuditLog\" ADD CONSTRAINT \"AdminAuditLog_actorId_fkey\" FOREIGN KEY (\"actorId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_verification_group_check\" CHECK (\"verificationGroup\" IS NULL OR \"verificationGroup\" IN ('exchange','wallet','other'));\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_version_check\" CHECK (\"version\" >= 0);\nALTER TABLE \"BrandAsset\" ADD CONSTRAINT \"BrandAsset_local_image_check\" CHECK (\"imageUrl\" LIKE '/assets/%');\nALTER TABLE \"BrandAsset\" ADD CONSTRAINT \"BrandAsset_group_check\" CHECK (\"group\" IN ('exchange','wallet','other'));\nALTER TABLE \"AdminLoginBucket\" ADD CONSTRAINT \"AdminLoginBucket_attempts_check\" CHECK (\"attempts\" >= 0);\n",
    "migrations/20261013022000_profile_onboarding/migration.sql": "ALTER TABLE \"User\" ADD COLUMN \"onboardingStartedAt\" TIMESTAMP(3), ADD COLUMN \"onboardingCompletedAt\" TIMESTAMP(3), ADD COLUMN \"avatarBytes\" BYTEA, ADD COLUMN \"avatarUpdatedAt\" TIMESTAMP(3);\n",
    "migrations/20261005220000_initial/migration.sql": "-- CreateEnum\nCREATE TYPE \"Role\" AS ENUM ('CUSTOMER', 'ADMIN');\n\n-- CreateEnum\nCREATE TYPE \"Locale\" AS ENUM ('uk', 'ru', 'en');\n\n-- CreateEnum\nCREATE TYPE \"Currency\" AS ENUM ('USD', 'UAH');\n\n-- CreateEnum\nCREATE TYPE \"ProductKind\" AS ENUM ('UNIQUE', 'BULK', 'SERVICE');\n\n-- CreateEnum\nCREATE TYPE \"FulfillmentMode\" AS ENUM ('INVENTORY', 'PROVIDER', 'MANUAL');\n\n-- CreateEnum\nCREATE TYPE \"OrderStatus\" AS ENUM ('PENDING', 'PAID', 'FULFILLING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'NEEDS_REVIEW');\n\n-- CreateEnum\nCREATE TYPE \"Channel\" AS ENUM ('WEB', 'TMA', 'BOT');\n\n-- CreateEnum\nCREATE TYPE \"InventoryStatus\" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'DISABLED');\n\n-- CreateEnum\nCREATE TYPE \"FulfillmentStatus\" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED');\n\n-- CreateEnum\nCREATE TYPE \"TransactionKind\" AS ENUM ('DEPOSIT', 'PURCHASE', 'REFUND', 'ADJUSTMENT');\n\n-- CreateEnum\nCREATE TYPE \"TransactionStatus\" AS ENUM ('PENDING', 'POSTED', 'FAILED');\n\n-- CreateEnum\nCREATE TYPE \"PaymentProvider\" AS ENUM ('CRYPTO_PAY', 'MONO', 'FONDY', 'STRIPE', 'TELEGRAM_STARS');\n\n-- CreateTable\nCREATE TABLE \"User\" (\n    \"id\" TEXT NOT NULL,\n    \"telegramId\" BIGINT,\n    \"email\" TEXT,\n    \"emailVerifiedAt\" TIMESTAMP(3),\n    \"passwordHash\" TEXT,\n    \"displayName\" TEXT,\n    \"locale\" \"Locale\" NOT NULL DEFAULT 'uk',\n    \"role\" \"Role\" NOT NULL DEFAULT 'CUSTOMER',\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"User_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"Wallet\" (\n    \"id\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"currency\" \"Currency\" NOT NULL,\n    \"balance\" DECIMAL(20,6) NOT NULL DEFAULT 0,\n    \"version\" INTEGER NOT NULL DEFAULT 0,\n\n    CONSTRAINT \"Wallet_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"Category\" (\n    \"id\" TEXT NOT NULL,\n    \"slug\" TEXT NOT NULL,\n    \"parentId\" TEXT,\n    \"position\" INTEGER NOT NULL DEFAULT 0,\n    \"active\" BOOLEAN NOT NULL DEFAULT true,\n\n    CONSTRAINT \"Category_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"CategoryTranslation\" (\n    \"categoryId\" TEXT NOT NULL,\n    \"locale\" \"Locale\" NOT NULL,\n    \"title\" TEXT NOT NULL,\n    \"description\" TEXT,\n\n    CONSTRAINT \"CategoryTranslation_pkey\" PRIMARY KEY (\"categoryId\",\"locale\")\n);\n\n-- CreateTable\nCREATE TABLE \"Product\" (\n    \"id\" TEXT NOT NULL,\n    \"slug\" TEXT NOT NULL,\n    \"categoryId\" TEXT NOT NULL,\n    \"kind\" \"ProductKind\" NOT NULL,\n    \"fulfillmentMode\" \"FulfillmentMode\" NOT NULL,\n    \"price\" DECIMAL(20,6) NOT NULL,\n    \"currency\" \"Currency\" NOT NULL DEFAULT 'USD',\n    \"imageUrl\" TEXT,\n    \"active\" BOOLEAN NOT NULL DEFAULT false,\n    \"provider\" TEXT,\n    \"providerProductId\" TEXT,\n    \"attributes\" JSONB,\n    \"minQuantity\" INTEGER NOT NULL DEFAULT 1,\n    \"maxQuantity\" INTEGER NOT NULL DEFAULT 1,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"Product_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"ProductTranslation\" (\n    \"productId\" TEXT NOT NULL,\n    \"locale\" \"Locale\" NOT NULL,\n    \"title\" TEXT NOT NULL,\n    \"description\" TEXT NOT NULL,\n\n    CONSTRAINT \"ProductTranslation_pkey\" PRIMARY KEY (\"productId\",\"locale\")\n);\n\n-- CreateTable\nCREATE TABLE \"InventoryItem\" (\n    \"id\" TEXT NOT NULL,\n    \"productId\" TEXT NOT NULL,\n    \"status\" \"InventoryStatus\" NOT NULL DEFAULT 'AVAILABLE',\n    \"encryptedPayload\" TEXT NOT NULL,\n    \"orderItemId\" TEXT,\n    \"reservedUntil\" TIMESTAMP(3),\n    \"soldAt\" TIMESTAMP(3),\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"InventoryItem_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"Order\" (\n    \"id\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"status\" \"OrderStatus\" NOT NULL DEFAULT 'PENDING',\n    \"channel\" \"Channel\" NOT NULL,\n    \"currency\" \"Currency\" NOT NULL,\n    \"total\" DECIMAL(20,6) NOT NULL,\n    \"idempotencyKey\" TEXT NOT NULL,\n    \"paidAt\" TIMESTAMP(3),\n    \"completedAt\" TIMESTAMP(3),\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"Order_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"OrderItem\" (\n    \"id\" TEXT NOT NULL,\n    \"orderId\" TEXT NOT NULL,\n    \"productId\" TEXT NOT NULL,\n    \"titleSnapshot\" TEXT NOT NULL,\n    \"quantity\" INTEGER NOT NULL,\n    \"unitPrice\" DECIMAL(20,6) NOT NULL,\n    \"fulfillmentMode\" \"FulfillmentMode\" NOT NULL,\n    \"fulfillmentStatus\" \"FulfillmentStatus\" NOT NULL DEFAULT 'PENDING',\n    \"provider\" TEXT,\n    \"providerOrderId\" TEXT,\n    \"assignedToId\" TEXT,\n    \"encryptedDelivery\" TEXT,\n    \"deliveredAt\" TIMESTAMP(3),\n\n    CONSTRAINT \"OrderItem_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"Transaction\" (\n    \"id\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"walletId\" TEXT NOT NULL,\n    \"orderId\" TEXT,\n    \"kind\" \"TransactionKind\" NOT NULL,\n    \"status\" \"TransactionStatus\" NOT NULL DEFAULT 'PENDING',\n    \"amount\" DECIMAL(20,6) NOT NULL,\n    \"idempotencyKey\" TEXT NOT NULL,\n    \"provider\" \"PaymentProvider\",\n    \"providerReference\" TEXT,\n    \"postedAt\" TIMESTAMP(3),\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"Transaction_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_telegramId_key\" ON \"User\"(\"telegramId\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_email_key\" ON \"User\"(\"email\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Wallet_userId_currency_key\" ON \"Wallet\"(\"userId\", \"currency\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Category_slug_key\" ON \"Category\"(\"slug\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Product_slug_key\" ON \"Product\"(\"slug\");\n\n-- CreateIndex\nCREATE INDEX \"Product_categoryId_active_price_idx\" ON \"Product\"(\"categoryId\", \"active\", \"price\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Product_provider_providerProductId_key\" ON \"Product\"(\"provider\", \"providerProductId\");\n\n-- CreateIndex\nCREATE INDEX \"InventoryItem_productId_status_idx\" ON \"InventoryItem\"(\"productId\", \"status\");\n\n-- CreateIndex\nCREATE INDEX \"InventoryItem_status_reservedUntil_idx\" ON \"InventoryItem\"(\"status\", \"reservedUntil\");\n\n-- CreateIndex\nCREATE INDEX \"Order_userId_createdAt_idx\" ON \"Order\"(\"userId\", \"createdAt\");\n\n-- CreateIndex\nCREATE INDEX \"Order_status_createdAt_idx\" ON \"Order\"(\"status\", \"createdAt\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Order_userId_idempotencyKey_key\" ON \"Order\"(\"userId\", \"idempotencyKey\");\n\n-- CreateIndex\nCREATE INDEX \"OrderItem_fulfillmentMode_fulfillmentStatus_idx\" ON \"OrderItem\"(\"fulfillmentMode\", \"fulfillmentStatus\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"OrderItem_provider_providerOrderId_key\" ON \"OrderItem\"(\"provider\", \"providerOrderId\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Transaction_idempotencyKey_key\" ON \"Transaction\"(\"idempotencyKey\");\n\n-- CreateIndex\nCREATE INDEX \"Transaction_walletId_createdAt_idx\" ON \"Transaction\"(\"walletId\", \"createdAt\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Transaction_provider_providerReference_key\" ON \"Transaction\"(\"provider\", \"providerReference\");\n\n-- AddForeignKey\nALTER TABLE \"Wallet\" ADD CONSTRAINT \"Wallet_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Category\" ADD CONSTRAINT \"Category_parentId_fkey\" FOREIGN KEY (\"parentId\") REFERENCES \"Category\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"CategoryTranslation\" ADD CONSTRAINT \"CategoryTranslation_categoryId_fkey\" FOREIGN KEY (\"categoryId\") REFERENCES \"Category\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_categoryId_fkey\" FOREIGN KEY (\"categoryId\") REFERENCES \"Category\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"ProductTranslation\" ADD CONSTRAINT \"ProductTranslation_productId_fkey\" FOREIGN KEY (\"productId\") REFERENCES \"Product\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"InventoryItem\" ADD CONSTRAINT \"InventoryItem_productId_fkey\" FOREIGN KEY (\"productId\") REFERENCES \"Product\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"InventoryItem\" ADD CONSTRAINT \"InventoryItem_orderItemId_fkey\" FOREIGN KEY (\"orderItemId\") REFERENCES \"OrderItem\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Order\" ADD CONSTRAINT \"Order_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_orderId_fkey\" FOREIGN KEY (\"orderId\") REFERENCES \"Order\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_productId_fkey\" FOREIGN KEY (\"productId\") REFERENCES \"Product\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_assignedToId_fkey\" FOREIGN KEY (\"assignedToId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Transaction\" ADD CONSTRAINT \"Transaction_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Transaction\" ADD CONSTRAINT \"Transaction_walletId_fkey\" FOREIGN KEY (\"walletId\") REFERENCES \"Wallet\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"Transaction\" ADD CONSTRAINT \"Transaction_orderId_fkey\" FOREIGN KEY (\"orderId\") REFERENCES \"Order\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n\n-- Domain checks complement the Prisma relation model.\nALTER TABLE \"User\" ADD CONSTRAINT \"User_identity_check\"\n  CHECK (\"telegramId\" IS NOT NULL OR \"email\" IS NOT NULL);\nALTER TABLE \"User\" ADD CONSTRAINT \"User_email_normalized_check\"\n  CHECK (\"email\" IS NULL OR (\"email\" = lower(trim(\"email\")) AND length(\"email\") > 3));\nALTER TABLE \"Wallet\" ADD CONSTRAINT \"Wallet_balance_check\" CHECK (\"balance\" >= 0);\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_price_check\" CHECK (\"price\" >= 0);\nALTER TABLE \"Product\" ADD CONSTRAINT \"Product_quantity_check\"\n  CHECK (\"minQuantity\" > 0 AND \"maxQuantity\" >= \"minQuantity\"\n    AND (\"kind\" <> 'UNIQUE' OR (\"minQuantity\" = 1 AND \"maxQuantity\" = 1)));\nALTER TABLE \"Order\" ADD CONSTRAINT \"Order_total_check\" CHECK (\"total\" >= 0);\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_quantity_check\" CHECK (\"quantity\" > 0);\nALTER TABLE \"OrderItem\" ADD CONSTRAINT \"OrderItem_price_check\" CHECK (\"unitPrice\" >= 0);\nALTER TABLE \"Transaction\" ADD CONSTRAINT \"Transaction_amount_check\"\n  CHECK ((\"kind\" IN ('DEPOSIT', 'REFUND') AND \"amount\" > 0)\n    OR (\"kind\" = 'PURCHASE' AND \"amount\" < 0)\n    OR (\"kind\" = 'ADJUSTMENT' AND \"amount\" <> 0));\nALTER TABLE \"InventoryItem\" ADD CONSTRAINT \"InventoryItem_assignment_check\"\n  CHECK ((\"status\" = 'RESERVED' AND \"orderItemId\" IS NOT NULL AND \"reservedUntil\" IS NOT NULL)\n    OR (\"status\" = 'SOLD' AND \"orderItemId\" IS NOT NULL AND \"soldAt\" IS NOT NULL)\n    OR (\"status\" IN ('AVAILABLE', 'DISABLED') AND \"orderItemId\" IS NULL));\n",
    "migrations/20261013045000_nft_checkout/migration.sql": "CREATE TABLE \"NftWalletProof\" (\"userId\" TEXT PRIMARY KEY,\"payload\" TEXT NOT NULL,\"address\" TEXT,\"expiresAt\" TIMESTAMP(3) NOT NULL);\nCREATE UNIQUE INDEX \"NftWalletProof_payload_key\" ON \"NftWalletProof\"(\"payload\");\nCREATE TABLE \"NftPurchase\" (\"id\" TEXT PRIMARY KEY,\"userId\" TEXT NOT NULL,\"nftAddress\" TEXT NOT NULL,\"walletAddress\" TEXT NOT NULL,\"previousOwner\" TEXT NOT NULL,\"name\" TEXT NOT NULL,\"baseNano\" TEXT NOT NULL,\"feeNano\" TEXT NOT NULL,\"transaction\" JSONB NOT NULL,\"state\" TEXT NOT NULL DEFAULT 'PREPARED',\"expiresAt\" TIMESTAMP(3) NOT NULL,\"deliveredAt\" TIMESTAMP(3),\"feeTxHash\" TEXT,\"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\nCREATE UNIQUE INDEX \"NftPurchase_feeTxHash_key\" ON \"NftPurchase\"(\"feeTxHash\");\nCREATE INDEX \"NftPurchase_userId_createdAt_idx\" ON \"NftPurchase\"(\"userId\",\"createdAt\");\n\nALTER TABLE \"NftPurchase\" ADD COLUMN \"deliveryTxHash\" TEXT, ADD COLUMN \"feePendingUntil\" TIMESTAMP(3);\nCREATE UNIQUE INDEX \"NftPurchase_deliveryTxHash_key\" ON \"NftPurchase\"(\"deliveryTxHash\");\n",
    "migrations/20261006131500_handoff/migration.sql": "CREATE TABLE \"CartHandoff\" (\n \"tokenHash\" TEXT NOT NULL PRIMARY KEY,\n \"entries\" JSONB NOT NULL,\n \"locale\" \"Locale\" NOT NULL,\n \"claimedById\" TEXT,\n \"expiresAt\" TIMESTAMP(3) NOT NULL,\n \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\nCREATE INDEX \"CartHandoff_expiresAt_idx\" ON \"CartHandoff\"(\"expiresAt\");\n",
    "migrations/20261006020000_commerce/migration.sql": "-- CreateEnum\nCREATE TYPE \"PaymentState\" AS ENUM ('CREATING', 'PENDING', 'PAID', 'FAILED', 'UNKNOWN', 'REFUNDING', 'REFUNDED');\n\n-- AlterTable\nALTER TABLE \"Order\" ADD COLUMN     \"requestHash\" TEXT;\n\n-- AlterTable\nALTER TABLE \"OrderItem\" ADD COLUMN     \"lineTotal\" DECIMAL(20,6) NOT NULL DEFAULT 0,\nADD COLUMN     \"requestData\" JSONB;\n\n-- AlterTable\nALTER TABLE \"BrandAsset\" ADD COLUMN     \"pngBytes\" BYTEA;\n\n-- CreateTable\nCREATE TABLE \"UserSession\" (\n    \"id\" TEXT NOT NULL,\n    \"tokenHash\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"channel\" \"Channel\" NOT NULL DEFAULT 'WEB',\n    \"expiresAt\" TIMESTAMP(3) NOT NULL,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"UserSession_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"PaymentIntent\" (\n    \"id\" TEXT NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"orderId\" TEXT,\n    \"provider\" \"PaymentProvider\" NOT NULL,\n    \"purpose\" TEXT NOT NULL,\n    \"state\" \"PaymentState\" NOT NULL DEFAULT 'CREATING',\n    \"walletCurrency\" \"Currency\" NOT NULL,\n    \"creditAmount\" DECIMAL(20,6) NOT NULL,\n    \"expectedAmount\" TEXT NOT NULL,\n    \"expectedCurrency\" TEXT NOT NULL,\n    \"providerReference\" TEXT,\n    \"chargeId\" TEXT,\n    \"preCheckoutId\" TEXT,\n    \"paymentUrl\" TEXT,\n    \"idempotencyKey\" TEXT NOT NULL,\n    \"expiresAt\" TIMESTAMP(3) NOT NULL,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"PaymentIntent_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"FulfillmentJob\" (\n    \"id\" TEXT NOT NULL,\n    \"orderItemId\" TEXT NOT NULL,\n    \"state\" \"SmmJobState\" NOT NULL DEFAULT 'QUEUED',\n    \"attempts\" INTEGER NOT NULL DEFAULT 0,\n    \"runAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"leaseUntil\" TIMESTAMP(3),\n    \"lastErrorCode\" TEXT,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"FulfillmentJob_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateTable\nCREATE TABLE \"MarketplaceReservation\" (\n    \"itemId\" TEXT NOT NULL,\n    \"orderItemId\" TEXT NOT NULL,\n    \"expiresAt\" TIMESTAMP(3),\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"MarketplaceReservation_pkey\" PRIMARY KEY (\"itemId\")\n);\n\n-- CreateTable\nCREATE TABLE \"Notification\" (\n    \"id\" TEXT NOT NULL,\n    \"telegramId\" BIGINT NOT NULL,\n    \"orderId\" TEXT,\n    \"kind\" TEXT NOT NULL,\n    \"text\" TEXT NOT NULL,\n    \"deduplicationKey\" TEXT NOT NULL,\n    \"deliveredAt\" TIMESTAMP(3),\n    \"leaseUntil\" TIMESTAMP(3),\n    \"attempts\" INTEGER NOT NULL DEFAULT 0,\n    \"lastErrorCode\" TEXT,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n\n    CONSTRAINT \"Notification_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"UserSession_tokenHash_key\" ON \"UserSession\"(\"tokenHash\");\n\n-- CreateIndex\nCREATE INDEX \"UserSession_userId_idx\" ON \"UserSession\"(\"userId\");\n\n-- CreateIndex\nCREATE INDEX \"UserSession_expiresAt_idx\" ON \"UserSession\"(\"expiresAt\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"PaymentIntent_chargeId_key\" ON \"PaymentIntent\"(\"chargeId\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"PaymentIntent_preCheckoutId_key\" ON \"PaymentIntent\"(\"preCheckoutId\");\n\n-- CreateIndex\nCREATE INDEX \"PaymentIntent_state_expiresAt_idx\" ON \"PaymentIntent\"(\"state\", \"expiresAt\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"PaymentIntent_userId_idempotencyKey_key\" ON \"PaymentIntent\"(\"userId\", \"idempotencyKey\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"PaymentIntent_provider_providerReference_key\" ON \"PaymentIntent\"(\"provider\", \"providerReference\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"FulfillmentJob_orderItemId_key\" ON \"FulfillmentJob\"(\"orderItemId\");\n\n-- CreateIndex\nCREATE INDEX \"FulfillmentJob_state_runAt_idx\" ON \"FulfillmentJob\"(\"state\", \"runAt\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"MarketplaceReservation_orderItemId_key\" ON \"MarketplaceReservation\"(\"orderItemId\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"Notification_deduplicationKey_key\" ON \"Notification\"(\"deduplicationKey\");\n\n-- CreateIndex\nCREATE INDEX \"Notification_deliveredAt_createdAt_idx\" ON \"Notification\"(\"deliveredAt\", \"createdAt\");\n\n-- AddForeignKey\nALTER TABLE \"UserSession\" ADD CONSTRAINT \"UserSession_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"PaymentIntent\" ADD CONSTRAINT \"PaymentIntent_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"PaymentIntent\" ADD CONSTRAINT \"PaymentIntent_orderId_fkey\" FOREIGN KEY (\"orderId\") REFERENCES \"Order\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n-- AddForeignKey\nALTER TABLE \"FulfillmentJob\" ADD CONSTRAINT \"FulfillmentJob_orderItemId_fkey\" FOREIGN KEY (\"orderItemId\") REFERENCES \"OrderItem\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n",
    "migrations/20261015010000_temporary_retention/migration.sql": "-- Existing accounts receive a fresh grace period when upgrading.\nALTER TABLE \"User\" ADD COLUMN \"lastActiveAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;\nCREATE INDEX \"User_role_lastActiveAt_idx\" ON \"User\"(\"role\", \"lastActiveAt\");\nCREATE INDEX \"NftWalletProof_expiresAt_idx\" ON \"NftWalletProof\"(\"expiresAt\");\nUPDATE \"User\" SET \"avatarUpdatedAt\" = NULL WHERE \"avatarBytes\" IS NULL;\n",
    "migrations/20261006140000_operations/migration.sql": "CREATE TABLE \"ServiceHeartbeat\" (\n  \"id\" TEXT NOT NULL,\n  \"lastSeenAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  \"lastSuccessAt\" TIMESTAMP(3),\n  \"lastErrorCode\" TEXT,\n  CONSTRAINT \"ServiceHeartbeat_pkey\" PRIMARY KEY (\"id\")\n);\n",
    "migrations/20261006000000_smm/migration.sql": "-- CreateEnum\nCREATE TYPE \"SmmJobState\" AS ENUM ('QUEUED', 'PREPARING', 'SENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'CANCELED', 'FAILED', 'UNKNOWN');\n\n-- CreateTable\nCREATE TABLE \"SmmJob\" (\n    \"id\" TEXT NOT NULL,\n    \"orderItemId\" TEXT NOT NULL,\n    \"serviceKey\" TEXT NOT NULL,\n    \"providerServiceId\" TEXT NOT NULL,\n    \"providerFingerprint\" TEXT NOT NULL,\n    \"targetLink\" TEXT NOT NULL,\n    \"quantity\" INTEGER NOT NULL,\n    \"maxCharge\" DECIMAL(20,6) NOT NULL,\n    \"providerCurrency\" TEXT NOT NULL,\n    \"providerOrderId\" TEXT,\n    \"state\" \"SmmJobState\" NOT NULL DEFAULT 'QUEUED',\n    \"attempts\" INTEGER NOT NULL DEFAULT 0,\n    \"runAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"leaseUntil\" TIMESTAMP(3),\n    \"remaining\" INTEGER,\n    \"lastErrorCode\" TEXT,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" TIMESTAMP(3) NOT NULL,\n\n    CONSTRAINT \"SmmJob_pkey\" PRIMARY KEY (\"id\")\n);\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"SmmJob_orderItemId_key\" ON \"SmmJob\"(\"orderItemId\");\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"SmmJob_providerOrderId_key\" ON \"SmmJob\"(\"providerOrderId\");\n\n-- CreateIndex\nCREATE INDEX \"SmmJob_state_runAt_idx\" ON \"SmmJob\"(\"state\", \"runAt\");\n\n-- AddForeignKey\nALTER TABLE \"SmmJob\" ADD CONSTRAINT \"SmmJob_orderItemId_fkey\" FOREIGN KEY (\"orderItemId\") REFERENCES \"OrderItem\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n\n\nALTER TABLE \"SmmJob\" ADD CONSTRAINT \"SmmJob_positive_quantity\" CHECK (\"quantity\" > 0);\nALTER TABLE \"SmmJob\" ADD CONSTRAINT \"SmmJob_positive_charge\" CHECK (\"maxCharge\" > 0);\nALTER TABLE \"SmmJob\" ADD CONSTRAINT \"SmmJob_nonnegative_remaining\" CHECK (\"remaining\" IS NULL OR \"remaining\" >= 0);\nALTER TABLE \"SmmJob\" ADD CONSTRAINT \"SmmJob_provider_order_required\" CHECK (\"state\" NOT IN ('RUNNING', 'COMPLETED', 'PARTIAL', 'CANCELED') OR \"providerOrderId\" IS NOT NULL);\n"
  },
  "legacy-deploy-templates": {
    "compose.site.yml": "# Site/DB only. Deploy the bot separately with the same INTERNAL_API_SECRET.\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_USER: legit\n      POSTGRES_DB: legit_assets\n      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set a strong POSTGRES_PASSWORD}\n    volumes:\n      - legit_db:/var/lib/postgresql/data\n    networks: [database]\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U legit -d legit_assets\"]\n      interval: 10s\n      timeout: 5s\n      retries: 10\n    restart: unless-stopped\n    # Intentionally no published database port.\n  site:\n    image: legit-assets-site:local\n    build:\n      context: .\n      args:\n        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:?Set canonical HTTPS origin}\n        NEXT_PUBLIC_MINI_APP_NAME: ${NEXT_PUBLIC_MINI_APP_NAME:-}\n        SEO_ENABLED: ${SEO_ENABLED:-false}\n    env_file: .env\n    environment:\n      AUTO_MIGRATE: \"true\"\n      START_COMMERCE_WORKER: \"false\"\n    ports: [\"127.0.0.1:3000:3000\"]\n    networks: [database, outbound]\n    depends_on:\n      db:\n        condition: service_healthy\n    healthcheck:\n      test: [\"CMD\", \"node\", \"-e\", \"fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\"]\n      interval: 30s\n      timeout: 12s\n      start_period: 30s\n      retries: 3\n    restart: unless-stopped\n  worker:\n    image: legit-assets-site:local\n    env_file: .env\n    init: true\n    stop_grace_period: 120s\n    command: [\"node\", \"--import\", \"tsx\", \"--conditions=react-server\", \"--env-file-if-exists=.env\", \"scripts/tools.ts\", \"worker\"]\n    networks: [outbound]\n    depends_on:\n      site:\n        condition: service_healthy\n    restart: unless-stopped\nnetworks:\n  database:\n    internal: true\n  outbound: {}\nvolumes:\n  legit_db: {}\n",
    "nginx.conf.example": "# Install in nginx http context. Replace domain/certificate paths before nginx -t.\n# Keep the application and PostgreSQL on private interfaces; never serve the project folder as root.\nlimit_req_zone $binary_remote_addr zone=legit_api:10m rate=20r/s;\nlimit_req_zone $binary_remote_addr zone=legit_auth:10m rate=10r/m;\nlimit_conn_zone $binary_remote_addr zone=legit_conn:10m;\nserver {\n    listen 80;\n    server_name shop.example.com;\n    return 301 https://shop.example.com$request_uri;\n}\nserver {\n    listen 443 ssl;\n    server_name shop.example.com;\n    ssl_certificate /etc/letsencrypt/live/shop.example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/shop.example.com/privkey.pem;\n    add_header Strict-Transport-Security \"max-age=15552000\" always;\n    client_max_body_size 2m;\n    limit_conn legit_conn 30;\n    location ~* (^/\\.(env|git|svn|hg)|^/(src|prisma|node_modules|backups?)/|^/_next/server/|\\.(sql|sqlite|db|bak|zip|map)$) {\n        return 404;\n    }\n    location ~ ^/api/(auth/|admin/login) {\n        limit_req zone=legit_auth burst=10 nodelay;\n        limit_req_status 429;\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n    location /api/ {\n        limit_req zone=legit_api burst=40 nodelay;\n        limit_req_status 429;\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_read_timeout 130s;\n    }\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host shop.example.com;\n        proxy_set_header X-Forwarded-Proto https;\n        proxy_set_header X-Forwarded-For $remote_addr;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_read_timeout 130s;\n        # Do not cache HTML: CSP nonce and authenticated content must remain per request.\n    }\n}\n"
  }
};
