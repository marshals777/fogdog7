import rootTest from "node:test";
// Original suites remain named; each assertion is preserved.

await rootTest("admin.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_admin_crypto_hashPassword: hashPassword,
      M_lib_admin_crypto_verifyPassword: verifyPassword,
      M_lib_admin_crypto_newSessionToken: newSessionToken,
      M_lib_admin_crypto_sessionHash: sessionHash,
      M_lib_admin_crypto_validToken: validToken,
    } = await import("../src/server.tsx");
    const {
      M_lib_admin_validation_parseProduct: parseProduct,
      M_lib_admin_validation_checkOrigin: checkOrigin,
    } = await import("../src/server.tsx");

    const valid = {
      slug: "coinbase",
      title: { uk: "Coinbase", ru: "Coinbase", en: "Coinbase" },
      price: "10.25",
      currency: "USD",
      logoId: "cg-gdax",
      group: "exchange",
      active: false,
      version: 0,
    };

    test("admin password is salted; invalid passwords and malformed hashes fail", async () => {
      const p = "fixture-strong-password-4820";
      const a = await hashPassword(p),
        b = await hashPassword(p);
      assert.notEqual(a, b);
      assert(!a.includes(p));
      assert(await verifyPassword(p, a));
      assert.equal(await verifyPassword(p + "x", a), false);
      assert.equal(await verifyPassword(p, null), false);
      assert.equal(await verifyPassword(p, "bad"), false);
      await assert.rejects(hashPassword("short"));
    });

    test("opaque admin sessions use random tokens and one-way hashes", () => {
      const a = newSessionToken(),
        b = newSessionToken();
      assert(validToken(a));
      assert.notEqual(a, b);
      assert.notEqual(sessionHash(a), a);
      assert.equal(validToken("ADMIN"), false);
      assert.equal(validToken({ role: "ADMIN" }), false);
    });

    test("admin input rejects privilege fields, external images, invalid money and stale-version omission", () => {
      assert.equal(parseProduct(valid, true).price, "10.25");
      for (const patch of [
        { role: "ADMIN" },
        { imageUrl: "https://evil.invalid/a.png" },
        { price: "-10" },
        { price: "NaN" },
        { price: "1e2" },
        { price: "0" },
        { price: "10.123" },
        { title: { uk: "x" } },
        { active: "true" },
        { logoId: "../secret" },
        { version: -1 },
      ]) {
        assert.throws(() =>
          parseProduct({ ...valid, ...patch }, patch.version === undefined),
        );
      }
      assert.throws(() =>
        parseProduct({ ...valid, version: undefined }, false),
      );
    });

    test("mutations require configured same-origin requests", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://shop.fixture.invalid";
      assert.doesNotThrow(() =>
        checkOrigin(new Headers({ Origin: "https://shop.fixture.invalid" })),
      );
      for (const origin of [
        "https://evil.invalid",
        "null",
        "https://shop.fixture.invalid.evil.test",
      ])
        assert.throws(() => checkOrigin(new Headers({ Origin: origin })));
      assert.throws(() => checkOrigin(new Headers()));
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("assets-runtime.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const { readFile: readFile } = await import("node:fs/promises");
    const { M_app_api_static_____path__route_GET: asset } =
      await import("../src/server.tsx");

    test("Packed assets preserve bytes and expose only registered public paths with ETags", async () => {
      const pack = JSON.parse(await readFile("assets.pack.json", "utf8"));
      const key = "wallet-icon.png";
      assert.ok(pack[key]);
      const request = new Request("https://fixture.test/api/static/" + key);
      const response = await asset(request, {
        params: Promise.resolve({ path: [key] }),
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("Content-Type"), "image/png");
      assert.deepEqual(
        Buffer.from(await response.arrayBuffer()),
        Buffer.from(pack[key], "base64"),
      );
      const cached = await asset(
        new Request(request.url, {
          headers: { "If-None-Match": response.headers.get("etag") },
        }),
        { params: Promise.resolve({ path: [key] }) },
      );
      assert.equal(cached.status, 304);
      for (const path of [
        ["..", "package.json"],
        ["__proto__"],
        ["assets.pack.json"],
      ])
        assert.equal(
          (await asset(request, { params: Promise.resolve({ path }) })).status,
          404,
        );
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("catalog-audit.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_admin_commerce_validation_adminPage: adminPage,
      M_lib_admin_commerce_validation_parseCommerceProduct:
        parseCommerceProduct,
    } = await import("../src/server.tsx");
    const { M_lib_admin_validation_readJson: readJson } =
      await import("../src/server.tsx");
    const { M_lib_smm_catalog_smmCatalogPage: smmCatalogPage } =
      await import("../src/server.tsx");
    const { M_lib_money_scaleMinorPreview: scaleMinorPreview } =
      await import("../src/shared.tsx");
    const { M_lib_smm_provider_getSupplierStatus: getSupplierStatus } =
      await import("../src/server.tsx");

    const product = {
      slug: "test-service",
      price: "0.000001",
      currency: "USD",
      category: "smm",
      mode: "MANUAL",
      active: false,
      titles: { uk: "Послуга", ru: "Услуга", en: "Service" },
    };

    test("commerce editor validates all locales, permissions, booleans and optimistic versions", () => {
      assert.equal(parseCommerceProduct(product).titles.uk, "Послуга");
      for (const patch of [
        { active: "true" },
        { role: "ADMIN" },
        { mode: "PROVIDER" },
        { price: "NaN" },
        { price: "0" },
        { titles: { uk: "Only" } },
        { id: "existing", version: "1" },
        { id: "existing", version: -1 },
      ])
        assert.throws(() => parseCommerceProduct({ ...product, ...patch }));
      assert.equal(
        parseCommerceProduct({ ...product, id: "existing", version: 1 })
          .version,
        1,
      );
    });

    test("admin pagination rejects non-finite and fractional database offsets", () => {
      for (const value of ["NaN", "Infinity", "-1", "0", null])
        assert.equal(adminPage(value), 1);
      assert.equal(adminPage("2.5"), 2);
      assert.equal(adminPage("100001"), 10000);
    });

    test("admin JSON enforces byte limits on streaming and multibyte bodies", async () => {
      const request = new Request("https://fixture.invalid", {
        method: "POST",
        body: JSON.stringify({ title: "я".repeat(5000) }),
      });
      await assert.rejects(
        readJson(request),
        (e) => e.code === "invalid_input",
      );
      assert.deepEqual(
        await readJson(
          new Request("https://fixture.invalid", {
            method: "POST",
            body: '{"ok":true}',
          }),
        ),
        { ok: true },
      );
    });

    test("SMM preview search supports Ukrainian and Russian titles", async () => {
      delete process.env.SMM_API_KEY;
      const uk = await smmCatalogPage({ q: "підпис" });
      assert.ok(uk.services.length > 0);
      assert.ok(
        uk.services.every((s) => s.title.uk.toLowerCase().includes("підпис")),
      );
      const ru = await smmCatalogPage({ q: "подпис" });
      assert.ok(ru.services.length > 0);
    });

    test("SMM preview prices use exact minor-unit scaling", () => {
      assert.deepEqual(scaleMinorPreview({ UAH: 7, USDT: 1 }, 333), {
        UAH: 3,
        USDT: 1,
      });
      assert.deepEqual(
        scaleMinorPreview({ UAH: 999999999999, USDT: 1 }, 1000),
        { UAH: 999999999999, USDT: 1 },
      );
      for (const q of [0, NaN, 1.5, 100000000000])
        assert.throws(() =>
          scaleMinorPreview({ UAH: 999999999999, USDT: 1 }, q),
        );
    });

    test("missing supplier remaining quantity is never invented as zero", async () => {
      const old = globalThis.fetch;
      process.env.SMM_API_URL = "https://fixture.invalid/api/v2";
      process.env.SMM_API_KEY = "fixture-only";
      try {
        for (const remains of [null, undefined, "", "  "]) {
          globalThis.fetch = async () =>
            Response.json({ status: "Completed", remains });
          assert.equal((await getSupplierStatus("123")).remaining, null);
        }
      } finally {
        globalThis.fetch = old;
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("commerce-security.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      createHash: createHash,
      createHmac: createHmac,
      generateKeyPairSync: generateKeyPairSync,
      sign: sign,
    } = await import("node:crypto");
    const {
      M_lib_auth_telegram_verifyInitData: verifyInitData,
      M_lib_auth_telegram_verifyWidget: verifyWidget,
    } = await import("../src/server.tsx");
    const {
      M_lib_commerce_signatures_cryptoSignature: cryptoSignature,
      M_lib_commerce_signatures_stripeSignature: stripeSignature,
      M_lib_commerce_signatures_monoSignature: monoSignature,
    } = await import("../src/server.tsx");
    const {
      M_lib_commerce_encryption_encrypt: encrypt,
      M_lib_commerce_encryption_decrypt: decrypt,
    } = await import("../src/server.tsx");
    const { M_lib_commerce_checkout_parseCart: parseCart } =
      await import("../src/server.tsx");

    process.env.BOT_TOKEN = "123456:fixture-token-only";

    process.env.DELIVERY_ENCRYPTION_KEY = Buffer.alloc(32, 17).toString(
      "base64",
    );

    function init(overrides = {}) {
      const p = new URLSearchParams({
        auth_date: String(Math.floor(Date.now() / 1000)),
        user: JSON.stringify({ id: 987654321, first_name: "Buyer" }),
        ...overrides,
      });
      const s = [...p]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      const key = createHmac("sha256", "WebAppData")
        .update(process.env.BOT_TOKEN)
        .digest();
      p.set("hash", createHmac("sha256", key).update(s).digest("hex"));
      return p.toString();
    }

    test("Telegram authentication checks HMAC, freshness, duplicate fields and identity", () => {
      assert.equal(verifyInitData(init()).telegramId, 987654321n);
      assert.throws(() => verifyInitData(init() + "&user=%7B%22id%22%3A1%7D"));
      assert.throws(() => verifyInitData(init({ auth_date: "1" })));
      assert.throws(() => verifyInitData(init().replace("Buyer", "Admin")));
      assert.throws(() =>
        verifyInitData(init({ user: JSON.stringify({ id: -1 }) })),
      );
      const d = {
        id: 1234,
        first_name: "Buyer",
        auth_date: Math.floor(Date.now() / 1000),
      };
      const check = Object.entries(d)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      const hash = createHmac(
        "sha256",
        createHash("sha256").update(process.env.BOT_TOKEN).digest(),
      )
        .update(check)
        .digest("hex");
      assert.equal(verifyWidget({ ...d, hash }).telegramId, 1234n);
      assert.throws(() => verifyWidget({ ...d, id: 999, hash }));
    });

    test("payment signatures authenticate exact bytes and Stripe timestamps", () => {
      const raw = '{"amount":100}',
        token = "fixture-crypto-token",
        key = createHash("sha256").update(token).digest(),
        signature = createHmac("sha256", key).update(raw).digest("hex");
      assert(cryptoSignature(raw, signature, token));
      assert(!cryptoSignature(raw + " ", signature, token));
      assert(!cryptoSignature(raw, signature, ""));
      const t = Math.floor(Date.now() / 1000),
        secret = "fixture-stripe-secret",
        v = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
      assert(stripeSignature(raw, `t=${t},v1=${v}`, secret));
      assert(
        !stripeSignature(raw, `t=${t},v1=${v}`, secret, Date.now() + 601000),
      );
      const { publicKey, privateKey } = generateKeyPairSync("ec", {
        namedCurve: "prime256v1",
      });
      const pub = publicKey.export({ type: "spki", format: "pem" }).toString();
      const signed = sign("sha256", Buffer.from(raw), privateKey).toString(
        "base64",
      );
      assert(monoSignature(raw, signed, Buffer.from(pub).toString("base64")));
      assert(
        !monoSignature(raw + " ", signed, Buffer.from(pub).toString("base64")),
      );
    });

    test("encrypted delivery is bound to its order item and rejects corruption", () => {
      const stored = encrypt("login:secret", "delivery:one");
      assert(!stored.includes("secret"));
      assert.equal(decrypt(stored, "delivery:one"), "login:secret");
      assert.throws(() => decrypt(stored, "delivery:two"));
      const parts = stored.split(".");
      parts[3] = "AAAA";
      assert.throws(() => decrypt(parts.join("."), "delivery:one"));
    });

    test("cart validates limits and duplicate entries before touching money", () => {
      assert.deepEqual(
        parseCart([
          { kind: "market", id: "42", quantity: 1, price: 0, role: "ADMIN" },
        ]),
        [{ kind: "market", id: "42", quantity: 1 }],
      );
      for (const quantity of [-1, 0, 1.5, NaN, "1", 10000001])
        assert.throws(() =>
          parseCart([{ kind: "product", id: "a", quantity }]),
        );
      assert.throws(() =>
        parseCart([
          { kind: "product", id: "a", quantity: 1 },
          { kind: "product", id: "a", quantity: 1 },
        ]),
      );
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("deployment-tools.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      mkdtemp: mkdtemp,
      mkdir: mkdir,
      copyFile: copyFile,
      readFile: readFile,
      rm: rm,
    } = await import("node:fs/promises");
    const { tmpdir: tmpdir } = await import("node:os");
    const { join: join } = await import("node:path");
    const { execFileSync: execFileSync } = await import("node:child_process");
    const { fileURLToPath: fileURLToPath } = await import("node:url");

    test("env setup generates matched private credentials and refuses to overwrite encryption keys", async () => {
      const folder = await mkdtemp(join(tmpdir(), "legit-env-test-"));
      try {
        await mkdir(join(folder, "scripts"));
        await copyFile(
          "scripts/start.mjs",
          join(folder, "scripts/start.mjs"),
        );
        await copyFile(".env.example", join(folder, ".env.example"));
        const args = [
          join(folder, "scripts/start.mjs"), "env", "--domain=shop.fixture.test",
        ];
        execFileSync(process.execPath, args, { stdio: "pipe" });
        const text = await readFile(join(folder, ".env"), "utf8");
        const get = (name) =>
          text.match(new RegExp(`^${name}="([^"]*)"$`, "m"))?.[1];
        assert.equal(get("DATABASE_URL"), undefined);
        assert.equal(get("POSTGRES_PASSWORD"), undefined);
        assert.ok(text.includes("/data"));
        assert.equal(
          Buffer.from(get("DELIVERY_ENCRYPTION_KEY"), "base64").length,
          32,
        );
        assert.equal(get("INTERNAL_API_SECRET").length, 64);
        assert.notEqual(get("INTERNAL_API_SECRET"), get("CRON_SECRET"));
        assert.equal(get("BOT_WEBHOOK_SECRET").length, 64);
        assert.equal(get("BOT_BRIDGE_SECRET").length, 64);
        assert.notEqual(get("BOT_WEBHOOK_SECRET"), get("BOT_BRIDGE_SECRET"));
        assert.throws(() =>
          execFileSync(process.execPath, args, { stdio: "pipe" }),
        );
        assert.equal(await readFile(join(folder, ".env"), "utf8"), text);
      } finally {
        await rm(folder, { recursive: true, force: true });
      }
    });

    test("standalone worker sends an authenticated POST and stops cleanly without logging credentials", () => {
      const url = new URL("../scripts/tools.ts", import.meta.url).href;
      const code = `import assert from 'node:assert/strict';process.env.NEXT_PUBLIC_SITE_URL='https://shop.fixture.test';process.env.INTERNAL_API_SECRET='fixture-secret-abcdefghijklmnopqrstuvwxyz';let calls=0;globalThis.fetch=async(url,options)=>{calls++;assert.equal(String(url),'https://shop.fixture.test/api/internal/commerce/tick');assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert.equal(options.body,'{}');assert.equal(options.headers.Authorization,'Bearer '+process.env.INTERNAL_API_SECRET);process.emit('SIGTERM');return new Response('{}')};process.argv[2]='worker';await import(${JSON.stringify(url)});assert.equal(calls,1);`;
      const output = execFileSync(
        process.execPath,
        ["--import", "tsx", "--input-type=module", "-e", code],
        { encoding: "utf8", timeout: 10000 },
      );
      assert.ok(output.includes('"ok":true'));
      assert.ok(!output.includes("fixture-secret"));
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("launch-config.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_security_launch_config_launchConfiguration: launchConfiguration,
    } = await import("../src/server.tsx");

    const base = {
      ADMIN_ID:"42",
      NEXT_PUBLIC_SITE_URL: "https://shop.fixture.test",
      DATABASE_URL:
        "file:/data/legit.sqlite",
      DELIVERY_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString("base64"),
      INTERNAL_API_SECRET: "x".repeat(32),
      BOT_TOKEN: "123456789:" + "a".repeat(35),
      STARS_USDT_PER_STAR: "0.01",
      MONO_TOKEN: "fixture-only",
      LZT_TOKEN: "fixture-only",
      SMM_API_KEY: "fixture-only",
    };

    test("complete configuration passes required checks, absent configuration fails without leaking values", () => {
      assert.ok(launchConfiguration(base).every((c) => !c.required || c.ok));
      assert.ok(launchConfiguration({}).some((c) => c.required && !c.ok));
      const serialized = JSON.stringify(launchConfiguration(base));
      for (const name of [
        "DATABASE_URL",
        "BOT_TOKEN",
        "INTERNAL_API_SECRET",
        "MONO_TOKEN",
      ])
        assert.ok(!serialized.includes(base[name]));
    });

    test("production rejects preview domains, unsafe encryption, test payments and malformed FX", () => {
      for (const [key, value, id] of [
        ["NEXT_PUBLIC_SITE_URL", "http://localhost:3000", "domain"],
        ["DELIVERY_ENCRYPTION_KEY", "invalid", "encryption"],
        ["CRYPTO_PAY_TESTNET", "true", "crypto-mainnet"],
        ["STRIPE_WEBHOOK_SECRET", "", "stripe-pair"],
      ]) {
        const config = {
          ...base,
          CRYPTO_PAY_TOKEN: "fixture-only",
          CRYPTO_PAY_TESTNET: "false",
          STRIPE_SECRET_KEY: "sk_live_fixture",
          STRIPE_WEBHOOK_SECRET: "whsec_fixture",
          [key]: value,
        };
        assert.equal(
          launchConfiguration(config).find((c) => c.id === id).ok,
          false,
          id,
        );
      }
      assert.equal(
        launchConfiguration({
          ...base,
          FX_MODE: "manual",
          FX_MANUAL_RATES_JSON: "null",
        }).find((c) => c.id === "fx").ok,
        false,
      );
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("marketapp-gifts.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_gifts_marketapp_fetchGiftsOnSale: fetchGiftsOnSale,
      M_lib_gifts_marketapp_fetchGiftByAddress: fetchGiftByAddress,
    } = await import("../src/server.tsx");
    const { M_lib_commerce_checkout_parseCart: parseCart } =
      await import("../src/server.tsx");

    test("marketapp gifts catalog returns normalized items with attributes and multi-currency prices", async () => {
      const result = await fetchGiftsOnSale();
      assert.ok(result.items.length > 0, "Should have gift items");
      assert.equal(
        result.liveApi,
        false,
        "Should default to fixture set when no token provided",
      );
      const gift = result.items[0];
      assert.ok(
        gift.address.startsWith("EQ"),
        "Valid TON contract address prefix",
      );
      assert.ok(gift.priceTon > 0, "Price in TON must be positive");
      assert.ok(gift.priceUah > 0, "Price in UAH must be calculated");
      assert.ok(gift.priceUsdt > 0, "Price in USDT must be calculated");
      assert.ok(gift.priceStars > 0, "Price in Stars must be calculated");
      assert.ok(gift.model.length > 0, "Model attribute must be defined");
      assert.ok(
        gift.image.startsWith("data:image/svg+xml") ||
          gift.image.startsWith("/gifts/") ||
          gift.image.endsWith(".webp"),
        "Valid gift preview image",
      );
    });

    test("marketapp gifts filter by model and search", async () => {
      const searchResult = await fetchGiftsOnSale({ search: "Pepe" });
      assert.ok(searchResult.items.length > 0);
      assert.ok(
        searchResult.items.every(
          (i) => i.name.includes("Pepe") || i.model.includes("Pepe"),
        ),
      );
      const modelResult = await fetchGiftsOnSale({ model: "Astral Shard" });
      assert.ok(modelResult.items.length > 0);
      assert.ok(modelResult.items.every((i) => i.model === "Astral Shard"));
    });

    test("marketapp gifts sort by price ascending and descending", async () => {
      const asc = await fetchGiftsOnSale({ sortBy: "price_asc" });
      for (let i = 1; i < asc.items.length; i++) {
        assert.ok(
          asc.items[i].priceTon >= asc.items[i - 1].priceTon,
          "Ascending order",
        );
      }
      const desc = await fetchGiftsOnSale({ sortBy: "price_desc" });
      for (let i = 1; i < desc.items.length; i++) {
        assert.ok(
          desc.items[i].priceTon <= desc.items[i - 1].priceTon,
          "Descending order",
        );
      }
    });

    test("fetchGiftByAddress retrieves matching gift", async () => {
      const all = await fetchGiftsOnSale();
      const target = all.items[0];
      const found = await fetchGiftByAddress(target.address);
      assert.ok(found);
      assert.equal(found.address, target.address);
      assert.equal(found.name, target.name);
      const missing = await fetchGiftByAddress(
        "EQ_invalid_address_that_does_not_exist",
      );
      assert.equal(missing, null);
    });

    test("cart accepts gift kind with quantity 1 and rejects multiple quantity", () => {
      const valid = parseCart([
        { kind: "gift", id: "EQB_astral_shard_421", quantity: 1 },
      ]);
      assert.equal(valid.length, 1);
      assert.equal(valid[0].kind, "gift");
      assert.equal(valid[0].id, "EQB_astral_shard_421");
      assert.equal(valid[0].quantity, 1);
      // Reject quantity > 1 for unique NFT gifts
      assert.throws(
        () =>
          parseCart([
            { kind: "gift", id: "EQB_astral_shard_421", quantity: 2 },
          ]),
        /unique_quantity/,
      );
      // Reject non-positive quantity
      assert.throws(
        () =>
          parseCart([
            { kind: "gift", id: "EQB_astral_shard_421", quantity: 0 },
          ]),
        /invalid_cart/,
      );
    });

    test("marketapp gifts have backdrop and symbol attributes", async () => {
      const all = await fetchGiftsOnSale();
      for (const item of all.items) {
        assert.ok(
          item.backdrop && item.backdrop.length > 0,
          `Gift ${item.name} should have backdrop`,
        );
        assert.ok(
          item.symbol && item.symbol.length > 0,
          `Gift ${item.name} should have symbol`,
        );
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("money.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_money_quoteRetail: quoteRetail,
      M_lib_money_sourceBound: sourceBound,
    } = await import("../src/shared.tsx");
    const { M_lib_telegram_values_spamState: spamState } =
      await import("../src/server.tsx");

    const fx = {
      rates: { RUB: "1", USD: "100", USDT: "101", UAH: "2.5" },
      source: "manual",
      updatedAt: 1,
      fetchedAt: 1,
    };

    test("source currency is respected; USDT has its own conversion rate", () => {
      assert.deepEqual(quoteRetail("100", "RUB", fx, "20"), {
        UAH: 4800,
        USDT: 119,
      });
      assert.deepEqual(quoteRetail("1", "USD", fx), { UAH: 4000, USDT: 100 });
      assert.deepEqual(quoteRetail("1", "USDT", fx), { UAH: 4040, USDT: 100 });
    });

    test("rounding never produces zero or undercharges fractional minor units", () => {
      assert.deepEqual(quoteRetail("0.01", "USD", fx), { UAH: 40, USDT: 1 });
      assert.throws(() => quoteRetail("1", "EUR", fx));
      assert.throws(() => quoteRetail("-1", "USD", fx));
      assert.throws(() => quoteRetail("NaN", "USD", fx));
      assert.throws(() => quoteRetail("1", "USD", fx, "-1"));
    });

    test("retail bounds reverse markup and preserve rounding-edge candidates", () => {
      const lower = Number(sourceBound("48", "UAH", fx, "20", false));
      const upper = Number(sourceBound("48", "UAH", fx, "20", true));
      assert.ok(lower < 1 && upper > 1);
    });

    test("observed supplier restriction codes and unknown data stay distinct", () => {
      assert.equal(spamState(-1), "none");
      for (const code of [-2, -3, -4, 1791239000])
        assert.equal(spamState(code), "blocked");
      for (const code of [null, undefined, 0, "", "unexpected"])
        assert.equal(spamState(code), "unknown");
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("navigation.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_navigation_activePrimaryTab: activePrimaryTab,
      M_lib_navigation_primaryTabs: primaryTabs,
    } = await import("../src/shared.tsx");

    test("four primary tabs retain locale and separate NFT from all shop categories", () => {
      for (const locale of ["uk", "ru", "en"]) {
        const tabs = primaryTabs(locale);
        assert.deepEqual(
          tabs.map((t) => t.id),
          ["store", "nft", "history", "profile"],
        );
        assert.ok(
          tabs.every((t) => t.path.startsWith(`/${locale}`) && t.label),
        );
        for (const path of [
          "",
          "/steam-accounts",
          "/telegram-accounts/UA",
          "/smm",
          "/verifications",
          "/product/item",
          "/cart",
        ])
          assert.equal(activePrimaryTab(`/${locale}${path}`, locale), "store");
        for (const path of ["/nft-gifts", "/gifts"])
          assert.equal(activePrimaryTab(`/${locale}${path}`, locale), "nft");
        assert.equal(activePrimaryTab(`/${locale}/history`, locale), "history");
        assert.equal(activePrimaryTab(`/${locale}/account`, locale), "profile");
        assert.equal(activePrimaryTab(`/${locale}/login`, locale), "profile");
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("nft-checkout.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const { generateKeyPairSync: generateKeyPairSync, sign: sign } =
      await import("node:crypto");
    const {
      Address: Address,
      beginCell: beginCell,
      Dictionary: Dictionary,
      storeTransaction: storeTransaction,
    } = await import("@ton/core");
    const {
      M_lib_nft_nativePrice: nativePrice,
      M_lib_nft_nftServiceFee: fee,
      M_lib_nft_validateNftTransaction: validate,
      M_lib_nft_tonProofDigest: digest,
      M_lib_nft_verifyNftProof: verifyProof,
      M_lib_nft_nftDeliveryReceipt: deliveryReceipt,
      M_lib_nft_nftFeeReceipt: feeReceipt,
      M_lib_nft_NFT_SHOP_ADDRESS: shop,
      M_lib_nft_claimNftFee: claimFee,
      M_lib_nft_prepareNft: prepare,
      M_lib_nft_nftStatus: status,
      M_lib_db_db: db,
    } = await import("../src/server.tsx");

    const wallet = new Address(0, Buffer.alloc(32, 1)).toRawString(),
      nft = new Address(0, Buffer.alloc(32, 2)).toRawString(),
      seller = new Address(0, Buffer.alloc(32, 3)).toRawString();

    function deliveryTx({
      aborted = false,
      source = seller,
      target = wallet,
      address = nft,
      opcode = 0x5fcc3d14,
      now = Math.floor(Date.now() / 1000),
      comment,
      credit = 1n,
    } = {}) {
      const addr = Address.parse(address);
      const tx = {
        address: BigInt("0x" + addr.hash.toString("hex")),
        lt: 1n,
        prevTransactionHash: 0n,
        prevTransactionLt: 0n,
        now,
        outMessagesCount: 0,
        oldStatus: "active",
        endStatus: "active",
        inMessage: {
          info: {
            type: "internal",
            ihrDisabled: true,
            bounce: false,
            bounced: false,
            src: Address.parse(source),
            dest: addr,
            value: { coins: credit },
            ihrFee: 0n,
            forwardFee: 0n,
            createdLt: 0n,
            createdAt: now,
          },
          body:
            comment !== undefined
              ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell()
              : beginCell()
                  .storeUint(opcode, 32)
                  .storeUint(0, 64)
                  .storeAddress(Address.parse(target))
                  .endCell(),
        },
        outMessages: Dictionary.empty(),
        totalFees: { coins: 0n },
        stateUpdate: { oldHash: Buffer.alloc(32), newHash: Buffer.alloc(32) },
        description: {
          type: "generic",
          creditFirst: true,
          creditPhase: { credit: { coins: credit } },
          computePhase: {
            type: "vm",
            success: true,
            messageStateUsed: false,
            accountActivated: false,
            gasFees: 0n,
            gasUsed: 0n,
            gasLimit: 0n,
            mode: 0,
            exitCode: 0,
            vmSteps: 0,
            vmInitStateHash: 0n,
            vmFinalStateHash: 0n,
          },
          aborted,
          destroyed: false,
        },
      };
      return beginCell()
        .store(storeTransaction(tx))
        .endCell()
        .toBoc()
        .toString("base64");
    }

    test("NFT delivery requires a successful on-chain transfer receipt bound to this contract, seller and buyer", () => {
      const date = new Date(Date.now() - 1000);
      assert.match(
        deliveryReceipt(deliveryTx(), nft, seller, wallet, date),
        /^[a-f0-9]{64}$/,
      );
      for (const bad of [
        { aborted: true },
        { source: wallet },
        { target: seller },
        { address: seller },
        { opcode: 0 },
        { now: 0 },
      ])
        assert.equal(
          deliveryReceipt(deliveryTx(bad), nft, seller, wallet, date),
          null,
        );
      assert.equal(deliveryReceipt("fake", nft, seller, wallet, date), null);
    });

    test("Fee receipt verifies actual native credit to the store, buyer and unique order comment", () => {
      const date = new Date(Date.now() - 1000),
        id = "fixture";
      const make = (changes) =>
        deliveryTx({
          source: wallet,
          address: shop,
          comment: "legit-nft-fee:" + id,
          credit: 70000000n,
          ...changes,
        });
      assert.match(
        feeReceipt(make({}), id, wallet, "70000000", date),
        /^[a-f0-9]{64}$/,
      );
      for (const change of [
        { source: seller },
        { address: nft },
        { comment: "wrong" },
        { credit: 1n },
        { now: 0 },
      ])
        assert.equal(
          feeReceipt(make(change), id, wallet, "70000000", date),
          null,
        );
    });

    test("NFT native currency and exact seven-percent fee reject USDT and zero", () => {
      assert.equal(nativePrice({ price: "1", currency: "GRAM" }), 1n);
      assert.equal(fee(1n), 1n);
      assert.equal(fee(1000000000n), 70000000n);
      assert.throws(() => nativePrice({ price: "1", currency: "USDT" }));
      assert.throws(() => nativePrice({ price: "0", currency: "TON" }));
    });

    test("NFT provider transaction validates lifetime, nano units, addresses, BOC and attached gas", () => {
      const now = 1770000000,
        tx = {
          validUntil: now + 200,
          messages: [
            {
              address: seller,
              amount: "1100000000",
              payload: beginCell()
                .storeUint(0, 32)
                .endCell()
                .toBoc()
                .toString("base64"),
            },
          ],
        };
      assert.equal(
        validate(tx, 1000000000n, now).messages[0].amount,
        "1100000000",
      );
      assert.equal(
        Address.parseFriendly(
          validate(tx, 1000000000n, now).messages[0].address,
        ).isTestOnly,
        false,
      );
      for (const bad of [
        { ...tx, validUntil: now - 1 },
        { ...tx, messages: [] },
        { ...tx, messages: [{ address: "bad", amount: "1" }] },
        { ...tx, messages: [{ address: seller, amount: "9.9" }] },
        { ...tx, messages: [{ address: seller, amount: "9000000000" }] },
        {
          ...tx,
          messages: [
            { address: seller, amount: "1100000000", payload: "not-boc" },
          ],
        },
      ])
        assert.throws(() => validate(bad, 1000000000n, now));
    });

    test("Wallet proof checks real Ed25519 signature, domain, challenge, address and freshness", () => {
      const now = 1770000000,
        { privateKey, publicKey } = generateKeyPairSync("ed25519"),
        key = publicKey.export({ type: "spki", format: "der" }).subarray(-32);
      const p = {
        timestamp: now,
        domain: { value: "fixture.test", lengthBytes: 12 },
        payload: "single-use-challenge",
      };
      p.signature = sign(null, digest(wallet, p), privateKey).toString(
        "base64",
      );
      assert.equal(
        verifyProof(wallet, p, p.payload, key, "fixture.test", now),
        true,
      );
      assert.equal(
        verifyProof(wallet, p, "different", key, "fixture.test", now),
        false,
      );
      assert.equal(
        verifyProof(wallet, p, p.payload, key, "other.test", now),
        false,
      );
      assert.equal(
        verifyProof(nft, p, p.payload, key, "fixture.test", now),
        false,
      );
      assert.equal(
        verifyProof(wallet, p, p.payload, key, "fixture.test", now + 301),
        false,
      );
      assert.equal(
        verifyProof(
          wallet,
          { ...p, domain: { ...p.domain, lengthBytes: 99 } },
          p.payload,
          key,
          "fixture.test",
          now,
        ),
        false,
      );
    });

    test("Live NFT order uses official buy contract, fresh server price and chain ownership; client cannot mark paid", async () => {
      const originals = {
        fetch: globalThis.fetch,
        token: process.env.MARKETAPP_API_TOKEN,
        proof: db.nftWalletProof.findUnique,
        create: db.nftPurchase.create,
        find: db.nftPurchase.findFirst,
        update: db.nftPurchase.updateMany,
      };
      let row,
        owner = seller,
        fees = [];
      process.env.MARKETAPP_API_TOKEN = "fixture-server-only";
      db.nftWalletProof.findUnique = async () => ({
        address: wallet,
        expiresAt: new Date(Date.now() + 60000),
      });
      db.nftPurchase.create = async ({ data }) =>
        (row = {
          ...data,
          id: "caaaaaaaaaaaaaaaaaaaaaaaa",
          createdAt: new Date(),
          state: "PREPARED",
        });
      db.nftPurchase.findFirst = async ({ where }) =>
        where.userId === "user" ? row : null;
      db.nftPurchase.updateMany = async ({ data }) => {
        Object.assign(row, data);
        return { count: 1 };
      };
      globalThis.fetch = async (url, options) => {
        const u = String(url);
        if (u.includes("/v1/nfts/buy/")) {
          assert.deepEqual(JSON.parse(options.body), {
            data: [{ nft_address: nft, price: 1, currency: "GRAM" }],
          });
          return Response.json({
            transaction: {
              validUntil: Math.floor(Date.now() / 1000) + 240,
              messages: [
                {
                  address: seller,
                  amount: "1100000000",
                  payload: beginCell()
                    .storeUint(0, 32)
                    .endCell()
                    .toBoc()
                    .toString("base64"),
                },
              ],
            },
          });
        }
        if (u.includes("/v1/nfts/"))
          return Response.json({
            address: nft,
            name: "Gift #42",
            status: "for_sale",
            status_details: { price: "1000000000", currency: "GRAM" },
          });
        if (u.endsWith("runGetMethod"))
          return Response.json({
            ok: true,
            result: {
              exit_code: 0,
              stack: [
                ["num", "-1"],
                ["num", "0"],
                ["cell", {}],
                [
                  "cell",
                  {
                    bytes: beginCell()
                      .storeAddress(Address.parse(owner))
                      .endCell()
                      .toBoc()
                      .toString("base64"),
                  },
                ],
              ],
            },
          });
        if (u.endsWith("getTransactions"))
          return Response.json({
            ok: true,
            result:
              JSON.parse(options.body).address === nft
                ? [{ data: deliveryTx() }]
                : fees,
          });
        throw Error("Unexpected bank/network request");
      };
      try {
        await assert.rejects(
          prepare("user", {
            address: nft,
            walletAddress: wallet,
            expectedBaseNano: "999",
          }),
          /nft_price_changed/,
        );
        const q = await prepare("user", {
          address: nft,
          walletAddress: wallet,
          expectedBaseNano: "1000000000",
        });
        assert.equal(q.fee, "0.07");
        assert.equal(q.total, "1.07");
        assert.equal(q.transaction.messages.length, 1);
        assert.equal((await status("user", q.id)).state, "PREPARED");
        await assert.rejects(status("other", q.id), /not_found/);
        owner = wallet;
        const delivered = await status("user", q.id);
        assert.equal(delivered.state, "DELIVERED");
        assert.equal(delivered.feeTransaction.messages[0].amount, "70000000");
        assert.match(row.deliveryTxHash, /^[a-f0-9]{64}$/);
        const lease = await claimFee("user", q.id);
        assert.equal(lease.transaction.messages[0].amount, "70000000");
        assert.ok(row.feePendingUntil > Date.now());
        fees = [
          {
            data: deliveryTx({
              source: seller,
              address: shop,
              comment: "legit-nft-fee:" + q.id,
              credit: 70000000n,
            }),
          },
        ];
        assert.equal((await status("user", q.id)).state, "DELIVERED");
        fees[0].data = deliveryTx({
          source: wallet,
          address: shop,
          comment: "legit-nft-fee:" + q.id,
          credit: 70000000n,
        });
        assert.equal((await status("user", q.id)).state, "COMPLETE");
        assert.match(row.feeTxHash, /^[a-f0-9]{64}$/);
      } finally {
        globalThis.fetch = originals.fetch;
        if (originals.token === undefined)
          delete process.env.MARKETAPP_API_TOKEN;
        else process.env.MARKETAPP_API_TOKEN = originals.token;
        db.nftWalletProof.findUnique = originals.proof;
        db.nftPurchase.create = originals.create;
        db.nftPurchase.findFirst = originals.find;
        db.nftPurchase.updateMany = originals.update;
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("nft-regressions.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const { M_lib_money_quoteRetailFour: quoteRetailFour } =
      await import("../src/shared.tsx");
    const {
      M_lib_gifts_marketapp_normalizeMarketGift: normalizeMarketGift,
      M_lib_gifts_marketapp_getBinanceOnlineRates: getBinanceOnlineRates,
      M_lib_gifts_marketapp_fetchGiftsOnSale: fetchGiftsOnSale,
    } = await import("../src/server.tsx");
    const { M_app_api_crypto_order_route_POST: legacyOrder } =
      await import("../src/server.tsx");
    const { M_app_api_crypto_verify_payment_route_POST: simulate } =
      await import("../src/server.tsx");
    const { M_app_api_webhooks_tonkeeper_route_POST: webhook } =
      await import("../src/server.tsx");

    const fx = {
      rates: { RUB: "1", USD: "1", USDT: "1", UAH: String(1 / 41.5) },
      updatedAt: 1,
      fetchedAt: 1,
      source: "manual",
    };

    const rates = { tonUsdt: 1.6, gramUsdt: 1.379, lastUpdated: 1 };

    const raw = {
      address: "EQ-test",
      name: "Pepe",
      collection_address: "EQ-collection",
      owner: "EQ-owner",
      min_bid: "10000000",
      currency: "TON",
      attributes: [
        { trait_type: "model", value: "Plush Pepe" },
        { trait_type: "backdrop", value: "Blue" },
      ],
      item_num: 1,
      listed_at: 1,
    };

    test("four currencies preserve fractional input with fixed seven percent markup", () => {
      const quote = quoteRetailFour("0.0001", "USD", fx, "1.60");
      assert.equal(quote.TON, "0.000066875");
      assert.equal(quote.USDT, 1);
      assert.equal(quote.UAH, 1);
      assert.equal(quote.XTR, 1);
      assert.throws(() => quoteRetailFour("1", "USD", fx, "0"));
      assert.throws(() => quoteRetailFour("1", "USD", fx, "1.6", "NaN"));
    });

    test("MarketApp uses atomic currency units even for tiny TON bids", () => {
      const gift = normalizeMarketGift(raw, fx, rates);
      assert.equal(gift.priceTon, 0.0107);
      assert.equal(gift.priceGram, gift.priceTon);
      assert.equal(
        normalizeMarketGift({ ...raw, currency: "GRAM" }, fx, rates).priceGram,
        gift.priceGram,
      );
      assert.equal(gift.priceUsdt, 2);
      assert.equal(gift.model, "Plush Pepe");
      assert.equal(gift.backdrop, "Blue");
      const usdt = normalizeMarketGift(
        { ...raw, currency: "USDT", min_bid: "16000" },
        fx,
        rates,
      );
      assert.equal(usdt.priceTon, gift.priceTon);
      assert.equal(usdt.priceUsdt, gift.priceUsdt);
    });

    test("malformed and restricted supplier items never get invented prices", () => {
      for (const patch of [
        { currency: "BTC" },
        { min_bid: "NaN" },
        { min_bid: "-1" },
        { min_bid: "0" },
        { is_restricted: true },
      ]) {
        assert.throws(() =>
          normalizeMarketGift({ ...raw, ...patch }, fx, rates),
        );
      }
    });

    test("ticker failures use defaults, coalesce requests and cache failure for sixty seconds", async () => {
      const oldNow = Date.now;
      const afterPreviousCache = oldNow() + 61000;
      Date.now = () => afterPreviousCache;
      const oldFetch = globalThis.fetch;
      let requests = 0;
      globalThis.fetch = async () => {
        requests++;
        throw Error("offline");
      };
      try {
        const [a, b] = await Promise.all([
          getBinanceOnlineRates(),
          getBinanceOnlineRates(),
        ]);
        assert.equal(a.tonUsdt, 1.6);
        assert.equal(a.gramUsdt, a.tonUsdt);
        assert.equal(a.source, "fallback");
        assert.equal(a.gramSource, "fallback");
        assert.deepEqual(a, b);
        assert.equal(requests, 2);
        await getBinanceOnlineRates();
        assert.equal(requests, 2);
      } finally {
        globalThis.fetch = oldFetch;
        Date.now = oldNow;
      }
    });

    test("MarketApp rate limits return premium SVG fixtures", async () => {
      const oldFetch = globalThis.fetch;
      const oldToken = process.env.MARKETAPP_API_TOKEN;
      process.env.MARKETAPP_API_TOKEN = "test-only";
      globalThis.fetch = async () => new Response("{}", { status: 429 });
      try {
        const catalog = await fetchGiftsOnSale();
        assert.equal(catalog.liveApi, false);
        for (const model of [
          "Plush Pepe",
          "Snoop Dogg",
          "Homemade Cake",
          "Fresh Socks",
        ])
          assert.ok(catalog.items.some((g) => g.model === model));
        assert.ok(
          catalog.items.every(
            (g) => g.image.startsWith("data:image/svg+xml") && !g.isLive,
          ),
        );
      } finally {
        globalThis.fetch = oldFetch;
        if (oldToken === undefined) delete process.env.MARKETAPP_API_TOKEN;
        else process.env.MARKETAPP_API_TOKEN = oldToken;
      }
    });

    test("legacy simulation, unverified webhooks and client-priced orders cannot confirm payment", async () => {
      assert.equal((await simulate()).status, 403);
      assert.equal((await legacyOrder()).status, 503);
      assert.equal((await webhook()).status, 503);
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("profile-integration.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const sharp = (await import("sharp")).default;
    const {
      M_lib_profile_onboardingLocale: onboardingLocale,
      M_lib_profile_validateOnboarding: validateOnboarding,
      M_lib_profile_readAvatarBytes: readAvatarBytes,
      M_lib_profile_sanitizeAvatar: sanitizeAvatar,
      M_lib_profile_requireOnboarded: requireOnboarded,
    } = await import("../src/server.tsx");
    const { M_lib_bot_bridge_validateBotWallets: validateBotWallets } =
      await import("../src/server.tsx");
    const { M_lib_db_db: db } = await import("../src/server.tsx");
    const { M_lib_telegram_links_telegramLinks: telegramLinks } =
      await import("../src/shared.tsx");

    test("first-run choices and completion reject malformed or unsupported values", () => {
      for (const locale of ["uk", "ru", "en"])
        assert.equal(onboardingLocale(locale), locale);
      for (const l of ["xx", undefined, 42])
        assert.throws(() => onboardingLocale(l));
      validateOnboarding({ completed: true, version: 1 });
      for (const d of [
        { completed: false, version: 1 },
        { completed: true, version: 2 },
        { completed: true, version: 1, admin: true },
      ])
        assert.throws(() => validateOnboarding(d));
    });

    test("purchase guard reads server completion state, not local preference", async () => {
      const old = db.user.findUnique;
      try {
        db.user.findUnique = async () => ({ onboardingCompletedAt: null });
        await assert.rejects(
          requireOnboarded("fixture"),
          (e) => e.code === "onboarding_required",
        );
        db.user.findUnique = async () => ({
          onboardingCompletedAt: new Date(),
        });
        await requireOnboarded("fixture");
      } finally {
        db.user.findUnique = old;
      }
    });

    test("profile photos refuse SVG and excessive streamed bytes", async () => {
      await assert.rejects(
        readAvatarBytes(
          new Request("https://fixture.invalid", {
            method: "POST",
            headers: { "Content-Type": "image/svg+xml" },
            body: "<svg/>",
          }),
        ),
        (e) => e.code === "invalid_photo",
      );
      await assert.rejects(
        readAvatarBytes(
          new Request("https://fixture.invalid", {
            method: "POST",
            headers: { "Content-Type": "image/png" },
            body: new Uint8Array(2 * 1024 * 1024 + 1),
          }),
        ),
        (e) => e.code === "photo_too_large",
      );
    });

    test("photo decoder normalizes actual raster pixels and rejects disguised SVG", async () => {
      const raster = await sharp({
        create: { width: 10, height: 8, channels: 3, background: "#2a85ff" },
      })
        .png()
        .toBuffer();
      const result = await sanitizeAvatar(raster),
        meta = await sharp(result).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, 256);
      assert.equal(meta.height, 256);
      await assert.rejects(
        sanitizeAvatar(
          Buffer.from(
            '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>',
          ),
        ),
        (e) => e.code === "invalid_photo",
      );
    });

    test("bot balance snapshot rejects duplicates, negative and unsafe data", () => {
      const value = [
        { currency: "UAH", balance: "150.25" },
        { currency: "GRAM", balance: "1.234567891" },
      ];
      assert.deepEqual(validateBotWallets(value), value);
      for (const patch of [
        [value[0], value[0]],
        [{ currency: "UAH", balance: "-1" }, value[1]],
        [{ currency: "UAH", balance: "NaN" }, value[1]],
        [{ currency: "UAH", balance: "1e100" }, value[1]],
      ])
        assert.throws(() => validateBotWallets(patch));
    });

    test("top-up deep links remain within Telegram start payload limits", () => {
      for (const l of ["uk", "ru", "en"])
        assert.equal(
          telegramLinks(`miniapp_topup_${l}`, "LegitAssetsBot", "").url,
          `https://t.me/LegitAssetsBot?start=miniapp_topup_${l}`,
        );
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("railway.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const { EventEmitter: EventEmitter } = await import("node:events");
    const {
      mkdtemp: mkdtemp,
      mkdir: mkdir,
      copyFile: copyFile,
      readFile: readFile,
      rm: rm,
    } = await import("node:fs/promises");
    const { tmpdir: tmpdir } = await import("node:os");
    const { join: join } = await import("node:path");
    const { spawnSync: spawnSync } = await import("node:child_process");
    const { runtimeEnvironment: runtimeEnvironment, launch: launch } =
      await import("../scripts/start.mjs");
    const { GET: dispatch } = await import("../src/app/api/[...path]/route.ts");

    test("Production rewrite dispatch serves wallet icon from resolved Next route params", async () => {
      const request = new Request(
        "https://shop.up.railway.app/wallet-icon.png",
      );
      const response = await dispatch(request, {
        params: Promise.resolve({ path: ["static", "wallet-icon.png"] }),
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "image/png");
      assert.ok((await response.arrayBuffer()).byteLength > 0);
    });

    const source = {
      RAILWAY_ENVIRONMENT_ID: "test",
      RAILWAY_PUBLIC_DOMAIN: "shop.up.railway.app",
      PORT: "8080",
      RAILWAY_VOLUME_MOUNT_PATH: "/tmp/legit-fixture",
      DATABASE_URL: "file:/tmp/legit-fixture/legit.sqlite",
      BOT_TOKEN: "12345:fixture_only",
      INTERNAL_API_SECRET: "i".repeat(64),
      CRON_SECRET: "c".repeat(64),
      DELIVERY_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"),
    };

    test("Railway derives trusted HTTPS domain and local worker port without changing input", () => {
      const result = runtimeEnvironment(source);
      assert.equal(
        result.env.NEXT_PUBLIC_SITE_URL,
        "https://shop.up.railway.app",
      );
      assert.equal(result.env.COMMERCE_WORKER_ORIGIN, "http://127.0.0.1:8080");
      assert.equal(source.NEXT_PUBLIC_SITE_URL, undefined);
      assert.equal(
        runtimeEnvironment({
          ...source,
          NEXT_PUBLIC_SITE_URL: "https://custom.domain.com",
        }).env.NEXT_PUBLIC_SITE_URL,
        "https://custom.domain.com",
      );
    });

    test("Railway refuses missing keys, bad ports and domains before migration or listening", () => {
      for (const change of [
        { PORT: "0" },
        { PORT: "70000" },
        { PORT: "3;bad" },
        { RAILWAY_PUBLIC_DOMAIN: "evil.com/path" },
        { NEXT_PUBLIC_SITE_URL: "http://evil.com" },
        { NEXT_PUBLIC_SITE_URL: "https://name:password@evil.com" },
        { INTERNAL_API_SECRET: "" },
        { DELIVERY_ENCRYPTION_KEY: "" },
        { DATABASE_URL: "postgresql://invalid" },
        { RAILWAY_VOLUME_MOUNT_PATH: "" },
        { BOT_TOKEN: "" },
      ])
        assert.throws(() => runtimeEnvironment({ ...source, ...change }));
    });

    function harness(migrationCode = 0) {
      const runs = [],
        completed = [],
        signals = new EventEmitter();
      const spawnChild = (_bin, args, { env }) => {
        const child = new EventEmitter();
        child.args = args;
        child.env = env;
        child.kills = [];
        child.kill = (signal) => {
          child.kills.push(signal);
          queueMicrotask(() => child.emit("exit", 0));
        };
        runs.push(child);
        if (args.includes("migrate"))
          queueMicrotask(() => child.emit("exit", migrationCode));
        if (args.includes("admin-seed"))
          queueMicrotask(() => child.emit("exit", 0));
        return child;
      };
      return {
        runs,
        completed,
        signals,
        options: {
          spawnChild,
          signals,
          finish: (code) => completed.push(code),
          fetchHealth: async () => ({ ok: true }),
        },
      };
    }

    test("Failed migrations never start the app or commerce worker", async () => {
      const h = harness(1);
      await launch(source, h.options);
      assert.equal(h.runs.length, 1);
      assert.deepEqual(h.completed, [1]);
      assert.equal(h.signals.listenerCount("SIGTERM"), 0);
    });

    test("Railway starts migration, web and worker in order; worker crash terminates web", async () => {
      const h = harness();
      await launch(source, h.options);
      assert.equal(h.runs.length, 4);
      assert.ok(h.runs[0].args.includes("migrate"));
      assert.ok(h.runs[1].args.includes("admin-seed"));
      assert.ok(h.runs[2].args.includes("0.0.0.0"));
      assert.ok(h.runs[2].args.includes("8080"));
      assert.equal(
        h.runs[3].env.COMMERCE_WORKER_ORIGIN,
        "http://127.0.0.1:8080",
      );
      h.runs[3].emit("exit", 1);
      await new Promise((resolve) => setImmediate(resolve));
      assert.deepEqual(h.runs[2].kills, ["SIGTERM"]);
      assert.deepEqual(h.completed, [1]);
    });

    test("Embedded SQLite uses one file for migrations and the opted-in worker", async () => {
      const h = harness();
      const external = {...source, RAILWAY_ENVIRONMENT_ID: "", RAILWAY_PUBLIC_DOMAIN: "", NEXT_PUBLIC_SITE_URL: "https://shop.example.com", AUTO_MIGRATE: "true", START_COMMERCE_WORKER: "true", DIRECT_URL: ""};
      await launch(external, h.options);
      assert.equal(h.runs.length, 4);
      assert.equal(h.runs[0].env.DATABASE_URL, external.DATABASE_URL);
      assert.equal(h.runs[1].env.DATABASE_URL, source.DATABASE_URL);
      assert.equal(h.runs[2].env.DATABASE_URL, source.DATABASE_URL);
      assert.ok(h.runs[3].args.includes("--conditions=react-server"));
      h.signals.emit("SIGTERM");
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(h.completed, [0]);
      assert.throws(() => runtimeEnvironment({...external, DIRECT_URL: "https://private-marker"}), error => !error.message.includes("private-marker"));
    });

    test("Railway SIGTERM stops both processes cleanly; non-Railway keeps standalone web", async () => {
      const h = harness();
      await launch(source, h.options);
      h.signals.emit("SIGTERM");
      await new Promise((resolve) => setImmediate(resolve));
      assert.deepEqual(h.completed, [0]);
      for (const child of h.runs.slice(2))
        assert.deepEqual(child.kills, ["SIGTERM"]);
      const plain = harness();
      await launch({}, plain.options);
      assert.equal(plain.runs.length, 1);
      plain.signals.emit("SIGTERM");
      await new Promise((resolve) => setImmediate(resolve));
    });

    test("Railway generator needs no database URL, keeps secrets private and never overwrites", async () => {
      const dir = await mkdtemp(join(tmpdir(), "legit-railway-"));
      try {
        await mkdir(join(dir, "scripts"));
        await copyFile(
          new URL("../scripts/start.mjs", import.meta.url),
          join(dir, "scripts/start.mjs"),
        );
        await copyFile(
          new URL("../.env.example", import.meta.url),
          join(dir, ".env.example"),
        );
        const run = () =>
          spawnSync(
            process.execPath,
            [join(dir, "scripts/start.mjs"), "env", "--railway"],
            { encoding: "utf8" },
          );
        const first = run();
        assert.equal(first.status, 0);
        const text = await readFile(join(dir, "railway-variables.env"), "utf8");
        assert.ok(!/^DATABASE_URL=/m.test(text));
        assert.ok(text.includes("/data"));
        assert.ok(!text.includes("@db:5432"));
        assert.ok(!text.includes("POSTGRES_PASSWORD="));
        const keys = [
          ...text.matchAll(
            /^(?:DELIVERY_ENCRYPTION_KEY|INTERNAL_API_SECRET|CRON_SECRET|BOT_WEBHOOK_SECRET|BOT_BRIDGE_SECRET)="(.+)"$/gm,
          ),
        ].map((m) => m[1]);
        assert.equal(new Set(keys).size, 5);
        for (const key of keys) assert.ok(!first.stdout.includes(key));
        assert.equal(run().status, 1);
        assert.equal(
          await readFile(join(dir, "railway-variables.env"), "utf8"),
          text,
        );
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("redesign.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const { createHmac: createHmac } = await import("node:crypto");
    const { M_lib_locale_preference_telegramLocale: telegramLocale } =
      await import("../src/shared.tsx");
    const {
      M_lib_commerce_bot_payload_botOrderPayload: botOrderPayload,
      M_lib_commerce_bot_payload_parseBotOrderPayload: parseBotOrderPayload,
      M_lib_commerce_bot_payload_handoffCategory: handoffCategory,
    } = await import("../src/server.tsx");
    const {
      M_lib_commerce_bot_authorizedBotWebhook: authorizedBotWebhook,
      M_lib_commerce_bot_handleBotUpdate: handleBotUpdate,
    } = await import("../src/server.tsx");
    const { M_lib_admin_telegram_verifyAdminInitData: verifyAdminInitData } =
      await import("../src/server.tsx");
    const { M_app_api_admin_login_route_POST: login } =
      await import("../src/server.tsx");
    const { M_app_api_bot_webhook_route_POST: webhook } =
      await import("../src/server.tsx");
    const { NextRequest: NextRequest } = await import("next/server");
    const appTranslations = (
      await import("../src/data.json", { with: { type: "json" } })
    ).default["admin-copy"];

    function signed(id, date = Math.floor(Date.now() / 1000)) {
      const params = new URLSearchParams({
        auth_date: String(date),
        user: JSON.stringify({ id, first_name: "Test" }),
      });
      const secret = createHmac("sha256", "WebAppData")
        .update(process.env.BOT_TOKEN)
        .digest();
      const check = [...params]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      params.set(
        "hash",
        createHmac("sha256", secret).update(check).digest("hex"),
      );
      return params.toString();
    }

    test("Telegram locale normalization covers regional codes and unknown languages", () => {
      assert.equal(telegramLocale("uk-UA"), "uk");
      assert.equal(telegramLocale("ru_RU"), "ru");
      assert.equal(telegramLocale("de"), "en");
      assert.equal(telegramLocale(undefined), "en");
    });

    test("bot handoff payloads fit Telegram limits and reject untrusted routing hints", () => {
      const token = "A".repeat(32),
        payload = botOrderPayload("telegram-accounts", token);
      assert.ok(payload.length <= 64);
      assert.deepEqual(parseBotOrderPayload(payload), {
        category: "telegram-accounts",
        token,
      });
      assert.equal(parseBotOrderPayload("buy_admin-" + token), null);
      assert.throws(() => botOrderPayload("../admin", token));
      assert.throws(() => botOrderPayload("cart", "A".repeat(43)));
      assert.equal(handoffCategory([{ kind: "gift" }]), "nft-gifts");
      assert.equal(
        handoffCategory([{ kind: "gift" }, { kind: "smm" }]),
        "cart",
      );
    });

    test("admin access needs fresh signed initData and a server allowlisted Telegram ID", () => {
      const previous = process.env.BOT_TOKEN,
        ids = process.env.ADMIN_ID;
      process.env.BOT_TOKEN = "fixture-token";
      process.env.ADMIN_ID = "1284525881,5240326337";
      try {
        assert.equal(
          verifyAdminInitData(signed(1284525881)).telegramId,
          1284525881n,
        );
        assert.throws(
          () => verifyAdminInitData(signed(42)),
          (e) => e.status === 403,
        );
        assert.throws(() =>
          verifyAdminInitData(
            signed(1284525881, Math.floor(Date.now() / 1000) - 301),
          ),
        );
        assert.throws(() =>
          verifyAdminInitData(signed(1284525881).replace("Test", "Fake")),
        );
      } finally {
        if (previous === undefined) delete process.env.BOT_TOKEN;
        else process.env.BOT_TOKEN = previous;
        if (ids === undefined) delete process.env.ADMIN_ID;
        else process.env.ADMIN_ID = ids;
      }
    });

    test("old email/password admin login is rejected before database access", async () => {
      const old = process.env.NEXT_PUBLIC_SITE_URL;
      process.env.NEXT_PUBLIC_SITE_URL = "https://shop.test";
      try {
        const response = await login(
          new NextRequest("https://shop.test/api/admin/login", {
            method: "POST",
            headers: {
              origin: "https://shop.test",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "admin@example.org",
              password: "fixture-long-password",
            }),
          }),
        );
        assert.equal(response.status, 403);
      } finally {
        if (old === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
        else process.env.NEXT_PUBLIC_SITE_URL = old;
      }
    });

    test("bot webhook rejects absent and forged secrets, and ignores unrelated updates", async () => {
      const old = process.env.BOT_WEBHOOK_SECRET;
      process.env.BOT_WEBHOOK_SECRET = "s".repeat(32);
      try {
        assert.equal(authorizedBotWebhook(new Headers()), false);
        assert.equal(
          authorizedBotWebhook(
            new Headers({ "x-telegram-bot-api-secret-token": "x".repeat(32) }),
          ),
          false,
        );
        assert.equal(
          authorizedBotWebhook(
            new Headers({ "x-telegram-bot-api-secret-token": "s".repeat(32) }),
          ),
          true,
        );
        assert.equal(
          (
            await webhook(
              new Request("https://shop.test/api/bot/webhook", {
                method: "POST",
                body: "{}",
              }),
            )
          ).status,
          403,
        );
        await handleBotUpdate({ update_id: 1 });
      } finally {
        if (old === undefined) delete process.env.BOT_WEBHOOK_SECRET;
        else process.env.BOT_WEBHOOK_SECRET = old;
      }
    });

    test("admin copy has complete nonempty Ukrainian, English and Russian translations", () => {
      assert.ok(Object.keys(appTranslations).length >= 150);
      for (const [key, values] of Object.entries(appTranslations))
        for (const locale of ["uk", "ru", "en"])
          assert.ok(values[locale]?.trim(), `${locale}: ${key}`);
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("security-policy.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_security_policy_privatePath: privatePath,
      M_lib_security_policy_contentPolicy: contentPolicy,
    } = await import("../src/server.tsx");
    const { M_lib_telegram_links_telegramLinks: telegramLinks } =
      await import("../src/shared.tsx");

    test("private files, encoded paths and source maps are denied without blocking public catalog", () => {
      for (const p of [
        "/.env",
        "/.env.local",
        "/.git/config",
        "/%252eenv",
        "/_next/server/app.js",
        "/src/lib/db.ts",
        "/prisma/schema.prisma",
        "/backup.zip",
        "/dump.sql",
        "/_next/static/x.js.map",
        "/node_modules/x",
        "/package.json",
      ])
        assert(privatePath(p), p);
      for (const p of [
        "/uk",
        "/uk/modules/tour",
        "/uk/steam-accounts",
        "/api/shop/orders",
        "/_next/static/a.js",
        "/assets/games/rust-cover.png",
      ])
        assert(!privatePath(p), p);
    });

    test("CSP keeps Telegram embedding but denies admin frames and executable objects", () => {
      const policy = contentPolicy("fixtureNonce", false, true);
      assert(policy.includes("'nonce-fixtureNonce'"));
      assert(policy.includes("'strict-dynamic'"));
      assert(!policy.includes("'unsafe-eval'"));
      assert(policy.includes("https://web.telegram.org"));
      assert(policy.includes("object-src 'none'"));
      assert(contentPolicy("n", true, true).includes("frame-ancestors 'none'"));
    });

    test("Telegram links encode routing hints, never arbitrary external redirects", () => {
      const payload = "buy_uk_" + "A".repeat(43);
      assert.equal(
        telegramLinks(payload, "LegitAssetsBot").url,
        `https://t.me/LegitAssetsBot?start=${payload}`,
      );
      assert.equal(
        telegramLinks(payload, "LegitAssetsBot", "shop").miniAppUrl,
        `https://t.me/LegitAssetsBot/shop?startapp=${payload}`,
      );
      assert.throws(() => telegramLinks("x&admin=true"));
      assert.throws(() => telegramLinks("uk", "https://evil.invalid"));
      assert.throws(() => telegramLinks("uk", "LegitAssetsBot", "../../evil"));
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("smm.test.mjs", async (context) => {
  const envBefore = { ...process.env };
  const tasks = [];
  const test = (...args) => {
    const task = context.test(...args);
    tasks.push(task);
    return task;
  };
  try {
    const assert = (await import("node:assert/strict")).default;
    const {
      M_lib_smm_rules_normalizeTarget: normalizeTarget,
      M_lib_smm_rules_validateQuantity: validateQuantity,
      M_lib_smm_rules_providerStatus: providerStatus,
    } = await import("../src/shared.tsx");
    const { M_lib_internal_auth_internalAuthorized: internalAuthorized } =
      await import("../src/server.tsx");
    const {
      M_lib_smm_provider_getSupplierServices: getSupplierServices,
      M_lib_smm_provider_addSupplierOrder: addSupplierOrder,
      M_lib_smm_provider_getSupplierStatus: getSupplierStatus,
    } = await import("../src/server.tsx");
    const { M_lib_smm_catalog_smmQuote: smmQuote } =
      await import("../src/server.tsx");

    test("targets enforce platform, profile/post shape and strip tracking", () => {
      assert.equal(
        normalizeTarget("tg-subs", "https://t.me/my_channel/?utm=x#test"),
        "https://t.me/my_channel",
      );
      assert.equal(
        normalizeTarget(
          "ig-likes",
          "https://www.instagram.com/reel/ABC123/?igsh=x",
        ),
        "https://instagram.com/reel/ABC123",
      );
      for (const link of [
        "http://t.me/channel",
        "https://t.me/+invite",
        "https://t.me.evil.com/channel",
        "https://user:pass@t.me/channel",
        "https://t.me/channel/123",
        "https://t.me:444/channel",
      ])
        assert.throws(() => normalizeTarget("tg-subs", link));
      assert.throws(() => normalizeTarget("tg-react", "https://t.me/channel"));
      assert.throws(() =>
        normalizeTarget("tt-likes", "https://tiktok.com/@person"),
      );
    });

    test("quantity and status never silently accept unsupported values", () => {
      assert.equal(validateQuantity(100, 100, 10000), 100);
      for (const n of ["100", 99, 10001, 100.1, NaN, Infinity])
        assert.throws(() => validateQuantity(n, 100, 10000));
      assert.equal(providerStatus("In progress"), "RUNNING");
      assert.equal(providerStatus("Partial"), "PARTIAL");
      assert.equal(providerStatus("Cancelled"), "CANCELED");
      assert.equal(providerStatus("unrecognized"), "UNKNOWN");
    });

    test("internal bridge denies absent/short/wrong credentials", () => {
      process.env.INTERNAL_API_SECRET =
        "fixture-secret-123456789012345678901234";
      assert.equal(internalAuthorized(new Headers()), false);
      assert.equal(
        internalAuthorized(new Headers({ Authorization: "Bearer wrong" })),
        false,
      );
      assert.equal(
        internalAuthorized(
          new Headers({
            Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
          }),
        ),
        true,
      );
    });

    test("provider contract: approved Default mapping, currency, exact quote and ambiguous add", async () => {
      const original = globalThis.fetch;
      process.env.SMM_API_URL = "https://fixture.invalid/api/v2";
      process.env.SMM_API_KEY = "fixture-only";
      process.env.SMM_APPROVED_SERVICE_MAP_JSON = JSON.stringify({
        "tg-subs": 101,
        "tg-react": 102,
      });
      process.env.SMM_MARKUP_PERCENT = "20";
      process.env.FX_MODE = "manual";
      process.env.FX_MANUAL_RATES_JSON = JSON.stringify({
        RUB: 1,
        USD: 100,
        USDT: 101,
        UAH: 2.5,
      });
      process.env.FX_MANUAL_UPDATED_AT = String(Math.floor(Date.now() / 1000));
      let mode = "ok",
        adds = 0;
      globalThis.fetch = async (url, options) => {
        assert.equal(String(url), "https://fixture.invalid/api/v2");
        assert.equal(options.redirect, "error");
        const form = new URLSearchParams(options.body);
        assert.equal(form.get("key"), "fixture-only");
        const action = form.get("action");
        if (action === "services")
          return Response.json([
            {
              service: 101,
              type: "Default",
              rate: "2.50",
              min: "100",
              max: "10000",
              refill: true,
              cancel: false,
            },
            {
              service: 102,
              type: "Custom Comments",
              rate: "1",
              min: 1,
              max: 100,
            },
          ]);
        if (action === "balance")
          return Response.json({ balance: "100", currency: "USD" });
        if (action === "status")
          return Response.json({ status: "Partial", remains: "25" });
        if (action === "add") {
          adds++;
          if (mode === "timeout") throw Error("fixture timeout");
          return Response.json({ order: 987 });
        }
        throw Error("unexpected action");
      };
      try {
        const services = await getSupplierServices(true);
        assert.equal(services.length, 1);
        assert.equal(services[0].currency, "USD");
        const quote = await smmQuote("tg-subs", 250, "https://t.me/my_channel");
        assert.deepEqual(quote.prices, { UAH: 3000, USDT: 75 });
        assert.equal(
          await addSupplierOrder("101", "https://t.me/my_channel", 250),
          "987",
        );
        assert.deepEqual(await getSupplierStatus("987"), {
          state: "PARTIAL",
          remaining: 25,
        });
        mode = "timeout";
        await assert.rejects(
          addSupplierOrder("101", "https://t.me/my_channel", 250),
          (e) => e.code === "provider_transport" && e.ambiguous === true,
        );
        assert.equal(adds, 2, "adapter never retries add internally");
      } finally {
        globalThis.fetch = original;
      }
    });

    test("JAP dynamic catalog uses stable IDs, paginates, filters and blocks special forms", async () => {
      const original = globalThis.fetch;
      const { supplierService } = await import("../src/server.tsx").then(
        (bundle) => ({
          fingerprint: bundle.M_lib_smm_provider_fingerprint,
          smmConfigured: bundle.M_lib_smm_provider_smmConfigured,
          requestPanel: bundle.M_lib_smm_provider_requestPanel,
          getSupplierServices: bundle.M_lib_smm_provider_getSupplierServices,
          supplierService: bundle.M_lib_smm_provider_supplierService,
          addSupplierOrder: bundle.M_lib_smm_provider_addSupplierOrder,
          getSupplierStatus: bundle.M_lib_smm_provider_getSupplierStatus,
          SupplierService: bundle.M_lib_smm_provider_SupplierService,
        }),
      );
      const { smmCatalogPage } = await import("../src/server.tsx").then(
        (bundle) => ({
          smmMarkup: bundle.M_lib_smm_catalog_smmMarkup,
          publicSmmCatalog: bundle.M_lib_smm_catalog_publicSmmCatalog,
          smmQuote: bundle.M_lib_smm_catalog_smmQuote,
          smmCatalogPage: bundle.M_lib_smm_catalog_smmCatalogPage,
          PublicSmmService: bundle.M_lib_smm_catalog_PublicSmmService,
          SmmFilters: bundle.M_lib_smm_catalog_SmmFilters,
          SmmCatalogPage: bundle.M_lib_smm_catalog_SmmCatalogPage,
        }),
      );
      process.env.SMM_CATALOG_MODE = "jap";
      process.env.SMM_API_KEY = "fixture-jap-only";
      const rows = Array.from({ length: 60 }, (_, i) => ({
        service: 1000 + i,
        name: `Telegram Members Ukraine ${i}`,
        category: "Telegram Members",
        type: "Default",
        rate: String(1 + i),
        min: 10,
        max: 10000,
        refill: i % 2 === 0,
        cancel: false,
      }));
      rows.push({
        service: 5000,
        name: "YouTube views",
        category: "Youtube Views",
        type: "Default",
        rate: "2",
        min: 100,
        max: 1000,
        refill: false,
      });
      rows.push({
        service: 5001,
        name: "Instagram custom comments",
        category: "Instagram Comments",
        type: "Custom Comments",
        rate: "1",
        min: 1,
        max: 100,
      });
      let adds = 0;
      globalThis.fetch = async (_, options) => {
        const action = new URLSearchParams(options.body).get("action");
        if (action === "services") return Response.json(rows);
        if (action === "balance")
          return Response.json({ currency: "USD", balance: "SECRET-BALANCE" });
        adds++;
        throw Error("unexpected mutation");
      };
      try {
        const live = await getSupplierServices(true);
        assert.equal(live.length, 62);
        assert.equal(live[0].key, "jap-1000");
        assert.equal(live[60].platform, "youtube");
        const page = await smmCatalogPage({
          platform: "telegram",
          q: "Ukraine",
          refill: true,
          sort: "price-desc",
          page: 2,
        });
        assert.equal(page.total, 30);
        assert.equal(page.services.length, 6);
        assert.equal(page.pages, 2);
        assert.ok(
          page.services.every((s) => s.refill && s.platform === "telegram"),
        );
        const invalidPage = await smmCatalogPage({ page: Infinity });
        assert.equal(invalidPage.page, 1);
        const comments = await smmCatalogPage({ q: "custom comments" });
        assert.equal(comments.services[0].prices, null);
        await assert.rejects(
          supplierService("jap-5001"),
          (e) => e.code === "unsupported_service_type",
        );
        await assert.rejects(
          smmQuote("jap-5001", 10, "https://instagram.com/person"),
          (e) => e.code === "unsupported_service_type",
        );
        const quote = await smmQuote(
          "jap-5000",
          100,
          "https://www.youtube.com/watch?v=abc123",
        );
        assert.equal(quote.link, "https://www.youtube.com/watch?v=abc123");
        assert.deepEqual(quote.prices, { UAH: 960, USDT: 24 });
        assert.throws(() =>
          normalizeTarget(
            "jap-5000",
            "https://youtube.com.evil.com/watch?v=abc",
            "youtube",
          ),
        );
        for (const link of [
          "https://127.0.0.1/a",
          "https://localhost/a",
          "https://site.internal/a",
          "https://user:pass@example.com/a",
        ])
          assert.throws(() => normalizeTarget("jap-6000", link, "other"));
        assert.equal(adds, 0);
        assert.ok(!JSON.stringify(page).includes("SECRET-BALANCE"));
        assert.ok(!JSON.stringify(page).includes("fixture-jap-only"));
      } finally {
        globalThis.fetch = original;
        delete process.env.SMM_CATALOG_MODE;
      }
    });
    await Promise.all(tasks);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in envBefore)) delete process.env[key];
    Object.assign(process.env, envBefore);
  }
});

await rootTest("customer recovery and consolidated routes", async (context) => {
  const assert = (await import("node:assert/strict")).default;
  const { customerRequest } = await import("../src/shared.tsx");
  const { miniAppScreenName } = await import("../src/shared.tsx");
  await context.test(
    "request helper preserves valid server codes and normalizes offline/non-JSON failures",
    async () => {
      const old = globalThis.fetch;
      try {
        globalThis.fetch = async () => {
          throw new TypeError("network socket");
        };
        await assert.rejects(
          customerRequest("/api/auth/me"),
          (e) => e.message === "network_error",
        );
        globalThis.fetch = async () =>
          new Response("<html>Service unavailable</html>", { status: 503 });
        await assert.rejects(
          customerRequest("/api/auth/me"),
          (e) => e.message === "unavailable",
        );
        globalThis.fetch = async () =>
          Response.json({ error: "out_of_stock" }, { status: 409 });
        await assert.rejects(
          customerRequest("/api/shop/quote"),
          (e) => e.message === "out_of_stock",
        );
        globalThis.fetch = async (_url, options) => {
          assert.equal(options.method, "POST");
          assert.equal(options.cache, "no-store");
          assert.equal(options.headers["X-Legit-Channel"], "TMA");
          assert.ok(options.signal);
          return Response.json({ ok: true });
        };
        assert.deepEqual(
          await customerRequest("/api/example", { id: "fixture" }, undefined, {
            "X-Legit-Channel": "TMA",
          }),
          { ok: true },
        );
      } finally {
        globalThis.fetch = old;
      }
    },
  );
  await context.test(
    "deadline produces a recoverable timeout and never automatically repeats a payment",
    async () => {
      const oldFetch = globalThis.fetch,
        oldTimeout = AbortSignal.timeout;
      let calls = 0;
      const timeout = new AbortController();
      try {
        AbortSignal.timeout = () => timeout.signal;
        globalThis.fetch = async () => {
          calls++;
          timeout.abort();
          throw new DOMException("deadline", "TimeoutError");
        };
        await assert.rejects(
          customerRequest("/api/shop/handoff/create", {}),
          (e) => e.message === "request_timeout",
        );
        assert.equal(calls, 1);
      } finally {
        globalThis.fetch = oldFetch;
        AbortSignal.timeout = oldTimeout;
      }
    },
  );
  await context.test(
    "single router selects original screens and rejects unknown nested paths",
    () => {
      for (const screen of [
        [],
        ["account"],
        ["history"],
        ["cart"],
        ["login"],
        ["modules"],
        ["nft-gifts"],
        ["smm"],
        ["steam-accounts"],
        ["verifications"],
      ])
        assert.equal(miniAppScreenName(screen), screen.join("/"));
      assert.equal(
        miniAppScreenName(["telegram-accounts", "UA"]),
        "telegram-accounts/[country]",
      );
      assert.equal(miniAppScreenName(["modules", "rules"]), "modules/[module]");
      assert.equal(miniAppScreenName(["custom-category"]), "[category]");
      assert.equal(miniAppScreenName(["no", "such", "page"]), null);
    },
  );
});

await rootTest('browsing recovery preferences',async context=>{
 const assert=(await import('node:assert/strict')).default;
 const {validNftBrowseState}=await import('../src/shared.tsx');
 const state={search:'Pepe',filters:{collection:'Plush Pepe',model:'',backdrop:'',symbol:'',rarity:''},sort:'asc',minimum:'1',maximum:'10',favoritesOnly:false,advanced:true};
 await context.test('valid public filters survive and unknown fields never persist',()=>{
  assert.deepEqual(validNftBrowseState({...state,token:'must-not-persist'}),state);
 });
 await context.test('malformed stored preferences never crash or become query parameters',()=>{
  for(const value of [null,[],{}, {...state,search:'x'.repeat(129)}, {...state,sort:'invalid'}, {...state,filters:{collection:'x'}}, {...state,favoritesOnly:'yes'}])assert.equal(validNftBrowseState(value),null);
 });
});

await rootTest('NFT history clarity and exact amounts',async context=>{
 const assert=(await import('node:assert/strict')).default;
 const {nftHistoryStatus,formatGramNano}=await import('../src/shared.tsx');
 await context.test('expired and duplicate NFT orders are not described as pending payment',()=>{
  for(const locale of ['uk','ru','en']){assert.notEqual(nftHistoryStatus('EXPIRED',locale),nftHistoryStatus('PREPARED',locale));assert.notEqual(nftHistoryStatus('DUPLICATE',locale),nftHistoryStatus('DELIVERED',locale));}
  assert.match(nftHistoryStatus('EXPIRED','en'),/expired/);
 });
 await context.test('history preserves all nine GRAM decimals and large integer values',()=>{
  assert.equal(formatGramNano('1','en'),'0.000000001');
  assert.equal(formatGramNano('8007000000000000001','en'),'8,007,000,000.000000001');
  assert.equal(formatGramNano('25500000000','uk'),'25,5');
  for(const bad of ['NaN','-1','1.1',''])assert.equal(formatGramNano(bad,'en'),'—');
 });
});

await rootTest('deployment credentials audit',async context=>{
 const assert=(await import('node:assert/strict')).default;
 const {M_lib_admin_telegram_authorizedAdminIds:admins}=await import('../src/server.tsx');
 const {runtimeEnvironment,StartupError}=await import('../scripts/start.mjs');
 await context.test('no built-in administrators; malformed allowlist fails closed',()=>{
  const old=process.env.ADMIN_ID;
  try{
   delete process.env.ADMIN_ID;assert.equal(admins().size,0);
   for(const value of ['', '42,invalid','0','-1','42<script>']){process.env.ADMIN_ID=value;assert.equal(admins().size,0);}
   process.env.ADMIN_ID='42, 77; 42';assert.deepEqual([...admins()],['42','77']);
  }finally{if(old===undefined)delete process.env.ADMIN_ID;else process.env.ADMIN_ID=old;}
 });
 await context.test('database setup errors identify configuration fields without exposing passwords',()=>{
  const source={RAILWAY_VOLUME_MOUNT_PATH:'/tmp/legit-fixture',RAILWAY_ENVIRONMENT_ID:'test',RAILWAY_PUBLIC_DOMAIN:'shop.up.railway.app',BOT_TOKEN:'fixture',DATABASE_URL:'postgresql://u:private-marker@localhost/',INTERNAL_API_SECRET:'x'.repeat(32),CRON_SECRET:'y'.repeat(32),DELIVERY_ENCRYPTION_KEY:Buffer.alloc(32,1).toString('base64')};
  for(const uri of ['not-a-db-url','${{Postgres.DATABASE_URL}}','postgresql://u:private-marker@localhost/']){
   assert.throws(()=>runtimeEnvironment({...source,DATABASE_URL:uri}),error=>error instanceof StartupError&&error.message.includes('DATABASE_URL')&&!error.message.includes('private-marker'));
  }
  assert.equal(runtimeEnvironment({...source,DATABASE_URL:'file:/tmp/legit-fixture/legit.sqlite'}).port,'3000');
 });
});

await rootTest('LZT read-only catalog resilience',async context=>{
 const assert=(await import('node:assert/strict')).default;
 const {M_lib_lzt_http_marketGet:get}=await import('../src/server.tsx');
 await context.test('coalesces listing requests, scopes cache to token, and never caches item checks',async()=>{
  const oldFetch=globalThis.fetch,oldToken=process.env.LZT_TOKEN;let calls=0;
  try{
   process.env.LZT_TOKEN='cache-fixture-one';
   globalThis.fetch=async()=>{calls++;return Response.json({items:[]});};
   await Promise.all([get('/steam',new URLSearchParams({page:'27'})),get('/steam',new URLSearchParams({page:'27'}))]);
   await get('/steam',new URLSearchParams({page:'27'}));assert.equal(calls,1);
   process.env.LZT_TOKEN='cache-fixture-two';await get('/steam',new URLSearchParams({page:'27'}));assert.equal(calls,2);
   await get('/123');await get('/123');assert.equal(calls,4);
  }finally{globalThis.fetch=oldFetch;if(oldToken===undefined)delete process.env.LZT_TOKEN;else process.env.LZT_TOKEN=oldToken;}
 });
});

await rootTest("admin login entry never exposes protected admin data", async () => {
 const assert = (await import("node:assert/strict")).default;
 const {NextRequest} = await import("next/server");
 const {proxy} = await import("../src/proxy.ts");
 const login = await proxy(new NextRequest("https://shop.test/admin/login"));
 assert.equal(login.status, 200);
 assert.ok(login.headers.get("Content-Security-Policy").includes("nonce-"));
 for (const path of ["/admin", "/admin/operations", "/api/admin/products"]) {
   assert.equal((await proxy(new NextRequest("https://shop.test" + path))).status, 403);
 }
});

await rootTest("temporary preferences expire at 72h without trusting malformed timestamps", async () => {
 const assert = (await import("node:assert/strict")).default;
 const {TEMPORARY_DATA_TTL_MS:ttl,readTemporaryPreference:read,writeTemporaryPreference:write} = await import("../src/shared.tsx");
 const now = 1000000, value = [{id:"fixture",quantity:2}];
 assert.deepEqual(read(write(value,now+ttl),now).value,value);
 assert.equal(read(write(value,now),now),null);
 assert.equal(read(write(value,now+ttl),now+ttl),null);
 assert.equal(read(write(value,now+ttl*2),now),null);
 assert.equal(read('{"v":1,"expiresAt":"tomorrow","value":[]}',now),null);
 assert.equal(read('broken',now),null);
 const legacy=read(JSON.stringify(value),now);
 assert.equal(legacy.migrated,true);
 assert.equal(legacy.expiresAt,now+ttl);
 assert.equal(read(write(legacy.value,legacy.expiresAt),now+ttl),null);
});

await rootTest("Exact money display and online SQLite backup", async (t) => {
  const assert = (await import('node:assert/strict')).default;
  const {formatStoredMoney} = await import('../src/shared.tsx');
  await t.test('large decimals stay exact', () => {
    assert.equal(formatStoredMoney('9007199254740993.125'), '9007199254740993.13');
    assert.equal(formatStoredMoney('0.1'), '0.10');
    assert.equal(formatStoredMoney('invalid'), '—');
    assert.equal(formatStoredMoney('Infinity'), '—');
  });
  await t.test('backup retains WAL data and refuses overwrites', async () => {
    const {mkdtemp, rm, stat} = await import('node:fs/promises');
    const {tmpdir} = await import('node:os');
    const {join} = await import('node:path');
    const {DatabaseSync} = await import('node:sqlite');
    const {backupDatabase} = await import('../scripts/start.mjs');
    const folder = await mkdtemp(join(tmpdir(), 'legit-backup-test-'));
    const db = new DatabaseSync(join(folder, 'legit.sqlite'));
    try {
      db.exec("PRAGMA journal_mode=WAL; CREATE TABLE fixture(value TEXT); INSERT INTO fixture VALUES('9007199254740993.123456');");
      const target = join(folder, 'snapshot.sqlite');
      await backupDatabase({DATA_DIR: folder}, target);
      const snapshot = new DatabaseSync(target, {readOnly:true});
      try { assert.equal(snapshot.prepare('SELECT value FROM fixture').get().value,'9007199254740993.123456'); }
      finally { snapshot.close(); }
      assert.equal((await stat(target)).mode & 0o777, 0o600);
      await assert.rejects(backupDatabase({DATA_DIR:folder}, target));
      await assert.rejects(backupDatabase({DATA_DIR:folder}, join(folder,'public','snapshot.sqlite')));
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM fixture').get().n,1);
    } finally { db.close(); await rm(folder,{recursive:true,force:true}); }
  });
});
