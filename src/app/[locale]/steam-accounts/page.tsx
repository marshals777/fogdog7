import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../shared.tsx";
import { M_components_SteamCatalog_SteamCatalog as SteamCatalog } from "../../../views.tsx";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params, }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    return {
        title: locale === "en" ? "Steam accounts" : "Steam-акаунти",
        alternates: {
            canonical: `/${locale}/steam-accounts`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/steam-accounts`])),
        },
    };
}
export default async function Page({ params, searchParams, }: {
    params: Promise<{
        locale: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const p = await searchParams;
    return (<SteamCatalog locale={locale} query={Object.fromEntries(Object.entries(p).filter((e): e is [
            string,
            string
        ] => typeof e[1] === "string"))}/>);
}
