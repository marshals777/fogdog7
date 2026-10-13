import { M_lib_db_db as db } from "../../../server.tsx";
import { M_components_StoreCatalog_StoreCatalog as StoreCatalog } from "../../../views.tsx";
import { notFound as notFound } from "next/navigation";
import { M_components_CatalogPage_CatalogPage as CatalogPage } from "../../../views.tsx";
import { M_lib_i18n_categories as categories, M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../shared.tsx";
export const dynamic = "force-dynamic";
type Props = {
    params: Promise<{
        locale: string;
        category: string;
    }>;
};
export function generateStaticParams() {
    return locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })));
}
export async function generateMetadata({ params }: Props) {
    const { locale, category } = await params;
    const c = categories.find((c) => c.slug === category);
    if (!isLocale(locale))
        notFound();
    const custom = !c
        ? await db.category.findUnique({
            where: { slug: category },
            include: { translations: true },
        })
        : null;
    if (!c && !custom?.active)
        notFound();
    return {
        title: c?.title[locale] ??
            custom?.translations.find((t) => t.locale === locale)?.title ??
            category,
        alternates: {
            canonical: `/${locale}/${category}`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${category}`])),
        },
    };
}
export default async function Page({ params }: Props) {
    const { locale, category } = await params;
    if (!isLocale(locale))
        notFound();
    if (!categories.some((c) => c.slug === category))
        return <StoreCatalog locale={locale} slug={category}/>;
    return <CatalogPage locale={locale} category={category}/>;
}
