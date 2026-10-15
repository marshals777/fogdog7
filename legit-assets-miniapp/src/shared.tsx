import __data_M_lib_admin_copy_i0 from "@/data.json";
import M_lib_money_i0 from "decimal.js";
// Keep stored decimal strings exact when displaying customer/admin history.
export function formatStoredMoney(value: string | null | undefined): string {
  try {
    const amount = new M_lib_money_i0(value ?? "0");
    return amount.isFinite() ? amount.toFixed(2) : "—";
  } catch { return "—"; }
}

const M_lib_admin_copy_i0 = __data_M_lib_admin_copy_i0["admin-copy"];
// lib/admin-copy.ts
namespace M_lib_admin_copy {
  export function adminText(locale: M_lib_i18n.Locale, text: string) {
    return M_lib_admin_copy_i0[text as keyof typeof M_lib_admin_copy_i0]?.[locale] ?? text;
  }
}
// lib/app-copy.ts
namespace M_lib_app_copy {
  export const appCopy = {
    uk: {
      open: "Відкрити в Telegram",
      preview: "Твій цифровий світ — ближче.",
      previewText: "Колекційні подарунки, акаунти та сервіси. Один каталог. Один простір.",
      scan: "Відскануй, щоб відкрити",
      language: "Мова",
      profile: "Профіль",
      guarantees: "Гарантії",
      tour: "Екскурсія",
      catalog: "Каталог",
      cart: "Кошик",
      more: "Ще",
      checkout: "Оформити замовлення",
      botCheckout: "Продовжити в боті",
      botNote: "Бот покаже остаточну суму та інвойс. Кошти не списуються під час переходу.",
      terms: "Погоджуюся з правилами сервісу",
      empty: "У кошику поки порожньо",
      error: "Не вдалося виконати дію. Спробуй ще раз.",
      auth: "Відкрий Telegram для входу",
      loading: "Завантаження…",
      history: "Історія передач",
      noHistory: "Немає підтверджених передач",
      historyUnavailable: "Історія передач тимчасово недоступна",
      collection: "Колекція",
      collections: "Колекції",
      rarest: "Найрідкісніші",
      all: "Усі",
      total: "Разом",
      address: "Адреса гаманця",
      balance: "Баланс",
      walletUnavailable: "Баланс недоступний",
      admin: "Керування",
      adminEntry: "Увійти через Telegram",
      forbidden: "Доступ заборонено",
      disconnect: "Від’єднати гаманець",
      copyAddress: "Копіювати адресу",
      copied: "Скопійовано",
      connecting: "Підключити гаманець",
      demo: "Демонстраційна колекція",
      demoNote: "Ілюстрації колекцій. Наявність перевіряється перед замовленням.",
      nftUnavailable: "Замовлення NFT доступні після підключення передачі подарунків.",
      items: "товарів",
      close: "Закрити",
      digital: "Цифрові товари",
      guaranteesText:
        "Перевіряй характеристики й остаточну суму перед оплатою. Статус замовлення та підтверджена видача доступні у профілі.",
      support: "Підтримка",
      filter: "Фільтри",
      sort: "Сортування",
    },
    en: {
      open: "Open in Telegram",
      preview: "Your digital world. Closer.",
      previewText: "Collectible gifts, accounts and services. One catalog. One space.",
      scan: "Scan to open",
      language: "Language",
      profile: "Profile",
      guarantees: "Guarantees",
      tour: "Tour",
      catalog: "Catalog",
      cart: "Cart",
      more: "More",
      checkout: "Checkout",
      botCheckout: "Continue in bot",
      botNote: "The bot will show the final total and invoice. Opening the chat does not charge you.",
      terms: "I agree to the service terms",
      empty: "Your cart is empty",
      error: "Could not complete the action. Please retry.",
      auth: "Open Telegram to sign in",
      loading: "Loading…",
      history: "Transfer history",
      noHistory: "No confirmed transfers",
      historyUnavailable: "Transfer history is temporarily unavailable",
      collection: "Collection",
      collections: "Collections",
      rarest: "Rarest first",
      all: "All",
      total: "Total",
      address: "Wallet address",
      balance: "Balance",
      walletUnavailable: "Balance unavailable",
      admin: "Management",
      adminEntry: "Sign in with Telegram",
      forbidden: "Access denied",
      disconnect: "Disconnect wallet",
      copyAddress: "Copy address",
      copied: "Copied",
      connecting: "Connect wallet",
      demo: "Demo collection",
      demoNote: "Collection illustrations. Availability is checked before an order.",
      nftUnavailable: "NFT orders will be available once gift transfer is connected.",
      items: "items",
      close: "Close",
      digital: "Digital goods",
      guaranteesText:
        "Review item details and the final total before paying. Order status and confirmed delivery are available in your profile.",
      support: "Support",
      filter: "Filters",
      sort: "Sort",
    },
    ru: {
      open: "Открыть в Telegram",
      preview: "Твой цифровой мир — ближе.",
      previewText: "Коллекционные подарки, аккаунты и сервисы. Один каталог. Одно пространство.",
      scan: "Отсканируй, чтобы открыть",
      language: "Язык",
      profile: "Профиль",
      guarantees: "Гарантии",
      tour: "Экскурсия",
      catalog: "Каталог",
      cart: "Корзина",
      more: "Ещё",
      checkout: "Оформить заказ",
      botCheckout: "Продолжить в боте",
      botNote: "Бот покажет итоговую сумму и инвойс. При переходе средства не списываются.",
      terms: "Согласен с правилами сервиса",
      empty: "Корзина пока пуста",
      error: "Не удалось выполнить действие. Попробуй ещё раз.",
      auth: "Открой Telegram для входа",
      loading: "Загрузка…",
      history: "История передач",
      noHistory: "Нет подтверждённых передач",
      historyUnavailable: "История передач временно недоступна",
      collection: "Коллекция",
      collections: "Коллекции",
      rarest: "Сначала редкие",
      all: "Все",
      total: "Итого",
      address: "Адрес кошелька",
      balance: "Баланс",
      walletUnavailable: "Баланс недоступен",
      admin: "Управление",
      adminEntry: "Войти через Telegram",
      forbidden: "Доступ запрещён",
      disconnect: "Отключить кошелёк",
      copyAddress: "Копировать адрес",
      copied: "Скопировано",
      connecting: "Подключить кошелёк",
      demo: "Демонстрационная коллекция",
      demoNote: "Иллюстрации коллекций. Наличие проверяется перед заказом.",
      nftUnavailable: "Заказы NFT станут доступны после подключения передачи подарков.",
      items: "товаров",
      close: "Закрыть",
      digital: "Цифровые товары",
      guaranteesText: "Проверь характеристики и итоговую сумму перед оплатой. Статус заказа и подтверждённая выдача доступны в профиле.",
      support: "Поддержка",
      filter: "Фильтры",
      sort: "Сортировка",
    },
  } satisfies Record<M_lib_i18n.Locale, Record<string, string>>;
}
// lib/countries.ts
namespace M_lib_countries {
  export const countries = ["UA", "US", "CA", "IN", "ID", "VN", "UZ", "GB", "PL", "DE"] as const;
  export type Country = (typeof countries)[number];
  export function isCountry(value: string): value is Country {
    return countries.some((c) => c === value);
  }
  export function countryName(country: string, locale: M_lib_i18n.Locale) {
    return new Intl.DisplayNames([locale], {type: "region"}).of(country) ?? country;
  }
  export function countryFlag(country: string) {
    return [...country].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
  }
}
// lib/gifts/labels.ts
namespace M_lib_gifts_labels {
  const labels = {
    uk: {
      rare: "Рідкісний",
      epic: "Епічний",
      legendary: "Легендарний",
      mythic: "Міфічний",
      unique: "Унікальний",
      unknown: "Невідомо",
    },
    ru: {
      rare: "Редкий",
      epic: "Эпический",
      legendary: "Легендарный",
      mythic: "Мифический",
      unique: "Уникальный",
      unknown: "Неизвестно",
    },
    en: {
      rare: "Rare",
      epic: "Epic",
      legendary: "Legendary",
      mythic: "Mythic",
      unique: "Unique",
      unknown: "Unknown",
    },
  };
  export function rarityLabel(value: string, locale: M_lib_i18n.Locale) {
    return value.replace(
      /\b(rare|epic|legendary|mythic|unique|unknown)\b/gi,
      (word) => labels[locale][word.toLowerCase() as keyof typeof labels.en],
    );
  }
}
// lib/i18n.ts
namespace M_lib_i18n {
  export const locales = ["uk", "ru", "en"] as const;
  export type Locale = (typeof locales)[number];
  export function isLocale(value: string): value is Locale {
    return locales.some((l) => l === value);
  }
  export const copy = {
    uk: {
      catalog: "Каталог",
      title: "Цифровий світ. Твій вибір.",
      intro: "Акаунти, ігри та сервіси в одному просторі Legit Assets.",
      search: "Пошук товарів",
      all: "Усі товари",
      available: "В наявності",
      soldOut: "Немає в наявності",
      request: "Під замовлення",
      details: "Детальніше",
      empty: "За цим запитом нічого не знайдено",
      demo: "Попередній перегляд · ціни з архівів, наявність не підтверджена",
      delivery: "Спосіб видачі",
      automatic: "Через API провайдера",
      manual: "Вручну адміністратором",
      soon: "Купівля стане доступною після підключення оплат і постачальників.",
      back: "До каталогу",
      footer: "Єдиний простір цифрових товарів",
      skip: "До вмісту",
    },
    ru: {
      catalog: "Каталог",
      title: "Цифровой мир. Твой выбор.",
      intro: "Аккаунты, игры и сервисы в одном пространстве Legit Assets.",
      search: "Поиск товаров",
      all: "Все товары",
      available: "В наличии",
      soldOut: "Нет в наличии",
      request: "Под заказ",
      details: "Подробнее",
      empty: "По этому запросу ничего не найдено",
      demo: "Предпросмотр · цены из архивов, наличие не подтверждено",
      delivery: "Способ выдачи",
      automatic: "Через API провайдера",
      manual: "Вручную администратором",
      soon: "Покупка станет доступна после подключения оплат и поставщиков.",
      back: "В каталог",
      footer: "Единое пространство цифровых товаров",
      skip: "К содержимому",
    },
    en: {
      catalog: "Catalog",
      title: "Digital world. Your choice.",
      intro: "Accounts, games and services in one Legit Assets space.",
      search: "Search products",
      all: "All products",
      available: "In stock",
      soldOut: "Out of stock",
      request: "On request",
      details: "View details",
      empty: "No products match your search",
      demo: "Preview · archived prices, availability unconfirmed",
      delivery: "Delivery method",
      automatic: "Provider API",
      manual: "Manually by an administrator",
      soon: "Purchases will be available once payments and providers are connected.",
      back: "Back to catalog",
      footer: "One space for digital goods",
      skip: "Skip to content",
    },
  } as const;
  export const categories = [
    {
      slug: "steam-accounts",
      title: {
        uk: "Steam-акаунти",
        ru: "Steam-аккаунты",
        en: "Steam accounts",
      },
    },
    {
      slug: "telegram-accounts",
      title: {
        uk: "Telegram-акаунти",
        ru: "Telegram-аккаунты",
        en: "Telegram accounts",
      },
    },
    {
      slug: "smm",
      title: {uk: "SMM-послуги", ru: "SMM-услуги", en: "SMM services"},
    },
    {
      slug: "verifications",
      title: {uk: "Верифікації", ru: "Верификации", en: "Verifications"},
    },
    {
      slug: "nft-gifts",
      title: {uk: "NFT Подарунки", ru: "NFT Подарки", en: "NFT Gifts"},
    },
  ] as const;
}
// lib/locale-preference.ts
namespace M_lib_locale_preference {
  export function telegramLocale(language: string | undefined): M_lib_i18n.Locale {
    const code = language?.toLowerCase().split(/[-_]/)[0];
    return code === "uk" || code === "ru" ? code : "en";
  }
  export function savedLocale(): M_lib_i18n.Locale | undefined {
    try {
      const stored = localStorage.getItem("legit-language");
      return stored && M_lib_i18n.isLocale(stored) ? stored : undefined;
    } catch {
      return undefined;
    }
  }
  export function saveLocale(locale: M_lib_i18n.Locale) {
    try {
      localStorage.setItem("legit-language", locale);
    } catch {}
    document.cookie = `legit-language=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
}
// lib/money.ts
namespace M_lib_money {
  export type RetailPrice = {
    UAH: number;
    USDT: number;
  };
  // rate = RUB per one unit of currency, as returned by LZT /currency.
  export type FxSnapshot = {
    rates: Record<string, string>;
    updatedAt: number;
    fetchedAt: number;
    source: "lzt" | "manual";
  };
  const MAX_MINOR = 1000000000000;
  function positive(value: M_lib_money_i0.Value) {
    const d = new M_lib_money_i0(value);
    if (!d.isFinite() || d.lte(0)) throw Error("invalid_rate_or_amount");
    return d;
  }
  export function quoteRetail(
    amount: M_lib_money_i0.Value,
    currency: string,
    fx: FxSnapshot,
    markupPercent: M_lib_money_i0.Value = 0,
  ): RetailPrice {
    const source = currency.toUpperCase();
    const value = positive(amount);
    const margin = new M_lib_money_i0(markupPercent);
    if (!margin.isFinite() || margin.lt(0) || margin.gt(1000)) throw Error("invalid_markup");
    const sourceRate = positive(fx.rates[source]);
    const factor = margin.div(100).plus(1);
    function target(currency: "UAH" | "USDT") {
      const result = value
        .mul(sourceRate)
        .div(positive(fx.rates[currency]))
        .mul(factor)
        .mul(100)
        .toDecimalPlaces(0, M_lib_money_i0.ROUND_CEIL);
      if (result.lt(1) || result.gt(MAX_MINOR)) throw Error("invalid_price");
      return result.toNumber();
    }
    return {UAH: target("UAH"), USDT: target("USDT")};
  }
  // Bounds are expanded by one cent to account for CEIL retail rounding.
  // Final exact inclusive filtering is performed on quoted retail prices.
  export function sourceBound(retail: string, currency: "UAH" | "USDT", fx: FxSnapshot, markup: string, upper: boolean): string {
    const n = new M_lib_money_i0(retail);
    if (!n.isFinite() || n.lt(0) || n.gt(1000000)) throw Error("invalid_bound");
    const factor = new M_lib_money_i0(markup).div(100).plus(1);
    if (!factor.isFinite() || factor.lt(1) || factor.gt(11)) throw Error("invalid_markup");
    return M_lib_money_i0.max(
      "0.01",
      n
        .plus(upper ? "0.01" : "-0.01")
        .mul(positive(fx.rates[currency]))
        .div(positive(fx.rates.USD))
        .div(factor),
    )
      .toDecimalPlaces(4, upper ? M_lib_money_i0.ROUND_CEIL : M_lib_money_i0.ROUND_FLOOR)
      .toFixed(4);
  }
  export type GiftRetailQuote = RetailPrice & {
    TON: string;
    XTR: number;
  };
  // UAH/USDT remain integer cents throughout commerce; TON is a decimal string,
  // XTR is indivisible. Round once at each payment currency's smallest unit.
  export function quoteRetailFour(
    amount: M_lib_money_i0.Value,
    currency: string,
    fx: FxSnapshot,
    tonUsdt: M_lib_money_i0.Value,
    starUsdt: M_lib_money_i0.Value = "0.015",
  ): GiftRetailQuote {
    const usd = positive(amount).mul(positive(fx.rates[currency.toUpperCase()])).div(positive(fx.rates.USDT));
    const marked = usd.mul("1.07");
    const TON = marked.div(positive(tonUsdt)).toDecimalPlaces(9, M_lib_money_i0.ROUND_CEIL).toFixed(9);
    const stars = marked.div(positive(starUsdt)).ceil();
    if (stars.gt(Number.MAX_SAFE_INTEGER)) throw Error("invalid_price");
    return {
      ...quoteRetail(amount, currency, fx, "7"),
      TON,
      XTR: stars.toNumber(),
    };
  }
  // A preview is scaled in integer minor units; never round a binary float.
  export function scaleMinorPreview(price: RetailPrice, quantity: number): RetailPrice {
    if (!Number.isSafeInteger(quantity) || quantity < 1) throw Error("invalid_quantity");
    function scale(value: number) {
      if (!Number.isSafeInteger(value) || value < 1) throw Error("invalid_price");
      const n = new M_lib_money_i0(value).mul(quantity).div(1000).ceil();
      if (n.gt(MAX_MINOR)) throw Error("invalid_price");
      return n.toNumber();
    }
    return {UAH: scale(price.UAH), USDT: scale(price.USDT)};
  }
}
// lib/navigation.ts
namespace M_lib_navigation {
  export type PrimaryTab = "store" | "nft" | "history" | "profile";
  export const primaryNavigation = {
    uk: {
      store: "Магазин",
      nft: "NFT",
      history: "Історія",
      profile: "Профіль",
    },
    ru: {
      store: "Магазин",
      nft: "NFT",
      history: "История",
      profile: "Профиль",
    },
    en: {store: "Shop", nft: "NFT", history: "History", profile: "Profile"},
  };
  export function activePrimaryTab(pathname: string, locale: M_lib_i18n.Locale): PrimaryTab {
    const page = pathname
      .replace(new RegExp(`^/${locale}(?=/|$)`), "")
      .split("/")
      .filter(Boolean)[0];
    if (page === "nft-gifts" || page === "gifts") return "nft";
    if (page === "history") return "history";
    if (page === "account" || page === "login") return "profile";
    return "store";
  }
  export function primaryTabs(locale: M_lib_i18n.Locale) {
    return (
      [
        {id: "store", path: `/${locale}`},
        {id: "nft", path: `/${locale}/nft-gifts`},
        {id: "history", path: `/${locale}/history`},
        {id: "profile", path: `/${locale}/account`},
      ] as const
    ).map((tab) => ({...tab, label: primaryNavigation[locale][tab.id]}));
  }
}
// lib/shop-copy.ts
namespace M_lib_shop_copy {
  export const commerceCopy = {
    uk: {
      cart: "Кошик",
      account: "Кабінет",
      login: "Увійти",
      logout: "Вийти",
      register: "Створити акаунт",
      email: "Email",
      password: "Пароль — від 16 символів",
      name: "Ім’я",
      add: "Додати до кошика",
      added: "У кошику",
      remove: "Видалити",
      empty: "Кошик порожній",
      catalog: "До каталогу",
      calculate: "Оновити розрахунок",
      pay: "Оплатити з балансу",
      stars: "Оплатити Stars",
      total: "Разом",
      currency: "Валюта оплати",
      balance: "Баланс",
      deposit: "Поповнити",
      amount: "Сума поповнення",
      orders: "Замовлення",
      transactions: "Історія балансу",
      download: "Отримати товар",
      terms: "Я прочитав правила та перевірив параметри замовлення",
      paymentPending: "Очікуємо підтвердження оплати",
      check: "Перевірити оплату",
      loading: "Завантаження…",
      telegramLogin: "Увійти через Telegram",
      error: "Не вдалося виконати дію. Спробуй ще раз.",
      authRequired: "Увійди, щоб оформити замовлення",
      noPayments: "Налаштування платіжного провайдера ще не завершене",
      tmaPayment: "У Telegram цифрові товари оплачуються Stars. Грн і USDT показуємо для порівняння.",
      tour: "Екскурсія",
      emptyOrders: "Замовлень ще немає",
      emptyTransactions: "Операцій ще немає",
      requestSupport: "Підтримка",
      retry: "Повторити",
    },
    ru: {
      cart: "Корзина",
      account: "Кабинет",
      login: "Войти",
      logout: "Выйти",
      register: "Создать аккаунт",
      email: "Email",
      password: "Пароль — от 16 символов",
      name: "Имя",
      add: "Добавить в корзину",
      added: "В корзине",
      remove: "Удалить",
      empty: "Корзина пуста",
      catalog: "В каталог",
      calculate: "Обновить расчёт",
      pay: "Оплатить с баланса",
      stars: "Оплатить Stars",
      total: "Итого",
      currency: "Валюта оплаты",
      balance: "Баланс",
      deposit: "Пополнить",
      amount: "Сумма пополнения",
      orders: "Заказы",
      transactions: "История баланса",
      download: "Получить товар",
      terms: "Я прочитал правила и проверил параметры заказа",
      paymentPending: "Ожидаем подтверждение оплаты",
      check: "Проверить оплату",
      loading: "Загрузка…",
      telegramLogin: "Войти через Telegram",
      error: "Не удалось выполнить действие. Попробуй ещё раз.",
      authRequired: "Войди, чтобы оформить заказ",
      noPayments: "Настройка платёжного провайдера ещё не завершена",
      tmaPayment: "В Telegram цифровые товары оплачиваются Stars. Грн и USDT показаны для сравнения.",
      tour: "Экскурсия",
      emptyOrders: "Заказов пока нет",
      emptyTransactions: "Операций пока нет",
      requestSupport: "Поддержка",
      retry: "Повторить",
    },
    en: {
      cart: "Cart",
      account: "My account",
      login: "Sign in",
      logout: "Sign out",
      register: "Create account",
      email: "Email",
      password: "Password — at least 16 characters",
      name: "Name",
      add: "Add to cart",
      added: "In cart",
      remove: "Remove",
      empty: "Your cart is empty",
      catalog: "Browse catalog",
      calculate: "Refresh quote",
      pay: "Pay from balance",
      stars: "Pay with Stars",
      total: "Total",
      currency: "Payment currency",
      balance: "Balance",
      deposit: "Top up",
      amount: "Top-up amount",
      orders: "Orders",
      transactions: "Balance history",
      download: "Get delivery",
      terms: "I have read the rules and checked the order details",
      paymentPending: "Waiting for payment confirmation",
      check: "Check payment",
      loading: "Loading…",
      telegramLogin: "Sign in with Telegram",
      error: "Could not complete the action. Please retry.",
      authRequired: "Sign in to place an order",
      noPayments: "Payment provider setup is not complete yet",
      tmaPayment: "Digital goods in Telegram use Stars. UAH and USDT are shown for comparison.",
      tour: "Tour",
      emptyOrders: "No orders yet",
      emptyTransactions: "No transactions yet",
      requestSupport: "Support",
      retry: "Retry",
    },
  } satisfies Record<M_lib_i18n.Locale, Record<string, string>>;
  export function shopError(code: string, locale: M_lib_i18n.Locale) {
    const messages: Record<string, Record<M_lib_i18n.Locale, string>> = {
      network_error: {
        uk: "Немає зв’язку. Перевір інтернет і спробуй ще раз.",
        ru: "Нет соединения. Проверь интернет и попробуй ещё раз.",
        en: "Connection failed. Check your internet and retry.",
      },
      request_timeout: {
        uk: "Сервер довго не відповідає. Спробуй ще раз. Якщо це оплата — спершу перевір Історію.",
        ru: "Сервер долго не отвечает. Попробуй ещё раз. Если это оплата — сначала проверь Историю.",
        en: "The server took too long. Retry. For a payment, check History first.",
      },
      supplier_checkout_disabled: {
        uk: "Автоматична видача тимчасово недоступна. Кошти не списано.",
        ru: "Автоматическая выдача временно недоступна. Средства не списаны.",
        en: "Automatic delivery is temporarily unavailable. No funds were debited.",
      },
      insufficient_balance: {
        uk: "Недостатньо коштів. Поповни баланс у вибраній валюті.",
        ru: "Недостаточно средств. Пополни баланс в выбранной валюте.",
        en: "Insufficient funds. Top up the selected currency.",
      },
      out_of_stock: {
        uk: "Товар закінчився. Онови кошик.",
        ru: "Товар закончился. Обнови корзину.",
        en: "This product is out of stock. Refresh your cart.",
      },
      item_unavailable: {
        uk: "Товар більше недоступний.",
        ru: "Товар больше недоступен.",
        en: "This product is no longer available.",
      },
      item_reserved: {
        uk: "Акаунт уже зарезервовано іншим покупцем.",
        ru: "Аккаунт уже зарезервирован другим покупателем.",
        en: "Another buyer has reserved this account.",
      },
      invalid_credentials: {
        uk: "Перевір email і пароль (щонайменше 16 символів).",
        ru: "Проверь email и пароль (не менее 16 символов).",
        en: "Check your email and password (at least 16 characters).",
      },
      account_exists: {
        uk: "Такий email уже зареєстровано. Увійди.",
        ru: "Этот email уже зарегистрирован. Войди.",
        en: "This email is registered. Sign in.",
      },
      rate_limit: {
        uk: "Забагато спроб. Зачекай перед повтором.",
        ru: "Слишком много попыток. Подожди перед повтором.",
        en: "Too many attempts. Please wait before retrying.",
      },
      nft_checkout_unavailable: {
        uk: "Передача NFT ще не підключена. Оплата недоступна.",
        en: "NFT transfer is not connected yet. Payment is unavailable.",
        ru: "Передача NFT ещё не подключена. Оплата недоступна.",
      },
      handoff_expired: {
        uk: "Посилання прострочене. Повернися до кошика й спробуй ще раз.",
        en: "This link expired. Return to your cart and retry.",
        ru: "Ссылка истекла. Вернись в корзину и попробуй снова.",
      },
      handoff_used: {
        uk: "Це замовлення належить іншому користувачу.",
        en: "This order belongs to another user.",
        ru: "Этот заказ принадлежит другому пользователю.",
      },
      onboarding_required: {
        uk: "Спочатку обери мову й заверши екскурсію в Mini App.",
        ru: "Сначала выбери язык и заверши экскурсию в Mini App.",
        en: "Choose your language and complete the Mini App tour first.",
      },
      bot_topup_only: {
        uk: "Поповнення доступне лише через бота.",
        ru: "Пополнение доступно только через бота.",
        en: "Top-ups are available only through the bot.",
      },
      price_changed: {
        uk: "Ціна змінилася. Онови розрахунок.",
        ru: "Цена изменилась. Обнови расчёт.",
        en: "The price changed. Refresh your quote.",
      },
    };
    return messages[code]?.[locale] ?? commerceCopy[locale].error;
  }
  export function shopStatus(code: string, locale: M_lib_i18n.Locale): string {
    const labels: Record<string, [string, string, string]> = {
      PENDING: ["Очікує оплати / обробки", "Ожидает оплаты / обработки", "Pending"],
      PAID: ["Оплачено", "Оплачено", "Paid"],
      FULFILLING: ["Виконується", "Выполняется", "In progress"],
      COMPLETED: ["Виконано", "Выполнено", "Completed"],
      CANCELLED: ["Скасовано", "Отменено", "Cancelled"],
      CANCELED: ["Скасовано", "Отменено", "Cancelled"],
      REFUNDED: ["Повернено", "Возвращено", "Refunded"],
      NEEDS_REVIEW: ["Перевіряє підтримка", "Проверяет поддержка", "Under review"],
      DELIVERED: ["Видано", "Выдано", "Delivered"],
      PROCESSING: ["Виконується", "Выполняется", "In progress"],
      QUEUED: ["У черзі", "В очереди", "Queued"],
      PREPARING: ["Готується", "Подготовка", "Preparing"],
      SENDING: ["Передається постачальнику", "Передаётся поставщику", "Submitting"],
      RUNNING: ["Виконується", "Выполняется", "In progress"],
      UNKNOWN: ["Потрібна перевірка", "Нужна проверка", "Under review"],
      PARTIAL: ["Виконано частково", "Выполнено частично", "Partially completed"],
      FAILED: ["Не виконано", "Не выполнено", "Failed"],
      DEPOSIT: ["Поповнення", "Пополнение", "Top-up"],
      PURCHASE: ["Покупка", "Покупка", "Purchase"],
      REFUND: ["Повернення", "Возврат", "Refund"],
      ADJUSTMENT: ["Коригування", "Корректировка", "Adjustment"],
    };
    return labels[code]?.[locale === "uk" ? 0 : locale === "ru" ? 1 : 2] ?? code;
  }
}
// lib/smm/definitions.ts
namespace M_lib_smm_definitions {
  export type Platform = "telegram" | "instagram" | "tiktok" | "threads";
  export const definitions = [
    {
      key: "tg-subs",
      platform: "telegram",
      target: "profile",
      title: {
        uk: "Підписники каналу",
        ru: "Подписчики канала",
        en: "Channel subscribers",
      },
      previewRate: "8.43",
    },
    {
      key: "tg-react",
      platform: "telegram",
      target: "post",
      title: {
        uk: "Реакції на пост",
        ru: "Реакции на пост",
        en: "Post reactions",
      },
      previewRate: "4.67",
    },
    {
      key: "ig-followers",
      platform: "instagram",
      target: "profile",
      title: {
        uk: "Підписники профілю",
        ru: "Подписчики профиля",
        en: "Profile followers",
      },
      previewRate: "7.80",
    },
    {
      key: "ig-likes",
      platform: "instagram",
      target: "post",
      title: {
        uk: "Лайки публікації",
        ru: "Лайки публикации",
        en: "Post likes",
      },
      previewRate: "2.47",
    },
    {
      key: "tt-subs",
      platform: "tiktok",
      target: "profile",
      title: {
        uk: "Підписники профілю",
        ru: "Подписчики профиля",
        en: "Profile followers",
      },
      previewRate: "9.05",
    },
    {
      key: "tt-likes",
      platform: "tiktok",
      target: "post",
      title: {uk: "Лайки відео", ru: "Лайки видео", en: "Video likes"},
      previewRate: "3.10",
    },
  ] as const;
  export type ServiceKey = (typeof definitions)[number]["key"];
  export function definition(key: string) {
    return definitions.find((d) => d.key === key);
  }
  export const smmCopy = {
    uk: {
      title: "Просування під твої задачі.",
      intro: "Обери платформу, послугу та кількість. Переглянь актуальні тарифи й розрахуй вартість.",
      platform: "Платформа",
      service: "Послуга",
      quantity: "Кількість",
      link: "Посилання на канал або публікацію",
      calculate: "Розрахувати вартість",
      calculating: "Розраховуємо…",
      per1000: "за 1 000",
      preview: "Попередній тариф",
      live: "Тариф постачальника",
      available: "Підключено",
      notConnected: "Постачальника ще не підключено. Показуємо попередні тарифи з твого каталогу.",
      amount: "Вартість замовлення",
      range: "Доступна кількість",
      badLink: "Перевір посилання: потрібен публічний канал, профіль або пост відповідної платформи.",
      error: "Не вдалося розрахувати ціну. Перевір параметри або спробуй пізніше.",
      minMax: "Кількість поза доступним діапазоном.",
      more: "Параметри пакета",
      refill: "Повторне поповнення",
      cancel: "Можливість скасування",
      providerTerms: "Доступність цих можливостей визначає постачальник.",
      automatic: "Виконання після оплати",
      steps: ["Платформа та параметри", "Підтверджена оплата", "Автоматичне виконання", "Відстеження результату"],
      checkout: "Оформлення стане доступним після підключення оплат.",
      unknown: "Не підтверджено",
      yes: "Доступно",
      no: "Не передбачено",
      total: "Разом",
      quality: "Умови й характеристики конкретного пакета перевіряй перед замовленням.",
    },
    ru: {
      title: "Продвижение под твои задачи.",
      intro: "Выбери платформу, услугу и количество. Посмотри актуальные тарифы и рассчитай стоимость.",
      platform: "Платформа",
      service: "Услуга",
      quantity: "Количество",
      link: "Ссылка на канал или публикацию",
      calculate: "Рассчитать стоимость",
      calculating: "Рассчитываем…",
      per1000: "за 1 000",
      preview: "Предварительный тариф",
      live: "Тариф поставщика",
      available: "Подключено",
      notConnected: "Поставщик ещё не подключён. Показываем предварительные тарифы из твоего каталога.",
      amount: "Стоимость заказа",
      range: "Доступное количество",
      badLink: "Проверь ссылку: нужен публичный канал, профиль или пост соответствующей платформы.",
      error: "Не удалось рассчитать цену. Проверь параметры или попробуй позже.",
      minMax: "Количество вне доступного диапазона.",
      more: "Параметры пакета",
      refill: "Повторное пополнение",
      cancel: "Возможность отмены",
      providerTerms: "Доступность этих возможностей определяет поставщик.",
      automatic: "Выполнение после оплаты",
      steps: ["Платформа и параметры", "Подтверждённая оплата", "Автоматическое выполнение", "Отслеживание результата"],
      checkout: "Оформление станет доступным после подключения оплат.",
      unknown: "Не подтверждено",
      yes: "Доступно",
      no: "Не предусмотрено",
      total: "Итого",
      quality: "Условия и характеристики конкретного пакета проверяй перед заказом.",
    },
    en: {
      title: "Promotion for your goals.",
      intro: "Choose a platform, service and quantity. Browse current rates and calculate the price.",
      platform: "Platform",
      service: "Service",
      quantity: "Quantity",
      link: "Channel or post URL",
      calculate: "Calculate price",
      calculating: "Calculating…",
      per1000: "per 1,000",
      preview: "Preview rate",
      live: "Supplier rate",
      available: "Connected",
      notConnected: "Supplier is not connected yet. Showing preview rates from your existing catalog.",
      amount: "Order price",
      range: "Available quantity",
      badLink: "Check the URL: a public channel, profile or post on the selected platform is required.",
      error: "Could not calculate a price. Check your settings or try again later.",
      minMax: "Quantity is outside the available range.",
      more: "Package details",
      refill: "Refill",
      cancel: "Cancellation",
      providerTerms: "Availability of these features depends on the supplier.",
      automatic: "Fulfillment after payment",
      steps: ["Platform and details", "Confirmed payment", "Automatic fulfillment", "Track the result"],
      checkout: "Checkout will be available after payments are connected.",
      unknown: "Unconfirmed",
      yes: "Available",
      no: "Not supported",
      total: "Total",
      quality: "Check the terms and features of each package before ordering.",
    },
  } satisfies Record<M_lib_i18n.Locale, Record<string, string | string[]>>;
}
// lib/smm/metadata.ts
namespace M_lib_smm_metadata {
  // Supplier names are retained verbatim; platform grouping is only navigation.
  export function servicePlatform(category: string, name: string): string {
    const text = `${category} ${name}`.toLowerCase();
    const matches: [string, RegExp][] = [
      ["threads", /threads/],
      ["instagram", /instagram/],
      ["telegram", /telegram/],
      ["youtube", /youtube/],
      ["tiktok", /tiktok/],
      ["facebook", /facebook/],
      ["twitter", /twitter|\bx - /],
      ["spotify", /spotify/],
      ["twitch", /twitch/],
      ["discord", /discord/],
      ["coinmarketcap", /coinmarketcap/],
      ["soundcloud", /soundcloud/],
      ["linkedin", /linkedin/],
      ["pinterest", /pinterest/],
      ["reddit", /reddit/],
      ["snapchat", /snapchat/],
      ["whatsapp", /whatsapp/],
      ["kick", /kick\.com|kick /],
      ["traffic", /traffic|backlink|visitors|seo/],
    ];
    return matches.find(([, pattern]) => pattern.test(text))?.[0] ?? "other";
  }
  export const platformLabels: Record<string, string> = {
    telegram: "Telegram",
    instagram: "Instagram",
    threads: "Threads",
    youtube: "YouTube",
    tiktok: "TikTok",
    facebook: "Facebook",
    twitter: "X / Twitter",
    spotify: "Spotify",
    twitch: "Twitch",
    discord: "Discord",
    coinmarketcap: "CoinMarketCap",
    soundcloud: "SoundCloud",
    linkedin: "LinkedIn",
    pinterest: "Pinterest",
    reddit: "Reddit",
    snapchat: "Snapchat",
    whatsapp: "WhatsApp",
    kick: "Kick",
    traffic: "Web / SEO",
    other: "Other",
  };
  export const platformHosts: Record<string, string[]> = {
    telegram: ["t.me", "telegram.me"],
    instagram: ["instagram.com"],
    threads: ["threads.net", "threads.com"],
    youtube: ["youtube.com", "youtu.be"],
    tiktok: ["tiktok.com"],
    facebook: ["facebook.com", "fb.watch"],
    twitter: ["x.com", "twitter.com"],
    spotify: ["spotify.com"],
    twitch: ["twitch.tv"],
    discord: ["discord.gg", "discord.com"],
    coinmarketcap: ["coinmarketcap.com"],
    soundcloud: ["soundcloud.com"],
    linkedin: ["linkedin.com"],
    pinterest: ["pinterest.com", "pin.it"],
    reddit: ["reddit.com", "redd.it"],
    snapchat: ["snapchat.com"],
    whatsapp: ["whatsapp.com"],
    kick: ["kick.com"],
  };
}
// lib/smm/rules.ts
namespace M_lib_smm_rules {
  export class SmmError extends Error {
    constructor(
      public code: string,
      public ambiguous = false,
    ) {
      super(code);
    }
  }
  export function normalizeTarget(key: string, value: string, platform?: string): string {
    const def = M_lib_smm_definitions.definition(key);
    if (!def && (!/^jap-[1-9][0-9]{0,11}$/.test(key) || !platform)) throw new SmmError("invalid_service");
    let url: URL;
    try {
      url = new URL(value.trim());
    } catch {
      throw new SmmError("invalid_link");
    }
    if (url.protocol !== "https:" || url.username || url.password || url.port || value.length > 2048) throw new SmmError("invalid_link");
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (!def) {
      // No HTTP request is made to this URL. Preserve query parameters (e.g. YouTube video IDs).
      const allowed = M_lib_smm_metadata.platformHosts[platform!];
      if (allowed && !allowed.some((h) => host === h || host.endsWith(`.${h}`))) throw new SmmError("invalid_link");
      if (
        !host.includes(".") ||
        host.includes(":") ||
        /^[0-9.]+$/.test(host) ||
        /(^|\.)(localhost|local|internal|test|invalid)$/.test(host)
      )
        throw new SmmError("invalid_link");
      url.hash = "";
      return url.toString();
    }
    const allowed = {
      telegram: ["t.me", "telegram.me"],
      instagram: ["instagram.com"],
      tiktok: ["tiktok.com"],
      threads: ["threads.net", "threads.com"],
    };
    if (!allowed[def.platform].includes(host)) throw new SmmError("invalid_link");
    const path = url.pathname.replace(/\/$/, "");
    const valid =
      def.platform === "telegram"
        ? def.target === "profile"
          ? /^\/[A-Za-z][A-Za-z0-9_]{4,31}$/
          : /^\/[A-Za-z][A-Za-z0-9_]{4,31}\/[1-9][0-9]*$/
        : def.platform === "instagram"
          ? def.target === "profile"
            ? /^\/[a-zA-Z0-9_.]{1,30}$/
            : /^\/(p|reel)\/[a-zA-Z0-9_-]+$/
          : def.target === "profile"
            ? /^\/@[a-zA-Z0-9_.]{1,40}$/
            : /^\/@[a-zA-Z0-9_.]{1,40}\/video\/[0-9]+$/;
    if (!valid.test(path)) throw new SmmError("invalid_link");
    url.hostname = host;
    url.pathname = path;
    url.search = "";
    url.hash = "";
    return url.toString();
  }
  export function validateQuantity(quantity: unknown, min: number, max: number): number {
    if (typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < min || quantity > max)
      throw new SmmError("invalid_quantity");
    return quantity;
  }
  export function providerStatus(value: unknown): "RUNNING" | "COMPLETED" | "PARTIAL" | "CANCELED" | "UNKNOWN" {
    const s = String(value).trim().toLowerCase();
    if (["pending", "processing", "in progress"].includes(s)) return "RUNNING";
    if (s === "completed") return "COMPLETED";
    if (s === "partial") return "PARTIAL";
    if (["canceled", "cancelled", "refunded"].includes(s)) return "CANCELED";
    return "UNKNOWN";
  }
}
// lib/store-copy.ts
namespace M_lib_store_copy {
  export const shopCopy = {
    uk: {
      moreFilters: "Додаткові фільтри",
      chooseCountry: "Обери країну акаунта",
      countryIntro: "Спочатку країна — потім ціна, спамблок і Premium.",
      country: "Країна",
      spam: "Спамблок",
      any: "Будь-який",
      noSpam: "Без спамблоку",
      hasSpam: "Є спамблок",
      unknown: "Не вказано",
      premium: "Premium",
      password: "Хмарний пароль",
      yes: "Так",
      no: "Ні",
      sort: "Сортування",
      cheap: "Спочатку дешевші",
      expensive: "Спочатку дорожчі",
      newest: "Нові оголошення",
      apply: "Застосувати",
      reset: "Скинути",
      from: "Ціна від",
      to: "Ціна до",
      min: "Мін.",
      max: "Макс.",
      currency: "Валюта фільтра",
      empty: "За цими фільтрами акаунтів немає",
      unavailable: "Каталог тимчасово недоступний. Спробуй оновити сторінку пізніше.",
      notConfigured: "Товари цього розділу поки недоступні. Повернись до магазину або звернись у підтримку.",
      retry: "Оновити",
      next: "Наступна",
      previous: "Попередня",
      page: "Сторінка",
      details: "Характеристики",
      live: "Актуальні оголошення",
      fxUnavailable: "Курс тимчасово недоступний",
      fxNote: "Курс і націнка враховані. Остаточна ціна фіксується при оформленні.",
      rules: "Правила",
      about: "Про нас",
      payment: "Оплата й доставка",
      tos: "Угода користувача",
      privacy: "Конфіденційність",
      allCountries: "Усі країни",
      channels: "Канали",
      chats: "Чати",
      contacts: "Контакти",
      dc: "Датацентр",
      delivery: "Видача після підтвердженої оплати",
      checkoutSoon: "Оплати й автоматична видача ще підключаються.",
      listed: "Наявність перевірено під час завантаження. До оплати вона може змінитися.",
      countryDeep: "Відкрити цю країну в Telegram",
      ruleSource: "Правила Legit Assets.",
      archived: "Ціни зі старого каталогу; наявність уточнюється.",
    },
    ru: {
      moreFilters: "Дополнительные фильтры",
      chooseCountry: "Выбери страну аккаунта",
      countryIntro: "Сначала страна — затем цена, спамблок и Premium.",
      country: "Страна",
      spam: "Спамблок",
      any: "Любой",
      noSpam: "Без спамблока",
      hasSpam: "Есть спамблок",
      unknown: "Не указано",
      premium: "Premium",
      password: "Облачный пароль",
      yes: "Да",
      no: "Нет",
      sort: "Сортировка",
      cheap: "Сначала дешевле",
      expensive: "Сначала дороже",
      newest: "Новые объявления",
      apply: "Применить",
      reset: "Сбросить",
      from: "Цена от",
      to: "Цена до",
      min: "Мин.",
      max: "Макс.",
      currency: "Валюта фильтра",
      empty: "По этим фильтрам аккаунтов нет",
      unavailable: "Каталог временно недоступен. Попробуй обновить страницу позже.",
      notConfigured: "Товары этого раздела пока недоступны. Вернись в магазин или обратись в поддержку.",
      retry: "Обновить",
      next: "Следующая",
      previous: "Предыдущая",
      page: "Страница",
      details: "Характеристики",
      live: "Актуальные объявления",
      fxUnavailable: "Курс временно недоступен",
      fxNote: "Курс и наценка учтены. Итоговая цена фиксируется при оформлении.",
      rules: "Правила",
      about: "О нас",
      payment: "Оплата и доставка",
      tos: "Пользовательское соглашение",
      privacy: "Конфиденциальность",
      allCountries: "Все страны",
      channels: "Каналы",
      chats: "Чаты",
      contacts: "Контакты",
      dc: "Датацентр",
      delivery: "Выдача после подтверждённой оплаты",
      checkoutSoon: "Оплаты и автоматическая выдача ещё подключаются.",
      listed: "Наличие проверено при загрузке. До оплаты оно может измениться.",
      countryDeep: "Открыть эту страну в Telegram",
      ruleSource: "Правила Legit Assets.",
      archived: "Цены из старого каталога; наличие уточняется.",
    },
    en: {
      moreFilters: "More filters",
      chooseCountry: "Choose account country",
      countryIntro: "Country first — then price, spam restrictions and Premium.",
      country: "Country",
      spam: "Spam restrictions",
      any: "Any",
      noSpam: "No spam restrictions",
      hasSpam: "Has spam restrictions",
      unknown: "Not specified",
      premium: "Premium",
      password: "Cloud password",
      yes: "Yes",
      no: "No",
      sort: "Sort",
      cheap: "Cheapest first",
      expensive: "Most expensive first",
      newest: "Newest listings",
      apply: "Apply",
      reset: "Reset",
      from: "Price from",
      to: "Price to",
      min: "Min.",
      max: "Max.",
      currency: "Filter currency",
      empty: "No accounts match these filters",
      unavailable: "Catalog is temporarily unavailable. Please try again later.",
      notConfigured: "Items in this section are unavailable for now. Return to the shop or contact support.",
      retry: "Refresh",
      next: "Next",
      previous: "Previous",
      page: "Page",
      details: "Account details",
      live: "Live listings",
      fxUnavailable: "Exchange rate temporarily unavailable",
      fxNote: "Conversion and markup included. Final price is fixed at checkout.",
      rules: "Rules",
      about: "About us",
      payment: "Payment and delivery",
      tos: "Terms of service",
      privacy: "Privacy",
      allCountries: "All countries",
      channels: "Channels",
      chats: "Chats",
      contacts: "Contacts",
      dc: "Data center",
      delivery: "Delivery after confirmed payment",
      checkoutSoon: "Payments and automatic delivery are still being connected.",
      listed: "Availability checked when loaded. It may change before payment.",
      countryDeep: "Open this country in Telegram",
      ruleSource: "Legit Assets service rules.",
      archived: "Prices from the previous catalog; availability unconfirmed.",
    },
  } satisfies Record<M_lib_i18n.Locale, Record<string, string>>;
}
// lib/telegram-links.ts
namespace M_lib_telegram_links {
  export function telegramLinks(payload: string, bot = "LegitAssetsBot", mini = process.env.NEXT_PUBLIC_MINI_APP_NAME ?? "") {
    if (!/^[A-Za-z0-9_]{5,32}$/.test(bot) || !/^[A-Za-z0-9_-]{1,64}$/.test(payload)) throw Error("Invalid Telegram link configuration");
    if (mini && !/^[A-Za-z0-9_]{1,64}$/.test(mini)) throw Error("Invalid Mini App name");
    const botUrl = `https://t.me/${bot}?start=${payload}`;
    const miniAppUrl = mini ? `https://t.me/${bot}/${mini}?startapp=${payload}` : null;
    return {botUrl, miniAppUrl, url: miniAppUrl ?? botUrl};
  }
  export const modules = ["tour", "rules", "about", "payment", "privacy"] as const;
  export function moduleTelegramLink(locale: M_lib_i18n.Locale, module: (typeof modules)[number]) {
    return telegramLinks(`module_${locale}_${module}`).url;
  }
}
// lib/verification-copy.ts
namespace M_lib_verification_copy {
  export const verificationCopy = {
    uk: {
      eyebrow: "LEGIT / VERIFICATIONS",
      title: "Верифікації. З увагою до деталей.",
      intro: "Криптобіржі, гаманці та інші сервіси — обери платформу для індивідуального супроводу.",
      browse: "Обрати платформу",
      manual: "Ручне виконання",
      personal: "Індивідуальний супровід",
      currencies: "Ціни в грн та USDT",
      services: "Знайди свою платформу",
      subtitle: "Усі послуги в одному місці. Умови узгоджуємо перед початком.",
      all: "Усі платформи",
      exchange: "Криптобіржі",
      wallet: "Гаманці та Telegram",
      other: "Інші сервіси",
      search: "Пошук платформи",
      sort: "Сортування",
      defaultSort: "За платформою",
      cheap: "Ціна: від нижчої",
      expensive: "Ціна: від вищої",
      details: "Детальніше",
      empty: "Платформу не знайдено. Спробуй інший запит.",
      price: "Орієнтовна вартість",
      note: "Остаточні умови та доступність підтверджуємо перед замовленням.",
      flowTitle: "Зрозумілий процес",
      steps: ["Обери платформу", "Узгодь умови в боті", "Пройди процедуру із супроводом"],
      conditions: "Перед початком",
      conditionsText:
        "Послуга передбачає супровід власника акаунта. Підтвердження особи та передавання документів відбуваються безпосередньо на платформі.",
      terms: "Правила магазину",
      back: "Усі верифікації",
      contact: "Обговорити в боті",
      requestNote: "Кнопка відкриває бота для консультації. Замовлення й списання коштів не створюються.",
      noTime: "Терміни та вимоги залежать від платформи й узгоджуються індивідуально.",
      exchangeDesc: "Супровід процедури на криптобіржі.",
      walletDesc: "Допомога з процедурою в обраному сервісі.",
      otherDesc: "Індивідуальний супровід верифікації.",
      cardsDesc: "Супровід верифікації та налаштування картки за умовами платформи.",
      found: "платформ / послуг",
      checklist: ["Перевіряємо доступність послуги", "Узгоджуємо вартість та вимоги", "Супроводжуємо під час процедури"],
      affiliation: "Логотипи належать відповідним брендам. Legit Assets — незалежний сервіс супроводу.",
    },
    ru: {
      eyebrow: "LEGIT / VERIFICATIONS",
      title: "Верификации. С вниманием к деталям.",
      intro: "Криптобиржи, кошельки и другие сервисы — выбери платформу для индивидуального сопровождения.",
      browse: "Выбрать платформу",
      manual: "Ручное выполнение",
      personal: "Индивидуальное сопровождение",
      currencies: "Цены в грн и USDT",
      services: "Найди свою платформу",
      subtitle: "Все услуги в одном месте. Условия согласуем перед началом.",
      all: "Все платформы",
      exchange: "Криптобиржи",
      wallet: "Кошельки и Telegram",
      other: "Другие сервисы",
      search: "Поиск платформы",
      sort: "Сортировка",
      defaultSort: "По платформе",
      cheap: "Цена: от меньшей",
      expensive: "Цена: от большей",
      details: "Подробнее",
      empty: "Платформа не найдена. Попробуй другой запрос.",
      price: "Ориентировочная стоимость",
      note: "Итоговые условия и доступность подтверждаем перед заказом.",
      flowTitle: "Понятный процесс",
      steps: ["Выбери платформу", "Согласуй условия в боте", "Пройди процедуру с сопровождением"],
      conditions: "Перед началом",
      conditionsText:
        "Услуга предполагает сопровождение владельца аккаунта. Подтверждение личности и передача документов проходят непосредственно на платформе.",
      terms: "Правила магазина",
      back: "Все верификации",
      contact: "Обсудить в боте",
      requestNote: "Кнопка открывает бота для консультации. Заказ и списание средств не создаются.",
      noTime: "Сроки и требования зависят от платформы и согласуются индивидуально.",
      exchangeDesc: "Сопровождение процедуры на криптобирже.",
      walletDesc: "Помощь с процедурой в выбранном сервисе.",
      otherDesc: "Индивидуальное сопровождение верификации.",
      cardsDesc: "Сопровождение верификации и настройки карты по условиям платформы.",
      found: "платформ / услуг",
      checklist: ["Проверяем доступность услуги", "Согласуем стоимость и требования", "Сопровождаем во время процедуры"],
      affiliation: "Логотипы принадлежат соответствующим брендам. Legit Assets — независимый сервис сопровождения.",
    },
    en: {
      eyebrow: "LEGIT / VERIFICATIONS",
      title: "Verification. Every detail considered.",
      intro: "Crypto exchanges, wallets and other services — choose a platform for personal guidance.",
      browse: "Choose a platform",
      manual: "Manual service",
      personal: "Personal guidance",
      currencies: "Prices in UAH and USDT",
      services: "Find your platform",
      subtitle: "Every service in one place. We agree on the terms before starting.",
      all: "All platforms",
      exchange: "Crypto exchanges",
      wallet: "Wallets & Telegram",
      other: "Other services",
      search: "Search platforms",
      sort: "Sort",
      defaultSort: "By platform",
      cheap: "Price: low to high",
      expensive: "Price: high to low",
      details: "View details",
      empty: "No platform found. Try another search.",
      price: "Estimated price",
      note: "Final terms and availability are confirmed before ordering.",
      flowTitle: "A clear process",
      steps: ["Choose a platform", "Agree on terms in the bot", "Complete the process with guidance"],
      conditions: "Before you start",
      conditionsText:
        "This service guides the account owner. Identity checks and document submissions take place directly on the platform.",
      terms: "Store rules",
      back: "All verifications",
      contact: "Discuss in the bot",
      requestNote: "The button opens the bot for a consultation. No order is created and no funds are charged.",
      noTime: "Timing and requirements depend on the platform and are agreed individually.",
      exchangeDesc: "Guidance through the exchange's verification process.",
      walletDesc: "Help with the process on your chosen service.",
      otherDesc: "Personal verification guidance.",
      cardsDesc: "Guidance with verification and card setup under the platform's terms.",
      found: "platforms / services",
      checklist: ["Check service availability", "Agree on price and requirements", "Receive guidance during the process"],
      affiliation: "Logos belong to their respective brands. Legit Assets is an independent guidance service.",
    },
  } satisfies Record<M_lib_i18n.Locale, unknown>;
  export type VerificationGroup = "exchange" | "wallet" | "other";
  export const verificationBrands: Record<
    string,
    {
      name: string;
      image: string;
      color: string;
      group: VerificationGroup;
    }
  > = {
    vr_binance: {
      name: "Binance",
      image: "binance",
      color: "#f0b90b",
      group: "exchange",
    },
    vr_bybit: {
      name: "Bybit",
      image: "bybit",
      color: "#f7a600",
      group: "exchange",
    },
    vr_bybit_cards: {
      name: "Bybit Card",
      image: "bybit",
      color: "#f7a600",
      group: "exchange",
    },
    vr_okx: {name: "OKX", image: "okx", color: "#ffffff", group: "exchange"},
    vr_bingx: {
      name: "BingX",
      image: "bingx",
      color: "#3861ff",
      group: "exchange",
    },
    vr_mexc: {
      name: "MEXC",
      image: "mexc",
      color: "#2c73ff",
      group: "exchange",
    },
    vr_kucoin: {
      name: "KuCoin",
      image: "kucoin",
      color: "#23af91",
      group: "exchange",
    },
    vr_bitget: {
      name: "Bitget",
      image: "bitget",
      color: "#00d6df",
      group: "exchange",
    },
    vr_fragment: {
      name: "Fragment",
      image: "",
      color: "#81c8ff",
      group: "wallet",
    },
    vr_cryptobot: {
      name: "CryptoBot",
      image: "",
      color: "#49a9ed",
      group: "wallet",
    },
    vr_tgwallet: {
      name: "Wallet",
      image: "",
      color: "#0098ea",
      group: "wallet",
    },
    vr_antarctic: {
      name: "Antarctic Wallet",
      image: "",
      color: "#a2cdf8",
      group: "wallet",
    },
    vr_faceit: {
      name: "FACEIT",
      image: "faceit",
      color: "#ff5500",
      group: "other",
    },
  };
}
export import M_lib_admin_copy_adminText = M_lib_admin_copy.adminText;
export import M_lib_app_copy_appCopy = M_lib_app_copy.appCopy;
export import M_lib_countries_isCountry = M_lib_countries.isCountry;
export import M_lib_countries_countryName = M_lib_countries.countryName;
export import M_lib_countries_countryFlag = M_lib_countries.countryFlag;
export import M_lib_countries_countries = M_lib_countries.countries;
export type M_lib_countries_Country = M_lib_countries.Country;
export import M_lib_gifts_labels_rarityLabel = M_lib_gifts_labels.rarityLabel;
export import M_lib_i18n_isLocale = M_lib_i18n.isLocale;
export import M_lib_i18n_locales = M_lib_i18n.locales;
export type M_lib_i18n_Locale = M_lib_i18n.Locale;
export import M_lib_i18n_copy = M_lib_i18n.copy;
export import M_lib_i18n_categories = M_lib_i18n.categories;
export import M_lib_locale_preference_telegramLocale = M_lib_locale_preference.telegramLocale;
export import M_lib_locale_preference_savedLocale = M_lib_locale_preference.savedLocale;
export import M_lib_locale_preference_saveLocale = M_lib_locale_preference.saveLocale;
export import M_lib_money_quoteRetail = M_lib_money.quoteRetail;
export import M_lib_money_sourceBound = M_lib_money.sourceBound;
export import M_lib_money_quoteRetailFour = M_lib_money.quoteRetailFour;
export import M_lib_money_scaleMinorPreview = M_lib_money.scaleMinorPreview;
export type M_lib_money_RetailPrice = M_lib_money.RetailPrice;
export type M_lib_money_FxSnapshot = M_lib_money.FxSnapshot;
export type M_lib_money_GiftRetailQuote = M_lib_money.GiftRetailQuote;
export import M_lib_navigation_activePrimaryTab = M_lib_navigation.activePrimaryTab;
export import M_lib_navigation_primaryTabs = M_lib_navigation.primaryTabs;
export type M_lib_navigation_PrimaryTab = M_lib_navigation.PrimaryTab;
export import M_lib_navigation_primaryNavigation = M_lib_navigation.primaryNavigation;
export import M_lib_shop_copy_shopError = M_lib_shop_copy.shopError;
export import M_lib_shop_copy_shopStatus = M_lib_shop_copy.shopStatus;
export import M_lib_shop_copy_commerceCopy = M_lib_shop_copy.commerceCopy;
export import M_lib_smm_definitions_definition = M_lib_smm_definitions.definition;
export type M_lib_smm_definitions_Platform = M_lib_smm_definitions.Platform;
export import M_lib_smm_definitions_definitions = M_lib_smm_definitions.definitions;
export type M_lib_smm_definitions_ServiceKey = M_lib_smm_definitions.ServiceKey;
export import M_lib_smm_definitions_smmCopy = M_lib_smm_definitions.smmCopy;
export import M_lib_smm_metadata_servicePlatform = M_lib_smm_metadata.servicePlatform;
export import M_lib_smm_metadata_platformLabels = M_lib_smm_metadata.platformLabels;
export import M_lib_smm_metadata_platformHosts = M_lib_smm_metadata.platformHosts;
export import M_lib_smm_rules_normalizeTarget = M_lib_smm_rules.normalizeTarget;
export import M_lib_smm_rules_validateQuantity = M_lib_smm_rules.validateQuantity;
export import M_lib_smm_rules_providerStatus = M_lib_smm_rules.providerStatus;
export import M_lib_smm_rules_SmmError = M_lib_smm_rules.SmmError;
export import M_lib_store_copy_shopCopy = M_lib_store_copy.shopCopy;
export import M_lib_telegram_links_telegramLinks = M_lib_telegram_links.telegramLinks;
export import M_lib_telegram_links_moduleTelegramLink = M_lib_telegram_links.moduleTelegramLink;
export import M_lib_telegram_links_modules = M_lib_telegram_links.modules;
export import M_lib_verification_copy_verificationCopy = M_lib_verification_copy.verificationCopy;
export type M_lib_verification_copy_VerificationGroup = M_lib_verification_copy.VerificationGroup;
export import M_lib_verification_copy_verificationBrands = M_lib_verification_copy.verificationBrands;
// Customer requests have a deadline; payment requests are never retried automatically.
export async function customerRequest<T = Awaited<ReturnType<Response["json"]>>>(
  path: string,
  body?: object,
  signal?: AbortSignal,
  headers: Record<string, string> = {},
) {
  const deadline = AbortSignal.timeout(20000);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  try {
    const response = await fetch(path, {
      signal: combined,
      headers: body ? {...headers, "Content-Type": "application/json"} : headers,
      ...(body ? {method: "POST", body: JSON.stringify(body)} : {}),
      cache: "no-store",
    });
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw Error("unavailable");
    }
    if (!response.ok) {
      const code = data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "unavailable";
      throw Error(code);
    }
    return data as T;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (deadline.aborted) throw Error("request_timeout");
    if (error instanceof TypeError) throw Error("network_error");
    throw error;
  }
}
// Route selection is shared with tests; page implementations remain on the server.
export function miniAppScreenName(screen: string[] = []): string | null {
  const single = [
    "account",
    "cart",
    "gifts",
    "history",
    "info",
    "login",
    "modules",
    "nft-gifts",
    "smm",
    "steam-accounts",
    "tour",
    "verifications",
  ];
  if (!screen.length) return "";
  if (screen.length === 1) return single.includes(screen[0]) ? screen[0] : "[category]";
  if (screen.length === 2) {
    if (screen[0] === "modules") return "modules/[module]";
    if (screen[0] === "info") return "info/[document]";
    if (screen[0] === "telegram-accounts") return "telegram-accounts/[country]";
  }
  return null;
}

export type NftBrowseState = {
  search: string;
  filters: Record<"collection" | "model" | "backdrop" | "symbol" | "rarity", string>;
  sort: "recent" | "asc" | "desc";
  minimum: string;
  maximum: string;
  favoritesOnly: boolean;
  advanced: boolean;
};
export function validNftBrowseState(value: unknown): NftBrowseState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>,
    f = v.filters;
  const text = (s: unknown): s is string => typeof s === "string" && s.length <= 128;
  if (
    !text(v.search) ||
    !text(v.minimum) ||
    !text(v.maximum) ||
    typeof v.sort !== "string" ||
    !["recent", "asc", "desc"].includes(v.sort) ||
    typeof v.favoritesOnly !== "boolean" ||
    typeof v.advanced !== "boolean" ||
    !f ||
    typeof f !== "object" ||
    Array.isArray(f)
  )
    return null;
  const keys = ["collection", "model", "backdrop", "symbol", "rarity"] as const;
  if (!keys.every((k) => text((f as Record<string, unknown>)[k]))) return null;
  return {
    search: v.search,
    filters: Object.fromEntries(keys.map((k) => [k, (f as Record<string, string>)[k]])) as NftBrowseState["filters"],
    sort: v.sort as NftBrowseState["sort"],
    minimum: v.minimum,
    maximum: v.maximum,
    favoritesOnly: v.favoritesOnly,
    advanced: v.advanced,
  };
}

export function nftHistoryStatus(state:string,locale:M_lib_i18n_Locale):string {
    const labels:Record<string,readonly [string,string,string]>={
        COMPLETE:['NFT отримано · оплачено','NFT получен · оплачено','NFT received · paid'],
        DELIVERED:['NFT отримано · збір очікує оплати','NFT получен · сбор ожидает оплаты','NFT received · fee due'],
        PREPARED:['Очікує підтвердження у гаманці','Ожидает подтверждения в кошельке','Awaiting wallet confirmation'],
        EXPIRED:['Строк запиту закінчився · перевір отримання NFT','Срок запроса истёк · проверь получение NFT','Request expired · check NFT delivery'],
        DUPLICATE:['Передачу вже враховано · звернись у підтримку','Передача уже учтена · обратись в поддержку','Transfer already recorded · contact support'],
    };
    const index=locale==='uk'?0:locale==='ru'?1:2;
    return labels[state]?.[index]||['Перевір статус замовлення','Проверь статус заказа','Check order status'][index];
}
export function formatGramNano(value:string,locale:M_lib_i18n_Locale):string {
    if(!/^\d{1,30}$/.test(value))return '—';
    const nano=BigInt(value),unit=1_000_000_000n;
    const integer=new Intl.NumberFormat(locale).format(nano/unit);
    const fraction=(nano%unit).toString().padStart(9,'0').replace(/0+$/,'');
    const separator=new Intl.NumberFormat(locale).formatToParts(1.1).find(part=>part.type==='decimal')?.value||'.';
    return integer+(fraction?separator+fraction:'');
}

// Cart/favorites are temporary preferences, never an authority for prices or balances.
export const TEMPORARY_DATA_TTL_MS = 3 * 24 * 60 * 60 * 1000;
export function readTemporaryPreference(raw: string, now = Date.now()): {value: unknown; expiresAt: number; migrated: boolean} | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    // Previous arrays had no timestamp: give them one explicit migration grace period.
    if (Array.isArray(parsed)) return {value: parsed, expiresAt: now + TEMPORARY_DATA_TTL_MS, migrated: true};
    if (!parsed || typeof parsed !== "object") return null;
    const item = parsed as {v?: unknown; value?: unknown; expiresAt?: unknown};
    if (item.v !== 1 || typeof item.expiresAt !== "number" || !Number.isFinite(item.expiresAt) || item.expiresAt <= now || item.expiresAt > now + TEMPORARY_DATA_TTL_MS + 60000) return null;
    return {value: item.value, expiresAt: item.expiresAt, migrated: false};
  } catch { return null; }
}
export function writeTemporaryPreference(value: unknown, expiresAt: number) {
  return JSON.stringify({v: 1, expiresAt, value});
}
