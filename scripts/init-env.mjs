import { randomBytes as randomBytes } from "node:crypto";
import { readFile as readFile, writeFile as writeFile } from "node:fs/promises";
const domain = process.argv.find((v) => v.startsWith("--domain="))?.slice(9);
const railway = process.argv.includes('--railway');
if ((!domain && !railway) || (domain &&
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain))) {
    console.error("Usage: npm run env:init -- --domain=your-real-domain.com");
    process.exit(1);
}
const password = randomBytes(32).toString("hex");
const values = {
    DATABASE_URL: railway ? '${{Postgres.DATABASE_URL}}' : `postgresql://legit:${password}@db:5432/legit_assets`,
    ...(!railway ? { POSTGRES_PASSWORD: password } : {}),
    NEXT_PUBLIC_SITE_URL: domain ? `https://${domain.toLowerCase()}` : '',
    DELIVERY_ENCRYPTION_KEY: randomBytes(32).toString("base64"),
    INTERNAL_API_SECRET: randomBytes(32).toString("hex"),
    CRON_SECRET: randomBytes(32).toString("hex"),
    BOT_WEBHOOK_SECRET: randomBytes(32).toString("hex"),
    BOT_BRIDGE_SECRET: randomBytes(32).toString("hex"),
};
let template = await readFile(new URL("../.env.example", import.meta.url), "utf8");
for (const [name, value] of Object.entries(values))
    template = template.replace(new RegExp(`^${name}=.*$`, "m"), `${name}="${value}"`);
if (railway) {
    template = template.replace(/^POSTGRES_PASSWORD=.*\n?/m, '');
    template = '# Railway Variables → Raw Editor. PostgreSQL service must be named Postgres.\n' + template;
}
try {
    await writeFile(new URL(railway ? "../railway-variables.env" : "../.env", import.meta.url), template, {
        flag: "wx",
        mode: 0o600,
    });
    console.log(railway ? 'Created railway-variables.env. Add BOT_TOKEN, then paste the file into Railway Raw Editor. Keep existing keys for an existing deployment.' : "Created .env with new private secrets. Add your new provider/bot keys on the server. Existing files are never overwritten.");
}
catch {
    console.error("Did not create .env. If it exists, keep its encryption key and edit it on the server.");
    process.exitCode = 1;
}
