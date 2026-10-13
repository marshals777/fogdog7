"use client";
import { usePathname as usePathname } from "next/navigation";
import { M_lib_app_copy_appCopy as appCopy } from "../../shared.tsx";
import { M_lib_i18n_isLocale as isLocale } from "../../shared.tsx";
export default function Loading() {
    const raw = usePathname().split("/")[1];
    const locale = isLocale(raw) ? raw : "uk";
    return (<div aria-busy="true" aria-label={appCopy[locale].loading} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (<div key={i} className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5"/>))}
    </div>);
}
