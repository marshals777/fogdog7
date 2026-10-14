import { redirect as redirect } from "next/navigation";
import { M_lib_admin_auth_currentAdmin as currentAdmin } from "../../../server.tsx";
import { M_components_CommerceAdmin_CommerceAdmin as CommerceAdmin } from "../../../ui.tsx";
import { M_lib_i18n_isLocale as isLocale } from "../../../shared.tsx";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        locale?: string;
    }>;
}) {
    const admin = await currentAdmin();
    if (!admin)
        redirect("/admin/login");
    const requested = (await searchParams).locale;
    return <CommerceAdmin locale={requested && isLocale(requested) ? requested : admin.locale}/>;
}
