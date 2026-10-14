import { M_lib_i18n_isLocale as isLocale } from "../../shared.tsx";
import { redirect as redirect } from "next/navigation";
import { M_lib_admin_auth_currentAdmin as currentAdmin } from "../../server.tsx";
import { M_lib_admin_products_adminProducts as adminProducts } from "../../server.tsx";
import { M_lib_db_db as db } from "../../server.tsx";
import { M_components_AdminPanel_AdminPanel as AdminPanel } from "../../ui.tsx";
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
    const locale = requested && isLocale(requested) ? requested : admin.locale;
    const [products, logos, audit] = await Promise.all([
        adminProducts(),
        db.brandAsset.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                color: true,
                group: true,
            },
        }),
        db.adminAuditLog.findMany({
            take: 50,
            orderBy: { createdAt: "desc" },
            select: { id: true, action: true, entityId: true, createdAt: true },
        }),
    ]);
    return (<AdminPanel locale={locale} initialProducts={products} logos={logos} email={admin.email ?? "ADMIN"} audit={audit.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}/>);
}
