import { M_components_Flag_Flag as Flag } from "../../../../ui.tsx";
import Link from "next/link";
import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../../shared.tsx";
import { M_lib_countries_isCountry as isCountry, M_lib_countries_countryName as countryName } from "../../../../shared.tsx";
import { M_lib_telegram_market_listTelegram as listTelegram, M_lib_telegram_market_parseFilters as parseFilters, type M_lib_telegram_market_TelegramPage as TelegramPage } from "../../../../server.tsx";
import { M_lib_lzt_http_MarketError as MarketError } from "../../../../server.tsx";
import { M_components_TelegramFilters_TelegramFilters as TelegramFilters } from "../../../../views.tsx";
import { M_components_TelegramCard_TelegramCard as TelegramCard } from "../../../../views.tsx";
import { M_lib_store_copy_shopCopy as shopCopy } from "../../../../shared.tsx";
export const dynamic = "force-dynamic";
type Props = {
    params: Promise<{
        locale: string;
        country: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props) {
    const { locale, country } = await params;
    if (!isLocale(locale) || !isCountry(country))
        notFound();
    return {
        title: `Telegram · ${countryName(country, locale)}`,
        alternates: {
            canonical: `/${locale}/telegram-accounts/${country}`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/telegram-accounts/${country}`])),
        },
    };
}
export default async function Page({ params, searchParams }: Props) {
    const { locale, country } = await params;
    if (!isLocale(locale) || !isCountry(country))
        notFound();
    const t = shopCopy[locale];
    const filters = parseFilters(await searchParams);
    let result: TelegramPage | undefined;
    let error: string | undefined;
    try {
        result = await listTelegram(country, filters);
    }
    catch (e) {
        error =
            e instanceof MarketError && e.code === "not_configured"
                ? t.notConfigured
                : t.unavailable;
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
        if (filters.min)
            q.set("min", filters.min);
        if (filters.max)
            q.set("max", filters.max);
        return `/${locale}/telegram-accounts/${country}?${q}`;
    };
    return (<>
      <Link href={`/${locale}/telegram-accounts`} className="text-sm text-violet-300">
        ← {t.allCountries}
      </Link>
      <div className="mb-7 mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="country-heading flex items-center gap-3 text-3xl font-semibold">
          <Flag country={country}/> {countryName(country, locale)} · Telegram
        </h1>
        <a href={`https://t.me/LegitAssetsBot?startapp=${locale}_tg_${country}`} className="country-deep-link text-sm text-violet-300">
          {t.countryDeep} ↗
        </a>
      </div>
      <TelegramFilters key={JSON.stringify(filters)} locale={locale} country={country} filters={filters}/>
      {error ? (<div role="alert" className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-amber-200">
          {error}
          <Link href={href(filters.page)} className="ml-3 underline">
            {t.retry}
          </Link>
        </div>) : (<>
          <p className="mb-5 text-xs text-slate-400">{t.fxNote}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result?.items.map((item) => (<TelegramCard key={item.id} item={item} locale={locale}/>))}
          </div>
          {!result?.items.length && (<p className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">
              {t.empty}
            </p>)}
          <div className="mt-7 flex items-center justify-between gap-3 text-sm">
            {filters.page > 1 ? (<Link href={href(filters.page - 1)} className="text-violet-300">
                ← {t.previous}
              </Link>) : (<span />)}
            <span className="text-slate-400">
              {t.page} {filters.page}
            </span>
            {result?.hasNext && filters.page < 100 ? (<Link href={href(filters.page + 1)} className="text-violet-300">
                {t.next} →
              </Link>) : (<span />)}
          </div>
          <p className="mt-5 text-xs text-slate-500">{t.listed}</p>
        </>)}
    </>);
}
