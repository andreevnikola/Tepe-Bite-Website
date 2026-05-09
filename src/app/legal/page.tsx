"use client";
import Footer from "@/components/Footer";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const cards = [
  {
    href: "/legal/terms",
    icon: "📋",
    titleBg: "Общи условия",
    titleEn: "Terms and Conditions",
    descBg:
      "Правила за използване на сайта, поръчки, доставка, плащане и права на потребителя.",
    descEn:
      "Rules for using the website, orders, delivery, payment and consumer rights.",
  },
  {
    href: "/legal/privacy",
    icon: "🔒",
    titleBg: "Политика за поверителност",
    titleEn: "Privacy Policy",
    descBg:
      "Как събираме, използваме и защитаваме личните ви данни (GDPR).",
    descEn:
      "How we collect, use and protect your personal data (GDPR).",
  },
  {
    href: "/legal/cookies",
    icon: "🍪",
    titleBg: "Политика за бисквитки",
    titleEn: "Cookie Policy",
    descBg:
      "Какви бисквитки и локално съхранение използваме и защо.",
    descEn:
      "What cookies and local storage we use and why.",
  },
  {
    href: "/legal/delivery-payment",
    icon: "📦",
    titleBg: "Доставка и плащане",
    titleEn: "Delivery and Payment",
    descBg:
      "Информация за доставка чрез Speedy, цени и наложен платеж.",
    descEn:
      "Delivery through Speedy, prices and cash on delivery.",
  },
  {
    href: "/legal/returns-complaints",
    icon: "↩️",
    titleBg: "Връщане, отказ и рекламации",
    titleEn: "Returns, Withdrawal and Complaints",
    descBg:
      "Право на отказ, условия за връщане на продукта и как да подадете рекламация.",
    descEn:
      "Right of withdrawal, return conditions and how to file a complaint.",
  },
  {
    href: "/legal/withdrawal-form",
    icon: "📝",
    titleBg: "Формуляр за отказ",
    titleEn: "Withdrawal Form",
    descBg:
      "Стандартен формуляр за упражняване на правото на отказ от договор от разстояние.",
    descEn:
      "Standard form for exercising the right of withdrawal from a distance contract.",
  },
  {
    href: "/legal/trader-info",
    icon: "🏢",
    titleBg: "Данни за търговеца",
    titleEn: "Trader Information",
    descBg:
      "Идентификационни данни на търговеца — ТЕПЕ bite / Баир ЕООД.",
    descEn:
      "Trader identification — ТЕПЕ bite / Баир ЕООД.",
  },
  {
    href: "/legal/product-info",
    icon: "🌿",
    titleBg: "Информация за продукта и безопасност",
    titleEn: "Product Information and Food Safety",
    descBg:
      "Пълен състав, алергени, хранителни стойности и условия за съхранение.",
    descEn:
      "Full ingredients, allergens, nutritional values and storage conditions.",
  },
  {
    href: "/legal/initiative-transparency",
    icon: "🤝",
    titleBg: "Прозрачност на инициативите",
    titleEn: "Initiative Transparency",
    descBg:
      "Как ТЕПЕ bite подкрепя градски инициативи и какво обещаваме за прозрачност.",
    descEn:
      "How ТЕПЕ bite supports local initiatives and what we promise on transparency.",
  },
];

export default function LegalIndexPage() {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <LegalPageLayout
        titleBg="Правна информация"
        titleEn="Legal Center"
        subtitleBg="Всичко, което трябва да знаете за вашите права, нашите задължения и правилата за работа на ТЕПЕ bite."
        subtitleEn="Everything you need to know about your rights, our obligations and how ТЕПЕ bite operates."
        isIndex
      >
        {/* Intro */}
        <p
          style={{
            color: "var(--text-mid)",
            lineHeight: 1.75,
            fontSize: "0.97rem",
            margin: "0 0 32px",
            maxWidth: 640,
          }}
        >
          {lang === "bg"
            ? "Стараем се да бъдем прозрачни и коректни. Тук ще намерите правните документи, свързани с покупката, доставката, личните данни и нашите инициативи. Ако имате въпрос, пишете ни на "
            : "We aim to be transparent and fair. Here you will find the legal documents related to purchases, delivery, personal data and our initiatives. If you have a question, write to us at "}
          <a
            href="mailto:tepe@mail.bg"
            style={{ color: "var(--plum)", fontWeight: 600 }}
          >
            tepe@mail.bg
          </a>
          .
        </p>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {cards.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              style={{ textDecoration: "none", ...(i === cards.length - 1 ? { gridColumn: "1 / -1" } : {}) }}
            >
              <div
                className="card card-hover"
                style={{
                  padding: "22px 24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
              >
                <div style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                  {c.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    color: "var(--plum)",
                    fontSize: "1rem",
                    lineHeight: 1.3,
                  }}
                >
                  {lang === "bg" ? c.titleBg : c.titleEn}
                </div>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--text-soft)",
                    margin: 0,
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {lang === "bg" ? c.descBg : c.descEn}
                </p>
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--caramel)",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {lang === "bg" ? "Прочети →" : "Read →"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact note */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            padding: "24px 28px",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>✉️</span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                color: "var(--plum)",
                marginBottom: 6,
                fontSize: "1rem",
              }}
            >
              {lang === "bg" ? "Имате въпрос?" : "Have a question?"}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "var(--text-mid)",
                lineHeight: 1.65,
              }}
            >
              {lang === "bg"
                ? "За въпроси, свързани с поръчки, доставка, права на потребителя или лични данни, пишете ни на "
                : "For questions about orders, delivery, consumer rights or personal data, write to us at "}
              <a
                href="mailto:tepe@mail.bg"
                style={{ color: "var(--plum)", fontWeight: 600 }}
              >
                tepe@mail.bg
              </a>
              .
            </p>
          </div>
        </div>
      </LegalPageLayout>
      <Footer />
    </>
  );
}
