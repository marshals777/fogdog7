import "../globals.css";
import { cookies as cookies } from "next/headers";
import { M_lib_i18n_isLocale as isLocale } from "../../shared.tsx";
import type { Metadata as Metadata } from "next";
export const metadata: Metadata = {
    title: "Адмін-панель · Legit Assets",
    robots: { index: false, follow: false },
};
export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const language = (await cookies()).get("legit-language")?.value;
    return (<html lang={language && isLocale(language) ? language : "uk"}>
      <body>{children}</body>
    </html>);
}
