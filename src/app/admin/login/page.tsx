import { redirect as redirect } from "next/navigation";
import { M_lib_admin_auth_currentAdmin as currentAdmin } from "../../../server.tsx";
import { M_components_AdminLogin_AdminLogin as AdminLogin } from "../../../ui.tsx";
export const dynamic = "force-dynamic";
export default async function Page() {
    if (await currentAdmin())
        redirect("/admin");
    return <AdminLogin />;
}
