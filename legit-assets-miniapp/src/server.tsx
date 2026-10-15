import {loadTransaction as nftLoadTransaction} from "@ton/core";
import {Cell as M_lib_nft_i5} from "@ton/core";
import {Address as M_lib_nft_i4} from "@ton/core";
import {PrismaClient as M_lib_db_i0} from "@prisma/client";
import {randomBytes as M_lib_nft_i2} from "node:crypto";
import {scrypt as M_lib_admin_crypto_i1} from "node:crypto";
import {timingSafeEqual as M_lib_admin_crypto_i2} from "node:crypto";
import {createHash as M_lib_nft_i0} from "node:crypto";
import {NextResponse as M_lib_commerce_core_i0} from "next/server";
import {Prisma as M_lib_commerce_core_i1} from "@prisma/client";
import {createHmac as M_lib_auth_telegram_i0} from "node:crypto";
import {cookies as M_lib_admin_auth_i0} from "next/headers";
import {headers as M_lib_auth_session_i1} from "next/headers";
import type {Channel as M_lib_auth_session_i2} from "@prisma/client";
import M_lib_pricing_i0 from "decimal.js";
// Preserve micro-units even when an existing balance exceeds Number.MAX_SAFE_INTEGER.
M_lib_pricing_i0.set({precision: 40});
import __data_M_lib_catalog_i0 from "@/data.json";
import type {M_lib_i18n_Locale as M_lib_catalog_i1} from "./shared.tsx";
import type {M_lib_money_RetailPrice as M_lib_catalog_i2} from "./shared.tsx";
import type {M_lib_money_FxSnapshot as M_lib_pricing_i1} from "./shared.tsx";
import M_lib_profile_i0 from "sharp";
import {M_lib_i18n_isLocale as M_lib_profile_i1} from "./shared.tsx";
import {M_lib_smm_rules_SmmError as M_lib_smm_jobs_i4} from "./shared.tsx";
import {M_lib_smm_rules_providerStatus as M_lib_smm_provider_i3} from "./shared.tsx";
import {M_lib_smm_definitions_definitions as M_lib_smm_catalog_i1} from "./shared.tsx";
import {M_lib_smm_metadata_servicePlatform as M_lib_smm_provider_i5} from "./shared.tsx";
import {M_lib_money_quoteRetail as M_lib_smm_jobs_i1} from "./shared.tsx";
import {M_lib_smm_rules_normalizeTarget as M_lib_smm_jobs_i2} from "./shared.tsx";
import {M_lib_smm_rules_validateQuantity as M_lib_smm_jobs_i3} from "./shared.tsx";
import {M_lib_countries_isCountry as M_lib_commerce_bot_i7} from "./shared.tsx";
import type {M_lib_countries_Country as M_lib_telegram_market_i1} from "./shared.tsx";
import {M_lib_money_sourceBound as M_lib_telegram_market_i3} from "./shared.tsx";
import {createCipheriv as M_lib_commerce_encryption_i0} from "node:crypto";
import {createDecipheriv as M_lib_commerce_encryption_i1} from "node:crypto";
import {M_lib_money_quoteRetailFour as M_lib_gifts_marketapp_i2} from "./shared.tsx";
import type {PaymentIntent as M_lib_commerce_payments_i1} from "@prisma/client";
import type {PaymentProvider as M_lib_commerce_payments_i2} from "@prisma/client";
import {M_lib_telegram_links_telegramLinks as M_lib_commerce_handoff_i3} from "./shared.tsx";
import {M_lib_locale_preference_telegramLocale as M_lib_commerce_bot_i2} from "./shared.tsx";
import {M_lib_app_copy_appCopy as M_lib_commerce_bot_i3} from "./shared.tsx";
import {M_lib_i18n_categories as M_lib_commerce_bot_i4} from "./shared.tsx";
import {M_lib_shop_copy_shopError as M_lib_commerce_bot_i6} from "./shared.tsx";
import {verify as M_lib_nft_i3} from "node:crypto";
import {createPublicKey as M_lib_nft_i1} from "node:crypto";
import {beginCell as M_lib_nft_i6} from "@ton/core";
import {fromNano as M_lib_nft_i7} from "@ton/core";
import {M_lib_verification_copy_verificationBrands as M_lib_verification_store_i0} from "./shared.tsx";
import {randomUUID as M_app_api_admin_commerce__action__route_i5} from "node:crypto";
import {NextRequest as M_app_api_smm_quote_route_i0} from "next/server";
import {readFileSync as M_app_api_static_____path__route_i0} from "node:fs";
import {join as M_app_api_static_____path__route_i1} from "node:path";
import {extname as M_app_api_static_____path__route_i2} from "node:path";
import "server-only";
const M_lib_catalog_i0 = __data_M_lib_catalog_i0["catalog"];
import "server-only";
// lib/db.ts
namespace M_lib_db {
  const globalDb = globalThis as unknown as {
    legitDb?: M_lib_db_i0;
  };
  // SQLite balances/prices are TEXT; decimal.js performs exact financial arithmetic.
  process.env.DATABASE_URL ||= `file:${process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || process.cwd() + "/.data"}/legit.sqlite`;
  const url = process.env.DATABASE_URL + (process.env.DATABASE_URL.includes("?") ? "&" : "?") + "connection_limit=1&socket_timeout=20";
  export const db = globalDb.legitDb ?? new M_lib_db_i0({datasourceUrl: url});
  globalDb.legitDb = db;
}
// lib/admin/crypto.ts
namespace M_lib_admin_crypto {
  async function digest(password: string, salt: string) {
    return await new Promise<Buffer>((resolve, reject) =>
      M_lib_admin_crypto_i1(password, salt, 64, {N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024}, (err, key) =>
        err ? reject(err) : resolve(key),
      ),
    );
  }
  export async function hashPassword(password: string) {
    if (password.length < 16 || password.length > 128) throw Error("password_length");
    const salt = M_lib_nft_i2(16).toString("hex");
    return `scrypt1$${salt}$${(await digest(password, salt)).toString("hex")}`;
  }
  export async function verifyPassword(password: string, hash: string | null) {
    const match = hash?.match(/^scrypt1\$([a-f0-9]{32})\$([a-f0-9]{128})$/);
    const actual = await digest(password.slice(0, 128), match?.[1] ?? "0".repeat(32));
    const expected = Buffer.from(match?.[2] ?? "0".repeat(128), "hex");
    return M_lib_admin_crypto_i2(actual, expected) && Boolean(match) && password.length <= 128;
  }
  export function newSessionToken() {
    return M_lib_nft_i2(32).toString("hex");
  }
  export function sessionHash(token: string) {
    return M_lib_nft_i0("sha256").update(token).digest("hex");
  }
  export function validToken(token: unknown): token is string {
    return typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
  }
}
// lib/commerce/core.ts
namespace M_lib_commerce_core {
  export class ShopError extends Error {
    constructor(
      public code: string,
      public status = 400,
      public ambiguous = false,
    ) {
      super(code);
    }
  }
  export function json(value: unknown, status = 200) {
    return M_lib_commerce_core_i0.json(value, {
      status,
      headers: {"Cache-Control": "no-store"},
    });
  }
  export function failure(error: unknown) {
    if (error instanceof ShopError) return json({error: error.code}, error.status);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return json({error: "conflict"}, 409);
    return json({error: "unavailable"}, 503);
  }
  export function siteOrigin() {
    const env = process.env;
    let url: URL;
    try {
      url = new URL(env.NEXT_PUBLIC_SITE_URL ?? "");
    } catch {
      throw new ShopError("site_not_configured", 503);
    }
    if (url.username || url.password || (process.env.NODE_ENV === "production" && url.protocol !== "https:"))
      throw new ShopError("site_not_configured", 503);
    return url.origin;
  }
  export function sameOrigin(request: Request) {
    if (request.headers.get("origin") !== siteOrigin()) throw new ShopError("forbidden", 403);
  }
  export async function body(request: Request, limit = 32768) {
    if (Number(request.headers.get("content-length") ?? 0) > limit) throw new ShopError("request_too_large", 413);
    const reader = request.body?.getReader();
    if (!reader) throw new ShopError("invalid_request");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const r = await reader.read();
        if (r.done) break;
        size += r.value.length;
        if (size > limit) {
          await reader.cancel();
          throw new ShopError("request_too_large", 413);
        }
        chunks.push(r.value);
      }
    } finally {
      reader.releaseLock();
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  export async function data(request: Request, limit = 32768): Promise<Record<string, unknown>> {
    let d;
    try {
      d = JSON.parse(await body(request, limit));
    } catch (e) {
      if (e instanceof ShopError) throw e;
      throw new ShopError("invalid_request");
    }
    if (!d || typeof d !== "object" || Array.isArray(d)) throw new ShopError("invalid_request");
    return d;
  }
  export function idempotency(value: unknown) {
    if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{16,80}$/.test(value)) throw new ShopError("invalid_idempotency_key");
    return value;
  }
  export async function atomic<T>(fn: (tx: M_lib_commerce_core_i1.TransactionClient) => Promise<T>): Promise<T> {
    for (let i = 0; i < 3; i++) {
      try {
        return await M_lib_db.db.$transaction(fn, {
          isolationLevel: "Serializable",
          timeout: 20000,
        });
      } catch (e) {
        if (i < 2 && e instanceof M_lib_commerce_core_i1.PrismaClientKnownRequestError && e.code === "P2034") continue;
        throw e;
      }
    }
    throw new ShopError("conflict", 409);
  }
  export async function rateLimit(id: string, limit: number, seconds: number) {
    const now = new Date();
    const result = await atomic(async (tx) => {
      const hit = await tx.adminLoginBucket.findUnique({where: {id}});
      if (!hit || hit.expiresAt <= now)
        return tx.adminLoginBucket.upsert({
          where: {id},
          create: {
            id,
            attempts: 1,
            expiresAt: new Date(now.getTime() + seconds * 1000),
          },
          update: {
            attempts: 1,
            expiresAt: new Date(now.getTime() + seconds * 1000),
          },
        });
      return tx.adminLoginBucket.update({
        where: {id},
        data: {attempts: {increment: 1}},
      });
    });
    if (result.attempts > limit) throw new ShopError("rate_limit", 429);
  }
}
// lib/auth/telegram.ts
namespace M_lib_auth_telegram {
  function equal(expected: Buffer, value: string) {
    return /^[a-f0-9]{64}$/.test(value) && M_lib_admin_crypto_i2(expected, Buffer.from(value, "hex"));
  }
  function fresh(date: string | null) {
    const n = Number(date),
      now = Math.floor(Date.now() / 1000);
    if (!Number.isSafeInteger(n) || n < now - 300 || n > now + 30) throw new M_lib_commerce_core.ShopError("expired_telegram_auth", 401);
  }
  function token() {
    const t = process.env.BOT_TOKEN;
    if (!t) throw new M_lib_commerce_core.ShopError("telegram_not_configured", 503);
    return t;
  }
  function identity(user: Record<string, unknown>) {
    if (!user || typeof user !== "object" || !Number.isSafeInteger(user.id) || Number(user.id) < 1)
      throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
    return {
      telegramId: BigInt(String(user.id)),
      displayName: String(user.first_name ?? "Telegram").slice(0, 100),
    };
  }
  export function verifyInitData(raw: string) {
    if (raw.length > 16384) throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
    const p = new URLSearchParams(raw);
    const seen = new Set<string>();
    for (const [k] of p) {
      if (seen.has(k)) throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
      seen.add(k);
    }
    const hash = p.get("hash") ?? "";
    p.delete("hash");
    const check = [...p]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secret = M_lib_auth_telegram_i0("sha256", "WebAppData").update(token()).digest();
    if (!equal(M_lib_auth_telegram_i0("sha256", secret).update(check).digest(), hash))
      throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
    fresh(p.get("auth_date"));
    let user;
    try {
      user = JSON.parse(p.get("user") ?? "");
    } catch {
      throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
    }
    return identity(user);
  }
  export function verifyWidget(d: Record<string, unknown>) {
    const keys = ["id", "first_name", "last_name", "username", "photo_url", "auth_date"];
    const check = keys
      .filter((k) => d[k] != null)
      .sort()
      .map((k) => `${k}=${d[k]}`)
      .join("\n");
    const secret = M_lib_nft_i0("sha256").update(token()).digest();
    if (!equal(M_lib_auth_telegram_i0("sha256", secret).update(check).digest(), String(d.hash ?? "")))
      throw new M_lib_commerce_core.ShopError("invalid_telegram_auth", 401);
    fresh(String(d.auth_date));
    return identity({...d, id: Number(d.id)});
  }
}
// lib/admin/telegram.ts
namespace M_lib_admin_telegram {
  export function authorizedAdminIds() {
    const raw = process.env.ADMIN_ID || "";
    const ids=raw.split(/[\s,;]+/).filter(Boolean);
    return new Set(ids.length && ids.every(id=>/^[1-9]\d{0,19}$/.test(id))?ids:[]);
  }
  export function isTelegramAdmin(id: bigint | string | null | undefined) {
    return id != null && authorizedAdminIds().has(String(id));
  }
  export function verifyAdminInitData(raw: string) {
    const identity = M_lib_auth_telegram.verifyInitData(raw);
    if (!isTelegramAdmin(identity.telegramId)) throw new M_lib_commerce_core.ShopError("forbidden", 403);
    return identity;
  }
}
// lib/admin/validation.ts
namespace M_lib_admin_validation {
  export class AdminError extends Error {
    constructor(
      public code: string,
      public status = 400,
    ) {
      super(code);
    }
  }
  export function checkOrigin(headers: Headers) {
    const env = process.env;
    const expected = env.NEXT_PUBLIC_SITE_URL;
    let url: URL;
    try {
      url = new URL(expected ?? "");
    } catch {
      throw new AdminError("site_url_not_configured", 503);
    }
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new AdminError("https_required", 503);
    if (headers.get("origin") !== url.origin) throw new AdminError("forbidden_origin", 403);
  }
  export function parseProduct(value: unknown, create: boolean) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new AdminError("invalid_input");
    const v = value as Record<string, unknown>;
    const allowed = ["slug", "price", "currency", "title", "logoId", "group", "active", "version"];
    if (Object.keys(v).some((k) => !allowed.includes(k))) throw new AdminError("invalid_input");
    const title = v.title as Record<string, unknown>;
    if (!title || typeof title !== "object" || Array.isArray(title) || Object.keys(title).length !== 3)
      throw new AdminError("invalid_title");
    const localized = {} as Record<"uk" | "ru" | "en", string>;
    for (const locale of ["uk", "ru", "en"] as const) {
      if (typeof title[locale] !== "string" || !title[locale].trim() || title[locale].length > 120) throw new AdminError("invalid_title");
      localized[locale] = title[locale].trim();
    }
    if (typeof v.price !== "string" || !/^([1-9][0-9]{0,5}|0)(\.[0-9]{1,2})?$/.test(v.price) || Number(v.price) <= 0)
      throw new AdminError("invalid_price");
    if (!["USD", "UAH", "USDT"].includes(String(v.currency))) throw new AdminError("invalid_currency");
    if (!["exchange", "wallet", "other"].includes(String(v.group))) throw new AdminError("invalid_group");
    if (typeof v.active !== "boolean") throw new AdminError("invalid_active");
    if (v.logoId !== null && (typeof v.logoId !== "string" || !/^[a-z0-9-]{1,100}$/.test(v.logoId))) throw new AdminError("invalid_logo");
    if (create && (typeof v.slug !== "string" || !/^[a-z0-9][a-z0-9-]{1,59}$/.test(v.slug))) throw new AdminError("invalid_slug");
    if (!create && (!Number.isSafeInteger(v.version) || Number(v.version) < 0)) throw new AdminError("invalid_version");
    return {
      slug: create ? String(v.slug) : undefined,
      price: v.price,
      currency: v.currency as "USD" | "UAH" | "USDT",
      title: localized,
      logoId: v.logoId as string | null,
      group: v.group as "exchange" | "wallet" | "other",
      active: v.active,
      version: Number(v.version),
    };
  }
  export async function readJson(request: Request) {
    if (Number(request.headers.get("content-length") ?? 0) > 8192) throw new AdminError("invalid_input");
    const reader = request.body?.getReader();
    if (!reader) throw new AdminError("invalid_input");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          throw new AdminError("invalid_input");
        }
        chunks.push(part.value);
      }
    } finally {
      reader.releaseLock();
    }
    const text = Buffer.concat(chunks).toString("utf8");
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new AdminError("invalid_input");
    }
  }
}
// lib/admin/auth.ts
namespace M_lib_admin_auth {
  export const adminCookie = process.env.NODE_ENV === "production" ? "__Host-legit_admin" : "legit_admin";
  export async function adminFromToken(token: string | undefined) {
    if (!M_lib_admin_crypto.validToken(token)) return null;
    const session = await M_lib_db.db.adminSession.findUnique({
      where: {tokenHash: M_lib_admin_crypto.sessionHash(token)},
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            telegramId: true,
            locale: true,
          },
        },
      },
    });
    if (
      !session ||
      session.expiresAt <= new Date() ||
      session.user.role !== "ADMIN" ||
      !M_lib_admin_telegram.isTelegramAdmin(session.user.telegramId)
    )
      return null;
    return session.user;
  }
  export async function currentAdmin() {
    return adminFromToken((await M_lib_admin_auth_i0()).get(adminCookie)?.value);
  }
  export async function requireAdmin() {
    const user = await currentAdmin();
    if (!user) throw new M_lib_admin_validation.AdminError("forbidden", 403);
    return user;
  }
  export function cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      partitioned: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 12 * 60 * 60,
    };
  }
}
// lib/admin/commerce-validation.ts
namespace M_lib_admin_commerce_validation {
  export const orderStates = ["PENDING", "PAID", "FULFILLING", "COMPLETED", "NEEDS_REVIEW", "REFUNDED", "CANCELLED"] as const;
  export const smmStates = ["QUEUED", "PREPARING", "SENDING", "RUNNING", "COMPLETED", "PARTIAL", "CANCELED", "FAILED", "UNKNOWN"] as const;
  export function adminPage(value: string | null) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(10000, Math.max(1, Math.trunc(n) || 1)) : 1;
  }
  export function parseCommerceProduct(value: Record<string, unknown>) {
    const allowed = ["id", "slug", "title", "titles", "price", "currency", "category", "mode", "active", "version"];
    if (Object.keys(value).some((key) => !allowed.includes(key))) throw new M_lib_admin_validation.AdminError("invalid_product");
    const {slug, price, currency, category, mode, active, id, version} = value;
    if (
      typeof slug !== "string" ||
      !/^[a-z0-9-]{2,100}$/.test(slug) ||
      typeof price !== "string" ||
      !/^\d{1,6}(\.\d{1,6})?$/.test(price) ||
      Number(price) <= 0 ||
      typeof category !== "string" ||
      !/^[a-z0-9-]{2,60}$/.test(category) ||
      typeof active !== "boolean" ||
      !["USD", "USDT", "UAH"].includes(String(currency)) ||
      !["MANUAL", "INVENTORY"].includes(String(mode))
    )
      throw new M_lib_admin_validation.AdminError("invalid_product");
    if (
      id !== undefined &&
      (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(id) || !Number.isSafeInteger(version) || Number(version) < 0)
    )
      throw new M_lib_admin_validation.AdminError("invalid_version");
    let titles: Record<"uk" | "ru" | "en", string>;
    if (value.titles !== undefined) {
      const t = value.titles;
      if (!t || typeof t !== "object" || Array.isArray(t) || Object.keys(t).length !== 3)
        throw new M_lib_admin_validation.AdminError("invalid_title");
      titles = {} as typeof titles;
      for (const locale of ["uk", "ru", "en"] as const) {
        const title = (t as Record<string, unknown>)[locale];
        if (typeof title !== "string" || !title.trim() || title.length > 120) throw new M_lib_admin_validation.AdminError("invalid_title");
        titles[locale] = title.trim();
      }
    } else {
      if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 120)
        throw new M_lib_admin_validation.AdminError("invalid_title");
      titles = {
        uk: value.title.trim(),
        ru: value.title.trim(),
        en: value.title.trim(),
      };
    }
    return {
      id: id as string | undefined,
      version: version as number | undefined,
      slug,
      price,
      currency: currency as "USD" | "USDT" | "UAH",
      category,
      mode: mode as "MANUAL" | "INVENTORY",
      active,
      titles,
    };
  }
}
// lib/admin/products.ts
namespace M_lib_admin_products {
  export async function adminProducts() {
    return M_lib_db.db.product
      .findMany({
        where: {category: {slug: "verifications"}},
        include: {translations: true, brandAsset: true},
        orderBy: {createdAt: "asc"},
      })
      .then((rows) =>
        rows.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: Object.fromEntries(p.translations.map((t) => [t.locale, t.title])),
          price: new M_lib_pricing_i0(p.price).toFixed(2),
          currency: p.currency,
          logoId: p.brandAssetId,
          group: p.verificationGroup ?? "other",
          active: p.active,
          version: p.version,
        })),
      );
  }
  export async function saveProduct(body: unknown, id?: string) {
    const actor = await M_lib_admin_auth.requireAdmin();
    if (process.env.VERIFICATION_CATALOG_SOURCE === "archive")
      throw new M_lib_admin_validation.AdminError("database_catalog_required", 409);
    const value = M_lib_admin_validation.parseProduct(body, !id);
    return M_lib_db.db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {id: actor.id},
        select: {role: true},
      });
      if (user?.role !== "ADMIN") throw new M_lib_admin_validation.AdminError("forbidden", 403);
      const logo = value.logoId ? await tx.brandAsset.findUnique({where: {id: value.logoId}}) : null;
      if (value.logoId && !logo) throw new M_lib_admin_validation.AdminError("invalid_logo");
      const category = await tx.category.findUnique({
        where: {slug: "verifications"},
      });
      if (!category) throw new M_lib_admin_validation.AdminError("seed_required", 503);
      const existing = id
        ? await tx.product.findFirst({
            where: {id, categoryId: category.id},
            include: {translations: true},
          })
        : null;
      if (id && !existing) throw new M_lib_admin_validation.AdminError("not_found", 404);
      const data = {
        price: value.price,
        currency: value.currency,
        brandAssetId: value.logoId,
        imageUrl: logo?.imageUrl ?? null,
        verificationGroup: value.group,
        active: value.active,
      };
      const before = existing
        ? {
            price: existing.price.toString(),
            currency: existing.currency,
            logoId: existing.brandAssetId,
            active: existing.active,
            group: existing.verificationGroup,
            title: Object.fromEntries(existing.translations.map((t) => [t.locale, t.title])),
            version: existing.version,
          }
        : null;
      let productId: string;
      if (existing) {
        const changed = await tx.product.updateMany({
          where: {id: existing.id, version: value.version},
          data: {...data, version: {increment: 1}},
        });
        if (!changed.count) throw new M_lib_admin_validation.AdminError("conflict", 409);
        productId = existing.id;
      } else {
        const slug = "verification-" + value.slug;
        if (await tx.product.findUnique({where: {slug}})) throw new M_lib_admin_validation.AdminError("duplicate_slug", 409);
        productId = (
          await tx.product.create({
            data: {
              id: "vr_" + value.slug,
              slug,
              categoryId: category.id,
              kind: "SERVICE",
              fulfillmentMode: "MANUAL",
              minQuantity: 1,
              maxQuantity: 1,
              ...data,
            },
          })
        ).id;
      }
      for (const locale of ["uk", "ru", "en"] as const)
        await tx.productTranslation.upsert({
          where: {productId_locale: {productId, locale}},
          create: {
            productId,
            locale,
            title: value.title[locale],
            description: "",
          },
          update: {title: value.title[locale]},
        });
      await tx.adminAuditLog.create({
        data: {
          actorId: actor.id,
          action: existing ? "verification.update" : "verification.create",
          entityId: productId,
          ...(before ? {before} : {}),
          after: {
            ...data,
            title: value.title,
            version: existing ? existing.version + 1 : 0,
          },
        },
      });
      return {id: productId, version: existing ? existing.version + 1 : 0};
    });
  }
}
// lib/admin/responses.ts
namespace M_lib_admin_responses {
  export function adminFailure(e: unknown) {
    if (e instanceof M_lib_admin_validation.AdminError)
      return M_lib_commerce_core_i0.json({error: e.code}, {status: e.status, headers: {"Cache-Control": "no-store"}});
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return M_lib_commerce_core_i0.json({error: "duplicate_slug"}, {status: 409, headers: {"Cache-Control": "no-store"}});
    return M_lib_commerce_core_i0.json({error: "unavailable"}, {status: 503, headers: {"Cache-Control": "no-store"}});
  }
  export function adminJson(value: unknown) {
    return M_lib_commerce_core_i0.json(value, {headers: {"Cache-Control": "no-store"}});
  }
}
// lib/auth/session.ts
namespace M_lib_auth_session {
  export const userCookie = process.env.NODE_ENV === "production" ? "__Host-legit_user" : "legit_user";
  const tmaCookie = process.env.NODE_ENV === "production" ? "__Host-legit_tma" : "legit_tma";
  function cookieName(channel: M_lib_auth_session_i2) {
    return channel === "TMA" ? tmaCookie : userCookie;
  }
  function cookieOptions(channel: M_lib_auth_session_i2, maxAge: number) {
    const secure = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure,
      sameSite: channel === "TMA" && secure ? ("none" as const) : ("strict" as const),
      partitioned: channel === "TMA" && secure,
      path: "/",
      maxAge,
    };
  }
  async function requestChannel(): Promise<M_lib_auth_session_i2> {
    return (await M_lib_auth_session_i1()).get("x-legit-channel") === "TMA" ? "TMA" : "WEB";
  }
  export async function currentUser() {
    const channel = await requestChannel();
    const t = (await M_lib_admin_auth_i0()).get(cookieName(channel))?.value;
    if (!M_lib_admin_crypto.validToken(t)) return null;
    const s = await M_lib_db.db.userSession.findUnique({
      where: {tokenHash: M_lib_admin_crypto.sessionHash(t)},
      include: {user: {omit: {avatarBytes: true}}},
    });
    if (!s || s.channel !== channel || s.expiresAt <= new Date()) return null;
    // Polling history does not rewrite the user row every 15 seconds.
    const now = new Date();
    if (s.user.lastActiveAt.getTime() < now.getTime() - 15 * 60000) {
      await M_lib_db.db.user.updateMany({where: {id: s.userId, lastActiveAt: {lt: new Date(now.getTime() - 15 * 60000)}}, data: {lastActiveAt: now}});
    }
    return {...s.user, channel: s.channel};
  }
  export async function requireUser() {
    const user = await currentUser();
    if (!user) throw new M_lib_commerce_core.ShopError("unauthorized", 401);
    return user;
  }
  export async function openSession(userId: string, channel: M_lib_auth_session_i2) {
    const token = M_lib_admin_crypto.newSessionToken();
    const jar = await M_lib_admin_auth_i0();
    const old = jar.get(cookieName(channel))?.value;
    await M_lib_db.db.$transaction(async (tx) => {
      await tx.user.update({where: {id: userId}, data: {lastActiveAt: new Date()}});
      if (M_lib_admin_crypto.validToken(old))
        await tx.userSession.deleteMany({
          where: {tokenHash: M_lib_admin_crypto.sessionHash(old)},
        });
      await tx.userSession.create({
        data: {
          tokenHash: M_lib_admin_crypto.sessionHash(token),
          userId,
          channel,
          expiresAt: new Date(Date.now() + 86400000),
        },
      });
    });
    jar.set(cookieName(channel), token, cookieOptions(channel, 86400));
  }
  export async function closeSession() {
    const channel = await requestChannel();
    const jar = await M_lib_admin_auth_i0(),
      t = jar.get(cookieName(channel))?.value;
    if (M_lib_admin_crypto.validToken(t)) await M_lib_db.db.userSession.deleteMany({where: {tokenHash: M_lib_admin_crypto.sessionHash(t)}});
    jar.set(cookieName(channel), "", cookieOptions(channel, 0));
  }
}
// lib/bot-bridge.ts
namespace M_lib_bot_bridge {
  export type BotWallet = {
    currency: "UAH" | "GRAM";
    balance: string;
  };
  export function validateBotWallets(value: unknown): BotWallet[] {
    if (!Array.isArray(value) || value.length !== 2) throw Error("invalid_bot_balance");
    const seen = new Set<string>();
    return value.map((raw) => {
      if (
        !raw ||
        !["UAH", "GRAM"].includes(raw.currency) ||
        seen.has(raw.currency) ||
        typeof raw.balance !== "string" ||
        !/^\d{1,12}(\.\d{1,9})?$/.test(raw.balance)
      )
        throw Error("invalid_bot_balance");
      seen.add(raw.currency);
      const balance = new M_lib_pricing_i0(raw.balance);
      if (!balance.isFinite() || balance.lt(0)) throw Error("invalid_bot_balance");
      return {
        currency: raw.currency,
        balance: balance.toFixed(raw.currency === "UAH" ? 2 : 9),
      };
    });
  }
  export async function botWallets(telegramId: bigint | null): Promise<BotWallet[] | null> {
    if (!telegramId || !process.env.BOT_BRIDGE_URL || !process.env.BOT_BRIDGE_SECRET || process.env.BOT_BRIDGE_SECRET.length < 32)
      return null;
    try {
      const base = new URL(process.env.BOT_BRIDGE_URL);
      if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) throw Error();
      const r = await fetch(new URL("balance", base.toString().replace(/\/?$/, "/")), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BOT_BRIDGE_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({telegramId: telegramId.toString()}),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(3000),
      });
      if (!r.ok) throw Error();
      return validateBotWallets((await r.json()).wallets);
    } catch {
      return null;
    }
  }
}
// lib/catalog.ts
namespace M_lib_catalog {
  export type CatalogItem = {
    id: string;
    category: string;
    title: Record<M_lib_catalog_i1, string>;
    amountMinor: number;
    currency: string;
    imageUrl: string;
    mode: string;
    baseAmount?: string;
    unpriced?: boolean;
    brand?: {
      name: string;
      imageUrl: string;
      color: string;
      group: "exchange" | "wallet" | "other";
    };
  };
  export const catalog: CatalogItem[] = M_lib_catalog_i0;
  export type PricedCatalogItem = CatalogItem & {
    prices: M_lib_catalog_i2 | null;
  };
}
// lib/lzt-http.ts
namespace M_lib_lzt_http {
  export class MarketError extends Error {
    constructor(public code: "not_configured" | "unauthorized" | "rate_limit" | "upstream" | "invalid_data" | "not_found") {
      super(code);
    }
  }
  let windowStart = Date.now();
  let calls = 0;
  function acquire() {
    if (Date.now() - windowStart >= 60000) {
      windowStart = Date.now();
      calls = 0;
    }
    if (++calls > 90) throw new MarketError("rate_limit");
  }
  const listingCache=new Map<string,{expires:number;value:unknown}>();
  const pendingListings=new Map<string,Promise<unknown>>();
  export async function marketGet(path:string,params?:URLSearchParams):Promise<unknown>{
    // Price/owner/balance checks always bypass this public-listing cache.
    if(path!=='/steam'&&path!=='/telegram')return uncachedMarketGet(path,params);
    const token=process.env.LZT_TOKEN?.trim();
    if(!token)throw new MarketError('not_configured');
    const query=new URLSearchParams(params);query.sort();
    const key=M_lib_nft_i0('sha256').update(token).digest('hex')+path+'?'+query;
    const hit=listingCache.get(key);
    if(hit&&hit.expires>Date.now())return hit.value;
    const running=pendingListings.get(key);if(running)return running;
    const request=uncachedMarketGet(path,params).then(value=>{
      if(listingCache.size>=80)listingCache.delete(listingCache.keys().next().value!);
      listingCache.set(key,{expires:Date.now()+15000,value});return value;
    }).finally(()=>pendingListings.delete(key));
    pendingListings.set(key,request);return request;
  }
  async function uncachedMarketGet(path: string, params?: URLSearchParams): Promise<unknown> {
    const token = process.env.LZT_TOKEN?.trim();
    if (!token) throw new MarketError("not_configured");
    // Fixed origin + internal paths; callers cannot proxy arbitrary URLs.
    if (!/^\/(steam|telegram|currency|me|[1-9][0-9]{0,11})$/.test(path)) throw new MarketError("invalid_data");
    const url = new URL(path, "https://api.lzt.market");
    if (params) url.search = params.toString();
    acquire();
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {Authorization: `Bearer ${token}`, Accept: "application/json"},
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(12000),
      });
    } catch {
      throw new MarketError("upstream");
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new MarketError(
        response.status === 401 || response.status === 403
          ? "unauthorized"
          : response.status === 429
            ? "rate_limit"
            : response.status === 404
              ? "not_found"
              : "upstream",
      );
    }
    try {
      return await response.json();
    } catch {
      throw new MarketError("invalid_data");
    }
  }
  export function record(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new MarketError("invalid_data");
    return value as Record<string, unknown>;
  }
}
// lib/pricing.ts
namespace M_lib_pricing {
  let cached: M_lib_pricing_i1 | undefined;
  let pending: Promise<M_lib_pricing_i1> | undefined;
  export async function getFx(): Promise<M_lib_pricing_i1> {
    if (cached && Date.now() - cached.fetchedAt < 900000) return cached;
    if (pending) return pending;
    pending = (async () => {
      let rates: Record<string, string> = {};
      let updatedAt: number;
      let source: "manual" | "lzt";
      if (process.env.FX_MODE === "manual") {
        const values = M_lib_lzt_http.record(JSON.parse(process.env.FX_MANUAL_RATES_JSON ?? "{}"));
        for (const [key, value] of Object.entries(values)) rates[key.toUpperCase()] = String(value);
        updatedAt = Number(process.env.FX_MANUAL_UPDATED_AT);
        source = "manual";
      } else {
        const data = M_lib_lzt_http.record(await M_lib_lzt_http.marketGet("/currency"));
        const list = M_lib_lzt_http.record(data.currencyList);
        for (const [key, value] of Object.entries(list)) rates[key.toUpperCase()] = String(M_lib_lzt_http.record(value).rate);
        updatedAt = Number(data.lastUpdate);
        source = "lzt";
      }
      const now = Date.now() / 1000;
      if (!Number.isFinite(updatedAt) || updatedAt > now + 300 || now - updatedAt > 172800)
        throw new M_lib_lzt_http.MarketError("invalid_data");
      for (const c of ["RUB", "USD", "UAH", "USDT"]) {
        const n = new M_lib_pricing_i0(rates[c]);
        if (!n.isFinite() || n.lte(0)) throw new M_lib_lzt_http.MarketError("invalid_data");
      }
      if (!new M_lib_pricing_i0(rates.RUB).eq(1)) throw new M_lib_lzt_http.MarketError("invalid_data");
      cached = {rates, updatedAt, fetchedAt: Date.now(), source};
      return cached;
    })();
    try {
      return await pending;
    } finally {
      pending = undefined;
    }
  }
  export async function optionalFx(): Promise<M_lib_pricing_i1 | null> {
    try {
      return await getFx();
    } catch {
      return null;
    }
  }
  export function marketMarkup() {
    const n = new M_lib_pricing_i0(process.env.MARKUP_PERCENT ?? "20");
    if (!n.isFinite() || n.lt(0) || n.gt(1000)) throw new M_lib_lzt_http.MarketError("invalid_data");
    return n.toString();
  }
}
// lib/profile.ts
namespace M_lib_profile {
  export function onboardingLocale(value: unknown): M_lib_catalog_i1 {
    if (typeof value !== "string" || !M_lib_profile_i1(value)) throw new M_lib_commerce_core.ShopError("invalid_locale");
    return value;
  }
  export function validateOnboarding(value: Record<string, unknown>) {
    if (value.completed !== true || value.version !== 1 || Object.keys(value).some((k) => !["completed", "version"].includes(k)))
      throw new M_lib_commerce_core.ShopError("invalid_onboarding");
  }
  export async function requireOnboarded(userId: string) {
    const user = await M_lib_db.db.user.findUnique({
      where: {id: userId},
      select: {onboardingCompletedAt: true},
    });
    if (!user?.onboardingCompletedAt) throw new M_lib_commerce_core.ShopError("onboarding_required", 409);
  }
  export async function readAvatarBytes(request: Request) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(request.headers.get("content-type") ?? ""))
      throw new M_lib_commerce_core.ShopError("invalid_photo");
    const limit = 2 * 1024 * 1024;
    if (Number(request.headers.get("content-length") ?? 0) > limit) throw new M_lib_commerce_core.ShopError("photo_too_large", 413);
    const reader = request.body?.getReader();
    if (!reader) throw new M_lib_commerce_core.ShopError("invalid_photo");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.length;
        if (size > limit) {
          await reader.cancel();
          throw new M_lib_commerce_core.ShopError("photo_too_large", 413);
        }
        chunks.push(part.value);
      }
    } finally {
      reader.releaseLock();
    }
    if (!size) throw new M_lib_commerce_core.ShopError("invalid_photo");
    return Buffer.concat(chunks);
  }
  export async function sanitizeAvatar(raw: Buffer) {
    try {
      const image = M_lib_profile_i0(raw, {
        limitInputPixels: 16000000,
        animated: false,
        failOn: "error",
      });
      const meta = await image.metadata();
      if (!["jpeg", "png", "webp"].includes(meta.format ?? "")) throw Error();
      let bytes = await image.clone().rotate().resize(256, 256, {fit: "cover"}).webp({quality: 75}).toBuffer();
      if (bytes.length > 65536) bytes = await image.clone().rotate().resize(192, 192, {fit: "cover"}).webp({quality: 55}).toBuffer();
      if (bytes.length > 65536) throw Error("photo_too_large");
      return bytes;
    } catch {
      throw new M_lib_commerce_core.ShopError("invalid_photo");
    }
  }
}
// lib/smm/provider.ts
namespace M_lib_smm_provider {
  export type SupplierService = {
    key: string;
    name: string;
    category: string;
    type: string;
    platform: string;
    supported: boolean;
    id: string;
    currency: string;
    rate: string;
    min: number;
    max: number;
    refill: boolean;
    cancel: boolean;
  };
  function config() {
    const raw = process.env.SMM_API_URL;
    const key = process.env.SMM_API_KEY;
    if (!raw || !key) throw new M_lib_smm_jobs_i4("not_configured");
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new M_lib_smm_jobs_i4("bad_config");
    }
    if (url.protocol !== "https:" || url.username || url.password || url.hash || url.search) throw new M_lib_smm_jobs_i4("bad_config");
    return {url: url.toString(), key};
  }
  export function fingerprint() {
    const c = config();
    return M_lib_nft_i0("sha256")
      .update(c.url + "\0" + c.key)
      .digest("hex");
  }
  export function smmConfigured() {
    return Boolean(
      process.env.SMM_API_URL &&
      process.env.SMM_API_KEY &&
      (process.env.SMM_CATALOG_MODE === "jap" || process.env.SMM_APPROVED_SERVICE_MAP_JSON),
    );
  }
  export async function requestPanel(
    action: "services" | "balance" | "add" | "status",
    fields: Record<string, string> = {},
  ): Promise<unknown> {
    const c = config();
    const body = new URLSearchParams({...fields, key: c.key, action});
    let response: Response;
    try {
      response = await fetch(c.url, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new M_lib_smm_jobs_i4("provider_transport", action === "add");
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new M_lib_smm_jobs_i4("provider_http", action === "add");
    }
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new M_lib_smm_jobs_i4("provider_format", action === "add");
    }
    if (data && typeof data === "object" && !Array.isArray(data) && "error" in data) throw new M_lib_smm_jobs_i4("provider_rejected");
    return data;
  }
  let cached:
    | {
        expires: number;
        services: SupplierService[];
        fingerprint: string;
      }
    | undefined;
  let inflight:
    | {
        key: string;
        promise: Promise<SupplierService[]>;
      }
    | undefined;
  export async function getSupplierServices(fresh = false): Promise<SupplierService[]> {
    const jap = process.env.SMM_CATALOG_MODE === "jap";
    const current = fingerprint() + String(jap) + (process.env.SMM_APPROVED_SERVICE_MAP_JSON ?? "");
    if (!fresh && cached && cached.expires > Date.now() && cached.fingerprint === current) return cached.services;
    if (inflight?.key === current) return inflight.promise;
    const promise = (async () => {
      let mapping: Record<string, unknown>;
      try {
        mapping = JSON.parse(process.env.SMM_APPROVED_SERVICE_MAP_JSON ?? "{}");
      } catch {
        throw new M_lib_smm_jobs_i4("bad_config");
      }
      if (!mapping || Array.isArray(mapping) || typeof mapping !== "object") throw new M_lib_smm_jobs_i4("bad_config");
      const [data, balance] = await Promise.all([requestPanel("services"), requestPanel("balance")]);
      if (!Array.isArray(data) || !balance || typeof balance !== "object" || !("currency" in balance))
        throw new M_lib_smm_jobs_i4("provider_format");
      const currency = String(balance.currency).toUpperCase();
      if (!/^[A-Z]{3,5}$/.test(currency)) throw new M_lib_smm_jobs_i4("unsupported_currency");
      const result: SupplierService[] = [];
      const used = new Set<string>();
      const entries = jap
        ? data.map((raw) => ({raw, key: `jap-${raw?.service}`}))
        : M_lib_smm_catalog_i1.map((def) => {
            const id = String(mapping[def.key] ?? "");
            return {
              key: def.key,
              raw: data.find((v) => String(v?.service) === id),
            };
          });
      for (const {key, raw} of entries) {
        if (!raw || typeof raw !== "object") continue;
        const id = String(raw.service);
        if (!/^[1-9][0-9]{0,11}$/.test(id)) continue;
        if (used.has(id)) throw new M_lib_smm_jobs_i4("bad_config");
        used.add(id);
        if (!jap && raw.type !== "Default") continue;
        let rate: M_lib_pricing_i0;
        try {
          rate = new M_lib_pricing_i0(String(raw.rate));
        } catch {
          continue;
        }
        const min = Number(raw.min),
          max = Number(raw.max);
        if (
          !rate.isFinite() ||
          rate.lte(0) ||
          !Number.isSafeInteger(min) ||
          !Number.isSafeInteger(max) ||
          min < 1 ||
          max < min ||
          min > 10000000
        )
          continue;
        const def = M_lib_smm_catalog_i1.find((d) => d.key === key);
        const name = String(raw.name ?? def?.title.en ?? id).slice(0, 2000);
        const category = String(raw.category ?? def?.platform ?? "Other").slice(0, 500);
        result.push({
          key,
          id,
          name,
          category,
          type: String(raw.type),
          platform: def?.platform ?? M_lib_smm_provider_i5(category, name),
          supported: raw.type === "Default",
          currency,
          rate: rate.toString(),
          min,
          max: Math.min(max, 10000000),
          refill: raw.refill === true,
          cancel: raw.cancel === true,
        });
      }
      cached = {
        services: result,
        expires: Date.now() + 300000,
        fingerprint: current,
      };
      return result;
    })();
    inflight = {key: current, promise};
    try {
      return await promise;
    } finally {
      if (inflight?.promise === promise) inflight = undefined;
    }
  }
  export async function supplierService(key: string, fresh = false) {
    const s = (await getSupplierServices(fresh)).find((s) => s.key === key);
    if (!s) throw new M_lib_smm_jobs_i4("service_unavailable");
    if (!s.supported) throw new M_lib_smm_jobs_i4("unsupported_service_type");
    return s;
  }
  export async function addSupplierOrder(id: string, link: string, quantity: number): Promise<string> {
    const data = await requestPanel("add", {
      service: id,
      link,
      quantity: String(quantity),
    });
    if (!data || typeof data !== "object" || !("order" in data) || !/^[1-9][0-9]{0,15}$/.test(String(data.order)))
      throw new M_lib_smm_jobs_i4("provider_format", true);
    return String(data.order);
  }
  export async function getSupplierStatus(order: string) {
    if (!/^[1-9][0-9]{0,15}$/.test(order)) throw new M_lib_smm_jobs_i4("invalid_provider_order");
    const data = await requestPanel("status", {order});
    if (!data || typeof data !== "object" || !("status" in data)) throw new M_lib_smm_jobs_i4("provider_format");
    const d = data as Record<string, unknown>;
    const remaining = Number(d.remains);
    return {
      state: M_lib_smm_provider_i3(d.status),
      remaining:
        d.remains !== null &&
        d.remains !== undefined &&
        String(d.remains).trim() !== "" &&
        Number.isSafeInteger(remaining) &&
        remaining >= 0
          ? remaining
          : null,
    };
  }
}
// lib/smm/catalog.ts
namespace M_lib_smm_catalog {
  export type PublicSmmService = {
    key: string;
    category: string;
    type: string;
    supported: boolean;
    platform: string;
    title: Record<"uk" | "ru" | "en", string>;
    prices: M_lib_catalog_i2 | null;
    min: number;
    max: number;
    live: boolean;
    orderable: boolean;
    refill: boolean | null;
    cancel: boolean | null;
  };
  export function smmMarkup() {
    const d = new M_lib_pricing_i0(process.env.SMM_MARKUP_PERCENT ?? "20");
    if (!d.isFinite() || d.lt(0) || d.gt(1000)) throw new M_lib_smm_jobs_i4("bad_config");
    return d.toString();
  }
  function publicPrice(rate: string, currency: string, fx: Awaited<ReturnType<typeof M_lib_pricing.optionalFx>>, markup: string = "0") {
    if (!fx) return null;
    try {
      return M_lib_smm_jobs_i1(rate, currency, fx, markup);
    } catch {
      return null;
    }
  }
  export async function publicSmmCatalog(): Promise<{
    services: PublicSmmService[];
    connected: boolean;
    error: boolean;
  }> {
    const fx = await M_lib_pricing.optionalFx();
    if (M_lib_smm_provider.smmConfigured()) {
      try {
        const live = await M_lib_smm_provider.getSupplierServices();
        return {
          connected: true,
          error: false,
          services: live.map((s) => {
            const def = M_lib_smm_catalog_i1.find((d) => d.key === s.key);
            return {
              key: s.key,
              platform: s.platform,
              category: s.category,
              type: s.type,
              supported: s.supported,
              title: def?.title ?? {uk: s.name, ru: s.name, en: s.name},
              prices: s.supported ? publicPrice(s.rate, s.currency, fx, smmMarkup()) : null,
              min: s.min,
              max: s.max,
              live: true,
              orderable: process.env.SMM_LIVE_ORDERS_ENABLED === "true",
              refill: s.refill,
              cancel: s.cancel,
            };
          }),
        };
      } catch {
        return {services: [], connected: true, error: true};
      }
    }
    return {
      connected: false,
      error: false,
      services: M_lib_smm_catalog_i1.map((def) => ({
        key: def.key,
        platform: def.platform,
        category: def.platform,
        type: "Default",
        supported: true,
        title: def.title,
        prices: publicPrice(def.previewRate, "USD", fx),
        min: 100,
        max: 10000,
        live: false,
        orderable: false,
        refill: null,
        cancel: null,
      })),
    };
  }
  export async function smmQuote(key: string, quantity: unknown, link: string) {
    const service = await M_lib_smm_provider.supplierService(key);
    const target = M_lib_smm_jobs_i2(key, link, service.platform);
    const count = M_lib_smm_jobs_i3(quantity, service.min, service.max);
    const charge = new M_lib_pricing_i0(service.rate).mul(count).div(1000);
    return {
      service: key,
      quantity: count,
      link: target,
      prices: M_lib_smm_jobs_i1(charge.toString(), service.currency, await M_lib_pricing.getFx(), smmMarkup()),
      live: true,
      expiresAt: Date.now() + 60000,
    };
  }
  export type SmmFilters = {
    q?: string;
    platform?: string;
    category?: string;
    sort?: string;
    supported?: boolean;
    refill?: boolean;
    page?: number;
  };
  export async function smmCatalogPage(filters: SmmFilters = {}) {
    const data = await publicSmmCatalog();
    const q = (filters.q ?? "").slice(0, 200).trim().toLowerCase();
    const priority = ["telegram", "instagram", "tiktok", "youtube", "facebook", "twitter", "threads", "spotify", "discord", "twitch"];
    const rank = (p: string) => (priority.includes(p) ? priority.indexOf(p) : 99);
    const platforms = [...new Set(data.services.map((s) => s.platform))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
    const categories = [
      ...new Set(data.services.filter((s) => !filters.platform || s.platform === filters.platform).map((s) => s.category)),
    ].sort();
    const services = data.services.filter(
      (s) =>
        (!filters.platform || s.platform === filters.platform) &&
        (!filters.category || s.category === filters.category) &&
        (!filters.supported || s.supported) &&
        (!filters.refill || s.refill === true) &&
        (!q || `${s.key} ${s.title.uk} ${s.title.ru} ${s.title.en} ${s.category}`.toLowerCase().includes(q)),
    );
    if (filters.sort === "price-asc" || filters.sort === "price-desc")
      services.sort((a, b) => {
        if (!a.prices) return b.prices ? 1 : a.key.localeCompare(b.key);
        if (!b.prices) return -1;
        return (a.prices.USDT - b.prices.USDT) * (filters.sort === "price-desc" ? -1 : 1) || a.key.localeCompare(b.key);
      });
    const pages = Math.max(1, Math.ceil(services.length / 24));
    const page = Math.min(pages, Math.max(1, Number.isFinite(filters.page) ? Math.trunc(filters.page!) || 1 : 1));
    return {
      services: services.slice((page - 1) * 24, page * 24),
      total: services.length,
      catalogTotal: data.services.length,
      platforms,
      categories,
      page,
      pages,
      connected: data.connected,
      error: data.error,
    };
  }
  export type SmmCatalogPage = Awaited<ReturnType<typeof smmCatalogPage>>;
}
// lib/telegram-values.ts
namespace M_lib_telegram_values {
  export type SpamState = "none" | "blocked" | "unknown";
  // -1 was observed in spam=no. -3/-4 in spam=yes; positive values are ban timestamps.
  // Unknown and missing values must never be presented as restriction-free.
  export function spamState(value: unknown): SpamState {
    if (value === null || value === undefined || value === "") return "unknown";
    const n = Number(value);
    return n === -1 ? "none" : [-2, -3, -4].includes(n) || n > 0 ? "blocked" : "unknown";
  }
}
// lib/telegram-market.ts
namespace M_lib_telegram_market {
  export type TelegramListing = {
    id: string;
    country: M_lib_telegram_market_i1;
    prices: M_lib_catalog_i2;
    spam: "none" | "blocked" | "unknown";
    premium: boolean | null;
    password: boolean | null;
    contacts: number;
    channels: number;
    chats: number;
    dc: string | null;
  };
  export type TelegramFilters = {
    spam: "no" | "yes" | "nomatter";
    premium: "no" | "yes" | "nomatter";
    password: "no" | "yes" | "nomatter";
    sort: "asc" | "desc" | "newest";
    page: number;
    currency: "UAH" | "USDT";
    min?: string;
    max?: string;
  };
  export function parseFilters(params: Record<string, string | string[] | undefined>): TelegramFilters {
    const value = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
    const choice = (k: string) => (value(k) === "yes" ? "yes" : value(k) === "no" ? "no" : "nomatter");
    const amount = (k: string) => {
      const n = value(k);
      return n && /^\d{1,6}(?:\.\d{1,2})?$/.test(n) ? n : undefined;
    };
    return {
      spam: choice("spam"),
      premium: choice("premium"),
      password: choice("password"),
      sort: value("sort") === "desc" ? "desc" : value("sort") === "newest" ? "newest" : "asc",
      page: Math.max(1, Math.min(100, Number(value("page")) || 1)) | 0,
      currency: value("currency") === "USDT" ? "USDT" : "UAH",
      min: amount("min"),
      max: amount("max"),
    };
  }
  const disallowed = new Set(["brute", "phishing", "stealer"]);
  function boolean(value: unknown): boolean | null {
    return value === 1 || value === true ? true : value === 0 || value === false ? false : null;
  }
  function count(value: unknown) {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }
  export async function normalizeListing(value: unknown): Promise<TelegramListing | null> {
    const p = M_lib_lzt_http.record(value);
    const id = String(p.item_id);
    const country = String(p.telegram_country).toUpperCase();
    if (
      !/^[1-9][0-9]{0,11}$/.test(id) ||
      !M_lib_commerce_bot_i7(country) ||
      p.item_state !== "active" ||
      Number(p.category_id) !== 24 ||
      p.canBuyItem === false ||
      disallowed.has(String(p.item_origin)) ||
      disallowed.has(String(p.resale_item_origin))
    )
      return null;
    const currency = String(p.price_currency ?? "").toUpperCase();
    const amount = String(p.price);
    if (!/^[A-Z]{3,5}$/.test(currency) || !/^\d+(?:\.\d+)?$/.test(amount)) throw new M_lib_lzt_http.MarketError("invalid_data");
    const fx = await M_lib_pricing.getFx();
    const prices = M_lib_smm_jobs_i1(amount, currency, fx, M_lib_pricing.marketMarkup());
    const spam = M_lib_telegram_values.spamState(p.telegram_spam_block);
    return {
      id,
      country,
      prices,
      spam,
      premium: boolean(p.telegram_premium),
      password: boolean(p.telegram_password),
      contacts: count(p.telegram_contacts_count),
      channels: count(p.telegram_channels_count),
      chats: count(p.telegram_chats_count),
      dc: /^\d{1,2}$/.test(String(p.telegram_dc_id)) ? String(p.telegram_dc_id) : null,
    };
  }
  export type TelegramPage = {
    items: TelegramListing[];
    hasNext: boolean;
    page: number;
    updatedAt: number;
  };
  const cache = new Map<
    string,
    {
      expires: number;
      result: TelegramPage;
    }
  >();
  const pending = new Map<string, Promise<TelegramPage>>();
  export async function listTelegram(country: M_lib_telegram_market_i1, filters: TelegramFilters): Promise<TelegramPage> {
    const key = JSON.stringify([country, filters, M_lib_pricing.marketMarkup()]);
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.result;
    const inflight = pending.get(key);
    if (inflight) return inflight;
    const task = (async () => {
      const fx = await M_lib_pricing.getFx();
      const markup = M_lib_pricing.marketMarkup();
      const query = new URLSearchParams({
        "country[]": country,
        spam: filters.spam,
        premium: filters.premium,
        password: filters.password,
        order_by: filters.sort === "desc" ? "price_to_down" : filters.sort === "newest" ? "pdate_to_down" : "price_to_up",
        page: String(filters.page),
        currency: "usd",
        allow_geo_spamblock: "false",
      });
      for (const origin of disallowed) query.append("not_origin[]", origin);
      if (filters.min) query.set("pmin", M_lib_telegram_market_i3(filters.min, filters.currency, fx, markup, false));
      if (filters.max) query.set("pmax", M_lib_telegram_market_i3(filters.max, filters.currency, fx, markup, true));
      const data = M_lib_lzt_http.record(await M_lib_lzt_http.marketGet("/telegram", query));
      const raw = Array.isArray(data.items) ? data.items : Object.values(M_lib_lzt_http.record(data.items));
      const normalized = await Promise.all(raw.slice(0, 100).map(normalizeListing));
      let items = normalized.filter((p): p is TelegramListing => p !== null && p.country === country);
      // Do not claim a restriction is absent when the supplier reports unknown.
      items = items.filter(
        (p) =>
          (filters.spam === "nomatter" || (filters.spam === "no" ? p.spam === "none" : p.spam === "blocked")) &&
          (filters.premium === "nomatter" || p.premium === (filters.premium === "yes")) &&
          (filters.password === "nomatter" || p.password === (filters.password === "yes")),
      );
      items = items.filter(
        (p) =>
          (!filters.min || p.prices[filters.currency] >= Math.round(Number(filters.min) * 100)) &&
          (!filters.max || p.prices[filters.currency] <= Math.round(Number(filters.max) * 100)),
      );
      if (filters.sort !== "newest")
        items.sort((a, b) => (filters.sort === "asc" ? a.prices.USDT - b.prices.USDT : b.prices.USDT - a.prices.USDT));
      const result = {
        items,
        hasNext: data.hasNextPage === true,
        page: filters.page,
        updatedAt: fx.updatedAt,
      };
      if (cache.size >= 100) cache.delete(cache.keys().next().value!);
      cache.set(key, {expires: Date.now() + 30000, result});
      return result;
    })();
    pending.set(key, task);
    try {
      return await task;
    } finally {
      pending.delete(key);
    }
  }
  export async function getTelegram(id: string): Promise<TelegramListing | null> {
    if (!/^[1-9][0-9]{0,11}$/.test(id)) return null;
    const data = M_lib_lzt_http.record(await M_lib_lzt_http.marketGet(`/${id}`));
    return normalizeListing(data.item);
  }
}
// lib/commerce/market.ts
namespace M_lib_commerce_market {
  const forbidden = new Set(["brute", "phishing", "stealer"]);
  export const steamGames = [
    {
      slug: "cs2",
      id: 730,
      name: "Counter-Strike 2",
      image: "/assets/games/cs2-cover.png",
    },
    {
      slug: "rust",
      id: 252490,
      name: "Rust",
      image: "/assets/games/rust-cover.png",
    },
    {
      slug: "gta5",
      id: 271590,
      name: "GTA V",
      image: "/assets/games/gta5-cover.png",
    },
    {slug: "dota2", id: 570, name: "Dota 2", image: "/assets/decor/steam.png"},
    {
      slug: "pubg",
      id: 578080,
      name: "PUBG",
      image: "/assets/games/pubg-cover.png",
    },
    {
      slug: "cyberpunk",
      id: 1091500,
      name: "Cyberpunk 2077",
      image: "/assets/games/cyberpunk-cover.png",
    },
  ];
  export async function marketItem(id: string) {
    if (!/^[1-9][0-9]{0,11}$/.test(id)) throw new M_lib_commerce_core.ShopError("invalid_item");
    const d = M_lib_lzt_http.record(await M_lib_lzt_http.marketGet(`/${id}`));
    const item = M_lib_lzt_http.record(d.item);
    if (
      ![1, 24].includes(Number(item.category_id)) ||
      item.item_state !== "active" ||
      item.canBuyItem === false ||
      forbidden.has(String(item.item_origin)) ||
      forbidden.has(String(item.resale_item_origin))
    )
      throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
    if (Number(item.category_id) === 24 && !(await M_lib_telegram_market.normalizeListing(item)))
      throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
    const price = new M_lib_pricing_i0(String(item.price)),
      currency = String(item.price_currency).toUpperCase();
    if (!price.isFinite() || price.lte(0)) throw new M_lib_commerce_core.ShopError("invalid_supplier_price", 503);
    return {
      id,
      category: Number(item.category_id) === 1 ? "steam-accounts" : "telegram-accounts",
      title: String(item.title ?? `Account #${id}`).slice(0, 500),
      sourceAmount: price.toString(),
      sourceCurrency: currency,
      prices: M_lib_smm_jobs_i1(price, currency, await M_lib_pricing.getFx(), M_lib_pricing.marketMarkup()),
    };
  }
  export async function listSteam(q: {game?: string; page?: number; sort?: string; search?: string}) {
    const page = Math.max(1, Math.min(100, Math.trunc(q.page ?? 1) || 1));
    const game = steamGames.find((g) => g.slug === q.game);
    const params = new URLSearchParams({
      page: String(page),
      currency: "usd",
      order_by: q.sort === "desc" ? "price_to_down" : q.sort === "newest" ? "pdate_to_down" : "price_to_up",
      rt: "no",
      trade_ban: "no",
    });
    if (game) params.append("game[]", String(game.id));
    if (q.search) params.set("title", q.search.slice(0, 100));
    for (const origin of forbidden) params.append("not_origin[]", origin);
    const d = M_lib_lzt_http.record(await M_lib_lzt_http.marketGet("/steam", params)),
      raw = Array.isArray(d.items) ? d.items : Object.values(M_lib_lzt_http.record(d.items)),
      fx = await M_lib_pricing.getFx();
    const items = raw.slice(0, 50).flatMap((v) => {
      try {
        const p = M_lib_lzt_http.record(v),
          id = String(p.item_id);
        if (
          !/^[1-9][0-9]{0,11}$/.test(id) ||
          Number(p.category_id) !== 1 ||
          p.item_state !== "active" ||
          p.canBuyItem === false ||
          forbidden.has(String(p.item_origin)) ||
          forbidden.has(String(p.resale_item_origin))
        )
          return [];
        return [
          {
            id,
            title: String(p.title ?? `Steam #${id}`).slice(0, 500),
            prices: M_lib_smm_jobs_i1(String(p.price), String(p.price_currency), fx, M_lib_pricing.marketMarkup()),
            image: game?.image ?? "/assets/decor/steam.png",
          },
        ];
      } catch {
        return [];
      }
    });
    return {items, page, hasNext: d.hasNextPage === true};
  }
  export async function buyMarket(id: string, amount: string) {
    const token = process.env.LZT_TOKEN?.trim();
    if (!token) throw new M_lib_commerce_core.ShopError("market_not_configured", 503);
    let response: Response;
    try {
      response = await fetch(`https://api.lzt.market/${id}/fast-buy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          price: amount,
          ...(process.env.LZT_BALANCE_ID ? {balance_id: process.env.LZT_BALANCE_ID} : {}),
        }),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
      });
    } catch {
      throw new M_lib_commerce_core.ShopError("market_submission_unknown", 503, true);
    }
    // Even explicit HTTP failures are reconciled manually; never retry a debit blindly.
    if (!response.ok) {
      await response.body?.cancel();
      throw new M_lib_commerce_core.ShopError("market_submission_unknown", 503, true);
    }
    let data;
    try {
      data = M_lib_lzt_http.record(await response.json());
    } catch {
      throw new M_lib_commerce_core.ShopError("market_submission_unknown", 503, true);
    }
    if (data.errors || data.error) throw new M_lib_commerce_core.ShopError("market_submission_unknown", 503, true);
    const item = M_lib_lzt_http.record(data.item);
    if (String(item.item_id) !== id) throw new M_lib_commerce_core.ShopError("market_submission_unknown", 503, true);
    const delivery: Record<string, unknown> = {item_id: id};
    // Never forward the entire supplier response or buyer balance data.
    for (const field of ["loginData", "emailLoginData", "telegramData", "telegram_account", "accountData"])
      if (item[field] != null) delivery[field] = item[field];
    if (Object.keys(delivery).length === 1) throw new M_lib_commerce_core.ShopError("market_delivery_needs_review", 503, true);
    return JSON.stringify(delivery, null, 2);
  }
}
// lib/commerce/encryption.ts
namespace M_lib_commerce_encryption {
  function key() {
    const raw = process.env.DELIVERY_ENCRYPTION_KEY ?? "";
    const key = Buffer.from(raw, "base64");
    if (key.length !== 32 || key.toString("base64") !== raw) throw new M_lib_commerce_core.ShopError("delivery_key_not_configured", 503);
    return key;
  }
  export function encryptionReady() {
    key();
  }
  export function encrypt(value: string, aad: string) {
    const iv = M_lib_nft_i2(12),
      cipher = M_lib_commerce_encryption_i0("aes-256-gcm", key(), iv);
    cipher.setAAD(Buffer.from(aad));
    const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return `v1.${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${data.toString("base64url")}`;
  }
  export function decrypt(value: string, aad: string) {
    const [version, iv, tag, payload] = value.split(".");
    if (version !== "v1" || !iv || !tag || !payload) throw new M_lib_commerce_core.ShopError("invalid_delivery", 503);
    const decipher = M_lib_commerce_encryption_i1("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
    decipher.setAAD(Buffer.from(aad));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(payload, "base64url")), decipher.final()]).toString("utf8");
  }
}
// lib/gifts/marketapp.ts
namespace M_lib_gifts_marketapp {
  export interface MarketAppAttribute {
    trait_type: string;
    value: string | number;
  }
  export interface MarketAppGift {
    address: string;
    name: string;
    collection_address: string;
    owner: string;
    real_owner?: string;
    min_bid: string;
    max_bid?: string;
    currency: string;
    attributes: MarketAppAttribute[];
    item_num: number | null;
    listed_at: number | null;
    is_restricted?: boolean;
  }
  export interface NormalizedGift {
    id: string;
    address: string;
    name: string;
    collection: string;
    collectionAddress: string;
    itemNum: number | null;
    attributes: Record<string, string | number>;
    model: string;
    backdrop: string;
    symbol: string;
    rarity: string;
    priceTon: number;
    priceUsdt: number;
    priceUah: number;
    priceStars: number;
    priceGram: number;
    baseNano?: string;
    rentPerDayUah: number;
    rentPerWeekUah: number;
    rentPerMonthUah: number;
    rentPerDayGram: number;
    rentPerWeekGram: number;
    rentPerMonthGram: number;
    image: string;
    owner: string;
    listedAt: number;
    isLive: boolean;
    lottieUrl?: string;
    tgsUrl?: string;
  }
  export interface GiftsFilter {
    search?: string;
    model?: string;
    backdrop?: string;
    sortBy?: "popular" | "price_asc" | "price_desc" | "number_asc";
    limit?: number;
  }
  export interface BinanceOnlinePrices {
    tonUsdt: number;
    gramUsdt: number;
    lastUpdated: number;
    source?: "live" | "fallback";
    gramSource?: "live" | "fallback";
  }
  let cachedBinancePrices: BinanceOnlinePrices = {
    tonUsdt: 1.6,
    gramUsdt: 1.6,
    lastUpdated: 0,
  };
  let pendingBinance: Promise<BinanceOnlinePrices> | undefined;
  export async function getBinanceOnlineRates(): Promise<BinanceOnlinePrices> {
    if (Date.now() - cachedBinancePrices.lastUpdated < 60000) return cachedBinancePrices;
    if (pendingBinance) return pendingBinance;
    pendingBinance = (async () => {
      async function ticker(symbol: string, fallback: number) {
        try {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`, {
            headers: {Accept: "application/json"},
            next: {revalidate: 60},
            signal: AbortSignal.timeout(4000),
          });
          if (!res.ok) throw Error("ticker_unavailable");
          const value = Number((await res.json()).price);
          if (!Number.isFinite(value) || value <= 0) throw Error("invalid_ticker");
          return {value, source: "live" as const};
        } catch {
          return {value: fallback, source: "fallback" as const};
        }
      }
      const [ton, gram] = await Promise.all([ticker("TONUSDT", 1.6), ticker("GRAMUSDT", 1.6)]);
      // GRAM is the renamed native TON currency; legacy TON fields remain API-compatible.
      const native = gram.source === "live" ? gram : ton;
      cachedBinancePrices = {
        tonUsdt: native.value,
        gramUsdt: native.value,
        source: native.source,
        gramSource: native.source,
        lastUpdated: Date.now(),
      };
      return cachedBinancePrices;
    })();
    try {
      return await pendingBinance;
    } finally {
      pendingBinance = undefined;
    }
  }
  export async function getTonRate(): Promise<number> {
    const rates = await getBinanceOnlineRates();
    return rates.tonUsdt;
  }
  // Authentic Telegram SVG/CSS gift graphics generators for rich visual experience
  function getModelIllustration(model: string): string {
    const m = (model || "").toLowerCase();
    if (m.includes("mirage") || m.includes("lamp")) {
      return `
      <!-- Mirage Lamp Lantern -->
      <filter id="lampGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Hanging ring -->
      <circle cx="200" cy="88" r="16" fill="none" stroke="#d97706" stroke-width="6"/>
      <rect x="194" y="102" width="12" height="18" rx="3" fill="#92400e"/>
      <!-- Roof Pagoda -->
      <path d="M100 156 Q200 128 300 156 L285 140 Q200 115 115 140 Z" fill="#450a0a"/>
      <path d="M112 148 Q200 125 288 148 L270 134 Q200 115 130 134 Z" fill="#7f1d1d"/>
      <circle cx="200" cy="120" r="8" fill="#d97706"/>
      <!-- Lantern Body with warm glow -->
      <rect x="135" y="156" width="130" height="125" rx="16" fill="#fef08a" filter="url(#lampGlow)" opacity="0.45"/>
      <rect x="140" y="156" width="120" height="120" rx="12" fill="#ea580c"/>
      <rect x="148" y="162" width="104" height="108" rx="10" fill="#facc15"/>
      <!-- Lattice frames -->
      <rect x="140" y="156" width="120" height="120" rx="12" fill="none" stroke="#450a0a" stroke-width="6"/>
      <line x1="180" y1="156" x2="180" y2="276" stroke="#450a0a" stroke-width="5"/>
      <line x1="220" y1="156" x2="220" y2="276" stroke="#450a0a" stroke-width="5"/>
      <line x1="140" y1="198" x2="260" y2="198" stroke="#450a0a" stroke-width="5"/>
      <line x1="140" y1="236" x2="260" y2="236" stroke="#450a0a" stroke-width="5"/>
      <!-- Base & Tassel -->
      <path d="M128 276 Q200 288 272 276 L256 295 Q200 304 144 295 Z" fill="#7f1d1d"/>
      <rect x="192" y="297" width="16" height="12" rx="3" fill="#d97706"/>
      <path d="M195 309 L188 346 L212 346 L205 309 Z" fill="#dc2626"/>
    `;
    }
    if (m.includes("chill") || m.includes("flame")) {
      return `
      <!-- Chill Flame Torch -->
      <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="14" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Torch Handle -->
      <path d="M185 220 L174 345 L226 345 L215 220 Z" fill="#78350f"/>
      <line x1="178" y1="250" x2="222" y2="250" stroke="#10b981" stroke-width="6"/>
      <line x1="176" y1="285" x2="224" y2="285" stroke="#10b981" stroke-width="6"/>
      <line x1="175" y1="320" x2="225" y2="320" stroke="#10b981" stroke-width="6"/>
      <rect x="170" y="210" width="60" height="16" rx="5" fill="#475569"/>
      <!-- Green Flame with Glow -->
      <path d="M200 65 Q248 115 242 168 Q242 215 200 215 Q158 215 158 168 Q152 115 200 65 Z" fill="#10b981" filter="url(#flameGlow)"/>
      <path d="M200 90 Q232 132 227 175 Q227 210 200 210 Q173 210 173 175 Q168 132 200 90 Z" fill="#34d399"/>
      <path d="M200 125 Q218 152 215 185 Q215 205 200 205 Q185 205 185 185 Q182 152 200 125 Z" fill="#a7f3d0"/>
      <!-- Cool Sunglasses -->
      <g transform="translate(160, 148)">
        <path d="M5 5 L35 5 L30 25 L8 25 Z" fill="#0f172a"/>
        <line x1="8" y1="9" x2="28" y2="9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="35" y="8" width="10" height="4" fill="#0f172a"/>
        <path d="M45 5 L75 5 L72 25 L50 25 Z" fill="#0f172a"/>
        <line x1="48" y1="9" x2="68" y2="9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    `;
    }
    if (m.includes("snoop") || m.includes("dogg")) {
      return `
      <!-- Snoop Dogg Blue Cyber Bulldog -->
      <ellipse cx="200" cy="205" rx="65" ry="55" fill="#2563eb"/>
      <ellipse cx="170" cy="235" rx="30" ry="25" fill="#1d4ed8"/>
      <ellipse cx="230" cy="235" rx="30" ry="25" fill="#1d4ed8"/>
      <path d="M190 215 L210 215 L200 228 Z" fill="#091e42"/>
      <path d="M140 170 Q120 185 130 215 Q145 200 148 180 Z" fill="#1e40af"/>
      <path d="M260 170 Q280 185 270 215 Q255 200 252 180 Z" fill="#1e40af"/>
      <path d="M135 175 Q200 120 265 175 Q200 160 135 175 Z" fill="#1d4ed8"/>
      <rect x="155" y="165" width="90" height="15" rx="4" fill="#1e3a8a"/>
      <rect x="150" y="188" width="42" height="22" rx="4" fill="#020617"/>
      <rect x="195" y="195" width="10" height="5" fill="#020617"/>
      <rect x="208" y="188" width="42" height="22" rx="4" fill="#020617"/>
      <line x1="154" y1="193" x2="186" y2="193" stroke="#60a5fa" stroke-width="2"/>
      <line x1="212" y1="193" x2="244" y2="193" stroke="#60a5fa" stroke-width="2"/>
      <path d="M165 265 Q200 305 235 265" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
      <circle cx="200" cy="295" r="12" fill="#fbbf24"/>
    `;
    }
    if (m.includes("sock")) {
      return `
      <!-- Fresh Socks Cactus Socks -->
      <g transform="translate(130, 115) rotate(-8 30 100)">
        <path d="M15 15 L50 15 L50 120 Q50 155 25 155 Q5 155 10 130 L15 15 Z" fill="#22c55e"/>
        <line x1="25" y1="20" x2="22" y2="130" stroke="#16a34a" stroke-width="3"/>
        <line x1="38" y1="20" x2="38" y2="130" stroke="#16a34a" stroke-width="3"/>
        <path d="M10 115 Q5 140 25 145 L15 110 Z" fill="#ec4899"/>
        <rect x="14" y="10" width="37" height="12" rx="3" fill="#f43f5e"/>
        <circle cx="32" cy="8" r="8" fill="#facc15"/>
        <circle cx="32" cy="8" r="5" fill="#e11d48"/>
      </g>
      <g transform="translate(195, 115) rotate(8 30 100)">
        <path d="M15 15 L50 15 L50 120 Q50 155 25 155 Q5 155 10 130 L15 15 Z" fill="#22c55e"/>
        <line x1="25" y1="20" x2="22" y2="130" stroke="#16a34a" stroke-width="3"/>
        <line x1="38" y1="20" x2="38" y2="130" stroke="#16a34a" stroke-width="3"/>
        <path d="M45 115 Q55 140 35 145 L45 110 Z" fill="#ec4899"/>
        <rect x="14" y="10" width="37" height="12" rx="3" fill="#f43f5e"/>
        <circle cx="32" cy="8" r="8" fill="#facc15"/>
        <circle cx="32" cy="8" r="5" fill="#e11d48"/>
      </g>
    `;
    }
    if (m.includes("pepe")) {
      return `
      <!-- Plush Pepe -->
      <ellipse cx="200" cy="210" rx="70" ry="55" fill="#10b981"/>
      <circle cx="165" cy="165" r="24" fill="#ffffff"/>
      <circle cx="235" cy="165" r="24" fill="#ffffff"/>
      <circle cx="168" cy="165" r="12" fill="#047857"/>
      <circle cx="170" cy="162" r="5" fill="#ffffff"/>
      <circle cx="238" cy="165" r="12" fill="#047857"/>
      <circle cx="240" cy="162" r="5" fill="#ffffff"/>
      <path d="M165 230 Q200 242 235 230" fill="none" stroke="#047857" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="145" cy="220" rx="14" ry="8" fill="#f43f5e" opacity="0.4"/>
      <ellipse cx="255" cy="220" rx="14" ry="8" fill="#f43f5e" opacity="0.4"/>
      <path d="M170 142 L180 115 L200 135 L220 115 L230 142 Z" fill="#facc15" stroke="#b45309" stroke-width="2"/>
    `;
    }
    if (m.includes("cake")) {
      return `
      <!-- Delicious Cake -->
      <path d="M120 250 L280 250 L260 170 L140 170 Z" fill="#78350f"/>
      <path d="M115 210 Q200 220 285 210 L285 200 Q200 210 115 200 Z" fill="#f472b6"/>
      <path d="M130 170 Q200 160 270 170 L265 155 Q200 145 135 155 Z" fill="#ec4899"/>
      <path d="M130 170 Q145 190 155 170 Q170 195 185 170 Q200 195 215 170 Q230 190 245 170 Q255 185 270 170" fill="#fbcfe8"/>
      <rect x="195" y="110" width="10" height="45" rx="3" fill="#60a5fa"/>
      <path d="M200 85 Q208 100 200 110 Q192 100 200 85 Z" fill="#f59e0b"/>
      <circle cx="200" cy="98" r="4" fill="#fef08a"/>
    `;
    }
    if (m.includes("heart")) {
      return `
      <!-- Heart of Gold -->
      <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <path d="M200 110 C175 70 120 70 120 130 C120 185 200 255 200 255 C200 255 280 185 280 130 C280 70 225 70 200 110 Z" fill="#f59e0b" filter="url(#heartGlow)"/>
      <path d="M200 120 C180 85 135 85 135 135 C135 180 200 240 200 240 C200 240 265 180 265 135 C265 85 220 85 200 120 Z" fill="#fbbf24"/>
      <line x1="200" y1="120" x2="200" y2="240" stroke="#fef08a" stroke-width="4"/>
      <line x1="160" y1="135" x2="200" y2="180" stroke="#d97706" stroke-width="3"/>
      <line x1="240" y1="135" x2="200" y2="180" stroke="#fef08a" stroke-width="3"/>
      <polygon points="170,105 174,115 184,119 174,123 170,133 166,123 156,119 166,115" fill="#ffffff"/>
      <polygon points="230,150 233,158 241,161 233,164 230,172 227,164 219,161 227,158" fill="#ffffff"/>
    `;
    }
    if (m.includes("cap") || m.includes("durov")) {
      return `
      <!-- Durov Cap -->
      <path d="M130 200 Q200 130 270 200 L290 220 Q200 215 110 220 Z" fill="#0f172a"/>
      <path d="M110 220 Q200 210 290 220 L310 240 Q200 248 90 240 Z" fill="#020617"/>
      <g transform="translate(182, 168) scale(0.9)">
        <polygon points="2,18 36,4 28,32 18,24" fill="#ffffff"/>
        <polygon points="18,24 28,32 20,38" fill="#cbd5e1"/>
      </g>
    `;
    }
    // Default Crystal Shard
    return `
    <g transform="translate(140, 110)">
      <polygon points="60,10 110,60 85,170 35,170 10,60" fill="#f43f5e" opacity="0.9"/>
      <polygon points="60,10 85,170 35,170" fill="#fb7185"/>
      <polygon points="60,10 110,60 85,170" fill="#be123c"/>
      <polygon points="60,10 35,170 10,60" fill="#e11d48"/>
      <line x1="60" y1="10" x2="60" y2="170" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
    </g>
  `;
  }
  function generateGiftSvg(name: string, model: string, backdropColor: string, symbol: string): string {
    const escape = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
          })[c]!,
      );
    name = escape(name);
    model = escape(model);
    symbol = escape(symbol);
    if (!/^#[0-9a-f]{6}$/i.test(backdropColor)) backdropColor = "#7957d5";
    const graphic = getModelIllustration(model);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <pattern id="pat" width="48" height="48" patternUnits="userSpaceOnUse" opacity="0.13">
        <circle cx="24" cy="24" r="3.5" fill="#ffffff"/>
        <path d="M12 16 L16 12 M32 36 L36 32" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="36" r="2" fill="#ffffff"/>
        <circle cx="36" cy="12" r="2" fill="#ffffff"/>
      </pattern>
      <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="${backdropColor}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${backdropColor}" stop-opacity="0.80"/>
      </radialGradient>
    </defs>
    
    <!-- Backdrop with wallpaper pattern -->
    <rect width="400" height="400" rx="38" fill="url(#bgGlow)"/>
    <rect width="400" height="400" rx="38" fill="url(#pat)"/>
    
    <!-- Top-left authentic Telegram 4-leaf clover badge -->
    <g transform="translate(24, 24)">
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.22)"/>
      <path d="M20 12 C18 9 14 9 14 13 C14 16 20 20 20 20 C20 20 26 16 26 13 C26 9 22 9 20 12 Z M12 20 C9 18 9 14 13 14 C16 14 20 20 20 20 C20 20 16 26 13 26 C9 26 9 22 12 20 Z M20 28 C18 31 14 31 14 27 C14 24 20 20 20 20 C20 20 26 24 26 27 C26 31 22 31 20 28 Z M28 20 C31 18 31 14 27 14 C24 14 20 20 20 20 C20 20 24 26 27 26 C31 26 31 22 28 20 Z" fill="#ffffff"/>
    </g>
    
    <!-- Main Model Art -->
    ${graphic}
  </svg>`;
    const base64 = typeof Buffer !== "undefined" ? Buffer.from(svg).toString("base64") : btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }
  const FIXTURE_GIFTS: Array<{
    address: string;
    name: string;
    model: string;
    backdrop: string;
    backdropColor: string;
    symbol: string;
    rarity: string;
    itemNum: number;
    priceTon: number;
    image?: string;
    lottieUrl?: string;
    tgsUrl?: string;
  }> = [
    {
      address: "EQ_demo_homemade_cake_101",
      name: "Homemade Cake",
      itemNum: 101,
      model: "Homemade Cake",
      backdrop: "Rose",
      backdropColor: "#b55986",
      symbol: "Star",
      rarity: "Rare",
      priceTon: 0.8,
    },
    {
      address: "EQ_mirage_lamp_37121_m7a8c90",
      name: "Mirage Lamp",
      model: "Mirage Lamp",
      backdrop: "Amber Dusk",
      backdropColor: "#c44d34",
      symbol: "Lantern",
      rarity: "0.03% Mythic",
      itemNum: 37121,
      priceTon: 2.4,
      image: "/gifts/miragelamp.webp",
      lottieUrl: "/gifts/miragelamp.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/candlelamp-1.tgs",
    },
    {
      address: "EQ_chill_flame_241890_f1b2c3d",
      name: "Chill Flame",
      model: "Chill Flame",
      backdrop: "Purple Haze",
      backdropColor: "#6b3ba7",
      symbol: "Torch",
      rarity: "0.19% Epic",
      itemNum: 241890,
      priceTon: 0.85,
      image: "/gifts/chillflame.webp",
      lottieUrl: "/gifts/chillflame.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/chillflame-353717.tgs",
    },
    {
      address: "EQ_snoop_dogg_4200_s9d8f7a",
      name: "Snoop Dogg",
      model: "Snoop Dogg",
      backdrop: "Gunmetal",
      backdropColor: "#2e3540",
      symbol: "Bulldog",
      rarity: "0.01% Unique",
      itemNum: 4200,
      priceTon: 1.7,
      image: "/gifts/snoopdogg.webp",
      lottieUrl: "/gifts/snoopdogg.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/snoopdogg-84867.tgs",
    },
    {
      address: "EQ_fresh_socks_120430_k4m5n6p",
      name: "Fresh Socks",
      model: "Fresh Socks",
      backdrop: "Cactus Grove",
      backdropColor: "#529944",
      symbol: "Socks",
      rarity: "0.22% Rare",
      itemNum: 120430,
      priceTon: 0.45,
      image: "/gifts/freshsocks.webp",
      lottieUrl: "/gifts/freshsocks.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/freshsocks-120430.tgs",
    },
    {
      address: "EQB_astral_shard_421_x9f8e21a",
      name: "Astral Shard",
      model: "Astral Shard",
      backdrop: "Crimson Eclipse",
      backdropColor: "#f43f5e",
      symbol: "Nebula",
      rarity: "0.08% Mythic",
      itemNum: 421,
      priceTon: 1.4,
      image: "/gifts/astralshard.webp",
      lottieUrl: "/gifts/astralshard.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/astralshard-421.tgs",
    },
    {
      address: "EQC_plush_pepe_1337_k7b2c90e",
      name: "Plush Pepe",
      model: "Plush Pepe",
      backdrop: "Cyber Green",
      backdropColor: "#10b981",
      symbol: "Crown",
      rarity: "0.02% Legendary",
      itemNum: 1337,
      priceTon: 2.1,
      image: "/gifts/plushpepe.webp",
      lottieUrl: "/gifts/plushpepe.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/plushpepe-1337.tgs",
    },
    {
      address: "EQF_durov_cap_555_t8u2j19p",
      name: "Durov's Cap",
      model: "Durov's Cap",
      backdrop: "Midnight Noir",
      backdropColor: "#1e293b",
      symbol: "Telegram Star",
      rarity: "0.05% Mythic",
      itemNum: 555,
      priceTon: 1.85,
      image: "/gifts/durovscap.webp",
      lottieUrl: "/gifts/durovscap.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/durovscap-1.tgs",
    },
    {
      address: "EQ_signet_ring_888_m2k9r10x",
      name: "Signet Ring",
      model: "Signet Ring",
      backdrop: "Solar Gold",
      backdropColor: "#d97706",
      symbol: "Seal",
      rarity: "0.07% Legendary",
      itemNum: 888,
      priceTon: 1.25,
      image: "/gifts/signetring.webp",
      lottieUrl: "/gifts/signetring.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/signetring-1.tgs",
    },
    {
      address: "EQ_crystal_ball_707_c3v8b21w",
      name: "Crystal Ball",
      model: "Crystal Ball",
      backdrop: "Mystic Violet",
      backdropColor: "#7c3aed",
      symbol: "Future",
      rarity: "0.11% Epic",
      itemNum: 707,
      priceTon: 1.1,
      image: "/gifts/crystalball.webp",
      lottieUrl: "/gifts/crystalball.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/crystalball-1.tgs",
    },
    {
      address: "EQH_magic_potion_999_p1m6v40q",
      name: "Magic Potion",
      model: "Magic Potion",
      backdrop: "Amethyst Glow",
      backdropColor: "#a855f7",
      symbol: "Alchemy",
      rarity: "0.25% Rare",
      itemNum: 999,
      priceTon: 0.65,
      image: "/gifts/magicpotion.webp",
      lottieUrl: "/gifts/magicpotion.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/magicpotion-1.tgs",
    },
    {
      address: "EQ_party_sparkler_312_p9x4r12t",
      name: "Party Sparkler",
      model: "Party Sparkler",
      backdrop: "Neon Festive",
      backdropColor: "#f59e0b",
      symbol: "Spark",
      rarity: "0.35% Uncommon",
      itemNum: 312,
      priceTon: 0.35,
      image: "/gifts/partysparkler.webp",
      lottieUrl: "/gifts/partysparkler.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/partysparkler-1.tgs",
    },
    {
      address: "EQ_santa_hat_2025_h7y2m90k",
      name: "Santa Hat",
      model: "Santa Hat",
      backdrop: "Winter Ruby",
      backdropColor: "#e11d48",
      symbol: "Holiday",
      rarity: "0.20% Rare",
      itemNum: 2025,
      priceTon: 0.7,
      image: "/gifts/santahat.webp",
      lottieUrl: "/gifts/santahat.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/santahat-1.tgs",
    },
    {
      address: "EQI_eternal_rose_333_z7x2r81n",
      name: "Eternal Rose",
      model: "Eternal Rose",
      backdrop: "Ruby Glass",
      backdropColor: "#e11d48",
      symbol: "Petal",
      rarity: "0.18% Epic",
      itemNum: 333,
      priceTon: 0.9,
      image: "/gifts/eternalrose.webp",
      lottieUrl: "/gifts/eternalrose.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/eternalrose-1.tgs",
    },
    {
      address: "EQN_easter_egg_104_e5t2y89k",
      name: "Easter Egg",
      model: "Easter Egg",
      backdrop: "Pastel Spring",
      backdropColor: "#38bdf8",
      symbol: "Spring",
      rarity: "0.15% Epic",
      itemNum: 104,
      priceTon: 0.55,
      image: "/gifts/easteregg.webp",
      lottieUrl: "/gifts/easteregg.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/easteregg-1.tgs",
    },
    {
      address: "EQO_valentine_box_777_v8b2n11q",
      name: "Valentine Box",
      model: "Valentine Box",
      backdrop: "Sweet Romance",
      backdropColor: "#ec4899",
      symbol: "Love",
      rarity: "0.09% Mythic",
      itemNum: 777,
      priceTon: 1.15,
      image: "/gifts/valentinebox.webp",
      lottieUrl: "/gifts/valentinebox.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/valentinebox-1.tgs",
    },
    {
      address: "EQP_candy_cane_404_c9m3k20z",
      name: "Candy Cane",
      model: "Candy Cane",
      backdrop: "Sugar Frost",
      backdropColor: "#ef4444",
      symbol: "Sweet",
      rarity: "0.28% Rare",
      itemNum: 404,
      priceTon: 0.48,
      image: "/gifts/candycane.webp",
      lottieUrl: "/gifts/candycane.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/candycane-1.tgs",
    },
    {
      address: "EQQ_diamond_ring_505_d1f7h99w",
      name: "Diamond Ring",
      model: "Diamond Ring",
      backdrop: "Diamond Brilliance",
      backdropColor: "#06b6d4",
      symbol: "Diamond",
      rarity: "0.02% Legendary",
      itemNum: 505,
      priceTon: 2.6,
      image: "/gifts/diamondring.webp",
      lottieUrl: "/gifts/diamondring.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/diamondring-1.tgs",
    },
    {
      address: "EQR_flying_broom_666_b4n8m22l",
      name: "Flying Broom",
      model: "Flying Broom",
      backdrop: "Magic Dusk",
      backdropColor: "#8b5cf6",
      symbol: "Flight",
      rarity: "0.12% Epic",
      itemNum: 666,
      priceTon: 0.95,
      image: "/gifts/flyingbroom.webp",
      lottieUrl: "/gifts/flyingbroom.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/flyingbroom-1.tgs",
    },
    {
      address: "EQS_witch_hat_808_w2j6k90p",
      name: "Witch Hat",
      model: "Witch Hat",
      backdrop: "Occult Night",
      backdropColor: "#1e1b4b",
      symbol: "Sorcery",
      rarity: "0.14% Epic",
      itemNum: 808,
      priceTon: 1.0,
      image: "/gifts/witchhat.webp",
      lottieUrl: "/gifts/witchhat.lottie.json",
      tgsUrl: "https://nft.fragment.com/gift/witchhat-1.tgs",
    },
  ];
  const fallbackFx = (): M_lib_pricing_i1 => ({
    // All rates use RUB per unit. 1 USD = 41.5 UAH, not 41.5 RUB per UAH.
    rates: {
      RUB: "1",
      USD: "95",
      UAH: new M_lib_pricing_i0(95).div("41.5").toString(),
      USDT: "95",
    },
    updatedAt: Math.floor(Date.now() / 1000),
    fetchedAt: Date.now(),
    source: "manual",
  });
  let cachedGiftFx:
    | {
        value: M_lib_pricing_i1;
        until: number;
      }
    | undefined;
  let pendingGiftFx: Promise<M_lib_pricing_i1> | undefined;
  async function giftFx() {
    if (cachedGiftFx && Date.now() < cachedGiftFx.until) return cachedGiftFx.value;
    if (pendingGiftFx) return pendingGiftFx;
    pendingGiftFx = (async () => {
      const value = (await M_lib_pricing.optionalFx()) ?? fallbackFx();
      cachedGiftFx = {value, until: Date.now() + 60000};
      return value;
    })();
    try {
      return await pendingGiftFx;
    } finally {
      pendingGiftFx = undefined;
    }
  }
  function prices(baseTon: M_lib_pricing_i0.Value, fx: M_lib_pricing_i1, binance: BinanceOnlinePrices) {
    const usd = new M_lib_pricing_i0(baseTon).mul(binance.tonUsdt);
    const retail = M_lib_gifts_marketapp_i2(usd, "USD", fx, binance.tonUsdt, process.env.STARS_USDT_PER_STAR || "0.015");
    const gram = new M_lib_pricing_i0(retail.TON);
    return {
      priceTon: Number(retail.TON),
      priceUsdt: retail.USDT,
      priceUah: retail.UAH,
      priceStars: retail.XTR,
      priceGram: gram.toNumber(),
      rentPerDayUah: Math.ceil(retail.UAH * 0.03),
      rentPerWeekUah: Math.ceil(retail.UAH * 0.1),
      rentPerMonthUah: Math.ceil(retail.UAH * 0.25),
      rentPerDayGram: gram.mul("0.03").toNumber(),
      rentPerWeekGram: gram.mul("0.1").toNumber(),
      rentPerMonthGram: gram.mul("0.25").toNumber(),
    };
  }
  export function normalizeMarketGift(raw: MarketAppGift, fx: M_lib_pricing_i1, binance: BinanceOnlinePrices): NormalizedGift {
    if (!raw || typeof raw.address !== "string" || !raw.address || raw.is_restricted) throw Error("invalid_gift");
    const currency = raw.currency?.toUpperCase();
    if (currency !== "TON" && currency !== "GRAM" && currency !== "USDT") throw Error("unsupported_currency");
    const bid = new M_lib_pricing_i0(raw.min_bid);
    if (!bid.isFinite() || bid.lte(0) || !bid.isInteger()) throw Error("invalid_bid");
    // Provider atomic units: TON has 9 decimals; USDT has 6. Never guess by amount.
    const ton = currency !== "USDT" ? bid.div(1e9) : bid.div(1e6).div(binance.tonUsdt);
    const attrs: Record<string, string | number> = {};
    for (const a of raw.attributes ?? []) {
      if (a && typeof a.trait_type === "string" && (typeof a.value === "string" || typeof a.value === "number")) {
        const key = a.trait_type.toLowerCase();
        attrs[key[0]?.toUpperCase() + key.slice(1)] = a.value;
      }
    }
    const model = String(attrs.Model ?? raw.name ?? "Telegram Gift");
    const backdrop = String(attrs.Backdrop ?? "Standard");
    const symbol = String(attrs.Symbol ?? "Star");
    const rarity = String(attrs.Rarity ?? "Unknown");
    return {
      id: raw.address,
      address: raw.address,
      name: raw.name || model,
      collection: raw.name?.replace(/\s*#\d+$/, "") || model,
      collectionAddress: raw.collection_address,
      itemNum: raw.item_num,
      attributes: {
        ...attrs,
        Model: model,
        Backdrop: backdrop,
        Symbol: symbol,
        Rarity: rarity,
      },
      model,
      backdrop,
      symbol,
      rarity,
      ...prices(ton, fx, binance),
      image: generateGiftSvg(model, model, "#7957d5", symbol),
      owner: raw.owner,
      listedAt: (raw.listed_at ?? 0) * 1000,
      isLive: true,
      baseNano: currency === "USDT" ? undefined : bid.toFixed(0),
    };
  }
  export async function fetchGiftsOnSale(filter: GiftsFilter = {}): Promise<{
    items: NormalizedGift[];
    total: number;
    liveApi: boolean;
    tonRate: number;
    binance: BinanceOnlinePrices;
  }> {
    const [binance, fx] = await Promise.all([getBinanceOnlineRates(), giftFx()]);
    const token = process.env.MARKETAPP_API_TOKEN?.trim();
    const limit = Number.isFinite(filter.limit) ? Math.min(100, Math.max(1, Math.floor(filter.limit!))) : 30;
    let liveApi = false;
    let items: NormalizedGift[] = [];
    if (token) {
      try {
        const params = new URLSearchParams({limit: String(limit)});
        if (filter.model) params.set("model", filter.model);
        if (filter.backdrop) params.set("backdrop", filter.backdrop);
        if (filter.sortBy === "price_asc") params.set("sort_by", "min_bid_asc");
        if (filter.sortBy === "price_desc") params.set("sort_by", "min_bid_desc");
        const response = await fetch(`https://api.marketapp.org/v1/gifts/onsale/?${params}`, {
          headers: {Authorization: token, Accept: "application/json"},
          next: {revalidate: 30},
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw Error("market_unavailable");
        const json = await response.json();
        if (!Array.isArray(json.items)) throw Error("invalid_catalog");
        items = json.items.flatMap((raw: MarketAppGift) => {
          try {
            return [normalizeMarketGift(raw, fx, binance)];
          } catch {
            return [];
          }
        });
        liveApi = json.items.length === 0 || items.length > 0;
      } catch {
        /* Timeouts, limits, invalid credentials and malformed data use the SVG catalog. */
      }
    }
    if (liveApi) items = items.filter((g) => !!g.baseNano);
    if (!liveApi)
      items = FIXTURE_GIFTS.map((g) => ({
        id: g.address,
        address: g.address,
        name: `${g.name} #${g.itemNum}`,
        collection: g.name,
        collectionAddress: "",
        itemNum: g.itemNum,
        attributes: {
          Model: g.model,
          Backdrop: g.backdrop,
          Symbol: g.symbol,
          Rarity: g.rarity,
        },
        model: g.model,
        backdrop: g.backdrop,
        symbol: g.symbol,
        rarity: g.rarity,
        ...prices(g.priceTon, fx, binance),
        image: generateGiftSvg(g.name, g.model, g.backdropColor, g.symbol),
        owner: "",
        listedAt: 0,
        isLive: false,
        lottieUrl: g.lottieUrl,
        tgsUrl: g.tgsUrl,
      }));
    if (filter.search) {
      const q = filter.search.trim().toLowerCase();
      items = items.filter((i) => [i.name, i.model, i.backdrop, i.symbol, String(i.itemNum)].some((v) => v.toLowerCase().includes(q)));
    }
    if (filter.model) items = items.filter((i) => i.model.toLowerCase() === filter.model?.toLowerCase());
    if (filter.backdrop) items = items.filter((i) => i.backdrop.toLowerCase() === filter.backdrop?.toLowerCase());
    if (filter.sortBy === "price_asc") items.sort((a, b) => a.priceTon - b.priceTon);
    if (filter.sortBy === "price_desc") items.sort((a, b) => b.priceTon - a.priceTon);
    if (filter.sortBy === "number_asc") items.sort((a, b) => (a.itemNum ?? Infinity) - (b.itemNum ?? Infinity));
    return {
      items: items.slice(0, limit),
      total: items.length,
      liveApi,
      tonRate: binance.tonUsdt,
      binance,
    };
  }
  export async function fetchGiftByAddress(address: string): Promise<NormalizedGift | null> {
    const {items} = await fetchGiftsOnSale({limit: 100});
    return items.find((i) => i.address === address || i.id === address) ?? null;
  }
}
// lib/commerce/checkout.ts
namespace M_lib_commerce_checkout {
  export type CartLine = {
    kind: "product" | "market" | "smm" | "gift";
    id: string;
    quantity: number;
    link?: string;
  };
  export type PricedLine = CartLine & {
    productId: string;
    title: string;
    prices: {
      UAH: number;
      USDT: number;
    };
    mode: "MANUAL" | "INVENTORY" | "PROVIDER";
    provider: string | null;
    requestData: M_lib_commerce_core_i1.InputJsonObject;
  };
  export function parseCart(raw: unknown): CartLine[] {
    if (!Array.isArray(raw) || !raw.length || raw.length > 20) throw new M_lib_commerce_core.ShopError("invalid_cart");
    const seen = new Set<string>();
    return raw.map((v) => {
      if (
        !v ||
        typeof v !== "object" ||
        !["product", "market", "smm", "gift"].includes(v.kind) ||
        typeof v.id !== "string" ||
        v.id.length > 100 ||
        !Number.isSafeInteger(v.quantity) ||
        v.quantity < 1 ||
        v.quantity > 10000000
      )
        throw new M_lib_commerce_core.ShopError("invalid_cart");
      if (v.kind === "gift" && v.quantity !== 1) throw new M_lib_commerce_core.ShopError("unique_quantity");
      if (v.kind !== "smm" && v.link !== undefined) throw new M_lib_commerce_core.ShopError("invalid_cart");
      const key = `${v.kind}:${v.id}:${v.link ?? ""}`;
      if (seen.has(key)) throw new M_lib_commerce_core.ShopError("duplicate_cart_line");
      seen.add(key);
      return {
        kind: v.kind,
        id: v.id,
        quantity: v.quantity,
        ...(typeof v.link === "string" ? {link: v.link.slice(0, 2048)} : {}),
      };
    });
  }
  export function cartHash(lines: CartLine[], currency: string, mode: string) {
    return M_lib_nft_i0("sha256").update(JSON.stringify({lines, currency, mode})).digest("hex");
  }
  async function ensureCategory(slug: string) {
    return M_lib_db.db.category.upsert({
      where: {slug},
      create: {slug, active: true},
      update: {},
    });
  }
  export async function priceCart(lines: CartLine[], locale: M_lib_catalog_i1): Promise<PricedLine[]> {
    const out: PricedLine[] = [];
    for (const line of lines) {
      if (line.kind === "smm") {
        const quote = await M_lib_smm_catalog.smmQuote(line.id, line.quantity, line.link ?? ""),
          service = await M_lib_smm_provider.supplierService(line.id),
          category = await ensureCategory("smm");
        const product = await M_lib_db.db.product.upsert({
          where: {
            provider_providerProductId: {
              provider: "smm-v2",
              providerProductId: service.id,
            },
          },
          create: {
            slug: `smm-${line.id}`,
            categoryId: category.id,
            kind: "SERVICE",
            fulfillmentMode: "PROVIDER",
            price: service.rate,
            currency: "USD",
            provider: "smm-v2",
            providerProductId: service.id,
            minQuantity: service.min,
            maxQuantity: service.max,
            active: true,
          },
          update: {},
        });
        if (!product.active || !category.active) throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
        out.push({
          ...line,
          link: quote.link,
          productId: product.id,
          title: service.name,
          prices: quote.prices,
          mode: "PROVIDER",
          provider: "smm-v2",
          requestData: {
            link: quote.link,
            serviceKey: service.key,
            providerServiceId: service.id,
            fingerprint: M_lib_smm_provider.fingerprint(),
            supplierCurrency: service.currency,
            maxCharge: new M_lib_pricing_i0(service.rate).mul(line.quantity).div(1000).toString(),
          },
        });
      } else if (line.kind === "market") {
        if (line.quantity !== 1) throw new M_lib_commerce_core.ShopError("unique_quantity");
        M_lib_commerce_encryption.encryptionReady();
        const item = await M_lib_commerce_market.marketItem(line.id),
          category = await ensureCategory(item.category);
        const product = await M_lib_db.db.product.upsert({
          where: {
            provider_providerProductId: {
              provider: "lzt",
              providerProductId: item.id,
            },
          },
          create: {
            slug: `lzt-${item.id}`,
            categoryId: category.id,
            kind: "UNIQUE",
            fulfillmentMode: "PROVIDER",
            price: new M_lib_pricing_i0(item.prices.USDT).div(100).toString(),
            currency: "USDT",
            provider: "lzt",
            providerProductId: item.id,
            active: true,
          },
          update: {},
        });
        if (!product.active || !category.active) throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
        out.push({
          ...line,
          productId: product.id,
          title: item.title,
          prices: item.prices,
          mode: "PROVIDER",
          provider: "lzt",
          requestData: {
            sourceAmount: item.sourceAmount,
            sourceCurrency: item.sourceCurrency,
            providerItemId: item.id,
          },
        });
      } else if (line.kind === "gift") {
        if (line.quantity !== 1) throw new M_lib_commerce_core.ShopError("unique_quantity");
        M_lib_commerce_encryption.encryptionReady();
        const gift = await M_lib_gifts_marketapp.fetchGiftByAddress(line.id);
        if (!gift || !gift.isLive) throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
        const category = await ensureCategory("nft-gifts");
        const product = await M_lib_db.db.product.upsert({
          where: {
            provider_providerProductId: {
              provider: "marketapp",
              providerProductId: gift.address,
            },
          },
          create: {
            slug: `gift-${gift.address.slice(0, 32)}`,
            categoryId: category.id,
            kind: "UNIQUE",
            fulfillmentMode: "PROVIDER",
            price: new M_lib_pricing_i0(gift.priceUsdt).div(100).toString(),
            currency: "USDT",
            provider: "marketapp",
            providerProductId: gift.address,
            active: true,
          },
          update: {},
        });
        if (!product.active || !category.active) throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
        out.push({
          ...line,
          productId: product.id,
          title: gift.name,
          prices: {UAH: gift.priceUah, USDT: gift.priceUsdt},
          mode: "PROVIDER",
          provider: "marketapp",
          requestData: {
            giftAddress: gift.address,
            itemNum: gift.itemNum ?? 0,
            model: gift.model,
            priceTon: gift.priceTon,
            priceStars: gift.priceStars,
          },
        });
      } else {
        const product = await M_lib_db.db.product.findUnique({
          where: {id: line.id},
          include: {category: true, translations: true},
        });
        if (!product?.active || !product.category.active) throw new M_lib_commerce_core.ShopError("item_unavailable", 409);
        if (product.fulfillmentMode === "PROVIDER") throw new M_lib_commerce_core.ShopError("invalid_cart_route");
        if (line.quantity < product.minQuantity || line.quantity > product.maxQuantity)
          throw new M_lib_commerce_core.ShopError("invalid_quantity");
        if (product.kind === "UNIQUE" && line.quantity !== 1) throw new M_lib_commerce_core.ShopError("unique_quantity");
        if (product.fulfillmentMode === "INVENTORY") M_lib_commerce_encryption.encryptionReady();
        out.push({
          ...line,
          productId: product.id,
          title: product.translations.find((t) => t.locale === locale)?.title ?? product.slug,
          prices: M_lib_smm_jobs_i1(
            new M_lib_pricing_i0(product.price).mul(line.quantity).toString(),
            product.currency,
            await M_lib_pricing.getFx(),
            M_lib_pricing.marketMarkup(),
          ),
          mode: product.fulfillmentMode,
          provider: product.provider,
          requestData: {productVersion: product.version},
        });
      }
    }
    return out;
  }
  export async function paidEffects(tx: M_lib_commerce_core_i1.TransactionClient, orderId: string) {
    const order = await tx.order.findUniqueOrThrow({
      where: {id: orderId},
      include: {
        items: {include: {product: true, inventory: true}},
        user: true,
      },
    });
    if (!["PAID", "FULFILLING"].includes(order.status) || !order.paidAt) throw new M_lib_commerce_core.ShopError("order_not_paid", 409);
    for (const item of order.items) {
      const d = (item.requestData ?? {}) as Record<string, string>;
      if (item.fulfillmentMode === "INVENTORY" && item.fulfillmentStatus === "PENDING") {
        const payloads = item.inventory.map((v) => M_lib_commerce_encryption.decrypt(v.encryptedPayload, `inventory:${v.productId}`));
        if (payloads.length !== item.quantity) throw new M_lib_commerce_core.ShopError("inventory_mismatch", 409);
        await tx.inventoryItem.updateMany({
          where: {orderItemId: item.id, status: "RESERVED"},
          data: {status: "SOLD", soldAt: new Date(), reservedUntil: null},
        });
        await tx.orderItem.update({
          where: {id: item.id},
          data: {
            encryptedDelivery: M_lib_commerce_encryption.encrypt(payloads.join("\n\n"), `delivery:${item.id}`),
            fulfillmentStatus: "DELIVERED",
            deliveredAt: new Date(),
          },
        });
        if (order.user.telegramId)
          await tx.notification.upsert({
            where: {deduplicationKey: `delivery:${item.id}`},
            update: {},
            create: {
              telegramId: order.user.telegramId,
              orderId,
              kind: "DELIVERY",
              text: `Legit Assets · ${item.titleSnapshot}\nВидача готова / Delivery ready`,
              deduplicationKey: `delivery:${item.id}`,
            },
          });
      } else if (item.provider === "smm-v2") {
        await tx.smmJob.upsert({
          where: {orderItemId: item.id},
          update: {},
          create: {
            orderItemId: item.id,
            serviceKey: d.serviceKey,
            providerServiceId: d.providerServiceId,
            providerFingerprint: d.fingerprint,
            targetLink: d.link,
            quantity: item.quantity,
            maxCharge: d.maxCharge,
            providerCurrency: d.supplierCurrency,
          },
        });
      } else if (item.provider === "lzt") {
        await tx.fulfillmentJob.upsert({
          where: {orderItemId: item.id},
          update: {},
          create: {orderItemId: item.id},
        });
      } else if (item.provider === "marketapp") {
        await tx.orderItem.update({where: {id: item.id}, data: {fulfillmentStatus: "FAILED"}});
      }
    }
    const remaining = await tx.orderItem.count({
      where: {orderId, fulfillmentStatus: {not: "DELIVERED"}},
    });
    await tx.order.update({
      where: {id: orderId},
      data: {
        status: order.items.some((item) => item.provider === "marketapp") ? "NEEDS_REVIEW" : remaining ? "FULFILLING" : "COMPLETED",
        ...(!remaining ? {completedAt: new Date()} : {}),
      },
    });
    if (order.user.telegramId)
      await tx.notification.upsert({
        where: {deduplicationKey: `paid:${orderId}`},
        update: {},
        create: {
          telegramId: order.user.telegramId,
          orderId,
          kind: "PAID",
          text: `Legit Assets · ${orderId}\n${new M_lib_pricing_i0(order.total).toFixed(2)} ${order.currency}\n${order.user.locale === "uk" ? "Оплату підтверджено" : order.user.locale === "ru" ? "Оплата подтверждена" : "Payment confirmed"}`,
          deduplicationKey: `paid:${orderId}`,
        },
      });
  }
  export async function createOrder(
    user: {
      id: string;
      channel: string;
      telegramId: bigint | null;
    },
    lines: CartLine[],
    locale: M_lib_catalog_i1,
    currency: "UAH" | "USDT",
    key: string,
    mode: "wallet" | "stars",
    expectedTotal?: number,
  ) {
    if (lines.some((line) => line.kind === "gift")) throw new M_lib_commerce_core.ShopError("nft_checkout_unavailable", 503);
    await M_lib_profile.requireOnboarded(user.id);
    M_lib_commerce_core.idempotency(key);
    if (mode === "wallet" && user.channel !== "WEB") throw new M_lib_commerce_core.ShopError("telegram_stars_required", 409);
    if (mode === "stars" && (user.channel !== "TMA" || !user.telegramId)) throw new M_lib_commerce_core.ShopError("telegram_required", 409);
    const hash = cartHash(lines, currency, mode);
    const prior = await M_lib_db.db.order.findUnique({
      where: {userId_idempotencyKey: {userId: user.id, idempotencyKey: key}},
    });
    if (prior) {
      if (prior.requestHash !== hash) throw new M_lib_commerce_core.ShopError("idempotency_conflict", 409);
      return prior;
    }
    if (lines.some((l) => l.kind === "smm") && process.env.SMM_LIVE_ORDERS_ENABLED !== "true")
      throw new M_lib_commerce_core.ShopError("supplier_checkout_disabled", 503);
    if (lines.some((l) => l.kind === "market") && process.env.MARKET_LIVE_ORDERS_ENABLED !== "true")
      throw new M_lib_commerce_core.ShopError("supplier_checkout_disabled", 503);
    const priced = await priceCart(lines, locale),
      totalMinor = priced.reduce((s, l) => s + l.prices[currency], 0);
    if (expectedTotal !== undefined && expectedTotal !== totalMinor) throw new M_lib_commerce_core.ShopError("price_changed", 409);
    if (!Number.isSafeInteger(totalMinor) || totalMinor < 1 || totalMinor > 100000000)
      throw new M_lib_commerce_core.ShopError("order_limit");
    return M_lib_commerce_core.atomic(async (tx) => {
      // Serializing on the buyer avoids concurrent overspending across wallet and checkout retries.
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id"=${user.id}`;
      const repeat = await tx.order.findUnique({
        where: {
          userId_idempotencyKey: {userId: user.id, idempotencyKey: key},
        },
      });
      if (repeat) {
        if (repeat.requestHash !== hash) throw new M_lib_commerce_core.ShopError("idempotency_conflict", 409);
        return repeat;
      }
      const total = new M_lib_pricing_i0(totalMinor).div(100),
        expires = new Date(Date.now() + 900000);
      const order = await tx.order.create({
        data: {
          userId: user.id,
          status: mode === "wallet" ? "PAID" : "PENDING",
          channel: mode === "wallet" ? "WEB" : "TMA",
          currency,
          total: total.toString(),
          idempotencyKey: key,
          requestHash: hash,
          ...(mode === "wallet" ? {paidAt: new Date()} : {}),
        },
      });
      for (const line of priced) {
        const product = await tx.product.findUnique({
          where: {id: line.productId},
          include: {category: true},
        });
        if (
          !product?.active ||
          !product.category.active ||
          (line.kind === "product" && product.version !== line.requestData.productVersion)
        )
          throw new M_lib_commerce_core.ShopError("price_changed", 409);
        const amount = new M_lib_pricing_i0(line.prices[currency]).div(100);
        const item = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            titleSnapshot: line.title,
            quantity: line.quantity,
            unitPrice: amount.div(line.quantity).toDecimalPlaces(6, M_lib_pricing_i0.ROUND_CEIL).toString(),
            lineTotal: amount.toString(),
            fulfillmentMode: line.mode,
            provider: line.provider,
            requestData: line.requestData,
          },
        });
        if (line.kind === "market") {
          const old = await tx.marketplaceReservation.findUnique({
            where: {itemId: line.id},
          });
          if (old) throw new M_lib_commerce_core.ShopError("item_reserved", 409);
          await tx.marketplaceReservation.create({
            data: {
              itemId: line.id,
              orderItemId: item.id,
              expiresAt: mode === "stars" ? expires : null,
            },
          });
        }
        if (line.mode === "INVENTORY") {
          const stock = await tx.inventoryItem.findMany({
            where: {productId: product.id, status: "AVAILABLE"},
            take: line.quantity,
            orderBy: {createdAt: "asc"},
          });
          if (stock.length !== line.quantity) throw new M_lib_commerce_core.ShopError("out_of_stock", 409);
          for (const s of stock) {
            const changed = await tx.inventoryItem.updateMany({
              where: {id: s.id, status: "AVAILABLE"},
              data: {
                status: "RESERVED",
                orderItemId: item.id,
                reservedUntil: expires,
              },
            });
            if (changed.count !== 1) throw new M_lib_commerce_core.ShopError("out_of_stock", 409);
          }
        }
      }
      if (mode === "wallet") {
        const wallet = await tx.wallet.upsert({
          where: {userId_currency: {userId: user.id, currency}},
          create: {userId: user.id, currency},
          update: {},
        });
        if (new M_lib_pricing_i0(wallet.balance).lt(total)) throw new M_lib_commerce_core.ShopError("insufficient_balance", 409);
        const debit = await tx.wallet.updateMany({
          where: {id: wallet.id, version: wallet.version},
          data: {
            balance: new M_lib_pricing_i0(wallet.balance).minus(total).toString(),
            version: {increment: 1},
          },
        });
        if (!debit.count) throw new M_lib_commerce_core.ShopError("insufficient_balance", 409);
        await tx.transaction.create({
          data: {
            userId: user.id,
            walletId: wallet.id,
            orderId: order.id,
            kind: "PURCHASE",
            status: "POSTED",
            amount: total.neg().toString(),
            idempotencyKey: `purchase:${order.id}`,
            postedAt: new Date(),
          },
        });
        await paidEffects(tx, order.id);
      }
      return tx.order.findUniqueOrThrow({where: {id: order.id}});
    });
  }
}
// lib/commerce/payments.ts
namespace M_lib_commerce_payments {
  export async function apiJson(url: string, headers: Record<string, string>, payload?: object, extraHeaders: Record<string, string> = {}) {
    let r: Response;
    try {
      r = await fetch(url, {
        method: payload ? "POST" : "GET",
        headers: {
          ...headers,
          ...extraHeaders,
          ...(payload ? {"Content-Type": "application/json"} : {}),
        },
        ...(payload ? {body: JSON.stringify(payload)} : {}),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new M_lib_commerce_core.ShopError("payment_transport", 503, true);
    }
    if (!r.ok) {
      await r.body?.cancel();
      throw new M_lib_commerce_core.ShopError("payment_provider", 503, true);
    }
    try {
      return await r.json();
    } catch {
      throw new M_lib_commerce_core.ShopError("payment_format", 503, true);
    }
  }
  export async function cryptoCall(method: "createInvoice" | "getInvoices", params: object) {
    const token = process.env.CRYPTO_PAY_TOKEN;
    if (!token) throw new M_lib_commerce_core.ShopError("crypto_not_configured", 503);
    const origin = process.env.CRYPTO_PAY_TESTNET === "true" ? "https://testnet-pay.crypt.bot" : "https://pay.crypt.bot";
    const d = await apiJson(`${origin}/api/${method}`, {"Crypto-Pay-API-Token": token}, params);
    if (d.ok !== true) throw new M_lib_commerce_core.ShopError("crypto_provider", 503, true);
    return d.result;
  }
  export async function telegramCall(method: "createInvoiceLink" | "refundStarPayment", params: object) {
    const token = process.env.BOT_TOKEN;
    if (!token) throw new M_lib_commerce_core.ShopError("telegram_not_configured", 503);
    const d = await apiJson(`https://api.telegram.org/bot${token}/${method}`, {}, params);
    if (d.ok !== true) throw new M_lib_commerce_core.ShopError("telegram_provider", 503, true);
    return d.result;
  }
  async function stripeCall(method: "POST" | "GET", path: string, fields?: Record<string, string>, key?: string) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new M_lib_commerce_core.ShopError("stripe_not_configured", 503);
    let r: Response;
    try {
      r = await fetch(`https://api.stripe.com/v1/${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${secret}`,
          ...(fields ? {"Content-Type": "application/x-www-form-urlencoded"} : {}),
          ...(key ? {"Idempotency-Key": key} : {}),
        },
        ...(fields ? {body: new URLSearchParams(fields)} : {}),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new M_lib_commerce_core.ShopError("payment_transport", 503, true);
    }
    if (!r.ok) {
      await r.body?.cancel();
      throw new M_lib_commerce_core.ShopError("payment_provider", 503, true);
    }
    return r.json();
  }
  export async function monoCall(path: string, payload?: object) {
    const token = process.env.MONO_TOKEN;
    if (!token) throw new M_lib_commerce_core.ShopError("mono_not_configured", 503);
    return apiJson(`https://api.monobank.ua/api/merchant/${path}`, {"X-Token": token}, payload);
  }
  export function validPaymentUrl(raw: unknown, provider: M_lib_commerce_payments_i2) {
    if (typeof raw !== "string") throw new M_lib_commerce_core.ShopError("invalid_payment_url", 503, true);
    const u = new URL(raw);
    const hosts =
      provider === "STRIPE"
        ? ["checkout.stripe.com"]
        : provider === "MONO"
          ? ["pay.mbnk.biz"]
          : provider === "CRYPTO_PAY"
            ? ["t.me", "pay.crypt.bot", "testnet-pay.crypt.bot"]
            : ["t.me"];
    if (u.protocol !== "https:" || u.username || u.password || u.port || !hosts.includes(u.hostname))
      throw new M_lib_commerce_core.ShopError("invalid_payment_url", 503, true);
    return u.toString();
  }
  export async function finishInvoice(intent: M_lib_commerce_payments_i1, locale: string) {
    if (intent.state !== "CREATING") return intent;
    try {
      let ref: string, url: string;
      if (intent.provider === "CRYPTO_PAY") {
        const invoice = await cryptoCall("createInvoice", {
          currency_type: "fiat",
          fiat: "USD",
          amount: intent.expectedAmount,
          accepted_assets: "USDT,TON",
          payload: intent.id,
          description: "Legit Assets · balance",
          expires_in: 3600,
          paid_btn_name: "callback",
          paid_btn_url: `${M_lib_commerce_core.siteOrigin()}/${locale}/account`,
        });
        ref = String(invoice.invoice_id);
        url = validPaymentUrl(invoice.bot_invoice_url, "CRYPTO_PAY");
      } else if (intent.provider === "MONO") {
        const invoice = await monoCall("invoice/create", {
          amount: Number(intent.expectedAmount),
          ccy: 980,
          merchantPaymInfo: {
            reference: intent.id,
            destination: "Legit Assets · поповнення балансу",
          },
          redirectUrl: `${M_lib_commerce_core.siteOrigin()}/${locale}/account`,
          webHookUrl: `${M_lib_commerce_core.siteOrigin()}/api/payments/webhook/mono`,
          validity: 3600,
          paymentType: "debit",
        });
        ref = String(invoice.invoiceId);
        url = validPaymentUrl(invoice.pageUrl, "MONO");
      } else if (intent.provider === "STRIPE") {
        const invoice = await stripeCall(
          "POST",
          "checkout/sessions",
          {
            mode: "payment",
            success_url: `${M_lib_commerce_core.siteOrigin()}/${locale}/account`,
            cancel_url: `${M_lib_commerce_core.siteOrigin()}/${locale}/account`,
            client_reference_id: intent.id,
            "metadata[paymentId]": intent.id,
            "line_items[0][price_data][currency]": "uah",
            "line_items[0][price_data][unit_amount]": intent.expectedAmount,
            "line_items[0][price_data][product_data][name]": "Legit Assets balance",
            "line_items[0][quantity]": "1",
          },
          `invoice:${intent.id}`,
        );
        ref = String(invoice.id);
        url = validPaymentUrl(invoice.url, "STRIPE");
      } else {
        const link = await telegramCall("createInvoiceLink", {
          title: "Legit Assets",
          description: "Digital goods · замовлення / order",
          payload: `legit:${intent.id}`,
          provider_token: "",
          currency: "XTR",
          prices: [{label: "Order", amount: Number(intent.expectedAmount)}],
        });
        ref = intent.id;
        url = validPaymentUrl(link, "TELEGRAM_STARS");
      }
      if (!ref || ref === "undefined" || ref.length > 200) throw new M_lib_commerce_core.ShopError("payment_format", 503, true);
      await M_lib_db.db.paymentIntent.updateMany({
        where: {id: intent.id, state: "CREATING"},
        data: {providerReference: ref, paymentUrl: url, state: "PENDING"},
      });
      return M_lib_db.db.paymentIntent.findUniqueOrThrow({where: {id: intent.id}});
    } catch (e) {
      await M_lib_db.db.paymentIntent.updateMany({
        where: {id: intent.id, state: "CREATING"},
        data: {state: "UNKNOWN"},
      });
      throw e;
    }
  }
  export async function createDeposit(
    user: {
      id: string;
      channel: string;
    },
    provider: M_lib_commerce_payments_i2,
    amountRaw: unknown,
    key: string,
    locale: string,
  ) {
    if (user.channel !== "WEB") throw new M_lib_commerce_core.ShopError("telegram_stars_required", 409);
    M_lib_commerce_core.idempotency(key);
    const amount = String(amountRaw);
    if (!/^\d{1,7}(\.\d{1,2})?$/.test(amount)) throw new M_lib_commerce_core.ShopError("invalid_amount");
    const n = new M_lib_pricing_i0(amount);
    const currency = provider === "CRYPTO_PAY" ? "USDT" : "UAH";
    if (
      !["CRYPTO_PAY", "MONO", "STRIPE"].includes(provider) ||
      n.lt(currency === "UAH" ? 10 : 1) ||
      n.gt(currency === "UAH" ? 100000 : 2000)
    )
      throw new M_lib_commerce_core.ShopError("deposit_limit");
    if (
      (provider === "MONO" && !process.env.MONO_TOKEN) ||
      (provider === "STRIPE" && !process.env.STRIPE_SECRET_KEY) ||
      (provider === "CRYPTO_PAY" && !process.env.CRYPTO_PAY_TOKEN)
    )
      throw new M_lib_commerce_core.ShopError("payment_not_configured", 503);
    const old = await M_lib_db.db.paymentIntent.findUnique({
      where: {userId_idempotencyKey: {userId: user.id, idempotencyKey: key}},
    });
    if (old) {
      if (old.provider !== provider || !new M_lib_pricing_i0(old.creditAmount).equals(n) || old.purpose !== "DEPOSIT")
        throw new M_lib_commerce_core.ShopError("idempotency_conflict", 409);
      return old;
    }
    let expected = n.mul(100).toFixed(0),
      expectedCurrency = "UAH";
    if (provider === "CRYPTO_PAY") {
      const fx = await M_lib_pricing.getFx();
      expected = n.mul(fx.rates.USDT).div(fx.rates.USD).toDecimalPlaces(2, M_lib_pricing_i0.ROUND_CEIL).toFixed(2);
      expectedCurrency = "USD";
    }
    const intent = await M_lib_db.db.paymentIntent.create({
      data: {
        userId: user.id,
        provider,
        purpose: "DEPOSIT",
        walletCurrency: currency,
        creditAmount: n.toFixed(2),
        expectedAmount: expected,
        expectedCurrency,
        idempotencyKey: key,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    return finishInvoice(intent, locale);
  }
  export async function createStarsInvoice(orderId: string, userId: string, locale: string) {
    const old = await M_lib_db.db.paymentIntent.findFirst({where: {orderId}});
    if (old) return old;
    const order = await M_lib_db.db.order.findFirst({
      where: {id: orderId, userId, status: "PENDING", channel: "TMA"},
    });
    if (!order) throw new M_lib_commerce_core.ShopError("order_unavailable", 409);
    const rate = new M_lib_pricing_i0(process.env.STARS_USDT_PER_STAR ?? "0");
    if (!process.env.BOT_TOKEN || !rate.isFinite() || rate.lte(0) || rate.gt(1))
      throw new M_lib_commerce_core.ShopError("stars_not_configured", 503);
    const stars = new M_lib_pricing_i0(order.total).div(rate).toDecimalPlaces(0, M_lib_pricing_i0.ROUND_CEIL);
    if (stars.gt(100000) || stars.lt(1)) throw new M_lib_commerce_core.ShopError("stars_limit");
    const intent = await M_lib_db.db.paymentIntent.create({
      data: {
        userId,
        orderId,
        provider: "TELEGRAM_STARS",
        purpose: "ORDER",
        walletCurrency: "USDT",
        creditAmount: order.total,
        expectedAmount: stars.toFixed(0),
        expectedCurrency: "XTR",
        idempotencyKey: `stars:${orderId}`,
        expiresAt: new Date(Date.now() + 900000),
      },
    });
    return finishInvoice(intent, locale);
  }
  export async function confirmPayment(
    id: string,
    provider: M_lib_commerce_payments_i2,
    ref: string,
    amount: string,
    currency: string,
    chargeId?: string,
  ) {
    return M_lib_commerce_core.atomic(async (tx) => {
      const p = await tx.paymentIntent.findUnique({
        where: {id},
        include: {user: true, order: true},
      });
      if (!p || p.provider !== provider) throw new M_lib_commerce_core.ShopError("payment_not_found", 404);
      if (
        !new M_lib_pricing_i0(p.expectedAmount).equals(amount) ||
        p.expectedCurrency !== currency ||
        (p.providerReference && p.providerReference !== ref)
      )
        throw new M_lib_commerce_core.ShopError("payment_mismatch", 409);
      if (p.state === "PAID") {
        if (p.chargeId && chargeId && p.chargeId !== chargeId) throw new M_lib_commerce_core.ShopError("charge_mismatch", 409);
        return p;
      }
      if (["REFUNDED", "REFUNDING"].includes(p.state)) return p;
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id"=${p.userId}`;
      const changed = await tx.paymentIntent.updateMany({
        where: {
          id: p.id,
          state: {in: ["CREATING", "PENDING", "UNKNOWN", "FAILED"]},
        },
        data: {
          state: "PAID",
          providerReference: ref,
          ...(chargeId ? {chargeId} : {}),
        },
      });
      if (!changed.count) return p;
      if (p.purpose === "ORDER" && p.order && p.order.status !== "PENDING") {
        // A late Stars receipt is held for refund; never turn it into spendable web balance.
        await tx.order.updateMany({
          where: {
            id: p.order.id,
            status: {in: ["CANCELLED", "NEEDS_REVIEW"]},
          },
          data: {status: "NEEDS_REVIEW", paidAt: new Date()},
        });
        return p;
      }
      const wallet = await tx.wallet.upsert({
        where: {
          userId_currency: {userId: p.userId, currency: p.walletCurrency},
        },
        create: {userId: p.userId, currency: p.walletCurrency},
        update: {},
      });
      await tx.wallet.update({
        where: {id: wallet.id},
        data: {
          balance: new M_lib_pricing_i0(wallet.balance).plus(p.creditAmount).toString(),
          version: {increment: 1},
        },
      });
      await tx.transaction.create({
        data: {
          userId: p.userId,
          walletId: wallet.id,
          kind: "DEPOSIT",
          status: "POSTED",
          amount: p.creditAmount,
          idempotencyKey: `deposit:${p.id}`,
          provider,
          providerReference: chargeId ?? ref,
          postedAt: new Date(),
        },
      });
      if (p.purpose === "ORDER" && p.order) {
        if (p.order.status !== "PENDING") {
          await tx.order.updateMany({
            where: {id: p.orderId!, status: {not: "REFUNDED"}},
            data: {status: "NEEDS_REVIEW"},
          });
          return p;
        }
        const available = new M_lib_pricing_i0(wallet.balance).plus(p.creditAmount);
        if (available.lt(p.order.total)) throw new M_lib_commerce_core.ShopError("balance_conflict", 409);
        const debit = await tx.wallet.updateMany({
          where: {id: wallet.id, version: wallet.version + 1},
          data: {
            balance: available.minus(p.order.total).toString(),
            version: {increment: 1},
          },
        });
        if (!debit.count) throw new M_lib_commerce_core.ShopError("balance_conflict", 409);
        await tx.transaction.create({
          data: {
            userId: p.userId,
            walletId: wallet.id,
            orderId: p.order.id,
            kind: "PURCHASE",
            status: "POSTED",
            amount: new M_lib_pricing_i0(p.order.total).negated().toString(),
            idempotencyKey: `purchase:${p.order.id}`,
            postedAt: new Date(),
          },
        });
        await tx.order.update({
          where: {id: p.order.id},
          data: {status: "PAID", paidAt: new Date()},
        });
        await tx.marketplaceReservation.updateMany({
          where: {
            orderItemId: {
              in: (
                await tx.orderItem.findMany({
                  where: {orderId: p.order.id},
                  select: {id: true},
                })
              ).map((i) => i.id),
            },
          },
          data: {expiresAt: null},
        });
        await M_lib_commerce_checkout.paidEffects(tx, p.order.id);
      } else if (p.user.telegramId)
        await tx.notification.upsert({
          where: {deduplicationKey: `deposit:${p.id}`},
          update: {},
          create: {
            telegramId: p.user.telegramId,
            kind: "DEPOSIT",
            text: `Legit Assets · +${new M_lib_pricing_i0(p.creditAmount).toFixed(2)} ${p.walletCurrency}`,
            deduplicationKey: `deposit:${p.id}`,
          },
        });
      return p;
    });
  }
  export async function reconcilePayment(id: string) {
    const p = await M_lib_db.db.paymentIntent.findUnique({where: {id}});
    if (!p?.providerReference || p.state === "PAID") return p;
    if (p.provider === "CRYPTO_PAY") {
      const d = await cryptoCall("getInvoices", {
          invoice_ids: p.providerReference,
        }),
        list = Array.isArray(d) ? d : d.items;
      const invoice = list?.find((i: {invoice_id: unknown}) => String(i.invoice_id) === p.providerReference);
      if (invoice?.status === "paid" && invoice.payload === p.id && invoice.currency_type === "fiat" && invoice.fiat === "USD")
        await confirmPayment(p.id, p.provider, p.providerReference, String(invoice.amount), "USD");
    } else if (p.provider === "MONO") {
      const d = await monoCall(`invoice/status?invoiceId=${encodeURIComponent(p.providerReference)}`);
      if (
        d.status === "success" &&
        d.reference === p.id &&
        d.ccy === 980 &&
        d.finalAmount === Number(p.expectedAmount) &&
        !d.cancelList?.length
      )
        await confirmPayment(p.id, p.provider, p.providerReference, String(d.amount), "UAH");
    } else if (p.provider === "STRIPE") {
      const d = await stripeCall("GET", `checkout/sessions/${encodeURIComponent(p.providerReference)}`);
      if (d.payment_status === "paid" && d.client_reference_id === p.id && d.currency === "uah")
        await confirmPayment(p.id, p.provider, p.providerReference, String(d.amount_total), "UAH");
    }
    return M_lib_db.db.paymentIntent.findUnique({where: {id}});
  }
  export async function starsPrecheck(paymentId: string, telegramId: string, total: number, currency: string, queryId: string) {
    if (!queryId || queryId.length > 200) return false;
    return M_lib_commerce_core.atomic(async (tx) => {
      const p = await tx.paymentIntent.findUnique({
        where: {id: paymentId},
        include: {user: true, order: true},
      });
      if (
        !p ||
        p.provider !== "TELEGRAM_STARS" ||
        p.state !== "PENDING" ||
        p.expiresAt <= new Date() ||
        p.user.telegramId?.toString() !== telegramId ||
        p.expectedAmount !== String(total) ||
        currency !== "XTR" ||
        p.order?.status !== "PENDING"
      )
        return false;
      if (p.preCheckoutId) return p.preCheckoutId === queryId;
      const claimed = await tx.paymentIntent.updateMany({
        where: {id: p.id, state: "PENDING", preCheckoutId: null},
        data: {preCheckoutId: queryId},
      });
      return claimed.count === 1;
    });
  }
}
// lib/commerce/fulfillment.ts
namespace M_lib_commerce_fulfillment {
  export async function completeItem(tx: Parameters<Parameters<typeof M_lib_commerce_core.atomic>[0]>[0], itemId: string, payload: string) {
    const item = await tx.orderItem.findUniqueOrThrow({
      where: {id: itemId},
      include: {order: {include: {user: true}}},
    });
    if (item.fulfillmentStatus === "DELIVERED") return;
    if (!["PAID", "FULFILLING", "NEEDS_REVIEW"].includes(item.order.status) || !item.order.paidAt)
      throw new M_lib_commerce_core.ShopError("order_not_paid", 409);
    await tx.orderItem.update({
      where: {id: itemId},
      data: {
        fulfillmentStatus: "DELIVERED",
        encryptedDelivery: M_lib_commerce_encryption.encrypt(payload, `delivery:${item.id}`),
        deliveredAt: new Date(),
      },
    });
    const left = await tx.orderItem.count({
      where: {orderId: item.orderId, fulfillmentStatus: {not: "DELIVERED"}},
    });
    if (!left)
      await tx.order.update({
        where: {id: item.orderId},
        data: {status: "COMPLETED", completedAt: new Date()},
      });
    if (item.order.user.telegramId)
      await tx.notification.upsert({
        where: {deduplicationKey: `delivery:${item.id}`},
        update: {},
        create: {
          telegramId: item.order.user.telegramId,
          orderId: item.orderId,
          kind: "DELIVERY",
          text: `Legit Assets · ${item.titleSnapshot}\nТовар доступний у кабінеті / Delivery is available in your account.`,
          deduplicationKey: `delivery:${item.id}`,
        },
      });
  }
  async function review(jobId: string, code: string) {
    await M_lib_commerce_core.atomic(async (tx) => {
      const job = await tx.fulfillmentJob.update({
        where: {id: jobId},
        data: {state: "UNKNOWN", leaseUntil: null, lastErrorCode: code},
        include: {orderItem: true},
      });
      await tx.order.updateMany({
        where: {
          id: job.orderItem.orderId,
          status: {in: ["PAID", "FULFILLING"]},
        },
        data: {status: "NEEDS_REVIEW"},
      });
    });
  }
  export async function marketTick() {
    if (process.env.MARKET_LIVE_ORDERS_ENABLED !== "true") return {processed: 0, enabled: false};
    const now = new Date();
    await M_lib_db.db.fulfillmentJob.updateMany({
      where: {state: "PREPARING", leaseUntil: {lt: now}},
      data: {state: "QUEUED", leaseUntil: null, runAt: now},
    });
    const stale = await M_lib_db.db.fulfillmentJob.findMany({
      where: {state: "SENDING", leaseUntil: {lt: now}},
    });
    for (const s of stale) await review(s.id, "submission_unknown");
    const job = await M_lib_db.db.fulfillmentJob.findFirst({
      where: {
        state: "QUEUED",
        runAt: {lte: now},
        OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
      },
      orderBy: {runAt: "asc"},
    });
    if (!job) return {processed: 0, enabled: true};
    const lease = new Date(Date.now() + 120000),
      claim = await M_lib_db.db.fulfillmentJob.updateMany({
        where: {
          id: job.id,
          state: "QUEUED",
          OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
        },
        data: {
          state: "PREPARING",
          leaseUntil: lease,
          attempts: {increment: 1},
        },
      });
    if (!claim.count) return {processed: 0, enabled: true};
    let sending = false;
    try {
      M_lib_commerce_encryption.encryptionReady();
      const item = await M_lib_db.db.orderItem.findUniqueOrThrow({
        where: {id: job.orderItemId},
        include: {order: true, product: true},
      });
      if (
        !["PAID", "FULFILLING"].includes(item.order.status) ||
        !item.order.paidAt ||
        item.fulfillmentStatus !== "PENDING" ||
        item.product.provider !== "lzt"
      )
        throw new M_lib_commerce_core.ShopError("invalid_order", 409);
      const d = item.requestData as Record<string, string>,
        fresh = await M_lib_commerce_market.marketItem(d.providerItemId);
      if (
        fresh.sourceCurrency !== d.sourceCurrency ||
        new M_lib_pricing_i0(fresh.sourceAmount).gt(d.sourceAmount) ||
        fresh.prices[item.order.currency as "UAH" | "USDT"] > new M_lib_pricing_i0(item.lineTotal).mul(100).toNumber()
      )
        throw new M_lib_commerce_core.ShopError("supplier_price_changed", 409);
      const max = new M_lib_pricing_i0(process.env.MARKET_MAX_ORDER_USDT ?? "100");
      if (!max.isFinite() || max.lte(0) || new M_lib_pricing_i0(fresh.prices.USDT).div(100).gt(max))
        throw new M_lib_commerce_core.ShopError("supplier_cost_limit", 409);
      const changed = await M_lib_db.db.fulfillmentJob.updateMany({
        where: {id: job.id, state: "PREPARING", leaseUntil: lease},
        data: {state: "SENDING"},
      });
      if (!changed.count) return {processed: 0, enabled: true};
      sending = true;
      const payload = await M_lib_commerce_market.buyMarket(fresh.id, fresh.sourceAmount);
      await M_lib_commerce_core.atomic(async (tx) => {
        const changed = await tx.fulfillmentJob.updateMany({
          where: {id: job.id, state: {in: ["SENDING", "UNKNOWN"]}},
          data: {state: "COMPLETED", leaseUntil: null, lastErrorCode: null},
        });
        if (!changed.count) throw new M_lib_commerce_core.ShopError("reconciliation_required", 409);
        await tx.product.update({
          where: {id: item.productId},
          data: {active: false},
        });
        await completeItem(tx, item.id, payload);
      });
    } catch (e) {
      const code = e instanceof M_lib_commerce_core.ShopError ? e.code : "storage_or_provider";
      if (!sending && job.attempts < 3 && !(e instanceof M_lib_commerce_core.ShopError && e.status === 409))
        await M_lib_db.db.fulfillmentJob.update({
          where: {id: job.id},
          data: {
            state: "QUEUED",
            leaseUntil: null,
            runAt: new Date(Date.now() + 60000 * 2 ** job.attempts),
            lastErrorCode: code,
          },
        });
      else await review(job.id, code);
    }
    return {processed: 1, enabled: true};
  }
  export async function expireOrders() {
    // Only pending, unpaid orders expire. Paid reservations never return to stock automatically.
    const expired = await M_lib_db.db.order.findMany({
      where: {
        status: "PENDING",
        createdAt: {lt: new Date(Date.now() - 20 * 60000)},
      },
      select: {id: true},
      take: 50,
    });
    for (const o of expired)
      await M_lib_commerce_core.atomic(async (tx) => {
        const changed = await tx.order.updateMany({
          where: {id: o.id, status: "PENDING", paidAt: null},
          data: {status: "CANCELLED"},
        });
        if (!changed.count) return;
        const ids = (
          await tx.orderItem.findMany({
            where: {orderId: o.id},
            select: {id: true},
          })
        ).map((i) => i.id);
        await tx.inventoryItem.updateMany({
          where: {orderItemId: {in: ids}, status: "RESERVED"},
          data: {status: "AVAILABLE", orderItemId: null, reservedUntil: null},
        });
        await tx.marketplaceReservation.deleteMany({
          where: {orderItemId: {in: ids}, expiresAt: {not: null}},
        });
      });
    // Expired temporary rows are removed by the bounded hourly retention job.
  }
}
// lib/commerce/admin.ts
namespace M_lib_commerce_admin {
  export async function manualDelivery(actorId: string, itemId: string, payload: string, reconciled = false) {
    if (!payload.trim() || Buffer.byteLength(payload) > 500000) throw new M_lib_commerce_core.ShopError("invalid_delivery");
    M_lib_commerce_encryption.encryptionReady();
    return M_lib_commerce_core.atomic(async (tx) => {
      const item = await tx.orderItem.findUniqueOrThrow({
        where: {id: itemId},
        include: {fulfillmentJob: true, smmJob: true, order: true},
      });
      if (item.fulfillmentStatus === "DELIVERED") throw new M_lib_commerce_core.ShopError("already_delivered", 409);
      if (item.smmJob || item.fulfillmentMode === "INVENTORY") throw new M_lib_commerce_core.ShopError("wrong_fulfillment", 409);
      if (item.fulfillmentJob && ["PREPARING", "SENDING", "RUNNING"].includes(item.fulfillmentJob.state))
        throw new M_lib_commerce_core.ShopError("worker_active", 409);
      if (item.fulfillmentMode === "PROVIDER" && !reconciled) throw new M_lib_commerce_core.ShopError("reconciliation_required", 409);
      await M_lib_commerce_fulfillment.completeItem(tx, itemId, payload);
      if (item.fulfillmentJob)
        await tx.fulfillmentJob.update({
          where: {id: item.fulfillmentJob.id},
          data: {state: "COMPLETED", leaseUntil: null, lastErrorCode: null},
        });
      await tx.adminAuditLog.create({
        data: {
          actorId,
          action: "order.deliver",
          entityId: itemId,
          after: {delivered: true, reconciled},
        },
      });
      return {ok: true};
    });
  }
  export async function refundOrder(actorId: string, orderId: string, reconciled: boolean) {
    const result = await M_lib_commerce_core.atomic(async (tx) => {
      const o = await tx.order.findUniqueOrThrow({
        where: {id: orderId},
        include: {
          items: {include: {fulfillmentJob: true, smmJob: true}},
          payments: true,
          user: true,
        },
      });
      if (o.status === "REFUNDED") return {done: true, stars: null};
      if (!o.paidAt || !["PAID", "FULFILLING", "NEEDS_REVIEW", "COMPLETED"].includes(o.status))
        throw new M_lib_commerce_core.ShopError("order_not_paid", 409);
      if (o.items.some((i) => [i.fulfillmentJob?.state, i.smmJob?.state].some((s) => s && ["PREPARING", "SENDING", "RUNNING"].includes(s))))
        throw new M_lib_commerce_core.ShopError("worker_active", 409);
      if (
        o.items.some(
          (i) =>
            i.fulfillmentStatus === "DELIVERED" ||
            [i.fulfillmentJob?.state, i.smmJob?.state].some((s) => s && ["UNKNOWN", "PARTIAL", "COMPLETED"].includes(s)),
        ) &&
        !reconciled
      )
        throw new M_lib_commerce_core.ShopError("reconciliation_required", 409);
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id"=${o.userId}`;
      const stars = o.payments.find((p) => p.provider === "TELEGRAM_STARS");
      if (stars) {
        if (stars.state === "REFUNDING") throw new M_lib_commerce_core.ShopError("refund_needs_reconciliation", 409);
        if (!stars.chargeId || !o.user.telegramId) throw new M_lib_commerce_core.ShopError("missing_charge", 409);
        await tx.paymentIntent.update({
          where: {id: stars.id},
          data: {state: "REFUNDING"},
        });
      } else {
        const wallet = await tx.wallet.findUniqueOrThrow({
          where: {userId_currency: {userId: o.userId, currency: o.currency}},
        });
        await tx.wallet.update({
          where: {id: wallet.id},
          data: {balance: new M_lib_pricing_i0(wallet.balance).plus(o.total).toString(), version: {increment: 1}},
        });
        await tx.transaction.create({
          data: {
            userId: o.userId,
            walletId: wallet.id,
            orderId: o.id,
            kind: "REFUND",
            status: "POSTED",
            amount: o.total,
            idempotencyKey: `refund:${o.id}`,
            postedAt: new Date(),
          },
        });
      }
      await tx.fulfillmentJob.updateMany({
        where: {orderItemId: {in: o.items.map((i) => i.id)}, state: "QUEUED"},
        data: {state: "CANCELED"},
      });
      await tx.smmJob.updateMany({
        where: {orderItemId: {in: o.items.map((i) => i.id)}, state: "QUEUED"},
        data: {state: "CANCELED"},
      });
      if (!stars)
        await tx.order.update({
          where: {id: o.id},
          data: {status: "REFUNDED"},
        });
      else
        await tx.order.update({
          where: {id: o.id},
          data: {status: "NEEDS_REVIEW"},
        });
      // Never resell delivered/ambiguous stock automatically. Release only unsubmitted supplier reservations.
      const untouched = o.items.filter((i) => i.fulfillmentStatus === "PENDING" && i.fulfillmentJob?.state === "QUEUED").map((i) => i.id);
      await tx.marketplaceReservation.deleteMany({
        where: {orderItemId: {in: untouched}},
      });
      await tx.adminAuditLog.create({
        data: {
          actorId,
          action: stars ? "order.stars_refund_started" : "order.refund_balance",
          entityId: o.id,
          after: {amount: o.total.toString(), currency: o.currency, reconciled},
        },
      });
      return {
        done: false,
        stars: stars
          ? {
              id: stars.id,
              chargeId: stars.chargeId!,
              telegramId: o.user.telegramId!.toString(),
            }
          : null,
      };
    });
    if (result.stars) {
      await M_lib_commerce_payments.telegramCall("refundStarPayment", {
        user_id: Number(result.stars.telegramId),
        telegram_payment_charge_id: result.stars.chargeId,
      });
      await M_lib_commerce_core.atomic(async (tx) => {
        await tx.paymentIntent.update({
          where: {id: result.stars!.id},
          data: {state: "REFUNDED"},
        });
        await tx.order.update({
          where: {id: orderId},
          data: {status: "REFUNDED"},
        });
        await tx.adminAuditLog.create({
          data: {actorId, action: "order.stars_refunded", entityId: orderId},
        });
      });
    }
    return {ok: true};
  }
}
// lib/commerce/bot-payload.ts
namespace M_lib_commerce_bot_payload {
  export function handoffCategory(entries: Pick<M_lib_commerce_checkout.CartLine, "kind">[]): string {
    const kind = entries[0]?.kind;
    return entries.every((e) => e.kind === kind)
      ? kind === "gift"
        ? "nft-gifts"
        : kind === "market"
          ? "catalog"
          : kind === "smm"
            ? "smm"
            : "catalog"
      : "cart";
  }
  export function botOrderPayload(category: string, token: string) {
    if (
      !/^(nft-gifts|telegram-accounts|steam-accounts|verifications|smm|catalog|cart)$/.test(category) ||
      !/^[A-Za-z0-9_-]{32}$/.test(token)
    )
      throw Error("invalid_handoff");
    const payload = `buy_${category}-${token}`;
    if (payload.length > 64) throw Error("payload_too_long");
    return payload;
  }
  export function parseBotOrderPayload(payload: string) {
    const match = payload.match(/^buy_(nft-gifts|telegram-accounts|steam-accounts|verifications|smm|catalog|cart)-([A-Za-z0-9_-]{32})$/);
    return match ? {category: match[1], token: match[2]} : null;
  }
}
// lib/commerce/handoff.ts
namespace M_lib_commerce_handoff {
  const digest = (token: string) => M_lib_nft_i0("sha256").update(token).digest("hex");
  export async function createHandoff(items: unknown, locale: M_lib_catalog_i1) {
    const entries = M_lib_commerce_checkout.parseCart(items);
    const token = M_lib_nft_i2(32).toString("base64url");
    const links = M_lib_commerce_handoff_i3(`buy_${locale}_${token}`);
    await M_lib_db.db.cartHandoff.create({
      data: {
        tokenHash: digest(token),
        entries,
        locale,
        expiresAt: new Date(Date.now() + 10 * 60000),
      },
    });
    return {...links, expiresIn: 600};
  }
  export async function claimHandoff(
    token: string,
    user: {
      id: string;
      channel: string;
    },
    locale: M_lib_catalog_i1,
  ) {
    if (user.channel !== "TMA") throw new M_lib_commerce_core.ShopError("telegram_required", 409);
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new M_lib_commerce_core.ShopError("invalid_handoff");
    const hash = digest(token),
      record = await M_lib_db.db.cartHandoff.findUnique({where: {tokenHash: hash}});
    if (!record || record.expiresAt <= new Date()) throw new M_lib_commerce_core.ShopError("handoff_expired", 410);
    if (record.claimedById && record.claimedById !== user.id) throw new M_lib_commerce_core.ShopError("handoff_used", 409);
    const priced = await M_lib_commerce_checkout.priceCart(M_lib_commerce_checkout.parseCart(record.entries), locale);
    await M_lib_commerce_core.atomic(async (tx) => {
      const changed = await tx.cartHandoff.updateMany({
        where: {
          tokenHash: hash,
          expiresAt: {gt: new Date()},
          OR: [{claimedById: null}, {claimedById: user.id}],
        },
        data: {claimedById: user.id},
      });
      if (changed.count !== 1) throw new M_lib_commerce_core.ShopError("handoff_used", 409);
    });
    return priced.map((l) => ({
      kind: l.kind,
      id: l.id,
      title: l.title,
      quantity: l.quantity,
      ...(l.link ? {link: l.link} : {}),
    }));
  }
  export async function createBotHandoff(items: unknown, locale: M_lib_catalog_i1, userId: string) {
    const entries = M_lib_commerce_checkout.parseCart(items),
      token = M_lib_nft_i2(24).toString("base64url");
    let category = M_lib_commerce_bot_payload.handoffCategory(entries);
    if (entries.every((e) => e.kind === "market" || e.kind === "product")) {
      const products = await M_lib_db.db.product.findMany({
        where: {
          OR: [
            {
              id: {
                in: entries.filter((e) => e.kind === "product").map((e) => e.id),
              },
            },
            {
              provider: "lzt",
              providerProductId: {
                in: entries.filter((e) => e.kind === "market").map((e) => e.id),
              },
            },
          ],
        },
        select: {
          id: true,
          providerProductId: true,
          category: {select: {slug: true}},
        },
      });
      const resolved = entries.map(
        (entry) =>
          products.find((product) => (entry.kind === "market" ? product.providerProductId === entry.id : product.id === entry.id))?.category
            .slug,
      );
      if (resolved.every((slug) => slug && slug === resolved[0]) && /^(telegram-accounts|steam-accounts|verifications)$/.test(resolved[0]!))
        category = resolved[0]!;
    }
    const payload = M_lib_commerce_bot_payload.botOrderPayload(category, token);
    const links = M_lib_commerce_handoff_i3(payload, "LegitAssetsBot", "");
    await M_lib_db.db.cartHandoff.create({
      data: {
        tokenHash: digest(token),
        entries: {items: entries, category},
        locale,
        claimedById: userId,
        expiresAt: new Date(Date.now() + 600000),
      },
    });
    return {...links, expiresIn: 600};
  }
  export async function readBotHandoff(token: string, category: string, userId: string) {
    if (!/^[A-Za-z0-9_-]{32}$/.test(token)) throw new M_lib_commerce_core.ShopError("invalid_handoff");
    const record = await M_lib_db.db.cartHandoff.findUnique({
      where: {tokenHash: digest(token)},
    });
    if (!record || record.expiresAt <= new Date()) throw new M_lib_commerce_core.ShopError("handoff_expired", 410);
    if (record.claimedById !== userId) throw new M_lib_commerce_core.ShopError("handoff_used", 403);
    const stored = record.entries as {
      items?: unknown;
      category?: unknown;
    };
    const entries = M_lib_commerce_checkout.parseCart(stored?.items);
    if (stored?.category !== category) throw new M_lib_commerce_core.ShopError("invalid_handoff");
    return {entries, locale: record.locale, tokenHash: record.tokenHash};
  }
}
// lib/commerce/bot.ts
namespace M_lib_commerce_bot {
  export function authorizedBotWebhook(headers: Headers) {
    const expected = process.env.BOT_WEBHOOK_SECRET,
      actual = headers.get("x-telegram-bot-api-secret-token");
    return Boolean(
      expected &&
      expected.length >= 32 &&
      actual &&
      actual.length <= 256 &&
      M_lib_admin_crypto_i2(M_lib_nft_i0("sha256").update(expected).digest(), M_lib_nft_i0("sha256").update(actual).digest()),
    );
  }
  export interface BotUser {
    id: number;
    first_name?: string;
    language_code?: string;
    is_bot?: boolean;
  }
  export interface BotUpdate {
    update_id: number;
    message?: {
      from?: BotUser;
      chat: {
        id: number;
        type: string;
      };
      text?: string;
      successful_payment?: {
        invoice_payload: string;
        currency: string;
        total_amount: number;
        telegram_payment_charge_id: string;
      };
    };
    callback_query?: {
      id: string;
      from: BotUser;
      data?: string;
      message?: {
        chat: {
          id: number;
          type: string;
        };
      };
    };
    pre_checkout_query?: {
      id: string;
      from: BotUser;
      invoice_payload: string;
      currency: string;
      total_amount: number;
    };
  }
  export async function botCall(method: "sendMessage" | "answerCallbackQuery" | "answerPreCheckoutQuery", params: object) {
    const token = process.env.BOT_TOKEN;
    if (!token) throw new M_lib_commerce_core.ShopError("telegram_not_configured", 503);
    const response = await M_lib_commerce_payments.apiJson(`https://api.telegram.org/bot${token}/${method}`, {}, params);
    if (!response.ok) throw new M_lib_commerce_core.ShopError("telegram_provider", 503);
    return response.result;
  }
  function validUser(user: BotUser | undefined) {
    if (!user || !Number.isSafeInteger(user.id) || user.id <= 0 || user.is_bot) throw new M_lib_commerce_core.ShopError("invalid_update");
    return user;
  }
  export async function handleBotUpdate(update: BotUpdate) {
    if (!Number.isSafeInteger(update.update_id)) throw new M_lib_commerce_core.ShopError("invalid_update");
    if (!update.message && !update.callback_query && !update.pre_checkout_query) return;
    if (update.pre_checkout_query) {
      const q = update.pre_checkout_query,
        user = validUser(q.from);
      let ok = false;
      try {
        ok = await M_lib_commerce_payments.starsPrecheck(
          q.invoice_payload.replace(/^legit:/, ""),
          String(user.id),
          q.total_amount,
          q.currency,
          q.id,
        );
      } catch {}
      await botCall("answerPreCheckoutQuery", {
        pre_checkout_query_id: q.id,
        ok,
        ...(!ok ? {error_message: M_lib_commerce_bot_i3[M_lib_commerce_bot_i2(user.language_code)].error} : {}),
      });
      return;
    }
    const callback = update.callback_query,
      message = update.message;
    const user = validUser(callback?.from ?? message?.from),
      chat = callback?.message?.chat ?? message?.chat;
    if (!chat || chat.type !== "private" || chat.id !== user.id) throw new M_lib_commerce_core.ShopError("private_chat_required", 403);
    let locale: M_lib_catalog_i1 = M_lib_commerce_bot_i2(user.language_code);
    const customer = await M_lib_db.db.user.upsert({
      where: {telegramId: BigInt(user.id)},
      create: {
        telegramId: BigInt(user.id),
        displayName: user.first_name ?? "Telegram",
        locale,
      },
      update: {},
    });
    locale = customer.locale;
    if (message?.successful_payment) {
      const receipt = message.successful_payment;
      const payment = await M_lib_db.db.paymentIntent.findUnique({
        where: {id: receipt.invoice_payload.replace(/^legit:/, "")},
      });
      if (!payment || payment.userId !== customer.id || payment.provider !== "TELEGRAM_STARS" || receipt.currency !== "XTR")
        throw new M_lib_commerce_core.ShopError("payment_mismatch", 409);
      await M_lib_commerce_payments.confirmPayment(
        payment.id,
        "TELEGRAM_STARS",
        payment.id,
        String(receipt.total_amount),
        "XTR",
        receipt.telegram_payment_charge_id,
      );
      // Payment is confirmed; fulfillment is still reported by the existing workers.
      await botCall("sendMessage", {
        chat_id: chat.id,
        text: {
          uk: "Оплату підтверджено. Статус замовлення доступний у профілі.",
          en: "Payment confirmed. Track your order in your profile.",
          ru: "Оплата подтверждена. Статус заказа доступен в профиле.",
        }[locale],
      });
      return;
    }
    const payload = callback?.data?.replace(/^pay_/, "buy_") ?? message?.text?.match(/^\/start(?:@\w+)?\s+([A-Za-z0-9_-]+)$/)?.[1];
    const parsed = payload ? M_lib_commerce_bot_payload.parseBotOrderPayload(payload) : null;
    if (parsed) {
      try {
        const handoff = await M_lib_commerce_handoff.readBotHandoff(parsed.token, parsed.category, customer.id);
        locale = handoff.locale;
        await M_lib_db.db.user.update({where: {id: customer.id}, data: {locale}});
        if (callback)
          await botCall("answerCallbackQuery", {
            callback_query_id: callback.id,
          });
        const priced = await M_lib_commerce_checkout.priceCart(handoff.entries, locale);
        if (callback) {
          const order = await M_lib_commerce_checkout.createOrder(
            {...customer, channel: "TMA"},
            handoff.entries,
            locale,
            "USDT",
            `bot_${handoff.tokenHash}`,
            "stars",
            priced.reduce((n, item) => n + item.prices.USDT, 0),
          );
          const invoice = await M_lib_commerce_payments.createStarsInvoice(order.id, customer.id, locale);
          if (!invoice.paymentUrl) throw new M_lib_commerce_core.ShopError("stars_not_configured", 503);
          await botCall("sendMessage", {
            chat_id: chat.id,
            text: `${M_lib_commerce_bot_i3[locale].checkout} · ${invoice.expectedAmount} XTR`,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${M_lib_commerce_bot_i3[locale].checkout} · ${invoice.expectedAmount} ⭐`,
                    url: invoice.paymentUrl,
                  },
                ],
              ],
            },
          });
        } else {
          const text = priced.map((item) => `${item.title} × ${item.quantity}`).join("\n");
          await botCall("sendMessage", {
            chat_id: chat.id,
            text: `${M_lib_commerce_bot_i3[locale].cart}\n\n${text}\n\n${M_lib_commerce_bot_i3[locale].total}: ${(priced.reduce((n, item) => n + item.prices.USDT, 0) / 100).toFixed(2)} USDT\n${M_lib_commerce_bot_i3[locale].botNote}`,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: M_lib_commerce_bot_i3[locale].checkout,
                    callback_data: `pay_${parsed.category}-${parsed.token}`,
                  },
                ],
                [
                  {
                    text: M_lib_commerce_bot_i3[locale].guarantees,
                    url: `${M_lib_commerce_core.siteOrigin()}/${locale}/modules/rules`,
                  },
                ],
              ],
            },
          });
        }
      } catch (error) {
        await botCall("sendMessage", {
          chat_id: chat.id,
          text: M_lib_commerce_bot_i6(error instanceof M_lib_commerce_core.ShopError ? error.code : "unavailable", locale),
        });
      }
      return;
    }
    if (message?.text?.startsWith("/start")) {
      // Keep legacy inline category/module payloads usable.
      if (payload === "uk" || payload === "ru" || payload === "en") locale = payload;
      const country = payload?.match(/^(uk|ru|en)_tg_([A-Z]{2})$/);
      if (country && M_lib_commerce_bot_i7(country[2])) {
        locale = country[1] as M_lib_catalog_i1;
        await botCall("sendMessage", {
          chat_id: chat.id,
          text: "Legit Assets",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: M_lib_commerce_bot_i3[locale].catalog,
                  web_app: {
                    url: `${M_lib_commerce_core.siteOrigin()}/${locale}/telegram-accounts/${country[2]}?spam=no&sort=asc`,
                  },
                },
              ],
            ],
          },
        });
        return;
      }
      const legacy = payload?.match(/^(uk|ru|en)_(steam-accounts|telegram-accounts|smm|verifications|nft-gifts|gifts)$/);
      const module = payload?.match(/^module_(uk|ru|en)_(tour|rules|about|payment|privacy)$/);
      if (legacy || module) {
        const match = legacy ?? module!;
        locale = match[1] as M_lib_catalog_i1;
        const path = legacy ? (match[2] === "gifts" ? "nft-gifts" : match[2]) : `modules/${match[2]}`;
        await botCall("sendMessage", {
          chat_id: chat.id,
          text: "Legit Assets",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: M_lib_commerce_bot_i3[locale].open,
                  web_app: {url: `${M_lib_commerce_core.siteOrigin()}/${locale}/${path}`},
                },
              ],
            ],
          },
        });
        return;
      }
      await botCall("sendMessage", {
        chat_id: chat.id,
        text: `Legit Assets · ${M_lib_commerce_bot_i3[locale].catalog}`,
        reply_markup: {
          inline_keyboard: [
            ...M_lib_commerce_bot_i4.map((category) => [
              {
                text: category.title[locale],
                web_app: {url: `${M_lib_commerce_core.siteOrigin()}/${locale}/${category.slug}`},
              },
            ]),
            [
              {
                text: M_lib_commerce_bot_i3[locale].tour,
                web_app: {url: `${M_lib_commerce_core.siteOrigin()}/${locale}/modules/tour`},
              },
            ],
          ],
        },
      });
    }
  }
}
// lib/commerce/signatures.ts
namespace M_lib_commerce_signatures {
  export function sameHex(expected: Buffer, actual: string | null) {
    return !!actual && /^[a-f0-9]{64}$/.test(actual) && M_lib_admin_crypto_i2(expected, Buffer.from(actual, "hex"));
  }
  export function cryptoSignature(raw: string, signature: string | null, token: string) {
    return (
      !!token && sameHex(M_lib_auth_telegram_i0("sha256", M_lib_nft_i0("sha256").update(token).digest()).update(raw).digest(), signature)
    );
  }
  export function stripeSignature(raw: string, header: string | null, secret: string, now = Date.now()) {
    if (!header || !secret) return false;
    const entries = header.split(",").map((s) => s.split("=")),
      timestamps = entries.filter(([k]) => k === "t"),
      t = timestamps[0]?.[1];
    if (timestamps.length !== 1 || !/^\d+$/.test(t ?? "") || Math.abs(now / 1000 - Number(t)) > 300) return false;
    const digest = M_lib_auth_telegram_i0("sha256", secret).update(`${t}.${raw}`).digest();
    return entries.some(([k, v]) => k === "v1" && sameHex(digest, v));
  }
  export function monoSignature(raw: string, signature: string | null, keyBase64: string) {
    try {
      return (
        !!signature &&
        signature.length < 512 &&
        M_lib_nft_i3("sha256", Buffer.from(raw), Buffer.from(keyBase64, "base64"), Buffer.from(signature, "base64"))
      );
    } catch {
      return false;
    }
  }
}
// lib/crypto/ton-payment.ts
namespace M_lib_crypto_ton_payment {
  export interface TonCryptoOrder {
    orderId: string;
    giftAddress: string;
    giftName: string;
    mode: "buy" | "rent";
    rentDuration?: 1 | 7 | 30;
    amountGram: number;
    amountTon?: number;
    expectedUsdt?: number;
    storeWallet: string;
    customerWallet: string;
    memo: string;
    status: "pending" | "paid" | "dispatched" | "failed";
    txHash?: string;
    paidAt?: number;
    createdAt: number;
  }
  export const STORE_TON_WALLET = "UQBhos7uoI_1Fs4HCUWUEqv3ZVwKb_EWuHeOO7LMH2t34Wwl";
  // Compatibility exports fail closed until durable NFT ordering and transfer exist.
  export function createCryptoOrder(params: {
    giftAddress: string;
    giftName: string;
    mode: "buy" | "rent";
    rentDuration?: 1 | 7 | 30;
    amountGram: number;
    amountTon?: number;
    customerWallet: string;
    storeWallet?: string;
  }): TonCryptoOrder {
    throw Error("nft_checkout_unavailable");
  }
  export function getCryptoOrder(_orderId: string): TonCryptoOrder | null {
    return null;
  }
  export function markOrderPaid(_orderId: string, _txHash: string): TonCryptoOrder | null {
    return null;
  }
  export async function verifyTonBlockchainPayment(_orderId: string): Promise<{
    paid: boolean;
    txHash?: string;
    amount?: number;
    order?: TonCryptoOrder;
  }> {
    return {paid: false};
  }
  export function handleTonkeeperWebhookPayload(_payload: unknown): {
    success: boolean;
    matchedOrder?: TonCryptoOrder;
  } {
    return {success: false};
  }
}
// lib/design-copy.ts
namespace M_lib_design_copy {
  export const designCopy = {
    uk: {
      eyebrow: "ТВІЙ ПРОСТІР ЦИФРОВИХ МОЖЛИВОСТЕЙ",
      title: "Більше можливостей. Менше зайвого.",
      intro: "Telegram, Steam, SMM, верифікації та Telegram NFT Подарунки — усе в єдиному каталозі.",
      browse: "Обрати категорію",
      openBot: "Відкрити бота",
      categories: "Що шукаємо сьогодні?",
      categoryIntro: "Єдиний простір цифрових товарів. П'ять напрямків.",
      tg: "Обери країну, ціну та характеристики акаунта.",
      steam: "Ігри та акаунти для твоєї бібліотеки.",
      smm: "Платформа, послуга, кількість — в одному замовленні.",
      verify: "Індивідуальна допомога та ручне виконання.",
      gifts: "Рідкісні Telegram NFT подарунки через MarketApp API.",
      explore: "Переглянути",
      countries: "Країни Telegram-акаунтів",
      how: "Від вибору до результату",
      steps: ["Обери товар або послугу", "Перевір ціну й параметри", "Отримай результат у замовленні"],
      help: "Умови завжди поруч",
      helpText: "Ознайомся з правилами, оплатою та способом видачі перед замовленням.",
      recommended: "Обирай свій напрямок",
      home: "Головна",
    },
    ru: {
      eyebrow: "ТВОЁ ПРОСТРАНСТВО ЦИФРОВЫХ ВОЗМОЖНОСТЕЙ",
      title: "Больше возможностей. Меньше лишнего.",
      intro: "Telegram, Steam, SMM, верификации и Telegram NFT Подарки — всё в едином каталоге.",
      browse: "Выбрать категорию",
      openBot: "Открыть бота",
      categories: "Что ищем сегодня?",
      categoryIntro: "Единое пространство цифровых товаров. Пять направлений.",
      tg: "Выбери страну, цену и характеристики аккаунта.",
      steam: "Игры и аккаунты для твоей библиотеки.",
      smm: "Платформа, услуга, количество — в одном заказе.",
      verify: "Индивидуальная помощь и ручное выполнение.",
      gifts: "Редкие Telegram NFT подарки через MarketApp API.",
      explore: "Посмотреть",
      countries: "Страны Telegram-аккаунтов",
      how: "От выбора до результата",
      steps: ["Выбери товар или услугу", "Проверь цену и параметры", "Получи результат в заказе"],
      help: "Условия всегда рядом",
      helpText: "Ознакомься с правилами, оплатой и способом выдачи перед заказом.",
      recommended: "Выбирай своё направление",
      home: "Главная",
    },
    en: {
      eyebrow: "YOUR SPACE FOR DIGITAL POSSIBILITIES",
      title: "More possibilities. Less friction.",
      intro: "Telegram, Steam, SMM, verifications and Telegram NFT Gifts — all in one catalog.",
      browse: "Explore categories",
      openBot: "Open bot",
      categories: "What are you looking for?",
      categoryIntro: "One space for digital goods. Five core categories.",
      tg: "Choose the country, price and account features.",
      steam: "Games and accounts for your library.",
      smm: "Platform, service and quantity in one order.",
      verify: "Individual assistance and manual fulfillment.",
      gifts: "Rare Telegram NFT gifts on TON via MarketApp API.",
      explore: "Explore",
      countries: "Telegram account countries",
      how: "From choice to result",
      steps: ["Choose a product or service", "Check the price and details", "Receive the result in your order"],
      help: "Know the terms",
      helpText: "Read the rules, payment terms and delivery method before ordering.",
      recommended: "Find your category",
      home: "Home",
    },
  } satisfies Record<M_lib_catalog_i1, Record<string, string | string[]>>;
}
// lib/internal-auth.ts
namespace M_lib_internal_auth {
  export function internalAuthorized(headers: Headers, secretName: "INTERNAL_API_SECRET" | "CRON_SECRET" = "INTERNAL_API_SECRET") {
    const expected = process.env[secretName];
    const actual = headers.get("authorization")?.replace(/^Bearer /, "");
    if (!expected || expected.length < 32 || !actual || actual.length > 512) return false;
    return M_lib_admin_crypto_i2(M_lib_nft_i0("sha256").update(expected).digest(), M_lib_nft_i0("sha256").update(actual).digest());
  }
}
// lib/nft.ts
namespace M_lib_nft {
  export const NFT_SHOP_ADDRESS = "UQBhos7uoI_1Fs4HCUWUEqv3ZVwKb_EWuHeOO7LMH2t34Wwl";
  export function nftAddress(value: unknown) {
    try {
      if (typeof value !== "string") throw Error();
      const a = M_lib_nft_i4.parse(value);
      if (a.workChain !== 0) throw Error();
      return a.toRawString();
    } catch {
      throw new M_lib_commerce_core.ShopError("invalid_address");
    }
  }
  export function nativePrice(details: unknown): bigint {
    if (!details || typeof details !== "object") throw new M_lib_commerce_core.ShopError("nft_not_for_sale", 409);
    const d = details as Record<string, unknown>;
    if (d.currency !== "GRAM" && d.currency !== "TON") throw new M_lib_commerce_core.ShopError("nft_gram_only", 409);
    if (typeof d.price !== "string" || !/^\d{1,18}$/.test(d.price) || BigInt(d.price) <= 0n)
      throw new M_lib_commerce_core.ShopError("invalid_price", 503);
    return BigInt(d.price);
  }
  export function nftServiceFee(base: bigint) {
    return (base * 7n + 99n) / 100n;
  }
  export type NftTransaction = {
    validUntil: number;
    messages: {
      address: string;
      amount: string;
      payload?: string;
      stateInit?: string;
    }[];
  };
  export function validateNftTransaction(raw: unknown, base: bigint, now = Math.floor(Date.now() / 1000)): NftTransaction {
    if (!raw || typeof raw !== "object") throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
    const d = raw as NftTransaction;
    if (
      !Number.isSafeInteger(d.validUntil) ||
      d.validUntil <= now + 15 ||
      d.validUntil > now + 3600 ||
      !Array.isArray(d.messages) ||
      d.messages.length < 1 ||
      d.messages.length > 4
    )
      throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
    let total = 0n;
    const messages = d.messages.map((m) => {
      const rawAddress = nftAddress(m?.address);
      let bounceable = true;
      try {
        const flags = M_lib_nft_i4.parseFriendly(m.address);
        if (flags.isTestOnly) throw new M_lib_commerce_core.ShopError("nft_mainnet_required");
        bounceable = flags.isBounceable;
      } catch (e) {
        if (e instanceof M_lib_commerce_core.ShopError) throw e;
      }
      const address = M_lib_nft_i4.parse(rawAddress).toString({bounceable, testOnly: false, urlSafe: true});
      if (typeof m.amount !== "string" || !/^\d{1,18}$/.test(m.amount) || BigInt(m.amount) <= 0n)
        throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
      total += BigInt(m.amount);
      const out: {
        address: string;
        amount: string;
        payload?: string;
        stateInit?: string;
      } = {address, amount: m.amount};
      for (const key of ["payload", "stateInit"] as const) {
        const value = m[key];
        if (value != null) {
          if (typeof value !== "string" || value.length > 64000 || !value.length)
            throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
          try {
            if (M_lib_nft_i5.fromBase64(value).toBoc().length > 48000) throw Error();
          } catch {
            throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
          }
          out[key] = value;
        }
      }
      return out;
    });
    // Provider may attach network gas. No unexplained high-value extra messages.
    if (total < base || total > base + 1000000000n) throw new M_lib_commerce_core.ShopError("invalid_nft_transaction", 503);
    return {validUntil: Math.min(d.validUntil, now + 300), messages};
  }
  async function market(path: string, body?: unknown): Promise<Record<string, unknown>> {
    const token = process.env.MARKETAPP_API_TOKEN?.trim();
    if (!token) throw new M_lib_commerce_core.ShopError("marketapp_not_configured", 503);
    try {
      const r = await fetch("https://api.marketapp.org" + path, {
        method: body ? "POST" : "GET",
        headers: {Authorization: token, "Content-Type": "application/json"},
        ...(body ? {body: typeof body === "string" ? body : JSON.stringify(body)} : {}),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok)
        throw new M_lib_commerce_core.ShopError(
          r.status === 401 || r.status === 403 ? "marketapp_access_required" : "nft_provider_unavailable",
          503,
        );
      const d = await r.json();
      if (!d || typeof d !== "object" || Array.isArray(d)) throw Error();
      return d;
    } catch (e) {
      if (e instanceof M_lib_commerce_core.ShopError) throw e;
      throw new M_lib_commerce_core.ShopError("nft_provider_unavailable", 503);
    }
  }
  async function rpc(method: string, params: Record<string, unknown>) {
    try {
      const r = await fetch("https://toncenter.com/api/v2/" + method, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.TONCENTER_API_KEY ? {"X-API-Key": process.env.TONCENTER_API_KEY} : {}),
        },
        body: JSON.stringify(params),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw Error();
      return d.result;
    } catch {
      throw new M_lib_commerce_core.ShopError("chain_unavailable", 503);
    }
  }
  export function tonProofDigest(
    address: string,
    proof: {
      timestamp: number;
      domain: {
        lengthBytes: number;
        value: string;
      };
      payload: string;
    },
  ) {
    const a = M_lib_nft_i4.parse(address),
      domain = Buffer.from(proof.domain.value, "utf8");
    if (domain.length !== proof.domain.lengthBytes || !Number.isSafeInteger(proof.timestamp))
      throw new M_lib_commerce_core.ShopError("invalid_wallet_proof");
    const wc = Buffer.alloc(4);
    wc.writeInt32BE(a.workChain);
    const len = Buffer.alloc(4);
    len.writeUInt32LE(domain.length);
    const ts = Buffer.alloc(8);
    ts.writeBigUInt64LE(BigInt(proof.timestamp));
    const message = Buffer.concat([Buffer.from("ton-proof-item-v2/"), wc, a.hash, len, domain, ts, Buffer.from(proof.payload)]);
    return M_lib_nft_i0("sha256")
      .update(Buffer.concat([Buffer.from([255, 255]), Buffer.from("ton-connect"), M_lib_nft_i0("sha256").update(message).digest()]))
      .digest();
  }
  export function verifyNftProof(
    address: string,
    raw: unknown,
    payload: string,
    publicKey: Buffer,
    domain: string,
    now = Math.floor(Date.now() / 1000),
  ) {
    try {
      const p = raw as {
        timestamp: number;
        domain: {
          lengthBytes: number;
          value: string;
        };
        payload: string;
        signature: string;
      };
      if (
        !p ||
        p.payload !== payload ||
        p.domain?.value !== domain ||
        !Number.isSafeInteger(p.timestamp) ||
        Math.abs(now - p.timestamp) > 300 ||
        typeof p.signature !== "string" ||
        publicKey.length !== 32
      )
        return false;
      const signature = Buffer.from(p.signature, "base64");
      if (signature.length !== 64) return false;
      const key = M_lib_nft_i1({
        key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), publicKey]),
        format: "der",
        type: "spki",
      });
      return M_lib_nft_i3(null, tonProofDigest(address, p), key, signature);
    } catch {
      return false;
    }
  }
  export async function nftChallenge(userId: string) {
    const payload = M_lib_nft_i2(32).toString("hex");
    await M_lib_db.db.nftWalletProof.upsert({
      where: {userId},
      create: {userId, payload, expiresAt: new Date(Date.now() + 300000)},
      update: {payload, address: null, expiresAt: new Date(Date.now() + 300000)},
    });
    return {payload};
  }
  export async function authenticateNftWallet(userId: string, d: Record<string, unknown>) {
    if (d.chain !== "-239") throw new M_lib_commerce_core.ShopError("nft_mainnet_required");
    const address = nftAddress(d.address),
      nonce = await M_lib_db.db.nftWalletProof.findUnique({where: {userId}});
    if (!nonce || nonce.address || nonce.expiresAt.getTime() < Date.now())
      throw new M_lib_commerce_core.ShopError("wallet_proof_expired", 409);
    const result = await rpc("runGetMethod", {address, method: "get_public_key", stack: []});
    if (result.exit_code !== 0 || result.stack?.[0]?.[0] !== "num") throw new M_lib_commerce_core.ShopError("wallet_not_initialized", 409);
    let key: Buffer;
    try {
      const hex = BigInt(result.stack[0][1]).toString(16).padStart(64, "0");
      if (hex.length !== 64) throw Error();
      key = Buffer.from(hex, "hex");
    } catch {
      throw new M_lib_commerce_core.ShopError("invalid_wallet_proof");
    }
    if (!verifyNftProof(address, d.proof, nonce.payload, key, new URL(M_lib_commerce_core.siteOrigin()).host))
      throw new M_lib_commerce_core.ShopError("invalid_wallet_proof", 403);
    const changed = await M_lib_db.db.nftWalletProof.updateMany({
      where: {userId, payload: nonce.payload, address: null, expiresAt: {gt: new Date()}},
      data: {address, expiresAt: new Date(Date.now() + 3600000)},
    });
    if (changed.count !== 1) throw new M_lib_commerce_core.ShopError("wallet_proof_expired", 409);
    return {address};
  }
  async function ownerOnChain(address: string) {
    const result = await rpc("runGetMethod", {address, method: "get_nft_data", stack: []});
    if (result.exit_code !== 0 || !result.stack?.[3] || result.stack[3][0] !== "cell")
      throw new M_lib_commerce_core.ShopError("invalid_nft", 503);
    try {
      return M_lib_nft_i5.fromBase64(result.stack[3][1].bytes).beginParse().loadAddress().toRawString();
    } catch {
      throw new M_lib_commerce_core.ShopError("invalid_nft", 503);
    }
  }
  export async function prepareNft(userId: string, d: Record<string, unknown>) {
    const address = nftAddress(d.address),
      wallet = nftAddress(d.walletAddress),
      proof = await M_lib_db.db.nftWalletProof.findUnique({where: {userId}});
    if (!proof || proof.address !== wallet || proof.expiresAt.getTime() < Date.now())
      throw new M_lib_commerce_core.ShopError("wallet_proof_required", 409);
    const info = await market("/v1/nfts/" + encodeURIComponent(address) + "/");
    if (nftAddress(info.address) !== address || (info.status !== "for_sale" && info.status !== "for_sale_and_rent"))
      throw new M_lib_commerce_core.ShopError("nft_not_for_sale", 409);
    const details = info.status === "for_sale_and_rent" ? (info.status_details as Record<string, unknown>)?.for_sale : info.status_details;
    const base = nativePrice(details);
    if (typeof d.expectedBaseNano !== "string" || !/^\d{1,18}$/.test(d.expectedBaseNano))
      throw new M_lib_commerce_core.ShopError("invalid_price");
    const expected = BigInt(d.expectedBaseNano);
    if (base !== expected) throw new M_lib_commerce_core.ShopError("nft_price_changed", 409);
    const previousOwner = await ownerOnChain(address);
    if (previousOwner === wallet) throw new M_lib_commerce_core.ShopError("nft_already_owned", 409);
    const provider = await market(
      "/v1/nfts/buy/",
      '{"data":[{"nft_address":' +
        JSON.stringify(address) +
        ',"price":' +
        M_lib_nft_i7(base) +
        ',"currency":' +
        JSON.stringify((details as Record<string, unknown>).currency) +
        "}]}",
    );
    const transaction = validateNftTransaction(provider.transaction, base),
      fee = nftServiceFee(base);
    const row = await M_lib_db.db.nftPurchase.create({
      data: {
        userId,
        nftAddress: address,
        walletAddress: wallet,
        previousOwner,
        name: String(info.name ?? "NFT").slice(0, 200),
        baseNano: base.toString(),
        feeNano: fee.toString(),
        transaction,
        expiresAt: new Date(transaction.validUntil * 1000),
      },
    });
    return {
      id: row.id,
      transaction,
      base: M_lib_nft_i7(base),
      fee: M_lib_nft_i7(fee),
      total: M_lib_nft_i7(base + fee),
      networkAttached: M_lib_nft_i7(transaction.messages.reduce((n, m) => n + BigInt(m.amount), 0n) - base),
      state: row.state,
    };
  }
  export function feeTransaction(id: string, amount: string) {
    return {
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: NFT_SHOP_ADDRESS,
          amount,
          payload: M_lib_nft_i6()
            .storeUint(0, 32)
            .storeStringTail("legit-nft-fee:" + id)
            .endCell()
            .toBoc()
            .toString("base64"),
        },
      ],
    };
  }
  export function nftDeliveryReceipt(raw: unknown, nft: string, previousOwner: string, wallet: string, created: Date): string | null {
    try {
      if (typeof raw !== "string" || raw.length > 160000) return null;
      const cell = M_lib_nft_i5.fromBase64(raw),
        tx = nftLoadTransaction(cell.beginParse()),
        d = tx.description,
        msg = tx.inMessage;
      if (
        tx.address !== BigInt("0x" + M_lib_nft_i4.parse(nft).hash.toString("hex")) ||
        tx.now < Math.floor(created.getTime() / 1000) ||
        d.type !== "generic" ||
        d.aborted ||
        d.destroyed ||
        d.computePhase.type !== "vm" ||
        !d.computePhase.success ||
        ![0, 1].includes(d.computePhase.exitCode) ||
        (d.actionPhase && (!d.actionPhase.success || d.actionPhase.resultCode !== 0))
      )
        return null;
      if (!msg || msg.info.type !== "internal" || msg.info.bounced || msg.info.src.toRawString() !== previousOwner) return null;
      const body = msg.body.beginParse();
      if (body.loadUint(32) !== 0x5fcc3d14) return null;
      body.loadUintBig(64);
      if (body.loadAddress().toRawString() !== wallet) return null;
      return cell.hash().toString("hex");
    } catch {
      return null;
    }
  }
  export function nftFeeReceipt(raw: unknown, id: string, wallet: string, fee: string, created: Date): string | null {
    try {
      if (typeof raw !== "string" || raw.length > 160000) return null;
      const cell = M_lib_nft_i5.fromBase64(raw),
        tx = nftLoadTransaction(cell.beginParse()),
        d = tx.description,
        msg = tx.inMessage,
        shop = M_lib_nft_i4.parse(NFT_SHOP_ADDRESS);
      if (
        tx.address !== BigInt("0x" + shop.hash.toString("hex")) ||
        tx.now < Math.floor(created.getTime() / 1000) ||
        d.type !== "generic" ||
        d.destroyed ||
        d.bouncePhase?.type === "ok" ||
        !d.creditPhase ||
        d.creditPhase.credit.coins < BigInt(fee)
      )
        return null;
      if (
        !msg ||
        msg.info.type !== "internal" ||
        msg.info.bounced ||
        msg.info.src.toRawString() !== wallet ||
        !msg.info.dest.equals(shop) ||
        msg.info.value.coins < BigInt(fee)
      )
        return null;
      const body = msg.body.beginParse();
      if (body.loadUint(32) !== 0 || body.loadStringTail() !== "legit-nft-fee:" + id) return null;
      return cell.hash().toString("hex");
    } catch {
      return null;
    }
  }
  export async function claimNftFee(userId: string, id: unknown) {
    if (typeof id !== "string" || !/^[a-z0-9]{20,40}$/.test(id)) throw new M_lib_commerce_core.ShopError("invalid_order");
    const row = await M_lib_db.db.nftPurchase.findFirst({where: {id, userId}});
    if (!row || row.state !== "DELIVERED") throw new M_lib_commerce_core.ShopError("nft_not_delivered", 409);
    const until = new Date(Date.now() + 300000),
      changed = await M_lib_db.db.nftPurchase.updateMany({
        where: {id, userId, state: "DELIVERED", OR: [{feePendingUntil: null}, {feePendingUntil: {lte: new Date()}}]},
        data: {feePendingUntil: until},
      });
    if (changed.count !== 1) throw new M_lib_commerce_core.ShopError("fee_pending", 409);
    const transaction = feeTransaction(id, row.feeNano);
    transaction.validUntil = Math.floor(until.getTime() / 1000);
    return {transaction};
  }
  export async function nftStatus(userId: string, id: unknown) {
    if (typeof id !== "string" || !/^[a-z0-9]{20,40}$/.test(id)) throw new M_lib_commerce_core.ShopError("invalid_order");
    const row = await M_lib_db.db.nftPurchase.findFirst({where: {id, userId}});
    if (!row) throw new M_lib_commerce_core.ShopError("not_found", 404);
    let state = row.state;
    if (state === "PREPARED" || state === "EXPIRED") {
      if ((await ownerOnChain(row.nftAddress)) === row.walletAddress) {
        const txs = await rpc("getTransactions", {address: row.nftAddress, limit: 100, archival: true});
        let hash: string | null = null;
        if (Array.isArray(txs))
          for (const tx of txs) {
            hash = nftDeliveryReceipt(tx.data, row.nftAddress, row.previousOwner, row.walletAddress, row.createdAt);
            if (hash) break;
          }
        if (hash)
          try {
            await M_lib_db.db.nftPurchase.updateMany({
              where: {id, userId, state: {in: ["PREPARED", "EXPIRED"]}},
              data: {state: "DELIVERED", deliveryTxHash: hash, deliveredAt: new Date()},
            });
            state = "DELIVERED";
          } catch (e) {
            if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
              await M_lib_db.db.nftPurchase.updateMany({where: {id, state: {in: ["PREPARED", "EXPIRED"]}}, data: {state: "DUPLICATE"}});
              state = "DUPLICATE";
            } else throw e;
          }
      } else if (row.expiresAt.getTime() < Date.now()) {
        await M_lib_db.db.nftPurchase.updateMany({where: {id, state: "PREPARED"}, data: {state: "EXPIRED"}});
        state = "EXPIRED";
      }
    }
    if (state === "DELIVERED") {
      const txs = await rpc("getTransactions", {address: NFT_SHOP_ADDRESS, limit: 100, archival: true}).catch(() => []);
      if (Array.isArray(txs))
        for (const tx of txs) {
          const hash = nftFeeReceipt(tx.data, id, row.walletAddress, row.feeNano, row.createdAt);
          if (!hash) continue;
          await M_lib_db.db.nftPurchase.updateMany({where: {id, state: "DELIVERED"}, data: {state: "COMPLETE", feeTxHash: hash}});
          state = "COMPLETE";
          break;
        }
    }
    return {
      id,
      state,
      feePending: !!row.feePendingUntil && row.feePendingUntil.getTime() > Date.now(),
      name: row.name,
      nftAddress: row.nftAddress,
      walletAddress: row.walletAddress,
      fee: M_lib_nft_i7(row.feeNano),
      base: M_lib_nft_i7(row.baseNano),
      ...(state === "DELIVERED" ? {feeTransaction: feeTransaction(id, row.feeNano)} : {}),
    };
  }
}
// lib/security/launch-config.ts
namespace M_lib_security_launch_config {
  export type LaunchCheck = {
    id: string;
    ok: boolean;
    required: boolean;
    message: string;
  };
  export function launchConfiguration(env: Record<string, string | undefined>, now = Date.now()) {
    const checks: LaunchCheck[] = [];
    const add = (id: string, ok: boolean, message: string, required = true) => checks.push({id, ok, required, message});
    const has = (name: string) => Boolean(env[name]?.trim());
    let site: URL | undefined;
    try {
      site = new URL(env.NEXT_PUBLIC_SITE_URL ?? "");
    } catch {}
    add(
      "domain",
      Boolean(
        site &&
        site.protocol === "https:" &&
        !site.username &&
        !site.password &&
        site.pathname === "/" &&
        !site.search &&
        !site.hash &&
        !/localhost|127\.0\.0\.1|\.example$|example\.com$/.test(site.hostname),
      ),
      "Вкажіть реальний HTTPS-домен без шляху, параметрів або пароля.",
    );
    add("database", Boolean(env.DATABASE_URL?.startsWith("file:")), "Вбудована SQLite автоматично створюється на Railway Volume.");
    const encoded = env.DELIVERY_ENCRYPTION_KEY ?? "";
    add(
      "encryption",
      /^[A-Za-z0-9+/]{43}=$/.test(encoded) && Buffer.from(encoded, "base64").length === 32,
      "Потрібен постійний 32-байтовий ключ шифрування в base64; не змінюйте його без міграції складу.",
    );
    add(
      "bridge",
      (env.INTERNAL_API_SECRET?.length ?? 0) >= 32,
      "Потрібен INTERNAL_API_SECRET від 32 символів, однаковий у сервісі й боті.",
    );
    add("bot", /^\d{4,}:[A-Za-z0-9_-]{20,}$/.test(env.BOT_TOKEN ?? ""), "Потрібен токен вашого бота з BotFather.");
    add("admin-ids", Boolean(env.ADMIN_ID?.trim()) && env.ADMIN_ID!.split(/[\s,;]+/).filter(Boolean).every(id=>/^[1-9]\d{0,19}$/.test(id)), "Вкажіть власний Telegram ID у ADMIN_ID; вбудованих адміністраторів немає.");
    add(
      "markup",
      Number(env.MARKUP_PERCENT ?? "20") === 20 && Number(env.SMM_MARKUP_PERCENT ?? "20") === 20,
      "Націнка магазину та SMM має бути 20%.",
    );
    add("catalog", env.VERIFICATION_CATALOG_SOURCE !== "archive", "Бойовий каталог верифікацій повинен працювати з БД.");
    add("mock", env.NEXT_PUBLIC_TELEGRAM_MOCK !== "true", "Вимкніть Telegram mock у production.");
    add(
      "stars",
      has("STARS_USDT_PER_STAR") && Number(env.STARS_USDT_PER_STAR) > 0 && Number.isFinite(Number(env.STARS_USDT_PER_STAR)),
      "Для оплати замовлень налаштуйте додатну вартість Stars.",
    );
    const crypto = has("CRYPTO_PAY_TOKEN") && env.CRYPTO_PAY_TESTNET === "false";
    const mono = has("MONO_TOKEN");
    const stripe = /^sk_live_/.test(env.STRIPE_SECRET_KEY ?? "") && /^whsec_/.test(env.STRIPE_WEBHOOK_SECRET ?? "");
    add(
      "web-payments",
      crypto || mono || stripe,
      "Зовнішні платіжні API: Crypto Pay mainnet, Mono або Stripe live з webhook secret.",
      false,
    );
    add("stripe-pair", !has("STRIPE_SECRET_KEY") || has("STRIPE_WEBHOOK_SECRET"), "Stripe потребує обох ключів: API і webhook secret.");
    add("crypto-mainnet", !has("CRYPTO_PAY_TOKEN") || env.CRYPTO_PAY_TESTNET === "false", "Crypto Pay testnet не приймає реальні кошти.");
    if (env.FX_MODE === "manual") {
      let rates: Record<string, number> = {};
      try {
        rates = JSON.parse(env.FX_MANUAL_RATES_JSON ?? "{}");
      } catch {}
      const timestamp = Number(env.FX_MANUAL_UPDATED_AT);
      add(
        "fx",
        Number(rates?.RUB) === 1 &&
          ["USD", "UAH", "USDT"].every((k) => Number(rates?.[k]) > 0 && Number.isFinite(Number(rates?.[k]))) &&
          Number.isFinite(timestamp) &&
          timestamp <= now / 1000 + 300 &&
          now / 1000 - timestamp <= 172800,
        "Ручний курс: RUB=1, додатні USD/UAH/USDT, timestamp не старший 48 годин.",
      );
    } else add("fx", has("LZT_TOKEN"), "Автоматичний курс валют потребує LZT_TOKEN; альтернативно налаштуйте manual FX.");
    add("market-key", has("LZT_TOKEN"), "Для живих Steam/Telegram оголошень потрібен новий LZT_TOKEN.");
    add(
      "market-live",
      env.MARKET_LIVE_ORDERS_ENABLED === "true",
      "Після приймання постачальника увімкніть автоматичні закупівлі LZT.",
      false,
    );
    add("smm-key", has("SMM_API_KEY"), "Для каталогу JustAnotherPanel потрібен новий SMM_API_KEY.");
    add("smm-live", env.SMM_LIVE_ORDERS_ENABLED === "true", "Після приймання постачальника увімкніть автоматичні SMM-замовлення.", false);
    add("nft-market", has("MARKETAPP_API_TOKEN"), "Для реального NFT-каталогу й купівлі потрібен MARKETAPP_API_TOKEN; без нього доступні лише демонстраційні подарунки.", false);
    add("nft-chain", has("TONCENTER_API_KEY"), "TONCENTER_API_KEY рекомендовано для стабільної перевірки NFT-транзакцій.", false);
    let bridgeUrl: URL | undefined;
    try { bridgeUrl = new URL(env.BOT_BRIDGE_URL ?? ""); } catch {}
    add("bot-balance", Boolean(bridgeUrl && bridgeUrl.protocol === "https:" && !bridgeUrl.username && !bridgeUrl.password && !bridgeUrl.search && !bridgeUrl.hash && (env.BOT_BRIDGE_SECRET?.length ?? 0) >= 32),
      "Для показу балансу бота вкажіть HTTPS BOT_BRIDGE_URL і спільний BOT_BRIDGE_SECRET від 32 символів. Monobank налаштовується в боті.", false);
    add(
      "bot-webhook",
      (env.BOT_WEBHOOK_SECRET?.length ?? 0) >= 32,
      "Для бот-handoff потрібен BOT_WEBHOOK_SECRET від 32 символів.",
      has("BOT_WEBHOOK_SECRET"),
    );
    return checks;
  }
}
// lib/operations/readiness.ts
namespace M_lib_operations_readiness {
  export async function readiness() {
    const checks: M_lib_security_launch_config.LaunchCheck[] = M_lib_security_launch_config.launchConfiguration(process.env);
    try {
      const [admins, products, heartbeat] = await Promise.all([
        M_lib_db.db.user.count({where: {role: "ADMIN"}}),
        M_lib_db.db.product.count({where: {active: true}}),
        M_lib_db.db.serviceHeartbeat.findUnique({where: {id: "commerce"}}),
        M_lib_db.db.cartHandoff.count(),
      ]);
      checks.push({
        id: "schema",
        ok: true,
        required: true,
        message: "Міграції БД доступні.",
      });
      checks.push({
        id: "admin",
        ok: admins > 0,
        required: true,
        message: "Потрібен створений адміністратор.",
      });
      checks.push({
        id: "products",
        ok: products > 0,
        required: true,
        message: "Потрібні активні товари в БД.",
      });
      checks.push({
        id: "worker",
        ok: Boolean(heartbeat?.lastSuccessAt && !heartbeat.lastErrorCode && Date.now() - heartbeat.lastSuccessAt.getTime() < 180000),
        required: true,
        message: "Потрібен успішний commerce worker tick за останні 3 хвилини.",
      });
    } catch {
      checks.push({
        id: "schema",
        ok: false,
        required: true,
        message: "БД або міграції недоступні. Виконайте db:deploy.",
      });
    }
    const fx = await M_lib_pricing.optionalFx();
    checks.push({
      id: "live-fx",
      ok: Boolean(fx),
      required: true,
      message: "Сервер повинен отримувати актуальний курс UAH/USDT.",
    });
    return {
      configurationReady: checks.every((c) => !c.required || c.ok),
      checkedAt: new Date().toISOString(),
      checks,
      notice:
        "Це перевірка конфігурації та локального стану. Доступність provider API, приймання оплати і видачу потрібно підтвердити окремо.",
    };
  }
}
// lib/security/policy.ts
namespace M_lib_security_policy {
  // Public headers and path policy. Authorization remains inside every protected API.
  export function privatePath(raw: string) {
    let path = raw;
    for (let i = 0; i < 3; i++) {
      try {
        const decoded = decodeURIComponent(path);
        if (decoded === path) break;
        path = decoded;
      } catch {
        return true;
      }
    }
    path = path.replace(/\\/g, "/").toLowerCase();
    return (
      /(?:^|\/)\.(?:env|git|svn|hg)(?:[/.]|$)/.test(path) ||
      /(?:^|\/)(?:src|prisma|node_modules|backup|backups)(?:\/|$)/.test(path) ||
      /^\/_next\/server(?:\/|$)/.test(path) ||
      /\.(?:map|sql|sqlite|sqlite3|db|bak|old|zip|tar|gz|prisma)(?:\/|$)/.test(path) ||
      /^\/(?:package(?:-lock)?\.json|next\.config\.[^/]+|dockerfile|readme\.md)$/i.test(path)
    );
  }
  export function securityHeaders() {
    return {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), usb=()",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    };
  }
  export function contentPolicy(nonce: string, admin: boolean, production: boolean, telegramAdmin = false) {
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://telegram.org${production ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' https://telegram.org https://raw.githubusercontent.com https://bridge.tonapi.io https://walletbot.me https://tonbridge.telegram.org https://connect.gramwallet.io https://tonconnectbridge.mytonwallet.org${production ? "" : " ws: wss:"}`,
      "frame-src https://oauth.telegram.org https://telegram.org https://t.me",
      `frame-ancestors ${admin && !telegramAdmin ? "'none'" : "'self' https://web.telegram.org https://*.telegram.org https://t.me"}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      ...(production ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
  }
}
// lib/smm/jobs.ts
namespace M_lib_smm_jobs {
  const paidStates = ["PAID", "FULFILLING"] as const;
  function cap() {
    const n = new M_lib_pricing_i0(process.env.SMM_MAX_ORDER_COST ?? "100");
    if (!n.isFinite() || n.lte(0)) throw new M_lib_smm_jobs_i4("bad_config");
    return n;
  }
  function charge(rate: string, quantity: number) {
    return new M_lib_pricing_i0(rate).mul(quantity).div(1000);
  }
  function paid(status: string, at: Date | null) {
    if (!paidStates.some((s) => s === status) || !at) throw new M_lib_smm_jobs_i4("order_not_paid");
  }
  async function verifyPrice(
    item: {
      unitPrice: M_lib_pricing_i0.Value;
      lineTotal?: M_lib_pricing_i0.Value;
      quantity: number;
      order: {
        currency: string;
      };
    },
    cost: M_lib_pricing_i0,
    currency: string,
  ) {
    const c = item.order.currency;
    if (c !== "UAH" && c !== "USDT") throw new M_lib_smm_jobs_i4("unsupported_payment_currency");
    const quote = M_lib_smm_jobs_i1(cost.toString(), currency, await M_lib_pricing.getFx(), M_lib_smm_catalog.smmMarkup());
    const paidMinor =
      item.lineTotal && new M_lib_pricing_i0(item.lineTotal).gt(0)
        ? new M_lib_pricing_i0(item.lineTotal).mul(100)
        : new M_lib_pricing_i0(item.unitPrice).mul(item.quantity).mul(100);
    if (paidMinor.lt(quote[c])) throw new M_lib_smm_jobs_i4("price_changed");
    if (cost.gt(cap())) throw new M_lib_smm_jobs_i4("cost_limit");
  }
  export async function enqueuePaidSmm(orderItemId: string, target: string, telegramId: string) {
    const item = await M_lib_db.db.orderItem.findUnique({
      where: {id: orderItemId},
      include: {
        order: {include: {user: true}},
        product: {include: {category: true}},
        smmJob: true,
      },
    });
    if (!item || String(item.order.user.telegramId) !== telegramId) throw new M_lib_smm_jobs_i4("not_found");
    const key = item.product.slug.replace(/^smm-/, "");
    const service = await M_lib_smm_provider.supplierService(key);
    const link = M_lib_smm_jobs_i2(key, target, service.platform);
    if (item.smmJob) {
      if (item.smmJob.targetLink !== link) throw new M_lib_smm_jobs_i4("immutable_order");
      return item.smmJob;
    }
    paid(item.order.status, item.order.paidAt);
    if (
      item.product.category.slug !== "smm" ||
      item.product.provider !== "smm-v2" ||
      !item.product.active ||
      item.fulfillmentMode !== "PROVIDER" ||
      item.fulfillmentStatus !== "PENDING"
    )
      throw new M_lib_smm_jobs_i4("invalid_order");
    if (item.product.providerProductId !== service.id) throw new M_lib_smm_jobs_i4("mapping_changed");
    const quantity = M_lib_smm_jobs_i3(item.quantity, service.min, service.max);
    const cost = charge(service.rate, quantity);
    await verifyPrice(item, cost, service.currency);
    return M_lib_db.db.$transaction(async (tx) => {
      const fresh = await tx.orderItem.findUnique({
        where: {id: item.id},
        include: {order: true},
      });
      if (!fresh) throw new M_lib_smm_jobs_i4("not_found");
      paid(fresh.order.status, fresh.order.paidAt);
      if (fresh.quantity !== quantity || !new M_lib_pricing_i0(fresh.unitPrice).equals(item.unitPrice)) throw new M_lib_smm_jobs_i4("order_changed");
      const job = await tx.smmJob.upsert({
        where: {orderItemId: item.id},
        create: {
          orderItemId: item.id,
          serviceKey: key,
          providerServiceId: service.id,
          providerFingerprint: M_lib_smm_provider.fingerprint(),
          targetLink: link,
          quantity,
          maxCharge: cost.toString(),
          providerCurrency: service.currency,
        },
        update: {},
      });
      if (job.targetLink !== link) throw new M_lib_smm_jobs_i4("immutable_order");
      return job;
    });
  }
  async function markReview(id: string, code: string) {
    await M_lib_db.db.$transaction(async (tx) => {
      const job = await tx.smmJob.update({
        where: {id},
        data: {state: "UNKNOWN", lastErrorCode: code, leaseUntil: null},
        include: {orderItem: true},
      });
      await tx.order.updateMany({
        where: {
          id: job.orderItem.orderId,
          status: {in: ["PAID", "FULFILLING"]},
        },
        data: {status: "NEEDS_REVIEW"},
      });
    });
  }
  export async function runSmmTick() {
    if (process.env.SMM_LIVE_ORDERS_ENABLED !== "true") return {processed: 0, enabled: false};
    const now = new Date();
    // A stale PREPARING lease made only read calls. A stale SENDING lease may have bought an order.
    await M_lib_db.db.smmJob.updateMany({
      where: {state: "PREPARING", leaseUntil: {lt: now}},
      data: {state: "QUEUED", leaseUntil: null, runAt: now},
    });
    await M_lib_db.db.$transaction(async (tx) => {
      const stale = await tx.smmJob.findMany({
        where: {state: "SENDING", leaseUntil: {lt: now}},
        select: {id: true, orderItem: {select: {orderId: true}}},
      });
      for (const job of stale) {
        const changed = await tx.smmJob.updateMany({
          where: {id: job.id, state: "SENDING", leaseUntil: {lt: now}},
          data: {
            state: "UNKNOWN",
            leaseUntil: null,
            lastErrorCode: "ambiguous_submission",
          },
        });
        if (changed.count)
          await tx.order.updateMany({
            where: {
              id: job.orderItem.orderId,
              status: {in: ["PAID", "FULFILLING"]},
            },
            data: {status: "NEEDS_REVIEW"},
          });
      }
    });
    const candidate = await M_lib_db.db.smmJob.findFirst({
      where: {
        state: {in: ["QUEUED", "RUNNING"]},
        runAt: {lte: now},
        OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
      },
      orderBy: {runAt: "asc"},
    });
    if (!candidate) return {processed: 0, enabled: true};
    const lease = new Date(Date.now() + 120000);
    const isNew = candidate.state === "QUEUED";
    const claim = await M_lib_db.db.smmJob.updateMany({
      where: {
        id: candidate.id,
        state: candidate.state,
        OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
      },
      data: {
        state: isNew ? "PREPARING" : "RUNNING",
        leaseUntil: lease,
        attempts: {increment: 1},
      },
    });
    if (!claim.count) return {processed: 0, enabled: true};
    let sending = false;
    try {
      if (M_lib_smm_provider.fingerprint() !== candidate.providerFingerprint) throw new M_lib_smm_jobs_i4("provider_changed");
      const item = await M_lib_db.db.orderItem.findUnique({
        where: {id: candidate.orderItemId},
        include: {order: true, product: true},
      });
      if (!item) throw new M_lib_smm_jobs_i4("not_found");
      paid(item.order.status, item.order.paidAt);
      if (isNew) {
        const service = await M_lib_smm_provider.supplierService(candidate.serviceKey, true);
        if (
          service.id !== candidate.providerServiceId ||
          service.currency !== candidate.providerCurrency ||
          item.product.providerProductId !== service.id ||
          item.product.provider !== "smm-v2" ||
          !item.product.active ||
          item.quantity !== candidate.quantity ||
          item.fulfillmentStatus !== "PENDING"
        )
          throw new M_lib_smm_jobs_i4("mapping_changed");
        M_lib_smm_jobs_i3(candidate.quantity, service.min, service.max);
        const cost = charge(service.rate, candidate.quantity);
        if (cost.gt(candidate.maxCharge)) throw new M_lib_smm_jobs_i4("price_changed");
        await verifyPrice(item, cost, service.currency);
        const transition = await M_lib_db.db.smmJob.updateMany({
          where: {id: candidate.id, state: "PREPARING", leaseUntil: lease},
          data: {state: "SENDING"},
        });
        if (!transition.count) return {processed: 0, enabled: true};
        sending = true;
        const providerOrderId = await M_lib_smm_provider.addSupplierOrder(service.id, candidate.targetLink, candidate.quantity);
        await M_lib_db.db.$transaction(async (tx) => {
          const saved = await tx.smmJob.updateMany({
            where: {
              id: candidate.id,
              state: {in: ["SENDING", "UNKNOWN"]},
              providerOrderId: null,
              providerFingerprint: candidate.providerFingerprint,
            },
            data: {
              providerOrderId,
              state: "RUNNING",
              leaseUntil: null,
              runAt: new Date(Date.now() + 60000),
              lastErrorCode: null,
            },
          });
          if (!saved.count) throw new M_lib_smm_jobs_i4("response_reconciliation");
          await tx.orderItem.update({
            where: {id: item.id},
            data: {
              provider: "smm-v2",
              providerOrderId,
              fulfillmentStatus: "PROCESSING",
            },
          });
          await tx.order.updateMany({
            where: {id: item.orderId, status: "PAID"},
            data: {status: "FULFILLING"},
          });
        });
      } else {
        if (!candidate.providerOrderId) throw new M_lib_smm_jobs_i4("missing_provider_order");
        const status = await M_lib_smm_provider.getSupplierStatus(candidate.providerOrderId);
        const state = status.state === "COMPLETED" && status.remaining !== null && status.remaining > 0 ? "PARTIAL" : status.state;
        await M_lib_db.db.$transaction(async (tx) => {
          const saved = await tx.smmJob.updateMany({
            where: {id: candidate.id, state: "RUNNING", leaseUntil: lease},
            data: {
              state,
              remaining: status.remaining,
              leaseUntil: null,
              runAt: new Date(Date.now() + 60000),
              lastErrorCode: state === "UNKNOWN" ? "unknown_status" : null,
            },
          });
          if (!saved.count) return;
          if (state === "COMPLETED") {
            const buyer = await tx.user.findUnique({
              where: {id: item.order.userId},
              select: {telegramId: true},
            });
            if (buyer?.telegramId)
              await tx.notification.upsert({
                where: {deduplicationKey: `smm-complete:${item.id}`},
                update: {},
                create: {
                  telegramId: buyer.telegramId,
                  orderId: item.orderId,
                  kind: "SMM_COMPLETED",
                  text: `Legit Assets · ${item.titleSnapshot}\nПослугу виконано / Service completed`,
                  deduplicationKey: `smm-complete:${item.id}`,
                },
              });
            await tx.orderItem.update({
              where: {id: item.id},
              data: {fulfillmentStatus: "DELIVERED", deliveredAt: new Date()},
            });
            const remaining = await tx.orderItem.count({
              where: {
                orderId: item.orderId,
                fulfillmentStatus: {not: "DELIVERED"},
              },
            });
            if (!remaining)
              await tx.order.updateMany({
                where: {
                  id: item.orderId,
                  status: {in: ["PAID", "FULFILLING"]},
                },
                data: {status: "COMPLETED", completedAt: new Date()},
              });
          }
          if (["PARTIAL", "CANCELED", "UNKNOWN"].includes(state)) {
            await tx.order.updateMany({
              where: {id: item.orderId, status: {in: ["PAID", "FULFILLING"]}},
              data: {status: "NEEDS_REVIEW"},
            });
          }
        });
      }
    } catch (e) {
      const code = e instanceof M_lib_smm_jobs_i4 ? e.code : "storage_or_upstream";
      // No blind retry after the add call, even if DB commit failed after a supplier success.
      if (sending) {
        await markReview(candidate.id, code);
      } else if (["provider_transport", "provider_http", "provider_format"].includes(code) && candidate.attempts < 4) {
        await M_lib_db.db.smmJob.update({
          where: {id: candidate.id},
          data: {
            state: isNew ? "QUEUED" : "RUNNING",
            leaseUntil: null,
            runAt: new Date(Date.now() + Math.min(900000, 60000 * 2 ** candidate.attempts)),
            lastErrorCode: code,
          },
        });
      } else {
        await markReview(candidate.id, code);
      }
    }
    return {processed: 1, enabled: true};
  }
}
// lib/store-products.ts
namespace M_lib_store_products {
  export async function storeCategories(locale: M_lib_catalog_i1) {
    return M_lib_db.db.category.findMany({
      where: {active: true},
      include: {translations: {where: {locale}}},
      orderBy: {position: "asc"},
    });
  }
  export async function storeProducts(slug: string, locale: M_lib_catalog_i1) {
    const fx = await M_lib_pricing.optionalFx();
    const rows = await M_lib_db.db.product.findMany({
      where: {category: {slug, active: true}, active: true, provider: null},
      include: {
        translations: true,
        brandAsset: true,
        _count: {select: {inventory: {where: {status: "AVAILABLE"}}}},
      },
      take: 100,
      orderBy: {createdAt: "desc"},
    });
    return rows.map((p) => ({
      id: p.id,
      title: p.translations.find((t) => t.locale === locale)?.title ?? p.slug,
      prices: fx ? M_lib_smm_jobs_i1(p.price.toString(), p.currency, fx, M_lib_pricing.marketMarkup()) : null,
      image: p.brandAsset?.imageUrl ?? p.imageUrl ?? "",
      stock: p.fulfillmentMode === "INVENTORY" ? p._count.inventory : null,
    }));
  }
  export async function storeProduct(id: string, locale: M_lib_catalog_i1) {
    const p = await M_lib_db.db.product.findFirst({
      where: {id, active: true, category: {active: true}, provider: null},
      include: {
        translations: true,
        category: true,
        brandAsset: true,
        _count: {select: {inventory: {where: {status: "AVAILABLE"}}}},
      },
    });
    if (!p) return null;
    const fx = await M_lib_pricing.optionalFx();
    return {
      ...p,
      title: p.translations.find((t) => t.locale === locale)?.title ?? p.slug,
      prices: fx ? M_lib_smm_jobs_i1(p.price.toString(), p.currency, fx, M_lib_pricing.marketMarkup()) : null,
    };
  }
}
// lib/verification-store.ts
namespace M_lib_verification_store {
  export async function verificationItems(): Promise<M_lib_catalog.CatalogItem[]> {
    if (process.env.VERIFICATION_CATALOG_SOURCE === "archive") return M_lib_catalog.catalog.filter((p) => p.category === "verifications");
    const rows = await M_lib_db.db.product.findMany({
      where: {
        category: {slug: "verifications", active: true},
        active: true,
        kind: "SERVICE",
        fulfillmentMode: "MANUAL",
      },
      include: {translations: true, brandAsset: true},
      orderBy: [{verificationGroup: "asc"}, {createdAt: "asc"}],
    });
    return rows.map((p) => ({
      id: p.id,
      category: "verifications",
      title: {
        uk: p.translations.find((t) => t.locale === "uk")?.title ?? p.slug,
        ru: p.translations.find((t) => t.locale === "ru")?.title ?? p.slug,
        en: p.translations.find((t) => t.locale === "en")?.title ?? p.slug,
      },
      amountMinor: Math.round(new M_lib_pricing_i0(p.price).toNumber() * 100),
      baseAmount: new M_lib_pricing_i0(p.price).toFixed(2),
      currency: p.currency,
      imageUrl: p.brandAsset?.imageUrl ?? "",
      mode: "manual",
      brand: {
        name: p.brandAsset?.name ?? M_lib_verification_store_i0[p.id]?.name ?? p.slug,
        imageUrl: p.brandAsset?.imageUrl ?? "",
        color: p.brandAsset?.color ?? M_lib_verification_store_i0[p.id]?.color ?? "#a78bfa",
        group: p.verificationGroup === "exchange" ? "exchange" : p.verificationGroup === "wallet" ? "wallet" : "other",
      },
    }));
  }
  export async function verificationItem(id: string) {
    return (await verificationItems()).find((p) => p.id === id);
  }
}
export import M_lib_db_db = M_lib_db.db;
export import M_lib_admin_crypto_hashPassword = M_lib_admin_crypto.hashPassword;
export import M_lib_admin_crypto_verifyPassword = M_lib_admin_crypto.verifyPassword;
export import M_lib_admin_crypto_newSessionToken = M_lib_admin_crypto.newSessionToken;
export import M_lib_admin_crypto_sessionHash = M_lib_admin_crypto.sessionHash;
export import M_lib_admin_crypto_validToken = M_lib_admin_crypto.validToken;
export import M_lib_commerce_core_json = M_lib_commerce_core.json;
export import M_lib_commerce_core_failure = M_lib_commerce_core.failure;
export import M_lib_commerce_core_siteOrigin = M_lib_commerce_core.siteOrigin;
export import M_lib_commerce_core_sameOrigin = M_lib_commerce_core.sameOrigin;
export import M_lib_commerce_core_body = M_lib_commerce_core.body;
export import M_lib_commerce_core_data = M_lib_commerce_core.data;
export import M_lib_commerce_core_idempotency = M_lib_commerce_core.idempotency;
export import M_lib_commerce_core_atomic = M_lib_commerce_core.atomic;
export import M_lib_commerce_core_rateLimit = M_lib_commerce_core.rateLimit;
export import M_lib_commerce_core_ShopError = M_lib_commerce_core.ShopError;
export import M_lib_auth_telegram_verifyInitData = M_lib_auth_telegram.verifyInitData;
export import M_lib_auth_telegram_verifyWidget = M_lib_auth_telegram.verifyWidget;
export import M_lib_admin_telegram_authorizedAdminIds = M_lib_admin_telegram.authorizedAdminIds;
export import M_lib_admin_telegram_isTelegramAdmin = M_lib_admin_telegram.isTelegramAdmin;
export import M_lib_admin_telegram_verifyAdminInitData = M_lib_admin_telegram.verifyAdminInitData;
export import M_lib_admin_validation_checkOrigin = M_lib_admin_validation.checkOrigin;
export import M_lib_admin_validation_parseProduct = M_lib_admin_validation.parseProduct;
export import M_lib_admin_validation_readJson = M_lib_admin_validation.readJson;
export import M_lib_admin_validation_AdminError = M_lib_admin_validation.AdminError;
export import M_lib_admin_auth_adminFromToken = M_lib_admin_auth.adminFromToken;
export import M_lib_admin_auth_currentAdmin = M_lib_admin_auth.currentAdmin;
export import M_lib_admin_auth_requireAdmin = M_lib_admin_auth.requireAdmin;
export import M_lib_admin_auth_cookieOptions = M_lib_admin_auth.cookieOptions;
export import M_lib_admin_auth_adminCookie = M_lib_admin_auth.adminCookie;
export import M_lib_admin_commerce_validation_adminPage = M_lib_admin_commerce_validation.adminPage;
export import M_lib_admin_commerce_validation_parseCommerceProduct = M_lib_admin_commerce_validation.parseCommerceProduct;
export import M_lib_admin_commerce_validation_orderStates = M_lib_admin_commerce_validation.orderStates;
export import M_lib_admin_commerce_validation_smmStates = M_lib_admin_commerce_validation.smmStates;
export import M_lib_admin_products_adminProducts = M_lib_admin_products.adminProducts;
export import M_lib_admin_products_saveProduct = M_lib_admin_products.saveProduct;
export import M_lib_admin_responses_adminFailure = M_lib_admin_responses.adminFailure;
export import M_lib_admin_responses_adminJson = M_lib_admin_responses.adminJson;
export import M_lib_auth_session_currentUser = M_lib_auth_session.currentUser;
export import M_lib_auth_session_requireUser = M_lib_auth_session.requireUser;
export import M_lib_auth_session_openSession = M_lib_auth_session.openSession;
export import M_lib_auth_session_closeSession = M_lib_auth_session.closeSession;
export import M_lib_auth_session_userCookie = M_lib_auth_session.userCookie;
export import M_lib_bot_bridge_validateBotWallets = M_lib_bot_bridge.validateBotWallets;
export import M_lib_bot_bridge_botWallets = M_lib_bot_bridge.botWallets;
export type M_lib_bot_bridge_BotWallet = M_lib_bot_bridge.BotWallet;
export type M_lib_catalog_CatalogItem = M_lib_catalog.CatalogItem;
export import M_lib_catalog_catalog = M_lib_catalog.catalog;
export type M_lib_catalog_PricedCatalogItem = M_lib_catalog.PricedCatalogItem;
export import M_lib_lzt_http_marketGet = M_lib_lzt_http.marketGet;
export import M_lib_lzt_http_record = M_lib_lzt_http.record;
export import M_lib_lzt_http_MarketError = M_lib_lzt_http.MarketError;
export import M_lib_pricing_getFx = M_lib_pricing.getFx;
export import M_lib_pricing_optionalFx = M_lib_pricing.optionalFx;
export import M_lib_pricing_marketMarkup = M_lib_pricing.marketMarkup;
export import M_lib_profile_onboardingLocale = M_lib_profile.onboardingLocale;
export import M_lib_profile_validateOnboarding = M_lib_profile.validateOnboarding;
export import M_lib_profile_requireOnboarded = M_lib_profile.requireOnboarded;
export import M_lib_profile_readAvatarBytes = M_lib_profile.readAvatarBytes;
export import M_lib_profile_sanitizeAvatar = M_lib_profile.sanitizeAvatar;
export import M_lib_smm_provider_fingerprint = M_lib_smm_provider.fingerprint;
export import M_lib_smm_provider_smmConfigured = M_lib_smm_provider.smmConfigured;
export import M_lib_smm_provider_requestPanel = M_lib_smm_provider.requestPanel;
export import M_lib_smm_provider_getSupplierServices = M_lib_smm_provider.getSupplierServices;
export import M_lib_smm_provider_supplierService = M_lib_smm_provider.supplierService;
export import M_lib_smm_provider_addSupplierOrder = M_lib_smm_provider.addSupplierOrder;
export import M_lib_smm_provider_getSupplierStatus = M_lib_smm_provider.getSupplierStatus;
export type M_lib_smm_provider_SupplierService = M_lib_smm_provider.SupplierService;
export import M_lib_smm_catalog_smmMarkup = M_lib_smm_catalog.smmMarkup;
export import M_lib_smm_catalog_publicSmmCatalog = M_lib_smm_catalog.publicSmmCatalog;
export import M_lib_smm_catalog_smmQuote = M_lib_smm_catalog.smmQuote;
export import M_lib_smm_catalog_smmCatalogPage = M_lib_smm_catalog.smmCatalogPage;
export type M_lib_smm_catalog_PublicSmmService = M_lib_smm_catalog.PublicSmmService;
export type M_lib_smm_catalog_SmmFilters = M_lib_smm_catalog.SmmFilters;
export type M_lib_smm_catalog_SmmCatalogPage = M_lib_smm_catalog.SmmCatalogPage;
export import M_lib_telegram_values_spamState = M_lib_telegram_values.spamState;
export type M_lib_telegram_values_SpamState = M_lib_telegram_values.SpamState;
export import M_lib_telegram_market_parseFilters = M_lib_telegram_market.parseFilters;
export import M_lib_telegram_market_normalizeListing = M_lib_telegram_market.normalizeListing;
export import M_lib_telegram_market_listTelegram = M_lib_telegram_market.listTelegram;
export import M_lib_telegram_market_getTelegram = M_lib_telegram_market.getTelegram;
export type M_lib_telegram_market_TelegramListing = M_lib_telegram_market.TelegramListing;
export type M_lib_telegram_market_TelegramFilters = M_lib_telegram_market.TelegramFilters;
export type M_lib_telegram_market_TelegramPage = M_lib_telegram_market.TelegramPage;
export import M_lib_commerce_market_marketItem = M_lib_commerce_market.marketItem;
export import M_lib_commerce_market_listSteam = M_lib_commerce_market.listSteam;
export import M_lib_commerce_market_buyMarket = M_lib_commerce_market.buyMarket;
export import M_lib_commerce_market_steamGames = M_lib_commerce_market.steamGames;
export import M_lib_commerce_encryption_encryptionReady = M_lib_commerce_encryption.encryptionReady;
export import M_lib_commerce_encryption_encrypt = M_lib_commerce_encryption.encrypt;
export import M_lib_commerce_encryption_decrypt = M_lib_commerce_encryption.decrypt;
export import M_lib_gifts_marketapp_getBinanceOnlineRates = M_lib_gifts_marketapp.getBinanceOnlineRates;
export import M_lib_gifts_marketapp_getTonRate = M_lib_gifts_marketapp.getTonRate;
export import M_lib_gifts_marketapp_normalizeMarketGift = M_lib_gifts_marketapp.normalizeMarketGift;
export import M_lib_gifts_marketapp_fetchGiftsOnSale = M_lib_gifts_marketapp.fetchGiftsOnSale;
export import M_lib_gifts_marketapp_fetchGiftByAddress = M_lib_gifts_marketapp.fetchGiftByAddress;
export type M_lib_gifts_marketapp_MarketAppAttribute = M_lib_gifts_marketapp.MarketAppAttribute;
export type M_lib_gifts_marketapp_MarketAppGift = M_lib_gifts_marketapp.MarketAppGift;
export type M_lib_gifts_marketapp_NormalizedGift = M_lib_gifts_marketapp.NormalizedGift;
export type M_lib_gifts_marketapp_GiftsFilter = M_lib_gifts_marketapp.GiftsFilter;
export type M_lib_gifts_marketapp_BinanceOnlinePrices = M_lib_gifts_marketapp.BinanceOnlinePrices;
export import M_lib_commerce_checkout_parseCart = M_lib_commerce_checkout.parseCart;
export import M_lib_commerce_checkout_cartHash = M_lib_commerce_checkout.cartHash;
export import M_lib_commerce_checkout_priceCart = M_lib_commerce_checkout.priceCart;
export import M_lib_commerce_checkout_paidEffects = M_lib_commerce_checkout.paidEffects;
export import M_lib_commerce_checkout_createOrder = M_lib_commerce_checkout.createOrder;
export type M_lib_commerce_checkout_CartLine = M_lib_commerce_checkout.CartLine;
export type M_lib_commerce_checkout_PricedLine = M_lib_commerce_checkout.PricedLine;
export import M_lib_commerce_payments_apiJson = M_lib_commerce_payments.apiJson;
export import M_lib_commerce_payments_cryptoCall = M_lib_commerce_payments.cryptoCall;
export import M_lib_commerce_payments_telegramCall = M_lib_commerce_payments.telegramCall;
export import M_lib_commerce_payments_monoCall = M_lib_commerce_payments.monoCall;
export import M_lib_commerce_payments_validPaymentUrl = M_lib_commerce_payments.validPaymentUrl;
export import M_lib_commerce_payments_finishInvoice = M_lib_commerce_payments.finishInvoice;
export import M_lib_commerce_payments_createDeposit = M_lib_commerce_payments.createDeposit;
export import M_lib_commerce_payments_createStarsInvoice = M_lib_commerce_payments.createStarsInvoice;
export import M_lib_commerce_payments_confirmPayment = M_lib_commerce_payments.confirmPayment;
export import M_lib_commerce_payments_reconcilePayment = M_lib_commerce_payments.reconcilePayment;
export import M_lib_commerce_payments_starsPrecheck = M_lib_commerce_payments.starsPrecheck;
export import M_lib_commerce_fulfillment_completeItem = M_lib_commerce_fulfillment.completeItem;
export import M_lib_commerce_fulfillment_marketTick = M_lib_commerce_fulfillment.marketTick;
export import M_lib_commerce_fulfillment_expireOrders = M_lib_commerce_fulfillment.expireOrders;
export import M_lib_commerce_admin_manualDelivery = M_lib_commerce_admin.manualDelivery;
export import M_lib_commerce_admin_refundOrder = M_lib_commerce_admin.refundOrder;
export import M_lib_commerce_bot_payload_handoffCategory = M_lib_commerce_bot_payload.handoffCategory;
export import M_lib_commerce_bot_payload_botOrderPayload = M_lib_commerce_bot_payload.botOrderPayload;
export import M_lib_commerce_bot_payload_parseBotOrderPayload = M_lib_commerce_bot_payload.parseBotOrderPayload;
export import M_lib_commerce_handoff_createHandoff = M_lib_commerce_handoff.createHandoff;
export import M_lib_commerce_handoff_claimHandoff = M_lib_commerce_handoff.claimHandoff;
export import M_lib_commerce_handoff_createBotHandoff = M_lib_commerce_handoff.createBotHandoff;
export import M_lib_commerce_handoff_readBotHandoff = M_lib_commerce_handoff.readBotHandoff;
export import M_lib_commerce_bot_authorizedBotWebhook = M_lib_commerce_bot.authorizedBotWebhook;
export import M_lib_commerce_bot_botCall = M_lib_commerce_bot.botCall;
export import M_lib_commerce_bot_handleBotUpdate = M_lib_commerce_bot.handleBotUpdate;
export type M_lib_commerce_bot_BotUser = M_lib_commerce_bot.BotUser;
export type M_lib_commerce_bot_BotUpdate = M_lib_commerce_bot.BotUpdate;
export import M_lib_commerce_signatures_sameHex = M_lib_commerce_signatures.sameHex;
export import M_lib_commerce_signatures_cryptoSignature = M_lib_commerce_signatures.cryptoSignature;
export import M_lib_commerce_signatures_stripeSignature = M_lib_commerce_signatures.stripeSignature;
export import M_lib_commerce_signatures_monoSignature = M_lib_commerce_signatures.monoSignature;
export import M_lib_crypto_ton_payment_createCryptoOrder = M_lib_crypto_ton_payment.createCryptoOrder;
export import M_lib_crypto_ton_payment_getCryptoOrder = M_lib_crypto_ton_payment.getCryptoOrder;
export import M_lib_crypto_ton_payment_markOrderPaid = M_lib_crypto_ton_payment.markOrderPaid;
export import M_lib_crypto_ton_payment_verifyTonBlockchainPayment = M_lib_crypto_ton_payment.verifyTonBlockchainPayment;
export import M_lib_crypto_ton_payment_handleTonkeeperWebhookPayload = M_lib_crypto_ton_payment.handleTonkeeperWebhookPayload;
export type M_lib_crypto_ton_payment_TonCryptoOrder = M_lib_crypto_ton_payment.TonCryptoOrder;
export import M_lib_crypto_ton_payment_STORE_TON_WALLET = M_lib_crypto_ton_payment.STORE_TON_WALLET;
export import M_lib_design_copy_designCopy = M_lib_design_copy.designCopy;
export import M_lib_internal_auth_internalAuthorized = M_lib_internal_auth.internalAuthorized;
export import M_lib_nft_nftAddress = M_lib_nft.nftAddress;
export import M_lib_nft_nativePrice = M_lib_nft.nativePrice;
export import M_lib_nft_nftServiceFee = M_lib_nft.nftServiceFee;
export import M_lib_nft_validateNftTransaction = M_lib_nft.validateNftTransaction;
export import M_lib_nft_tonProofDigest = M_lib_nft.tonProofDigest;
export import M_lib_nft_verifyNftProof = M_lib_nft.verifyNftProof;
export import M_lib_nft_nftChallenge = M_lib_nft.nftChallenge;
export import M_lib_nft_authenticateNftWallet = M_lib_nft.authenticateNftWallet;
export import M_lib_nft_prepareNft = M_lib_nft.prepareNft;
export import M_lib_nft_feeTransaction = M_lib_nft.feeTransaction;
export import M_lib_nft_nftStatus = M_lib_nft.nftStatus;
export import M_lib_nft_NFT_SHOP_ADDRESS = M_lib_nft.NFT_SHOP_ADDRESS;
export type M_lib_nft_NftTransaction = M_lib_nft.NftTransaction;
export import M_lib_security_launch_config_launchConfiguration = M_lib_security_launch_config.launchConfiguration;
export type M_lib_security_launch_config_LaunchCheck = M_lib_security_launch_config.LaunchCheck;
export import M_lib_operations_readiness_readiness = M_lib_operations_readiness.readiness;
export import M_lib_security_policy_privatePath = M_lib_security_policy.privatePath;
export import M_lib_security_policy_securityHeaders = M_lib_security_policy.securityHeaders;
export import M_lib_security_policy_contentPolicy = M_lib_security_policy.contentPolicy;
export import M_lib_smm_jobs_enqueuePaidSmm = M_lib_smm_jobs.enqueuePaidSmm;
export import M_lib_smm_jobs_runSmmTick = M_lib_smm_jobs.runSmmTick;
export import M_lib_store_products_storeCategories = M_lib_store_products.storeCategories;
export import M_lib_store_products_storeProducts = M_lib_store_products.storeProducts;
export import M_lib_store_products_storeProduct = M_lib_store_products.storeProduct;
export import M_lib_verification_store_verificationItems = M_lib_verification_store.verificationItems;
export import M_lib_verification_store_verificationItem = M_lib_verification_store.verificationItem;
export import M_lib_nft_nftDeliveryReceipt = M_lib_nft.nftDeliveryReceipt;
export import M_lib_nft_claimNftFee = M_lib_nft.claimNftFee;
export import M_lib_nft_nftFeeReceipt = M_lib_nft.nftFeeReceipt;
// app/api/admin/commerce/[action]/route.ts
namespace M_app_api_admin_commerce__action__route {
  export const dynamic = "force-dynamic";
  function error(e: unknown) {
    return e instanceof M_lib_commerce_core_ShopError ? M_lib_commerce_core_failure(e) : M_lib_admin_responses_adminFailure(e);
  }
  export async function GET(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      await M_lib_admin_auth_requireAdmin();
      const a = (await params).action;
      if (a === "readiness") return M_lib_commerce_core_json(await M_lib_operations_readiness_readiness());
      if (a === "storage") return M_lib_commerce_core_json(await databaseStorageReport());
      if (a === "overview") {
        const [grouped, orders, manual, review, customers] = await Promise.all([
          exactRevenueSummary(),
          M_lib_db_db.order.count(),
          M_lib_db_db.orderItem.count({
            where: {
              fulfillmentMode: "MANUAL",
              fulfillmentStatus: "PENDING",
              order: {
                paidAt: {not: null},
                status: {notIn: ["REFUNDED", "CANCELLED"]},
              },
            },
          }),
          M_lib_db_db.order.count({where: {status: "NEEDS_REVIEW"}}),
          M_lib_db_db.user.count({where: {role: "CUSTOMER"}}),
        ]);
        return M_lib_commerce_core_json({revenue: grouped, orders, manual, review, customers});
      }
      if (a === "orders") {
        const p = new URL(r.url).searchParams,
          page = M_lib_admin_commerce_validation_adminPage(p.get("page")),
          status = p.get("status");
        const q = (p.get("q") ?? "").trim().slice(0, 100);
        return M_lib_commerce_core_json(
          await M_lib_db_db.order
            .findMany({
              where: {
                ...(status &&
                M_lib_admin_commerce_validation_orderStates.includes(status as (typeof M_lib_admin_commerce_validation_orderStates)[number])
                  ? {status: status as (typeof M_lib_admin_commerce_validation_orderStates)[number]}
                  : {}),
                ...(q
                  ? {
                      OR: [
                        {id: {contains: q}},
                        {
                          user: {
                            email: {contains: q},
                          },
                        },
                        {
                          items: {
                            some: {
                              titleSnapshot: {
                                contains: q,
                              },
                            },
                          },
                        },
                        ...(/^\d{1,18}$/.test(q) ? [{user: {telegramId: BigInt(q)}}] : []),
                      ],
                    }
                  : {}),
              },
              orderBy: {createdAt: "desc"},
              skip: (page - 1) * 50,
              take: 50,
              select: {
                id: true,
                status: true,
                total: true,
                currency: true,
                createdAt: true,
                user: {select: {email: true, telegramId: true}},
                items: {
                  select: {
                    id: true,
                    titleSnapshot: true,
                    quantity: true,
                    fulfillmentMode: true,
                    fulfillmentStatus: true,
                    provider: true,
                    fulfillmentJob: {
                      select: {state: true, lastErrorCode: true},
                    },
                    smmJob: {
                      select: {
                        state: true,
                        remaining: true,
                        providerOrderId: true,
                        lastErrorCode: true,
                      },
                    },
                  },
                },
              },
            })
            .then((rows) =>
              rows.map((o) => ({
                ...o,
                user: {...o.user, telegramId: o.user.telegramId?.toString()},
              })),
            ),
        );
      }
      if (a === "audit")
        return M_lib_commerce_core_json(
          await M_lib_db_db.adminAuditLog.findMany({
            take: 50,
            orderBy: {createdAt: "desc"},
            select: {id: true, action: true, entityId: true, createdAt: true},
          }),
        );
      if (a === "smm") {
        const p = new URL(r.url).searchParams,
          state = p.get("state");
        return M_lib_commerce_core_json(
          await M_lib_db_db.smmJob.findMany({
            where:
              state &&
              M_lib_admin_commerce_validation_smmStates.includes(state as (typeof M_lib_admin_commerce_validation_smmStates)[number])
                ? {state: state as (typeof M_lib_admin_commerce_validation_smmStates)[number]}
                : {},
            skip: (M_lib_admin_commerce_validation_adminPage(p.get("page")) - 1) * 50,
            take: 50,
            orderBy: {createdAt: "desc"},
            select: {
              id: true,
              serviceKey: true,
              quantity: true,
              state: true,
              remaining: true,
              attempts: true,
              providerOrderId: true,
              lastErrorCode: true,
              updatedAt: true,
              orderItem: {select: {orderId: true, titleSnapshot: true}},
            },
          }),
        );
      }
      if (a === "products") {
        const q = new URL(r.url).searchParams.get("q")?.slice(0, 100);
        return M_lib_commerce_core_json(
          await M_lib_db_db.product.findMany({
            where: q
              ? {
                  OR: [
                    {slug: {contains: q}},
                    {
                      translations: {
                        some: {title: {contains: q}},
                      },
                    },
                  ],
                  provider: null,
                }
              : {provider: null},
            skip: (M_lib_admin_commerce_validation_adminPage(new URL(r.url).searchParams.get("page")) - 1) * 50,
            take: 50,
            orderBy: {createdAt: "desc"},
            select: {
              id: true,
              slug: true,
              price: true,
              currency: true,
              active: true,
              kind: true,
              fulfillmentMode: true,
              version: true,
              provider: true,
              category: {select: {slug: true}},
              translations: {select: {locale: true, title: true}},
              _count: {
                select: {inventory: {where: {status: "AVAILABLE"}}},
              },
            },
          }),
        );
      }
      if (a === "categories")
        return M_lib_commerce_core_json(
          await M_lib_db_db.category.findMany({
            select: {
              id: true,
              slug: true,
              active: true,
              translations: {select: {locale: true, title: true}},
            },
            orderBy: {position: "asc"},
          }),
        );
      if (a === "payments")
        return M_lib_commerce_core_json(
          await M_lib_db_db.paymentIntent.findMany({
            where: {state: {in: ["UNKNOWN", "REFUNDING"]}},
            select: {
              id: true,
              userId: true,
              orderId: true,
              provider: true,
              state: true,
              creditAmount: true,
              walletCurrency: true,
              providerReference: true,
              createdAt: true,
            },
            take: 50,
            orderBy: {createdAt: "desc"},
          }),
        );
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return error(e);
    }
  }
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      const admin = await M_lib_admin_auth_requireAdmin();
      M_lib_commerce_core_sameOrigin(r);
      const a = (await params).action,
        d = await M_lib_commerce_core_data(r, a === "logo" ? 750000 : 600000);
      if (a === "deliver")
        return M_lib_commerce_core_json(
          await M_lib_commerce_admin_manualDelivery(admin.id, String(d.itemId), String(d.payload ?? ""), d.reconciled === true),
        );
      if (a === "refund")
        return M_lib_commerce_core_json(await M_lib_commerce_admin_refundOrder(admin.id, String(d.orderId), d.reconciled === true));
      if (a === "reconcile-payment") {
        await M_lib_commerce_payments_reconcilePayment(String(d.id));
        return M_lib_commerce_core_json({ok: true});
      }
      if (a === "inventory") {
        const product = await M_lib_db_db.product.findUnique({
          where: {id: String(d.productId)},
        });
        if (!product || product.fulfillmentMode !== "INVENTORY") throw new M_lib_commerce_core_ShopError("invalid_product");
        if (
          !Array.isArray(d.entries) ||
          !d.entries.length ||
          d.entries.length > 100 ||
          d.entries.some((v) => typeof v !== "string" || !v.trim() || Buffer.byteLength(v) > 100000)
        )
          throw new M_lib_commerce_core_ShopError("invalid_inventory");
        await M_lib_commerce_core_atomic(async (tx) => {
          await tx.inventoryItem.createMany({
            data: (d.entries as string[]).map((payload) => ({
              productId: product.id,
              encryptedPayload: M_lib_commerce_encryption_encrypt(payload, `inventory:${product.id}`),
            })),
          });
          await tx.adminAuditLog.create({
            data: {
              actorId: admin.id,
              action: "inventory.import",
              entityId: product.id,
              after: {count: (d.entries as string[]).length},
            },
          });
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (a === "category") {
        const slug = String(d.slug ?? "");
        if (
          typeof d.active !== "boolean" ||
          !/^[a-z0-9-]{2,60}$/.test(slug) ||
          (d.title !== undefined && (typeof d.title !== "string" || !d.title.trim() || d.title.length > 100))
        )
          throw new M_lib_commerce_core_ShopError("invalid_category");
        await M_lib_commerce_core_atomic(async (tx) => {
          if (d.title === undefined && !(await tx.category.findUnique({where: {slug}})))
            throw new M_lib_commerce_core_ShopError("invalid_category");
          const c = await tx.category.upsert({
            where: {slug},
            create: {slug, active: d.active !== false},
            update: {active: d.active !== false},
          });
          if (d.title !== undefined)
            for (const locale of ["uk", "ru", "en"] as const)
              await tx.categoryTranslation.upsert({
                where: {categoryId_locale: {categoryId: c.id, locale}},
                create: {categoryId: c.id, locale, title: String(d.title)},
                update: {title: String(d.title)},
              });
          await tx.adminAuditLog.create({
            data: {
              actorId: admin.id,
              action: "category.save",
              entityId: c.id,
              after: {slug},
            },
          });
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (a === "product") {
        const value = M_lib_admin_commerce_validation_parseCommerceProduct(d);
        const {slug, price, currency, mode, titles} = value;
        const category = await M_lib_db_db.category.findUnique({
          where: {slug: value.category},
        });
        if (!category) throw new M_lib_commerce_core_ShopError("invalid_category");
        await M_lib_commerce_core_atomic(async (tx) => {
          const existing = d.id ? await tx.product.findUnique({where: {id: String(d.id)}}) : null;
          if (d.id && !existing) throw new M_lib_commerce_core_ShopError("not_found", 404);
          if (existing?.provider) throw new M_lib_commerce_core_ShopError("supplier_price_managed", 409);
          if (existing && (existing.version !== value.version || existing.fulfillmentMode !== mode))
            throw new M_lib_commerce_core_ShopError("version_or_mode_conflict", 409);
          const fields = {
            slug,
            categoryId: category.id,
            price,
            currency: currency as "USD",
            active: value.active,
            fulfillmentMode: mode as "MANUAL" | "INVENTORY",
            kind: mode === "INVENTORY" ? ("UNIQUE" as const) : ("SERVICE" as const),
          };
          const p = existing
            ? await tx.product.update({
                where: {id: existing.id},
                data: {...fields, version: {increment: 1}},
              })
            : await tx.product.create({data: fields});
          for (const locale of ["uk", "ru", "en"] as const)
            await tx.productTranslation.upsert({
              where: {productId_locale: {productId: p.id, locale}},
              create: {
                productId: p.id,
                locale,
                title: titles[locale],
                description: "",
              },
              update: {title: titles[locale]},
            });
          await tx.adminAuditLog.create({
            data: {
              actorId: admin.id,
              action: "product.save",
              entityId: p.id,
              after: {price, currency, active: fields.active},
            },
          });
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (a === "logo") {
        const name = String(d.name ?? ""),
          raw = String(d.pngBase64 ?? ""),
          bytes = Buffer.from(raw, "base64");
        if (
          !name.trim() ||
          name.length > 100 ||
          bytes.length > 500000 ||
          bytes.length < 24 ||
          bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
          bytes.readUInt32BE(16) < 1 ||
          bytes.readUInt32BE(20) < 1 ||
          bytes.readUInt32BE(16) > 4096 ||
          bytes.readUInt32BE(20) > 4096
        )
          throw new M_lib_commerce_core_ShopError("invalid_png");
        const id = `custom-${M_app_api_admin_commerce__action__route_i5()}`;
        await M_lib_commerce_core_atomic(async (tx) => {
          await tx.brandAsset.create({
            data: {
              id,
              name,
              imageUrl: `/api/assets/brands/${id}`,
              pngBytes: bytes,
              group: "exchange",
            },
          });
          await tx.adminAuditLog.create({
            data: {
              actorId: admin.id,
              action: "brand.create",
              entityId: id,
              after: {name},
            },
          });
        });
        return M_lib_commerce_core_json({id});
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return error(e);
    }
  }
}
// app/api/admin/login/route.ts
namespace M_app_api_admin_login_route {
  export const runtime = "nodejs";
  export async function POST(request: M_app_api_smm_quote_route_i0) {
    try {
      M_lib_commerce_core_sameOrigin(request);
      const raw = await M_lib_commerce_core_data(request, 20000);
      if (typeof raw?.initData !== "string") throw new M_lib_commerce_core_ShopError("forbidden", 403);
      const identity = M_lib_admin_telegram_verifyAdminInitData(raw.initData);
      await M_lib_commerce_core_rateLimit(`telegram-admin:${identity.telegramId}`, 10, 60);
      const user = await M_lib_db_db.user.upsert({
        where: {telegramId: identity.telegramId},
        create: {...identity, role: "ADMIN"},
        update: {displayName: identity.displayName, role: "ADMIN"},
      });
      const token = M_lib_admin_crypto_newSessionToken();
      await M_lib_db_db.$transaction(async (tx) => {
        await tx.adminSession.deleteMany({
          where: {OR: [{expiresAt: {lt: new Date()}}, {userId: user.id}]},
        });
        await tx.adminSession.create({
          data: {
            userId: user.id,
            tokenHash: M_lib_admin_crypto_sessionHash(token),
            expiresAt: new Date(Date.now() + 12 * 3600000),
          },
        });
      });
      const response = M_lib_admin_responses_adminJson({ok: true});
      response.cookies.set(M_lib_admin_auth_adminCookie, token, M_lib_admin_auth_cookieOptions());
      return response;
    } catch (error) {
      return M_lib_commerce_core_failure(error);
    }
  }
}
// app/api/admin/logos/route.ts
namespace M_app_api_admin_logos_route {
  export async function GET() {
    try {
      await M_lib_admin_auth_requireAdmin();
      return M_lib_admin_responses_adminJson(
        await M_lib_db_db.brandAsset.findMany({
          orderBy: {name: "asc"},
          select: {
            id: true,
            name: true,
            imageUrl: true,
            color: true,
            group: true,
          },
        }),
      );
    } catch (e) {
      return M_lib_admin_responses_adminFailure(e);
    }
  }
}
// app/api/admin/logout/route.ts
namespace M_app_api_admin_logout_route {
  export async function POST(request: M_app_api_smm_quote_route_i0) {
    try {
      M_lib_admin_validation_checkOrigin(request.headers);
      const token = request.cookies.get(M_lib_admin_auth_adminCookie)?.value;
      if (M_lib_admin_crypto_validToken(token))
        await M_lib_db_db.adminSession.deleteMany({
          where: {tokenHash: M_lib_admin_crypto_sessionHash(token)},
        });
      const response = M_lib_admin_responses_adminJson({ok: true});
      response.cookies.set(M_lib_admin_auth_adminCookie, "", {...M_lib_admin_auth_cookieOptions(), maxAge: 0});
      return response;
    } catch (e) {
      return M_lib_admin_responses_adminFailure(e);
    }
  }
}
// app/api/admin/products/[id]/route.ts
namespace M_app_api_admin_products__id__route {
  export async function PATCH(
    request: Request,
    {
      params,
    }: {
      params: Promise<{
        id: string;
      }>;
    },
  ) {
    try {
      await M_lib_admin_auth_requireAdmin();
      M_lib_admin_validation_checkOrigin(request.headers);
      const {id} = await params;
      if (!/^vr_[a-z0-9_-]{1,80}$/.test(id)) throw new M_lib_admin_validation_AdminError("not_found", 404);
      return M_lib_admin_responses_adminJson(await M_lib_admin_products_saveProduct(await M_lib_admin_validation_readJson(request), id));
    } catch (e) {
      return M_lib_admin_responses_adminFailure(e);
    }
  }
}
// app/api/admin/products/route.ts
namespace M_app_api_admin_products_route {
  export async function GET() {
    try {
      await M_lib_admin_auth_requireAdmin();
      return M_lib_admin_responses_adminJson(await M_lib_admin_products_adminProducts());
    } catch (e) {
      return M_lib_admin_responses_adminFailure(e);
    }
  }
  export async function POST(request: Request) {
    try {
      await M_lib_admin_auth_requireAdmin();
      M_lib_admin_validation_checkOrigin(request.headers);
      return M_lib_admin_responses_adminJson(await M_lib_admin_products_saveProduct(await M_lib_admin_validation_readJson(request)));
    } catch (e) {
      return M_lib_admin_responses_adminFailure(e);
    }
  }
}
// app/api/assets/brands/[id]/route.ts
namespace M_app_api_assets_brands__id__route {
  export async function GET(
    _r: Request,
    {
      params,
    }: {
      params: Promise<{
        id: string;
      }>;
    },
  ) {
    const {id} = await params;
    if (!/^custom-[a-f0-9-]{36}$/.test(id)) return new Response(null, {status: 404});
    const asset = await M_lib_db_db.brandAsset.findUnique({
      where: {id},
      select: {pngBytes: true},
    });
    if (!asset?.pngBytes) return new Response(null, {status: 404});
    return new Response(new Uint8Array(asset.pngBytes), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}
// app/api/auth/[action]/route.ts
namespace M_app_api_auth__action__route {
  export const dynamic = "force-dynamic";
  export async function GET(
    _r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      if ((await params).action !== "me") throw new M_lib_commerce_core_ShopError("not_found", 404);
      const u = await M_lib_auth_session_currentUser();
      if (!u) return M_lib_commerce_core_json({user: null});
      const wallets = await M_lib_db_db.wallet.findMany({
        where: {userId: u.id},
        select: {currency: true, balance: true},
      });
      return M_lib_commerce_core_json({
        user: {
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          telegramId: u.telegramId?.toString(),
          channel: u.channel,
          locale: u.locale,
          onboardingStartedAt: u.onboardingStartedAt,
          onboardingCompletedAt: u.onboardingCompletedAt,
          avatarUpdatedAt: u.avatarUpdatedAt,
          hasAvatar: Boolean(u.avatarUpdatedAt),
          isAdmin: M_lib_admin_telegram_isTelegramAdmin(u.telegramId),
        },
        wallets,
        botWallets: await M_lib_bot_bridge_botWallets(u.telegramId),
        methods: {
          crypto: Boolean(process.env.CRYPTO_PAY_TOKEN),
          mono: Boolean(process.env.MONO_TOKEN),
          stripe: Boolean(process.env.STRIPE_SECRET_KEY),
          stars: Boolean(process.env.BOT_TOKEN && process.env.STARS_USDT_PER_STAR),
        },
      });
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      M_lib_commerce_core_sameOrigin(r);
      const action = (await params).action;
      if (action === "logout") {
        await M_lib_auth_session_closeSession();
        return M_lib_commerce_core_json({ok: true});
      }
      const d = await M_lib_commerce_core_data(r, 20000);
      await M_lib_commerce_core_rateLimit("public-auth-global", 1200, 60);
      if (action === "telegram" || action === "widget") {
        const identity =
          action === "telegram" ? M_lib_auth_telegram_verifyInitData(String(d.initData ?? "")) : M_lib_auth_telegram_verifyWidget(d);
        await M_lib_commerce_core_rateLimit(`customer-telegram:${identity.telegramId}`, 10, 60);
        const u = await M_lib_db_db.user.upsert({
          where: {telegramId: identity.telegramId},
          create: {...identity},
          update: {displayName: identity.displayName},
        });
        await M_lib_auth_session_openSession(u.id, action === "telegram" ? "TMA" : "WEB");
        return M_lib_commerce_core_json({ok: true});
      }
      if (action !== "register" && action !== "login") throw new M_lib_commerce_core_ShopError("not_found", 404);
      const email = String(d.email ?? "")
          .trim()
          .toLowerCase(),
        password = String(d.password ?? "");
      if (!/^[^\s@]{1,100}@[^\s@]{1,100}\.[^\s@]{2,30}$/.test(email) || password.length < 16 || password.length > 128)
        throw new M_lib_commerce_core_ShopError("invalid_credentials", 401);
      await M_lib_commerce_core_rateLimit("customer:" + M_lib_nft_i0("sha256").update(email).digest("hex"), 8, 900);
      let u = await M_lib_db_db.user.findUnique({where: {email}});
      if (action === "register") {
        if (u) throw new M_lib_commerce_core_ShopError("account_exists", 409);
        u = await M_lib_db_db.user.create({
          data: {
            email,
            passwordHash: await M_lib_admin_crypto_hashPassword(password),
            displayName: String(d.name ?? email.split("@")[0]).slice(0, 100),
          },
        });
      } else if (!(await M_lib_admin_crypto_verifyPassword(password, u?.passwordHash ?? null)) || !u)
        throw new M_lib_commerce_core_ShopError("invalid_credentials", 401);
      await M_lib_auth_session_openSession(u!.id, "WEB");
      return M_lib_commerce_core_json({ok: true});
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/bot/webhook/route.ts
namespace M_app_api_bot_webhook_route {
  export const dynamic = "force-dynamic";
  export const maxDuration = 120;
  export async function POST(request: Request) {
    try {
      if (!M_lib_commerce_bot_authorizedBotWebhook(request.headers)) throw new M_lib_commerce_core_ShopError("forbidden", 403);
      await M_lib_commerce_bot_handleBotUpdate(
        (await M_lib_commerce_core_data(request, 262144)) as unknown as M_lib_commerce_bot_BotUpdate,
      );
      return M_lib_commerce_core_json({ok: true});
    } catch (error) {
      return M_lib_commerce_core_failure(error);
    }
  }
}
// app/api/catalog/telegram/route.ts
namespace M_app_api_catalog_telegram_route {
  export const dynamic = "force-dynamic";
  export async function GET(request: M_app_api_smm_quote_route_i0) {
    const country = request.nextUrl.searchParams.get("country") ?? "";
    if (!M_lib_commerce_bot_i7(country)) return M_lib_commerce_core_i0.json({error: "invalid_country"}, {status: 400});
    const filters = M_lib_telegram_market_parseFilters(Object.fromEntries(request.nextUrl.searchParams));
    try {
      return M_lib_commerce_core_i0.json(await M_lib_telegram_market_listTelegram(country, filters), {
        headers: {"Cache-Control": "private, no-store"},
      });
    } catch (e) {
      const code = e instanceof M_lib_lzt_http_MarketError ? e.code : "upstream";
      return M_lib_commerce_core_i0.json(
        {error: code},
        {
          status: code === "rate_limit" ? 429 : 503,
          headers: {"Cache-Control": "no-store"},
        },
      );
    }
  }
}
// app/api/crypto/order/route.ts
namespace M_app_api_crypto_order_route {
  // Legacy demo orders were client-priced, memory-only and had no NFT delivery.
  // Keep this endpoint closed until durable server quotes and transfer exist.
  export async function POST() {
    return M_lib_commerce_core_i0.json({ok: false, error: "nft_checkout_unavailable"}, {status: 503});
  }
}
// app/api/crypto/verify-payment/route.ts
namespace M_app_api_crypto_verify_payment_route {
  export async function GET() {
    return M_lib_commerce_core_i0.json({ok: false, paid: false, error: "nft_checkout_unavailable"}, {status: 503});
  }
  export async function POST() {
    return M_lib_commerce_core_i0.json({ok: false, paid: false, error: "manual_confirmation_disabled"}, {status: 403});
  }
}
// app/api/gifts/[address]/history/route.ts
namespace M_app_api_gifts__address__history_route {
  export async function GET(
    _request: Request,
    {
      params,
    }: {
      params: Promise<{
        address: string;
      }>;
    },
  ) {
    let address: string;
    try {
      address = M_lib_nft_i4.parse((await params).address).toRawString();
    } catch {
      return M_lib_commerce_core_i0.json({error: "invalid_address"}, {status: 400});
    }
    try {
      const r = await fetch(`https://tonapi.io/v2/nfts/${encodeURIComponent(address)}/history?limit=10`, {
        next: {revalidate: 60},
        signal: AbortSignal.timeout(4000),
        headers: process.env.TONAPI_KEY ? {Authorization: `Bearer ${process.env.TONAPI_KEY}`} : {},
      });
      if (!r.ok) throw Error("unavailable");
      const data = await r.json();
      if (!Array.isArray(data.events)) throw Error("invalid_history");
      return M_lib_commerce_core_i0.json({
        events: data.events.slice(0, 10).map((event: {event_id: string; timestamp: number}) => ({
          id: event.event_id,
          timestamp: event.timestamp,
        })),
      });
    } catch {
      return M_lib_commerce_core_i0.json({error: "history_unavailable"}, {status: 503});
    }
  }
}
// app/api/gifts/[address]/route.ts
namespace M_app_api_gifts__address__route {
  export const dynamic = "force-dynamic";
  export async function GET(
    _request: Request,
    {
      params,
    }: {
      params: Promise<{
        address: string;
      }>;
    },
  ) {
    try {
      const {address} = await params;
      const gift = await M_lib_gifts_marketapp_fetchGiftByAddress(address);
      if (!gift) {
        return M_lib_commerce_core_i0.json({ok: false, error: "gift_not_found"}, {status: 404});
      }
      return M_lib_commerce_core_i0.json({
        ok: true,
        gift,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "internal_error";
      return M_lib_commerce_core_i0.json({ok: false, error: message}, {status: 500});
    }
  }
}
// app/api/gifts/route.ts
namespace M_app_api_gifts_route {
  export const dynamic = "force-dynamic";
  export async function GET(request: Request) {
    try {
      const {searchParams} = new URL(request.url);
      const search = searchParams.get("q") || undefined;
      const model = searchParams.get("model") || undefined;
      const backdrop = searchParams.get("backdrop") || undefined;
      const sortBy = (searchParams.get("sort") as M_lib_gifts_marketapp_GiftsFilter["sortBy"]) || "popular";
      const requestedLimit = Number(searchParams.get("limit") ?? 30);
      const limit = Number.isFinite(requestedLimit) ? Math.min(60, Math.max(1, Math.floor(requestedLimit))) : 30;
      const result = await M_lib_gifts_marketapp_fetchGiftsOnSale({
        search,
        model,
        backdrop,
        sortBy,
        limit,
      });
      return M_lib_commerce_core_i0.json({
        ok: true,
        ...result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "internal_error";
      return M_lib_commerce_core_i0.json({ok: false, error: message}, {status: 500});
    }
  }
}
// app/api/health/route.ts
namespace M_app_api_health_route {
  export const dynamic = "force-dynamic";
  export async function GET() {
    try {
      await M_lib_db_db.$queryRaw`SELECT 1`;
      return Response.json({ok: true}, {headers: {"Cache-Control": "no-store"}});
    } catch {
      return Response.json({ok: false}, {status: 503, headers: {"Cache-Control": "no-store"}});
    }
  }
}
// app/api/internal/commerce/[action]/route.ts
namespace M_app_api_internal_commerce__action__route {
  export const dynamic = "force-dynamic";
  export const maxDuration = 120;
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      const action = (await params).action;
      if (
        !M_lib_internal_auth_internalAuthorized(r.headers) &&
        !(action === "tick" && M_lib_internal_auth_internalAuthorized(r.headers, "CRON_SECRET"))
      )
        throw new M_lib_commerce_core_ShopError("unauthorized", 401);
      const d = await M_lib_commerce_core_data(r);
      if (action === "tick") {
        try {
          await M_lib_commerce_fulfillment_expireOrders();
          // Maintenance failure is visible but must not block paid fulfillment.
          await runTemporaryCleanup().catch(() => console.error(JSON.stringify({code: "retention_failed"})));
          const [smm, market] = await Promise.all([M_lib_smm_jobs_runSmmTick(), M_lib_commerce_fulfillment_marketTick()]);
          const now = new Date();
          await M_lib_db_db.serviceHeartbeat.upsert({
            where: {id: "commerce"},
            create: {id: "commerce", lastSeenAt: now, lastSuccessAt: now},
            update: {lastSeenAt: now, lastSuccessAt: now, lastErrorCode: null},
          });
          return M_lib_commerce_core_json({smm, market});
        } catch (e) {
          await M_lib_db_db.serviceHeartbeat
            .upsert({
              where: {id: "commerce"},
              create: {id: "commerce", lastErrorCode: "tick_failed"},
              update: {lastSeenAt: new Date(), lastErrorCode: "tick_failed"},
            })
            .catch(() => {});
          throw e;
        }
      }
      if (action === "precheck")
        return M_lib_commerce_core_json({
          ok: await M_lib_commerce_payments_starsPrecheck(
            String(d.paymentId),
            String(d.telegramId),
            Number(d.total),
            String(d.currency),
            String(d.queryId ?? ""),
          ),
        });
      if (action === "stars-paid") {
        const p = await M_lib_db_db.paymentIntent.findUnique({
          where: {id: String(d.paymentId)},
          include: {user: true},
        });
        if (
          !p ||
          p.user.telegramId?.toString() !== String(d.telegramId) ||
          p.provider !== "TELEGRAM_STARS" ||
          String(d.currency) !== "XTR" ||
          typeof d.chargeId !== "string" ||
          !d.chargeId.length ||
          d.chargeId.length > 200
        )
          throw new M_lib_commerce_core_ShopError("payment_mismatch", 409);
        await M_lib_commerce_payments_confirmPayment(p.id, "TELEGRAM_STARS", p.id, String(d.total), "XTR", d.chargeId);
        return M_lib_commerce_core_json({ok: true});
      }
      if (action === "orders") {
        const u = await M_lib_db_db.user.findUnique({
          where: {telegramId: BigInt(String(d.telegramId))},
        });
        if (!u) return M_lib_commerce_core_json([]);
        return M_lib_commerce_core_json(
          await M_lib_db_db.order.findMany({
            where: {userId: u.id},
            select: {id: true, status: true, total: true, currency: true},
            orderBy: {createdAt: "desc"},
            take: 10,
          }),
        );
      }
      if (action === "notifications") {
        const now = new Date(),
          n = await M_lib_db_db.notification.findFirst({
            where: {
              deliveredAt: null,
              attempts: {lt: 10},
              OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
            },
            orderBy: {createdAt: "asc"},
          });
        if (!n) return M_lib_commerce_core_json(null);
        const claim = await M_lib_db_db.notification.updateMany({
          where: {
            id: n.id,
            deliveredAt: null,
            OR: [{leaseUntil: null}, {leaseUntil: {lt: now}}],
          },
          data: {
            leaseUntil: new Date(Date.now() + 120000),
            attempts: {increment: 1},
          },
        });
        if (!claim.count) return M_lib_commerce_core_json(null);
        const items =
          n.kind === "DELIVERY" && n.orderId
            ? await M_lib_db_db.orderItem.findMany({
                where: {
                  id: n.deduplicationKey.replace(/^delivery:/, ""),
                  orderId: n.orderId,
                  fulfillmentStatus: "DELIVERED",
                  encryptedDelivery: {not: null},
                  order: {user: {telegramId: n.telegramId}},
                },
              })
            : [];
        return M_lib_commerce_core_json({
          id: n.id,
          telegramId: n.telegramId.toString(),
          text: n.text,
          orderId: n.orderId,
          files: items.map((i) => ({
            name: `legit-assets-${i.id}.txt`,
            content: M_lib_commerce_encryption_decrypt(i.encryptedDelivery!, `delivery:${i.id}`),
          })),
        });
      }
      if (action === "notify-ack") {
        await M_lib_db_db.notification.updateMany({
          where: {id: String(d.id), deliveredAt: null},
          data:
            d.ok === true
              ? {deliveredAt: new Date(), leaseUntil: null}
              : {
                  leaseUntil: new Date(Date.now() + 300000),
                  lastErrorCode: "telegram_send_failed",
                },
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (action === "reconcile") {
        await M_lib_commerce_payments_reconcilePayment(String(d.paymentId));
        return M_lib_commerce_core_json({ok: true});
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/internal/smm/enqueue/route.ts
namespace M_app_api_internal_smm_enqueue_route {
  export const runtime = "nodejs";
  export const maxDuration = 60;
  export async function POST(request: M_app_api_smm_quote_route_i0) {
    if (!M_lib_internal_auth_internalAuthorized(request.headers))
      return M_lib_commerce_core_i0.json({error: "unauthorized"}, {status: 401});
    try {
      const raw = await request.text();
      if (raw.length > 4096) return M_lib_commerce_core_i0.json({error: "invalid_request"}, {status: 400});
      const data = JSON.parse(raw);
      if (
        typeof data.orderItemId !== "string" ||
        data.orderItemId.length > 80 ||
        typeof data.link !== "string" ||
        typeof data.telegramId !== "string" ||
        !/^\d{1,20}$/.test(data.telegramId)
      )
        return M_lib_commerce_core_i0.json({error: "invalid_request"}, {status: 400});
      const job = await M_lib_smm_jobs_enqueuePaidSmm(data.orderItemId, data.link, data.telegramId);
      return M_lib_commerce_core_i0.json({id: job.id, state: job.state}, {headers: {"Cache-Control": "no-store"}});
    } catch (e) {
      const code = e instanceof M_lib_smm_jobs_i4 ? e.code : "unavailable";
      return M_lib_commerce_core_i0.json(
        {error: code},
        {
          status: code === "not_found" ? 404 : code === "unavailable" ? 503 : 409,
        },
      );
    }
  }
}
// app/api/internal/smm/jobs/[id]/route.ts
namespace M_app_api_internal_smm_jobs__id__route {
  export const dynamic = "force-dynamic";
  export async function GET(
    request: M_app_api_smm_quote_route_i0,
    {
      params,
    }: {
      params: Promise<{
        id: string;
      }>;
    },
  ) {
    if (!M_lib_internal_auth_internalAuthorized(request.headers))
      return M_lib_commerce_core_i0.json({error: "unauthorized"}, {status: 401});
    const {id} = await params;
    const owner = request.nextUrl.searchParams.get("telegramId");
    if (!owner || !/^\d{1,20}$/.test(owner) || id.length > 80)
      return M_lib_commerce_core_i0.json({error: "invalid_request"}, {status: 400});
    try {
      const job = await M_lib_db_db.smmJob.findUnique({
        where: {id},
        include: {
          orderItem: {include: {order: {include: {user: true}}}},
        },
      });
      if (!job || String(job.orderItem.order.user.telegramId) !== owner)
        return M_lib_commerce_core_i0.json({error: "not_found"}, {status: 404});
      return M_lib_commerce_core_i0.json(
        {
          id: job.id,
          state: job.state,
          quantity: job.quantity,
          remaining: job.remaining,
          updatedAt: job.updatedAt,
        },
        {headers: {"Cache-Control": "no-store"}},
      );
    } catch {
      return M_lib_commerce_core_i0.json({error: "unavailable"}, {status: 503});
    }
  }
}
// app/api/internal/smm/tick/route.ts
namespace M_app_api_internal_smm_tick_route {
  export const runtime = "nodejs";
  export const maxDuration = 60;
  export const dynamic = "force-dynamic";
  async function run(request: M_app_api_smm_quote_route_i0) {
    if (!M_lib_internal_auth_internalAuthorized(request.headers) && !M_lib_internal_auth_internalAuthorized(request.headers, "CRON_SECRET"))
      return M_lib_commerce_core_i0.json({error: "unauthorized"}, {status: 401});
    try {
      return M_lib_commerce_core_i0.json(await M_lib_smm_jobs_runSmmTick(), {
        headers: {"Cache-Control": "no-store"},
      });
    } catch {
      return M_lib_commerce_core_i0.json({error: "worker_unavailable"}, {status: 503});
    }
  }
  export const POST = run;
}
// app/api/nft/[action]/route.ts
namespace M_app_api_nft__action__route {
  export async function GET(
    request: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      const u = await M_lib_auth_session_requireUser(),
        {action} = await params;
      if (action === "history")
        return M_lib_commerce_core_json(
          await M_lib_db_db.nftPurchase.findMany({
            where: {userId: u.id},
            select: {
              id: true,
              name: true,
              nftAddress: true,
              walletAddress: true,
              baseNano: true,
              feeNano: true,
              state: true,
              createdAt: true,
            },
            orderBy: {createdAt: "desc"},
            take: 100,
          }),
        );
      if (action === "status") {
        await M_lib_commerce_core_rateLimit("nft-status:" + u.id, 30, 60);
        return M_lib_commerce_core_json(await M_lib_nft_nftStatus(u.id, new URL(request.url).searchParams.get("id")));
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
  export async function POST(
    request: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      M_lib_commerce_core_sameOrigin(request);
      const u = await M_lib_auth_session_requireUser();
      await M_lib_profile_requireOnboarded(u.id);
      await M_lib_commerce_core_rateLimit("nft-write:" + u.id, 12, 60);
      const {action} = await params,
        d = await M_lib_commerce_core_data(request, 16000);
      if (action === "challenge") return M_lib_commerce_core_json(await M_lib_nft_nftChallenge(u.id));
      if (action === "wallet") return M_lib_commerce_core_json(await M_lib_nft_authenticateNftWallet(u.id, d));
      if (action === "fee") return M_lib_commerce_core_json(await M_lib_nft_claimNftFee(u.id, d.id));
      if (action === "prepare") return M_lib_commerce_core_json(await M_lib_nft_prepareNft(u.id, d));
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/payments/webhook/[provider]/route.ts
namespace M_app_api_payments_webhook__provider__route {
  export const maxDuration = 120;
  export const dynamic = "force-dynamic";
  let pub:
    | {
        key: string;
        expires: number;
      }
    | undefined;
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        provider: string;
      }>;
    },
  ) {
    try {
      const provider = (await params).provider,
        raw = await M_lib_commerce_core_body(r, 262144);
      let d: Record<string, any>;
      if (provider === "crypto") {
        if (!M_lib_commerce_signatures_cryptoSignature(raw, r.headers.get("crypto-pay-api-signature"), process.env.CRYPTO_PAY_TOKEN ?? ""))
          throw new M_lib_commerce_core_ShopError("invalid_signature", 401);
        d = JSON.parse(raw);
        if (d.update_type !== "invoice_paid") return M_lib_commerce_core_json({ok: true});
        const invoice = d.payload;
        const p = await M_lib_db_db.paymentIntent.findUnique({
          where: {id: String(invoice?.payload ?? "")},
        });
        if (!p) return M_lib_commerce_core_json({ok: true});
        // Read back from the provider: signatures alone never define the credit amount.
        if (!p.providerReference && p.provider === "CRYPTO_PAY")
          await M_lib_db_db.paymentIntent.updateMany({
            where: {id: p.id, providerReference: null},
            data: {providerReference: String(invoice.invoice_id)},
          });
        await M_lib_commerce_payments_reconcilePayment(p.id);
      } else if (provider === "stripe") {
        if (!M_lib_commerce_signatures_stripeSignature(raw, r.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET ?? ""))
          throw new M_lib_commerce_core_ShopError("invalid_signature", 401);
        d = JSON.parse(raw);
        if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(d.type))
          return M_lib_commerce_core_json({ok: true});
        const session = d.data?.object;
        const p = await M_lib_db_db.paymentIntent.findUnique({
          where: {id: String(session?.client_reference_id ?? "")},
        });
        if (!p) return M_lib_commerce_core_json({ok: true});
        if (!p.providerReference && p.provider === "STRIPE")
          await M_lib_db_db.paymentIntent.updateMany({
            where: {id: p.id, providerReference: null},
            data: {providerReference: String(session.id)},
          });
        await M_lib_commerce_payments_reconcilePayment(p.id);
      } else if (provider === "mono") {
        if (!pub || pub.expires < Date.now()) {
          const d = await M_lib_commerce_payments_monoCall("pubkey");
          pub = {key: d.key, expires: Date.now() + 3600000};
        }
        if (!M_lib_commerce_signatures_monoSignature(raw, r.headers.get("x-sign"), pub.key))
          throw new M_lib_commerce_core_ShopError("invalid_signature", 401);
        d = JSON.parse(raw);
        const p = await M_lib_db_db.paymentIntent.findUnique({
          where: {id: String(d.reference ?? "")},
        });
        if (!p) return M_lib_commerce_core_json({ok: true});
        if (!p.providerReference && p.provider === "MONO")
          await M_lib_db_db.paymentIntent.updateMany({
            where: {id: p.id, providerReference: null},
            data: {providerReference: String(d.invoiceId)},
          });
        await M_lib_commerce_payments_reconcilePayment(p.id);
      } else throw new M_lib_commerce_core_ShopError("not_found", 404);
      return M_lib_commerce_core_json({ok: true});
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/profile/[action]/route.ts
namespace M_app_api_profile__action__route {
  export const dynamic = "force-dynamic";
  export async function GET(
    _r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      const u = await M_lib_auth_session_requireUser();
      if ((await params).action !== "avatar") throw new M_lib_commerce_core_ShopError("not_found", 404);
      const profile = await M_lib_db_db.user.findUnique({where: {id: u.id}, select: {avatarBytes: true}});
      if (!profile?.avatarBytes) throw new M_lib_commerce_core_ShopError("not_found", 404);
      return new Response(new Uint8Array(profile.avatarBytes), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      M_lib_commerce_core_sameOrigin(r);
      const u = await M_lib_auth_session_requireUser();
      const action = (await params).action;
      await M_lib_commerce_core_rateLimit(`profile:${u.id}`, 20, 60);
      if (action === "avatar") {
        const raw = await M_lib_profile_readAvatarBytes(r);
        const bytes = await M_lib_profile_sanitizeAvatar(raw);
        await M_lib_db_db.user.update({
          where: {id: u.id},
          data: {
            avatarBytes: new Uint8Array(bytes),
            avatarUpdatedAt: new Date(),
          },
        });
        return M_lib_commerce_core_json({ok: true});
      }
      const d = await M_lib_commerce_core_data(r, 2048);
      if (action === "language") {
        const locale = M_lib_profile_onboardingLocale(d.locale);
        await M_lib_db_db.user.update({
          where: {id: u.id},
          data: {
            locale,
            ...(!u.onboardingStartedAt ? {onboardingStartedAt: new Date()} : {}),
          },
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (action === "onboarding") {
        M_lib_profile_validateOnboarding(d);
        if (!u.onboardingStartedAt) throw new M_lib_commerce_core_ShopError("language_required", 409);
        await M_lib_db_db.user.updateMany({
          where: {id: u.id, onboardingCompletedAt: null},
          data: {onboardingCompletedAt: new Date()},
        });
        return M_lib_commerce_core_json({ok: true});
      }
      if (action === "remove-avatar") {
        await M_lib_db_db.user.update({
          where: {id: u.id},
          data: {avatarBytes: null, avatarUpdatedAt: null},
        });
        return M_lib_commerce_core_json({ok: true});
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/shop/[action]/route.ts
namespace M_app_api_shop__action__route {
  export const maxDuration = 120;
  export const dynamic = "force-dynamic";
  export async function GET(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      const u = await M_lib_auth_session_requireUser(),
        action = (await params).action;
      if (action === "orders")
        return M_lib_commerce_core_json(
          await M_lib_db_db.order.findMany({
            where: {userId: u.id},
            select: {
              id: true,
              status: true,
              total: true,
              currency: true,
              createdAt: true,
              items: {
                select: {
                  id: true,
                  titleSnapshot: true,
                  quantity: true,
                  fulfillmentStatus: true,
                  fulfillmentMode: true,
                  lineTotal: true,
                  smmJob: {select: {state: true, remaining: true}},
                },
              },
            },
            orderBy: {createdAt: "desc"},
            take: 100,
          }),
        );
      if (action === "transactions")
        return M_lib_commerce_core_json(
          await M_lib_db_db.transaction.findMany({
            where: {userId: u.id},
            select: {
              id: true,
              kind: true,
              status: true,
              amount: true,
              postedAt: true,
              createdAt: true,
              wallet: {select: {currency: true}},
            },
            orderBy: {createdAt: "desc"},
            take: 100,
          }),
        );
      if (action === "payments")
        return M_lib_commerce_core_json(
          await M_lib_db_db.paymentIntent.findMany({
            where: {userId: u.id},
            select: {
              id: true,
              state: true,
              provider: true,
              creditAmount: true,
              walletCurrency: true,
              paymentUrl: true,
              orderId: true,
              expectedAmount: true,
              expectedCurrency: true,
              createdAt: true,
            },
            orderBy: {createdAt: "desc"},
            take: 30,
          }),
        );
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      M_lib_commerce_core_sameOrigin(r);
      const u = await M_lib_auth_session_requireUser(),
        d = await M_lib_commerce_core_data(r),
        action = (await params).action;
      await M_lib_commerce_core_rateLimit(`shop:${u.id}`, 60, 60);
      const locale = M_lib_profile_i1(d.locale as string) ? (d.locale as "uk" | "ru" | "en") : "uk";
      if (action === "quote") {
        const lines = await M_lib_commerce_checkout_priceCart(M_lib_commerce_checkout_parseCart(d.items), locale);
        return M_lib_commerce_core_json({
          lines: lines.map((l) => ({
            kind: l.kind,
            id: l.id,
            quantity: l.quantity,
            title: l.title,
            prices: l.prices,
            link: l.link,
          })),
          total: {
            UAH: lines.reduce((s, l) => s + l.prices.UAH, 0),
            USDT: lines.reduce((s, l) => s + l.prices.USDT, 0),
          },
        });
      }
      if (action === "checkout") {
        const mode = d.mode === "stars" ? "stars" : "wallet",
          currency = d.currency === "UAH" ? "UAH" : "USDT";
        if (mode === "stars" && currency !== "USDT") throw new M_lib_commerce_core_ShopError("invalid_currency");
        if (!Number.isSafeInteger(d.expectedTotal) || Number(d.expectedTotal) < 1) throw new M_lib_commerce_core_ShopError("invalid_quote");
        if (mode === "stars" && (!process.env.BOT_TOKEN || !process.env.STARS_USDT_PER_STAR))
          throw new M_lib_commerce_core_ShopError("stars_not_configured", 503);
        if (d.acceptTerms !== true) throw new M_lib_commerce_core_ShopError("terms_required");
        const order = await M_lib_commerce_checkout_createOrder(
          u,
          M_lib_commerce_checkout_parseCart(d.items),
          locale,
          currency,
          M_lib_commerce_core_idempotency(d.key),
          mode,
          Number(d.expectedTotal),
        );
        const invoice = mode === "stars" ? await M_lib_commerce_payments_createStarsInvoice(order.id, u.id, locale) : null;
        return M_lib_commerce_core_json({
          order: {
            id: order.id,
            status: order.status,
            total: order.total,
            currency: order.currency,
          },
          invoice: invoice
            ? {
                id: invoice.id,
                url: invoice.paymentUrl,
                state: invoice.state,
                stars: invoice.expectedAmount,
              }
            : null,
        });
      }
      if (action === "deposit") throw new M_lib_commerce_core_ShopError("bot_topup_only", 403);
      if (action === "reconcile") {
        const p = await M_lib_db_db.paymentIntent.findFirst({
          where: {id: String(d.id), userId: u.id},
        });
        if (!p) throw new M_lib_commerce_core_ShopError("not_found", 404);
        await M_lib_commerce_core_rateLimit(`reconcile:${p.id}`, 6, 60);
        const next = await M_lib_commerce_payments_reconcilePayment(p.id);
        return M_lib_commerce_core_json({id: p.id, state: next?.state});
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/shop/delivery/[id]/route.ts
namespace M_app_api_shop_delivery__id__route {
  export async function GET(
    _r: Request,
    {
      params,
    }: {
      params: Promise<{
        id: string;
      }>;
    },
  ) {
    try {
      const u = await M_lib_auth_session_requireUser(),
        id = (await params).id;
      const i = await M_lib_db_db.orderItem.findFirst({
        where: {
          id,
          order: {
            userId: u.id,
            status: {in: ["COMPLETED", "FULFILLING", "NEEDS_REVIEW"]},
          },
          fulfillmentStatus: "DELIVERED",
        },
      });
      if (!i?.encryptedDelivery) throw new M_lib_commerce_core_ShopError("delivery_unavailable", 404);
      return new Response(M_lib_commerce_encryption_decrypt(i.encryptedDelivery, `delivery:${i.id}`), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="legit-assets-${i.id.replace(/[^a-zA-Z0-9_-]/g, "")}.txt"`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/shop/handoff/[action]/route.ts
namespace M_app_api_shop_handoff__action__route {
  export const dynamic = "force-dynamic";
  export const maxDuration = 120;
  export async function POST(
    r: Request,
    {
      params,
    }: {
      params: Promise<{
        action: string;
      }>;
    },
  ) {
    try {
      M_lib_commerce_core_sameOrigin(r);
      const d = await M_lib_commerce_core_data(r),
        locale = M_lib_profile_i1(d.locale as string) ? (d.locale as "uk" | "ru" | "en") : "uk";
      const action = (await params).action;
      if (action === "create") {
        const user = await M_lib_auth_session_requireUser();
        await M_lib_profile_requireOnboarded(user.id);
        if (user.channel !== "TMA") throw new M_lib_commerce_core_ShopError("telegram_required", 403);
        await M_lib_commerce_core_rateLimit(`handoff:${user.id}`, 20, 60);
        return M_lib_commerce_core_json(await M_lib_commerce_handoff_createBotHandoff(d.items, locale, user.id));
      }
      if (action === "claim") {
        const user = await M_lib_auth_session_requireUser();
        await M_lib_commerce_core_rateLimit(`handoff:${user.id}`, 10, 60);
        return M_lib_commerce_core_json({
          items: await M_lib_commerce_handoff_claimHandoff(String(d.token ?? ""), user, locale),
        });
      }
      throw new M_lib_commerce_core_ShopError("not_found", 404);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/shop/orders/[id]/route.ts
namespace M_app_api_shop_orders__id__route {
  export async function GET(
    _r: Request,
    {
      params,
    }: {
      params: Promise<{
        id: string;
      }>;
    },
  ) {
    try {
      const u = await M_lib_auth_session_requireUser(),
        id = (await params).id;
      const o = await M_lib_db_db.order.findFirst({
        where: {id, userId: u.id},
        select: {
          id: true,
          status: true,
          total: true,
          currency: true,
          createdAt: true,
          paidAt: true,
          items: {
            select: {
              id: true,
              titleSnapshot: true,
              quantity: true,
              lineTotal: true,
              fulfillmentStatus: true,
              fulfillmentMode: true,
              smmJob: {select: {state: true, remaining: true}},
            },
          },
        },
      });
      if (!o) throw new M_lib_commerce_core_ShopError("not_found", 404);
      return M_lib_commerce_core_json(o);
    } catch (e) {
      return M_lib_commerce_core_failure(e);
    }
  }
}
// app/api/smm/quote/route.ts
namespace M_app_api_smm_quote_route {
  export const dynamic = "force-dynamic";
  let started = Date.now(),
    calls = 0;
  export async function POST(request: M_app_api_smm_quote_route_i0) {
    try {
      M_lib_commerce_core_sameOrigin(request);
    } catch {
      return M_lib_commerce_core_i0.json({error: "forbidden"}, {status: 403});
    }
    if (Date.now() - started > 60000) {
      started = Date.now();
      calls = 0;
    }
    if (++calls > 120) return M_lib_commerce_core_i0.json({error: "rate_limit"}, {status: 429});
    try {
      const data = await M_lib_commerce_core_data(request, 4096);
      if (!data || typeof data.service !== "string" || typeof data.link !== "string") throw new M_lib_smm_jobs_i4("invalid_request");
      return M_lib_commerce_core_i0.json(await M_lib_smm_catalog_smmQuote(data.service, data.quantity, data.link), {
        headers: {"Cache-Control": "no-store"},
      });
    } catch (e) {
      const code = e instanceof M_lib_smm_jobs_i4 || e instanceof M_lib_commerce_core_ShopError ? e.code : "unavailable";
      return M_lib_commerce_core_i0.json(
        {error: code},
        {
          status: e instanceof M_lib_commerce_core_ShopError ? e.status : code.startsWith("invalid_") ? 400 : 503,
          headers: {"Cache-Control": "no-store"},
        },
      );
    }
  }
}
// app/api/smm/services/route.ts
namespace M_app_api_smm_services_route {
  export const dynamic = "force-dynamic";
  export async function GET(request: M_app_api_smm_quote_route_i0) {
    const p = request.nextUrl.searchParams;
    const data = await M_lib_smm_catalog_smmCatalogPage({
      q: p.get("q") ?? "",
      platform: p.get("platform") ?? "",
      category: p.get("category") ?? "",
      sort: p.get("sort") ?? "",
      supported: p.get("supported") === "1",
      refill: p.get("refill") === "1",
      page: Number(p.get("page") ?? 1),
    });
    return M_lib_commerce_core_i0.json(data, {
      status: data.error ? 503 : 200,
      headers: {"Cache-Control": "private, no-store"},
    });
  }
}
// app/api/static/[...path]/route.ts
namespace M_app_api_static_____path__route {
  let pack: Record<string, string> | undefined;
  const mime: Record<string, string> = {
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".md": "text/plain",
    ".txt": "text/plain",
  };
  export function GET(
    request: Request,
    {
      params,
    }: {
      params: Promise<{
        path: string[];
      }>;
    },
  ) {
    return params.then(({path}) => {
      const key = path.join("/");
      if (!pack)
        pack = JSON.parse(
          M_app_api_static_____path__route_i0(M_app_api_static_____path__route_i1(process.cwd(), "assets.pack.json"), "utf8"),
        ) as Record<string, string>;
      const value = Object.hasOwn(pack, key) ? pack[key] : undefined;
      if (!value) return new Response(null, {status: 404});
      const bytes = Buffer.from(value, "base64"),
        etag = '"' + M_lib_nft_i0("sha256").update(bytes).digest("hex") + '"';
      const headers = {
        "Content-Type": mime[M_app_api_static_____path__route_i2(key)] || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
        ETag: etag,
        "X-Content-Type-Options": "nosniff",
      };
      return request.headers.get("if-none-match") === etag ? new Response(null, {status: 304, headers}) : new Response(bytes, {headers});
    });
  }
}
// app/api/tonconnect-manifest/route.ts
namespace M_app_api_tonconnect_manifest_route {
  export function GET(request: Request) {
    const env = process.env;
    const origin = new URL(env.NEXT_PUBLIC_SITE_URL || request.url).origin;
    return M_lib_commerce_core_i0.json(
      {url: origin, name: "Legit Assets", iconUrl: `${origin}/wallet-icon.png`},
      {headers: {"Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300"}},
    );
  }
}
// app/api/wallet/balance/route.ts
namespace M_app_api_wallet_balance_route {
  export async function GET(request: Request) {
    let address: string;
    try {
      address = M_lib_nft_i4.parse(new URL(request.url).searchParams.get("address") ?? "").toRawString();
    } catch {
      return M_lib_commerce_core_i0.json({error: "invalid_address"}, {status: 400});
    }
    try {
      const r = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${encodeURIComponent(address)}`, {
        next: {revalidate: 30},
        signal: AbortSignal.timeout(4000),
        headers: process.env.TONCENTER_API_KEY ? {"X-API-Key": process.env.TONCENTER_API_KEY} : {},
      });
      const data = await r.json();
      if (!r.ok || !data.ok || !/^\d+$/.test(data.result)) throw Error("unavailable");
      return M_lib_commerce_core_i0.json({balance: M_lib_nft_i7(data.result)});
    } catch {
      return M_lib_commerce_core_i0.json({error: "balance_unavailable"}, {status: 503});
    }
  }
}
// app/api/webhooks/tonkeeper/route.ts
namespace M_app_api_webhooks_tonkeeper_route {
  // A caller-supplied comment cannot prove receipt of funds.
  export async function POST() {
    return M_lib_commerce_core_i0.json({ok: false, error: "unverified_webhook_disabled"}, {status: 503});
  }
  export async function GET() {
    return M_lib_commerce_core_i0.json({ok: true, enabled: false, storeWallet: "UQBhos7uoI_1Fs4HCUWUEqv3ZVwKb_EWuHeOO7LMH2t34Wwl"});
  }
}
export import M_app_api_admin_commerce__action__route_GET = M_app_api_admin_commerce__action__route.GET;
export import M_app_api_admin_commerce__action__route_POST = M_app_api_admin_commerce__action__route.POST;
export import M_app_api_admin_commerce__action__route_dynamic = M_app_api_admin_commerce__action__route.dynamic;
export import M_app_api_admin_login_route_POST = M_app_api_admin_login_route.POST;
export import M_app_api_admin_login_route_runtime = M_app_api_admin_login_route.runtime;
export import M_app_api_admin_logos_route_GET = M_app_api_admin_logos_route.GET;
export import M_app_api_admin_logout_route_POST = M_app_api_admin_logout_route.POST;
export import M_app_api_admin_products__id__route_PATCH = M_app_api_admin_products__id__route.PATCH;
export import M_app_api_admin_products_route_GET = M_app_api_admin_products_route.GET;
export import M_app_api_admin_products_route_POST = M_app_api_admin_products_route.POST;
export import M_app_api_assets_brands__id__route_GET = M_app_api_assets_brands__id__route.GET;
export import M_app_api_auth__action__route_GET = M_app_api_auth__action__route.GET;
export import M_app_api_auth__action__route_POST = M_app_api_auth__action__route.POST;
export import M_app_api_auth__action__route_dynamic = M_app_api_auth__action__route.dynamic;
export import M_app_api_bot_webhook_route_POST = M_app_api_bot_webhook_route.POST;
export import M_app_api_bot_webhook_route_dynamic = M_app_api_bot_webhook_route.dynamic;
export import M_app_api_bot_webhook_route_maxDuration = M_app_api_bot_webhook_route.maxDuration;
export import M_app_api_catalog_telegram_route_GET = M_app_api_catalog_telegram_route.GET;
export import M_app_api_catalog_telegram_route_dynamic = M_app_api_catalog_telegram_route.dynamic;
export import M_app_api_crypto_order_route_POST = M_app_api_crypto_order_route.POST;
export import M_app_api_crypto_verify_payment_route_GET = M_app_api_crypto_verify_payment_route.GET;
export import M_app_api_crypto_verify_payment_route_POST = M_app_api_crypto_verify_payment_route.POST;
export import M_app_api_gifts__address__history_route_GET = M_app_api_gifts__address__history_route.GET;
export import M_app_api_gifts__address__route_GET = M_app_api_gifts__address__route.GET;
export import M_app_api_gifts__address__route_dynamic = M_app_api_gifts__address__route.dynamic;
export import M_app_api_gifts_route_GET = M_app_api_gifts_route.GET;
export import M_app_api_gifts_route_dynamic = M_app_api_gifts_route.dynamic;
export import M_app_api_health_route_GET = M_app_api_health_route.GET;
export import M_app_api_health_route_dynamic = M_app_api_health_route.dynamic;
export import M_app_api_internal_commerce__action__route_POST = M_app_api_internal_commerce__action__route.POST;
export import M_app_api_internal_commerce__action__route_dynamic = M_app_api_internal_commerce__action__route.dynamic;
export import M_app_api_internal_commerce__action__route_maxDuration = M_app_api_internal_commerce__action__route.maxDuration;
export import M_app_api_internal_smm_enqueue_route_POST = M_app_api_internal_smm_enqueue_route.POST;
export import M_app_api_internal_smm_enqueue_route_runtime = M_app_api_internal_smm_enqueue_route.runtime;
export import M_app_api_internal_smm_enqueue_route_maxDuration = M_app_api_internal_smm_enqueue_route.maxDuration;
export import M_app_api_internal_smm_jobs__id__route_GET = M_app_api_internal_smm_jobs__id__route.GET;
export import M_app_api_internal_smm_jobs__id__route_dynamic = M_app_api_internal_smm_jobs__id__route.dynamic;
export import M_app_api_internal_smm_tick_route_runtime = M_app_api_internal_smm_tick_route.runtime;
export import M_app_api_internal_smm_tick_route_maxDuration = M_app_api_internal_smm_tick_route.maxDuration;
export import M_app_api_internal_smm_tick_route_dynamic = M_app_api_internal_smm_tick_route.dynamic;
export import M_app_api_internal_smm_tick_route_POST = M_app_api_internal_smm_tick_route.POST;
export import M_app_api_nft__action__route_GET = M_app_api_nft__action__route.GET;
export import M_app_api_nft__action__route_POST = M_app_api_nft__action__route.POST;
export import M_app_api_payments_webhook__provider__route_POST = M_app_api_payments_webhook__provider__route.POST;
export import M_app_api_payments_webhook__provider__route_maxDuration = M_app_api_payments_webhook__provider__route.maxDuration;
export import M_app_api_payments_webhook__provider__route_dynamic = M_app_api_payments_webhook__provider__route.dynamic;
export import M_app_api_profile__action__route_GET = M_app_api_profile__action__route.GET;
export import M_app_api_profile__action__route_POST = M_app_api_profile__action__route.POST;
export import M_app_api_profile__action__route_dynamic = M_app_api_profile__action__route.dynamic;
export import M_app_api_shop__action__route_GET = M_app_api_shop__action__route.GET;
export import M_app_api_shop__action__route_POST = M_app_api_shop__action__route.POST;
export import M_app_api_shop__action__route_maxDuration = M_app_api_shop__action__route.maxDuration;
export import M_app_api_shop__action__route_dynamic = M_app_api_shop__action__route.dynamic;
export import M_app_api_shop_delivery__id__route_GET = M_app_api_shop_delivery__id__route.GET;
export import M_app_api_shop_handoff__action__route_POST = M_app_api_shop_handoff__action__route.POST;
export import M_app_api_shop_handoff__action__route_dynamic = M_app_api_shop_handoff__action__route.dynamic;
export import M_app_api_shop_handoff__action__route_maxDuration = M_app_api_shop_handoff__action__route.maxDuration;
export import M_app_api_shop_orders__id__route_GET = M_app_api_shop_orders__id__route.GET;
export import M_app_api_smm_quote_route_POST = M_app_api_smm_quote_route.POST;
export import M_app_api_smm_quote_route_dynamic = M_app_api_smm_quote_route.dynamic;
export import M_app_api_smm_services_route_GET = M_app_api_smm_services_route.GET;
export import M_app_api_smm_services_route_dynamic = M_app_api_smm_services_route.dynamic;
export import M_app_api_static_____path__route_GET = M_app_api_static_____path__route.GET;
export import M_app_api_tonconnect_manifest_route_GET = M_app_api_tonconnect_manifest_route.GET;
export import M_app_api_wallet_balance_route_GET = M_app_api_wallet_balance_route.GET;
export import M_app_api_webhooks_tonkeeper_route_POST = M_app_api_webhooks_tonkeeper_route.POST;
export import M_app_api_webhooks_tonkeeper_route_GET = M_app_api_webhooks_tonkeeper_route.GET;

// Temporary data retention. Financial rows and their idempotency keys are NEVER purged here.
export async function runTemporaryCleanup(force = false, now = new Date()) {
  const cutoff = new Date(now.getTime() - 3 * 86400000);
  const interval = new Date(now.getTime() - 3600000);
  if (!force) {
    const recent = await M_lib_db_db.serviceHeartbeat.findUnique({where: {id: "retention"}, select: {lastSeenAt: true}});
    if (recent && recent.lastSeenAt > interval) return {skipped: true};
  }
  return M_lib_db_db.$transaction(async tx => {
    await tx.serviceHeartbeat.upsert({where: {id: "retention"}, create: {id: "retention", lastSeenAt: new Date(0)}, update: {}});
    const lease = await tx.$queryRaw<{lastSeenAt: Date}[]>`SELECT "lastSeenAt" FROM "ServiceHeartbeat" WHERE id = 'retention'`;
    if (!force && new Date(Number(lease[0].lastSeenAt)).getTime() > interval.getTime()) return {skipped: true};
    // Every table is processed in bounded batches. Old backlogs drain over subsequent ticks.
    const carts = await tx.$executeRaw`DELETE FROM "CartHandoff" WHERE "tokenHash" IN (SELECT "tokenHash" FROM "CartHandoff" WHERE "expiresAt" <= ${now.getTime()} ORDER BY "expiresAt" LIMIT 200)`;
    const sessions = await tx.$executeRaw`DELETE FROM "UserSession" WHERE id IN (SELECT id FROM "UserSession" WHERE "expiresAt" <= ${now.getTime()} ORDER BY "expiresAt" LIMIT 200)`;
    const admins = await tx.$executeRaw`DELETE FROM "AdminSession" WHERE id IN (SELECT id FROM "AdminSession" WHERE "expiresAt" <= ${now.getTime()} ORDER BY "expiresAt" LIMIT 200)`;
    const buckets = await tx.$executeRaw`DELETE FROM "AdminLoginBucket" WHERE id IN (SELECT id FROM "AdminLoginBucket" WHERE "expiresAt" <= ${now.getTime()} ORDER BY "expiresAt" LIMIT 200)`;
    const proofs = await tx.$executeRaw`DELETE FROM "NftWalletProof" WHERE "userId" IN (SELECT "userId" FROM "NftWalletProof" WHERE "expiresAt" <= ${now.getTime()} ORDER BY "expiresAt" LIMIT 200)`;
    // Keep delivery deduplication keys even when an already delivered message body is no longer needed.
    const messages = await tx.$executeRaw`UPDATE "Notification" SET text = '' WHERE id IN (SELECT id FROM "Notification" WHERE "deliveredAt" < ${cutoff.getTime()} AND text <> '' ORDER BY "deliveredAt" LIMIT 200)`;
    const profiles = await tx.user.findMany({where: {role: "CUSTOMER", lastActiveAt: {lt: cutoff}, OR: [{avatarBytes: {not: null}}, {displayName: {not: null}}]}, select: {id: true, telegramId: true}, orderBy: {lastActiveAt: "asc"}, take: 200});
    const profileIds = profiles.filter(u => !M_lib_admin_telegram_isTelegramAdmin(u.telegramId)).map(u => u.id);
    const cleared = await tx.user.updateMany({where: {id: {in: profileIds}, lastActiveAt: {lt: cutoff}}, data: {avatarBytes: null, avatarUpdatedAt: null, displayName: null}});
    // Only disposable Telegram profiles with no business records or live sessions can disappear.
    const disposable = await tx.$queryRaw<{id: string; telegramId: bigint | null}[]>`
      SELECT u.id, u."telegramId" FROM "User" u
      WHERE u.role = 'CUSTOMER' AND u."lastActiveAt" < ${cutoff.getTime()}
        AND u.email IS NULL AND u."passwordHash" IS NULL
        AND NOT EXISTS (SELECT 1 FROM "Order" x WHERE x."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "PaymentIntent" x WHERE x."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Transaction" x WHERE x."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "OrderItem" x WHERE x."assignedToId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "AdminAuditLog" x WHERE x."actorId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "NftPurchase" x WHERE x."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Wallet" x WHERE x."userId" = u.id AND (CAST(x.balance AS NUMERIC) <> 0 OR x.version <> 0))
        AND NOT EXISTS (SELECT 1 FROM "UserSession" x WHERE x."userId" = u.id AND x."expiresAt" > ${now.getTime()})
        AND NOT EXISTS (SELECT 1 FROM "AdminSession" x WHERE x."userId" = u.id AND x."expiresAt" > ${now.getTime()})
        AND NOT EXISTS (SELECT 1 FROM "CartHandoff" x WHERE x."claimedById" = u.id AND x."expiresAt" > ${now.getTime()})
        AND NOT EXISTS (SELECT 1 FROM "NftWalletProof" x WHERE x."userId" = u.id AND x."expiresAt" > ${now.getTime()})
        AND NOT EXISTS (SELECT 1 FROM "Notification" x WHERE x."telegramId" = u."telegramId" AND x."deliveredAt" IS NULL)
      ORDER BY u."lastActiveAt", u.id LIMIT 200`;
    const ids = disposable.filter(u => !M_lib_admin_telegram_isTelegramAdmin(u.telegramId)).map(u => u.id);
    await tx.wallet.deleteMany({where: {userId: {in: ids}, balance: "0", version: 0, transactions: {none: {}}}});
    const removed = await tx.user.deleteMany({where: {id: {in: ids}, lastActiveAt: {lt: cutoff}}});
    await tx.serviceHeartbeat.update({where: {id: "retention"}, data: {lastSeenAt: now, lastSuccessAt: now, lastErrorCode: null}});
    return {skipped: false, carts, sessions, admins, buckets, proofs, messages, profilesCleared: cleared.count, usersRemoved: removed.count, retentionDays: 3};
  }, {maxWait: 5000, timeout: 20000});
}

export async function databaseStorageReport() {
  const [pages, pageSize, free, users, avatars, lastCleanup] = await Promise.all([
    M_lib_db_db.$queryRaw<{page_count: bigint}[]>`PRAGMA page_count`,
    M_lib_db_db.$queryRaw<{page_size: bigint}[]>`PRAGMA page_size`,
    M_lib_db_db.$queryRaw<{freelist_count: bigint}[]>`PRAGMA freelist_count`,
    M_lib_db_db.user.count(),
    M_lib_db_db.$queryRaw<{bytes: bigint}[]>`SELECT COALESCE(SUM(length("avatarBytes")), 0) AS bytes FROM "User"`,
    M_lib_db_db.serviceHeartbeat.findUnique({where: {id: "retention"}, select: {lastSuccessAt: true}}),
  ]);
  const bytes = Number(pages[0].page_count) * Number(pageSize[0].page_size);
  return {engine:"SQLite",databaseBytes:bytes,databaseMiB:Math.round(bytes/1048576*100)/100,
    reusableBytes:Number(free[0].freelist_count)*Number(pageSize[0].page_size),users,
    avatarBytes:Number(avatars[0].bytes),retentionDays:3,lastCleanup:lastCleanup?.lastSuccessAt??null,
    reviewStorage:bytes>=700*1024*1024,scope:"SQLite pages only; Railway Volume also contains WAL and snapshots."};
}
async function exactRevenueSummary() {
  const grouped = new Map<string,{currency:string;_sum:{total:string};_count:number}>();
  let cursor:string|undefined;
  for (;;) {
    const rows=await M_lib_db_db.order.findMany({where:{status:{in:["PAID","FULFILLING","COMPLETED"]}},select:{id:true,currency:true,total:true},orderBy:{id:"asc"},take:500,...(cursor?{cursor:{id:cursor},skip:1}:{})});
    for(const row of rows){const item=grouped.get(row.currency)??{currency:row.currency,_sum:{total:"0"},_count:0};item._sum.total=new M_lib_pricing_i0(item._sum.total).plus(row.total).toString();item._count++;grouped.set(row.currency,item);}
    if(rows.length<500)break;cursor=rows[rows.length-1].id;
  }
  return [...grouped.values()];
}
