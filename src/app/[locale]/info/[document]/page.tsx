import { redirect as redirect, notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale } from "../../../../shared.tsx";
export default async function Page({ params, }: {
    params: Promise<{
        locale: string;
        document: string;
    }>;
}) {
    const { locale, document } = await params;
    if (!isLocale(locale) ||
        !["about", "payment", "tos", "privacy"].includes(document))
        notFound();
    redirect(`/${locale}/modules/${document === "tos" ? "rules" : document}`);
}
