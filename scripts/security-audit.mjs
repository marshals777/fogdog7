import { readdir as readdir, readFile as readFile } from "node:fs/promises";
import { join as join } from "node:path";
import assert from "node:assert/strict";
async function files(root) {
    const out = [];
    for (const e of await readdir(root, { withFileTypes: true })) {
        const p = join(root, e.name);
        if (e.isDirectory())
            out.push(...(await files(p)));
        else
            out.push(p);
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
        if (secret && secret.length >= 16)
            assert(!text.includes(secret), `${name} found in client bundle ${p}`);
    }
}
const publicFiles = await files("public").catch(e=>{if(e.code==="ENOENT")return [];throw e;});
assert(!publicFiles.some((p) => /(?:^|\/)\.env|(?:^|\/)\.git\/|\.(?:sql|prisma|tsx?|map|sqlite|db|zip)$/i.test(p)), "Private file in public");
const packed=Object.keys(JSON.parse(await readFile("assets.pack.json","utf8")));
assert(!packed.some(p=>/(?:^|\/)\.env|(?:^|\/)\.git\/|\.(?:sql|prisma|tsx?|map|sqlite|db|zip)$/i.test(p)),"Private file in asset pack");
console.log(JSON.stringify({
    clientFiles: bundles.length,
    publicFiles: publicFiles.length,
    packedAssets: packed.length,
    noPublicSourceMaps: true,
    configuredSecretValuesChecked: names.filter(name => process.env[name] && process.env[name].length >= 16).length,
    configuredSecretsAbsent: names.some(name => process.env[name] && process.env[name].length >= 16) ? true : null,
    noPrivatePublicFiles: true,
}));
