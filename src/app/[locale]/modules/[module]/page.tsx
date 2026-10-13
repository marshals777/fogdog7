import { notFound as notFound } from "next/navigation";
import { M_components_Tour_Tour as Tour } from "../../../../ui.tsx";
import { M_components_InfoModule__default as InfoPage } from "../../../../views.tsx";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../../shared.tsx";
import { M_lib_telegram_links_modules as modules } from "../../../../shared.tsx";
import { M_lib_store_copy_shopCopy as shopCopy } from "../../../../shared.tsx";
import content from "@/data/tour.json";
export async function generateMetadata({ params, }: {
    params: Promise<{
        locale: string;
        module: string;
    }>;
}) {
    const { locale, module } = await params;
    if (!isLocale(locale) || !modules.some((m) => m === module))
        notFound();
    return {
        title: module === "tour"
            ? content[locale].title
            : shopCopy[locale][(module === "rules" ? "tos" : module) as "tos" | "about" | "payment" | "privacy"],
        alternates: {
            canonical: `/${locale}/modules/${module}`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/modules/${module}`])),
        },
    };
}
export default async function ModulePage({ params, }: {
    params: Promise<{
        locale: string;
        module: string;
    }>;
}) {
    const { locale, module } = await params;
    if (!isLocale(locale) || !modules.some((m) => m === module))
        notFound();
    if (module === "tour")
        return <Tour locale={locale}/>;
    return (<InfoPage params={Promise.resolve({
            locale,
            document: module === "rules" ? "tos" : module,
        })}/>);
}
