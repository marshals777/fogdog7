import { notFound as notFound } from "next/navigation";
import { M_components_NftGiftsCatalog_NftGiftsCatalog as NftGiftsCatalog } from "../../../ui.tsx";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales, type M_lib_i18n_Locale as Locale } from "../../../shared.tsx";
import { M_lib_gifts_marketapp_fetchGiftsOnSale as fetchGiftsOnSale } from "../../../server.tsx";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params, }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const title = locale === "uk"
        ? "NFT Подарунки Telegram — Legit Assets"
        : locale === "ru"
            ? "NFT Подарки Telegram — Legit Assets"
            : "Telegram NFT Gifts — Legit Assets";
    const description = locale === "uk"
        ? "Купівля колекційних Telegram NFT подарунків за GRAM через MarketApp API."
        : locale === "ru"
            ? "Покупка коллекционных Telegram NFT подарков за GRAM через MarketApp API."
            : "Buy collectible Telegram NFT gifts with GRAM via MarketApp API.";
    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}/nft-gifts`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/nft-gifts`])),
        },
    };
}
export default async function Page({ params, }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const data = await fetchGiftsOnSale({ limit: 30 });
    return (<NftGiftsCatalog locale={locale as Locale} initialGifts={data.items} tonRate={data.tonRate} liveApi={data.liveApi} binance={data.binance}/>);
}
