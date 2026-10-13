import { M_components_BuyButton_BuyButton as BuyButton } from "../../../../ui.tsx";
import { M_components_Flag_Flag as Flag } from "../../../../ui.tsx";
import Link from "next/link";
import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale } from "../../../../shared.tsx";
import { M_lib_telegram_market_getTelegram as getTelegram } from "../../../../server.tsx";
import { M_lib_lzt_http_MarketError as MarketError } from "../../../../server.tsx";
import { M_lib_countries_countryName as countryName } from "../../../../shared.tsx";
import { M_lib_store_copy_shopCopy as shopCopy } from "../../../../shared.tsx";
import { M_components_Price_Price as Price } from "../../../../ui.tsx";
export const dynamic = "force-dynamic";
export default async function Page({ params, }: {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}) {
    const { locale, id } = await params;
    if (!isLocale(locale) || !/^[1-9][0-9]{0,11}$/.test(id))
        notFound();
    const t = shopCopy[locale];
    let item;
    let failed = false;
    try {
        item = await getTelegram(id);
    }
    catch (e) {
        if (e instanceof MarketError && e.code === "not_found")
            notFound();
        failed = true;
    }
    if (failed)
        return (<p role="alert" className="rounded-xl border border-amber-400/20 p-6 text-amber-200">
        {t.unavailable}
      </p>);
    if (!item)
        notFound();
    const yes = (v: boolean | null) => v === null ? t.unknown : v ? t.yes : t.no;
    return (<section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-7">
      <Link href={`/${locale}/telegram-accounts/${item.country}`} className="text-sm text-violet-300">
        ← {countryName(item.country, locale)}
      </Link>
      <h1 className="country-heading my-7 flex items-center gap-3 text-3xl font-semibold">
        <Flag country={item.country}/> Telegram ·{" "}
        {countryName(item.country, locale)}
      </h1>
      <p className="mb-5 text-sm text-slate-500">#{item.id}</p>
      <Price price={item.prices} locale={locale}/>
      <dl className="my-7 grid grid-cols-2 gap-4 text-sm">
        {[
            [
                t.spam,
                item.spam === "none"
                    ? t.noSpam
                    : item.spam === "blocked"
                        ? t.hasSpam
                        : t.unknown,
            ],
            [t.premium, yes(item.premium)],
            [t.password, yes(item.password)],
            [t.contacts, item.contacts],
            [t.channels, item.channels],
            [t.chats, item.chats],
            [t.dc, item.dc ?? t.unknown],
        ].map(([label, value]) => (<div key={label} className="rounded-xl bg-white/5 p-4">
            <dt className="text-slate-400">{label}</dt>
            <dd className="mt-2 font-medium">{value}</dd>
          </div>))}
      </dl>
      <p className="text-xs text-slate-500">
        {t.fxNote} {t.listed}
      </p>
      <p className="mt-7 rounded-xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm text-violet-200">
        <BuyButton item={{
            kind: "market",
            id: item.id,
            title: `Telegram · ${countryName(item.country, locale)}`,
            quantity: 1,
        }}/>
      </p>
    </section>);
}
