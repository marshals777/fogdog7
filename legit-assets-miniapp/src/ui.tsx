"use client";
import {formatStoredMoney} from "./shared.tsx";
import {TEMPORARY_DATA_TTL_MS, readTemporaryPreference, writeTemporaryPreference} from "./shared.tsx";
import {useTransition} from "react";
import {customerRequest, validNftBrowseState, nftHistoryStatus, formatGramNano} from "./shared.tsx";
import {useEffect as M_components_FirstRun_i0} from "react";
import {useRef as M_components_FirstRun_i1} from "react";
import {useState as M_components_Tour_i1} from "react";
import {useRouter as M_components_FirstRun_i4} from "next/navigation";
import {M_lib_app_copy_appCopy as M_components_AppShell_i20} from "./shared.tsx";
import type {M_lib_i18n_Locale as M_components_Price_i1} from "./shared.tsx";
import {useCallback as M_hooks_useCloudStorage_i0} from "react";
import {createContext as M_components_ShopProvider_i0} from "react";
import {useContext as M_components_ShopProvider_i1} from "react";
import {motion as M_components_Tour_i3} from "framer-motion";
import {usePathname as M_components_FirstRun_i3} from "next/navigation";
import {M_lib_i18n_locales as M_components_LanguageSwitcher_i4} from "./shared.tsx";
import {M_lib_locale_preference_saveLocale as M_components_FirstRun_i15} from "./shared.tsx";
import {M_lib_admin_copy_adminText as M_components_AdminPanel_i0} from "./shared.tsx";
import M_components_Tour_i0 from "next/link";
import {Layers3 as M_components_AdminPanel_i5} from "lucide-react";
import {Plus as M_components_AdminPanel_i6} from "lucide-react";
import {Search as M_components_Catalog_i2} from "lucide-react";
import {Image as M_components_AdminPanel_i8} from "lucide-react";
import {Pencil as M_components_AdminPanel_i9} from "lucide-react";
import {Check as M_components_Tour_i7} from "lucide-react";
import {LogOut as M_components_AdminPanel_i11} from "lucide-react";
import {ShieldCheck as M_components_Tour_i11} from "lucide-react";
import {ArrowUpRight as M_components_AdminPanel_i13} from "lucide-react";
import {Save as M_components_AdminPanel_i14} from "lucide-react";
import {memo as M_components_ProductCard_i5} from "react";
import type {AnimationItem as M_components_AnimatedGiftEmoji_i4} from "lottie-web";
import {useReducedMotion as M_components_Tour_i4} from "framer-motion";
import {Store as M_components_FirstRun_i7} from "lucide-react";
import {Gift as M_components_FirstRun_i8} from "lucide-react";
import {Wallet as M_components_Tour_i9} from "lucide-react";
import {History as M_components_FirstRun_i10} from "lucide-react";
import {ArrowRight as M_components_Tour_i6} from "lucide-react";
import {ArrowLeft as M_components_Tour_i5} from "lucide-react";
import {Globe as M_components_FirstRun_i13} from "lucide-react";
import M_components_DesktopPreview_i2 from "qrcode";
import {Send as M_components_Tour_i12} from "lucide-react";
import {AnimatePresence as M_components_Tour_i2} from "framer-motion";
import {ShoppingBag as M_components_Tour_i8} from "lucide-react";
import M_components_AppShell_i0 from "next/dynamic";
import M_components_AppShell_i1 from "next/script";
import {M_lib_navigation_primaryTabs as M_components_AppShell_i9} from "./shared.tsx";
import {M_lib_navigation_activePrimaryTab as M_components_AppShell_i10} from "./shared.tsx";
import {UserRound as M_components_AppShell_i12} from "lucide-react";
import {M_lib_countries_isCountry as M_components_AppShell_i16} from "./shared.tsx";
import {M_lib_locale_preference_savedLocale as M_components_AppShell_i17} from "./shared.tsx";
import {M_lib_locale_preference_telegramLocale as M_components_AppShell_i18} from "./shared.tsx";
import {X as M_components_BottomSheet_i4} from "lucide-react";
import {M_lib_shop_copy_commerceCopy as M_components_BuyButton_i2} from "./shared.tsx";
import type {M_lib_money_RetailPrice as M_components_Price_i0} from "./shared.tsx";
import {Package as M_components_ProductCard_i4} from "lucide-react";
import {M_lib_i18n_copy as M_components_Catalog_i5} from "./shared.tsx";
import {SlidersHorizontal as M_components_Catalog_i3} from "lucide-react";
import {M_lib_i18n_categories as M_components_Catalog_i4} from "./shared.tsx";
import type {M_lib_catalog_PricedCatalogItem as M_components_Catalog_i7} from "./server.tsx";
import {M_lib_shop_copy_shopStatus as M_components_CommerceAdmin_i0} from "./shared.tsx";
import {PackageCheck as M_components_Tour_i10} from "lucide-react";
import {Users as M_components_CommerceAdmin_i10} from "lucide-react";
import {TriangleAlert as M_components_CommerceAdmin_i11} from "lucide-react";
import {RefreshCw as M_components_CommerceAdmin_i12} from "lucide-react";
import {Upload as M_components_CommerceAdmin_i14} from "lucide-react";
import {useMemo as M_components_CountryGrid_i0} from "react";
import {M_lib_countries_countries as M_components_CountryGrid_i5} from "./shared.tsx";
import {M_lib_countries_countryName as M_components_CountryGrid_i6} from "./shared.tsx";
import {M_lib_store_copy_shopCopy as M_components_CountryGrid_i7} from "./shared.tsx";
import {Camera as M_components_ProfilePhoto_i3} from "lucide-react";
import {M_lib_telegram_links_telegramLinks as M_components_CustomerAccount_i1} from "./shared.tsx";
import {Download as M_components_CustomerAccount_i8} from "lucide-react";
import {M_lib_navigation_primaryNavigation as M_components_CustomerAccount_i10} from "./shared.tsx";
import {M_lib_shop_copy_shopError as M_components_ShoppingCart_i13} from "./shared.tsx";
import type {M_lib_gifts_marketapp_NormalizedGift as M_components_GiftHistory_i4} from "./server.tsx";
import {useTonConnectUI as M_components_NftCheckout_i3} from "@tonconnect/ui-react";
import {useTonWallet as M_components_NftCheckout_i4} from "@tonconnect/ui-react";
import {Address as M_components_NftCheckout_i5} from "@ton/core";
import type {M_lib_nft_NftTransaction as M_components_NftCheckout_i8} from "./server.tsx";
import {useSearchParams as M_components_ShoppingCart_i1} from "next/navigation";
import {M_lib_gifts_labels_rarityLabel as M_components_NftGiftsCatalog_i1} from "./shared.tsx";
import {useDeferredValue as M_components_NftGiftsCatalog_i4} from "react";
import {Heart as M_components_NftGiftsCatalog_i9} from "lucide-react";
import type {M_lib_gifts_marketapp_BinanceOnlinePrices as M_components_NftGiftsCatalog_i17} from "./server.tsx";
import {Trash2 as M_components_ShoppingCart_i8} from "lucide-react";
import {Link as M_components_SmmConfigurator_i6} from "lucide-react";
import {LoaderCircle as M_components_SmmConfigurator_i7} from "lucide-react";
import {M_lib_smm_definitions_definition as M_components_SmmConfigurator_i8} from "./shared.tsx";
import {M_lib_smm_definitions_smmCopy as M_components_SmmConfigurator_i9} from "./shared.tsx";
import {M_lib_smm_rules_normalizeTarget as M_components_SmmConfigurator_i10} from "./shared.tsx";
import {M_lib_money_scaleMinorPreview as M_components_SmmConfigurator_i12} from "./shared.tsx";
import type {M_lib_smm_catalog_PublicSmmService as M_components_SmmConfigurator_i14} from "./server.tsx";
import {ArrowDownUp as M_components_SmmCatalogBrowser_i4} from "lucide-react";
import {ChevronLeft as M_components_SmmCatalogBrowser_i6} from "lucide-react";
import {ChevronRight as M_components_SmmCatalogBrowser_i7} from "lucide-react";
import {Sparkles as M_components_SmmCatalogBrowser_i9} from "lucide-react";
import {M_lib_smm_metadata_platformLabels as M_components_SmmCatalogBrowser_i12} from "./shared.tsx";
import type {M_lib_smm_catalog_SmmCatalogPage as M_components_SmmCatalogBrowser_i13} from "./server.tsx";
import type {M_lib_smm_catalog_SmmFilters as M_components_SmmCatalogBrowser_i14} from "./server.tsx";
import __data_M_components_Tour_i13 from "@/data.json";
import type {CSSProperties as M_components_VerificationCatalog_i2} from "react";
import {Diamond as M_components_VerificationCatalog_i8} from "lucide-react";
import {Bot as M_components_VerificationCatalog_i9} from "lucide-react";
import {M_lib_verification_copy_verificationBrands as M_components_VerificationCatalog_i10} from "./shared.tsx";
import {M_lib_verification_copy_verificationCopy as M_components_VerificationCatalog_i11} from "./shared.tsx";
import type {M_lib_verification_copy_VerificationGroup as M_components_VerificationCatalog_i12} from "./shared.tsx";
import type {M_lib_catalog_CatalogItem as M_components_VerificationCatalog_i14} from "./server.tsx";
import {TonConnectUIProvider as M_components_WalletConnect_i0} from "@tonconnect/ui-react";
import {useTonAddress as M_components_WalletConnect_i1} from "@tonconnect/ui-react";
const M_components_Tour_i13 = __data_M_components_Tour_i13["tour"];
declare global {
  interface Window {
    Telegram?: {
      WebApp?: M_hooks_useTelegramWebApp.TelegramWebApp;
    };
  }
}
const journeyCopy = {
  uk: {
    offline: "Немає інтернету. Кошик і обрані збережені локально; перевір зв’язок перед оплатою.",
    discover: "До магазину",
    emptyFavorites: "Тут будуть твої обрані подарунки",
    favoriteHint: "Натисни сердечко на картці, щоб зберегти подарунок і повернутися до нього.",
    showAll: "Показати всі подарунки",
    clearSearch: "Очистити пошук",
    loading: "Завантажуємо історію…",
    emptyHistory: "Твої покупки з’являться тут",
    historyHint: "Після замовлення тут можна перевірити статус і отримати товар.",
  },
  ru: {
    offline: "Нет интернета. Корзина и избранное сохранены локально; проверь связь перед оплатой.",
    discover: "В магазин",
    emptyFavorites: "Здесь будут избранные подарки",
    favoriteHint: "Нажми сердечко на карточке, чтобы сохранить подарок и вернуться к нему.",
    showAll: "Показать все подарки",
    clearSearch: "Очистить поиск",
    loading: "Загружаем историю…",
    emptyHistory: "Твои покупки появятся здесь",
    historyHint: "После заказа здесь можно проверить статус и получить товар.",
  },
  en: {
    offline: "You are offline. Cart and favorites stay on this device; check your connection before paying.",
    discover: "Back to shop",
    emptyFavorites: "Your favorite gifts will appear here",
    favoriteHint: "Tap a card’s heart to save a gift and return to it later.",
    showAll: "Show all gifts",
    clearSearch: "Clear search",
    loading: "Loading history…",
    emptyHistory: "Your purchases will appear here",
    historyHint: "After ordering, check the status and collect your item here.",
  },
};
// components/AdminDialog.tsx
namespace M_components_AdminDialog {
  export function AdminDialog({
    children,
    label,
    onClose,
    locked = false,
  }: {
    children: React.ReactNode;
    label: string;
    onClose: () => void;
    locked?: boolean;
  }) {
    const ref = M_components_FirstRun_i1<HTMLDialogElement>(null);
    M_components_FirstRun_i0(() => {
      const previous = document.activeElement as HTMLElement | null;
      const overflow = document.body.style.overflow;
      ref.current?.showModal();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
        previous?.focus();
      };
    }, []);
    return (
      <dialog
        ref={ref}
        className="admin-modal-dialog"
        aria-label={label}
        onCancel={(e) => {
          e.preventDefault();
          if (!locked) onClose();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !locked) onClose();
        }}
      >
        {children}
      </dialog>
    );
  }
}
// components/AdminLogin.tsx
namespace M_components_AdminLogin {
  export function AdminLogin({locale = "uk"}: {locale?: M_components_Price_i1}) {
    const [busy, setBusy] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1(""),
      router = M_components_FirstRun_i4(),
      t = M_components_AppShell_i20[locale];
    async function login() {
      if (busy) return;
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) {
        setError(t.forbidden);
        return;
      }
      setBusy(true);
      setError("");
      try {
        const r = await fetch("/api/admin/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({initData}),
          signal: AbortSignal.timeout(20000),
        });
        if (!r.ok) throw Error(t.forbidden);
        router.push(`/admin?locale=${locale}`);
      } catch {
        setError(t.forbidden);
      } finally {
        setBusy(false);
      }
    }
    return (
      <div className="admin-telegram-entry">
        <button className="secondary-button" disabled={busy} onClick={login}>
          {busy ? t.loading : t.adminEntry}
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  }
}
// hooks/useTelegramMock.ts
namespace M_hooks_useTelegramMock {
  export type TelegramEnvironment = {
    isTelegram: boolean;
    isMock: boolean;
    ready: boolean;
  };
  // UI detection only. This hook MUST NOT grant a session, roles or balance access.
  // Authenticate only after the server validates initData signature + auth_date.
  export function useTelegramMock(): TelegramEnvironment {
    const [state, setState] = M_components_Tour_i1<TelegramEnvironment>({
      isTelegram: false,
      isMock: false,
      ready: false,
    });
    M_components_FirstRun_i0(() => {
      const detect = () => {
        const app = window.Telegram?.WebApp;
        const isMock =
          process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_TELEGRAM_MOCK === "true" &&
          new URLSearchParams(location.search).get("mockTelegram") === "1";
        const isTelegram = Boolean(app?.initData) || Boolean(isMock);
        setState({isTelegram, isMock: Boolean(isMock), ready: true});
      };
      detect();
      // Script onReady handles slow SDK loads; no arbitrary timeout decides the channel.
      window.addEventListener("telegram-sdk-ready", detect);
      return () => window.removeEventListener("telegram-sdk-ready", detect);
    }, []);
    return state;
  }
}
// hooks/useTelegramWebApp.ts
namespace M_hooks_useTelegramWebApp {
  export interface TelegramButton {
    setText(text: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  }
  export interface TelegramWebApp {
    initData: string;
    initDataUnsafe?: {
      user?: {
        language_code?: string;
      };
    };
    openTelegramLink?(url: string): void;
    version?: string;
    colorScheme?: "dark" | "light";
    themeParams?: {
      bg_color?: string;
      text_color?: string;
      button_color?: string;
      secondary_bg_color?: string;
      hint_color?: string;
    };
    ready(): void;
    expand(): void;
    isVersionAtLeast?(version: string): boolean;
    enableClosingConfirmation?(): void;
    disableVerticalSwipes?(): void;
    setHeaderColor?(color: string): void;
    setBackgroundColor?(color: string): void;
    onEvent?(event: string, callback: () => void): void;
    offEvent?(event: string, callback: () => void): void;
    BackButton?: Pick<TelegramButton, "show" | "hide" | "onClick" | "offClick">;
    MainButton?: TelegramButton;
    HapticFeedback?: {
      selectionChanged(): void;
      impactOccurred(style: "light" | "medium" | "heavy"): void;
      notificationOccurred(type: "success" | "error" | "warning"): void;
    };
    CloudStorage?: {
      getItem(key: string, callback: (error: string | null, value?: string) => void): void;
      setItem(key: string, value: string, callback?: (error: string | null, success?: boolean) => void): void;
    };
  }
  export function supportsTelegram(app: TelegramWebApp | undefined, version: string) {
    return Boolean(app?.initData && app.isVersionAtLeast?.(version));
  }
  export function haptic(type: "selection" | "light" | "success" | "error") {
    const app = window.Telegram?.WebApp;
    if (!supportsTelegram(app, "6.1")) return;
    try {
      const feedback = app?.HapticFeedback;
      if (type === "selection") feedback?.selectionChanged();
      else if (type === "light") feedback?.impactOccurred("light");
      else feedback?.notificationOccurred(type);
    } catch {
      /* Optional native feedback must not interrupt an action. */
    }
  }
  // Initialize once in AppShell; UI detection never grants authentication.
  export function useTelegramWebApp() {
    const environment = M_hooks_useTelegramMock.useTelegramMock();
    const [app, setApp] = M_components_Tour_i1<TelegramWebApp>();
    M_components_FirstRun_i0(() => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.initData) return;
      setApp(tg);
      tg.ready();
      tg.expand();
      if (supportsTelegram(tg, "6.2")) tg.enableClosingConfirmation?.();
      if (supportsTelegram(tg, "7.7")) tg.disableVerticalSwipes?.();
      const syncTheme = () => {
        const colors = tg.themeParams ?? {};
        const root = document.documentElement;
        root.dataset.telegram = "true";
        root.dataset.theme = tg.colorScheme ?? "dark";
        root.style.colorScheme = tg.colorScheme ?? "dark";
        const defaults =
          tg.colorScheme === "light"
            ? {
                bg_color: "#ffffff",
                text_color: "#17212b",
                button_color: "#2481cc",
                secondary_bg_color: "#f2f4f7",
                hint_color: "#596579",
              }
            : {
                bg_color: "#0B0E14",
                text_color: "#f5f5fa",
                button_color: "#2A85FF",
                secondary_bg_color: "#111622",
                hint_color: "#a5b1c4",
              };
        for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
          root.style.setProperty(`--tg-theme-${key.replaceAll("_", "-")}`, colors[key] || defaults[key]);
        }
        if (supportsTelegram(tg, "6.1")) {
          tg.setHeaderColor?.(colors.bg_color || "#0b0f19");
          tg.setBackgroundColor?.(colors.bg_color || "#0b0f19");
        }
      };
      syncTheme();
      tg.onEvent?.("themeChanged", syncTheme);
      return () => {
        tg.offEvent?.("themeChanged", syncTheme);
      };
    }, [environment.isTelegram, environment.ready]);
    return {...environment, app};
  }
}
// hooks/useCloudStorage.ts
namespace M_hooks_useCloudStorage {
  function storageKey(key: string) {
    const raw = new URLSearchParams(window.Telegram?.WebApp?.initData ?? "").get("user");
    try { const id = JSON.parse(raw ?? "null")?.id; if (Number.isSafeInteger(id) && id > 0) return `${key}:tg:${id}`; } catch {}
    return `${key}:${raw ?? "web"}`;
  }
  // Cloud values are preferences only; the server must reprice and validate cart IDs.
  export function useCloudStorage<T>(key: string, initial: T, validate: (value: unknown) => T) {
    const [value, setValue] = M_components_Tour_i1(initial);
    const [loaded, setLoaded] = M_components_Tour_i1(false);
    const {isTelegram, ready} = M_hooks_useTelegramMock.useTelegramMock();
    const dirty = M_components_FirstRun_i1(false);
    const expiresAt = M_components_FirstRun_i1(Date.now() + TEMPORARY_DATA_TTL_MS);
    const empty = M_components_FirstRun_i1(initial);
    const current = M_components_FirstRun_i1(value);
    current.current = value;
    const update = M_hooks_useCloudStorage_i0((next: T | ((previous: T) => T)) => {
      dirty.current = true;
      expiresAt.current = Date.now() + TEMPORARY_DATA_TTL_MS;
      setValue(next);
    }, []);
    M_components_FirstRun_i0(() => {
      if (!ready) return;
      let active = true;
      const app = window.Telegram?.WebApp;
      const userId = new URLSearchParams(app?.initData ?? "").get("user") ?? "web";
      const localKey = storageKey(key);
      let hydrated = false;
      const restore = (raw?: string) => {
        if (!active || hydrated) return;
        hydrated = true;
        if (!dirty.current && raw) {
          try {
            const restored = readTemporaryPreference(raw);
            if (restored) {
              expiresAt.current = restored.expiresAt;
              setValue(validate(restored.value));
              dirty.current = restored.migrated;
            } else {
              setValue(empty.current);
              dirty.current = true; // Overwrite expired cloud/local payload with an empty value.
            }
          } catch { setValue(empty.current); dirty.current = true; }
        }
        try {
          const legacy = `${key}:${userId}`;
          if (legacy !== localKey) localStorage.removeItem(legacy);
          if (!app?.initData) localStorage.removeItem(key);
        } catch {}
        setLoaded(true);
      };
      let local: string | undefined;
      try {
        local = localStorage.getItem(localKey) ?? localStorage.getItem(`${key}:${userId}`) ?? (!app?.initData ? (localStorage.getItem(key) ?? undefined) : undefined);
      } catch {}
      if (M_hooks_useTelegramWebApp.supportsTelegram(app, "6.9") && app?.CloudStorage) {
        const timeout = setTimeout(() => restore(local), 2500);
        try {
          app.CloudStorage.getItem(key, (error, raw) => {
            clearTimeout(timeout);
            restore(!error && raw ? raw : local);
          });
        } catch {
          clearTimeout(timeout);
          restore(local);
        }
        return () => {
          active = false;
          clearTimeout(timeout);
        };
      }
      restore(local);
      return () => {
        active = false;
      };
    }, [key, validate, isTelegram, ready]);
    M_components_FirstRun_i0(() => {
      if (!loaded || !dirty.current) return;
      const app = window.Telegram?.WebApp;
      const localKey = storageKey(key);
      const saveLocal = () => { try { localStorage.setItem(localKey, writeTemporaryPreference(current.current, expiresAt.current)); } catch {} };
      const onHidden = () => { if (document.visibilityState === "hidden") saveLocal(); };
      window.addEventListener("pagehide", saveLocal);
      document.addEventListener("visibilitychange", onHidden);
      const timer = setTimeout(() => {
        const raw = writeTemporaryPreference(current.current, expiresAt.current);
        try {
          localStorage.setItem(localKey, raw);
        } catch {}
        if (raw.length <= 4096 && M_hooks_useTelegramWebApp.supportsTelegram(app, "6.9")) {
          try {
            app?.CloudStorage?.setItem(key, raw);
          } catch {}
        }
      }, 350);
      return () => { clearTimeout(timer); saveLocal(); window.removeEventListener("pagehide", saveLocal); document.removeEventListener("visibilitychange", onHidden); };
    }, [value, loaded, key]);
    M_components_FirstRun_i0(() => {
      if (!loaded) return;
      const check = () => {
        if (Date.now() >= expiresAt.current) {
          dirty.current = true;
          expiresAt.current = Date.now() + TEMPORARY_DATA_TTL_MS;
          setValue(empty.current);
        }
      };
      const timer = setTimeout(check, Math.max(0, expiresAt.current - Date.now()));
      document.addEventListener("visibilitychange", check);
      return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", check); };
    }, [loaded, value, key]);
    return [value, update, loaded] as const;
  }
}
// components/ShopProvider.tsx
namespace M_components_ShopProvider {
  export type CartEntry = {
    kind: "product" | "market" | "smm" | "gift";
    id: string;
    title: string;
    quantity: number;
    link?: string;
  };
  function validateCart(raw: unknown): CartEntry[] {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (e): e is CartEntry =>
          e &&
          ["product", "market", "smm", "gift"].includes(e.kind) &&
          typeof e.id === "string" &&
          e.id.length <= 128 &&
          typeof e.title === "string" &&
          e.title.length <= 256 &&
          (e.link === undefined || (typeof e.link === "string" && e.link.length <= 2048)) &&
          Number.isSafeInteger(e.quantity) &&
          e.quantity > 0 &&
          (e.kind !== "gift" || e.quantity === 1),
      )
      .slice(0, 20);
  }
  export type Customer = {
    id: string;
    email: string | null;
    displayName: string | null;
    telegramId?: string;
    channel: "WEB" | "TMA";
    isAdmin?: boolean;
    locale?: M_components_Price_i1;
    onboardingStartedAt?: string | null;
    onboardingCompletedAt?: string | null;
    hasAvatar?: boolean;
    avatarUpdatedAt?: string | null;
  };
  type ShopState = {
    cart: CartEntry[];
    user: Customer | null;
    wallets: {
      currency: string;
      balance: string;
    }[];
    botWallets:
      | {
          currency: string;
          balance: string;
        }[]
      | null;
    methods: Record<string, boolean>;
    ready: boolean;
    authError: string;
    retryAuth: () => void;
    add: (e: CartEntry) => void;
    remove: (index: number) => void;
    clear: () => void;
    replaceCart: (items: CartEntry[]) => void;
    refresh: () => Promise<void>;
    locale: M_components_Price_i1;
  };
  const Context = M_components_ShopProvider_i0<ShopState | null>(null);
  export function useOptionalShop() {
    return M_components_ShopProvider_i1(Context);
  }
  export function useShop() {
    const c = M_components_ShopProvider_i1(Context);
    if (!c) throw Error("ShopProvider missing");
    return c;
  }
  export function shopHeaders(): Record<string, string> {
    return typeof window !== "undefined" && window.Telegram?.WebApp?.initData ? {"X-Legit-Channel": "TMA"} : {};
  }
  export async function shopRequest(path: string, body?: object, signal?: AbortSignal) {
    try {
      return await customerRequest(path, body, signal, shopHeaders());
    } catch (error) {
      if (typeof window !== "undefined" && error instanceof Error && error.message === "unauthorized")
        window.dispatchEvent(new Event("shop-session-expired"));
      throw error;
    }
  }
  export function ShopProvider({children, locale}: {children: React.ReactNode; locale: M_components_Price_i1}) {
    const [cart, setCart] = M_hooks_useCloudStorage.useCloudStorage<CartEntry[]>("legit-assets-cart-v7", [], validateCart);
    const [user, setUser] = M_components_Tour_i1<Customer | null>(null),
      [wallets, setWallets] = M_components_Tour_i1<ShopState["wallets"]>([]),
      [botWallets, setBotWallets] = M_components_Tour_i1<ShopState["botWallets"]>(null),
      [methods, setMethods] = M_components_Tour_i1<Record<string, boolean>>({}),
      [ready, setReady] = M_components_Tour_i1(false);
    const {isTelegram, isMock} = M_hooks_useTelegramMock.useTelegramMock(),
      attempt = M_components_FirstRun_i1(false);
    const [authError, setAuthError] = M_components_Tour_i1("");
    const [authRetry, setAuthRetry] = M_components_Tour_i1(0);
    const refreshGeneration = M_components_FirstRun_i1(0);
    M_components_FirstRun_i0(() => {
      const expired = () => {
        setUser(null);
        setWallets([]);
        setBotWallets(null);
        setMethods({});
        setReady(true);
        setAuthError("unauthorized");
      };
      window.addEventListener("shop-session-expired", expired);
      return () => window.removeEventListener("shop-session-expired", expired);
    }, []);
    const refresh = M_hooks_useCloudStorage_i0(async () => {
      const epoch = ++refreshGeneration.current;
      const d = await shopRequest("/api/auth/me");
      if (epoch !== refreshGeneration.current) return;
      setUser(d.user);
      setWallets(d.wallets ?? []);
      setMethods(d.methods ?? {});
      setBotWallets(d.botWallets ?? null);
      setReady(true);
    }, []);
    M_components_FirstRun_i0(() => {
      void refresh().catch(() => setReady(true));
    }, [refresh]);
    M_components_FirstRun_i0(() => {
      const raw = window.Telegram?.WebApp?.initData;
      if (isTelegram && !isMock && raw && ready && !attempt.current) {
        // A matching, already verified TMA cookie can outlive initData's short login window.
        // This routing hint never creates a session or changes the authenticated identity.
        let sdkId = "";
        try {
          sdkId = String(JSON.parse(new URLSearchParams(raw).get("user") ?? "{}").id ?? "");
        } catch {}
        if (user?.channel === "TMA" && user.telegramId === sdkId) {
          attempt.current = true;
          return;
        }
        attempt.current = true;
        refreshGeneration.current++;
        setReady(false);
        setAuthError("");
        void shopRequest("/api/auth/telegram", {initData: raw})
          .then(refresh)
          .catch((error: Error) => {
            setAuthError(error.message);
            setUser(null);
            setWallets([]);
            setMethods({});
            setReady(true);
          });
      }
    }, [isTelegram, isMock, refresh, ready, user?.channel, user?.telegramId, authRetry]);
    const add = M_hooks_useCloudStorage_i0(
      (e: CartEntry) => {
        if (
          !validateCart([e]).length ||
          (cart.length >= 20 && !cart.some((v) => v.kind === e.kind && v.id === e.id && v.link === e.link))
        ) {
          M_hooks_useTelegramWebApp.haptic("error");
          return;
        }
        M_hooks_useTelegramWebApp.haptic("success");
        setCart((c) => {
          if (c.some((v) => v.kind === e.kind && v.id === e.id && v.link === e.link))
            return c.map((v) => (v.kind === e.kind && v.id === e.id && v.link === e.link ? e : v));
          return c.length < 20 ? [...c, e] : c;
        });
      },
      [cart, setCart],
    );
    return (
      <Context.Provider
        value={{
          cart,
          user,
          wallets,
          botWallets,
          methods,
          ready,
          authError,
          retryAuth: () => {
            attempt.current = false;
            setAuthError("");
            setAuthRetry((n) => n + 1);
          },
          add,
          remove: (i) => setCart((c) => c.filter((_, n) => n !== i)),
          clear: () => setCart([]),
          replaceCart: (items) => setCart(validateCart(items)),
          refresh,
          locale,
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}
// components/LanguageSwitcher.tsx
namespace M_components_LanguageSwitcher {
  export function LanguageSwitcher({locale}: {locale: M_components_Price_i1}) {
    const shop = M_components_ShopProvider.useOptionalShop();
    const [pending, setPending] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1("");
    const router = M_components_FirstRun_i4(),
      pathname = M_components_FirstRun_i3();
    return (
      <div className="language-pills" role="group" aria-label={M_components_AppShell_i20[locale].language}>
        {M_components_LanguageSwitcher_i4.map((l) => (
          <button
            key={l}
            aria-pressed={l === locale}
            disabled={pending}
            onClick={async () => {
              if (pending) return;
              if (shop?.user) {
                setPending(true);
                setError("");
                try {
                  await M_components_ShopProvider.shopRequest("/api/profile/language", {locale: l});
                  await shop.refresh();
                } catch {
                  setError(
                    locale === "uk"
                      ? "Не вдалося зберегти мову"
                      : locale === "ru"
                        ? "Не удалось сохранить язык"
                        : "Could not save language",
                  );
                  setPending(false);
                  return;
                }
                setPending(false);
              }
              M_components_FirstRun_i15(l);
              if (pathname.startsWith("/admin")) {
                const query = new URLSearchParams(location.search);
                query.set("locale", l);
                router.replace(`${pathname}?${query}`);
              } else router.replace(pathname.replace(/^\/(uk|ru|en)(?=\/|$)/, `/${l}`) + location.search + location.hash);
            }}
          >
            {l === locale && (
              <M_components_Tour_i3.span
                layoutId="languageIndicator"
                className="pill-indicator"
                transition={{type: "spring", stiffness: 450, damping: 35}}
              />
            )}
            <span>{l.toUpperCase()}</span>
          </button>
        ))}
        {error && (
          <span className="language-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
}
// components/AdminPanel.tsx
namespace M_components_AdminPanel {
  export type AdminProduct = {
    id: string;
    slug: string;
    title: Record<string, string>;
    price: string;
    currency: string;
    logoId: string | null;
    group: string;
    active: boolean;
    version: number;
  };
  export type AdminLogo = {
    id: string;
    name: string;
    imageUrl: string;
    color: string;
    group: string;
  };
  type Draft = {
    id?: string;
    slug: string;
    title: Record<string, string>;
    price: string;
    currency: string;
    logoId: string | null;
    group: string;
    active: boolean;
    version: number;
  };
  const empty: Draft = {
    slug: "",
    title: {uk: "", ru: "", en: ""},
    price: "10.00",
    currency: "USD",
    logoId: null,
    group: "exchange",
    active: false,
    version: 0,
  };
  export function AdminPanel({
    locale = "uk",
    initialProducts,
    logos,
    email,
    audit,
  }: {
    locale?: M_components_Price_i1;
    initialProducts: AdminProduct[];
    logos: AdminLogo[];
    email: string;
    audit: {
      id: string;
      action: string;
      entityId: string;
      createdAt: string;
    }[];
  }) {
    const tr = (text: string) => M_components_AdminPanel_i0(locale, text);
    const router = M_components_FirstRun_i4();
    const [products, setProducts] = M_components_Tour_i1(initialProducts);
    const [tab, setTab] = M_components_Tour_i1("products");
    const [query, setQuery] = M_components_Tour_i1("");
    const [visibility, setVisibility] = M_components_Tour_i1("all"),
      [groupFilter, setGroupFilter] = M_components_Tour_i1("all");
    const [draft, setDraft] = M_components_Tour_i1<Draft | null>(null);
    const [logoQuery, setLogoQuery] = M_components_Tour_i1("");
    const [pending, setPending] = M_components_Tour_i1(false);
    const [message, setMessage] = M_components_Tour_i1("");
    const selected = logos.find((l) => l.id === draft?.logoId);
    const visibleLogos = logos.filter((l) => l.name.toLowerCase().includes((tab === "logos" ? query : logoQuery).toLowerCase()));
    const visibleProducts = products.filter(
      (p) =>
        (visibility === "all" || (visibility === "active") === p.active) &&
        (groupFilter === "all" || p.group === groupFilter) &&
        `${p.id} ${p.slug} ${p.title.uk} ${p.title.ru} ${p.title.en}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    function edit(p?: AdminProduct) {
      setDraft(p ? {...p, title: {...p.title}} : {...empty, title: {...empty.title}});
      setLogoQuery("");
      setMessage("");
      setTab("products");
    }
    function chooseLogo(l: AdminLogo) {
      if (!draft) return;
      setDraft({
        ...draft,
        logoId: l.id,
        ...(!draft.id && !draft.title.uk
          ? {
              slug: l.id.replace(/^cg-/, ""),
              title: {
                uk: `${l.name} — верифікація`,
                ru: `${l.name} — верификация`,
                en: `${l.name} — verification`,
              },
            }
          : {}),
      });
    }
    async function save(e: React.FormEvent) {
      e.preventDefault();
      if (!draft || pending) return;
      setPending(true);
      setMessage("");
      try {
        const {id, ...fields} = draft;
        const res = await fetch(id ? `/api/admin/products/${id}` : "/api/admin/products", {
          method: id ? "PATCH" : "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(fields),
          signal: AbortSignal.timeout(20000),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            location.assign("/admin/login");
            return;
          }
          setMessage(
            data.error === "conflict"
              ? tr("Цю послугу вже змінили. Онови сторінку та відкрий її знову.")
              : data.error === "duplicate_slug"
                ? tr("Такий URL уже існує. Зміни ідентифікатор.")
                : tr("Не вдалося зберегти. Перевір поля та з’єднання."),
          );
          return;
        }
        const fresh = await fetch("/api/admin/products", {cache: "no-store", signal: AbortSignal.timeout(20000)});
        if (!fresh.ok) {
          location.reload();
          return;
        }
        setProducts(await fresh.json());
        setDraft(null);
        setMessage(tr("Зміни збережено."));
        router.refresh();
      } catch {
        setMessage(tr("Не вдалося з’єднатися із сервером. Перевір каталог перед повтором."));
      } finally {
        setPending(false);
      }
    }
    async function logout() {
      setPending(true);
      try {
        const res = await fetch("/api/admin/logout", {method: "POST", signal: AbortSignal.timeout(20000)});
        if (!res.ok) {
          setMessage(tr("Не вдалося завершити сесію. Спробуй знову."));
          return;
        }
        location.assign("/admin/login");
      } catch {
        setMessage(tr("Не вдалося завершити сесію. Спробуй знову."));
      } finally {
        setPending(false);
      }
    }
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <a className="admin-logo" href="/admin">
            <M_components_AdminPanel_i5 size={28} />
            <span>
              LEGIT ASSETS<small>CONTROL ROOM</small>
            </span>
          </a>
          <M_components_LanguageSwitcher.LanguageSwitcher locale={locale} />
          <p className="admin-nav-caption">{tr("УПРАВЛІННЯ")}</p>
          <nav>
            {[
              ["products", tr("Верифікації"), M_components_Tour_i11],
              ["logos", tr("Бібліотека логотипів"), M_components_AdminPanel_i8],
              ["audit", tr("Журнал змін"), M_components_AdminPanel_i9],
            ].map(([key, label, Icon]) => {
              const Glyph = Icon as typeof M_components_Tour_i11;
              return (
                <button
                  key={String(key)}
                  className={tab === key ? "active" : ""}
                  onClick={() => {
                    setTab(String(key));
                    setQuery("");
                    setDraft(null);
                    setMessage("");
                  }}
                >
                  <Glyph size={17} />
                  {String(label)}
                </button>
              );
            })}
          </nav>
          <a href={`/${locale}/verifications`} className="admin-store-link">
            {tr("Відкрити магазин")}
            <M_components_AdminPanel_i13 size={16} />
          </a>
          <div className="admin-user">
            <span className="admin-user-avatar">A</span>
            <div>
              <strong>{tr("Адміністратор")}</strong>
              <p>{email}</p>
            </div>
            <button aria-label={tr("Вийти")} onClick={logout} disabled={pending}>
              <M_components_AdminPanel_i11 size={16} />
            </button>
          </div>
        </aside>
        <main className="admin-main">
          <M_components_Tour_i0 href={`/admin/operations?locale=${locale}`} className="secondary-button mb-5">
            {tr("Замовлення, склад та аналітика ↗")}
          </M_components_Tour_i0>
          <header className="admin-header">
            <div>
              <p className="eyebrow">LEGIT / MANAGEMENT</p>
              <h1>{tab === "products" ? tr("Верифікації") : tab === "logos" ? tr("Бібліотека логотипів") : tr("Журнал змін")}</h1>
              <p>
                {tab === "products"
                  ? tr("Змінюй ціни та додавай нові платформи.")
                  : tab === "logos"
                    ? tr("Готові зображення для карток криптобірж.")
                    : tr("Останні зміни каталогу, збережені на сервері.")}
              </p>
            </div>
            {tab === "products" && (
              <button onClick={() => edit()} className="primary-button">
                <M_components_AdminPanel_i6 size={17} />
                {tr("Додати платформу")}
              </button>
            )}
          </header>
          <div className="admin-stats">
            <div>
              <span>{tr("Послуги")}</span>
              <strong>{products.length}</strong>
            </div>
            <div>
              <span>{tr("Опубліковано")}</span>
              <strong>{products.filter((p) => p.active).length}</strong>
            </div>
            <div>
              <span>{tr("Логотипи")}</span>
              <strong>{logos.length}</strong>
            </div>
            <div>
              <span>{tr("Доступ")}</span>
              <strong className="admin-status">
                ADMIN
                <M_components_Tour_i11 size={17} />
              </strong>
            </div>
          </div>
          {message && (
            <p role="status" className="admin-message">
              {message}
            </p>
          )}
          {tab === "products" && !draft && (
            <div className="admin-quick-filters">
              <select aria-label={tr("Статус")} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="all">{tr("Усі статуси")}</option>
                <option value="active">{tr("Опубліковано")}</option>
                <option value="hidden">{tr("Приховано")}</option>
              </select>
              <select aria-label={tr("Група")} value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
                <option value="all">{tr("Усі групи")}</option>
                <option value="exchange">{tr("Криптобіржі")}</option>
                <option value="wallet">{tr("Гаманці та Telegram")}</option>
                <option value="other">{tr("Інші сервіси")}</option>
              </select>
              <button
                onClick={() => {
                  setQuery("");
                  setVisibility("all");
                  setGroupFilter("all");
                }}
              >
                {tr("Скинути фільтри")}
              </button>
            </div>
          )}
          {draft ? (
            <form className="admin-editor" onSubmit={save}>
              <div className="admin-editor-top">
                <h2>{draft.id ? tr("Редагування послуги") : tr("Нова платформа")}</h2>
                <button type="button" onClick={() => setDraft(null)} disabled={pending}>
                  {tr("Скасувати")}
                </button>
              </div>
              <div className="admin-editor-grid">
                <div className="admin-fields">
                  {(["uk", "ru", "en"] as const).map((l) => (
                    <label key={l}>
                      {tr("Назва ·")}
                      {l.toUpperCase()}
                      <input
                        required
                        maxLength={120}
                        value={draft.title[l]}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            title: {...draft.title, [l]: e.target.value},
                          })
                        }
                      />
                    </label>
                  ))}
                  {!draft.id && (
                    <label>
                      {tr("Ідентифікатор URL")}
                      <input
                        required
                        pattern="[a-z0-9][a-z0-9-]{1,59}"
                        maxLength={60}
                        value={draft.slug}
                        onChange={(e) => setDraft({...draft, slug: e.target.value})}
                      />
                    </label>
                  )}
                  <div className="admin-price-inputs">
                    <label>
                      {tr("Базова ціна")}
                      <input
                        type="number"
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                        required
                        value={draft.price}
                        onChange={(e) => setDraft({...draft, price: e.target.value})}
                      />
                    </label>
                    <label>
                      {tr("Валюта")}
                      <select value={draft.currency} onChange={(e) => setDraft({...draft, currency: e.target.value})}>
                        {["USD", "UAH", "USDT"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="admin-field-note">{tr("У магазині автоматично показуються грн та USDT за актуальним курсом.")}</p>
                  <label>
                    {tr("Група")}
                    <select value={draft.group} onChange={(e) => setDraft({...draft, group: e.target.value})}>
                      <option value="exchange">{tr("Криптобіржі")}</option>
                      <option value="wallet">{tr("Гаманці та Telegram")}</option>
                      <option value="other">{tr("Інші сервіси")}</option>
                    </select>
                  </label>
                  <label className="admin-check">
                    <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({...draft, active: e.target.checked})} />
                    {tr("Опублікувати в каталозі")}
                  </label>
                  <p className="admin-field-note">{tr("Зніми позначку, щоб приховати послугу й зберегти історію.")}</p>
                  <button disabled={pending} className="primary-button" type="submit">
                    <M_components_AdminPanel_i14 size={17} />
                    {pending ? tr("Зберігаємо…") : tr("Зберегти зміни")}
                  </button>
                </div>
                <div className="admin-logo-picker">
                  <div className="admin-selected-logo">
                    {selected ? (
                      <>
                        <img src={selected.imageUrl} alt={selected.name} />
                        <strong>{selected.name}</strong>
                      </>
                    ) : (
                      <>
                        <M_components_Tour_i11 size={40} />
                        <strong>{tr("Стандартна іконка")}</strong>
                      </>
                    )}
                    <button type="button" onClick={() => setDraft({...draft, logoId: null})}>
                      {tr("Без логотипа")}
                    </button>
                  </div>
                  <label className="admin-search">
                    <M_components_Catalog_i2 size={16} />
                    <input
                      value={logoQuery}
                      onChange={(e) => setLogoQuery(e.target.value)}
                      placeholder={tr("Пошук логотипа")}
                      aria-label={tr("Пошук логотипа")}
                    />
                  </label>
                  <div className="admin-picker-grid">
                    {visibleLogos.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        aria-pressed={draft.logoId === l.id}
                        className={draft.logoId === l.id ? "selected" : ""}
                        onClick={() => chooseLogo(l)}
                      >
                        <img src={l.imageUrl} alt="" loading="lazy" />
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          ) : tab === "audit" ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{tr("Дата")}</th>
                    <th>{tr("Дія")}</th>
                    <th>{tr("Послуга")}</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((a) => (
                    <tr key={a.id}>
                      <td>
                        {new Date(a.createdAt).toLocaleString("uk-UA", {
                          timeZone: "Europe/Kyiv",
                        })}
                      </td>
                      <td>{a.action === "verification.create" ? tr("Створення") : tr("Редагування")}</td>
                      <td>{a.entityId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!audit.length && <p className="admin-field-note p-6">{tr("Змін ще немає.")}</p>}
            </div>
          ) : (
            <>
              <label className="admin-search">
                <M_components_Catalog_i2 size={17} />
                <input
                  placeholder={tab === "logos" ? tr("Знайти біржу…") : tr("Знайти послугу…")}
                  aria-label={tr("Пошук")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {tab === "logos" ? (
                <>
                  <div className="admin-library-grid">
                    {visibleLogos.map((l) => (
                      <article key={l.id}>
                        <img src={l.imageUrl} alt={l.name} loading="lazy" />
                        <h2>{l.name}</h2>
                        <button
                          onClick={() => {
                            edit();
                            setDraft({
                              ...empty,
                              title: {
                                uk: `${l.name} — верифікація`,
                                ru: `${l.name} — верификация`,
                                en: `${l.name} — verification`,
                              },
                              slug: l.id.replace(/^cg-/, ""),
                              logoId: l.id,
                            });
                          }}
                        >
                          <M_components_AdminPanel_i6 size={13} />
                          {tr("Додати послугу")}
                        </button>
                      </article>
                    ))}
                  </div>
                  <p className="admin-field-note mt-5">
                    {tr("Джерело метаданих логотипів:")}{" "}
                    <a href="https://www.coingecko.com/en/api" className="text-violet-300">
                      CoinGecko
                    </a>
                    {tr(". Наявність логотипа не означає доступність послуги.")}
                  </p>
                </>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{tr("Платформа / послуга")}</th>
                        <th>{tr("Ціна")}</th>
                        <th>{tr("Статус")}</th>
                        <th>{tr("Дії")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.map((p) => {
                        const logo = logos.find((l) => l.id === p.logoId);
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="admin-product-name">
                                <div>{logo ? <img src={logo.imageUrl} alt="" /> : <M_components_Tour_i11 size={23} />}</div>
                                <span>
                                  <strong>{p.title[locale] || p.title.uk}</strong>
                                  <small>
                                    {p.group === "exchange"
                                      ? tr("Криптобіржа")
                                      : p.group === "wallet"
                                        ? tr("Гаманець / Telegram")
                                        : tr("Інший сервіс")}
                                  </small>
                                </span>
                              </div>
                            </td>
                            <td className="admin-price">
                              {p.price} <small>{p.currency}</small>
                            </td>
                            <td>
                              <span className={`admin-pill ${p.active ? "published" : ""}`}>
                                {p.active ? tr("Опубліковано") : tr("Приховано")}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => edit(p)} className="admin-edit">
                                <M_components_AdminPanel_i9 size={14} />
                                {tr("Редагувати")}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!visibleProducts.length && <p className="admin-field-note p-6">{tr("Послуг не знайдено.")}</p>}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    );
  }
}
// components/AmbientBackground.tsx
namespace M_components_AmbientBackground {
  /**
   * AmbientBackground — Premium Crimson & Violet Ribbon & Stardust Background.
   * Faithfully preserves the ambient visual effects from the user's previous project,
   * adapted to LegitAssets cosmic design system with smooth scroll reaction.
   */
  export function AmbientBackground() {
    const canvasRef = M_components_FirstRun_i1<HTMLCanvasElement | null>(null);
    M_components_FirstRun_i0(() => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      const context = canvasElement.getContext("2d");
      if (!context) return;
      const canvas: HTMLCanvasElement = canvasElement;
      const ctx: CanvasRenderingContext2D = context;
      const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      interface Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        maxOpacity: number;
        fadeSpeed: number;
      }
      let stardust: Particle[] = [];
      const MAX_PARTICLES = 45;
      function createParticle(randomY = false): Particle {
        return {
          x: Math.random() * width,
          y: randomY ? Math.random() * height : height + 10,
          size: 0.8 + Math.random() * 1.6,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: -(0.15 + Math.random() * 0.35),
          opacity: randomY ? Math.random() * 0.7 : 0,
          maxOpacity: 0.3 + Math.random() * 0.5,
          fadeSpeed: 0.005 + Math.random() * 0.01,
        };
      }
      function initStardust() {
        stardust = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
          stardust.push(createParticle(true));
        }
      }
      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initStardust();
      }
      function updateAndDrawParticles(scrollVel: number) {
        ctx.save();
        for (let i = 0; i < stardust.length; i++) {
          const p = stardust[i];
          // Move particle, influenced slightly by scrolling velocity
          p.y += p.speedY - scrollVel * 6.0;
          p.x += p.speedX;
          // Fade in/out logic
          if (p.opacity < p.maxOpacity && p.y > 0) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + 0.02);
          }
          if (p.y < 50) {
            p.opacity = Math.max(0, p.opacity - p.fadeSpeed * 3);
          }
          // Draw particle with subtle dual glow (rose-violet)
          ctx.shadowColor = "rgba(244,63,94,0.6)";
          ctx.shadowBlur = p.size * 3;
          ctx.fillStyle = `rgba(255, 120, 150, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Re-create if off-screen or fully faded
          if (p.y < -10 || p.opacity <= 0 || p.x < -10 || p.x > width + 10) {
            stardust[i] = createParticle(false);
          }
        }
        ctx.restore();
      }
      let scrollProgress = 0,
        targetScroll = 0;
      let prevScrollY = window.scrollY;
      let scrollVelocity = 0;
      const onScroll = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const currentY = window.scrollY;
        targetScroll = Math.min(1, currentY / max);
        scrollVelocity = (currentY - prevScrollY) / window.innerHeight;
        prevScrollY = currentY;
      };
      function drawRibbons() {
        const time = Date.now() * 0.001;
        ctx.save();
        // High-performance hardware-accelerated ribbon waves (no expensive software shadowBlur)
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.12;
        // WAVE 1 — top-left flow
        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 14;
        ctx.beginPath();
        const w1y = scrollProgress * 70 + Math.sin(time * 0.4) * 20;
        const w1x = Math.cos(time * 0.35) * 15;
        ctx.moveTo(-50, height * 0.06 + w1y);
        ctx.bezierCurveTo(
          width * 0.28 + w1x,
          height * 0.03 + Math.sin(time * 0.5) * 22 + w1y,
          width * 0.38 + w1x,
          height * 0.24 + Math.cos(time * 0.4) * 18 + w1y,
          -50,
          height * 0.36 + w1y,
        );
        ctx.stroke();
        // WAVE 2 — main right weaving ribbon
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 16;
        ctx.beginPath();
        const w2y = -scrollProgress * 110 + Math.cos(time * 0.3) * 25;
        const w2x = Math.sin(time * 0.45) * 20;
        ctx.moveTo(width + 50, height * 0.22 + w2y);
        ctx.bezierCurveTo(
          width * 0.62 + w2x,
          height * 0.32 + Math.sin(time * 0.4) * 30 + w2y,
          width * 0.72 + w2x,
          height * 0.72 + Math.cos(time * 0.3) * 28 + w2y,
          width + 50,
          height * 0.82 + w2y,
        );
        ctx.stroke();
        // WAVE 3 — bottom-left ribbon
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 12;
        ctx.beginPath();
        const w3y = scrollProgress * 50 + Math.sin(time * 0.5) * 16;
        const w3x = Math.cos(time * 0.5) * 12;
        ctx.moveTo(-50, height * 0.78 + w3y);
        ctx.bezierCurveTo(
          width * 0.22 + w3x,
          height * 0.84 + Math.cos(time * 0.6) * 18 + w3y,
          width * 0.32 + w3x,
          height * 0.94 + Math.sin(time * 0.5) * 22 + w3y,
          width * 0.08 + w3x,
          height + 50 + w3y,
        );
        ctx.stroke();
        ctx.restore();
      }
      let animId = 0;
      function frame() {
        scrollVelocity *= 0.92;
        scrollProgress += (targetScroll - scrollProgress) * 0.12;
        ctx.clearRect(0, 0, width, height);
        drawRibbons();
        updateAndDrawParticles(scrollVelocity);
        if (!reduced) animId = requestAnimationFrame(frame);
      }
      resize();
      window.addEventListener("resize", resize, {passive: true});
      window.addEventListener("scroll", onScroll, {passive: true});
      if (reduced) {
        frame();
      } else {
        animId = requestAnimationFrame(frame);
      }
      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
      };
    }, []);
    return (
      <>
        <canvas ref={canvasRef} id="bg-canvas" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
        <div className="glow-spot spot-1 pointer-events-none fixed z-0" aria-hidden="true" />
        <div className="glow-spot spot-2 pointer-events-none fixed z-0" aria-hidden="true" />
      </>
    );
  }
}
// components/AnimatedGiftEmoji.tsx
namespace M_components_AnimatedGiftEmoji {
  interface AnimatedGiftEmojiProps {
    lottieUrl?: string;
    imageUrl: string;
    alt: string;
    className?: string;
    autoplay?: boolean;
    loop?: boolean;
    speed?: number;
    interactive?: boolean;
    showBadge?: boolean;
    mode?: "card" | "modal";
  }
  export const AnimatedGiftEmoji = M_components_ProductCard_i5(function AnimatedGiftEmoji({
    lottieUrl,
    imageUrl,
    alt,
    className = "w-full h-full",
    autoplay = true,
    loop = true,
    speed = 1,
    interactive = true,
    showBadge = false,
    mode = "card",
  }: AnimatedGiftEmojiProps) {
    const containerRef = M_components_FirstRun_i1<HTMLDivElement>(null);
    const animRef = M_components_FirstRun_i1<M_components_AnimatedGiftEmoji_i4 | null>(null);
    const [isLottieLoaded, setIsLottieLoaded] = M_components_Tour_i1(false);
    const [hasError, setHasError] = M_components_Tour_i1(false);
    M_components_FirstRun_i0(() => {
      // Only mount heavy Lottie engine in modal mode to guarantee 0 lag in catalog grid
      if (mode !== "modal" || !lottieUrl || typeof window === "undefined") {
        setIsLottieLoaded(false);
        return;
      }
      let isMounted = true;
      setIsLottieLoaded(false);
      setHasError(false);
      import("lottie-web")
        .then((lottieModule) => {
          if (!isMounted || !containerRef.current) return;
          const lottie = lottieModule.default || lottieModule;
          // Cleanup previous instance if any
          if (animRef.current) {
            try {
              animRef.current.destroy();
            } catch {}
            animRef.current = null;
          }
          try {
            const anim = lottie.loadAnimation({
              container: containerRef.current,
              renderer: "svg",
              loop,
              autoplay,
              path: lottieUrl,
            });
            animRef.current = anim;
            anim.addEventListener("DOMLoaded", () => {
              if (isMounted) {
                setIsLottieLoaded(true);
                anim.setSpeed(speed);
              }
            });
            anim.addEventListener("data_failed", () => {
              if (isMounted) {
                setHasError(true);
                setIsLottieLoaded(false);
              }
            });
          } catch {
            if (isMounted) setHasError(true);
          }
        })
        .catch(() => {
          if (isMounted) setHasError(true);
        });
      return () => {
        isMounted = false;
        if (animRef.current) {
          try {
            animRef.current.destroy();
          } catch {}
          animRef.current = null;
        }
      };
    }, [lottieUrl, loop, autoplay, mode]);
    M_components_FirstRun_i0(() => {
      if (animRef.current && isLottieLoaded) {
        animRef.current.setSpeed(speed);
      }
    }, [speed, isLottieLoaded]);
    if (mode === "card") {
      return (
        <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
          />
        </div>
      );
    }
    return (
      <div
        className={`relative flex items-center justify-center select-none overflow-hidden ${interactive ? "group cursor-pointer" : ""} ${className}`}
      >
        {/* Dynamic Lottie Animation (Telegram NFT Gift Vector Animation) */}
        {lottieUrl && !hasError && (
          <div
            ref={containerRef}
            className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${isLottieLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
            aria-hidden={!isLottieLoaded}
          />
        )}

        {/* Fallback while Lottie is loading or if failed */}
        {(!lottieUrl || !isLottieLoaded || hasError) && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.25)_0%,transparent_70%)] pointer-events-none animate-pulse" />
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
    );
  });
}
// components/FirstRun.tsx
namespace M_components_FirstRun {
  const copy = {
    uk: {
      choose: "Обери мову",
      welcome: "Ласкаво просимо до LEGIT ASSETS",
      next: "Далі",
      back: "Назад",
      finish: "Відкрити магазин",
      saving: "Зберігаємо…",
      error: "Не вдалося зберегти. Спробуй ще раз.",
      heads: ["Усе потрібне — у магазині", "NFT — окремий простір", "Поповнення через бота", "Усе під контролем"],
      texts: [
        "Steam, Telegram-акаунти, SMM та верифікації. Обери категорію й перевір характеристики товару.",
        "Каталог подарунків, обрані й ціни GRAM. Можливість купівлі залежить від підключення передачі NFT.",
        "У профілі видно баланс бота. Кнопка поповнення відкриває його меню; платіж підтверджує бот.",
        "Історія показує стан замовлень. У профілі можна змінити фото й мову. Ця екскурсія автоматично з'явиться лише один раз.",
      ],
    },
    ru: {
      choose: "Выбери язык",
      welcome: "Добро пожаловать в LEGIT ASSETS",
      next: "Далее",
      back: "Назад",
      finish: "Открыть магазин",
      saving: "Сохраняем…",
      error: "Не удалось сохранить. Попробуй ещё раз.",
      heads: ["Всё нужное — в магазине", "NFT — отдельное пространство", "Пополнение через бота", "Всё под контролем"],
      texts: [
        "Steam, Telegram-аккаунты, SMM и верификации. Выбери категорию и проверь характеристики.",
        "Каталог подарков, избранное и цены GRAM. Покупка зависит от подключения передачи NFT.",
        "В профиле виден баланс бота. Кнопка пополнения открывает его меню; платёж подтверждает бот.",
        "История показывает статус заказов. В профиле можно изменить фото и язык. Экскурсия автоматически появится только один раз.",
      ],
    },
    en: {
      choose: "Choose your language",
      welcome: "Welcome to LEGIT ASSETS",
      next: "Next",
      back: "Back",
      finish: "Open shop",
      saving: "Saving…",
      error: "Could not save. Please retry.",
      heads: ["Everything in your shop", "NFT has its own space", "Top up through the bot", "Stay in control"],
      texts: [
        "Steam, Telegram accounts, SMM and verification services. Choose a category and check the product details.",
        "Collectible gifts, favorites and GRAM prices. Purchases depend on the NFT transfer integration.",
        "Your profile displays the bot balance. The top-up button opens its menu; the bot confirms payment.",
        "History shows your order status. Edit your photo and language in Profile. This tour appears automatically only once.",
      ],
    },
  };
  export function FirstRun({locale}: {locale: M_components_Price_i1}) {
    const {user, refresh} = M_components_ShopProvider.useShop(),
      router = M_components_FirstRun_i4(),
      pathname = M_components_FirstRun_i3(),
      dialog = M_components_FirstRun_i1<HTMLDialogElement>(null),
      reduced = M_components_Tour_i4();
    const [step, setStep] = M_components_Tour_i1(0),
      [busy, setBusy] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1("");
    const t = copy[locale];
    M_components_FirstRun_i0(() => {
      const el = dialog.current;
      el?.showModal();
      const previous = document.activeElement as HTMLElement;
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const back = (e: Event) => {
        e.preventDefault();
        setStep((s) => Math.max(0, s - 1));
      };
      window.addEventListener("telegram-back", back);
      return () => {
        el?.close();
        document.body.style.overflow = overflow;
        previous?.focus();
        window.removeEventListener("telegram-back", back);
      };
    }, []);
    async function choose(language: M_components_Price_i1) {
      if (busy) return;
      setBusy(true);
      setError("");
      try {
        await M_components_ShopProvider.shopRequest("/api/profile/language", {
          locale: language,
        });
        M_components_FirstRun_i15(language);
        M_hooks_useTelegramWebApp.haptic("selection");
        await refresh();
        router.replace(pathname.replace(/^\/(uk|ru|en)(?=\/|$)/, `/${language}`) + location.search);
      } catch {
        setError(t.error);
      } finally {
        setBusy(false);
      }
    }
    async function complete() {
      if (busy) return;
      setBusy(true);
      setError("");
      try {
        await M_components_ShopProvider.shopRequest("/api/profile/onboarding", {
          completed: true,
          version: 1,
        });
        await refresh();
        M_hooks_useTelegramWebApp.haptic("success");
        router.replace(`/${locale}`);
      } catch {
        M_hooks_useTelegramWebApp.haptic("error");
        setError(t.error);
      } finally {
        setBusy(false);
      }
    }
    const Icon = [M_components_FirstRun_i7, M_components_FirstRun_i8, M_components_Tour_i9, M_components_FirstRun_i10][step];
    return (
      <dialog ref={dialog} className="first-run-dialog" aria-labelledby="first-run-title" onCancel={(e) => e.preventDefault()}>
        <section className="first-run-card">
          {!user?.onboardingStartedAt ? (
            <>
              <M_components_FirstRun_i13 className="first-run-mark" size={46} />
              <p className="first-run-brand">LEGIT ASSETS</p>
              <h1 id="first-run-title">{t.choose}</h1>
              <p className="first-run-muted">Choose your language · Обери мову · Выбери язык</p>
              <div className="first-run-languages">
                {(
                  [
                    ["uk", "Українська"],
                    ["en", "English"],
                    ["ru", "Русский"],
                  ] as const
                ).map(([language, label]) => (
                  <button key={language} disabled={busy} onClick={() => void choose(language)}>
                    <span>{label}</span>
                    <M_components_Tour_i6 size={19} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="first-run-progress">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={i <= step ? "active" : ""} />
                ))}
              </div>
              <p className="first-run-brand">LEGIT ASSETS · {step + 1}/4</p>
              <M_components_Tour_i3.div
                key={step}
                initial={reduced ? false : {opacity: 0, y: 12}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.2}}
              >
                <div className="first-run-illustration">
                  <Icon size={76} strokeWidth={1.3} />
                </div>
                <h1 id="first-run-title">{t.heads[step]}</h1>
                <p className="first-run-muted">{t.texts[step]}</p>
              </M_components_Tour_i3.div>
              <div className="first-run-actions">
                {step > 0 && (
                  <button
                    className="secondary-button"
                    disabled={busy}
                    onClick={() => {
                      setStep((s) => s - 1);
                      M_hooks_useTelegramWebApp.haptic("selection");
                    }}
                  >
                    <M_components_Tour_i5 size={18} />
                    {t.back}
                  </button>
                )}
                <button
                  className="primary-button"
                  disabled={busy}
                  onClick={() => {
                    if (step === 3) void complete();
                    else {
                      setStep((s) => s + 1);
                      M_hooks_useTelegramWebApp.haptic("selection");
                    }
                  }}
                >
                  {busy ? t.saving : step === 3 ? t.finish : t.next}
                  {step === 3 ? <M_components_Tour_i7 size={18} /> : <M_components_Tour_i6 size={18} />}
                </button>
              </div>
            </>
          )}
          {error && (
            <p role="alert" className="first-run-error">
              {error}
            </p>
          )}
        </section>
      </dialog>
    );
  }
}
// components/DesktopPreview.tsx
namespace M_components_DesktopPreview {
  // Outside Telegram, show only the launch gate, never a separate web storefront.
  export function DesktopPreview({locale}: {children: React.ReactNode; locale: M_components_Price_i1}) {
    const [qr, setQr] = M_components_Tour_i1("");
    const t = M_components_AppShell_i20[locale],
      link = "https://t.me/LegitAssetsBot";
    M_components_FirstRun_i0(() => {
      let active = true;
      void M_components_DesktopPreview_i2.toDataURL(link, {
        width: 220,
        margin: 2,
        color: {dark: "#151515", light: "#ffffff"},
      })
        .then((value) => {
          if (active) setQr(value);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, []);
    return (
      <main className="telegram-launch-gate">
        <div className="telegram-launch-card">
          <M_components_Tour_i12 size={38} />
          <h1>LEGIT ASSETS</h1>
          <p>
            {locale === "uk"
              ? "Магазин працює в Telegram Mini App."
              : locale === "ru"
                ? "Магазин работает в Telegram Mini App."
                : "The shop runs inside Telegram Mini App."}
          </p>
          {qr && <img src={qr} alt={t.scan} width={220} height={220} />}
          <a className="primary-button" href={link}>
            {t.open}
          </a>
        </div>
      </main>
    );
  }
}
// components/FloatingCart.tsx
namespace M_components_FloatingCart {
  export function FloatingCart() {
    const {cart, locale} = M_components_ShopProvider.useShop(),
      pathname = M_components_FirstRun_i3(),
      t = M_components_AppShell_i20[locale],
      reduced = M_components_Tour_i4();
    const [hidden, setHidden] = M_components_Tour_i1(false),
      [keyboard, setKeyboard] = M_components_Tour_i1(0);
    M_components_FirstRun_i0(() => {
      let last = scrollY;
      const scroll = () => {
        setHidden(scrollY > last && scrollY > 120);
        last = scrollY;
      };
      const viewport = () =>
        setKeyboard(Math.max(0, innerHeight - (visualViewport?.height ?? innerHeight) - (visualViewport?.offsetTop ?? 0)));
      window.addEventListener("scroll", scroll, {passive: true});
      visualViewport?.addEventListener("resize", viewport);
      viewport();
      return () => {
        window.removeEventListener("scroll", scroll);
        visualViewport?.removeEventListener("resize", viewport);
      };
    }, []);
    const count = cart.reduce((n, e) => n + e.quantity, 0);
    return (
      <M_components_Tour_i2>
        {count > 0 && !hidden && !pathname.endsWith("/cart") && (
          <M_components_Tour_i3.div
            className="cart-wrapper"
            style={{bottom: keyboard > 100 ? keyboard + 12 : undefined}}
            initial={{
              y: reduced ? 0 : 80,
              opacity: 0,
              scale: reduced ? 1 : 0.92,
            }}
            animate={{y: 0, opacity: 1, scale: 1}}
            exit={{y: 60, opacity: 0}}
            transition={{type: "spring", stiffness: 400, damping: 30}}
          >
            <M_components_Tour_i0 href={`/${locale}/cart`}>
              <M_components_Tour_i8 size={19} />
              <span>{t.cart}</span>
              <M_components_Tour_i3.b key={count} initial={{scale: 1.25}} animate={{scale: 1}}>
                {count}
              </M_components_Tour_i3.b>
              <M_components_Tour_i6 size={17} />
            </M_components_Tour_i0>
          </M_components_Tour_i3.div>
        )}
      </M_components_Tour_i2>
    );
  }
}
// hooks/usePressEffects.ts
namespace M_hooks_usePressEffects {
  export function usePressEffects(enabled: boolean) {
    M_components_FirstRun_i0(() => {
      if (!enabled) return;
      const ripples = new Set<HTMLElement>();
      const timers = new Set<ReturnType<typeof setTimeout>>();
      const press = (event: PointerEvent) => {
        if (event.button !== 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("button,a") : null;
        if (
          !target ||
          !target.closest(".miniapp,dialog") ||
          target.matches(":disabled,[aria-disabled=true]") ||
          target.classList.contains("sheet-drag-handle")
        )
          return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "press-ripple";
        ripple.setAttribute("aria-hidden", "true");
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        target.append(ripple);
        ripples.add(ripple);
        const timer = setTimeout(() => {
          ripple.remove();
          ripples.delete(ripple);
          timers.delete(timer);
        }, 500);
        timers.add(timer);
      };
      document.addEventListener("pointerdown", press, {passive: true});
      return () => {
        document.removeEventListener("pointerdown", press);
        timers.forEach(clearTimeout);
        ripples.forEach((r) => r.remove());
      };
    }, [enabled]);
  }
}
// components/AppShell.tsx
namespace M_components_AppShell {
  const WalletConnect = M_components_AppShell_i0(
    () =>
      import("./ui.tsx").then((bundle) => ({
        default: bundle.M_components_WalletConnect__default,
      })),
    {
      ssr: false,
      loading: () => <div className="wallet-connect-placeholder" />,
    },
  );
  const icons = {
    store: M_components_FirstRun_i7,
    nft: M_components_FirstRun_i8,
    history: M_components_FirstRun_i10,
    profile: M_components_AppShell_i12,
  };
  export function AppShell({
    children,
    locale,
    extraCategories = [],
  }: {
    children: React.ReactNode;
    locale: M_components_Price_i1;
    extraCategories?: {
      slug: string;
      title: string;
    }[];
  }) {
    const {isTelegram, ready, app} = M_hooks_useTelegramWebApp.useTelegramWebApp(),
      pathname = M_components_FirstRun_i3(),
      router = M_components_FirstRun_i4(),
      shop = M_components_ShopProvider.useShop(),
      t = M_components_AppShell_i20[locale];
    const [online, setOnline] = M_components_Tour_i1(true);
    M_components_FirstRun_i0(() => {
      const update = () => setOnline(navigator.onLine);
      update();
      window.addEventListener("online", update);
      window.addEventListener("offline", update);
      return () => {
        window.removeEventListener("online", update);
        window.removeEventListener("offline", update);
      };
    }, []);
    const routed = M_components_FirstRun_i1(false);
    const visited = M_components_FirstRun_i1<string[]>([]);
    const reduced = M_components_Tour_i4();
    M_hooks_usePressEffects.usePressEffects(isTelegram && ready);
    const activeTab = M_components_AppShell_i10(pathname, locale);
    M_components_FirstRun_i0(() => {
      if (!isTelegram || !app || routed.current || !shop.ready || !shop.user) return;
      routed.current = true;
      const start = new URLSearchParams(app.initData).get("start_param");
      const purchase = start?.match(/^buy_(uk|ru|en)_([A-Za-z0-9_-]{43})$/);
      const module = start?.match(/^module_(uk|ru|en)_(tour|rules|about|payment|privacy)$/);
      const country = start?.match(/^(uk|ru|en)_tg_([A-Z]{2})$/);
      const category = start?.match(/^(uk|ru|en)_(steam-accounts|telegram-accounts|smm|verifications|nft-gifts|gifts)$/);
      if (purchase) {
        router.replace(`/${purchase[1]}/cart?handoff=${purchase[2]}`);
        return;
      }
      if (module) {
        router.replace(`/${module[1]}/modules/${module[2]}`);
        return;
      }
      if (country && M_components_AppShell_i16(country[2])) {
        router.replace(`/${country[1]}/telegram-accounts/${country[2]}?spam=no&sort=asc`);
        return;
      }
      if (category) {
        router.replace(`/${category[1]}/${category[2] === "gifts" ? "nft-gifts" : category[2]}`);
        return;
      }
      const target = shop.user?.locale ?? M_components_AppShell_i17() ?? M_components_AppShell_i18(app.initDataUnsafe?.user?.language_code);
      if (target !== locale) router.replace(pathname.replace(/^\/(uk|ru|en)(?=\/|$)/, `/${target}`) + location.search + location.hash);
    }, [isTelegram, app, locale, pathname, router, shop.ready, shop.user]);
    M_components_FirstRun_i0(() => {
      const paths = visited.current;
      if (paths.at(-1) !== pathname) {
        if (paths.at(-2) === pathname) paths.pop();
        else paths.push(pathname);
      }
      const back = app?.BackButton;
      if (!back) return;
      pathname === `/${locale}` ? back.hide() : back.show();
      const onBack = () => {
        if (window.dispatchEvent(new Event("telegram-back", {cancelable: true}))) {
          if (visited.current.length > 1) router.back();
          else router.replace(`/${locale}`);
        }
      };
      back.onClick(onBack);
      return () => {
        back.offClick(onBack);
        back.hide();
      };
    }, [app, pathname, locale, router]);
    const content = (
      <>
        <header className="native-header">
          <M_components_Tour_i0 className="native-brand" href={`/${locale}`}>
            LEGIT<span>ASSETS</span>
            <i />
          </M_components_Tour_i0>
          <div className="native-actions">
            <WalletConnect locale={locale} />
            <M_components_Tour_i0 aria-label={t.cart} href={`/${locale}/cart`}>
              <M_components_Tour_i8 size={20} />
              <b>{shop.cart.length}</b>
            </M_components_Tour_i0>
          </div>
          <div className="header-second-row">
            <M_components_LanguageSwitcher.LanguageSwitcher locale={locale} />
            <M_components_Tour_i0 href={`/${locale}/modules`}>{t.guarantees} ↗</M_components_Tour_i0>
          </div>
        </header>
        <main id="main" className="native-main">
          {!online && (
            <p className="connection-status" role="status">
              {journeyCopy[locale].offline}
            </p>
          )}
          {(!shop.ready || shop.authError) && (
            <section className="session-status" role={shop.authError ? "alert" : "status"} aria-live="polite">
              <p>
                {!shop.ready
                  ? locale === "uk"
                    ? "Підключаємо твій профіль…"
                    : locale === "ru"
                      ? "Подключаем твой профиль…"
                      : "Connecting your profile…"
                  : shop.authError === "expired_telegram_auth"
                    ? locale === "uk"
                      ? "Вхід застарів. Закрий Mini App і відкрий її знову через бота; кошик збережено."
                      : locale === "ru"
                        ? "Вход устарел. Закрой Mini App и открой снова через бота; корзина сохранена."
                        : "Sign-in expired. Close the Mini App and reopen it through the bot; your cart is saved."
                    : locale === "uk"
                      ? "Не вдалося увійти через Telegram. Спробуй ще раз; кошик збережено."
                      : locale === "ru"
                        ? "Не удалось войти через Telegram. Попробуй ещё раз; корзина сохранена."
                        : "Telegram sign-in failed. Retry; your cart is saved."}
              </p>
              {shop.ready && (
                <button className="secondary-button" onClick={shop.retryAuth}>
                  {locale === "uk" ? "Повторити вхід" : locale === "ru" ? "Повторить вход" : "Retry sign-in"}
                </button>
              )}
            </section>
          )}
          {children}
        </main>
      </>
    );
    return (
      <>
        <M_components_AppShell_i1
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
          onReady={() => {
            window.dispatchEvent(new Event("telegram-sdk-ready"));
          }}
        />
        {!ready ? (
          <div className="app-loading">LEGIT ASSETS</div>
        ) : !isTelegram ? (
          <M_components_DesktopPreview.DesktopPreview locale={locale}>{content}</M_components_DesktopPreview.DesktopPreview>
        ) : (
          <div
            className="miniapp native-app"
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              if (!target.closest(".app-bottom-nav") && target.closest("button,a,[role=tab]")) M_hooks_useTelegramWebApp.haptic("light");
            }}
            onChangeCapture={() => M_hooks_useTelegramWebApp.haptic("selection")}
          >
            <a className="sr-only" href="#main">
              {t.catalog}
            </a>
            {content}
            {shop.user?.isAdmin && <M_components_AdminLogin.AdminLogin locale={locale} />}
            {shop.ready && shop.user && !shop.user.onboardingCompletedAt && <M_components_FirstRun.FirstRun locale={locale} />}
            <M_components_FloatingCart.FloatingCart />
            <nav className="app-bottom-nav" aria-label={t.catalog}>
              {M_components_AppShell_i9(locale).map((tab) => {
                const Icon = icons[tab.id];
                const active = activeTab === tab.id;
                return (
                  <M_components_Tour_i0
                    key={tab.id}
                    href={tab.path}
                    scroll={false}
                    onClick={() => {
                      M_hooks_useTelegramWebApp.haptic("selection");
                      window.scrollTo(0, 0);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={active ? "active" : ""}
                  >
                    {active && (
                      <M_components_Tour_i3.span
                        className="nav-active-pill"
                        layoutId={reduced ? undefined : "activeTabIndicator"}
                        transition={reduced ? {duration: 0} : {type: "spring", stiffness: 450, damping: 35}}
                      />
                    )}
                    <M_components_Tour_i3.span
                      className="primary-tab-icon"
                      animate={reduced ? undefined : {y: active ? -2 : 0, scale: active ? 1.08 : 1}}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 25,
                      }}
                    >
                      <Icon size={22} />
                    </M_components_Tour_i3.span>
                    <span>{tab.label}</span>
                  </M_components_Tour_i0>
                );
              })}
            </nav>
          </div>
        )}
      </>
    );
  }
}
// components/BottomSheet.tsx
namespace M_components_BottomSheet {
  export function BottomSheet({
    children,
    titleId,
    onClose,
    locale,
  }: {
    children: React.ReactNode;
    titleId: string;
    onClose: () => void;
    locale: M_components_Price_i1;
  }) {
    const dialog = M_components_FirstRun_i1<HTMLDialogElement>(null),
      reduced = M_components_Tour_i4();
    M_components_FirstRun_i0(() => {
      const element = dialog.current!,
        previous = document.activeElement as HTMLElement,
        overflow = document.body.style.overflow;
      element.showModal();
      document.body.style.overflow = "hidden";
      const back = (e: Event) => {
        e.preventDefault();
        onClose();
      };
      window.addEventListener("telegram-back", back);
      return () => {
        element.close();
        document.body.style.overflow = overflow;
        previous?.focus();
        window.removeEventListener("telegram-back", back);
      };
    }, [onClose]);
    return (
      <dialog
        ref={dialog}
        className="bottom-sheet-dialog"
        aria-labelledby={titleId}
        onCancel={onClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <M_components_Tour_i3.div
          className="bottom-sheet-surface"
          initial={{y: reduced ? 0 : 500, opacity: reduced ? 1 : 0}}
          animate={{y: 0, opacity: 1}}
          transition={{type: "spring", stiffness: 330, damping: 34}}
        >
          <M_components_Tour_i3.div
            className="sheet-drag-handle"
            drag="y"
            dragConstraints={{top: 0, bottom: 0}}
            dragElastic={{top: 0, bottom: 0.7}}
            onDragEnd={(_, info) => {
              if (info.offset.y > 70 || info.velocity.y > 500) onClose();
            }}
          >
            <span />
          </M_components_Tour_i3.div>
          <button className="gift-close" aria-label={M_components_AppShell_i20[locale].close} onClick={onClose}>
            <M_components_BottomSheet_i4 size={20} />
          </button>
          {children}
        </M_components_Tour_i3.div>
      </dialog>
    );
  }
}
// components/BuyButton.tsx
namespace M_components_BuyButton {
  export function BuyButton({item, disabled = false}: {item: M_components_ShopProvider.CartEntry; disabled?: boolean}) {
    const {cart, add, locale} = M_components_ShopProvider.useShop(),
      t = M_components_BuyButton_i2[locale],
      exists = cart.some((e) => e.kind === item.kind && e.id === item.id && e.link === item.link);
    const full = cart.length >= 20 && !exists;
    const limit = locale === "uk" ? "У кошику вже 20 позицій" : locale === "ru" ? "В корзине уже 20 позиций" : "Cart already has 20 items";
    return (
      <button
        type="button"
        disabled={disabled || full}
        title={full ? limit : undefined}
        className="primary-button shop-buy-button disabled:opacity-40"
        onClick={() => add(item)}
      >
        {exists ? <M_components_Tour_i7 size={17} /> : <M_components_Tour_i8 size={17} />} {full ? limit : exists ? t.added : t.add}
      </button>
    );
  }
}
// components/Price.tsx
namespace M_components_Price {
  export function Price({price, locale}: {price: M_components_Price_i0 | null; locale: M_components_Price_i1}) {
    return (
      <span className="flex flex-col gap-1 tabular-nums">
        <span className="text-xl font-semibold">
          {price
            ? new Intl.NumberFormat(locale, {
                style: "currency",
                currency: "UAH",
                currencyDisplay: "narrowSymbol",
              }).format(price.UAH / 100)
            : "— ₴"}
        </span>
        <span className="text-sm text-slate-400">
          {price
            ? new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(price.USDT / 100)
            : "—"}{" "}
          USDT
        </span>
      </span>
    );
  }
}
// components/ProductCard.tsx
namespace M_components_ProductCard {
  export type StockStatus = "in_stock" | "out_of_stock" | "on_request";
  export interface ProductCardProps {
    title: string;
    // Integer minor units, never a floating-point amount from the database.
    price: M_components_Price_i0 | null;
    stockStatus: StockStatus;
    imageUrl: string;
    category: string;
    locale?: M_components_Price_i1;
    href?: string;
  }
  export const ProductCard = M_components_ProductCard_i5(function ProductCard({
    title,
    price,
    stockStatus,
    imageUrl,
    category,
    locale = "uk",
    href,
  }: ProductCardProps) {
    const [failed, setFailed] = M_components_Tour_i1(false);
    const reduced = M_components_Tour_i4();
    const t = M_components_Catalog_i5[locale];
    const statuses = {
      in_stock: {
        text: t.available,
        color: "bg-emerald-400/10 text-emerald-300",
      },
      out_of_stock: {
        text: t.soldOut,
        color: "bg-slate-400/10 text-slate-300",
      },
      on_request: {text: t.request, color: "bg-amber-400/10 text-amber-200"},
    };
    const status = statuses[stockStatus];
    return (
      <M_components_Tour_i3.article
        whileHover={reduced ? undefined : {y: -4}}
        transition={{duration: 0.2}}
        className="clean-product-card group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl hover:border-blue-400/40 hover:shadow-[0_12px_45px_-20px_#2A85FF80]"
      >
        <div className="clean-product-art relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-[#111725]">
          {!failed && imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              width={640}
              height={360}
              onError={() => setFailed(true)}
              className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <M_components_ProductCard_i4 size={56} className="text-violet-300/50" />
          )}
          <span className={`absolute left-4 top-4 rounded-full border border-white/10 px-3 py-1 text-xs backdrop-blur-xl ${status.color}`}>
            {status.text}
          </span>
        </div>
        <div className="p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-violet-300">{category}</p>
          <h2 className="min-h-14 text-lg font-semibold leading-7">{title}</h2>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <M_components_Price.Price price={price} locale={locale} />
            {href ? (
              <M_components_Tour_i0
                href={href}
                aria-label={`${t.details}: ${title}`}
                className="flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium shadow-[0_0_22px_#2A85FF33] transition hover:bg-blue-400"
              >
                {t.details}
                <M_components_AdminPanel_i13 size={16} />
              </M_components_Tour_i0>
            ) : (
              <span className="text-xs text-slate-400">{status.text}</span>
            )}
          </div>
        </div>
      </M_components_Tour_i3.article>
    );
  });
}
// components/Catalog.tsx
namespace M_components_Catalog {
  export function Catalog({items, locale, category}: {items: M_components_Catalog_i7[]; locale: M_components_Price_i1; category?: string}) {
    const [query, setQuery] = M_components_Tour_i1("");
    const [sort, setSort] = M_components_Tour_i1("default");
    const t = M_components_Catalog_i5[locale];
    const filtered = items.filter((p) => p.title[locale].toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
    if (sort !== "default")
      filtered.sort((a, b) =>
        a.unpriced !== b.unpriced ? (a.unpriced ? 1 : -1) : sort === "asc" ? a.amountMinor - b.amountMinor : b.amountMinor - a.amountMinor,
      );
    return (
      <>
        <div className="mb-7 flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-2">
          <M_components_Tour_i0
            href={`/${locale}`}
            className={`shrink-0 rounded-xl border px-4 py-3 text-sm ${!category ? "border-violet-400/50 bg-violet-500/20 text-violet-200" : "border-white/10 text-slate-300"}`}
          >
            {t.all}
          </M_components_Tour_i0>
          {M_components_Catalog_i4.map((c) => (
            <M_components_Tour_i0
              key={c.slug}
              href={`/${locale}/${c.slug}`}
              className={`shrink-0 rounded-xl border px-4 py-3 text-sm ${category === c.slug ? "border-violet-400/50 bg-violet-500/20 text-violet-200" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
            >
              {c.title[locale]}
            </M_components_Tour_i0>
          ))}
        </div>
        <div className="mb-7 flex flex-wrap gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
            <M_components_Catalog_i2 size={18} className="text-slate-500" />
            <input
              aria-label={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 px-3">
            <M_components_Catalog_i3 size={16} />
            <select
              aria-label={locale === "uk" ? "Сортування" : locale === "ru" ? "Сортировка" : "Sort"}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-40 bg-[#0b0f19] py-3 text-sm"
            >
              <option value="default">{t.catalog}</option>
              <option value="asc">{locale === "uk" ? "Ціна ↑" : locale === "ru" ? "Цена ↑" : "Price ↑"}</option>
              <option value="desc">{locale === "uk" ? "Ціна ↓" : locale === "ru" ? "Цена ↓" : "Price ↓"}</option>
            </select>
          </label>
        </div>
        <p role="status" className="mb-5 text-xs text-amber-200/80">
          {t.demo}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) =>
            p.unpriced ? (
              <M_components_Tour_i0
                key={p.id}
                href={`/${locale}/product/${p.id}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <img
                  src={p.imageUrl}
                  alt={p.title[locale]}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={360}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-bold">{p.title[locale]}</h2>
                  <p className="mt-3 text-sm text-slate-400">{t.request}</p>
                </div>
              </M_components_Tour_i0>
            ) : (
              <M_components_ProductCard.ProductCard
                key={p.id}
                title={p.title[locale]}
                price={p.prices}
                stockStatus="on_request"
                imageUrl={p.imageUrl}
                category={M_components_Catalog_i4.find((c) => c.slug === p.category)?.title[locale] ?? p.category}
                locale={locale}
                href={`/${locale}/product/${p.id}`}
              />
            ),
          )}
        </div>
        {!filtered.length && <p className="rounded-2xl border border-white/10 p-10 text-center text-slate-400">{t.empty}</p>}
      </>
    );
  }
}
// components/CommerceAdmin.tsx
namespace M_components_CommerceAdmin {
  type Order = {
    id: string;
    status: string;
    currency: string;
    total: string;
    createdAt: string;
    user: {
      email: string | null;
      telegramId: string | null;
    };
    items: {
      id: string;
      titleSnapshot: string;
      quantity: number;
      provider: string | null;
      fulfillmentMode: string;
      fulfillmentStatus: string;
      fulfillmentJob?: {
        state: string;
        lastErrorCode: string | null;
      } | null;
      smmJob?: {
        state: string;
        remaining: number | null;
        providerOrderId: string | null;
        lastErrorCode: string | null;
      } | null;
    }[];
  };
  type Product = {
    id: string;
    slug: string;
    price: string;
    currency: string;
    active: boolean;
    kind: string;
    fulfillmentMode: string;
    version: number;
    provider: string | null;
    category: {
      slug: string;
    };
    translations: {
      locale: string;
      title: string;
    }[];
    _count: {
      inventory: number;
    };
  };
  type ProductDraft = {
    id?: string;
    slug: string;
    title?: string;
    titles: Record<"uk" | "ru" | "en", string>;
    price: string;
    currency: string;
    category: string;
    mode: string;
    active: boolean;
    version?: number;
  };
  type SmmRow = {
    id: string;
    serviceKey: string;
    quantity: number;
    state: string;
    remaining: number | null;
    attempts: number;
    providerOrderId: string | null;
    lastErrorCode: string | null;
    updatedAt: string;
    orderItem: {
      orderId: string;
      titleSnapshot: string;
    };
  };
  type AuditRow = {
    id: string;
    action: string;
    entityId: string;
    createdAt: string;
  };
  type Summary = {
    orders: number;
    manual: number;
    review: number;
    customers: number;
    revenue: {
      currency: string;
      _sum: {
        total: string | null;
      };
      _count: number;
    }[];
  };
  export function CommerceAdmin({locale = "uk"}: {locale?: M_components_Price_i1}) {
    const tr = (text: string) => M_components_AdminPanel_i0(locale, text);
    const [query, setQuery] = M_components_Tour_i1(""),
      [smmState, setSmmState] = M_components_Tour_i1(""),
      [smmPage, setSmmPage] = M_components_Tour_i1(1),
      [smmRows, setSmmRows] = M_components_Tour_i1<SmmRow[]>([]),
      [auditRows, setAuditRows] = M_components_Tour_i1<AuditRow[]>([]),
      [loading, setLoading] = M_components_Tour_i1(true);
    const [deferredQuery, setDeferredQuery] = M_components_Tour_i1("");
    M_components_FirstRun_i0(() => {
      const timer = setTimeout(() => setDeferredQuery(query.trim()), 300);
      return () => clearTimeout(timer);
    }, [query]);
    const loadController = M_components_FirstRun_i1<AbortController | null>(null),
      loadEpoch = M_components_FirstRun_i1(0),
      mutating = M_components_FirstRun_i1(false);
    const [storage, setStorage] = M_components_Tour_i1<{databaseMiB: number; users: number; lastCleanup: string | null; reviewStorage: boolean} | null>(null);
    const storageCopy = locale === "uk" ? {title:"Місце в базі",users:"Користувачів",cleanup:"Останнє очищення",waiting:"Очікуємо запуск worker",note:"Тимчасові дані — 3 дні. Платежі та замовлення зберігаються. Службові файли SQLite перевіряйте у Railway Volume.",warn:"База перевищила 700 МіБ — перевірте вільне місце Railway."} : locale === "ru" ? {title:"Место в базе",users:"Пользователей",cleanup:"Последняя очистка",waiting:"Ожидаем запуск worker",note:"Временные данные — 3 дня. Платежи и заказы сохраняются. Служебные файлы SQLite проверяйте в Railway Volume.",warn:"База превысила 700 МиБ — проверьте свободное место Railway."} : {title:"Database storage",users:"Users",cleanup:"Last cleanup",waiting:"Waiting for worker",note:"Temporary data: 3 days. Payments and orders are retained. Check SQLite system files in Railway Volume.",warn:"Database exceeds 700 MiB — check Railway free storage."};
    const [launch, setLaunch] = M_components_Tour_i1<{
        configurationReady: boolean;
        notice: string;
        checks: {
          id: string;
          ok: boolean;
          required: boolean;
          message: string;
        }[];
      } | null>(null),
      [tab, setTab] = M_components_Tour_i1("orders"),
      [overview, setOverview] = M_components_Tour_i1<Summary | null>(null),
      [orders, setOrders] = M_components_Tour_i1<Order[]>([]),
      [payments, setPayments] = M_components_Tour_i1<
        {
          id: string;
          provider: string;
          state: string;
          creditAmount: string;
          walletCurrency: string;
          providerReference: string | null;
        }[]
      >([]),
      [products, setProducts] = M_components_Tour_i1<Product[]>([]),
      [categories, setCategories] = M_components_Tour_i1<
        {
          slug: string;
          active: boolean;
        }[]
      >([]),
      [busy, setBusy] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1(""),
      [success, setSuccess] = M_components_Tour_i1(""),
      [status, setStatus] = M_components_Tour_i1(""),
      [page, setPage] = M_components_Tour_i1(1),
      [productPage, setProductPage] = M_components_Tour_i1(1),
      [delivery, setDelivery] = M_components_Tour_i1<{
        itemId: string;
        payload: string;
        reconciled: boolean;
      } | null>(null),
      [refund, setRefund] = M_components_Tour_i1<{
        orderId: string;
        reconciled: boolean;
      } | null>(null),
      [edit, setEdit] = M_components_Tour_i1<ProductDraft | null>(null),
      [inventory, setInventory] = M_components_Tour_i1<{
        productId: string;
        entries: string;
      } | null>(null);
    const load = M_hooks_useCloudStorage_i0(async () => {
      loadController.current?.abort();
      const controller = new AbortController();
      loadController.current = controller;
      const epoch = ++loadEpoch.current;
      setLoading(true);
      setError("");
      try {
        const request = (path: string) => M_components_ShopProvider.shopRequest(path, undefined, controller.signal);
        const [a, b, c, d, e, f, g] = await Promise.all([
          request("/api/admin/commerce/overview"),
          request(`/api/admin/commerce/orders?${new URLSearchParams({status, page: String(page), q: deferredQuery})}`),
          request(`/api/admin/commerce/products?${new URLSearchParams({q: deferredQuery, page: String(productPage)})}`),
          request("/api/admin/commerce/categories"),
          request("/api/admin/commerce/payments"),
          request(`/api/admin/commerce/smm?${new URLSearchParams({state: smmState, page: String(smmPage)})}`),
          request("/api/admin/commerce/audit"),
        ]);
        if (epoch !== loadEpoch.current || controller.signal.aborted) return;
        setOverview(a);
        setOrders(b);
        setProducts(c);
        setCategories(d);
        setPayments(e);
        setSmmRows(f);
        setAuditRows(g);
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(M_components_AdminPanel_i0(locale, "Не вдалося завантажити дані."));
          throw e;
        }
      } finally {
        if (epoch === loadEpoch.current && !controller.signal.aborted) setLoading(false);
      }
    }, [status, page, deferredQuery, smmState, smmPage, productPage, locale]);
    M_components_FirstRun_i0(() => {
      void load().catch(() => {});
      return () => loadController.current?.abort();
    }, [load]);
    async function checkReadiness() {
      try {
        const [readiness, size] = await Promise.all([M_components_ShopProvider.shopRequest("/api/admin/commerce/readiness"), M_components_ShopProvider.shopRequest("/api/admin/commerce/storage")]);
        setLaunch(readiness); setStorage(size);
      } catch { setError(tr("Не вдалося перевірити запуск.")); }
    }
    M_components_FirstRun_i0(() => { if (tab === "readiness") void checkReadiness(); }, [tab]);
    async function mutate(action: string, data: object) {
      if (mutating.current) return;
      mutating.current = true;
      setBusy(true);
      setError("");
      setSuccess("");
      try {
        await M_components_ShopProvider.shopRequest(`/api/admin/commerce/${action}`, data);
        setDelivery(null);
        setRefund(null);
        setEdit(null);
        setInventory(null);
        setSuccess(tr("Зміни збережено."));
        try {
          await load();
        } catch {
          setError(tr("Зміни збережено, але список не оновився. Натисни Оновити."));
        }
      } catch (e) {
        const code = (e as Error).message;
        setError(
          tr(
            ["version_or_mode_conflict", "conflict"].includes(code)
              ? "Товар уже змінено. Онови список перед збереженням."
              : code === "worker_active"
                ? "Замовлення зараз виконується. Дочекайся завершення."
                : "Дію не виконано. Перевір поля та стан замовлення.",
          ),
        );
      } finally {
        mutating.current = false;
        setBusy(false);
      }
    }
    return (
      <main className="commerce-admin" aria-busy={loading}>
        <div className="shop-account-heading">
          <div>
            <p className="eyebrow">LEGIT ASSETS / OPERATIONS</p>
            <M_components_LanguageSwitcher.LanguageSwitcher locale={locale} />
            <h1 className="shop-title">{tr("Керування магазином")}</h1>
          </div>
          <div className="admin-heading-actions">
            <button className="secondary-button" disabled={loading || busy} onClick={() => void load().catch(() => {})}>
              <M_components_CommerceAdmin_i12 size={16} />
              {tr("Оновити")}
            </button>
            <M_components_Tour_i0 className="secondary-button" href={`/admin?locale=${locale}`}>
              {tr("Верифікації та логотипи ↗")}
            </M_components_Tour_i0>
          </div>
        </div>
        <div className="admin-metrics">
          {[
            [
              M_components_Tour_i9,
              tr("Продажі"),
              overview?.revenue.map((r) => `${formatStoredMoney(r._sum.total)} ${r.currency}`).join(" · ") || "—",
            ],
            [M_components_Tour_i10, tr("Замовлення"), overview?.orders ?? "—"],
            [M_components_CommerceAdmin_i10, tr("Клієнти"), overview?.customers ?? "—"],
            [M_components_CommerceAdmin_i11, tr("Потребують перевірки"), overview?.review ?? "—"],
          ].map(([Icon, label, value], i) => {
            const Mark = Icon as typeof M_components_Tour_i9;
            return (
              <article className="shop-panel" key={i}>
                <Mark size={22} />
                <p>{label as string}</p>
                <strong>{value as string | number}</strong>
              </article>
            );
          })}
        </div>
        <div className="admin-tabs">
          {[
            ["orders", tr("Замовлення")],
            ["products", tr("Товари та склад")],
            ["smm", tr("SMM-черга")],
            ["audit", tr("Журнал змін")],
            ["payments", tr("Проблемні платежі")],
            ["categories", tr("Категорії")],
            ["logos", tr("Завантажити логотип")],
            ["readiness", tr("Готовність до запуску")],
          ].map(([key, label]) => (
            <button
              className={tab === key ? "active" : ""}
              key={key}
              aria-pressed={tab === key}
              onClick={() => {
                setTab(key);
                setQuery("");
                setPage(1);
                setProductPage(1);
              }}
            >
              {label}
            </button>
          ))}
          {error && (
            <p role="alert" className="shop-error">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="text-emerald-300">
              {success}
            </p>
          )}
        </div>
        <div className="admin-workspace-tools">
          {["orders", "products"].includes(tab) && (
            <label>
              <span>{tr("Пошук")}</span>
              <input
                type="search"
                value={query}
                maxLength={100}
                placeholder={tab === "orders" ? tr("ID, клієнт або товар") : tr("Назва або URL товару")}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                  setProductPage(1);
                }}
              />
            </label>
          )}
          <span role="status">{loading ? tr("Завантаження…") : tr("Дані оновлено")}</span>
        </div>
        {tab === "smm" && (
          <section className="shop-panel admin-data-section">
            <div className="admin-section-heading">
              <h2>{tr("SMM-черга")}</h2>
              <select
                aria-label={tr("Статус")}
                value={smmState}
                onChange={(e) => {
                  setSmmState(e.target.value);
                  setSmmPage(1);
                }}
              >
                <option value="">{tr("Усі статуси")}</option>
                {["QUEUED", "PREPARING", "SENDING", "RUNNING", "COMPLETED", "PARTIAL", "CANCELED", "FAILED", "UNKNOWN"].map((s) => (
                  <option key={s} value={s}>
                    {M_components_CommerceAdmin_i0(s, locale)}
                  </option>
                ))}
              </select>
            </div>
            <p className="shop-muted">
              {tr("Стан виконання та залишок у постачальника. Невизначені запити не відправляються повторно автоматично.")}
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{tr("Послуга")}</th>
                    <th>{tr("Статус")}</th>
                    <th>{tr("Кількість")}</th>
                    <th>{tr("Залишок")}</th>
                    <th>{tr("Оновлено")}</th>
                  </tr>
                </thead>
                <tbody>
                  {smmRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.orderItem.titleSnapshot}</strong>
                        <small>
                          {row.serviceKey} · #{row.providerOrderId ?? "—"}
                        </small>
                        <small>{row.orderItem.orderId}</small>
                      </td>
                      <td>
                        <span className={`admin-pill ${["FAILED", "UNKNOWN", "PARTIAL"].includes(row.state) ? "attention" : ""}`}>
                          {M_components_CommerceAdmin_i0(row.state, locale)}
                        </span>
                        {row.lastErrorCode && <small className="shop-error">{row.lastErrorCode}</small>}
                      </td>
                      <td>{row.quantity.toLocaleString(locale)}</td>
                      <td>{row.remaining ?? "—"}</td>
                      <td>{new Date(row.updatedAt).toLocaleString(locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && !smmRows.length && <p className="admin-empty">{tr("Немає завдань за цим фільтром.")}</p>}
            <div className="smm-pagination">
              <button disabled={loading || smmPage === 1} onClick={() => setSmmPage((p) => p - 1)}>
                ←
              </button>
              <span>{smmPage}</span>
              <button disabled={loading || smmRows.length < 50} onClick={() => setSmmPage((p) => p + 1)}>
                →
              </button>
            </div>
          </section>
        )}
        {tab === "audit" && (
          <section className="shop-panel admin-data-section">
            <h2>{tr("Журнал змін")}</h2>
            <p className="shop-muted">{tr("Останні 50 дій. Дані видачі та ключі API тут не показуються.")}</p>
            {auditRows.map((row) => (
              <div className="admin-audit-row" key={row.id}>
                <span>
                  <strong>{row.action}</strong>
                  <small>{row.entityId}</small>
                </span>
                <time>{new Date(row.createdAt).toLocaleString(locale)}</time>
              </div>
            ))}
            {!loading && !auditRows.length && <p className="admin-empty">{tr("Журнал поки порожній.")}</p>}
          </section>
        )}
        {tab === "readiness" && (
          <section className="shop-panel">
            <h2 className="text-xl font-semibold">
              {launch
                ? launch.configurationReady
                  ? tr("Конфігурація готова до приймання")
                  : tr("Потрібні налаштування")
                : tr("Перевіряємо…")}
            </h2>
            {storage && <div className="shop-panel my-4" role="status">
              <h3>{storageCopy.title}: {storage.databaseMiB.toLocaleString(locale)} MiB</h3>
              <p>{storageCopy.users}: {storage.users} · {storageCopy.cleanup}: {storage.lastCleanup ? new Date(storage.lastCleanup).toLocaleString(locale) : storageCopy.waiting}</p>
              <p className="shop-muted">{storageCopy.note}</p>
              {storage.reviewStorage && <p className="shop-error">{storageCopy.warn}</p>}
            </div>}
            <p className="shop-muted my-4">{launch?.notice && tr(launch.notice)}</p>
            {launch?.checks.map((c) => (
              <p className="py-2 border-b border-white/10" key={c.id}>
                <span className={c.ok ? "text-emerald-300" : c.required ? "text-red-300" : "text-amber-300"}>
                  {c.ok ? "✓" : c.required ? "✕" : "!"}{" "}
                </span>
                {tr(c.message)}
              </p>
            ))}
            <button
              className="secondary-button mt-4"
              onClick={() => void checkReadiness()}
            >
              {tr("Перевірити знову")}
            </button>
          </section>
        )}
        {tab === "orders" && (
          <>
            <div className="shop-panel admin-order-filters">
              <label>
                {tr("Статус")}
                <select
                  aria-label={tr("Статус")}
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                    setProductPage(1);
                  }}
                >
                  <option value="">{tr("Усі")}</option>
                  {["PENDING", "PAID", "FULFILLING", "COMPLETED", "NEEDS_REVIEW", "REFUNDED", "CANCELLED"].map((v) => (
                    <option key={v} value={v}>
                      {M_components_CommerceAdmin_i0(v, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={() => void load().catch(() => setError(tr("Помилка оновлення")))}>
                <M_components_CommerceAdmin_i12 size={17} />
              </button>
            </div>
            {!loading && !orders.length && <p className="shop-panel admin-empty">{tr("Замовлень за цими параметрами немає.")}</p>}
            {orders.map((o) => (
              <article className="shop-panel shop-order" key={o.id}>
                <div className="shop-order-heading">
                  <strong>#{o.id}</strong>
                  <span>{o.user.email ?? `TG ${o.user.telegramId}`}</span>
                  <span className="shop-status">{M_components_CommerceAdmin_i0(o.status, locale)}</span>
                  <strong>
                    {formatStoredMoney(o.total)} {o.currency}
                  </strong>
                </div>
                {o.items.map((i) => (
                  <div className="shop-order-item" key={i.id}>
                    <div>
                      <h3>
                        {i.titleSnapshot} × {i.quantity}
                      </h3>
                      <p className="shop-muted">
                        {tr(i.fulfillmentMode === "MANUAL" ? "Вручну" : i.fulfillmentMode === "INVENTORY" ? "Зі складу" : "Постачальник")} ·{" "}
                        {i.fulfillmentStatus === "PENDING"
                          ? tr("Очікує видачі")
                          : M_components_CommerceAdmin_i0(i.fulfillmentStatus, locale)}{" "}
                        · {i.smmJob?.state ?? i.fulfillmentJob?.state ?? ""}
                      </p>
                      {(i.smmJob?.lastErrorCode || i.fulfillmentJob?.lastErrorCode) && (
                        <p className="shop-error">{i.smmJob?.lastErrorCode ?? i.fulfillmentJob?.lastErrorCode}</p>
                      )}
                      {i.smmJob?.providerOrderId && (
                        <small>
                          JAP #{i.smmJob.providerOrderId} {tr("· залишок")} {i.smmJob.remaining ?? "—"}
                        </small>
                      )}
                    </div>
                    {i.fulfillmentStatus !== "DELIVERED" &&
                      !i.smmJob &&
                      i.fulfillmentMode !== "INVENTORY" &&
                      ["PAID", "FULFILLING", "NEEDS_REVIEW"].includes(o.status) && (
                        <button
                          className="secondary-button"
                          onClick={() =>
                            setDelivery({
                              itemId: i.id,
                              payload: "",
                              reconciled: false,
                            })
                          }
                        >
                          {tr("Видати товар")}
                        </button>
                      )}
                  </div>
                ))}
                {["PAID", "FULFILLING", "NEEDS_REVIEW", "COMPLETED"].includes(o.status) && (
                  <button className="shop-text-button" onClick={() => setRefund({orderId: o.id, reconciled: false})}>
                    {tr("Повернення коштів")}
                  </button>
                )}
              </article>
            ))}
            <div className="smm-pagination">
              <button disabled={loading || page === 1} onClick={() => setPage((p) => p - 1)}>
                ←
              </button>
              {page}
              <button disabled={loading || orders.length < 50} onClick={() => setPage((p) => p + 1)}>
                →
              </button>
            </div>
          </>
        )}
        {tab === "products" && (
          <>
            <div className="shop-panel mb-5">
              <p>{tr("Базова ціна + 20% націнки. Тарифи API-постачальників розраховуються окремо за актуальним каталогом.")}</p>
              <button
                className="primary-button mt-4"
                onClick={() =>
                  setEdit({
                    slug: "",
                    titles: {uk: "", ru: "", en: ""},
                    price: "10.00",
                    currency: "USD",
                    category: categories[0]?.slug ?? "verifications",
                    mode: "MANUAL",
                    active: false,
                  })
                }
              >
                <M_components_AdminPanel_i6 size={16} />
                {tr("Додати товар")}
              </button>
            </div>
            {products.map((p) => (
              <article className="shop-panel shop-order-item mb-3" key={p.id}>
                <div>
                  <h3>{p.translations.find((t) => t.locale === locale)?.title ?? p.slug}</h3>
                  <p className="shop-muted">
                    {p.price} {p.currency} · {p.fulfillmentMode} · {p.active ? tr("Опубліковано") : tr("Приховано")} {tr("· склад:")}{" "}
                    {p._count.inventory}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setEdit({
                        id: p.id,
                        slug: p.slug,
                        titles: {
                          uk: p.translations.find((t) => t.locale === "uk")?.title ?? p.slug,
                          ru: p.translations.find((t) => t.locale === "ru")?.title ?? p.slug,
                          en: p.translations.find((t) => t.locale === "en")?.title ?? p.slug,
                        },
                        price: p.price,
                        currency: p.currency,
                        category: p.category.slug,
                        mode: p.fulfillmentMode,
                        version: p.version,
                        active: p.active,
                      })
                    }
                  >
                    {tr("Редагувати")}
                  </button>
                  {p.fulfillmentMode === "INVENTORY" && (
                    <button onClick={() => setInventory({productId: p.id, entries: ""})}>
                      <M_components_CommerceAdmin_i14 size={18} />
                    </button>
                  )}
                </div>
              </article>
            ))}
            {!loading && !products.length && <p className="admin-empty">{tr("Послуг не знайдено.")}</p>}
            <div className="smm-pagination">
              <button disabled={loading || productPage === 1} onClick={() => setProductPage((p) => p - 1)}>
                ←
              </button>
              <span>{productPage}</span>
              <button disabled={loading || products.length < 50} onClick={() => setProductPage((p) => p + 1)}>
                →
              </button>
            </div>
          </>
        )}
        {tab === "categories" && (
          <section className="shop-panel">
            <h2>{tr("Категорії")}</h2>
            <form
              className="shop-deposit-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void mutate("category", {
                  slug: f.get("slug"),
                  title: f.get("title"),
                  active: true,
                });
              }}
            >
              <label>
                URL slug
                <input name="slug" pattern="[a-z0-9-]{2,60}" required />
              </label>
              <label>
                {tr("Назва")}
                <input name="title" maxLength={100} required />
              </label>
              <button className="primary-button" disabled={busy}>
                {tr("Додати")}
              </button>
            </form>
            {categories.map((c) => (
              <div className="shop-payment-row" key={c.slug}>
                <span>{c.slug}</span>
                <button
                  disabled={busy}
                  onClick={() =>
                    void mutate("category", {
                      slug: c.slug,
                      active: !c.active,
                    })
                  }
                >
                  {c.active ? tr("Приховати") : tr("Опублікувати")}
                </button>
              </div>
            ))}
          </section>
        )}
        {tab === "payments" && (
          <section className="shop-panel">
            <h2>{tr("Перевірка платежів")}</h2>
            <p className="shop-muted">
              {tr(
                "Повторна перевірка читає статус у провайдера. Вона не створює нову оплату. REFUNDING означає, що результат повернення Stars потрібно звірити з Telegram перед подальшими діями.",
              )}
            </p>
            {!payments.length && <p>{tr("Проблемних платежів немає.")}</p>}
            {payments.map((p) => (
              <div className="shop-payment-row" key={p.id}>
                <span>
                  {p.id}
                  <br />
                  {p.provider} · {M_components_CommerceAdmin_i0(p.state, locale)} · {p.creditAmount} {p.walletCurrency}
                  <br />
                  {p.providerReference ?? tr("ID провайдера невідомий — звірте в його кабінеті")}
                </span>
                <button
                  disabled={busy || !p.providerReference || p.state === "REFUNDING"}
                  onClick={() => void mutate("reconcile-payment", {id: p.id})}
                >
                  {tr("Перевірити статус")}
                </button>
              </div>
            ))}
          </section>
        )}
        {tab === "logos" && (
          <section className="shop-panel">
            <h2>{tr("Новий логотип біржі")}</h2>
            <p className="shop-muted">{tr("PNG, до 500 КБ, до 4096 × 4096. Після завантаження він з’явиться у бібліотеці верифікацій.")}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget),
                  file = f.get("png") as File;
                if (file.size > 500000) {
                  setError(tr("Файл завеликий"));
                  return;
                }
                const bytes = new Uint8Array(await file.arrayBuffer());
                let raw = "";
                for (const b of bytes) raw += String.fromCharCode(b);
                void mutate("logo", {
                  name: f.get("name"),
                  pngBase64: btoa(raw),
                });
              }}
            >
              <label>
                {tr("Біржа")}
                <input name="name" maxLength={100} required />
              </label>
              <label>
                {tr("Логотип")}
                <input type="file" name="png" accept="image/png" required />
              </label>
              <button className="primary-button" disabled={busy}>
                {tr("Завантажити")}
              </button>
            </form>
          </section>
        )}
        {(delivery || refund || edit || inventory) && (
          <M_components_AdminDialog.AdminDialog
            label={tr("Редагування")}
            locked={busy}
            onClose={() => {
              setDelivery(null);
              setRefund(null);
              setEdit(null);
              setInventory(null);
            }}
          >
            <section className="shop-panel shop-modal" aria-label={tr("Редагування")}>
              <button
                className="shop-modal-close"
                disabled={busy}
                onClick={() => {
                  setDelivery(null);
                  setRefund(null);
                  setEdit(null);
                  setInventory(null);
                }}
              >
                {tr("Закрити ×")}
              </button>
              {delivery && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void mutate("deliver", delivery);
                  }}
                >
                  <h2>{tr("Ручна видача")}</h2>
                  <p>{tr("Текст або реквізити будуть зашифровані й доступні покупцю.")}</p>
                  <label>
                    {tr("Дані видачі")}
                    <textarea
                      required
                      rows={8}
                      value={delivery.payload}
                      onChange={(e) => setDelivery({...delivery, payload: e.target.value})}
                    />
                  </label>
                  <label className="shop-terms">
                    <input
                      type="checkbox"
                      checked={delivery.reconciled}
                      onChange={(e) =>
                        setDelivery({
                          ...delivery,
                          reconciled: e.target.checked,
                        })
                      }
                    />
                    {tr("Результат закупівлі API перевірено вручну")}
                  </label>
                  <button className="primary-button" disabled={busy}>
                    {tr("Підтвердити видачу")}
                  </button>
                </form>
              )}
              {refund && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void mutate("refund", refund);
                  }}
                >
                  <h2>{tr("Повернення замовлення")}</h2>
                  <p className="admin-confirm-summary">
                    #{refund.orderId} · {orders.find((o) => o.id === refund.orderId)?.total}{" "}
                    {orders.find((o) => o.id === refund.orderId)?.currency}
                  </p>
                  <p>
                    {tr(
                      "WEB: кошти повернуться на внутрішній баланс. Stars: повернення через Telegram. Активну видачу спочатку потрібно завершити або звірити.",
                    )}
                  </p>
                  <label className="shop-terms">
                    <input
                      type="checkbox"
                      checked={refund.reconciled}
                      onChange={(e) => setRefund({...refund, reconciled: e.target.checked})}
                    />
                    {tr("Я перевірив видані товари та стан закупівлі у постачальника")}
                  </label>
                  <button className="primary-button" disabled={busy}>
                    {busy ? tr("Зберігаємо…") : tr("Виконати повернення")}
                  </button>
                </form>
              )}
              {edit && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void mutate("product", edit);
                  }}
                >
                  <h2>{edit.id ? tr("Редагувати товар") : tr("Новий товар")}</h2>
                  {[
                    ["slug", "URL slug"],
                    ["price", tr("Базова ціна")],
                  ].map(([k, l]) => (
                    <label key={k}>
                      {l}
                      <input
                        value={String(edit[k as keyof ProductDraft])}
                        required
                        onChange={(e) => setEdit({...edit, [k]: e.target.value})}
                      />
                    </label>
                  ))}
                  {(["uk", "ru", "en"] as const).map((language) => (
                    <label key={language}>
                      {tr("Назва")} · {language.toUpperCase()}
                      <input
                        required
                        maxLength={120}
                        value={edit.titles[language]}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            titles: {
                              ...edit.titles,
                              [language]: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                  <label>
                    {tr("Валюта")}
                    <select value={edit.currency} onChange={(e) => setEdit({...edit, currency: e.target.value})}>
                      {["USD", "UAH", "USDT"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {tr("Категорія")}
                    <select value={edit.category} onChange={(e) => setEdit({...edit, category: e.target.value})}>
                      {categories.map((c) => (
                        <option key={c.slug}>{c.slug}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {tr("Видача")}
                    <select disabled={Boolean(edit.id)} value={edit.mode} onChange={(e) => setEdit({...edit, mode: e.target.value})}>
                      <option value="MANUAL">{tr("Вручну")}</option>
                      <option value="INVENTORY">{tr("Зі складу")}</option>
                    </select>
                  </label>
                  <label className="shop-terms">
                    <input type="checkbox" checked={Boolean(edit.active)} onChange={(e) => setEdit({...edit, active: e.target.checked})} />
                    {tr("Опублікувати")}
                  </label>
                  <button className="primary-button" disabled={busy}>
                    {tr("Зберегти")}
                  </button>
                </form>
              )}
              {inventory && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void mutate("inventory", {
                      productId: inventory.productId,
                      entries: inventory.entries
                        .split(/\r?\n---\r?\n/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    });
                  }}
                >
                  <h2>{tr("Імпорт складу")}</h2>
                  <p>{tr("Один товар — один блок. Розділяй блоки окремим рядком із трьома дефісами: ---")}</p>
                  <label>
                    {tr("Дані")}
                    <textarea
                      rows={10}
                      value={inventory.entries}
                      required
                      onChange={(e) => setInventory({...inventory, entries: e.target.value})}
                    />
                  </label>
                  <button className="primary-button" disabled={busy}>
                    {tr("Імпортувати")}
                  </button>
                </form>
              )}
              {error && (
                <p role="alert" className="shop-error">
                  {error}
                </p>
              )}
            </section>
          </M_components_AdminDialog.AdminDialog>
        )}
      </main>
    );
  }
}
// components/Flag.tsx
namespace M_components_Flag {
  export function Flag({country}: {country: string}) {
    return (
      <img
        src={`/assets/flags/${country}.png`}
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 object-contain"
      />
    );
  }
}
// components/CountryGrid.tsx
namespace M_components_CountryGrid {
  export function CountryGrid({locale}: {locale: M_components_Price_i1}) {
    const t = M_components_CountryGrid_i7[locale];
    const [query, setQuery] = M_components_Tour_i1("");
    const visible = M_components_CountryGrid_i0(
      () =>
        M_components_CountryGrid_i5.filter((c) =>
          `${c} ${M_components_CountryGrid_i6(c, locale)}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)),
        ),
      [query, locale],
    );
    return (
      <section className="country-catalog">
        <h2 className="mb-2 text-2xl font-semibold">{t.chooseCountry}</h2>
        <p className="mb-7 text-slate-400">{t.countryIntro}</p>
        <label className="country-search">
          <M_components_Catalog_i2 size={18} />
          <input
            type="search"
            aria-label={locale === "uk" ? "Пошук країни" : locale === "ru" ? "Поиск страны" : "Find country"}
            placeholder={locale === "uk" ? "Країна або код…" : locale === "ru" ? "Страна или код…" : "Country or code…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="country-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((country) => (
            <M_components_Tour_i0
              key={country}
              href={`/${locale}/telegram-accounts/${country}?spam=no&sort=asc`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-violet-400/50 hover:bg-violet-500/10"
            >
              <span className="text-4xl" aria-hidden>
                <M_components_Flag.Flag country={country} />
              </span>
              <span>
                <span className="block text-lg font-semibold">{M_components_CountryGrid_i6(country, locale)}</span>
                <span className="text-xs text-slate-400">Telegram · {country}</span>
              </span>
              <M_components_AdminPanel_i13 className="ml-auto text-violet-300" size={20} />
            </M_components_Tour_i0>
          ))}
        </div>
        {!visible.length && (
          <p className="admin-empty">
            {locale === "uk" ? "Країну не знайдено" : locale === "ru" ? "Страна не найдена" : "Country not found"}
          </p>
        )}
      </section>
    );
  }
}
// components/ProfilePhoto.tsx
namespace M_components_ProfilePhoto {
  export function ProfilePhoto() {
    const {user, locale, refresh} = M_components_ShopProvider.useShop(),
      [src, setSrc] = M_components_Tour_i1(""),
      [busy, setBusy] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1(""),
      input = M_components_FirstRun_i1<HTMLInputElement>(null);
    const text =
      locale === "uk"
        ? {
            change: "Змінити фото",
            remove: "Прибрати фото",
            bad: "Обери PNG, JPEG або WebP до 2 МБ.",
            error: "Не вдалося змінити фото.",
          }
        : locale === "ru"
          ? {
              change: "Изменить фото",
              remove: "Убрать фото",
              bad: "Выбери PNG, JPEG или WebP до 2 МБ.",
              error: "Не удалось изменить фото.",
            }
          : {
              change: "Change photo",
              remove: "Remove photo",
              bad: "Choose PNG, JPEG or WebP up to 2 MB.",
              error: "Could not update photo.",
            };
    M_components_FirstRun_i0(() => {
      setSrc("");
      if (!user?.hasAvatar) return;
      let active = true,
        url = "";
      const controller = new AbortController();
      void fetch("/api/profile/avatar", {
        headers: M_components_ShopProvider.shopHeaders(),
        cache: "no-store",
        signal: controller.signal,
      })
        .then((r) => {
          if (!r.ok) throw Error();
          return r.blob();
        })
        .then((blob) => {
          if (active) {
            url = URL.createObjectURL(blob);
            setSrc(url);
          }
        })
        .catch(() => {});
      return () => {
        active = false;
        controller.abort();
        if (url) URL.revokeObjectURL(url);
      };
    }, [user?.id, user?.hasAvatar, user?.avatarUpdatedAt]);
    async function upload(file: File) {
      if (busy) return;
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
        setError(text.bad);
        M_hooks_useTelegramWebApp.haptic("error");
        return;
      }
      setBusy(true);
      setError("");
      try {
        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          headers: {
            ...M_components_ShopProvider.shopHeaders(),
            "Content-Type": file.type,
          },
          body: file,
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw Error();
        await refresh();
        M_hooks_useTelegramWebApp.haptic("success");
      } catch {
        setError(text.error);
        M_hooks_useTelegramWebApp.haptic("error");
      } finally {
        setBusy(false);
        if (input.current) input.current.value = "";
      }
    }
    return (
      <section className="profile-photo">
        <button className="profile-avatar" aria-label={text.change} aria-busy={busy} disabled={busy} onClick={() => input.current?.click()}>
          {src ? <img src={src} width={96} height={96} alt="" /> : <M_components_AppShell_i12 size={42} />}
          <span>
            <M_components_ProfilePhoto_i3 size={16} />
          </span>
        </button>
        <div>
          <button className="secondary-button" disabled={busy} onClick={() => input.current?.click()}>
            {text.change}
          </button>
          {user?.hasAvatar && (
            <button
              className="shop-text-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await M_components_ShopProvider.shopRequest("/api/profile/remove-avatar", {});
                  await refresh();
                } catch {
                  setError(text.error);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {text.remove}
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        {error && <p role="alert">{error}</p>}
      </section>
    );
  }
}
// components/CustomerAccount.tsx
namespace M_components_CustomerAccount {
  type Order = {
    id: string;
    status: string;
    currency: string;
    total: string;
    createdAt: string;
    items: {
      id: string;
      titleSnapshot: string;
      quantity: number;
      fulfillmentStatus: string;
      smmJob?: {
        state: string;
        remaining: number | null;
      } | null;
    }[];
  };
  type NftRecord = {
    id: string;
    name: string;
    baseNano: string;
    feeNano: string;
    state: string;
    createdAt: string;
  };
  type Payment = {
    id: string;
    state: string;
    provider: string;
    creditAmount: string;
    walletCurrency: string;
    paymentUrl: string | null;
  };
  type Ledger = {
    id: string;
    kind: string;
    amount: string;
    createdAt: string;
    wallet: {
      currency: string;
    };
  };
  export function CustomerAccount({view = "profile"}: {view?: "profile" | "history"}) {
    const {user, locale, botWallets, ready, refresh} = M_components_ShopProvider.useShop(),
      t = M_components_BuyButton_i2[locale],
      [orders, setOrders] = M_components_Tour_i1<Order[]>([]),
      [nfts, setNfts] = M_components_Tour_i1<NftRecord[]>([]),
      [payments, setPayments] = M_components_Tour_i1<Payment[]>([]),
      [ledger, setLedger] = M_components_Tour_i1<Ledger[]>([]),
      [error, setError] = M_components_Tour_i1(""),
      [busy, setBusy] = M_components_Tour_i1(false);
    const [historyLoading, setHistoryLoading] = M_components_Tour_i1(view === "history");
    const historyEpoch = M_components_FirstRun_i1(0);
    const load = M_hooks_useCloudStorage_i0(async () => {
      if (!user) return;
      const epoch = ++historyEpoch.current;
      setHistoryLoading(true);
      setError("");
      try {
        const [o, p, l, n] = await Promise.all([
          view === "history" ? M_components_ShopProvider.shopRequest("/api/shop/orders") : Promise.resolve([]),
          view === "profile" ? M_components_ShopProvider.shopRequest("/api/shop/payments") : Promise.resolve([]),
          view === "history" ? M_components_ShopProvider.shopRequest("/api/shop/transactions") : Promise.resolve([]),
          view === "history" ? M_components_ShopProvider.shopRequest("/api/nft/history") : Promise.resolve([]),
        ]);
        if (epoch !== historyEpoch.current) return;
        setOrders(o);
        setPayments(p);
        setLedger(l);
        setNfts(n);
        await refresh();
      } catch {
        if (epoch === historyEpoch.current) setError(t.error);
      } finally {
        if (epoch === historyEpoch.current) setHistoryLoading(false);
      }
    }, [user?.id, refresh, view, t.error]);
    M_components_FirstRun_i0(() => {
      if (!user) return;
      void load();
      const update = () => {
        if (!document.hidden && navigator.onLine) void load();
      };
      const timer = setInterval(update, 15000);
      document.addEventListener("visibilitychange", update);
      window.addEventListener("online", update);
      return () => {
        historyEpoch.current++;
        clearInterval(timer);
        document.removeEventListener("visibilitychange", update);
        window.removeEventListener("online", update);
      };
    }, [load, user?.id]);
    async function download(id: string) {
      setError("");
      try {
        const response = await fetch(`/api/shop/delivery/${encodeURIComponent(id)}`, {
          headers: M_components_ShopProvider.shopHeaders(),
          cache: "no-store",
        });
        if (!response.ok) throw Error("delivery_unavailable");
        const objectUrl = URL.createObjectURL(await response.blob());
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = `legit-assets-${id}.txt`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      } catch {
        setError(t.error);
      }
    }
    async function reconcile(id: string) {
      setBusy(true);
      try {
        await M_components_ShopProvider.shopRequest("/api/shop/reconcile", {
          id,
        });
        await load();
      } catch (e) {
        setError(M_components_ShoppingCart_i13((e as Error).message, locale));
      } finally {
        setBusy(false);
      }
    }
    if (!ready) return <p>{t.loading}</p>;
    if (!user)
      return (
        <section className="shop-panel">
          <h1>{M_components_CustomerAccount_i10[locale][view]}</h1>
          <M_components_Tour_i0 className="primary-button" href={`/${locale}/login`}>
            {t.login}
          </M_components_Tour_i0>
        </section>
      );
    return (
      <>
        <div className="shop-account-heading">
          <div>
            <p className="eyebrow">LEGIT / ACCOUNT</p>
            <h1 className="shop-title">{M_components_CustomerAccount_i10[locale][view]}</h1>
            <p className="shop-muted">
              {view === "profile" ? (user.displayName ?? user.email ?? `Telegram · ${user.telegramId}`) : t.orders}
            </p>
          </div>
          {view === "profile" && (
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await M_components_ShopProvider.shopRequest("/api/auth/logout", {});
                  await refresh();
                } catch {
                  setError(t.error);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {t.logout}
            </button>
          )}
        </div>
        {view === "profile" && (
          <>
            <M_components_ProfilePhoto.ProfilePhoto />
            <M_components_LanguageSwitcher.LanguageSwitcher locale={locale} />
            <div className="shop-wallet-grid">
              {["UAH", "GRAM"].map((c) => (
                <div className="shop-panel shop-wallet" key={c}>
                  <M_components_Tour_i9 size={24} />
                  <p>
                    {t.balance} · {c}
                  </p>
                  <strong>
                    {botWallets
                      ? Number(botWallets.find((w) => w.currency === c)?.balance ?? 0).toLocaleString(locale, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: c === "GRAM" ? 9 : 2,
                        })
                      : "—"}
                    <span>{c === "UAH" ? "₴" : "GRAM"}</span>
                  </strong>
                </div>
              ))}
            </div>
            <button
              className="primary-button profile-topup"
              onClick={() => {
                const url = M_components_CustomerAccount_i1(`miniapp_topup_${locale}`, "LegitAssetsBot", "").botUrl;
                const tg = window.Telegram?.WebApp;
                if (tg?.openTelegramLink) tg.openTelegramLink(url);
                else location.assign(url);
              }}
            >
              {locale === "uk" ? "Поповнити через бота" : locale === "ru" ? "Пополнить через бота" : "Top up through bot"}
            </button>
            <p className="shop-muted">
              {botWallets
                ? locale === "uk"
                  ? "Баланс синхронізовано з ботом"
                  : locale === "ru"
                    ? "Баланс синхронизирован с ботом"
                    : "Balance synced with bot"
                : locale === "uk"
                  ? "Баланс бота тимчасово недоступний"
                  : locale === "ru"
                    ? "Баланс бота временно недоступен"
                    : "Bot balance temporarily unavailable"}
            </p>
            <M_components_Tour_i0 className="profile-history-link" href={`/${locale}/history`}>
              <M_components_ProductCard_i4 size={19} />
              {M_components_CustomerAccount_i10[locale].history} →
            </M_components_Tour_i0>
          </>
        )}
        {error && (
          <p role="alert" className="shop-error">
            {error}
          </p>
        )}
        {payments.some((p) => p.state !== "PAID") && (
          <section className="shop-panel mt-5">
            <h2>{t.paymentPending}</h2>
            {payments
              .filter((p) => ["PENDING", "UNKNOWN", "CREATING"].includes(p.state))
              .map((p) => (
                <div className="shop-payment-row" key={p.id}>
                  <span>
                    {p.provider} · {p.creditAmount} {p.walletCurrency}
                  </span>
                  {p.paymentUrl && <a href={p.paymentUrl}>↗</a>}
                  <button disabled={busy} onClick={() => reconcile(p.id)}>
                    <M_components_CommerceAdmin_i12 size={15} />
                    {t.check}
                  </button>
                </div>
              ))}
          </section>
        )}
        {view === "history" && (
          <>
            <section className="shop-order-section">
              {nfts.length > 0 && (
                <>
                  <h2>NFT · GRAM</h2>
                  {nfts.map((n) => (
                    <article key={n.id} className="shop-panel shop-order">
                      <strong>{n.name}</strong>
                      <p>
                        {formatGramNano(n.baseNano,locale)}{" "}
                        GRAM
                      </p>
                      <p>
                        {nftHistoryStatus(n.state,locale)}
                      </p>
                      {n.state !== "COMPLETE" && n.state !== "DUPLICATE" && (
                        <M_components_Tour_i0 href={`/${locale}/nft-gifts?purchase=${n.id}`}>
                          {locale === "uk" ? "Продовжити" : locale === "ru" ? "Продолжить" : "Continue"} →
                        </M_components_Tour_i0>
                      )}
                      {n.state === "DUPLICATE" && <a href="https://t.me/LegitAssetsBot">{locale==='uk'?'Підтримка':locale==='ru'?'Поддержка':'Support'} →</a>}
                    </article>
                  ))}
                </>
              )}

              <div className="shop-section-title">
                <h2>
                  <M_components_ProductCard_i4 size={23} /> {t.orders}
                </h2>
                <button onClick={() => void load().catch(() => setError(t.error))}>
                  <M_components_CommerceAdmin_i12 size={17} />
                </button>
              </div>
              {historyLoading && (
                <p className="shop-muted" role="status">
                  {journeyCopy[locale].loading}
                </p>
              )}
              {!historyLoading && !error && !orders.length && !nfts.length && (
                <section className="client-empty" role="status">
                  <h3>{journeyCopy[locale].emptyHistory}</h3>
                  <p>{journeyCopy[locale].historyHint}</p>
                  <M_components_Tour_i0 className="primary-button" href={`/${locale}`}>
                    {journeyCopy[locale].discover}
                  </M_components_Tour_i0>
                </section>
              )}
              {orders.map((o) => (
                <article className="shop-panel shop-order" key={o.id}>
                  <div className="shop-order-heading">
                    <span>
                      #{o.id.slice(-9)} · {new Date(o.createdAt).toLocaleDateString(locale)}
                    </span>
                    <span className="shop-status">{M_components_CommerceAdmin_i0(o.status, locale)}</span>
                    <strong>
                      {formatStoredMoney(o.total)} {o.currency}
                    </strong>
                  </div>
                  {o.items.map((i) => (
                    <div className="shop-order-item" key={i.id}>
                      <div>
                        <h3>{i.titleSnapshot}</h3>
                        <p className="shop-muted">
                          ×{i.quantity} · {M_components_CommerceAdmin_i0(i.smmJob?.state ?? i.fulfillmentStatus, locale)}
                          {i.smmJob?.remaining != null ? ` · ${i.smmJob.remaining}` : ""}
                        </p>
                      </div>
                      {i.fulfillmentStatus === "DELIVERED" && !i.smmJob && o.status !== "REFUNDED" && (
                        <button className="secondary-button" onClick={() => void download(i.id)}>
                          <M_components_CustomerAccount_i8 size={16} />
                          {t.download}
                        </button>
                      )}
                    </div>
                  ))}
                </article>
              ))}
            </section>
            <section className="shop-panel">
              <h2>{t.transactions}</h2>
              {!ledger.length && <p className="shop-muted">{t.emptyTransactions}</p>}
              {ledger.map((l) => (
                <div className="shop-payment-row" key={l.id}>
                  <span>
                    {M_components_CommerceAdmin_i0(l.kind, locale)} · {new Date(l.createdAt).toLocaleDateString(locale)}
                  </span>
                  <strong>
                    {Number(l.amount) > 0 ? "+" : ""}
                    {formatStoredMoney(l.amount)} {l.wallet.currency}
                  </strong>
                </div>
              ))}
            </section>
          </>
        )}
      </>
    );
  }
}
// components/CustomerLogin.tsx
namespace M_components_CustomerLogin {
  export function CustomerLogin() {
    const {locale} = M_components_ShopProvider.useShop(),
      t = M_components_AppShell_i20[locale];
    return (
      <section className="shop-panel shop-empty">
        <h1>{t.profile}</h1>
        <p>{t.auth}</p>
        <a className="primary-button" href="https://t.me/LegitAssetsBot">
          {t.open}
        </a>
      </section>
    );
  }
}
// components/GiftHistory.tsx
namespace M_components_GiftHistory {
  export function GiftHistory({gift, locale}: {gift: M_components_GiftHistory_i4; locale: M_components_Price_i1}) {
    const t = M_components_AppShell_i20[locale],
      [events, setEvents] = M_components_Tour_i1<
        | {
            id: string;
            timestamp: number;
          }[]
        | null
      >(null),
      [failed, setFailed] = M_components_Tour_i1(false);
    M_components_FirstRun_i0(() => {
      setEvents(null);
      setFailed(false);
      if (!gift.isLive) {
        setEvents([]);
        return;
      }
      const abort = new AbortController();
      void fetch(`/api/gifts/${encodeURIComponent(gift.address)}/history`, {
        signal: abort.signal,
      })
        .then(async (r) => {
          if (!r.ok) throw Error("unavailable");
          return r.json();
        })
        .then((data) => {
          if (!abort.signal.aborted) setEvents(data.events);
        })
        .catch(() => {
          if (!abort.signal.aborted) setFailed(true);
        });
      return () => abort.abort();
    }, [gift.address, gift.isLive]);
    return (
      <section className="gift-history">
        <h3>{t.history}</h3>
        {failed ? (
          <p>{t.historyUnavailable}</p>
        ) : events === null ? (
          <p>{t.loading}</p>
        ) : !events.length ? (
          <p>{t.noHistory}</p>
        ) : (
          events.map((event) => (
            <a key={event.id} href={`https://tonviewer.com/transaction/${encodeURIComponent(event.id)}`} target="_blank" rel="noreferrer">
              {new Date(event.timestamp * 1000).toLocaleString(locale)} ↗
            </a>
          ))
        )}
      </section>
    );
  }
}
// components/NftCheckout.tsx
namespace M_components_NftCheckout {
  type Status = {
    id: string;
    state: string;
    name?: string;
    walletAddress?: string;
    fee?: string;
    feeTransaction?: M_components_NftCheckout_i8;
    feePending?: boolean;
  };
  const copy = {
    uk: {
      buy: "Підтвердити купівлю",
      wallet: "Підтвердити гаманець",
      check: "Перевірити отримання",
      fee: "Сплатити сервісний збір",
      complete: "NFT отримано. Оплату завершено.",
      received: "NFT вже у твоєму гаманці. Залишився сервісний збір 7%.",
      waiting: "Очікуємо підтвердження мережі…",
      note: "Купівля за GRAM. Сервісний збір 7% сплачується після отримання NFT. Мережеві витрати показує гаманець.",
      demo: "Це демонстраційний подарунок. Обери NFT із живого каталогу.",
      error: "Не вдалося завершити дію. Перевір гаманець і повтори спробу.",
      config: "Живі покупки ще не налаштовані власником магазину.",
      expired: "Термін транзакції минув. Перевір отримання перед новою спробою.",
    },
    en: {
      buy: "Confirm purchase",
      wallet: "Verify wallet",
      check: "Check delivery",
      fee: "Pay service fee",
      complete: "NFT received. Payment complete.",
      received: "NFT is in your wallet. The 7% service fee remains.",
      waiting: "Waiting for network confirmation…",
      note: "Buy with GRAM. Pay the 7% service fee after NFT delivery. Your wallet shows network costs.",
      demo: "Demo gift. Choose an NFT from the live catalog.",
      error: "Could not complete the action. Check your wallet and retry.",
      config: "Live purchases have not been configured by the shop owner.",
      expired: "Transaction expired. Check delivery before trying again.",
    },
    ru: {
      buy: "Подтвердить покупку",
      wallet: "Подтвердить кошелёк",
      check: "Проверить получение",
      fee: "Оплатить сервисный сбор",
      complete: "NFT получен. Оплата завершена.",
      received: "NFT уже в твоём кошельке. Остался сервисный сбор 7%.",
      waiting: "Ожидаем подтверждения сети…",
      note: "Покупка за GRAM. Сервисный сбор 7% оплачивается после получения NFT. Сетевые расходы показывает кошелёк.",
      demo: "Демонстрационный подарок. Выбери NFT из живого каталога.",
      error: "Не удалось завершить действие. Проверь кошелёк и повтори попытку.",
      config: "Живые покупки ещё не настроены владельцем магазина.",
      expired: "Транзакция истекла. Проверь получение перед новой попыткой.",
    },
  };
  export function NftCheckout({
    gift,
    locale,
    purchaseId,
  }: {
    gift?: M_components_GiftHistory_i4;
    locale: M_components_Price_i1;
    purchaseId?: string;
  }) {
    const [tc] = M_components_NftCheckout_i3(),
      wallet = M_components_NftCheckout_i4(),
      t = copy[locale];
    const [status, setStatus] = M_components_Tour_i1<Status | null>(null),
      [busy, setBusy] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1(""),
      [verified, setVerified] = M_components_Tour_i1("");
    const nonce = M_components_FirstRun_i1(""),
      alive = M_components_FirstRun_i1(true);
    const fail = (e: unknown) => {
      setError(/marketapp_(not_configured|access_required)/.test(e instanceof Error ? e.message : "") ? t.config : t.error);
      M_hooks_useTelegramWebApp.haptic("error");
    };
    M_components_FirstRun_i0(() => {
      alive.current = true;
      const off = tc.onStatusChange(async (w) => {
        if (!w || !nonce.current) return;
        const p = w.connectItems?.tonProof;
        if (!p || !("proof" in p)) return;
        nonce.current = "";
        try {
          const d = await M_components_ShopProvider.shopRequest("/api/nft/wallet", {
            address: w.account.address,
            chain: w.account.chain,
            proof: p.proof,
          });
          if (alive.current) setVerified(d.address);
        } catch (e) {
          if (alive.current) fail(e);
        }
      });
      return () => {
        alive.current = false;
        off();
      };
    }, [tc, locale]);
    M_components_FirstRun_i0(() => {
      if (!purchaseId) return;
      let active = true;
      void M_components_ShopProvider.shopRequest("/api/nft/status?id=" + encodeURIComponent(purchaseId))
        .then((s) => {
          if (active) setStatus(s);
        })
        .catch((e) => {
          if (active) fail(e);
        });
      return () => {
        active = false;
      };
    }, [purchaseId]);
    async function check() {
      if (!status) return;
      try {
        const s = await M_components_ShopProvider.shopRequest("/api/nft/status?id=" + status.id);
        if (alive.current) setStatus(s);
      } catch (e) {
        if (alive.current) fail(e);
      }
    }
    M_components_FirstRun_i0(() => {
      if (!status || !["PREPARED", "DELIVERED"].includes(status.state)) return;
      let active = true;
      const id = status.id;
      const timer = setInterval(() => {
        void M_components_ShopProvider.shopRequest("/api/nft/status?id=" + id)
          .then((s) => {
            if (active) setStatus(s);
          })
          .catch(() => {});
      }, 5000);
      return () => {
        active = false;
        clearInterval(timer);
      };
    }, [status?.id, status?.state]);
    async function connect() {
      const d = await M_components_ShopProvider.shopRequest("/api/nft/challenge", {});
      nonce.current = d.payload;
      if (tc.connected) await tc.disconnect();
      tc.setConnectRequestParameters({
        state: "ready",
        value: {tonProof: d.payload},
      });
      await tc.openModal();
    }
    async function buy() {
      M_hooks_useTelegramWebApp.haptic("light");
      setError("");
      setBusy(true);
      try {
        if (status?.state === "DELIVERED" && status.feeTransaction) {
          if (
            !wallet ||
            wallet.account.chain !== "-239" ||
            M_components_NftCheckout_i5.parse(wallet.account.address).toRawString() !== status.walletAddress
          ) {
            await connect();
            return;
          }
          const lease = await M_components_ShopProvider.shopRequest("/api/nft/fee", {id: status.id});
          setStatus({...status, feePending: true});
          await tc.sendTransaction({
            ...lease.transaction,
            network: "-239",
            from: wallet.account.address,
          });
          await check();
          return;
        }
        if (
          !wallet ||
          wallet.account.chain !== "-239" ||
          M_components_NftCheckout_i5.parse(wallet.account.address).toRawString() !== verified
        ) {
          await connect();
          return;
        }
        if (!gift?.isLive || !gift.baseNano) throw Error("demo");
        const quote = await M_components_ShopProvider.shopRequest("/api/nft/prepare", {
          address: gift.address,
          walletAddress: wallet.account.address,
          expectedBaseNano: gift.baseNano,
        });
        if (!alive.current) return;
        setStatus({...quote, walletAddress: verified});
        await tc.sendTransaction({
          ...quote.transaction,
          network: "-239",
          from: wallet.account.address,
        });
        M_hooks_useTelegramWebApp.haptic("light");
      } catch (e) {
        if (alive.current) fail(e);
      } finally {
        if (alive.current) setBusy(false);
      }
    }
    M_components_FirstRun_i0(() => {
      if (status?.state === "COMPLETE") M_hooks_useTelegramWebApp.haptic("success");
    }, [status?.state]);
    const state = status?.state,
      waiting = state === "PREPARED";
    return (
      <div className="nft-checkout">
        <p className="minimal-note" role="status">
          {state === "COMPLETE"
            ? t.complete
            : state === "DUPLICATE"
              ? locale === "uk"
                ? "Цю передачу вже зараховано іншому замовленню. Перевір історію."
                : locale === "ru"
                  ? "Эта передача уже учтена в другом заказе. Проверь историю."
                  : "This transfer is already recorded in another order. Check history."
              : status?.feePending
                ? t.waiting
                : state === "DELIVERED"
                  ? t.received
                  : waiting
                    ? t.waiting
                    : state === "EXPIRED"
                      ? t.expired
                      : gift?.isLive && gift.baseNano
                        ? t.note
                        : t.demo}
        </p>
        {error && <p role="alert">{error}</p>}
        {state !== "COMPLETE" && (
          <button
            className="primary-button"
            disabled={
              busy ||
              (!purchaseId && (!gift?.isLive || !gift.baseNano)) ||
              waiting ||
              status?.feePending ||
              state === "EXPIRED" ||
              state === "DUPLICATE"
            }
            onClick={() => void buy()}
          >
            {busy ? "…" : state === "DELIVERED" ? `${t.fee} · ${status?.fee} GRAM` : !verified ? t.wallet : t.buy}
          </button>
        )}
        {status && state !== "COMPLETE" && (
          <button className="secondary-button" disabled={busy} onClick={() => void check()}>
            {t.check}
          </button>
        )}
      </div>
    );
  }
}
// components/NftGiftsCatalog.tsx
namespace M_components_NftGiftsCatalog {
  export const MODEL_EMOJIS: Record<
    string,
    {
      emoji: string;
      label: string;
    }
  > = {
    "Mirage Lamp": {emoji: "🏮", label: "Вогняний Ліхтар"},
    "Chill Flame": {emoji: "🔥", label: "Крутий Факел"},
    "Snoop Dogg": {emoji: "🐶", label: "Бульдог Снуп"},
    "Fresh Socks": {emoji: "🧦", label: "Свіжі Шкарпетки"},
    "Astral Shard": {emoji: "🔮", label: "Астральний Осколок"},
    "Plush Pepe": {emoji: "🐸", label: "Плюшевий Пепе"},
    "Durov's Cap": {emoji: "🧢", label: "Кепка Дурова"},
    "Signet Ring": {emoji: "💍", label: "Золота Печатка"},
    "Crystal Ball": {emoji: "🔮", label: "Кришталева Куля"},
    "Magic Potion": {emoji: "🧪", label: "Магічне Зілля"},
    "Party Sparkler": {emoji: "🎇", label: "Бенгальський Вогник"},
    "Santa Hat": {emoji: "🎅", label: "Шапка Санти"},
    "Eternal Rose": {emoji: "🌹", label: "Вічна Троянда"},
    "Easter Egg": {emoji: "🥚", label: "Великоднє Яйце"},
    "Valentine Box": {emoji: "💝", label: "Валентинка Серце"},
    "Candy Cane": {emoji: "🍬", label: "Льодяник Трость"},
    "Diamond Ring": {emoji: "💎", label: "Діамантовий Перстень"},
    "Flying Broom": {emoji: "🧹", label: "Літаюча Мітла"},
    "Witch Hat": {emoji: "🧙", label: "Капелюх Відьми"},
  };
  export const CATEGORIES = [
    {id: "all", label: "Всі категорії", icon: "✨"},
    {id: "mythic", label: "Міфічні & Легендарні", icon: "👑"},
    {id: "epic", label: "Епічні & Рідкісні", icon: "⭐"},
    {id: "magic", label: "Магія & Артефакти", icon: "🔮"},
    {id: "light", label: "Світло & Вогонь", icon: "🕯️"},
    {id: "characters", label: "Персонажі", icon: "🐸"},
    {id: "jewelry", label: "Коштовності", icon: "💎"},
  ];
  export function isGiftInCategory(gift: M_components_GiftHistory_i4, catId: string): boolean {
    if (catId === "all") return true;
    const rarity = (gift.rarity || "").toLowerCase();
    const model = (gift.model || "").toLowerCase();
    if (catId === "mythic") {
      return rarity.includes("mythic") || rarity.includes("legendary") || rarity.includes("unique");
    }
    if (catId === "epic") {
      return rarity.includes("epic") || rarity.includes("rare");
    }
    if (catId === "magic") {
      return (
        model.includes("astral") ||
        model.includes("crystal") ||
        model.includes("potion") ||
        model.includes("broom") ||
        model.includes("witch")
      );
    }
    if (catId === "light") {
      return model.includes("lamp") || model.includes("flame") || model.includes("sparkler") || model.includes("candle");
    }
    if (catId === "characters") {
      return model.includes("pepe") || model.includes("snoop") || model.includes("cap") || model.includes("socks");
    }
    if (catId === "jewelry") {
      return model.includes("ring") || model.includes("rose") || model.includes("egg") || model.includes("valentine");
    }
    return true;
  }
  const copy = {
    uk: {
      search: "Швидкий пошук",
      all: "Усі",
      favorites: "Обрані",
      collection: "Колекція",
      model: "Модель",
      backdrop: "Фон",
      symbol: "Символ",
      rarity: "Рідкість",
      sort: "Ціна",
      asc: "Дешевші",
      desc: "Дорожчі",
      recent: "Нові",
      reset: "Скинути",
      empty: "Нічого не знайдено",
      buy: "Купити подарунок",
      close: "Закрити",
      history: "Історія",
      demo: "Демо-каталог",
      unavailable: "Купівля за GRAM тимчасово недоступна: передачу подарунків ще не підключено.",
      confirm: "Перевір подарунок і ціну перед купівлею.",
      price: "Ціна",
      refresh: "Не вдалося оновити каталог",
      min: "Від, GRAM",
      max: "До, GRAM",
      rangeError: "Вкажи додатні ціни: «Від» має бути не більше за «До».",
    },
    en: {
      search: "Quick find",
      all: "All",
      favorites: "Favorites",
      collection: "Collection",
      model: "Model",
      backdrop: "Backdrop",
      symbol: "Symbol",
      rarity: "Rarity",
      sort: "Price",
      asc: "Lowest price",
      desc: "Highest price",
      recent: "Newest",
      reset: "Reset",
      empty: "No gifts found",
      buy: "Buy gift",
      close: "Close",
      history: "History",
      demo: "Demo catalog",
      unavailable: "GRAM checkout is temporarily unavailable: gift transfer is not connected yet.",
      confirm: "Check the gift and price before buying.",
      price: "Price",
      refresh: "Catalog refresh failed",
      min: "Min, GRAM",
      max: "Max, GRAM",
      rangeError: "Enter nonnegative prices: minimum must not exceed maximum.",
    },
    ru: {
      search: "Быстрый поиск",
      all: "Все",
      favorites: "Избранные",
      collection: "Коллекция",
      model: "Модель",
      backdrop: "Фон",
      symbol: "Символ",
      rarity: "Редкость",
      sort: "Цена",
      asc: "Дешевле",
      desc: "Дороже",
      recent: "Новые",
      reset: "Сбросить",
      empty: "Ничего не найдено",
      buy: "Купить подарок",
      close: "Закрыть",
      history: "История",
      demo: "Демо-каталог",
      unavailable: "Покупка за GRAM временно недоступна: передача подарков ещё не подключена.",
      confirm: "Проверь подарок и цену перед покупкой.",
      price: "Цена",
      refresh: "Не удалось обновить каталог",
      min: "От, GRAM",
      max: "До, GRAM",
      rangeError: "Укажи неотрицательные цены: «От» должно быть не больше «До».",
    },
  };
  function validateFavorites(value: unknown): string[] {
    return Array.isArray(value)
      ? [...new Set(value.filter((id): id is string => typeof id === "string" && id.length <= 128))].slice(0, 40)
      : [];
  }
  function amount(gift: M_components_GiftHistory_i4, locale: M_components_Price_i1) {
    return gift.priceGram.toLocaleString(locale, {maximumFractionDigits: 9}) + " GRAM";
  }
  function title(gift: M_components_GiftHistory_i4) {
    return gift.name.replace(/\s*#\d+$/, "");
  }
  const GiftCard = M_components_ProductCard_i5(function GiftCard({
    gift,
    locale,
    favorite,
    onOpen,
    onFavorite,
  }: {
    gift: M_components_GiftHistory_i4;
    locale: M_components_Price_i1;
    favorite: boolean;
    onOpen: (gift: M_components_GiftHistory_i4) => void;
    onFavorite: (id: string) => void;
  }) {
    return (
      <article className="nft-gift-card minimal-gift-card">
        <button className="gift-preview" aria-label={gift.name} onClick={() => onOpen(gift)}>
          <M_components_AnimatedGiftEmoji.AnimatedGiftEmoji imageUrl={gift.image} alt={gift.name} mode="card" />
        </button>
        <button
          className="gift-favorite"
          aria-label={`${copy[locale].favorites}: ${gift.name}`}
          aria-pressed={favorite}
          onClick={() => onFavorite(gift.id)}
        >
          <M_components_NftGiftsCatalog_i9 size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
        <div className="gift-card-details">
          <button className="gift-name" onClick={() => onOpen(gift)}>
            {title(gift)}
          </button>
          <p className="minimal-item-number">#{gift.itemNum ?? "—"}</p>
          <div className="minimal-card-actions">
            <button className="minimal-price" onClick={() => onOpen(gift)}>
              {amount(gift, locale)}
            </button>
            <button className="minimal-buy-icon" aria-label={copy[locale].buy} onClick={() => onOpen(gift)}>
              <M_components_Tour_i8 size={18} />
            </button>
          </div>
        </div>
      </article>
    );
  });
  export function NftGiftsCatalog({
    locale,
    initialGifts = [],
    tonRate = 1.6,
    liveApi = false,
    binance,
  }: {
    locale: M_components_Price_i1;
    initialGifts?: M_components_GiftHistory_i4[];
    tonRate?: number;
    liveApi?: boolean;
    binance?: M_components_NftGiftsCatalog_i17;
  }) {
    const t = copy[locale];
    const purchaseId = M_components_ShoppingCart_i1().get("purchase") || undefined;
    const [gifts, setGifts] = M_components_Tour_i1(initialGifts),
      [loading, setLoading] = M_components_Tour_i1(!initialGifts.length),
      [live, setLive] = M_components_Tour_i1(liveApi),
      [error, setError] = M_components_Tour_i1(false);
    const [search, setSearch] = M_components_Tour_i1(""),
      query = M_components_NftGiftsCatalog_i4(search.trim().toLowerCase());
    const [filters, setFilters] = M_components_Tour_i1({
      collection: "",
      model: "",
      backdrop: "",
      symbol: "",
      rarity: "",
    });
    const [sort, setSort] = M_components_Tour_i1("recent"),
      [minimum, setMinimum] = M_components_Tour_i1(""),
      [maximum, setMaximum] = M_components_Tour_i1(""),
      [advanced, setAdvanced] = M_components_Tour_i1(false);
    const [favoritesOnly, setFavoritesOnly] = M_components_Tour_i1(false),
      [favorites, setFavorites] = M_hooks_useCloudStorage.useCloudStorage<string[]>("legit-gift-favorites", [], validateFavorites);
    const [selected, setSelected] = M_components_Tour_i1<M_components_GiftHistory_i4 | null>(null),
      [confirm, setConfirm] = M_components_Tour_i1(false);
    const browseState = M_components_FirstRun_i1({search, filters, sort, minimum, maximum, favoritesOnly, advanced});
    browseState.current = {search, filters, sort, minimum, maximum, favoritesOnly, advanced};
    const preferencesKey = () =>
      `legit-nft-browse:${new URLSearchParams(window.Telegram?.WebApp?.initData || "").get("user") || "preview"}`;
    M_components_FirstRun_i0(() => {
      try {
        const saved = validNftBrowseState(JSON.parse(sessionStorage.getItem(preferencesKey()) || "null"));
        if (saved) {
          setSearch(saved.search);
          setFilters(saved.filters);
          setSort(saved.sort);
          setMinimum(saved.minimum);
          setMaximum(saved.maximum);
          setFavoritesOnly(saved.favoritesOnly);
          setAdvanced(saved.advanced);
        }
      } catch {}
    }, []);
    M_components_FirstRun_i0(() => {
      const save = () => {
        try {
          sessionStorage.setItem(preferencesKey(), JSON.stringify(browseState.current));
        } catch {}
      };
      const timer = setTimeout(save, 250);
      return () => {
        clearTimeout(timer);
        save();
      };
    }, [search, filters, sort, minimum, maximum, favoritesOnly, advanced]);
    const deepLinkHandled = M_components_FirstRun_i1(false);
    const openGift = M_hooks_useCloudStorage_i0((gift: M_components_GiftHistory_i4) => {
      M_hooks_useTelegramWebApp.haptic("light");
      setConfirm(false);
      setSelected(gift);
    }, []);
    const closeGift = M_hooks_useCloudStorage_i0(() => {
      setSelected(null);
      setConfirm(false);
    }, []);
    const toggleFavorite = M_hooks_useCloudStorage_i0(
      (id: string) => {
        M_hooks_useTelegramWebApp.haptic("selection");
        setFavorites((previous) => (previous.includes(id) ? previous.filter((v) => v !== id) : [...previous, id].slice(-40)));
      },
      [setFavorites],
    );
    M_components_FirstRun_i0(() => {
      const abort = new AbortController();
      async function load() {
        if (document.hidden) return;
        try {
          const r = await fetch("/api/gifts?limit=60", {
            signal: AbortSignal.any([abort.signal, AbortSignal.timeout(20000)]),
          });
          const d = await r.json();
          if (!r.ok || !d.ok || !Array.isArray(d.items)) throw Error();
          if (!abort.signal.aborted) {
            setGifts(d.items);
            setLive(d.liveApi);
            setError(false);
          }
        } catch {
          if (!abort.signal.aborted) setError(true);
        } finally {
          if (!abort.signal.aborted) setLoading(false);
        }
      }
      void load();
      const timer = setInterval(() => void load(), 60000);
      return () => {
        abort.abort();
        clearInterval(timer);
      };
    }, [initialGifts.length]);
    M_components_FirstRun_i0(() => {
      if (deepLinkHandled.current) return;
      const id = new URLSearchParams(location.search).get("gift");
      const found = gifts.find((g) => g.id === id || g.address === id);
      if (found) {
        deepLinkHandled.current = true;
        openGift(found);
      }
    }, [gifts, openGift]);
    const options = M_components_CountryGrid_i0(
      () =>
        Object.fromEntries(Object.keys(filters).map((key) => [key, [...new Set(gifts.map((g) => g[key as keyof typeof filters]))].sort()])),
      [gifts],
    );
    const invalidRange =
      (minimum !== "" && (!Number.isFinite(Number(minimum)) || Number(minimum) < 0)) ||
      (maximum !== "" && (!Number.isFinite(Number(maximum)) || Number(maximum) < 0)) ||
      (minimum !== "" && maximum !== "" && Number(minimum) > Number(maximum));
    const visible = M_components_CountryGrid_i0(
      () =>
        invalidRange
          ? []
          : gifts
              .filter(
                (g) =>
                  (!favoritesOnly || favorites.includes(g.id)) &&
                  (!query ||
                    [g.name, g.id, g.model, g.symbol, g.backdrop, String(g.itemNum)].some((v) => v.toLowerCase().includes(query))) &&
                  Object.entries(filters).every(([key, value]) => !value || g[key as keyof typeof filters] === value) &&
                  (!minimum || g.priceGram >= Number(minimum)) &&
                  (!maximum || g.priceGram <= Number(maximum)),
              )
              .sort((a, b) =>
                sort === "asc" ? a.priceGram - b.priceGram : sort === "desc" ? b.priceGram - a.priceGram : b.listedAt - a.listedAt,
              ),
      [gifts, favoritesOnly, favorites, query, filters, minimum, maximum, sort, invalidRange],
    );
    const reset = () => {
      setSearch("");
      setFilters({
        collection: "",
        model: "",
        backdrop: "",
        symbol: "",
        rarity: "",
      });
      setMinimum("");
      setMaximum("");
      setFavoritesOnly(false);
      setSort("recent");
      M_hooks_useTelegramWebApp.haptic("selection");
    };
    return (
      <section className="nft-catalog minimal-catalog" aria-label="NFT" aria-busy={loading}>
        <div className="minimal-toolbar">
          <div className="nft-controls">
            <label className="gift-search">
              <M_components_Catalog_i2 size={19} />
              <input
                aria-label={t.search}
                placeholder={t.search}
                maxLength={128}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="search-clear" aria-label={journeyCopy[locale].clearSearch} onClick={() => setSearch("")}>
                  <M_components_Tour_i5 size={16} />
                </button>
              )}
            </label>
            <button
              className="minimal-tool"
              aria-label={t.favorites}
              aria-pressed={favoritesOnly}
              onClick={() => {
                setFavoritesOnly((v) => !v);
                M_hooks_useTelegramWebApp.haptic("selection");
              }}
            >
              <M_components_NftGiftsCatalog_i9 size={19} />
            </button>
            <button
              className="minimal-tool"
              aria-label={t.sort}
              aria-expanded={advanced}
              onClick={() => {
                setAdvanced((v) => !v);
                M_hooks_useTelegramWebApp.haptic("selection");
              }}
            >
              <M_components_AdminPanel_i13 size={19} />
            </button>
          </div>
          <div className="minimal-filter-strip">
            {(["collection", "model", "backdrop"] as const).map((key) => (
              <label className="minimal-filter" key={key}>
                <span>{t[key]}</span>
                <select
                  aria-label={t[key]}
                  value={filters[key]}
                  onChange={(e) => {
                    setFilters((v) => ({...v, [key]: e.target.value}));
                    M_hooks_useTelegramWebApp.haptic("selection");
                  }}
                >
                  <option value="">{t.all}</option>
                  {options[key]?.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {advanced && (
            <div className="minimal-advanced">
              {(["symbol", "rarity"] as const).map((key) => (
                <label key={key}>
                  {t[key]}
                  <select
                    value={filters[key]}
                    onChange={(e) => {
                      setFilters((v) => ({...v, [key]: e.target.value}));
                      M_hooks_useTelegramWebApp.haptic("selection");
                    }}
                  >
                    <option value="">{t.all}</option>
                    {options[key]?.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>
              ))}
              <label>
                {t.sort}
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    M_hooks_useTelegramWebApp.haptic("selection");
                  }}
                >
                  <option value="recent">{t.recent}</option>
                  <option value="asc">{t.asc}</option>
                  <option value="desc">{t.desc}</option>
                </select>
              </label>
              {[
                [t.min, minimum, setMinimum],
                [t.max, maximum, setMaximum],
              ].map(([label, value, setter]) => (
                <label key={String(label)}>
                  {String(label)}
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={String(value)}
                    aria-invalid={invalidRange}
                    onChange={(e) => (setter as typeof setMinimum)(e.target.value)}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="nft-results-bar">
          <span>
            {visible.length} {live ? "NFT" : t.demo}
          </span>
          <button onClick={reset}>{t.reset}</button>
        </div>
        {error && (
          <p role="alert" className="minimal-note">
            {t.refresh}
          </p>
        )}
        {purchaseId && <M_components_NftCheckout.NftCheckout key={purchaseId} purchaseId={purchaseId} locale={locale} />}
        <div className="nft-grid">
          {invalidRange && (
            <p className="shop-error" role="alert">
              {t.rangeError}
            </p>
          )}
          {loading
            ? Array.from({length: 6}, (_, i) => <div className="nft-skeleton" key={i} />)
            : visible.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  locale={locale}
                  favorite={favorites.includes(gift.id)}
                  onOpen={openGift}
                  onFavorite={toggleFavorite}
                />
              ))}
        </div>
        {!loading && !visible.length && (
          <section className="nft-empty client-empty" role="status">
            <h2>{favoritesOnly && !favorites.length ? journeyCopy[locale].emptyFavorites : t.empty}</h2>
            {favoritesOnly && !favorites.length && <p>{journeyCopy[locale].favoriteHint}</p>}
            <button className="secondary-button" onClick={reset}>
              {journeyCopy[locale].showAll}
            </button>
          </section>
        )}
        {selected && (
          <M_components_BottomSheet.BottomSheet titleId="gift-dialog-title" onClose={closeGift} locale={locale}>
            <section className={`minimal-sheet ${confirm ? "minimal-confirm" : ""}`}>
              {confirm ? (
                <>
                  <h2 id="gift-dialog-title">{t.buy}</h2>
                  <p className="minimal-note">{t.confirm}</p>
                  <div className="minimal-order-summary">
                    <M_components_AnimatedGiftEmoji.AnimatedGiftEmoji imageUrl={selected.image} alt={selected.name} mode="card" />
                    <div>
                      <strong>{title(selected)}</strong>
                      <p>#{selected.itemNum ?? "—"}</p>
                      <strong>{amount(selected, locale)}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="minimal-hero">
                  <M_components_AnimatedGiftEmoji.AnimatedGiftEmoji
                    imageUrl={selected.image}
                    lottieUrl={selected.lottieUrl}
                    alt={selected.name}
                    mode="modal"
                  />
                  <div>
                    <h2 id="gift-dialog-title">{title(selected)}</h2>
                    <p>#{selected.itemNum ?? "—"}</p>
                  </div>
                </div>
              )}
              <dl className="gift-attributes">
                {Object.entries(selected.attributes).map(([key, value]) => (
                  <div key={key}>
                    <dt>
                      {(
                        {
                          Model: t.model,
                          Backdrop: t.backdrop,
                          Symbol: t.symbol,
                          Rarity: t.rarity,
                        } as Record<string, string>
                      )[key] ?? key}
                    </dt>
                    <dd>{key === "Rarity" ? M_components_NftGiftsCatalog_i1(String(value), locale) : String(value)}</dd>
                  </div>
                ))}
                <div>
                  <dt>{t.price}</dt>
                  <dd>{amount(selected, locale)}</dd>
                </div>
              </dl>
              {!confirm && (
                <details className="minimal-history">
                  <summary>{t.history}</summary>
                  <M_components_GiftHistory.GiftHistory gift={selected} locale={locale} />
                </details>
              )}
              {confirm && <M_components_NftCheckout.NftCheckout key={selected.id} gift={selected} locale={locale} />}
              <div className="minimal-sheet-actions">
                <button className="secondary-button" onClick={confirm ? () => setConfirm(false) : closeGift}>
                  {t.close}
                </button>
                {!confirm && (
                  <button
                    className="primary-button"
                    onClick={() => {
                      M_hooks_useTelegramWebApp.haptic("light");
                      setConfirm(true);
                    }}
                  >
                    {t.buy}
                    <small>{amount(selected, locale)}</small>
                  </button>
                )}
              </div>
            </section>
          </M_components_BottomSheet.BottomSheet>
        )}
      </section>
    );
  }
}
// components/RouteSheet.tsx
namespace M_components_RouteSheet {
  export function RouteSheet({children, locale}: {children: React.ReactNode; locale: M_components_Price_i1}) {
    const router = M_components_FirstRun_i4(),
      close = M_hooks_useCloudStorage_i0(() => router.back(), [router]);
    return (
      <M_components_BottomSheet.BottomSheet titleId="route-detail-title" onClose={close} locale={locale}>
        <h2 id="route-detail-title" className="sr-only">
          {M_components_AppShell_i20[locale].catalog}
        </h2>
        <div className="route-sheet-content">{children}</div>
      </M_components_BottomSheet.BottomSheet>
    );
  }
}
// components/ShoppingCart.tsx
namespace M_components_ShoppingCart {
  export function ShoppingCart() {
    const {cart, user, locale, remove, ready, replaceCart} = M_components_ShopProvider.useShop(),
      t = M_components_AppShell_i20[locale],
      ct = M_components_BuyButton_i2[locale];
    const [quote, setQuote] = M_components_Tour_i1<{
        lines: {
          title: string;
          prices: M_components_Price_i0;
        }[];
        total: M_components_Price_i0;
      } | null>(null),
      [busy, setBusy] = M_components_Tour_i1(false),
      [terms, setTerms] = M_components_Tour_i1(false),
      [error, setError] = M_components_Tour_i1("");
    const quoteKey = M_components_FirstRun_i1("");
    const checkoutLock = M_components_FirstRun_i1(false);
    const [quoteRetry, setQuoteRetry] = M_components_Tour_i1(0);
    const [handoffError, setHandoffError] = M_components_Tour_i1("");
    const [claimRetry, setClaimRetry] = M_components_Tour_i1(0);
    const params = M_components_ShoppingCart_i1(),
      router = M_components_FirstRun_i4(),
      claimed = M_components_FirstRun_i1("");
    M_components_FirstRun_i0(() => {
      const token = params.get("handoff");
      if (!token || !user || user.channel !== "TMA" || claimed.current === token) return;
      claimed.current = token;
      setHandoffError("");
      void M_components_ShopProvider.shopRequest("/api/shop/handoff/claim", {
        token,
        locale,
      })
        .then((data) => {
          replaceCart(data.items);
          router.replace(`/${locale}/cart`);
        })
        .catch((e) => setHandoffError(M_components_ShoppingCart_i13(e.message, locale)));
    }, [params, user, locale, replaceCart, router, claimRetry]);
    const input = JSON.stringify(
        cart.map(({kind, id, quantity, link}) => ({
          kind,
          id,
          quantity,
          link,
        })),
      ),
      generation = M_components_FirstRun_i1(0);
    M_components_FirstRun_i0(() => {
      let active = true;
      const epoch = ++generation.current;
      const controller = new AbortController();
      quoteKey.current = "";
      setQuote(null);
      setError("");
      setTerms(false);
      if (user && cart.length)
        void M_components_ShopProvider.shopRequest("/api/shop/quote", {items: JSON.parse(input), locale}, controller.signal)
          .then((q) => {
            if (active && epoch === generation.current) {
              quoteKey.current = input;
              setQuote(q);
            }
          })
          .catch((e) => {
            if (active) setError(M_components_ShoppingCart_i13(e.message, locale));
          });
      return () => {
        active = false;
        controller.abort();
      };
    }, [input, locale, user?.id, user?.onboardingCompletedAt, quoteRetry]);
    const quoteReady = Boolean(quote && quoteKey.current === input && !error && !params.get("handoff"));
    const checkout = M_hooks_useCloudStorage_i0(async () => {
      if (checkoutLock.current || busy || !terms || !ready || !user || !quoteReady) return;
      checkoutLock.current = true;
      setBusy(true);
      setError("");
      try {
        const data = await M_components_ShopProvider.shopRequest("/api/shop/handoff/create", {
          items: JSON.parse(input),
          locale,
        });
        const app = window.Telegram?.WebApp;
        if (!/^https:\/\/t\.me\/LegitAssetsBot\?start=buy_/.test(data.url)) throw Error("invalid_handoff");
        if (app?.openTelegramLink) app.openTelegramLink(data.url);
        else location.assign(data.url);
      } catch (e) {
        M_hooks_useTelegramWebApp.haptic("error");
        setError(M_components_ShoppingCart_i13((e as Error).message, locale));
      } finally {
        checkoutLock.current = false;
        setBusy(false);
      }
    }, [busy, terms, ready, user, input, locale, quoteReady]);
    const callback = M_components_FirstRun_i1(checkout);
    callback.current = checkout;
    M_components_FirstRun_i0(() => {
      const button = window.Telegram?.WebApp?.MainButton;
      if (!button || !cart.length) return;
      const disabled = busy || !terms || !ready || !user || !quoteReady;
      button.setText(t.botCheckout);
      button.show();
      disabled ? button.disable() : button.enable();
      busy ? button.showProgress() : button.hideProgress();
      const click = () => {
        if (!disabled) void callback.current();
      };
      button.onClick(click);
      return () => {
        button.offClick(click);
        button.hideProgress();
        button.hide();
      };
    }, [busy, terms, ready, user, cart.length, t.botCheckout, quoteReady]);
    if (!cart.length)
      return (
        <section className="shop-panel shop-empty">
          <M_components_Tour_i8 size={40} />
          <h1>{params.get("handoff") ? handoffError || t.loading : t.empty}</h1>
          {handoffError && (
            <button
              className="secondary-button"
              onClick={() => {
                claimed.current = "";
                setClaimRetry((n) => n + 1);
              }}
            >
              {ct.retry}
            </button>
          )}
          <M_components_Tour_i0 className="primary-button" href={`/${locale}`}>
            {t.catalog}
          </M_components_Tour_i0>
        </section>
      );
    return (
      <section className="checkout-page">
        <span className="blue-eyebrow">LEGIT / CHECKOUT</span>
        <h1 className="shop-title">
          {t.cart}
          <span>{cart.length}</span>
        </h1>
        {handoffError && (
          <div className="session-status" role="alert">
            <p>{handoffError}</p>
            <button
              className="secondary-button"
              onClick={() => {
                claimed.current = "";
                setClaimRetry((n) => n + 1);
              }}
            >
              {ct.retry}
            </button>
          </div>
        )}
        <div className="shop-checkout-layout">
          <div className="shop-cart-list">
            {cart.map((item, i) => (
              <article className="shop-panel shop-cart-row" key={`${item.kind}:${item.id}:${item.link ?? ""}`}>
                <div>
                  <h2>{quote?.lines[i]?.title ?? item.title}</h2>
                  <p>× {item.quantity.toLocaleString(locale)}</p>
                  {item.link && <p className="shop-target-url">{item.link}</p>}
                </div>
                <div>
                  {quote?.lines[i] && <M_components_Price.Price locale={locale} price={quote.lines[i].prices} />}
                  <button disabled={busy} aria-label={`${ct.remove}: ${item.title}`} onClick={() => remove(i)}>
                    <M_components_ShoppingCart_i8 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="shop-panel shop-checkout-summary">
            <M_components_Tour_i11 size={25} />
            <h2>{t.total}</h2>
            <M_components_Price.Price locale={locale} price={quote?.total ?? null} />
            <p className="shop-muted">{t.botNote}</p>
            {!quote && !error && user && <p role="status">{t.loading}</p>}
            <label className="shop-terms">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <span>
                {t.terms} <M_components_Tour_i0 href={`/${locale}/modules/rules`}>↗</M_components_Tour_i0>
              </span>
            </label>
            <button className="primary-button" disabled={busy || !terms || !ready || !user || !quoteReady} onClick={() => void checkout()}>
              {busy ? t.loading : t.botCheckout}
              <M_components_Tour_i6 size={18} />
            </button>
            {!user && <p className="shop-muted">{t.auth}</p>}
            {error && (
              <p role="alert" className="shop-error">
                {error}
                {user && (
                  <button className="secondary-button" disabled={busy} onClick={() => setQuoteRetry((n) => n + 1)}>
                    {ct.retry}
                  </button>
                )}
              </p>
            )}
          </aside>
        </div>
      </section>
    );
  }
}
// components/SmmConfigurator.tsx
namespace M_components_SmmConfigurator {
  export function SmmConfigurator({
    locale,
    services,
    connected,
    error,
  }: {
    locale: M_components_Price_i1;
    services: M_components_SmmConfigurator_i14[];
    connected: boolean;
    error: boolean;
  }) {
    const t = M_components_SmmConfigurator_i9[locale];
    const [key, setKey] = M_components_Tour_i1(services[0]?.key ?? "tg-subs");
    const service = services.find((s) => s.key === key) ?? services[0];
    const [quantity, setQuantity] = M_components_Tour_i1(service ? Math.min(service.max, Math.max(service.min, 1000)) : 1000);
    const [link, setLink] = M_components_Tour_i1("");
    const [quote, setQuote] = M_components_Tour_i1<M_components_Price_i0 | null>(null);
    const [message, setMessage] = M_components_Tour_i1("");
    const [pending, setPending] = M_components_Tour_i1(false);
    const [expiresAt, setExpiresAt] = M_components_Tour_i1(0);
    M_components_FirstRun_i0(() => {
      if (!quote || !expiresAt) return;
      const timer = setTimeout(
        () => {
          setQuote(null);
          setMessage(
            locale === "uk"
              ? "Ціна застаріла. Розрахуй ще раз."
              : locale === "ru"
                ? "Цена устарела. Рассчитай ещё раз."
                : "Quote expired. Calculate again.",
          );
        },
        Math.max(0, expiresAt - Date.now()),
      );
      return () => clearTimeout(timer);
    }, [quote, expiresAt, locale]);
    const epoch = M_components_FirstRun_i1(0);
    const controller = M_components_FirstRun_i1<AbortController | null>(null);
    M_components_FirstRun_i0(() => () => controller.current?.abort(), []);
    function reset() {
      epoch.current++;
      controller.current?.abort();
      setQuote(null);
      setExpiresAt(0);
      setMessage("");
      setPending(false);
    }
    function choose(value: M_components_SmmConfigurator_i14) {
      reset();
      setKey(value.key);
      setQuantity(Math.min(value.max, Math.max(value.min, 1000)));
    }
    async function calculate(event: React.FormEvent) {
      event.preventDefault();
      if (!service || !service.supported) return;
      reset();
      const requestEpoch = epoch.current;
      try {
        M_components_SmmConfigurator_i10(service.key, link, service.platform);
      } catch {
        setMessage(t.badLink);
        return;
      }
      if (!Number.isSafeInteger(quantity) || quantity < service.min || quantity > service.max) {
        setMessage(t.minMax);
        return;
      }
      if (!service.live) {
        if (service.prices) setQuote(M_components_SmmConfigurator_i12(service.prices, quantity));
        else setMessage(t.error);
        return;
      }
      setPending(true);
      controller.current = new AbortController();
      try {
        const response = await fetch("/api/smm/quote", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({service: service.key, quantity, link}),
          signal: AbortSignal.any([controller.current.signal, AbortSignal.timeout(20000)]),
        });
        const data = await response.json();
        if (epoch.current !== requestEpoch) return;
        if (!response.ok) {
          setMessage(data.error === "invalid_link" ? t.badLink : data.error === "invalid_quantity" ? t.minMax : t.error);
          return;
        }
        if (
          !data.prices ||
          !Number.isSafeInteger(data.prices.UAH) ||
          data.prices.UAH < 1 ||
          !Number.isSafeInteger(data.prices.USDT) ||
          data.prices.USDT < 1 ||
          !Number.isFinite(data.expiresAt) ||
          data.expiresAt <= Date.now()
        )
          throw Error("invalid_quote");
        setQuote(data.prices);
        setExpiresAt(data.expiresAt);
      } catch {
        if (epoch.current === requestEpoch) setMessage(t.error);
      } finally {
        if (epoch.current === requestEpoch) setPending(false);
      }
    }
    if (!service || error)
      return (
        <div role="alert" className="rounded-2xl border border-amber-400/20 p-6 text-amber-200">
          {t.error}
        </div>
      );
    const platforms = [...new Set(services.map((s) => s.platform))];
    const platformIcon = (p: string) =>
      p === "telegram"
        ? "/assets/decor/telegram.png"
        : ["instagram", "tiktok", "threads"].includes(p)
          ? `/assets/brands/${p}.png`
          : "/assets/decor/telegram.png";
    return (
      <>
        <div className="smm-platforms" hidden={platforms.length === 1}>
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => choose(services.find((s) => s.platform === p)!)}
              aria-pressed={service.platform === p}
              className={service.platform === p ? "selected" : ""}
            >
              <img src={platformIcon(p)} alt="" width={24} height={24} />
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="smm-layout">
          <form onSubmit={calculate} className="smm-form">
            <div className="smm-form-title">
              <M_components_Catalog_i3 size={19} />
              <h2>{t.more}</h2>
            </div>
            <label>
              {t.service}
              <select value={key} onChange={(e) => choose(services.find((s) => s.key === e.target.value)!)}>
                {services
                  .filter((s) => s.platform === service.platform)
                  .map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.title[locale]}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {t.quantity}
              <input
                type="number"
                value={quantity}
                min={service.min}
                max={service.max}
                step={1}
                onChange={(e) => {
                  reset();
                  setQuantity(Number(e.target.value));
                }}
                required
              />
            </label>
            <div className="quantity-presets">
              {[250, 500, 1000, 2500]
                .filter((n) => n >= service.min && n <= service.max)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      reset();
                      setQuantity(n);
                    }}
                    className={quantity === n ? "selected" : ""}
                  >
                    {n.toLocaleString(locale)}
                  </button>
                ))}
            </div>
            <p className="smm-hint">
              {t.range}: {service.min.toLocaleString(locale)}–{service.max.toLocaleString(locale)}
            </p>
            <label>
              {t.link}
              <div className="smm-target">
                <M_components_SmmConfigurator_i6 size={17} />
                <input
                  type="url"
                  value={link}
                  maxLength={2048}
                  required
                  placeholder={
                    service.key.startsWith("jap-")
                      ? "https://…"
                      : service.platform === "telegram"
                        ? M_components_SmmConfigurator_i8(service.key)?.target === "post"
                          ? "https://t.me/your_channel/123"
                          : "https://t.me/your_channel"
                        : service.platform === "instagram"
                          ? M_components_SmmConfigurator_i8(service.key)?.target === "post"
                            ? "https://instagram.com/p/ABC123/"
                            : "https://instagram.com/your_profile/"
                          : M_components_SmmConfigurator_i8(service.key)?.target === "post"
                            ? "https://tiktok.com/@your_profile/video/123456"
                            : "https://tiktok.com/@your_profile"
                  }
                  onChange={(e) => {
                    reset();
                    setLink(e.target.value);
                  }}
                />
              </div>
            </label>
            {!service.supported && (
              <p role="status" className="mb-4 text-sm text-amber-200">
                {locale === "uk"
                  ? "Цей тип послуги потребує окремої форми. Замовлення поки недоступне."
                  : locale === "ru"
                    ? "Этот тип услуги требует отдельной формы. Заказ пока недоступен."
                    : "This service type needs a dedicated form. Ordering is not available yet."}{" "}
                ({service.type})
              </p>
            )}
            <button disabled={pending || !service.supported} type="submit" className="primary-button w-full disabled:opacity-50">
              {pending ? <M_components_SmmConfigurator_i7 className="animate-spin" size={17} /> : <M_components_Tour_i6 size={17} />}{" "}
              {pending ? t.calculating : t.calculate}
            </button>
            {message && (
              <p role="alert" className="mt-4 text-sm text-amber-200">
                {message}
              </p>
            )}
          </form>
          <aside className="smm-summary">
            <div className="summary-top">
              {["telegram", "instagram", "tiktok", "threads"].includes(service.platform) ? (
                <img src={platformIcon(service.platform)} width={44} height={44} alt="" />
              ) : (
                <span className="smm-platform-mark">{service.platform.slice(0, 2).toUpperCase()}</span>
              )}
              <span className={service.live ? "live-pill" : "preview-pill"}>{service.live ? t.live : t.preview}</span>
            </div>
            <h3>{service.title[locale]}</h3>
            <p className="smm-hint">{service.supported ? t.per1000 : service.type}</p>
            <M_components_Price.Price price={service.prices} locale={locale} />
            <div className="summary-features">
              <div>
                {t.refill}
                <span>{service.refill === null ? t.unknown : service.refill ? t.yes : t.no}</span>
              </div>
              <div>
                {t.cancel}
                <span>{service.cancel === null ? t.unknown : service.cancel ? t.yes : t.no}</span>
              </div>
            </div>
            <p className="smm-hint">{t.providerTerms}</p>
            {quote && (
              <div className="smm-total" role="status">
                <span>
                  {!service.live ? "≈ " : ""}
                  {t.total}
                </span>
                <M_components_Price.Price price={quote} locale={locale} />
                {service.live && service.supported && service.orderable && (
                  <M_components_BuyButton.BuyButton
                    item={{
                      kind: "smm",
                      id: service.key,
                      title: service.title[locale],
                      quantity,
                      link: M_components_SmmConfigurator_i10(service.key, link, service.platform),
                    }}
                  />
                )}
              </div>
            )}
            {service.live && !service.orderable && (
              <p className="smm-hint" role="status">
                {locale === "uk"
                  ? "Замовлення цієї послуги тимчасово вимкнено. Розрахунок доступний для перегляду."
                  : locale === "ru"
                    ? "Заказ этой услуги временно отключён. Расчёт доступен для просмотра."
                    : "Ordering is temporarily disabled. You can still preview the quote."}
              </p>
            )}
            <p className="smm-hint mt-6">{t.quality}</p>
          </aside>
        </div>
        {!connected && <p className="smm-preview-notice">{t.notConnected}</p>}
        <section className="smm-process">
          <h2>{t.automatic}</h2>
          <div>
            {t.steps.map((s, i) => (
              <p key={s}>
                <span>{i + 1}</span>
                {s}
              </p>
            ))}
          </div>
        </section>
      </>
    );
  }
}
// components/SmmCatalogBrowser.tsx
namespace M_components_SmmCatalogBrowser {
  const copy = {
    uk: {
      all: "Усі платформи",
      search: "Пошук: послуга, країна або ID…",
      category: "Усі категорії",
      default: "За замовчуванням",
      cheap: "Спочатку дешевші",
      expensive: "Спочатку дорожчі",
      supported: "Стандартна форма",
      refill: "З поповненням",
      found: "послуг знайдено",
      per: "за 1 000",
      choose: "Обрати послугу",
      special: "Окрема форма",
      empty: "Послуги не знайдено. Зміни фільтри.",
      error: "Постачальник зараз недоступний. Спробуй ще раз.",
      retry: "Повторити",
      catalog: "Каталог послуг",
      details: "Параметри обраної послуги",
      live: "Оновлюється через API",
      preview: "Попередній каталог",
      range: "Кількість",
      noFx: "Ціни з’являться після налаштування курсу валют.",
      source: "Умови пакетів наведені мовою постачальника. Перед замовленням перевір тип послуги, країну та вимоги до посилання.",
    },
    ru: {
      all: "Все платформы",
      search: "Поиск: услуга, страна или ID…",
      category: "Все категории",
      default: "По умолчанию",
      cheap: "Сначала дешевле",
      expensive: "Сначала дороже",
      supported: "Стандартная форма",
      refill: "С пополнением",
      found: "услуг найдено",
      per: "за 1 000",
      choose: "Выбрать услугу",
      special: "Отдельная форма",
      empty: "Услуги не найдены. Измени фильтры.",
      error: "Поставщик сейчас недоступен. Попробуй ещё раз.",
      retry: "Повторить",
      catalog: "Каталог услуг",
      details: "Параметры выбранной услуги",
      live: "Обновляется через API",
      preview: "Предварительный каталог",
      range: "Количество",
      noFx: "Цены появятся после настройки курса валют.",
      source: "Условия пакетов приведены на языке поставщика. Проверь тип услуги, страну и требования к ссылке.",
    },
    en: {
      all: "All platforms",
      search: "Search service, country or ID…",
      category: "All categories",
      default: "Recommended order",
      cheap: "Lowest price first",
      expensive: "Highest price first",
      supported: "Standard form",
      refill: "Refill available",
      found: "services found",
      per: "per 1,000",
      choose: "Select service",
      special: "Dedicated form",
      empty: "No services found. Adjust your filters.",
      error: "Supplier is unavailable. Please retry.",
      retry: "Retry",
      catalog: "Service catalog",
      details: "Selected service details",
      live: "Updated through API",
      preview: "Preview catalog",
      range: "Quantity",
      noFx: "Prices require a configured exchange rate.",
      source:
        "Package terms are shown in the supplier’s original language. Check the service type, country and URL requirements before ordering.",
    },
  };
  function PlatformMark({platform}: {platform: string}) {
    const image =
      platform === "telegram"
        ? "/assets/decor/telegram.png"
        : ["instagram", "tiktok", "threads"].includes(platform)
          ? `/assets/brands/${platform}.png`
          : null;
    return image ? (
      <img src={image} width={26} height={26} alt="" />
    ) : (
      <span className={`smm-platform-mark mark-${platform}`}>
        {(M_components_SmmCatalogBrowser_i12[platform] ?? platform).slice(0, 2).toUpperCase()}
      </span>
    );
  }
  export function SmmCatalogBrowser({
    locale,
    initial,
    initialFilters,
  }: {
    locale: M_components_Price_i1;
    initial: M_components_SmmCatalogBrowser_i13;
    initialFilters: M_components_SmmCatalogBrowser_i14;
  }) {
    const t = copy[locale];
    const [data, setData] = M_components_Tour_i1(initial);
    const [filters, setFilters] = M_components_Tour_i1<M_components_SmmCatalogBrowser_i14>(initialFilters);
    const [search, setSearch] = M_components_Tour_i1(initialFilters.q ?? "");
    const [pending, setPending] = M_components_Tour_i1(false);
    const [failed, setFailed] = M_components_Tour_i1(initial.error);
    const [retry, setRetry] = M_components_Tour_i1(0);
    const [selected, setSelected] = M_components_Tour_i1<M_components_SmmConfigurator_i14 | null>(null);
    const first = M_components_FirstRun_i1(true);
    const closeDetail = M_hooks_useCloudStorage_i0(() => setSelected(null), []);
    const query = JSON.stringify(filters);
    M_components_FirstRun_i0(() => {
      const timer = setTimeout(() => setFilters((f) => (f.q === search ? f : {...f, q: search, page: 1})), 300);
      return () => clearTimeout(timer);
    }, [search]);
    M_components_FirstRun_i0(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      const controller = new AbortController();
      const p = new URLSearchParams();
      const f = JSON.parse(query) as M_components_SmmCatalogBrowser_i14;
      for (const [key, value] of Object.entries(f))
        if (value !== "" && value !== false && value != null) p.set(key, value === true ? "1" : String(value));
      setPending(true);
      setFailed(false);
      fetch(`/api/smm/services?${p}`, {
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]),
      })
        .then(async (res) => {
          if (!res.ok) throw Error("unavailable");
          const next = (await res.json()) as M_components_SmmCatalogBrowser_i13;
          if (controller.signal.aborted) return;
          if (next.error || !Array.isArray(next.services)) throw Error("unavailable");
          setData(next);
          window.history.replaceState(window.history.state, "", `${window.location.pathname}${p.size ? `?${p}` : ""}`);
        })
        .catch(() => {
          if (!controller.signal.aborted) setFailed(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setPending(false);
        });
      return () => controller.abort();
    }, [query, retry]);
    function update(next: Partial<M_components_SmmCatalogBrowser_i14>) {
      setFilters((f) => ({...f, ...next, page: 1}));
    }
    function choose(service: M_components_SmmConfigurator_i14) {
      setSelected(service);
    }
    return (
      <section className="smm-browser">
        <div className="smm-catalog-heading">
          <div>
            <h2>{t.catalog}</h2>
          </div>
          <span className={data.connected ? "live-pill" : "preview-pill"}>
            <span className="smm-status-dot" />
            {data.connected ? t.live : t.preview}
          </span>
        </div>
        <div className="smm-platforms smm-browse-platforms">
          <button
            aria-pressed={!filters.platform}
            className={!filters.platform ? "selected" : ""}
            onClick={() => update({platform: "", category: ""})}
          >
            <M_components_FirstRun_i13 size={18} />
            {t.all}
          </button>
          {data.platforms.map((p) => (
            <button
              key={p}
              aria-pressed={filters.platform === p}
              className={filters.platform === p ? "selected" : ""}
              onClick={() => update({platform: p, category: ""})}
            >
              <PlatformMark platform={p} />
              {M_components_SmmCatalogBrowser_i12[p] ?? p}
            </button>
          ))}
        </div>
        <div className="smm-search-controls">
          <label className="smm-search">
            <M_components_Catalog_i2 size={19} />
            <span className="sr-only">{t.search}</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} maxLength={200} />
          </label>
          <label>
            <span className="sr-only">{t.category}</span>
            <select value={filters.category ?? ""} onChange={(e) => update({category: e.target.value})}>
              <option value="">{t.category}</option>
              {data.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="smm-sort">
            <M_components_SmmCatalogBrowser_i4 size={16} />
            <span className="sr-only">{t.default}</span>
            <select value={filters.sort ?? ""} onChange={(e) => update({sort: e.target.value})}>
              <option value="">{t.default}</option>
              <option value="price-asc">{t.cheap}</option>
              <option value="price-desc">{t.expensive}</option>
            </select>
          </label>
        </div>
        <div className="smm-catalog-meta">
          <span aria-live="polite">
            {data.total.toLocaleString(locale)} {t.found}
          </span>
          <div>
            <label>
              <input type="checkbox" checked={Boolean(filters.supported)} onChange={(e) => update({supported: e.target.checked})} />
              {t.supported}
            </label>
            <label>
              <input type="checkbox" checked={Boolean(filters.refill)} onChange={(e) => update({refill: e.target.checked})} />
              {t.refill}
            </label>
          </div>
        </div>
        {failed ? (
          <div role="alert" className="smm-empty">
            {t.error}
            <button onClick={() => setRetry((n) => n + 1)}>
              <M_components_CommerceAdmin_i12 size={16} />
              {t.retry}
            </button>
          </div>
        ) : (
          <div aria-busy={pending} className="smm-service-grid">
            {pending
              ? Array.from({length: 12}, (_, i) => (
                  <div key={i} className="smm-service-card smm-skeleton animate-pulse">
                    <div />
                    <div />
                    <div />
                  </div>
                ))
              : data.services.map((s) => (
                  <article key={s.key} className={`smm-service-card ${selected?.key === s.key ? "is-selected" : ""}`}>
                    <div className="smm-card-top">
                      <span>
                        <PlatformMark platform={s.platform} />
                        {M_components_SmmCatalogBrowser_i12[s.platform] ?? s.platform}
                      </span>
                      <span className="smm-service-id">#{s.key.replace(/^jap-/, "")}</span>
                    </div>
                    <p className="smm-card-category">{s.category}</p>
                    <h3>{s.title[locale]}</h3>
                    <div className="smm-card-badges">
                      {s.refill && (
                        <span>
                          <M_components_CommerceAdmin_i12 size={11} />
                          {t.refill}
                        </span>
                      )}
                      {!s.supported && <span className="special-type">{s.type}</span>}
                    </div>
                    <div className="smm-card-price">
                      <M_components_Price.Price price={s.prices} locale={locale} />
                      <span>{s.supported ? t.per : s.type}</span>
                    </div>
                    <p className="smm-card-range">
                      {t.range}: {s.min.toLocaleString(locale)}–{s.max.toLocaleString(locale)}
                    </p>
                    <button type="button" onClick={() => choose(s)}>
                      {s.supported ? t.choose : t.special}
                      <M_components_Tour_i6 size={16} />
                    </button>
                  </article>
                ))}
          </div>
        )}
        {!pending && !failed && !data.total && <p className="smm-empty">{t.empty}</p>}
        <button
          className="smm-reset"
          onClick={() => {
            setSearch("");
            setFilters({page: 1});
          }}
        >
          {locale === "uk" ? "Скинути фільтри" : locale === "ru" ? "Сбросить фильтры" : "Reset filters"}
        </button>
        <div className="smm-pagination">
          <button
            aria-label={locale === "uk" ? "Попередня сторінка" : locale === "ru" ? "Предыдущая страница" : "Previous page"}
            disabled={pending || data.page <= 1}
            onClick={() => setFilters((f) => ({...f, page: data.page - 1}))}
          >
            <M_components_SmmCatalogBrowser_i6 size={18} />
          </button>
          <span>
            {data.page} / {data.pages}
          </span>
          <button
            aria-label={locale === "uk" ? "Наступна сторінка" : locale === "ru" ? "Следующая страница" : "Next page"}
            disabled={pending || data.page >= data.pages}
            onClick={() => setFilters((f) => ({...f, page: data.page + 1}))}
          >
            <M_components_SmmCatalogBrowser_i7 size={18} />
          </button>
        </div>
        {!pending && data.services.length > 0 && !data.services.some((s) => s.prices) && <p className="smm-preview-notice">{t.noFx}</p>}
        <p className="smm-source-note">
          <M_components_SmmCatalogBrowser_i9 size={16} />
          {t.source}
        </p>
        {selected && (
          <M_components_BottomSheet.BottomSheet titleId="smm-detail-title" locale={locale} onClose={closeDetail}>
            <div className="smm-selected-detail">
              <p className="eyebrow">
                #{selected.key.replace(/^jap-/, "")} / {selected.category}
              </p>
              <h2 id="smm-detail-title">{t.details}</h2>
              <M_components_SmmConfigurator.SmmConfigurator
                key={selected.key}
                locale={locale}
                services={[selected]}
                connected={data.connected}
                error={false}
              />
            </div>
          </M_components_BottomSheet.BottomSheet>
        )}
      </section>
    );
  }
}
// components/TelegramCheckout.tsx
namespace M_components_TelegramCheckout {
  export function TelegramCheckout({items}: {items: M_components_ShopProvider.CartEntry[]}) {
    const {locale} = M_components_ShopProvider.useShop();
    return items.length ? (
      <M_components_Tour_i0 className="primary-button" href={`/${locale}/cart`}>
        {M_components_AppShell_i20[locale].checkout}
      </M_components_Tour_i0>
    ) : null;
  }
}
// components/Tour.tsx
namespace M_components_Tour {
  export function Tour({locale}: {locale: M_components_Price_i1}) {
    const t = M_components_Tour_i13[locale],
      reduced = M_components_Tour_i4(),
      [step, setStep] = M_components_Tour_i1(0);
    const steps = [t.step1, t.step2, t.step3, t.step4],
      heads = [
        [t.h1a, t.h1b],
        [t.h2a, t.h2b],
        [t.h3a, t.h3b],
        [t.h4a, t.h4b],
      ],
      texts = [t.p1, t.p2, t.p3, t.p4];
    const bot = "LegitAssetsBot";
    return (
      <section
        className="tour-page"
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "ArrowRight") setStep((n) => Math.min(3, n + 1));
          if (e.key === "ArrowLeft") setStep((n) => Math.max(0, n - 1));
        }}
        tabIndex={-1}
      >
        <aside className="tour-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.introA}
            <span>{t.introB}</span>
          </h1>
          <p>{t.introText}</p>
          <nav aria-label={t.stepNav}>
            {steps.map((label, i) => (
              <button key={label} onClick={() => setStep(i)} aria-current={step === i ? "step" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{label}</strong>
                  <small>{[t.step1Sub, t.step2Sub, t.step3Sub, t.step4Sub][i]}</small>
                </div>
                {step > i && <M_components_Tour_i7 size={16} />}
              </button>
            ))}
          </nav>
          <div className="tour-mode-label">
            WEB <span>·</span> MINI APP <span>·</span> BOT
          </div>
        </aside>
        <div className="tour-stage">
          <div className="tour-progress">
            <span>
              {t.stepWord} {step + 1} {t.of} 4
            </span>
            <div>
              {steps.map((_, i) => (
                <span key={i} className={i <= step ? "active" : ""} />
              ))}
            </div>
          </div>
          <M_components_Tour_i2 mode="wait">
            <M_components_Tour_i3.div
              key={step}
              className="tour-slide"
              initial={reduced ? false : {opacity: 0, y: 18}}
              animate={{opacity: 1, y: 0}}
              exit={reduced ? {} : {opacity: 0, y: -12}}
              transition={{duration: 0.25}}
            >
              <p className="eyebrow">{[t.k1, t.k2, t.k3, t.k4][step]}</p>
              <h2>
                {heads[step][0]}
                <span>{heads[step][1]}</span>
              </h2>
              <p>{texts[step]}</p>
              {step === 0 && (
                <div className="tour-categories">
                  {[
                    {icon: "steam", name: "Steam", path: "steam-accounts"},
                    {
                      icon: "telegram",
                      name: "Telegram",
                      path: "telegram-accounts",
                    },
                    {icon: "instagram", name: t.smm, path: "smm"},
                    {
                      icon: "shield-check",
                      name: t.verify,
                      path: "verifications",
                    },
                  ].map((c) => (
                    <M_components_Tour_i0 key={c.path} href={`/${locale}/${c.path}`}>
                      <img src={`/assets/tour/${c.icon}.svg`} width={42} height={42} alt="" />
                      <strong>{c.name}</strong>
                      <M_components_Tour_i6 size={15} />
                    </M_components_Tour_i0>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="tour-flow">
                  {[
                    [M_components_Tour_i8, t.choose],
                    [M_components_Tour_i9, t.pay],
                    [M_components_Tour_i10, t.receive],
                  ].map(([Icon, label], i) => {
                    const Mark = Icon as typeof M_components_Tour_i8;
                    return (
                      <div key={i}>
                        <span>0{i + 1}</span>
                        <Mark size={30} />
                        <strong>{label as string}</strong>
                      </div>
                    );
                  })}
                  <div className="tour-invoice">
                    <M_components_Tour_i11 size={20} />
                    <div>
                      <strong>{t.invoice}</strong>
                      <p>{t.priceValue} · UAH / USDT / Stars</p>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="tour-checks">
                  {[
                    [t.check1, t.check1Sub],
                    [t.check2, t.check2Sub],
                    [t.check3, t.check3Sub],
                  ].map(([a, b]) => (
                    <div key={a}>
                      <span>
                        <M_components_Tour_i7 size={18} />
                      </span>
                      <div>
                        <strong>{a}</strong>
                        <p>{b}</p>
                      </div>
                    </div>
                  ))}
                  <M_components_Tour_i0 href={`/${locale}/modules/rules`}>
                    {locale === "uk" ? "Правила магазину" : locale === "ru" ? "Правила магазина" : "Store rules"}
                    <M_components_Tour_i6 size={16} />
                  </M_components_Tour_i0>
                </div>
              )}
              {step === 3 && (
                <div className="tour-finish-art">
                  <div>
                    <M_components_Tour_i12 size={58} />
                  </div>
                  <span>LEGIT ASSETS</span>
                  <p>{t.finishNote}</p>
                </div>
              )}
            </M_components_Tour_i3.div>
          </M_components_Tour_i2>
          <div className="tour-controls">
            <button disabled={!step} onClick={() => setStep((n) => Math.max(0, n - 1))}>
              <M_components_Tour_i5 size={17} />
              {t.previous}
            </button>
            {step < 3 ? (
              <button className="primary-button" onClick={() => setStep((n) => n + 1)}>
                {t.next}
                <M_components_Tour_i6 size={17} />
              </button>
            ) : (
              <a
                className="primary-button"
                href={`https://t.me/${/^[A-Za-z0-9_]{5,32}$/.test(bot) ? bot : "LegitAssetsBot"}?start=${locale}`}
              >
                {t.finishBot}
                <M_components_Tour_i12 size={17} />
              </a>
            )}
          </div>
          {step === 3 && (
            <M_components_Tour_i0 className="tour-shop-link" href={`/${locale}`}>
              {locale === "uk" ? "До каталогу" : locale === "ru" ? "В каталог" : "Back to catalog"}
            </M_components_Tour_i0>
          )}
        </div>
      </section>
    );
  }
}
// components/VerificationCatalog.tsx
namespace M_components_VerificationCatalog {
  export function VerificationLogo({
    id,
    large = false,
    metadata,
  }: {
    id: string;
    large?: boolean;
    metadata?: M_components_VerificationCatalog_i14["brand"];
  }) {
    const known = M_components_VerificationCatalog_i10[id];
    const brand =
      metadata ??
      (known
        ? {
            ...known,
            imageUrl: known.image ? `/assets/brands/${known.image}.png` : "",
          }
        : undefined);
    const [failed, setFailed] = M_components_Tour_i1(false);
    const Icon =
      id === "vr_fragment"
        ? M_components_VerificationCatalog_i8
        : id === "vr_cryptobot"
          ? M_components_VerificationCatalog_i9
          : M_components_Tour_i9;
    return (
      <div data-brand={brand?.imageUrl.includes("/bybit.png") ? "bybit" : ""} className={`verification-logo ${large ? "large" : ""}`}>
        {brand?.imageUrl && !failed ? (
          <img
            src={brand.imageUrl}
            onError={() => setFailed(true)}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            width={180}
            height={80}
          />
        ) : (
          <Icon aria-hidden="true" size={large ? 70 : 40} strokeWidth={1.4} />
        )}
      </div>
    );
  }
  export function VerificationCatalog({locale, items}: {locale: M_components_Price_i1; items: M_components_Catalog_i7[]}) {
    const t = M_components_VerificationCatalog_i11[locale];
    const [group, setGroup] = M_components_Tour_i1<M_components_VerificationCatalog_i12 | "all">("all");
    const [query, setQuery] = M_components_Tour_i1("");
    const [sort, setSort] = M_components_Tour_i1("default");
    const visible = items.filter(
      (p) =>
        (group === "all" || (p.brand ?? M_components_VerificationCatalog_i10[p.id])?.group === group) &&
        `${p.title[locale]} ${(p.brand ?? M_components_VerificationCatalog_i10[p.id])?.name ?? ""}`
          .toLocaleLowerCase(locale)
          .includes(query.trim().toLocaleLowerCase(locale)),
    );
    if (sort !== "default")
      visible.sort((a, b) => {
        const av = a.prices?.UAH,
          bv = b.prices?.UAH;
        if (av === undefined || bv === undefined) return av === undefined && bv === undefined ? 0 : av === undefined ? 1 : -1;
        return (sort === "asc" ? 1 : -1) * (av - bv);
      });
    return (
      <section id="verification-services" className="verification-services">
        <div className="verification-section-heading">
          <div>
            <p className="eyebrow">LEGIT / PLATFORMS</p>
            <h2>{t.services}</h2>
            <p>{t.subtitle}</p>
          </div>
          <span className="verification-count" role="status">
            {visible.length} {t.found}
          </span>
        </div>
        <div className="verification-tools">
          <div className="verification-tabs" aria-label={t.services}>
            {(["all", "exchange", "wallet", "other"] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
                className={group === g ? "selected" : ""}
              >
                {t[g]}
              </button>
            ))}
          </div>
          <div className="verification-search-row">
            <label className="verification-search">
              <M_components_Catalog_i2 size={18} />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />
            </label>
            <label className="verification-sort">
              <M_components_Catalog_i3 size={16} />
              <select aria-label={t.sort} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">{t.defaultSort}</option>
                <option value="asc">{t.cheap}</option>
                <option value="desc">{t.expensive}</option>
              </select>
            </label>
          </div>
        </div>
        <div className="verification-grid">
          {visible.map((p) => {
            const brand = p.brand ?? M_components_VerificationCatalog_i10[p.id];
            return (
              <article
                key={p.id}
                className="verification-card"
                style={
                  {
                    "--brand-color": brand?.color ?? "#a78bfa",
                  } as M_components_VerificationCatalog_i2
                }
              >
                <div className="verification-card-art">
                  <span className="verification-mode">
                    <span />
                    {t.manual}
                  </span>
                  <VerificationLogo id={p.id} metadata={p.brand} />
                  <span className="verification-platform-kind">{t[brand?.group ?? "other"]}</span>
                </div>
                <div className="verification-card-body">
                  <h3>{p.title[locale]}</h3>
                  <p>
                    {p.id === "vr_bybit_cards"
                      ? t.cardsDesc
                      : brand?.group === "exchange"
                        ? t.exchangeDesc
                        : brand?.group === "wallet"
                          ? t.walletDesc
                          : t.otherDesc}
                  </p>
                  <div className="verification-card-feature">
                    <M_components_Tour_i7 size={14} />
                    {t.personal}
                  </div>
                  <div className="verification-card-bottom">
                    <div>
                      <span className="verification-price-label">{t.price}</span>
                      <M_components_Price.Price price={p.prices} locale={locale} />
                    </div>
                    <M_components_Tour_i0
                      href={`/${locale}/product/${p.id}`}
                      aria-label={`${t.details}: ${p.title[locale]}`}
                      className="verification-card-cta"
                    >
                      <M_components_AdminPanel_i13 size={20} />
                      <span>{t.details}</span>
                    </M_components_Tour_i0>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!visible.length && <p className="verification-empty">{t.empty}</p>}
        <p className="verification-rate-note">{t.note}</p>
      </section>
    );
  }
}
// components/WalletConnect.tsx
namespace M_components_WalletConnect {
  function ConnectedWallet({locale}: {locale: M_components_Price_i1}) {
    const [tonConnect] = M_components_NftCheckout_i3();
    const [details, setDetails] = M_components_Tour_i1(false),
      [copied, setCopied] = M_components_Tour_i1(false);
    const close = M_hooks_useCloudStorage_i0(() => setDetails(false), []);
    const t = M_components_AppShell_i20[locale];
    const address = M_components_WalletConnect_i1(),
      [balance, setBalance] = M_components_Tour_i1<string>();
    M_components_FirstRun_i0(() => {
      setBalance(undefined);
      if (!address) return;
      const abort = new AbortController();
      const load = () => {
        void fetch(`/api/wallet/balance?address=${encodeURIComponent(address)}`, {
          signal: abort.signal,
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (!abort.signal.aborted) setBalance(d?.balance);
          })
          .catch(() => {});
      };
      load();
      const timer = setInterval(load, 30000);
      return () => {
        abort.abort();
        clearInterval(timer);
      };
    }, [address]);
    return (
      <div className="wallet-connect">
        <button
          className="wallet-connect-button"
          onClick={() => {
            if (address) setDetails(true);
            else void tonConnect.openModal();
          }}
        >
          {address ? `${address.slice(0, 4)}…${address.slice(-4)}` : M_components_AppShell_i20[locale].connecting}
        </button>
        {address && (
          <span className="wallet-summary" title={`${M_components_AppShell_i20[locale].address}: ${address}`}>
            <span>
              {address.slice(0, 4)}…{address.slice(-4)}
            </span>{" "}
            ·{" "}
            {balance === undefined
              ? "—"
              : Number(balance).toLocaleString(locale, {
                  maximumFractionDigits: 4,
                })}{" "}
            GRAM
          </span>
        )}
        {details && (
          <M_components_BottomSheet.BottomSheet titleId="wallet-details-title" onClose={close} locale={locale}>
            <section className="wallet-details">
              <h2 id="wallet-details-title">{t.address}</h2>
              <p className="wallet-full-address">{address}</p>
              <p>
                {t.balance}: {balance ?? "—"} GRAM
              </p>
              <button
                className="secondary-button"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(address)
                    .then(() => setCopied(true))
                    .catch(() => {});
                }}
              >
                {copied ? t.copied : t.copyAddress}
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  void tonConnect.disconnect().then(() => setDetails(false));
                }}
              >
                {t.disconnect}
              </button>
            </section>
          </M_components_BottomSheet.BottomSheet>
        )}
      </div>
    );
  }
  export function WalletConnect({locale}: {locale: M_components_Price_i1}) {
    return <ConnectedWallet locale={locale} />;
  }
  export const _default = WalletConnect;
}
// components/WalletProvider.tsx
namespace M_components_WalletProvider {
  export function WalletProvider({children, locale}: {children: React.ReactNode; locale: M_components_Price_i1}) {
    const base = typeof window === "undefined" ? process.env.NEXT_PUBLIC_SITE_URL || "https://localhost" : window.location.origin;
    return (
      <M_components_WalletConnect_i0 manifestUrl={base + "/api/tonconnect-manifest"} language={locale === "ru" ? "ru" : "en"}>
        {children}
      </M_components_WalletConnect_i0>
    );
  }
}
export import M_components_AdminDialog_AdminDialog = M_components_AdminDialog.AdminDialog;
export import M_components_AdminLogin_AdminLogin = M_components_AdminLogin.AdminLogin;
export import M_hooks_useTelegramMock_useTelegramMock = M_hooks_useTelegramMock.useTelegramMock;
export type M_hooks_useTelegramMock_TelegramEnvironment = M_hooks_useTelegramMock.TelegramEnvironment;
export import M_hooks_useTelegramWebApp_supportsTelegram = M_hooks_useTelegramWebApp.supportsTelegram;
export import M_hooks_useTelegramWebApp_haptic = M_hooks_useTelegramWebApp.haptic;
export import M_hooks_useTelegramWebApp_useTelegramWebApp = M_hooks_useTelegramWebApp.useTelegramWebApp;
export type M_hooks_useTelegramWebApp_TelegramButton = M_hooks_useTelegramWebApp.TelegramButton;
export type M_hooks_useTelegramWebApp_TelegramWebApp = M_hooks_useTelegramWebApp.TelegramWebApp;
export import M_hooks_useCloudStorage_useCloudStorage = M_hooks_useCloudStorage.useCloudStorage;
export import M_components_ShopProvider_useOptionalShop = M_components_ShopProvider.useOptionalShop;
export import M_components_ShopProvider_useShop = M_components_ShopProvider.useShop;
export import M_components_ShopProvider_shopHeaders = M_components_ShopProvider.shopHeaders;
export import M_components_ShopProvider_shopRequest = M_components_ShopProvider.shopRequest;
export import M_components_ShopProvider_ShopProvider = M_components_ShopProvider.ShopProvider;
export type M_components_ShopProvider_CartEntry = M_components_ShopProvider.CartEntry;
export type M_components_ShopProvider_Customer = M_components_ShopProvider.Customer;
export import M_components_LanguageSwitcher_LanguageSwitcher = M_components_LanguageSwitcher.LanguageSwitcher;
export import M_components_AdminPanel_AdminPanel = M_components_AdminPanel.AdminPanel;
export type M_components_AdminPanel_AdminProduct = M_components_AdminPanel.AdminProduct;
export type M_components_AdminPanel_AdminLogo = M_components_AdminPanel.AdminLogo;
export import M_components_AmbientBackground_AmbientBackground = M_components_AmbientBackground.AmbientBackground;
export import M_components_AnimatedGiftEmoji_AnimatedGiftEmoji = M_components_AnimatedGiftEmoji.AnimatedGiftEmoji;
export import M_components_FirstRun_FirstRun = M_components_FirstRun.FirstRun;
export import M_components_DesktopPreview_DesktopPreview = M_components_DesktopPreview.DesktopPreview;
export import M_components_FloatingCart_FloatingCart = M_components_FloatingCart.FloatingCart;
export import M_hooks_usePressEffects_usePressEffects = M_hooks_usePressEffects.usePressEffects;
export import M_components_AppShell_AppShell = M_components_AppShell.AppShell;
export import M_components_BottomSheet_BottomSheet = M_components_BottomSheet.BottomSheet;
export import M_components_BuyButton_BuyButton = M_components_BuyButton.BuyButton;
export import M_components_Price_Price = M_components_Price.Price;
export type M_components_ProductCard_StockStatus = M_components_ProductCard.StockStatus;
export type M_components_ProductCard_ProductCardProps = M_components_ProductCard.ProductCardProps;
export import M_components_ProductCard_ProductCard = M_components_ProductCard.ProductCard;
export import M_components_Catalog_Catalog = M_components_Catalog.Catalog;
export import M_components_CommerceAdmin_CommerceAdmin = M_components_CommerceAdmin.CommerceAdmin;
export import M_components_Flag_Flag = M_components_Flag.Flag;
export import M_components_CountryGrid_CountryGrid = M_components_CountryGrid.CountryGrid;
export import M_components_ProfilePhoto_ProfilePhoto = M_components_ProfilePhoto.ProfilePhoto;
export import M_components_CustomerAccount_CustomerAccount = M_components_CustomerAccount.CustomerAccount;
export import M_components_CustomerLogin_CustomerLogin = M_components_CustomerLogin.CustomerLogin;
export import M_components_GiftHistory_GiftHistory = M_components_GiftHistory.GiftHistory;
export import M_components_NftCheckout_NftCheckout = M_components_NftCheckout.NftCheckout;
export import M_components_NftGiftsCatalog_isGiftInCategory = M_components_NftGiftsCatalog.isGiftInCategory;
export import M_components_NftGiftsCatalog_NftGiftsCatalog = M_components_NftGiftsCatalog.NftGiftsCatalog;
export import M_components_NftGiftsCatalog_MODEL_EMOJIS = M_components_NftGiftsCatalog.MODEL_EMOJIS;
export import M_components_NftGiftsCatalog_CATEGORIES = M_components_NftGiftsCatalog.CATEGORIES;
export import M_components_RouteSheet_RouteSheet = M_components_RouteSheet.RouteSheet;
export import M_components_ShoppingCart_ShoppingCart = M_components_ShoppingCart.ShoppingCart;
export import M_components_SmmConfigurator_SmmConfigurator = M_components_SmmConfigurator.SmmConfigurator;
export import M_components_SmmCatalogBrowser_SmmCatalogBrowser = M_components_SmmCatalogBrowser.SmmCatalogBrowser;
export import M_components_TelegramCheckout_TelegramCheckout = M_components_TelegramCheckout.TelegramCheckout;
export import M_components_Tour_Tour = M_components_Tour.Tour;
export import M_components_VerificationCatalog_VerificationLogo = M_components_VerificationCatalog.VerificationLogo;
export import M_components_VerificationCatalog_VerificationCatalog = M_components_VerificationCatalog.VerificationCatalog;
export import M_components_WalletConnect__default = M_components_WalletConnect._default;
export import M_components_WalletProvider_WalletProvider = M_components_WalletProvider.WalletProvider;
// Next's client boundary lets a failed catalog screen recover without losing the shell/cart.
export function CustomerFailure({reset}: {error: Error; reset: () => void}) {
  const locale = M_components_FirstRun_i3().split("/")[1];
  const t =
    locale === "ru"
      ? {
          title: "Не удалось открыть раздел",
          text: "Попробуй ещё раз или вернись в магазин. Корзина сохранена.",
          retry: "Повторить",
          shop: "В магазин",
        }
      : locale === "en"
        ? {
            title: "Could not open this section",
            text: "Retry or return to the shop. Your cart is saved.",
            retry: "Retry",
            shop: "Back to shop",
          }
        : {
            title: "Не вдалося відкрити розділ",
            text: "Спробуй ще раз або повернись у магазин. Кошик збережено.",
            retry: "Повторити",
            shop: "До магазину",
          };
  return (
    <section className="shop-panel shop-empty" role="alert">
      <h1>{t.title}</h1>
      <p className="shop-muted">{t.text}</p>
      <button className="primary-button" onClick={() => reset()}>
        {t.retry}
      </button>
      <M_components_Tour_i0 className="secondary-button" href={`/${["uk", "ru", "en"].includes(locale) ? locale : "uk"}`}>
        {t.shop}
      </M_components_Tour_i0>
    </section>
  );
}

export function ClientRefresh({label,pendingLabel}:{label:string;pendingLabel:string}) {
    const router=M_components_FirstRun_i4(),[pending,transition]=useTransition();
    return <button type="button" className="secondary-button" disabled={pending} aria-busy={pending} onClick={()=>transition(()=>router.refresh())}>{pending?pendingLabel:label}</button>;
}
