// One entry point for background processing and database maintenance.
const command = process.argv[2];

// commerce-worker.ts
if (command === "worker") {
  let origin: URL;

  try {
    origin = new URL(
      process.env.COMMERCE_WORKER_ORIGIN ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "",
    );
  } catch {
    throw Error("Set a valid HTTPS site origin before starting worker.");
  }

  const secret = process.env.INTERNAL_API_SECRET ?? "";

  const local = origin.protocol === "http:" && origin.hostname === "127.0.0.1";

  if (
    (!local && origin.protocol !== "https:") ||
    origin.username ||
    origin.password ||
    secret.length < 32
  )
    throw Error(
      "Set HTTPS site origin and INTERNAL_API_SECRET before starting worker.",
    );

  let stopped = false;

  const stop = () => {
    stopped = true;
  };

  process.on("SIGTERM", stop);

  process.on("SIGINT", stop);

  while (!stopped) {
    try {
      const response = await fetch(
        new URL("/api/internal/commerce/tick", origin.origin),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
          },
          body: "{}",
          redirect: "error",
          signal: AbortSignal.timeout(110000),
        },
      );
      await response.body?.cancel();
      console.log(
        JSON.stringify({
          time: new Date().toISOString(),
          ok: response.ok,
          status: response.status,
        }),
      );
    } catch {
      console.error(
        JSON.stringify({
          time: new Date().toISOString(),
          ok: false,
          code: "worker_transport",
        }),
      );
    }
    if (!stopped)
      await new Promise<void>((resolve) => {
        const timer = setTimeout(done, 15000);
        function done() {
          clearTimeout(timer);
          process.off("SIGTERM", done);
          process.off("SIGINT", done);
          resolve();
        }
        process.once("SIGTERM", done);
        process.once("SIGINT", done);
      });
  }
}

// admin-seed.ts
if (command === "admin-seed") {
  const { M_lib_db_db: db } = await import("../src/server.tsx");
  const __data_assets = (await import("../src/data.json")).default;
  const __data_catalog = (await import("../src/data.json")).default;
  const { M_lib_verification_copy_verificationBrands: verificationBrands } =
    await import("../src/shared.tsx");

  const assets = __data_assets["brand-assets"];

  const catalog = __data_catalog["catalog"];

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
          title:
            locale === "uk"
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
    console.log(
      `Imported ${assets.length} logo records; seeded existing services without overwriting edits.`,
    );
  }

  await main()
    .catch(() => {
      console.error("Admin seed failed; check database and migrations.");
      process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
}

// preflight.ts
if (command === "preflight") {
  const { M_lib_operations_readiness_readiness: readiness } =
    await import("../src/server.tsx");
  const { M_lib_db_db: db } = await import("../src/server.tsx");

  try {
    const report = await readiness();
    console.log(JSON.stringify(report, null, 2));
    if (
      !report.configurationReady ||
      (process.argv.includes("--strict") && report.checks.some((c) => !c.ok))
    )
      process.exitCode = 1;
  } catch {
    console.error(
      "Preflight unavailable. Check server configuration and migrations.",
    );
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}

// smm-sync.ts
if (command === "smm-sync") {
  const Decimal = (await import("decimal.js")).default;
  const { M_lib_db_db: db } = await import("../src/server.tsx");
  const { M_lib_smm_provider_getSupplierServices: getSupplierServices } =
    await import("../src/server.tsx");
  const { M_lib_smm_definitions_definitions: definitions } =
    await import("../src/shared.tsx");
  const { M_lib_smm_catalog_smmMarkup: smmMarkup } =
    await import("../src/server.tsx");
  const { M_lib_pricing_getFx: getFx } = await import("../src/server.tsx");
  const { M_lib_money_quoteRetail: quoteRetail } =
    await import("../src/shared.tsx");

  async function main() {
    const services = (await getSupplierServices(true)).filter(
      (s) => s.supported,
    );
    if (!services.length)
      throw Error("No approved Default services; no DB changes made.");
    const fx = await getFx();
    // Rates are estimates for display. Checkout must price the entire quantity afresh.
    await db.$transaction(
      async (tx) => {
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
          const quote = quoteRetail(
            service.rate,
            service.currency,
            fx,
            smmMarkup(),
          );
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
      },
      { timeout: 600000, maxWait: 10000 },
    );
    console.log(`Synced ${services.length} supported services.`);
  }

  await main()
    .catch(() => {
      console.error("SMM sync failed; check mapping, FX and DB configuration.");
      process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
}

if (
  !["worker", "admin-seed", "preflight", "smm-sync"].includes(command || "")
) {
  console.error("Use: scripts/tools.ts worker|admin-seed|preflight|smm-sync");
  process.exitCode = 1;
}
export {};
