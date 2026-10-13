import { readFile as readFile, writeFile as writeFile, mkdir as mkdir, readdir as readdir } from "node:fs/promises";
import { join as join, dirname as dirname, relative as relative } from "node:path";
const mode = process.argv[2];
if (mode === 'extract') {
    const pack = JSON.parse(await readFile('assets.pack.json', 'utf8'));
    for (const [name, value] of Object.entries(pack)) {
        if (name.includes('..') || name.startsWith('/'))
            throw Error('Invalid asset path');
        const path = join('assets-edit', name);
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, Buffer.from(value, 'base64'));
    }
    console.log('Images and animations extracted to assets-edit.');
}
else if (mode === 'pack') {
    const pack = {};
    async function walk(dir) { for (const entry of await readdir(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory())
            await walk(p);
        else
            pack[relative('assets-edit', p).replaceAll('\\', '/')] = (await readFile(p)).toString('base64');
    } }
    await walk('assets-edit');
    await writeFile('assets.pack.json', JSON.stringify(pack));
    await writeFile('asset-paths.json', JSON.stringify(Object.keys(pack)));
    console.log('Asset pack updated. Rebuild Mini App.');
}
else
    throw Error('Use: node scripts/assets.mjs extract | pack');
