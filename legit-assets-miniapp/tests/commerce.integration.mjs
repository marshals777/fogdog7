// Runs against an EMPTY disposable migrated database. Never point this at a live DB.
import assert from "node:assert/strict";
import Decimal from "decimal.js";
import { randomUUID as randomUUID } from "node:crypto";
import { M_lib_commerce_handoff_createHandoff as createHandoff, M_lib_commerce_handoff_claimHandoff as claimHandoff } from "../src/server.tsx";
import { M_lib_db_db as db } from "../src/server.tsx";
import { M_lib_commerce_checkout_createOrder as createOrder, M_lib_commerce_checkout_priceCart as priceCart } from "../src/server.tsx";
import { M_lib_commerce_payments_confirmPayment as confirmPayment, M_lib_commerce_payments_createDeposit as createDeposit, M_lib_commerce_payments_createStarsInvoice as createStarsInvoice, M_lib_commerce_payments_starsPrecheck as starsPrecheck } from "../src/server.tsx";
import { M_lib_commerce_admin_manualDelivery as manualDelivery, M_lib_commerce_admin_refundOrder as refundOrder } from "../src/server.tsx";
import { M_lib_commerce_fulfillment_expireOrders as expireOrders, M_lib_commerce_fulfillment_marketTick as marketTick } from "../src/server.tsx";
import { M_lib_smm_jobs_runSmmTick as runSmmTick } from "../src/server.tsx";
import { M_lib_commerce_encryption_encrypt as encrypt, M_lib_commerce_encryption_decrypt as decrypt } from "../src/server.tsx";
assert.equal(process.env.COMMERCE_ISOLATED_TEST, "true", "Explicit isolated test opt-in required");
Object.assign(process.env, {
    FX_MODE: "manual",
    FX_MANUAL_RATES_JSON: JSON.stringify({
        RUB: 1,
        USD: 100,
        USDT: 100,
        UAH: 2.5,
    }),
    FX_MANUAL_UPDATED_AT: String(Math.floor(Date.now() / 1000)),
    DELIVERY_ENCRYPTION_KEY: Buffer.alloc(32, 19).toString("base64"),
    BOT_TOKEN: "1234:fixture-only",
    STARS_USDT_PER_STAR: "0.02",
    NEXT_PUBLIC_SITE_URL: "https://shop.fixture.invalid",
    CRYPTO_PAY_TOKEN: "fixture-only",
    CRYPTO_PAY_TESTNET: "true",
    SMM_API_URL: "https://panel.fixture.invalid/api/v2",
    SMM_API_KEY: "fixture-only",
    SMM_CATALOG_MODE: "jap",
    SMM_LIVE_ORDERS_ENABLED: "true",
    MARKET_LIVE_ORDERS_ENABLED: "true",
    LZT_TOKEN: "fixture-only",
    MARKUP_PERCENT: "20",
    SMM_MARKUP_PERCENT: "20",
});
let starsRefunds = 0;
let smmAdds = 0, marketAdds = 0, failMarket = false, invoiceCalls = 0;
// No real network request is reachable in this test.
globalThis.fetch = async (input, options = {}) => {
    const u = new URL(String(input)), body = new URLSearchParams(options.body);
    if (u.hostname === "panel.fixture.invalid") {
        switch (body.get("action")) {
            case "services":
                return Response.json([
                    {
                        service: 101,
                        name: "Telegram Subscribers",
                        category: "Telegram Members",
                        type: "Default",
                        rate: "2",
                        min: 10,
                        max: 10000,
                        refill: false,
                        cancel: false,
                    },
                ]);
            case "balance":
                return Response.json({ balance: "1000", currency: "USD" });
            case "add":
                smmAdds++;
                return Response.json({ order: 901 });
            case "status":
                return Response.json({
                    status: "Completed",
                    remains: "0",
                    charge: "2",
                    start_count: "10",
                    currency: "USD",
                });
        }
    }
    if (u.hostname === "api.lzt.market") {
        if (u.pathname.endsWith("/fast-buy")) {
            marketAdds++;
            if (failMarket)
                throw Error("fixture ambiguous transport");
            return Response.json({
                item: {
                    item_id: u.pathname.split("/")[1],
                    loginData: { login: "fixture", password: "fixture-delivery" },
                },
            });
        }
        return Response.json({
            item: {
                item_id: u.pathname.slice(1),
                category_id: 1,
                item_state: "active",
                canBuyItem: true,
                item_origin: "personal",
                price: "5",
                price_currency: "USD",
                title: "Fixture Steam",
            },
        });
    }
    if (u.hostname === "testnet-pay.crypt.bot") {
        invoiceCalls++;
        const d = JSON.parse(options.body);
        return Response.json({
            ok: true,
            result: {
                invoice_id: 700,
                bot_invoice_url: "https://t.me/CryptoTestnetBot?start=fixture",
                payload: d.payload,
            },
        });
    }
    if (u.hostname === "api.telegram.org") {
        if (u.pathname.endsWith("refundStarPayment"))
            starsRefunds++;
        return Response.json({
            ok: true,
            result: u.pathname.endsWith("createInvoiceLink")
                ? "https://t.me/$fixture"
                : true,
        });
    }
    throw Error(`Unexpected network blocked: ${u.hostname}`);
};
const results = [];
const pass = (s) => {
    results.push(s);
    console.log("PASS", s);
};
try {
    assert.equal(await db.user.count(), 0, "Use an empty migrated disposable DB");
    const admin = await db.user.create({
        data: { email: "admin@fixture.invalid", role: "ADMIN" },
    });
    const buyer = await db.user.create({
        data: { email: "buyer@fixture.invalid", telegramId: 12345n, onboardingCompletedAt: new Date() },
    }), other = await db.user.create({ data: { email: "other@fixture.invalid", onboardingCompletedAt: new Date() } });
    const web = { ...buyer, channel: "WEB" }, tma = { ...buyer, channel: "TMA" };
    const cat = await db.category.create({ data: { slug: "test-stock" } });
    const makeProduct = (slug, mode = "MANUAL") => db.product.create({
        data: {
            slug,
            categoryId: cat.id,
            active: true,
            kind: mode === "INVENTORY" ? "UNIQUE" : "SERVICE",
            fulfillmentMode: mode,
            price: "10",
            currency: "USDT",
            translations: {
                create: { locale: "uk", title: slug, description: "" },
            },
        },
    });
    const manual = await makeProduct("manual-fixture"), stock = await makeProduct("stock-fixture", "INVENTORY");
    const lines = (id) => [{ kind: "product", id, quantity: 1 }];
    const q = await priceCart(lines(manual.id), "uk");
    assert.deepEqual(q[0].prices, { UAH: 48000, USDT: 1200 });
    pass("20% markup and exact UAH/USDT conversion");
    const handoff = await createHandoff(lines(manual.id), "uk");
    const payload = new URL(handoff.botUrl).searchParams.get("start");
    const handoffToken = payload.slice("buy_uk_".length);
    assert.equal(handoffToken.length, 43);
    assert(!(await db.cartHandoff.findFirst()).tokenHash.includes(handoffToken));
    await assert.rejects(claimHandoff(handoffToken, web, "uk"), {
        code: "telegram_required",
    });
    const imported = await claimHandoff(handoffToken, tma, "uk");
    assert.equal(imported[0].id, manual.id);
    assert.equal((await claimHandoff(handoffToken, tma, "uk"))[0].id, manual.id);
    await assert.rejects(claimHandoff(handoffToken, { ...other, channel: "TMA" }, "uk"), { code: "handoff_used" });
    const expiredHandoff = await createHandoff(lines(manual.id), "en");
    const expiredToken = new URL(expiredHandoff.botUrl).searchParams
        .get("start")
        .slice("buy_en_".length);
    await db.cartHandoff.updateMany({
        where: { claimedById: null },
        data: { expiresAt: new Date(0) },
    });
    await assert.rejects(claimHandoff(expiredToken, tma, "en"), {
        code: "handoff_expired",
    });
    assert.equal(await db.order.count(), 0);
    pass("Opaque cart transfer: verified TMA only, replay owner, other buyer and expiration guards, no payment");
    await db.wallet.createMany({
        data: [
            { userId: buyer.id, currency: "USDT", balance: "100" },
            { userId: other.id, currency: "USDT", balance: "100" },
        ],
    });
    await assert.rejects(createOrder(web, lines(manual.id), "uk", "USDT", randomUUID(), "wallet", 1000), { code: "price_changed" });
    assert.equal(await db.order.count(), 0);
    pass("Changed total rejected without debit");
    const key = randomUUID();
    const repeated = await Promise.all([
        createOrder(web, lines(manual.id), "uk", "USDT", key, "wallet", 1200),
        createOrder(web, lines(manual.id), "uk", "USDT", key, "wallet", 1200),
    ]);
    assert.equal(repeated[0].id, repeated[1].id);
    assert.equal(await db.transaction.count({ where: { kind: "PURCHASE" } }), 1);
    assert.equal((await db.wallet.findFirst({ where: { userId: buyer.id } })).balance.toString(), "88");
    pass("Concurrent checkout retry debits once");
    await assert.rejects(createOrder(web, lines(stock.id), "uk", "USDT", key, "wallet"), { code: "idempotency_conflict" });
    await db.inventoryItem.create({
        data: {
            productId: stock.id,
            encryptedPayload: encrypt("unique-fixture-secret", `inventory:${stock.id}`),
        },
    });
    const racing = await Promise.allSettled([
        createOrder(web, lines(stock.id), "uk", "USDT", randomUUID(), "wallet", 1200),
        createOrder({ ...other, channel: "WEB" }, lines(stock.id), "uk", "USDT", randomUUID(), "wallet", 1200),
    ]);
    assert.equal(racing.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal(await db.inventoryItem.count({ where: { status: "SOLD" } }), 1);
    const sold = await db.inventoryItem.findFirst({
        include: { orderItem: true },
    });
    assert.equal(decrypt(sold.orderItem.encryptedDelivery, `delivery:${sold.orderItemId}`), "unique-fixture-secret");
    pass("Unique inventory sold once under competing buyers, encrypted delivery");
    const empty = await db.user.create({
        data: { email: "empty@fixture.invalid", onboardingCompletedAt: new Date() },
    });
    const count = await db.order.count();
    await assert.rejects(createOrder({ ...empty, channel: "WEB" }, lines(manual.id), "uk", "USDT", randomUUID(), "wallet", 1200), { code: "insufficient_balance" });
    assert.equal(await db.order.count(), count);
    pass("Insufficient balance rolls back order");
    const mi = await db.orderItem.findFirst({
        where: { orderId: repeated[0].id },
    });
    await manualDelivery(admin.id, mi.id, "manual-secret");
    assert.equal((await db.order.findUnique({ where: { id: mi.orderId } })).status, "COMPLETED");
    await assert.rejects(refundOrder(admin.id, mi.orderId, false), {
        code: "reconciliation_required",
    });
    await refundOrder(admin.id, mi.orderId, true);
    await refundOrder(admin.id, mi.orderId, true);
    assert.equal(await db.transaction.count({
        where: { orderId: mi.orderId, kind: "REFUND" },
    }), 1);
    pass("Admin manual delivery, reconciliation guard and idempotent refund");
    const dep = await createDeposit(web, "CRYPTO_PAY", "10", randomUUID(), "uk");
    assert.equal(dep.state, "PENDING");
    assert.equal(invoiceCalls, 1);
    const before = (await db.wallet.findFirst({ where: { userId: buyer.id, currency: "USDT" } })).balance;
    await assert.rejects(confirmPayment(dep.id, "CRYPTO_PAY", "700", "9", "USD"), { code: "payment_mismatch" });
    await Promise.all([
        confirmPayment(dep.id, "CRYPTO_PAY", "700", "10", "USD"),
        confirmPayment(dep.id, "CRYPTO_PAY", "700", "10", "USD"),
    ]);
    const after = (await db.wallet.findFirst({ where: { userId: buyer.id, currency: "USDT" } })).balance;
    assert(new Decimal(after).minus(before).equals(10));
    assert.equal(await db.transaction.count({
        where: { idempotencyKey: `deposit:${dep.id}` },
    }), 1);
    pass("Duplicate payment confirmation credits once; mismatched amount rejected");
    await assert.rejects(createOrder(tma, lines(manual.id), "uk", "USDT", randomUUID(), "wallet", 1200), { code: "telegram_stars_required" });
    const so = await createOrder(tma, lines(manual.id), "uk", "USDT", randomUUID(), "stars", 1200);
    const pi = await createStarsInvoice(so.id, buyer.id, "uk");
    assert.equal(pi.expectedAmount, "600");
    assert(!(await starsPrecheck(pi.id, "999", 600, "XTR", "wrong-user")));
    assert(await starsPrecheck(pi.id, "12345", 600, "XTR", "query-one"));
    assert(await starsPrecheck(pi.id, "12345", 600, "XTR", "query-one"));
    assert(!(await starsPrecheck(pi.id, "12345", 600, "XTR", "query-two")));
    const balanceBefore = (await db.wallet.findFirst({ where: { userId: buyer.id, currency: "USDT" } })).balance.toString();
    await confirmPayment(pi.id, "TELEGRAM_STARS", pi.id, "600", "XTR", "charge-fixture");
    assert.equal((await db.wallet.findFirst({
        where: { userId: buyer.id, currency: "USDT" },
    })).balance.toString(), balanceBefore);
    pass("Stars identity, single precheckout and order-only settlement");
    await refundOrder(admin.id, so.id, false);
    await refundOrder(admin.id, so.id, false);
    assert.equal(starsRefunds, 1);
    assert.equal((await db.paymentIntent.findUnique({ where: { id: pi.id } })).state, "REFUNDED");
    assert.equal((await db.wallet.findFirst({
        where: { userId: buyer.id, currency: "USDT" },
    })).balance.toString(), balanceBefore);
    pass("Stars refund uses one original charge and leaves WEB balance unchanged");
    const late = await createOrder(tma, lines(manual.id), "uk", "USDT", randomUUID(), "stars", 1200), lp = await createStarsInvoice(late.id, buyer.id, "uk");
    await db.order.update({
        where: { id: late.id },
        data: { createdAt: new Date(Date.now() - 30 * 60000) },
    });
    await expireOrders();
    await confirmPayment(lp.id, "TELEGRAM_STARS", lp.id, "600", "XTR", "charge-late");
    assert.equal((await db.order.findUnique({ where: { id: late.id } })).status, "NEEDS_REVIEW");
    assert.equal((await db.wallet.findFirst({
        where: { userId: buyer.id, currency: "USDT" },
    })).balance.toString(), balanceBefore);
    pass("Late Stars receipt cannot become spendable wallet balance");
    const sl = [
        {
            kind: "smm",
            id: "jap-101",
            quantity: 1000,
            link: "https://t.me/fixture_channel",
        },
    ];
    const sq = await priceCart(sl, "uk");
    const smm = await createOrder(web, sl, "uk", "USDT", randomUUID(), "wallet", sq[0].prices.USDT);
    await runSmmTick();
    assert.equal(smmAdds, 1);
    await db.smmJob.updateMany({ data: { runAt: new Date(0) } });
    await runSmmTick();
    assert.equal((await db.order.findUnique({ where: { id: smm.id } })).status, "COMPLETED");
    assert.equal(smmAdds, 1);
    pass("Paid SMM job submitted once and polled to completion");
    const ml = [{ kind: "market", id: "777", quantity: 1 }];
    const mo = await createOrder(web, ml, "uk", "USDT", randomUUID(), "wallet", 600);
    await marketTick();
    assert.equal((await db.order.findUnique({ where: { id: mo.id } })).status, "COMPLETED");
    assert.equal(marketAdds, 1);
    failMarket = true;
    const unknown = await createOrder(web, [{ kind: "market", id: "778", quantity: 1 }], "uk", "USDT", randomUUID(), "wallet", 600);
    await marketTick();
    await marketTick();
    assert.equal(marketAdds, 2);
    assert.equal((await db.order.findUnique({ where: { id: unknown.id } })).status, "NEEDS_REVIEW");
    pass("LZT fulfillment; ambiguous supplier debit is never blindly retried");
    process.env.SMM_LIVE_ORDERS_ENABLED = "false";
    await assert.rejects(createOrder(web, sl, "uk", "USDT", randomUUID(), "wallet"), { code: "supplier_checkout_disabled" });
    pass("Disabled supplier cannot charge buyers");
    // Retention must not erase balances, paid/unknown jobs or NFT replay protection.
    const {runTemporaryCleanup, databaseStorageReport} = await import('../src/server.tsx');
    const now = new Date(), old = new Date(now.getTime() - 4 * 86400000);
    const userFixture = (id, extra = {}) => ({id, telegramId: BigInt('88' + id.replace(/\D/g, '').padStart(8,'0')), lastActiveAt: old, displayName: 'Temporary fixture', ...extra});
    // 300 ACTIVE profiles with worst-case permitted avatar size, not a 300-concurrent-load benchmark.
    for (let offset = 0; offset < 300; offset += 25) await db.user.createMany({data: Array.from({length:25}, (_,j) => userFixture('ret-active-'+(offset+j), {lastActiveAt: now, avatarUpdatedAt: now}))});
    // Generate incompressible test bytes inside SQLite to measure the worst allowed avatar size.
    await db.$executeRaw`UPDATE "User" SET "avatarBytes" = randomblob(65536) WHERE id LIKE 'ret-active-%'`;
    const size = await databaseStorageReport();
    assert.ok(size.databaseBytes < 700 * 1024 * 1024);
    console.log('CAPACITY_FIXTURE '+JSON.stringify({activeUsers:300,avatarBytesEach:65536,databaseMiB:size.databaseMiB,scope:'SQLite database pages; excludes extra WAL and volume overhead'}));
    await db.user.createMany({data: Array.from({length:210}, (_,j) => ({...userFixture('ret-old-'+(1000+j)), avatarBytes: Buffer.from('old'), avatarUpdatedAt:old}))});
    await db.wallet.create({data:{userId:'ret-old-1000',currency:'UAH',balance:"0"}});
    await db.user.createMany({data:[
      userFixture('ret-admin-2001',{role:'ADMIN'}),
      userFixture('ret-wallet-2002'), userFixture('ret-session-2003'),
      userFixture('ret-proof-2004'),userFixture('ret-nft-2005'),userFixture('ret-cart-2006'),
    ]});
    await db.wallet.create({data:{userId:'ret-wallet-2002',currency:'UAH',balance:'1.25'}});
    await db.userSession.create({data:{tokenHash:randomUUID(),userId:'ret-session-2003',channel:'TMA',expiresAt:new Date(now.getTime()+3600000)}});
    await db.nftWalletProof.create({data:{userId:'ret-proof-2004',payload:randomUUID(),expiresAt:new Date(now.getTime()+3600000)}});
    await db.nftWalletProof.create({data:{userId:'expired-proof-fixture',payload:randomUUID(),expiresAt:old}});
    await db.nftPurchase.create({data:{id:'ret-nft-record',userId:'ret-nft-2005',nftAddress:'fixture',walletAddress:'fixture',previousOwner:'fixture',name:'Fixture',baseNano:'1',feeNano:'1',transaction:{},state:'PREPARED',expiresAt:old}});
    await db.cartHandoff.create({data:{tokenHash:randomUUID(),entries:[],locale:'uk',claimedById:'ret-cart-2006',expiresAt:new Date(now.getTime()+3600000)}});
    await db.cartHandoff.create({data:{tokenHash:'expired-retention-cart',entries:[],locale:'uk',expiresAt:old}});
    await db.notification.create({data:{id:'ret-delivered',telegramId:882001n,kind:'fixture',text:'delivered payload',deduplicationKey:'ret-delivered-key',createdAt:old,deliveredAt:old}});
    await db.notification.create({data:{id:'ret-pending',telegramId:882001n,kind:'fixture',text:'pending payload',deduplicationKey:'ret-pending-key',createdAt:old}});
    await db.user.update({where:{id:web.id},data:{lastActiveAt:old,avatarBytes:Buffer.from('old'),avatarUpdatedAt:old}});
    const financialBefore = await db.order.findMany({orderBy:{id:'asc'},select:{id:true,status:true,total:true}});
    const walletBefore = await db.wallet.findMany({where:{userId:web.id},orderBy:{id:'asc'}});
    const firstCleanup = await runTemporaryCleanup(true, now);
    assert.ok(firstCleanup.usersRemoved <= 200);
    assert.equal(await db.user.count({where:{id:{startsWith:'ret-old-'}}}),10);
    assert.equal((await runTemporaryCleanup(false, now)).skipped,true);
    await runTemporaryCleanup(true, now);
    assert.equal(await db.user.count({where:{id:{startsWith:'ret-old-'}}}),0);
    assert.equal(await db.user.count({where:{id:{startsWith:'ret-active-'}}}),300);
    for (const id of ['ret-admin-2001','ret-wallet-2002','ret-session-2003','ret-proof-2004','ret-nft-2005','ret-cart-2006',web.id]) assert.ok(await db.user.findUnique({where:{id}}),id);
    assert.equal((await db.user.findUnique({where:{id:web.id}})).avatarBytes,null);
    assert.equal(await db.nftWalletProof.findUnique({where:{userId:'expired-proof-fixture'}}),null);
    assert.equal(await db.cartHandoff.findUnique({where:{tokenHash:'expired-retention-cart'}}),null);
    assert.equal((await db.notification.findUnique({where:{id:'ret-delivered'}})).text,'');
    assert.equal((await db.notification.findUnique({where:{id:'ret-delivered'}})).deduplicationKey,'ret-delivered-key');
    assert.equal((await db.notification.findUnique({where:{id:'ret-pending'}})).text,'pending payload');
    assert.deepEqual(await db.order.findMany({orderBy:{id:'asc'},select:{id:true,status:true,total:true}}),financialBefore);
    assert.deepEqual(await db.wallet.findMany({where:{userId:web.id},orderBy:{id:'asc'}}),walletBefore);
    assert.ok(await db.nftPurchase.findUnique({where:{id:'ret-nft-record'}}));
    pass('72h retention batches, 300 active profiles, expired data cleared, balances/orders/NFT replay records preserved');

    const precise = '9007199254740993.123456';
    await db.wallet.update({where:{userId_currency:{userId:buyer.id,currency:'USDT'}},data:{balance:precise}});
    for (const [index, amount] of ['0.1','0.2','0.000001'].entries()) {
      const ref='precision-'+index;
      const payment=await db.paymentIntent.create({data:{userId:buyer.id,provider:'MONO',purpose:'DEPOSIT',state:'PENDING',walletCurrency:'USDT',creditAmount:amount,expectedAmount:amount,expectedCurrency:'USD',providerReference:ref,idempotencyKey:randomUUID(),expiresAt:new Date(Date.now()+60000)}});
      await confirmPayment(payment.id,'MONO',ref,amount,'USD');
    }
    assert.equal((await db.wallet.findUnique({where:{userId_currency:{userId:buyer.id,currency:'USDT'}}})).balance,'9007199254740993.423457');
    pass('SQLite TEXT money preserves small fractions above the JavaScript safe integer range');
    console.log(JSON.stringify({ checks: results.length, results }));
}
finally {
    await db.$disconnect();
}
