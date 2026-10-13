import Decimal from "decimal.js";
import { M_lib_db_db as db } from "../src/server.tsx";
import { M_lib_smm_provider_getSupplierServices as getSupplierServices } from "../src/server.tsx";
import { M_lib_smm_definitions_definitions as definitions } from "../src/shared.tsx";
import { M_lib_smm_catalog_smmMarkup as smmMarkup } from "../src/server.tsx";
import { M_lib_pricing_getFx as getFx } from "../src/server.tsx";
import { M_lib_money_quoteRetail as quoteRetail } from "../src/shared.tsx";
async function main() {
    const services = (await getSupplierServices(true)).filter((s) => s.supported);
    if (!services.length)
        throw Error("No approved Default services; no DB changes made.");
    const fx = await getFx();
    // Rates are estimates for display. Checkout must price the entire quantity afresh.
    await db.$transaction(async (tx) => {
        const category = await tx.category.upsert({
            where: { slug: "smm" },
            create: { slug: "smm", position: 3 },
            update: {},
        });
        for (const locale of ["uk", "ru", "en"] as const) {
            await tx.categoryTranslation.upsert({
                where: { categoryId_locale: { categoryId: category.id, locale } },
                create: { categoryId: category.id, locale, title: "SMM" },
                update: { title: "SMM" },
            });
        }
        await tx.product.updateMany({
            where: { provider: "smm-v2" },
            data: { active: false },
        });
        for (const service of services) {
            const def = definitions.find((d) => d.key === service.key);
            const quote = quoteRetail(service.rate, service.currency, fx, smmMarkup());
            const values = {
                categoryId: category.id,
                kind: "SERVICE" as const,
                fulfillmentMode: "PROVIDER" as const,
                price: new Decimal(quote.USDT).div(100000).toFixed(6),
                currency: "USDT" as const,
                provider: "smm-v2",
                providerProductId: service.id,
                minQuantity: service.min,
                maxQuantity: service.max,
                active: true,
                attributes: {
                    platform: service.platform,
                    target: def?.target ?? "link",
                    supplierCategory: service.category,
                    supplierType: service.type,
                    pricingBasis: "per-unit-estimate",
                },
            };
            const product = await tx.product.upsert({
                where: { slug: `smm-${service.key}` },
                create: { slug: `smm-${service.key}`, ...values },
                update: values,
            });
            for (const locale of ["uk", "ru", "en"] as const)
                await tx.productTranslation.upsert({
                    where: { productId_locale: { productId: product.id, locale } },
                    create: {
                        productId: product.id,
                        locale,
                        title: def?.title[locale] ?? service.name,
                        description: "",
                    },
                    update: { title: def?.title[locale] ?? service.name },
                });
        }
    }, { timeout: 600000, maxWait: 10000 });
    console.log(`Synced ${services.length} supported services.`);
}
main()
    .catch(() => {
    console.error("SMM sync failed; check mapping, FX and DB configuration.");
    process.exitCode = 1;
})
    .finally(() => db.$disconnect());
