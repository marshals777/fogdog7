import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../../shared.tsx";
import { M_lib_verification_copy_verificationCopy as verificationCopy } from "../../../shared.tsx";
import { M_components_VerificationPage_VerificationPage as VerificationPage } from "../../../views.tsx";
export const dynamic = "force-dynamic";
type Props = {
    params: Promise<{
        locale: string;
    }>;
};
export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const t = verificationCopy[locale];
    return {
        title: t.title,
        description: t.intro,
        alternates: {
            canonical: `/${locale}/verifications`,
            languages: Object.fromEntries(locales.map((l) => [l, `/${l}/verifications`])),
        },
    };
}
export default async function Page({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    return <VerificationPage locale={locale}/>;
}
