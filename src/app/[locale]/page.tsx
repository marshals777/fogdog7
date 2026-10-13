import { notFound as notFound } from "next/navigation";
import { M_components_HomePage_HomePage as HomePage } from "../../views.tsx";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_copy as copy, M_lib_i18n_locales as locales } from "../../shared.tsx";
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
        title: copy[locale].catalog,
        description: copy[locale].intro,
        alternates: {
            canonical: `/${locale}`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
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
    return <HomePage locale={locale}/>;
}
