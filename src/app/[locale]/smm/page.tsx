import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../shared.tsx";
import { M_lib_smm_definitions_smmCopy as smmCopy } from "../../../shared.tsx";
import { M_lib_smm_catalog_smmCatalogPage as smmCatalogPage } from "../../../server.tsx";
import { M_components_SmmCatalogBrowser_SmmCatalogBrowser as SmmCatalogBrowser } from "../../../ui.tsx";
import type { M_lib_smm_catalog_SmmFilters as SmmFilters } from "../../../server.tsx";
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
        title: "SMM",
        description: smmCopy[locale].intro,
        alternates: {
            canonical: `/${locale}/smm`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/smm`])),
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
    const value = (key: string) => typeof p[key] === "string" ? (p[key] as string) : "";
    const filters: SmmFilters = {
        q: value("q"),
        platform: value("platform"),
        category: value("category"),
        sort: value("sort"),
        supported: value("supported") === "1",
        refill: value("refill") === "1",
        page: Number(value("page")) || 1,
    };
    const t = smmCopy[locale];
    const data = await smmCatalogPage(filters);
    return (<>
      <section className="smm-header">
        <p className="eyebrow">LEGIT / SOCIAL</p>
        <h1>{locale === "uk" ? "SMM-послуги" : locale === "ru" ? "SMM-услуги" : "SMM services"}</h1>
        <p>{t.intro}</p>
      </section>
      <SmmCatalogBrowser locale={locale} initial={data} initialFilters={filters}/>
    </>);
}
