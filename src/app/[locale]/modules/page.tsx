import Link from "next/link";
import { notFound as notFound } from "next/navigation";
import { M_lib_i18n_isLocale as isLocale } from "../../../shared.tsx";
import { M_lib_app_copy_appCopy as appCopy } from "../../../shared.tsx";
import { M_lib_store_copy_shopCopy as shopCopy } from "../../../shared.tsx";
import { ShieldCheck as ShieldCheck, ArrowUpRight as ArrowUpRight } from "lucide-react";
export default async function Page({ params }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const t = appCopy[locale], s = shopCopy[locale];
    return <section className="modules-blue"><span className="blue-eyebrow">LEGIT / TRUST</span><h1>{t.guarantees}</h1><p>{t.guaranteesText}</p><div className="module-card-grid">{[{ slug: "tour", title: t.tour }, { slug: "about", title: s.about }, { slug: "rules", title: s.rules }, { slug: "payment", title: s.payment }, { slug: "privacy", title: s.privacy }].map(item => <Link key={item.slug} className="glass-module-card" href={`/${locale}/modules/${item.slug}`}><ShieldCheck size={25}/><h2>{item.title}</h2><ArrowUpRight size={20}/></Link>)}</div><a className="primary-button" href="https://t.me/LegitAssetsBot">{t.support} ↗</a></section>;
}
