import { M_lib_commerce_market_marketItem as marketItem } from "../../../../server.tsx";
import { M_lib_i18n_isLocale as isLocale } from "../../../../shared.tsx";
import { notFound as notFound } from "next/navigation";
import { M_components_BuyButton_BuyButton as BuyButton } from "../../../../ui.tsx";
import { M_components_Price_Price as Price } from "../../../../ui.tsx";
import { M_lib_app_copy_appCopy as appCopy } from "../../../../shared.tsx";
export const dynamic = "force-dynamic";
export default async function Page({ params }: {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}) {
    const { locale, id } = await params;
    if (!isLocale(locale))
        notFound();
    let item;
    try {
        item = await marketItem(id);
    }
    catch {
        notFound();
    }
    return <section className="shop-panel"><span className="blue-eyebrow">#{item.id}</span><h1 className="shop-title">{item.title}</h1><Price locale={locale} price={item.prices}/><p className="shop-muted">{appCopy[locale].botNote}</p><BuyButton item={{ kind: "market", id: item.id, title: item.title, quantity: 1 }}/></section>;
}
