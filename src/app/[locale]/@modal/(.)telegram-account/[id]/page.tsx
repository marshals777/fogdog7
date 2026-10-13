import DetailPage from "@/app/[locale]/telegram-account/[id]/page";
import { M_components_RouteSheet_RouteSheet as RouteSheet } from "../../../../../ui.tsx";
import { M_lib_i18n_isLocale as isLocale } from "../../../../../shared.tsx";
import { notFound as notFound } from "next/navigation";
export default async function Page({ params }: {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    return <RouteSheet locale={locale}><DetailPage params={params}/></RouteSheet>;
}
