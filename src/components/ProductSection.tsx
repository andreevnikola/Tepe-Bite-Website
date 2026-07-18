"use client";
import {
  IconArrow,
  IconBio,
  IconCarbLow,
  IconExternal,
  IconFibre,
  IconNoSugar,
  IconShop,
  IconSweetener,
} from "@/components/icons";
import { PledgeHeart, PLEDGE_EUR } from "@/components/ImpactPledge";
import { MANUFACTURER } from "@/lib/config/site-info";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";

const nutr = [
  { bg: "Енергийна стойност", en: "Energy", val: "197 kcal" },
  { bg: "Нетни въглехидрати", en: "Net carbs", val: "5.7 g" },
  { bg: "Протеин", en: "Protein", val: "7 g" },
  { bg: "Фибри", en: "Fibre", val: "8 g" },
  { bg: "Захари", en: "Sugars", val: "1.4 g" },
  { bg: "Сол", en: "Salt", val: "0.24 g" },
];

type Fact = { Icon: ComponentType; bg: string; en: string };

const facts: Fact[] = [
  {
    Icon: IconBio,
    bg: "Съставки от естествен произход",
    en: "Natural-origin ingredients",
  },
  { Icon: IconNoSugar, bg: "Без добавена захар", en: "No added sugar" },
  { Icon: IconFibre, bg: "Богат на фибри — 8 g", en: "High in fibre — 8 g" },
  {
    Icon: IconCarbLow,
    bg: "Ниски въглехидрати — 5.7 g нетни",
    en: "Low net carbs — 5.7 g",
  },
  {
    Icon: IconSweetener,
    bg: "Подсладено с еритритол",
    en: "Sweetened with erythritol",
  },
];

export default function ProductSection() {
  const lang = useAtomValue(langAtom);
  const cents = Math.round(PLEDGE_EUR * 100);

  return (
    <section
      id="produkt"
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, var(--bg) 0%, oklch(95% 0.02 315 / 0.3) 100%)`,
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Нашият продукт" : "Our Product"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Един продукт. Ясна идея."
              : "One product. Clear idea."}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1fr) minmax(320px, 1.5fr)",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "stretch",
          }}
          className="product-grid"
        >
          {/* Left: product visual + nutrition */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                background: `radial-gradient(circle at 50% 45%, oklch(88% 0.07 315 / 0.35), oklch(93% 0.05 55 / 0.2) 60%, transparent)`,
                borderRadius: "var(--r-xl)",
                padding: 40,
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Image
                src="/photos/bar-product.png"
                alt="ТЕПЕ bite — Солен карамел"
                width={280}
                height={280}
                style={{
                  width: "100%",
                  maxWidth: 280,
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 12px 28px oklch(32% 0.09 315 / 0.22))",
                  transform: "rotate(-3deg)",
                }}
              />
            </div>

            {/* Nutrition table */}
            <div className="card" style={{ width: "100%", padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "var(--plum)",
                  }}
                >
                  {lang === "bg" ? "Хранителна стойност" : "Nutrition Facts"}
                </span>
                <span
                  style={{
                    float: "right",
                    fontSize: "0.78rem",
                    color: "var(--text-soft)",
                  }}
                >
                  {lang === "bg" ? "в 1 бар / 40 g" : "per bar / 40 g"}
                </span>
              </div>
              <table className="nutr-table">
                <tbody>
                  {nutr.map((n, i) => (
                    <tr key={i}>
                      <td style={{ color: "var(--text-mid)" }}>
                        {lang === "bg" ? n.bg : n.en}
                      </td>
                      <td>{n.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ingredients */}
            <div
              style={{
                background: "var(--caramel-lt)",
                borderRadius: 16,
                padding: "20px 24px",
                width: "100%",
                borderLeft: "3px solid var(--caramel)",
              }}
            >
              <div className="label-tag" style={{ marginBottom: 8 }}>
                {lang === "bg" ? "Съставки" : "Ingredients"}
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-mid)",
                  lineHeight: 1.6,
                }}
              >
                {lang === "bg"
                  ? "Бадеми, фибри от корен на цикория, слънчогледови семки, хрупкави протеинови хапки от слънчоглед, тиквени семки, еритритол, лукума, натурален карамелен аромат, морска сол."
                  : "Almonds, chicory root fibre, sunflower seeds, crunchy sunflower protein bites, pumpkin seeds, erythritol, lucuma, natural caramel flavour, sea salt."}
              </p>
            </div>
          </div>

          {/* Right: product info */}
          <div>
            <h3 className="heading-lg" style={{ marginBottom: 12 }}>
              ТЕПЕ bite{" "}
              <span
                style={{
                  color: "var(--caramel)",
                  fontStyle: "italic",
                  paddingLeft: 10,
                }}
              >
                {lang === "bg" ? "Солен карамел" : "Salted Caramel"}
              </span>
            </h3>
            <p
              className="text-justify"
              style={{ fontSize: "1.05rem", marginBottom: 32 }}
            >
              {lang === "bg"
                ? "Мек, балансиран и характерен вкус на солен карамел, съчетан с ядки, семена, фибри и растителен протеин. Създаден за моментите, в които искаш нещо сладко, но по-обмислено."
                : "A soft, balanced and distinctive salted caramel taste, combined with nuts, seeds, fibre and plant protein. Made for the moments when you want something sweet, but more thoughtful."}
            </p>

            {/* Product fact cards */}
            <div className="fact-grid" style={{ marginBottom: 36 }}>
              {facts.map(({ Icon, bg, en }, i) => (
                <div key={i} className="fact-card">
                  <span className="fact-icon">
                    <Icon />
                  </span>
                  <span className="fact-text">{lang === "bg" ? bg : en}</span>
                </div>
              ))}

              {/* Manufacturer — name links out to the maker */}
              <div className="fact-card">
                <span className="fact-icon">
                  <IconExternal size={18} />
                </span>
                <span className="fact-text">
                  {lang === "bg"
                    ? "Сертифициран производител: "
                    : "Certified manufacturer: "}
                  <a
                    href={MANUFACTURER.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--caramel)",
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {MANUFACTURER.name}
                    <span
                      style={{
                        display: "inline-flex",
                        verticalAlign: "middle",
                        marginLeft: 3,
                      }}
                    >
                      <IconExternal size={12} />
                    </span>
                  </a>
                </span>
              </div>
            </div>

            {/* Impact pledge — understated, emphasis on the direct support */}
            <div className="pledge-callout">
              <PledgeHeart size={40} />
              <p className="pledge-text">
                {lang === "bg" ? (
                  <>
                    С всяко продадено барче добавяш{" "}
                    <strong>{cents} цента директна подкрепа</strong> за видими
                    инициативи в Пловдив.
                  </>
                ) : (
                  <>
                    Every bar you buy adds{" "}
                    <strong>{cents} cents of direct support</strong> to visible
                    initiatives in Plovdiv.
                  </>
                )}
              </p>
            </div>

            <div className="w-full flex justify-start gap-3 max-sm:justify-stretch max-sm:flex-col">
              <Link
                href="/product"
                className="btn btn-primary justify-center"
                style={{ fontSize: "1rem", padding: "15px 32px" }}
              >
                {lang === "bg"
                  ? "Разбери повече за продукта"
                  : "Learn more about the product"}
                <IconArrow />
              </Link>
              <Link
                href="/order"
                className="btn btn-secondary justify-center"
                style={{ fontSize: "1rem", padding: "15px 32px" }}
              >
                <IconShop />
                {lang === "bg" ? "Поръчай продукта" : "Order the Product"}
              </Link>
            </div>
          </div>
        </div>

        {/* Locally made — production fact + photo, presented as a full-width band */}
        <div className="mfg-band">
          <Image
            src="/photos/manufacturing.jpg"
            alt={
              lang === "bg"
                ? "Производство на ТЕПЕ bite в Пловдив"
                : "ТЕПЕ bite production in Plovdiv"
            }
            fill
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div className="mfg-overlay">
            <div
              className="label-tag"
              style={{ color: "oklch(85% 0.08 55)", marginBottom: 10 }}
            >
              {lang === "bg" ? "Местно производство" : "Locally produced"}
            </div>
            <p className="mfg-text">
              {lang === "bg"
                ? "Всяко барче е направено с грижа в с. Брестовица, област Пловдив"
                : "Every bar is made with care in Brestovitsa, Plovdiv Region"}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .fact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .fact-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: var(--r-md);
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .fact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          flex-shrink: 0;
          background: var(--caramel-lt);
          color: var(--caramel);
        }
        .fact-text {
          font-size: 0.88rem;
          line-height: 1.3;
          color: var(--text);
          font-weight: 500;
        }
        .pledge-callout {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding: 18px 22px;
          border-radius: var(--r-lg);
          background: var(--sky-lt);
          border: 1px solid oklch(85% 0.06 230);
        }
        .pledge-text {
          font-size: 0.98rem;
          font-weight: 500;
          line-height: 1.5;
          color: var(--text-mid);
          margin: 0;
        }
        .pledge-text strong {
          font-weight: 700;
          color: var(--sky-dk);
        }
        @media (max-width: 560px) {
          .fact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 430px) {
          .fact-grid {
            grid-template-columns: 1fr;
          }
        }
        .mfg-band {
          position: relative;
          margin-top: clamp(48px, 7vw, 80px);
          width: 100%;
          height: clamp(200px, 28vw, 360px);
          border-radius: var(--r-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .mfg-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: clamp(24px, 4vw, 56px);
          background: linear-gradient(to right, oklch(32% 0.09 315 / 0.8) 10%, transparent 100%);
        }
        .mfg-text {
          color: white;
          font-family: var(--font-head);
          font-size: clamp(1.1rem, 2.5vw, 1.8rem);
          font-weight: 600;
          max-width: 360px;
          line-height: 1.25;
          margin: 0;
        }
        @media (max-width: 768px) {
          .mfg-band {
            border-radius: 0;
            margin-left: -20px;
            margin-right: -20px;
            width: calc(100% + 40px);
            height: clamp(220px, 55vw, 320px);
          }
        }
      `}</style>
    </section>
  );
}
