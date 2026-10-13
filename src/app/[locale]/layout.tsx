import type { Metadata as Metadata, Viewport as Viewport } from "next";
import { notFound as notFound } from "next/navigation";
import { M_lib_store_products_storeCategories as storeCategories } from "../../server.tsx";
import { M_lib_i18n_categories as categories } from "../../shared.tsx";
import { M_components_WalletProvider_WalletProvider as WalletProvider } from "../../ui.tsx";
import { M_components_ShopProvider_ShopProvider as ShopProvider } from "../../ui.tsx";
import { M_components_AppShell_AppShell as AppShell } from "../../ui.tsx";
import { M_lib_i18n_isLocale as isLocale, M_lib_i18n_locales as locales } from "../../shared.tsx";
import "../globals.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: "Legit Assets", template: "%s · Legit Assets" },
    // Enable indexing only once catalog, legal pages and live stock are ready.
    robots: { index: false, follow: false },
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0b0f19",
};
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
export default async function RootLayout({ children, modal, params, }: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    let extraCategories: {
        slug: string;
        title: string;
    }[] = [];
    if (process.env.DATABASE_URL)
        try {
            extraCategories = (await storeCategories(locale))
                .filter((c) => !categories.some((d) => d.slug === c.slug))
                .map((c) => ({
                slug: c.slug,
                title: c.translations[0]?.title ?? c.slug,
            }));
        }
        catch { }
    return (<html lang={locale}>
      <body>
        <WalletProvider locale={locale}><ShopProvider locale={locale}>
          <AppShell locale={locale} extraCategories={extraCategories}>
            {children}{modal}
          </AppShell>
        </ShopProvider></WalletProvider>
      </body>
    </html>);
}
