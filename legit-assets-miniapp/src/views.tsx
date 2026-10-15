import {ClientRefresh} from "./ui.tsx";
import {miniAppScreenName} from "./shared.tsx";
import {M_components_Catalog_Catalog as M_components_CatalogPage_i0} from "./ui.tsx";
import {M_lib_pricing_optionalFx as M_components_CatalogPage_i1} from "./server.tsx";
import {M_lib_money_quoteRetail as M_components_CatalogPage_i2} from "./shared.tsx";
import {M_components_CountryGrid_CountryGrid as M_components_CatalogPage_i3} from "./ui.tsx";
import {M_lib_store_copy_shopCopy as ScreenModule_shopCopy} from "./shared.tsx";
import {M_lib_catalog_catalog as M_components_CatalogPage_i5} from "./server.tsx";
import {M_lib_i18n_categories as ScreenCategory_categories} from "./shared.tsx";
import {M_lib_i18n_copy as ScreenHome_copy} from "./shared.tsx";
import type {M_lib_i18n_Locale as ScreenNft_Locale} from "./shared.tsx";
import ScreenModules_Link from "next/link";
import {ArrowUpRight as M_components_HomePage_i5} from "lucide-react";
import {ShieldCheck as M_components_HomePage_i4} from "lucide-react";
import {Gift as M_components_CategoryTiles_i3} from "lucide-react";
import {M_lib_design_copy_designCopy as M_components_CategoryTiles_i6} from "./server.tsx";
import {Gamepad2 as M_components_HomePage_i1} from "lucide-react";
import {Send as M_components_HomePage_i2} from "lucide-react";
import {TrendingUp as M_components_HomePage_i3} from "lucide-react";
import {ShoppingBag as M_components_HomePage_i6} from "lucide-react";
import {M_lib_navigation_primaryNavigation as M_components_HomePage_i8} from "./shared.tsx";
import {M_lib_store_products_storeCategories as M_components_HomePage_i9} from "./server.tsx";
import {notFound as ScreenNft_notFound} from "next/navigation";
import {M_lib_i18n_isLocale as ScreenNft_isLocale} from "./shared.tsx";
import __data_M_components_InfoModule_i4 from "@/data.json";
import {M_lib_commerce_market_listSteam as M_components_SteamCatalog_i1} from "./server.tsx";
import {M_lib_commerce_market_steamGames as M_components_SteamCatalog_i2} from "./server.tsx";
import {M_components_Price_Price as M_components_SteamCatalog_i3} from "./ui.tsx";
import {M_components_BuyButton_BuyButton as M_components_SteamCatalog_i4} from "./ui.tsx";
import {M_lib_db_db as ScreenCategory_db} from "./server.tsx";
import {M_lib_store_products_storeProducts as M_components_StoreCatalog_i1} from "./server.tsx";
import {M_components_ProductCard_ProductCard as M_components_StoreCatalog_i3} from "./ui.tsx";
import {M_components_Flag_Flag as ScreenTelegramCountry_Flag} from "./ui.tsx";
import {ShieldAlert as M_components_TelegramCard_i3} from "lucide-react";
import {M_lib_countries_countryName as M_components_TelegramCard_i6} from "./shared.tsx";
import type {M_lib_telegram_market_TelegramListing as M_components_TelegramCard_i9} from "./server.tsx";
import type {M_lib_telegram_market_TelegramFilters as M_components_TelegramFilters_i3} from "./server.tsx";
import {ArrowRight as M_components_VerificationPage_i2} from "lucide-react";
import {UserRound as M_components_VerificationPage_i5} from "lucide-react";
import {Coins as M_components_VerificationPage_i6} from "lucide-react";
import {Check as M_components_VerificationPage_i7} from "lucide-react";
import {M_components_VerificationCatalog_VerificationCatalog as M_components_VerificationPage_i8} from "./ui.tsx";
import {M_components_VerificationCatalog_VerificationLogo as M_components_VerificationPage_i9} from "./ui.tsx";
import {M_lib_pricing_marketMarkup as M_components_VerificationPage_i11} from "./server.tsx";
import type {M_lib_catalog_PricedCatalogItem as M_components_VerificationPage_i13} from "./server.tsx";
import {M_lib_verification_copy_verificationCopy as M_components_VerificationPage_i14} from "./shared.tsx";
import {M_lib_verification_copy_verificationBrands as M_components_VerificationPage_i15} from "./shared.tsx";
import {M_lib_verification_store_verificationItems as M_components_VerificationPage_i17} from "./server.tsx";
import {M_lib_i18n_locales as ScreenNft_locales} from "./shared.tsx";
import {M_components_CustomerAccount_CustomerAccount as ScreenProfile_CustomerAccount} from "./ui.tsx";
import {M_components_ShoppingCart_ShoppingCart as ScreenCart_ShoppingCart} from "./ui.tsx";
import {redirect as ScreenLegacyInfo_redirect} from "next/navigation";
import {M_components_CustomerLogin_CustomerLogin as ScreenLogin_CustomerLogin} from "./ui.tsx";
import {M_components_Tour_Tour as ScreenModule_Tour} from "./ui.tsx";
import {M_lib_telegram_links_modules as ScreenModule_modules} from "./shared.tsx";
import __data_ScreenModule_content from "./data.json";
import {M_lib_app_copy_appCopy as ScreenModules_appCopy} from "./shared.tsx";
import {M_components_NftGiftsCatalog_NftGiftsCatalog as ScreenNft_NftGiftsCatalog} from "./ui.tsx";
import {M_lib_gifts_marketapp_fetchGiftsOnSale as ScreenNft_fetchGiftsOnSale} from "./server.tsx";
import {M_lib_smm_definitions_smmCopy as ScreenSmm_smmCopy} from "./shared.tsx";
import {M_lib_smm_catalog_smmCatalogPage as ScreenSmm_smmCatalogPage} from "./server.tsx";
import {M_components_SmmCatalogBrowser_SmmCatalogBrowser as ScreenSmm_SmmCatalogBrowser} from "./ui.tsx";
import type {M_lib_smm_catalog_SmmFilters as ScreenSmm_SmmFilters} from "./server.tsx";
import {M_lib_countries_isCountry as ScreenTelegramCountry_isCountry} from "./shared.tsx";
import {M_lib_telegram_market_listTelegram as ScreenTelegramCountry_listTelegram} from "./server.tsx";
import {M_lib_telegram_market_parseFilters as ScreenTelegramCountry_parseFilters} from "./server.tsx";
import type {M_lib_telegram_market_TelegramPage as ScreenTelegramCountry_TelegramPage} from "./server.tsx";
import {M_lib_lzt_http_MarketError as ScreenTelegramCountry_MarketError} from "./server.tsx";
const M_components_InfoModule_i4 = __data_M_components_InfoModule_i4["rules"];
// components/CatalogPage.tsx
namespace M_components_CatalogPage {
  export async function CatalogPage({locale, category}: {locale: ScreenNft_Locale; category?: string}) {
    const t = ScreenHome_copy[locale];
    const fx = category === "telegram-accounts" ? null : await M_components_CatalogPage_i1();
    const items = M_components_CatalogPage_i5.filter(
      (p) => p.category !== "telegram-accounts" && (!category || p.category === category),
    ).map((p) => ({
      ...p,
      prices: fx && !p.unpriced ? M_components_CatalogPage_i2(String(p.amountMinor / 100), p.currency, fx) : null,
    }));
    const title = ScreenCategory_categories.find((c) => c.slug === category)?.title[locale] ?? t.title;
    return (
      <>
        <section className="catalog-hero relative mb-10 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-[#111624] to-blue-500/10 p-7 md:p-12">
          <span className="text-xs tracking-[0.3em] text-violet-300">LEGIT ASSETS / DIGITAL MARKETPLACE</span>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">{t.intro}</p>
        </section>
        {category === "telegram-accounts" ? (
          <M_components_CatalogPage_i3 locale={locale} />
        ) : (
          <>
            {!category && (
              <div className="mb-10">
                <M_components_CatalogPage_i3 locale={locale} />
              </div>
            )}
            {!fx && <p className="mb-4 text-xs text-amber-200">{ScreenModule_shopCopy[locale].fxUnavailable}</p>}
            <M_components_CatalogPage_i0 locale={locale} category={category} items={items} />
          </>
        )}
      </>
    );
  }
}
// components/CategoryTiles.tsx
namespace M_components_CategoryTiles {
  export function CategoryTiles({locale}: {locale: ScreenNft_Locale}) {
    const t = M_components_CategoryTiles_i6[locale];
    const details: Array<{
      key: "steam" | "tg" | "smm" | "verify" | "gifts";
      image: string | null;
      tone: string;
      customIcon?: "shield" | "gift";
    }> = [
      {key: "steam", image: "/assets/games/cs2-cover.png", tone: "amber"},
      {key: "tg", image: "/assets/decor/telegram.png", tone: "blue"},
      {key: "smm", image: "/assets/brands/instagram.png", tone: "violet"},
      {key: "verify", image: null, tone: "green", customIcon: "shield"},
      {key: "gifts", image: null, tone: "rose", customIcon: "gift"},
    ];
    return (
      <section id="categories" className="section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEGIT / COLLECTION</p>
            <h2>{t.categories}</h2>
          </div>
          <p>{t.categoryIntro}</p>
        </div>
        <div className="category-tiles">
          {ScreenCategory_categories.map((c, i) => {
            const d = details[i] || details[0];
            return (
              <ScreenModules_Link key={c.slug} href={`/${locale}/${c.slug}`} className={`category-tile tone-${d.tone}`}>
                <div className="tile-visual">
                  {d.image ? (
                    <img src={d.image} alt="" width={320} height={180} className={i === 0 ? "tile-cover" : "tile-logo"} />
                  ) : d.customIcon === "gift" ? (
                    <div className="gift-home-emblem flex flex-col items-center justify-center gap-2 text-rose-400">
                      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 shadow-[0_0_30px_#f43f5e33]">
                        <M_components_CategoryTiles_i3 size={46} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-rose-300">TELEGRAM NFT</span>
                    </div>
                  ) : (
                    <div className="verification-home-emblem">
                      <M_components_HomePage_i4 size={70} strokeWidth={1} />
                      <div>
                        {["binance", "okx", "kucoin"].map((brand) => (
                          <img key={brand} src={`/assets/brands/${brand}.png`} alt="" width={30} height={30} />
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="tile-number">0{i + 1}</span>
                </div>
                <div className="tile-body">
                  <h3>{c.title[locale]}</h3>
                  <p>{t[d.key]}</p>
                  <span className="tile-cta">
                    {t.explore}
                    <M_components_HomePage_i5 size={17} />
                  </span>
                </div>
              </ScreenModules_Link>
            );
          })}
        </div>
      </section>
    );
  }
}
// components/HomePage.tsx
namespace M_components_HomePage {
  const copy = {
    uk: {
      intro: "Акаунти, просування та послуги — обери категорію.",
      steam: "Steam-акаунти",
      tg: "Telegram-акаунти",
      smm: "SMM-послуги",
      verify: "Верифікації",
      steamNote: "Обери гру та акаунт",
      tgNote: "Пошук за країною",
      smmNote: "Послуга, кількість і посилання",
      verifyNote: "Біржі, гаманці та сервіси",
      cart: "Кошик",
      rules: "Правила та підтримка",
    },
    ru: {
      intro: "Аккаунты, продвижение и услуги — выбери категорию.",
      steam: "Steam-аккаунты",
      tg: "Telegram-аккаунты",
      smm: "SMM-услуги",
      verify: "Верификации",
      steamNote: "Выбери игру и аккаунт",
      tgNote: "Поиск по стране",
      smmNote: "Услуга, количество и ссылка",
      verifyNote: "Биржи, кошельки и сервисы",
      cart: "Корзина",
      rules: "Правила и поддержка",
    },
    en: {
      intro: "Accounts, promotion and services. Choose a category.",
      steam: "Steam accounts",
      tg: "Telegram accounts",
      smm: "SMM services",
      verify: "Verifications",
      steamNote: "Choose a game and account",
      tgNote: "Browse by country",
      smmNote: "Service, quantity and URL",
      verifyNote: "Exchanges, wallets and services",
      cart: "Cart",
      rules: "Rules and support",
    },
  };
  export async function HomePage({locale}: {locale: ScreenNft_Locale}) {
    const t = copy[locale];
    const sections = [
      {
        slug: "steam-accounts",
        title: t.steam,
        note: t.steamNote,
        Icon: M_components_HomePage_i1,
        image: "/assets/games/cs2-cover.png",
      },
      {
        slug: "telegram-accounts",
        title: t.tg,
        note: t.tgNote,
        Icon: M_components_HomePage_i2,
        image: "/assets/decor/telegram.png",
      },
      {
        slug: "smm",
        title: t.smm,
        note: t.smmNote,
        Icon: M_components_HomePage_i3,
        image: "/assets/brands/instagram.png",
      },
      {
        slug: "verifications",
        title: t.verify,
        note: t.verifyNote,
        Icon: M_components_HomePage_i4,
        image: "/assets/brands/binance.png",
      },
    ];
    let custom: {
      slug: string;
      title: string;
    }[] = [];
    if (process.env.DATABASE_URL)
      try {
        custom = (await M_components_HomePage_i9(locale))
          .filter((c) => ![...sections.map((s) => s.slug), "nft-gifts", "gifts"].includes(c.slug))
          .map((c) => ({
            slug: c.slug,
            title: c.translations[0]?.title ?? c.slug,
          }));
      } catch {}
    return (
      <section className="store-home">
        <header className="store-heading">
          <div>
            <h1>{M_components_HomePage_i8[locale].store}</h1>
            <p>{t.intro}</p>
          </div>
          <ScreenModules_Link className="store-cart-link" href={`/${locale}/cart`} aria-label={t.cart}>
            <M_components_HomePage_i6 size={22} />
          </ScreenModules_Link>
        </header>
        <div className="store-category-grid">
          {sections.map(({slug, title, note, Icon, image}) => (
            <ScreenModules_Link className="store-category-card" key={slug} href={`/${locale}/${slug}`}>
              <div className={`store-category-art art-${slug}`}>
                <img src={image} alt="" width={240} height={160} loading="lazy" decoding="async" />
                <Icon className="store-category-symbol" size={22} />
              </div>
              <div className="store-category-copy">
                <h2>{title}</h2>
                <p>{note}</p>
                <M_components_HomePage_i5 size={18} />
              </div>
            </ScreenModules_Link>
          ))}
          {custom.map((c) => (
            <ScreenModules_Link className="store-category-card custom-store-category" key={c.slug} href={`/${locale}/${c.slug}`}>
              <M_components_HomePage_i6 size={30} />
              <h2>{c.title}</h2>
              <M_components_HomePage_i5 size={18} />
            </ScreenModules_Link>
          ))}
        </div>
        <ScreenModules_Link className="store-support-link" href={`/${locale}/modules/rules`}>
          {t.rules}
          <M_components_HomePage_i5 size={16} />
        </ScreenModules_Link>
      </section>
    );
  }
}
// components/InfoModule.tsx
namespace M_components_InfoModule {
  const documents = ["about", "payment", "tos", "privacy"] as const;
  type Document = (typeof documents)[number];
  function isDocument(value: string): value is Document {
    return documents.some((d) => d === value);
  }
  type Props = {
    params: Promise<{
      locale: string;
      document: string;
    }>;
  };
  export async function Page({params}: Props) {
    const {locale, document} = await params;
    if (!ScreenNft_isLocale(locale) || !isDocument(document)) ScreenNft_notFound();
    const t = ScreenModule_shopCopy[locale];
    return (
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-violet-300">Legit Assets</p>
        <h1 className="mb-8 text-3xl font-semibold md:text-4xl">{t[document]}</h1>
        <nav aria-label={t.rules} className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {documents.map((d) => (
            <ScreenModules_Link
              key={d}
              href={`/${locale}/modules/${d === "tos" ? "rules" : d}`}
              aria-current={d === document ? "page" : undefined}
              className={`shrink-0 rounded-xl border px-4 py-3 text-sm ${d === document ? "border-violet-400/50 bg-violet-500/20 text-violet-200" : "border-white/10 text-slate-400"}`}
            >
              {t[d]}
            </ScreenModules_Link>
          ))}
        </nav>
        <article className="space-y-7 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-9">
          {M_components_InfoModule_i4[locale][document].items.map(([title, text], i) => (
            <section key={i}>
              <h2 className="mb-3 text-lg font-semibold">{title}</h2>
              <p className="text-sm leading-7 text-slate-300">{text}</p>
            </section>
          ))}
        </article>
        <p className="mt-6 text-xs text-slate-500">
          {t.ruleSource}{" "}
          <a className="text-violet-300 underline" href="https://t.me/LegitAssetsBot">
            Legit Assets · Telegram ↗
          </a>
        </p>
      </div>
    );
  }
  export const _default = Page;
}
// components/SteamCatalog.tsx
namespace M_components_SteamCatalog {
  export async function SteamCatalog({locale, query}: {locale: ScreenNft_Locale; query: Record<string, string | undefined>}) {
    const t =
      locale === "uk"
        ? {
            title: "Steam-акаунти",
            intro: "Обери гру. Переглянь доступні акаунти й додай потрібний до кошика.",
            all: "Усі ігри",
            search: "Пошук акаунтів",
            cheap: "Спочатку дешевші",
            expensive: "Спочатку дорожчі",
            new: "Нові оголошення",
            find: "Знайти",
            empty: "За цими параметрами нічого не знайдено",
            unavailable: "Каталог постачальника зараз недоступний. Спробуй пізніше.",
            back: "Назад",
            next: "Далі",
          }
        : locale === "ru"
          ? {
              title: "Steam-аккаунты",
              intro: "Выбери игру. Посмотри доступные аккаунты и добавь нужный в корзину.",
              all: "Все игры",
              search: "Поиск аккаунтов",
              cheap: "Сначала дешевле",
              expensive: "Сначала дороже",
              new: "Новые объявления",
              find: "Найти",
              empty: "По этим параметрам ничего не найдено",
              unavailable: "Каталог поставщика сейчас недоступен. Попробуй позже.",
              back: "Назад",
              next: "Далее",
            }
          : {
              title: "Steam accounts",
              intro: "Choose a game. Browse available accounts and add one to your cart.",
              all: "All games",
              search: "Search accounts",
              cheap: "Lowest price",
              expensive: "Highest price",
              new: "Newest",
              find: "Search",
              empty: "No accounts match these filters",
              unavailable: "The supplier catalog is unavailable. Please retry later.",
              back: "Previous",
              next: "Next",
            };
    let data;
    try {
      data = await M_components_SteamCatalog_i1({
        game: query.game,
        page: Number(query.page) || 1,
        sort: query.sort,
        search: query.q,
      });
    } catch {}
    const link = (page: number) =>
      `/${locale}/steam-accounts?${new URLSearchParams({
        ...Object.fromEntries(Object.entries(query).filter((e): e is [string, string] => typeof e[1] === "string")),
        page: String(page),
      })}`;
    return (
      <>
        <section className="smm-header">
          <p className="eyebrow">LEGIT / STEAM MARKET</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </section>
        <div className="steam-game-grid">
          <ScreenModules_Link className={!query.game ? "selected" : ""} href={`/${locale}/steam-accounts`}>
            <img src="/assets/decor/steam.png" alt="" />
            {t.all}
          </ScreenModules_Link>
          {M_components_SteamCatalog_i2.map((g) => (
            <ScreenModules_Link
              className={query.game === g.slug ? "selected" : ""}
              key={g.slug}
              href={`/${locale}/steam-accounts?game=${g.slug}`}
            >
              <img src={g.image} alt="" width={80} height={80} loading="lazy" decoding="async" />
              {g.name}
            </ScreenModules_Link>
          ))}
        </div>
        <form className="shop-panel steam-search" action={`/${locale}/steam-accounts`}>
          <input type="hidden" name="game" value={query.game ?? ""} />
          <input name="q" aria-label={t.search} placeholder={t.search} defaultValue={query.q} />
          <select name="sort" aria-label={t.cheap} defaultValue={query.sort ?? "asc"}>
            <option value="asc">{t.cheap}</option>
            <option value="desc">{t.expensive}</option>
            <option value="newest">{t.new}</option>
          </select>
          <button className="primary-button">{t.find}</button>
        </form>
        {!data ? (
          <p role="alert" className="shop-panel shop-error">
            {t.unavailable}
            <ClientRefresh label={locale==='uk'?'Повторити':locale==='ru'?'Повторить':'Retry'} pendingLabel={locale==='uk'?'Оновлюємо…':locale==='ru'?'Обновляем…':'Refreshing…'}/>
          </p>
        ) : (
          <>
            <div className="steam-listing-grid">
              {data.items.map((i) => (
                <article key={i.id} className="shop-panel steam-listing">
                  <img src={i.image} alt="" width={640} height={360} loading="lazy" decoding="async" />
                  <small>STEAM / #{i.id}</small>
                  <h2>
                    <ScreenModules_Link href={`/${locale}/market/${i.id}`}>{i.title}</ScreenModules_Link>
                  </h2>
                  <M_components_SteamCatalog_i3 locale={locale} price={i.prices} />
                  <M_components_SteamCatalog_i4
                    item={{
                      kind: "market",
                      id: i.id,
                      title: i.title,
                      quantity: 1,
                    }}
                  />
                </article>
              ))}
            </div>
            {!data.items.length && <p className="shop-panel">{t.empty}</p>}
            <div className="smm-pagination">
              {data.page > 1 && <ScreenModules_Link href={link(data.page - 1)}>← {t.back}</ScreenModules_Link>}
              <span>{data.page}</span>
              {data.hasNext && <ScreenModules_Link href={link(data.page + 1)}>{t.next} →</ScreenModules_Link>}
            </div>
          </>
        )}
      </>
    );
  }
}
// components/StoreCatalog.tsx
namespace M_components_StoreCatalog {
  export async function StoreCatalog({locale, slug}: {locale: ScreenNft_Locale; slug: string}) {
    const c = await ScreenCategory_db.category.findUnique({
      where: {slug},
      include: {translations: true},
    });
    if (!c?.active) ScreenNft_notFound();
    const products = await M_components_StoreCatalog_i1(slug, locale);
    return (
      <>
        <section className="smm-header">
          <p className="eyebrow">LEGIT / CATALOG</p>
          <h1>{c.translations.find((t) => t.locale === locale)?.title ?? c.slug}</h1>
        </section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <M_components_StoreCatalog_i3
              key={p.id}
              title={p.title}
              price={p.prices}
              category={c.slug}
              stockStatus={p.stock === 0 ? "out_of_stock" : p.stock === null ? "on_request" : "in_stock"}
              imageUrl={p.image}
              locale={locale}
              href={`/${locale}/product/${p.id}`}
            />
          ))}
        </div>
        {!products.length && (
          <p className="shop-panel">
            {locale === "uk" ? "Товари з’являться незабаром" : locale === "ru" ? "Товары появятся скоро" : "Products will appear here soon"}
          </p>
        )}
      </>
    );
  }
}
// components/TelegramCard.tsx
namespace M_components_TelegramCard {
  export function TelegramCard({item, locale}: {item: M_components_TelegramCard_i9; locale: ScreenNft_Locale}) {
    const t = ScreenModule_shopCopy[locale];
    return (
      <article className="clean-telegram-card rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 backdrop-blur-xl transition hover:border-violet-400/40">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-4xl" aria-hidden>
            <ScreenTelegramCountry_Flag country={item.country} />
          </span>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{t.live}</span>
        </div>
        <h2 className="text-lg font-semibold">Telegram · {M_components_TelegramCard_i6(item.country, locale)}</h2>
        <p className="mt-1 text-xs text-slate-500">#{item.id}</p>
        <div className="my-5 flex flex-wrap gap-2 text-xs">
          <span
            className={`flex items-center gap-1 rounded-lg px-2 py-1.5 ${item.spam === "none" ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-200"}`}
          >
            {item.spam === "none" ? <M_components_HomePage_i4 size={13} /> : <M_components_TelegramCard_i3 size={13} />}{" "}
            {item.spam === "none" ? t.noSpam : item.spam === "blocked" ? t.hasSpam : t.unknown}
          </span>
          <span className="rounded-lg bg-violet-400/10 px-2 py-1.5 text-violet-200">
            {t.premium}: {item.premium === null ? t.unknown : item.premium ? t.yes : t.no}
          </span>
          <span className="rounded-lg bg-white/5 px-2 py-1.5 text-slate-300">
            2FA: {item.password === null ? t.unknown : item.password ? t.yes : t.no}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <M_components_SteamCatalog_i3 price={item.prices} locale={locale} />
          <ScreenModules_Link
            href={`/${locale}/telegram-account/${item.id}`}
            aria-label={`${t.details} #${item.id}`}
            className="rounded-xl bg-violet-500 p-3 text-white shadow-[0_0_22px_#8b5cf633] hover:bg-violet-400"
          >
            <M_components_HomePage_i5 size={20} />
          </ScreenModules_Link>
        </div>
      </article>
    );
  }
}
// components/TelegramFilters.tsx
namespace M_components_TelegramFilters {
  export function TelegramFilters({
    locale,
    country,
    filters,
  }: {
    locale: ScreenNft_Locale;
    country: string;
    filters: M_components_TelegramFilters_i3;
  }) {
    const t = ScreenModule_shopCopy[locale];
    const field = "mt-2 w-full rounded-xl border border-white/10 bg-[#111725] px-3 py-3 text-sm";
    const advanced = filters.premium !== "nomatter" || filters.password !== "nomatter" || Boolean(filters.min || filters.max);
    return (
      <form action={`/${locale}/telegram-accounts/${country}`} className="mb-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-xs text-slate-400">
            {t.spam}
            <select name="spam" defaultValue={filters.spam} className={field}>
              <option value="nomatter">{t.any}</option>
              <option value="no">{t.noSpam}</option>
              <option value="yes">{t.hasSpam}</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">
            {t.sort}
            <select name="sort" defaultValue={filters.sort} className={field}>
              <option value="asc">{t.cheap}</option>
              <option value="desc">{t.expensive}</option>
              <option value="newest">{t.newest}</option>
            </select>
          </label>
        </div>
        <details open={advanced} className="mt-4 text-sm text-slate-300">
          <summary className="cursor-pointer py-2 text-violet-300">{t.moreFilters}</summary>
          <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {key: "premium", label: t.premium},
              {key: "password", label: t.password},
            ].map(({key, label}) => (
              <label key={key} className="text-xs text-slate-400">
                {label}
                <select name={key} defaultValue={filters[key as "premium" | "password"]} className={field}>
                  <option value="nomatter">{t.any}</option>
                  <option value="no">{t.no}</option>
                  <option value="yes">{t.yes}</option>
                </select>
              </label>
            ))}
            <label className="text-xs text-slate-400">
              {t.from}
              <input
                name="min"
                aria-label={t.from}
                defaultValue={filters.min}
                min="0"
                max="999999"
                step="0.01"
                type="number"
                className={field}
              />
            </label>
            <label className="text-xs text-slate-400">
              {t.to}
              <input
                name="max"
                aria-label={t.to}
                defaultValue={filters.max}
                min="0"
                max="999999"
                step="0.01"
                type="number"
                className={field}
              />
            </label>
            <label className="text-xs text-slate-400">
              {t.currency}
              <select name="currency" defaultValue={filters.currency} className={field}>
                <option value="UAH">UAH · ₴</option>
                <option value="USDT">USDT</option>
              </select>
            </label>
          </div>
        </details>
        <div className="mt-4 flex items-center gap-3">
          <button className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium hover:bg-violet-400">{t.apply}</button>
          <ScreenModules_Link href={`/${locale}/telegram-accounts/${country}`} className="px-2 py-3 text-sm text-slate-400">
            {t.reset}
          </ScreenModules_Link>
        </div>
      </form>
    );
  }
}
// components/VerificationPage.tsx
namespace M_components_VerificationPage {
  export async function VerificationPage({locale}: {locale: ScreenNft_Locale}) {
    const t = M_components_VerificationPage_i14[locale];
    const fx = await M_components_CatalogPage_i1();
    let unavailable = false;
    let items: M_components_VerificationPage_i13[] = [];
    try {
      items = (await M_components_VerificationPage_i17()).map((p) => ({
        ...p,
        prices:
          fx && !p.unpriced
            ? M_components_CatalogPage_i2(p.baseAmount ?? String(p.amountMinor / 100), p.currency, fx, M_components_VerificationPage_i11())
            : null,
      }));
    } catch {
      unavailable = true;
    }
    return (
      <>
        <section className="verification-hero">
          <div className="verification-hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              {t.eyebrow}
            </p>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
            <a href="#verification-services" className="primary-button">
              {t.browse}
              <M_components_VerificationPage_i2 size={18} />
            </a>
            <div className="verification-hero-perks">
              <span>
                <M_components_VerificationPage_i5 size={15} />
                {t.manual}
              </span>
              <span>
                <M_components_VerificationPage_i6 size={15} />
                {t.currencies}
              </span>
            </div>
          </div>
          <div className="verification-brand-wall" aria-hidden="true">
            {["vr_binance", "vr_bybit", "vr_okx", "vr_bingx", "vr_kucoin", "vr_bitget"].map((id) => (
              <div key={id} className={`verification-brand-tile ${id}`}>
                <M_components_VerificationPage_i9 id={id} />
              </div>
            ))}
            <div className="verification-wall-caption">
              <M_components_HomePage_i4 size={16} /> LEGIT / PERSONAL SERVICE
            </div>
          </div>
        </section>
        {unavailable ? (
          <p role="alert" className="verification-empty">
            {locale === "uk"
              ? "Каталог тимчасово недоступний. Спробуй пізніше."
              : locale === "ru"
                ? "Каталог временно недоступен. Попробуй позже."
                : "The catalog is temporarily unavailable. Please try again later."}
          </p>
        ) : (
          <M_components_VerificationPage_i8 locale={locale} items={items} />
        )}
        <VerificationProcess locale={locale} />
        <section className="verification-conditions">
          <M_components_HomePage_i4 size={26} />
          <div>
            <h2>{t.conditions}</h2>
            <p>{t.conditionsText}</p>
          </div>
          <ScreenModules_Link href={`/${locale}/info/tos`} className="secondary-button">
            {t.terms}
            <M_components_HomePage_i5 size={16} />
          </ScreenModules_Link>
        </section>
        <p className="verification-affiliation">{t.affiliation}</p>
      </>
    );
  }
  function VerificationProcess({locale}: {locale: ScreenNft_Locale}) {
    const t = M_components_VerificationPage_i14[locale];
    return (
      <section className="verification-process">
        <h2>{t.flowTitle}</h2>
        <div>
          {t.steps.map((s, i) => (
            <p key={s}>
              <span>0{i + 1}</span>
              {s}
            </p>
          ))}
        </div>
      </section>
    );
  }
  export function VerificationDetail({locale, product}: {locale: ScreenNft_Locale; product: M_components_VerificationPage_i13}) {
    const t = M_components_VerificationPage_i14[locale];
    const brand = product.brand ?? M_components_VerificationPage_i15[product.id];
    return (
      <>
        <ScreenModules_Link href={`/${locale}/verifications`} className="verification-back">
          ← {t.back}
        </ScreenModules_Link>
        <section className="verification-detail">
          <div className="verification-detail-art">
            <M_components_VerificationPage_i9 id={product.id} metadata={product.brand} large />
            <span className="verification-detail-brand">{brand?.name}</span>
            <div className="verification-detail-manual">
              <M_components_VerificationPage_i5 size={16} />
              {t.manual}
            </div>
          </div>
          <div className="verification-detail-content">
            <p className="eyebrow">LEGIT / VERIFICATIONS</p>
            <h1>{product.title[locale]}</h1>
            <p>{product.id === "vr_bybit_cards" ? t.cardsDesc : brand?.group === "exchange" ? t.exchangeDesc : t.walletDesc}</p>
            <div className="verification-detail-price">
              <span>{t.price}</span>
              <M_components_SteamCatalog_i3 price={product.prices} locale={locale} />
            </div>
            <ul>
              {t.checklist.map((s) => (
                <li key={s}>
                  <M_components_VerificationPage_i7 size={17} />
                  {s}
                </li>
              ))}
            </ul>
            <p className="verification-detail-time">{t.noTime}</p>
            <M_components_SteamCatalog_i4
              item={{
                kind: "product",
                id: product.id,
                title: product.title[locale],
                quantity: 1,
              }}
              disabled={!product.prices}
            />
            <a href={`https://t.me/LegitAssetsBot?start=${locale}`} className="primary-button">
              {t.contact}
              <M_components_HomePage_i5 size={18} />
            </a>
            <p className="verification-detail-note">{t.requestNote}</p>
          </div>
        </section>
        <section className="verification-conditions">
          <M_components_HomePage_i4 size={24} />
          <div>
            <h2>{t.conditions}</h2>
            <p>{t.conditionsText}</p>
          </div>
          <ScreenModules_Link href={`/${locale}/info/tos`} className="secondary-button">
            {t.terms}
            <M_components_HomePage_i5 size={16} />
          </ScreenModules_Link>
        </section>
        <p className="verification-rate-note">{t.note}</p>
        <p className="verification-affiliation">{t.affiliation}</p>
      </>
    );
  }
}
export import M_components_CatalogPage_CatalogPage = M_components_CatalogPage.CatalogPage;
export import M_components_CategoryTiles_CategoryTiles = M_components_CategoryTiles.CategoryTiles;
export import M_components_HomePage_HomePage = M_components_HomePage.HomePage;
export import M_components_InfoModule__default = M_components_InfoModule._default;
export import M_components_SteamCatalog_SteamCatalog = M_components_SteamCatalog.SteamCatalog;
export import M_components_StoreCatalog_StoreCatalog = M_components_StoreCatalog.StoreCatalog;
export import M_components_TelegramCard_TelegramCard = M_components_TelegramCard.TelegramCard;
export import M_components_TelegramFilters_TelegramFilters = M_components_TelegramFilters.TelegramFilters;
export import M_components_VerificationPage_VerificationPage = M_components_VerificationPage.VerificationPage;
export import M_components_VerificationPage_VerificationDetail = M_components_VerificationPage.VerificationDetail;
const ScreenModule_content = __data_ScreenModule_content["tour"];
// Consolidated page: src/app/[locale]/[category]/page.tsx
namespace ScreenCategory {
  export const dynamic = "force-dynamic";
  type Props = {
    params: Promise<{
      locale: string;
      category: string;
    }>;
  };
  export function generateStaticParams() {
    return ScreenNft_locales.flatMap((locale) => ScreenCategory_categories.map((c) => ({locale, category: c.slug})));
  }
  export async function generateMetadata({params}: Props) {
    const {locale, category} = await params;
    const c = ScreenCategory_categories.find((c) => c.slug === category);
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const custom =
      !c && process.env.DATABASE_URL
        ? await ScreenCategory_db.category.findUnique({
            where: {slug: category},
            include: {translations: true},
          })
        : null;
    if (!c && !custom?.active) ScreenNft_notFound();
    return {
      title: c?.title[locale] ?? custom?.translations.find((t) => t.locale === locale)?.title ?? category,
      alternates: {
        canonical: `/${locale}/${category}`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/${category}`])),
      },
    };
  }
  export async function Page({params}: Props) {
    const {locale, category} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    if (!ScreenCategory_categories.some((c) => c.slug === category))
      return <M_components_StoreCatalog_StoreCatalog locale={locale} slug={category} />;
    return <M_components_CatalogPage_CatalogPage locale={locale} category={category} />;
  }
}
// Consolidated page: src/app/[locale]/account/page.tsx
namespace ScreenProfile {
  export const metadata = {robots: {index: false, follow: false}};
  export function Page() {
    return <ScreenProfile_CustomerAccount />;
  }
}
// Consolidated page: src/app/[locale]/cart/page.tsx
namespace ScreenCart {
  export const metadata = {robots: {index: false, follow: false}};
  export function Page() {
    return <ScreenCart_ShoppingCart />;
  }
}
// Consolidated page: src/app/[locale]/gifts/page.tsx
namespace ScreenLegacyGifts {
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    ScreenLegacyInfo_redirect(`/${locale}/nft-gifts`);
  }
}
// Consolidated page: src/app/[locale]/history/page.tsx
namespace ScreenHistory {
  export const metadata = {robots: {index: false, follow: false}};
  export function Page() {
    return <ScreenProfile_CustomerAccount view="history" />;
  }
}
// Consolidated page: src/app/[locale]/info/[document]/page.tsx
namespace ScreenLegacyDocument {
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
      document: string;
    }>;
  }) {
    const {locale, document} = await params;
    if (!ScreenNft_isLocale(locale) || !["about", "payment", "tos", "privacy"].includes(document)) ScreenNft_notFound();
    ScreenLegacyInfo_redirect(`/${locale}/modules/${document === "tos" ? "rules" : document}`);
  }
}
// Consolidated page: src/app/[locale]/info/page.tsx
namespace ScreenLegacyInfo {
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    ScreenLegacyInfo_redirect(`/${locale}/info/about`);
  }
}
// Consolidated page: src/app/[locale]/login/page.tsx
namespace ScreenLogin {
  export const metadata = {robots: {index: false, follow: false}};
  export function Page() {
    return <ScreenLogin_CustomerLogin />;
  }
}
// Consolidated page: src/app/[locale]/modules/[module]/page.tsx
namespace ScreenModule {
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{
      locale: string;
      module: string;
    }>;
  }) {
    const {locale, module} = await params;
    if (!ScreenNft_isLocale(locale) || !ScreenModule_modules.some((m) => m === module)) ScreenNft_notFound();
    return {
      title:
        module === "tour"
          ? ScreenModule_content[locale].title
          : ScreenModule_shopCopy[locale][(module === "rules" ? "tos" : module) as "tos" | "about" | "payment" | "privacy"],
      alternates: {
        canonical: `/${locale}/modules/${module}`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/modules/${module}`])),
      },
    };
  }
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
      module: string;
    }>;
  }) {
    const {locale, module} = await params;
    if (!ScreenNft_isLocale(locale) || !ScreenModule_modules.some((m) => m === module)) ScreenNft_notFound();
    if (module === "tour") return <ScreenModule_Tour locale={locale} />;
    return (
      <M_components_InfoModule__default
        params={Promise.resolve({
          locale,
          document: module === "rules" ? "tos" : module,
        })}
      />
    );
  }
}
// Consolidated page: src/app/[locale]/modules/page.tsx
namespace ScreenModules {
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const t = ScreenModules_appCopy[locale],
      s = ScreenModule_shopCopy[locale];
    return (
      <section className="modules-blue">
        <span className="blue-eyebrow">LEGIT / TRUST</span>
        <h1>{t.guarantees}</h1>
        <p>{t.guaranteesText}</p>
        <div className="module-card-grid">
          {[
            {slug: "tour", title: t.tour},
            {slug: "about", title: s.about},
            {slug: "rules", title: s.rules},
            {slug: "payment", title: s.payment},
            {slug: "privacy", title: s.privacy},
          ].map((item) => (
            <ScreenModules_Link key={item.slug} className="glass-module-card" href={`/${locale}/modules/${item.slug}`}>
              <M_components_HomePage_i4 size={25} />
              <h2>{item.title}</h2>
              <M_components_HomePage_i5 size={20} />
            </ScreenModules_Link>
          ))}
        </div>
        <a className="primary-button" href="https://t.me/LegitAssetsBot">
          {t.support} ↗
        </a>
      </section>
    );
  }
}
// Consolidated page: src/app/[locale]/nft-gifts/page.tsx
namespace ScreenNft {
  export const dynamic = "force-dynamic";
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const title =
      locale === "uk"
        ? "NFT Подарунки Telegram — Legit Assets"
        : locale === "ru"
          ? "NFT Подарки Telegram — Legit Assets"
          : "Telegram NFT Gifts — Legit Assets";
    const description =
      locale === "uk"
        ? "Купівля колекційних Telegram NFT подарунків за GRAM через MarketApp API."
        : locale === "ru"
          ? "Покупка коллекционных Telegram NFT подарков за GRAM через MarketApp API."
          : "Buy collectible Telegram NFT gifts with GRAM via MarketApp API.";
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/nft-gifts`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/nft-gifts`])),
      },
    };
  }
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const data = await ScreenNft_fetchGiftsOnSale({limit: 30});
    return (
      <ScreenNft_NftGiftsCatalog
        locale={locale as ScreenNft_Locale}
        initialGifts={data.items}
        tonRate={data.tonRate}
        liveApi={data.liveApi}
        binance={data.binance}
      />
    );
  }
}
// Consolidated page: src/app/[locale]/page.tsx
namespace ScreenHome {
  export const dynamic = "force-dynamic";
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    return {
      title: ScreenHome_copy[locale].catalog,
      description: ScreenHome_copy[locale].intro,
      alternates: {
        canonical: `/${locale}`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}`])),
      },
    };
  }
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    return <M_components_HomePage_HomePage locale={locale} />;
  }
}
// Consolidated page: src/app/[locale]/smm/page.tsx
namespace ScreenSmm {
  export const dynamic = "force-dynamic";
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    return {
      title: "SMM",
      description: ScreenSmm_smmCopy[locale].intro,
      alternates: {
        canonical: `/${locale}/smm`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/smm`])),
      },
    };
  }
  export async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{
      locale: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const p = await searchParams;
    const value = (key: string) => (typeof p[key] === "string" ? (p[key] as string) : "");
    const filters: ScreenSmm_SmmFilters = {
      q: value("q"),
      platform: value("platform"),
      category: value("category"),
      sort: value("sort"),
      supported: value("supported") === "1",
      refill: value("refill") === "1",
      page: Number(value("page")) || 1,
    };
    const t = ScreenSmm_smmCopy[locale];
    const data = await ScreenSmm_smmCatalogPage(filters);
    return (
      <>
        <section className="smm-header">
          <p className="eyebrow">LEGIT / SOCIAL</p>
          <h1>{locale === "uk" ? "SMM-послуги" : locale === "ru" ? "SMM-услуги" : "SMM services"}</h1>
          <p>{t.intro}</p>
        </section>
        <ScreenSmm_SmmCatalogBrowser locale={locale} initial={data} initialFilters={filters} />
      </>
    );
  }
}
// Consolidated page: src/app/[locale]/steam-accounts/page.tsx
namespace ScreenSteam {
  export const dynamic = "force-dynamic";
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    return {
      title: locale === "en" ? "Steam accounts" : "Steam-акаунти",
      alternates: {
        canonical: `/${locale}/steam-accounts`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/steam-accounts`])),
      },
    };
  }
  export async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{
      locale: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const p = await searchParams;
    return (
      <M_components_SteamCatalog_SteamCatalog
        locale={locale}
        query={Object.fromEntries(Object.entries(p).filter((e): e is [string, string] => typeof e[1] === "string"))}
      />
    );
  }
}
// Consolidated page: src/app/[locale]/telegram-accounts/[country]/page.tsx
namespace ScreenTelegramCountry {
  export const dynamic = "force-dynamic";
  type Props = {
    params: Promise<{
      locale: string;
      country: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  };
  export async function generateMetadata({params}: Props) {
    const {locale, country} = await params;
    if (!ScreenNft_isLocale(locale) || !ScreenTelegramCountry_isCountry(country)) ScreenNft_notFound();
    return {
      title: `Telegram · ${M_components_TelegramCard_i6(country, locale)}`,
      alternates: {
        canonical: `/${locale}/telegram-accounts/${country}`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/telegram-accounts/${country}`])),
      },
    };
  }
  export async function Page({params, searchParams}: Props) {
    const {locale, country} = await params;
    if (!ScreenNft_isLocale(locale) || !ScreenTelegramCountry_isCountry(country)) ScreenNft_notFound();
    const t = ScreenModule_shopCopy[locale];
    const filters = ScreenTelegramCountry_parseFilters(await searchParams);
    let result: ScreenTelegramCountry_TelegramPage | undefined;
    let error: string | undefined;
    try {
      result = await ScreenTelegramCountry_listTelegram(country, filters);
    } catch (e) {
      error = e instanceof ScreenTelegramCountry_MarketError && e.code === "not_configured" ? t.notConfigured : t.unavailable;
    }
    const href = (page: number) => {
      const q = new URLSearchParams({
        spam: filters.spam,
        premium: filters.premium,
        password: filters.password,
        sort: filters.sort,
        currency: filters.currency,
        page: String(page),
      });
      if (filters.min) q.set("min", filters.min);
      if (filters.max) q.set("max", filters.max);
      return `/${locale}/telegram-accounts/${country}?${q}`;
    };
    return (
      <>
        <ScreenModules_Link href={`/${locale}/telegram-accounts`} className="text-sm text-violet-300">
          ← {t.allCountries}
        </ScreenModules_Link>
        <div className="mb-7 mt-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="country-heading flex items-center gap-3 text-3xl font-semibold">
            <ScreenTelegramCountry_Flag country={country} /> {M_components_TelegramCard_i6(country, locale)} · Telegram
          </h1>
          <a href={`https://t.me/LegitAssetsBot?startapp=${locale}_tg_${country}`} className="country-deep-link text-sm text-violet-300">
            {t.countryDeep} ↗
          </a>
        </div>
        <M_components_TelegramFilters_TelegramFilters key={JSON.stringify(filters)} locale={locale} country={country} filters={filters} />
        {error ? (
          <div role="alert" className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-amber-200">
            {error}
            <ClientRefresh label={t.retry} pendingLabel={locale==='uk'?'Оновлюємо…':locale==='ru'?'Обновляем…':'Refreshing…'}/>
          </div>
        ) : (
          <>
            <p className="mb-5 text-xs text-slate-400">{t.fxNote}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result?.items.map((item) => (
                <M_components_TelegramCard_TelegramCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
            {!result?.items.length && <p className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">{t.empty}</p>}
            <div className="mt-7 flex items-center justify-between gap-3 text-sm">
              {filters.page > 1 ? (
                <ScreenModules_Link href={href(filters.page - 1)} className="text-violet-300">
                  ← {t.previous}
                </ScreenModules_Link>
              ) : (
                <span />
              )}
              <span className="text-slate-400">
                {t.page} {filters.page}
              </span>
              {result?.hasNext && filters.page < 100 ? (
                <ScreenModules_Link href={href(filters.page + 1)} className="text-violet-300">
                  {t.next} →
                </ScreenModules_Link>
              ) : (
                <span />
              )}
            </div>
            <p className="mt-5 text-xs text-slate-500">{t.listed}</p>
          </>
        )}
      </>
    );
  }
}
// Consolidated page: src/app/[locale]/tour/page.tsx
namespace ScreenLegacyTour {
  export async function Page({
    params,
  }: {
    params: Promise<{
      locale: string;
    }>;
  }) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    ScreenLegacyInfo_redirect(`/${locale}/modules/tour`);
  }
}
// Consolidated page: src/app/[locale]/verifications/page.tsx
namespace ScreenVerifications {
  export const dynamic = "force-dynamic";
  type Props = {
    params: Promise<{
      locale: string;
    }>;
  };
  export async function generateMetadata({params}: Props) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    const t = M_components_VerificationPage_i14[locale];
    return {
      title: t.title,
      description: t.intro,
      alternates: {
        canonical: `/${locale}/verifications`,
        languages: Object.fromEntries(ScreenNft_locales.map((l) => [l, `/${l}/verifications`])),
      },
    };
  }
  export async function Page({params}: Props) {
    const {locale} = await params;
    if (!ScreenNft_isLocale(locale)) ScreenNft_notFound();
    return <M_components_VerificationPage_VerificationPage locale={locale} />;
  }
}
export type MiniAppRouteProps = {
  params: Promise<{
    locale: string;
    screen?: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
function resolveScreen(screen: string[] = []) {
  const key = miniAppScreenName(screen);
  switch (key) {
    case "[category]":
      return {
        Page: ScreenCategory.Page,
        metadata: ScreenCategory.generateMetadata,
      };
    case "account":
      return {
        Page: ScreenProfile.Page,
        metadata: async () => ScreenProfile.metadata,
      };
    case "cart":
      return {
        Page: ScreenCart.Page,
        metadata: async () => ScreenCart.metadata,
      };
    case "gifts":
      return {Page: ScreenLegacyGifts.Page, metadata: undefined};
    case "history":
      return {
        Page: ScreenHistory.Page,
        metadata: async () => ScreenHistory.metadata,
      };
    case "info/[document]":
      return {Page: ScreenLegacyDocument.Page, metadata: undefined};
    case "info":
      return {Page: ScreenLegacyInfo.Page, metadata: undefined};
    case "login":
      return {
        Page: ScreenLogin.Page,
        metadata: async () => ScreenLogin.metadata,
      };
    case "modules/[module]":
      return {
        Page: ScreenModule.Page,
        metadata: ScreenModule.generateMetadata,
      };
    case "modules":
      return {Page: ScreenModules.Page, metadata: undefined};
    case "nft-gifts":
      return {Page: ScreenNft.Page, metadata: ScreenNft.generateMetadata};
    case "":
      return {Page: ScreenHome.Page, metadata: ScreenHome.generateMetadata};
    case "smm":
      return {Page: ScreenSmm.Page, metadata: ScreenSmm.generateMetadata};
    case "steam-accounts":
      return {Page: ScreenSteam.Page, metadata: ScreenSteam.generateMetadata};
    case "telegram-accounts/[country]":
      return {
        Page: ScreenTelegramCountry.Page,
        metadata: ScreenTelegramCountry.generateMetadata,
      };
    case "tour":
      return {Page: ScreenLegacyTour.Page, metadata: undefined};
    case "verifications":
      return {
        Page: ScreenVerifications.Page,
        metadata: ScreenVerifications.generateMetadata,
      };
    default:
      return undefined;
  }
}
export function miniAppRouteKey(screen: string[] = []) {
  return Boolean(resolveScreen(screen));
}
async function screenProps(props: MiniAppRouteProps) {
  const {locale, screen = []} = await props.params;
  return {
    params: Promise.resolve({
      locale,
      category: screen[0] || "",
      module: screen[1] || "",
      document: screen[1] || "",
      country: screen[1] || "",
    }),
    searchParams: props.searchParams,
  };
}
export async function MiniAppScreen(props: MiniAppRouteProps) {
  const route = resolveScreen((await props.params).screen);
  if (!route) return ScreenNft_notFound();
  const Page = route.Page;
  return (await Page(await screenProps(props))) ?? null;
}
export async function miniAppScreenMetadata(props: MiniAppRouteProps) {
  const route = resolveScreen((await props.params).screen);
  if (!route) return ScreenNft_notFound();
  return route?.metadata ? route.metadata(await screenProps(props)) : {};
}
