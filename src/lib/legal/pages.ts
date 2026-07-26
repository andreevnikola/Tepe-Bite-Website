import { SITE_INFO } from "@/lib/config/site-info";
import type { Topic } from "@/lib/i18n/metadata";

/**
 * Single source of truth for the ten legal routes: the visible heading copy
 * (consumed by `LegalPageLayout` in each `page.tsx`) and the per-page metadata
 * (consumed by the matching `layout.tsx`).
 *
 * Deliberately NOT `server-only` — the page components are client components
 * and import `copy` from here, while the layouts import the descriptions.
 *
 * Every description is grounded in that page's own sections; do not add
 * obligations, timeframes or figures the page itself does not state.
 */

export type LegalSlug =
  | "index"
  | "terms"
  | "privacy"
  | "cookies"
  | "delivery-payment"
  | "returns-complaints"
  | "withdrawal-form"
  | "trader-info"
  | "product-info"
  | "initiative-transparency";

export type LegalPageDef = {
  /** Public path, used for canonical + hreflang alternates. */
  path: string;
  /** Retrieval topic — must be a member of TOPICS. */
  topic: Topic;
  /** Exactly the props passed to `<LegalPageLayout>`. */
  copy: {
    titleBg: string;
    titleEn: string;
    subtitleBg?: string;
    subtitleEn?: string;
  };
  /** Meta description, ≤ META_DESCRIPTION_MAX characters. */
  descriptionBg: string;
  descriptionEn: string;
};

export const LEGAL_PAGES: Record<LegalSlug, LegalPageDef> = {
  index: {
    path: "/legal",
    topic: "legal-index",
    copy: {
      titleBg: "Правна информация",
      titleEn: "Legal Center",
      subtitleBg:
        "Всичко, което трябва да знаете за вашите права, нашите задължения и правилата за работа на ТЕПЕ bite.",
      subtitleEn:
        "Everything you need to know about your rights, our obligations and how ТЕПЕ bite operates.",
    },
    descriptionBg:
      "Правните документи на ТЕПЕ bite — общи условия, поверителност, бисквитки, доставка и плащане, връщане и рекламации, данни за търговеца, информация за продукта и прозрачност на инициативите.",
    descriptionEn:
      "The ТЕПЕ bite legal documents — terms, privacy, cookies, delivery and payment, returns and complaints, trader details, product information and initiative transparency.",
  },

  terms: {
    path: "/legal/terms",
    topic: "terms",
    copy: {
      titleBg: "Общи условия",
      titleEn: "Terms and Conditions",
      subtitleBg:
        "Условия за използване на уебсайта tepebite.com и за поръчка на продуктите на ТЕПЕ bite.",
      subtitleEn:
        "Terms for using the ТЕПЕ bite website and ordering ТЕПЕ bite products.",
    },
    descriptionBg:
      "Условията за използване на tepebite.com — обхват, продукти, поръчки и сключване на договор, цени, доставка, плащане, връщане, хранителни бележки, инициативи, отговорност и контакт.",
    descriptionEn:
      "The terms for using tepebite.com — scope, products, orders and contract, prices, delivery, payment, returns, food notes, initiatives, liability and contact.",
  },

  privacy: {
    path: "/legal/privacy",
    topic: "privacy",
    copy: {
      titleBg: "Политика за поверителност",
      titleEn: "Privacy Policy",
      subtitleBg:
        "Как събираме, използваме и защитаваме вашите лични данни при използване на сайта и при поръчка.",
      subtitleEn:
        "How we collect, use and protect your personal data when using the website and placing an order.",
    },
    descriptionBg:
      "Кой е администраторът на лични данни, какви данни събираме, на какво правно основание, кои са получателите, сроковете на съхранение, вашите права и мерките за сигурност при ТЕПЕ bite.",
    descriptionEn:
      "Who the data controller is, what data we collect, on what legal basis, who the recipients are, retention periods, your rights and the security measures at ТЕПЕ bite.",
  },

  cookies: {
    path: "/legal/cookies",
    topic: "cookies",
    copy: {
      titleBg: "Политика за бисквитки",
      titleEn: "Cookie Policy",
      subtitleBg:
        "Какви бисквитки и технологии за локално съхранение използваме и защо.",
      subtitleEn: "What cookies and local storage technologies we use and why.",
    },
    descriptionBg:
      "Какво са бисквитките, кои необходими бисквитки и локално съхранение използва ТЕПЕ bite, позицията ни за аналитика и маркетинг и как да ги управлявате в браузъра си.",
    descriptionEn:
      "What cookies are, which essential cookies and local storage ТЕПЕ bite uses, our position on analytics and marketing, and how to manage them in your browser.",
  },

  "delivery-payment": {
    path: "/legal/delivery-payment",
    topic: "delivery-payment",
    copy: {
      titleBg: "Доставка и плащане",
      titleEn: "Delivery and Payment",
      subtitleBg:
        "Информация за доставка чрез Speedy, цени, срокове и наложен платеж.",
      subtitleEn:
        "Information about delivery via Speedy, prices, timelines and cash on delivery.",
    },
    descriptionBg:
      "Зона и опции за доставка чрез Speedy, цени и срокове, плащане с наложен платеж, касов бон, непотърсени пратки, отказ преди изпращане и бизнес заявки при ТЕПЕ bite.",
    descriptionEn:
      "Delivery area and options via Speedy, prices and timing, payment by cash on delivery, receipts, uncollected shipments, cancelling before dispatch and business orders.",
  },

  "returns-complaints": {
    path: "/legal/returns-complaints",
    topic: "returns",
    copy: {
      titleBg: "Връщане, отказ и рекламации",
      titleEn: "Returns, Withdrawal and Complaints",
      subtitleBg:
        "Вашите права при отказ от договор, условия за връщане и процедура за рекламации.",
      subtitleEn:
        "Your rights on withdrawal from contract, return conditions and complaints procedure.",
    },
    descriptionBg:
      "Право на отказ от договор от разстояние, специфичните правила за хранителни продукти, разходите за връщане, възстановяването на суми и процедурата за рекламации при ТЕПЕ bite.",
    descriptionEn:
      "Right of withdrawal from a distance contract, the specific rules for food products, return costs, refunds and the complaints procedure at ТЕПЕ bite.",
  },

  "withdrawal-form": {
    path: "/legal/withdrawal-form",
    topic: "withdrawal",
    copy: {
      titleBg: "Стандартен формуляр за отказ",
      titleEn: "Standard Withdrawal Form",
      subtitleBg:
        "Можете да копирате и изпратите този формуляр по имейл или да го разпечатате.",
      subtitleEn: "You may copy and send this form by email or print it.",
    },
    descriptionBg:
      "Стандартният формуляр за упражняване на правото на отказ от договор от разстояние — за попълване, разпечатване или изпращане по имейл до ТЕПЕ bite.",
    descriptionEn:
      "The standard form for exercising the right of withdrawal from a distance contract — to complete, print or send by email to ТЕПЕ bite.",
  },

  "trader-info": {
    path: "/legal/trader-info",
    topic: "trader-info",
    copy: {
      titleBg: "Данни за търговеца",
      titleEn: "Trader Information / Legal Notice",
      subtitleBg: `Идентификационни и регистрационни данни на ${SITE_INFO.brand.legalEntity} — търговска марка ТЕПЕ bite.`,
      subtitleEn: `Identification and registration details of ${SITE_INFO.brand.legalEntity} — trading as ТЕПЕ bite.`,
    },
    descriptionBg:
      "Идентификация на търговеца зад ТЕПЕ bite — юридическо лице, ЕИК и ДДС регистрация, контакти, адреси, регулаторни регистрации и документи при плащане.",
    descriptionEn:
      "Trader identification behind ТЕПЕ bite — legal entity, UIC and VAT registration, contacts, addresses, regulatory registrations and payment documents.",
  },

  "product-info": {
    path: "/legal/product-info",
    topic: "product-info",
    copy: {
      titleBg: "Информация за продукта и безопасност на храните",
      titleEn: "Product Information and Food Safety Notice",
      subtitleBg:
        "Пълна информация за ТЕПЕ bite барчето — съставки, алергени, хранителни стойности и условия за съхранение.",
      subtitleEn:
        "Full information for the ТЕПЕ bite bar — ingredients, allergens, nutritional values and storage conditions.",
    },
    descriptionBg:
      "Идентичност на барчето ТЕПЕ bite, съставки, алергени, хранителна информация, условия за съхранение, производител, декларации и медицинска бележка.",
    descriptionEn:
      "The identity of the ТЕПЕ bite bar, ingredients, allergens, nutrition information, storage conditions, producer, claims and a medical note.",
  },

  "initiative-transparency": {
    path: "/legal/initiative-transparency",
    topic: "initiative-transparency",
    copy: {
      titleBg: "Прозрачност на инициативите",
      titleEn: "Initiative Transparency",
      subtitleBg:
        "Как ТЕПЕ bite подкрепя градски инициативи и какво обещаваме за прозрачност.",
      subtitleEn:
        "How ТЕПЕ bite supports local urban initiatives and what we promise on transparency.",
    },
    descriptionBg:
      "Защо ТЕПЕ bite подкрепя градски инициативи, коя е първата, как работи моделът на финансиране, какво обещаваме за прозрачност и къде са честните ни граници.",
    descriptionEn:
      "Why ТЕПЕ bite supports urban initiatives, which one is first, how the funding model works, what we promise on transparency and where our honest limits are.",
  },
};
