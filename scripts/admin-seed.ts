import { M_lib_db_db as db } from "../src/server.tsx";
import assets from "../src/data/brand-assets.json";
import catalog from "../src/data/catalog.json";
import { M_lib_verification_copy_verificationBrands as verificationBrands } from "../src/shared.tsx";
async function main() {
    for (const asset of assets)
        await db.brandAsset.upsert({
            where: { id: asset.id },
            create: asset,
            update: {},
        });
    const category = await db.category.upsert({
        where: { slug: "verifications" },
        create: { slug: "verifications", position: 4 },
        update: {},
    });
    for (const locale of ["uk", "ru", "en"] as const)
        await db.categoryTranslation.upsert({
            where: { categoryId_locale: { categoryId: category.id, locale } },
            create: {
                categoryId: category.id,
                locale,
                title: locale === "uk"
                    ? "Верифікації"
                    : locale === "ru"
                        ? "Верификации"
                        : "Verifications",
            },
            update: {},
        });
    for (const p of catalog.filter((p) => p.category === "verifications")) {
        const brand = verificationBrands[p.id];
        const asset = assets.find((a) => a.imageUrl === p.imageUrl && p.imageUrl);
        await db.product.upsert({
            where: { id: p.id },
            create: {
                id: p.id,
                slug: "verification-" + p.id.replace(/^vr_/, "").replaceAll("_", "-"),
                categoryId: category.id,
                kind: "SERVICE",
                fulfillmentMode: "MANUAL",
                price: (p.amountMinor / 100).toFixed(2),
                currency: "USD",
                minQuantity: 1,
                maxQuantity: 1,
                verificationGroup: brand?.group ?? "other",
                brandAssetId: asset?.id ?? null,
                imageUrl: asset?.imageUrl ?? null,
                active: true,
                translations: {
                    create: (["uk", "ru", "en"] as const).map((locale) => ({
                        locale,
                        title: p.title[locale],
                        description: "",
                    })),
                },
            },
            update: {},
        });
    }
    console.log(`Imported ${assets.length} logo records; seeded existing services without overwriting edits.`);
}
main()
    .catch(() => {
    console.error("Admin seed failed; check database and migrations.");
    process.exitCode = 1;
})
    .finally(() => db.$disconnect());
