import { redirect as redirect, notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale } from "../../../shared.tsx";
export default async function Page({ params, }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    redirect(`/${locale}/modules/tour`);
}
