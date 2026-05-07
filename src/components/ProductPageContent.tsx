"use client";
import {
  IconArrow,
  IconCheck,
  IconHeart,
  IconLeaf,
  IconShop,
} from "@/components/icons";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";

type Lang = "bg" | "en";

/* ─── HERO ──────────────────────────────────────────────────────────── */

function ProductHero({ lang }: { lang: Lang }) {
  return (
    <section
      style={{
        height: "fit-content",
        background: `radial-gradient(ellipse 80% 60% at 60% 30%, oklch(88% 0.05 315 / 0.22), transparent), var(--bg)`,
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(120px, 16vh, 200px)",
        paddingBottom: "clamp(96px, 12vh, 160px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div
        className="hero-blob"
        style={{
          width: 480,
          height: 480,
          background: "oklch(88% 0.06 315)",
          top: -100,
          right: -60,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 200,
          height: 150,
          background: "oklch(88% 0.08 55)",
          bottom: -50,
          left: "10%",
        }}
      />

      {/* Hill silhouette */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          opacity: 0.06,
          pointerEvents: "none",
        }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="min-lg:-mb-16"
      >
        <path
          d="M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z"
          fill="var(--plum)"
        />
      </svg>

      <div className="section-inner" style={{ width: "100%" }}>
        <div
          className="pp-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div style={{ maxWidth: 580 }} className="z-10">
            <div
              style={{
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--caramel)",
                letterSpacing: "0.04em",
                fontFamily: "var(--font-head)",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 2,
                  background: "var(--caramel)",
                  display: "inline-block",
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              />
              <span>
                {lang === "bg"
                  ? "ТЕПЕ bite · Солен карамел · 40 g"
                  : "ТЕПЕ bite · Salted Caramel · 40 g"}
              </span>
              <span
                style={{
                  flex: 1,
                  height: 2,
                  background: "var(--caramel)",
                  display: "inline-block",
                  borderRadius: 10,
                }}
              />
            </div>

            <h1 className="heading-xl" style={{ marginBottom: 24 }}>
              {lang === "bg" ? (
                <>
                  <span className="block whitespace-nowrap text-[clamp(24px,9vw,54px)]!">
                    Барче с характер.
                  </span>
                  <span className="block whitespace-nowrap text-[clamp(24px,7.5vw,50px)]!">
                    Солен карамел с мисия.
                  </span>
                </>
              ) : (
                <>
                  <span className="block whitespace-nowrap text-[clamp(24px,9vw,54px)]!">
                    A bar with character.
                  </span>
                  <span className="block whitespace-nowrap text-[clamp(24px,7vw,44px)]!">
                    Salted caramel with purpose.
                  </span>
                </>
              )}
            </h1>

            <p
              className="text-justify w-full"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                marginBottom: 40,
              }}
            >
              {lang === "bg"
                ? "Нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин, ядки и семена. За моментите, в които искаш нещо вкусно, но по-смислено."
                : "A low-carb salted caramel bar made in Plovdiv — with fibre, plant protein, nuts and seeds. For the moments when you want something delicious, but more thoughtful."}
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              <a href="/order" className="btn btn-primary">
                <IconShop />
                {lang === "bg" ? "Поръчай сега" : "Order Now"}
              </a>
              <a
                href="#nutrition"
                className="btn btn-secondary max-lg:grow justify-center"
              >
                {lang === "bg" ? "Виж състава" : "See Nutrition"}
                <IconArrow />
              </a>
            </div>
          </div>

          {/* Right: product image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                background:
                  "radial-gradient(circle, oklch(90% 0.06 315 / 0.35), transparent 70%)",
                width: "clamp(280px, 34vw, 480px)",
                height: "clamp(280px, 34vw, 480px)",
                borderRadius: "50%",
                position: "absolute",
                pointerEvents: "none",
              }}
            />
            <Image
              src="/logo-nav.png"
              alt=""
              aria-hidden="true"
              width={380}
              height={380}
              style={{
                position: "absolute",
                width: "clamp(200px, 28vw, 380px)",
                height: "auto",
                opacity: 0.13,
                filter: "saturate(0) brightness(0.3)",
                pointerEvents: "none",
                zIndex: 0,
                transform: "translateY(-10%)",
              }}
            />
            <Image
              src="/bar-product.png"
              alt="ТЕПЕ bite — Солен карамел"
              width={500}
              height={500}
              priority
              className="animate-float -mb-4"
              style={{
                width: "clamp(240px, 32vw, 460px)",
                height: "auto",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 24px 56px oklch(32% 0.09 315 / 0.28))",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .pp-hero-grid {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .pp-hero-grid > div:last-child {
            order: -1;
            width: 52% !important;
            margin: 0 auto 24px !important;
          }
        }
        @media (max-width: 600px) {
          .pp-hero-grid > div:last-child {
            width: 70% !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── VALUE STRIP ────────────────────────────────────────────────────── */

function ValueStrip({ lang }: { lang: Lang }) {
  const items =
    lang === "bg"
      ? [
          {
            icon: "⬇",
            title: "Ниско съдържание на нетни въглехидрати",
            sub: "5.7 g на бар",
          },
          { icon: "▲", title: "Високо съдържание на фибри", sub: "8 g на бар" },
          { icon: "◉", title: "Растителен протеин", sub: "7 g на бар" },
          {
            icon: "○",
            title: "Подсладено с еритритол",
            sub: "без добавена захар",
          },
          {
            icon: "✦",
            title: "Ядки, семена, лукума и морска сол",
            sub: "естествени съставки",
          },
          {
            icon: "⌂",
            title: "BioStyle LTD",
            sub: "Сертифицирано производсто на висококачествени био храни от 2012 г.",
          },
        ]
      : [
          { icon: "⬇", title: "Low net carb content", sub: "5.7 g per bar" },
          { icon: "▲", title: "High fibre content", sub: "8 g per bar" },
          { icon: "◉", title: "Plant protein", sub: "7 g per bar" },
          {
            icon: "○",
            title: "Sweetened with erythritol",
            sub: "no added sugar",
          },
          {
            icon: "✦",
            title: "Nuts, seeds, lucuma & sea salt",
            sub: "natural ingredients",
          },
          {
            icon: "⌂",
            title: "Manufacturer: BioStyle Ltd.",
            sub: "since 2012",
          },
        ];

  return (
    <section
      style={{
        background: "var(--surface2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "clamp(40px, 5vw, 64px) clamp(20px, 5vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          className="pp-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 16,
          }}
        >
          {items.map(({ icon, title, sub }, i) => (
            <div
              key={i}
              className="card items-center justify-center"
              style={{
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background:
                    i % 2 === 0 ? "var(--plum-lt)" : "var(--caramel-lt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: i % 2 === 0 ? "var(--plum)" : "var(--caramel)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-soft)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-strip { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 1100px) { .pp-strip { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .pp-strip { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

/* ─── TASTE SECTION ─────────────────────────────────────────────────── */

function TasteSection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, var(--bg) 0%, oklch(95% 0.03 55 / 0.25) 100%)`,
      }}
    >
      <div className="section-inner">
        <div
          className="pp-taste-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(48px, 6vw, 96px)",
            alignItems: "center",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: `radial-gradient(circle at 50% 50%, oklch(88% 0.07 315 / 0.3), oklch(93% 0.05 55 / 0.2) 60%, transparent)`,
                borderRadius: "var(--r-xl)",
                padding: 48,
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 380,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* TODO: Replace with /assets/images/product/tepe-bite-bar-closeup.jpg when available */}
              <Image
                src="/bar-product.png"
                alt="ТЕПЕ bite — Солен карамел отблизо"
                width={320}
                height={320}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  height: "auto",
                  filter: "drop-shadow(0 16px 40px oklch(32% 0.09 315 / 0.28))",
                  transform: "rotate(6deg) translateY(-8px)",
                }}
              />
              {/* Floating taste labels */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  background: "var(--surface)",
                  borderRadius: 100,
                  padding: "8px 16px",
                  boxShadow: "var(--shadow)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--plum)",
                  border: "1px solid var(--border)",
                }}
              >
                {lang === "bg" ? "🧂 Морска сол" : "🧂 Sea salt"}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  right: 20,
                  background: "var(--surface)",
                  borderRadius: 100,
                  padding: "8px 16px",
                  boxShadow: "var(--shadow)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--caramel)",
                  border: "1px solid var(--border)",
                }}
              >
                {lang === "bg" ? "🍯 Солен карамел" : "🍯 Salted caramel"}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className="section-divider" style={{ margin: "0 0 24px" }} />
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {lang === "bg" ? "Вкусът" : "The Taste"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 24 }}>
              {lang === "bg"
                ? "Вкус, който не звучи като компромис."
                : "A taste that doesn't feel like a compromise."}
            </h2>
            <p style={{ fontSize: "1.05rem", marginBottom: 28, maxWidth: 460 }}>
              {lang === "bg"
                ? "Солен карамел, ядки, семена и щипка морска сол — в барче, което носи усещане за десерт, но остава по-обмислен избор за деня."
                : "Salted caramel, nuts, seeds and a pinch of sea salt — in a bar that feels like a dessert, but remains a more thoughtful choice for your day."}
            </p>
            <p style={{ marginBottom: 36, maxWidth: 440 }}>
              {lang === "bg"
                ? "Лукумата добавя мек, естествен сладникав нюанс. Хрупкавите хапки от слънчогледов протеин — текстура. Морската сол — балансиращ финал. Всичко заедно — не като протеинов бар, а като добре обмислено барче, в което вкусът е на първо място."
                : "Lucuma adds a soft, naturally sweet nuance. Crunchy sunflower protein bites bring texture. Sea salt — a balancing finish. Together — not like a protein bar, but like a well-considered snack where taste comes first."}
            </p>

            {/* Taste highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(lang === "bg"
                ? [
                    "Мек карамелен вкус без горчивина",
                    "Хрупкавост от ядки и семена",
                    "Балансиращ финал от морска сол",
                    "Нито прекалено сладко, нито прекалено солено",
                  ]
                : [
                    "Soft caramel taste with no bitterness",
                    "Crunch from nuts and seeds",
                    "Balancing finish of sea salt",
                    "Neither too sweet nor too salty",
                  ]
              ).map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ color: "var(--caramel)", flexShrink: 0 }}>
                    <IconCheck />
                  </span>
                  <span
                    style={{ fontSize: "0.92rem", color: "var(--text-mid)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pp-taste-grid { grid-template-columns: 1fr !important; }
          .pp-taste-grid > div:first-child { order: 2; }
          .pp-taste-grid > div:last-child { order: 1; }
        }
      `}</style>
    </section>
  );
}

/* ─── NUTRITION ─────────────────────────────────────────────────────── */

function NutritionSection({ lang }: { lang: Lang }) {
  const macros =
    lang === "bg"
      ? [
          { val: "5.7 g", label: "Нетни въглехидрати", color: "var(--plum)" },
          { val: "8 g", label: "Фибри", color: "var(--caramel)" },
          { val: "7 g", label: "Протеин", color: "oklch(55% 0.12 170)" },
          { val: "1.4 g", label: "Захари", color: "oklch(60% 0.12 45)" },
        ]
      : [
          { val: "5.7 g", label: "Net carbs", color: "var(--plum)" },
          { val: "8 g", label: "Fibre", color: "var(--caramel)" },
          { val: "7 g", label: "Protein", color: "oklch(55% 0.12 170)" },
          { val: "1.4 g", label: "Sugars", color: "oklch(60% 0.12 45)" },
        ];

  const fullTable =
    lang === "bg"
      ? [
          { label: "Енергия", val: "816 kJ / 197 kcal" },
          { label: "Мазнини", val: "13 g", indent: false },
          { label: "от които наситени", val: "1.6 g", indent: true },
          { label: "Въглехидрати", val: "9.7 g", indent: false },
          { label: "от които захари", val: "1.4 g", indent: true },
          { label: "от които полиоли", val: "3.9 g", indent: true },
          {
            label: "Нетни въглехидрати",
            val: "5.7 g",
            indent: false,
            highlight: true,
          },
          { label: "Фибри", val: "8 g", indent: false, highlight: true },
          { label: "Протеин", val: "7 g", indent: false, highlight: true },
          { label: "Сол", val: "0.24 g", indent: false },
        ]
      : [
          { label: "Energy", val: "816 kJ / 197 kcal" },
          { label: "Fat", val: "13 g", indent: false },
          { label: "of which saturates", val: "1.6 g", indent: true },
          { label: "Carbohydrates", val: "9.7 g", indent: false },
          { label: "of which sugars", val: "1.4 g", indent: true },
          { label: "of which polyols", val: "3.9 g", indent: true },
          { label: "Net carbs", val: "5.7 g", indent: false, highlight: true },
          { label: "Fibre", val: "8 g", indent: false, highlight: true },
          { label: "Protein", val: "7 g", indent: false, highlight: true },
          { label: "Salt", val: "0.24 g", indent: false },
        ];

  return (
    <section
      id="nutrition"
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, oklch(95% 0.02 315 / 0.3) 0%, var(--bg) 100%)`,
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Хранителна информация" : "Nutrition"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Хранителни стойности в 1 бар"
              : "Nutrition per 1 bar"}
          </h2>
          <p style={{ marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>
            {lang === "bg"
              ? "Ясна информация, без излишни обещания."
              : "Clear information, no empty promises."}
          </p>
        </div>

        <div
          className="pp-nutr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* Left: kcal hero + macro cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Big kcal card */}
            <div
              style={{
                background: "var(--plum)",
                borderRadius: "var(--r-lg)",
                padding: "40px 32px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  background: "oklch(40% 0.08 315)",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />
              <div
                className="label-tag"
                style={{ color: "oklch(78% 0.06 315)", marginBottom: 8 }}
              >
                {lang === "bg" ? "в 1 бар · 40 g" : "per bar · 40 g"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 900,
                  fontSize: "clamp(3rem, 7vw, 5rem)",
                  color: "white",
                  lineHeight: 1,
                  marginBottom: 4,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                197
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.2rem",
                  color: "oklch(82% 0.05 315)",
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                kcal
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: "0.8rem",
                  color: "oklch(68% 0.04 310)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                816 kJ
              </div>
            </div>

            {/* Macro cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {macros.map(({ val, label, color }, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                    borderTop: `3px solid ${color}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: "1.6rem",
                      color,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-soft)",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: full table */}
          <div className="card" style={{ padding: "32px 28px" }}>
            <div
              style={{
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "2px solid var(--plum)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "var(--plum)",
                }}
              >
                {lang === "bg" ? "Хранителна стойност" : "Nutrition Facts"}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-soft)",
                  marginTop: 4,
                }}
              >
                {lang === "bg" ? "в 1 бар, 40 g" : "per 1 bar, 40 g"}
              </div>
            </div>

            <table className="nutr-table">
              <tbody>
                {fullTable.map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        color: (row as { highlight?: boolean }).highlight
                          ? "var(--text)"
                          : "var(--text-mid)",
                        paddingLeft: (row as { indent?: boolean }).indent
                          ? 20
                          : 0,
                        fontSize: (row as { indent?: boolean }).indent
                          ? "0.84rem"
                          : "0.9rem",
                        fontStyle: (row as { indent?: boolean }).indent
                          ? "italic"
                          : "normal",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        color: (row as { highlight?: boolean }).highlight
                          ? "var(--plum)"
                          : undefined,
                        fontWeight: (row as { highlight?: boolean }).highlight
                          ? 700
                          : 600,
                      }}
                    >
                      {row.val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pp-nutr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── INGREDIENTS ────────────────────────────────────────────────────── */

function IngredientsSection({ lang }: { lang: Lang }) {
  const cards =
    lang === "bg"
      ? [
          {
            icon: "🌰",
            title: "Ядки и семена",
            desc: "Бадеми, слънчогледови и тиквени семки — за хрупкавост, здравословни мазнини и вкус.",
          },
          {
            icon: "🌿",
            title: "Фибри от корен на цикория",
            desc: "Естествен пребиотичен ресурс с висока хранителна стойност и нисък гликемичен индекс.",
          },
          {
            icon: "💪",
            title: "Растителен протеин",
            desc: "Хрупкави хапки от слънчогледов протеин — чист, без животински произход.",
          },
          {
            icon: "○",
            title: "Еритритол",
            desc: "Натурален захарен алкохол. Дава сладост без да се броят като нетни въглехидрати.",
          },
          {
            icon: "✦",
            title: "Лукума",
            desc: "Перуански плод с мек, естествен карамелен вкус. Използва се вместо рафинирана захар.",
          },
          {
            icon: "🧂",
            title: "Морска сол",
            desc: "Финишира вкуса. Балансира сладкото и усилва характера на барчето.",
          },
        ]
      : [
          {
            icon: "🌰",
            title: "Nuts & Seeds",
            desc: "Almonds, sunflower and pumpkin seeds — for crunch, healthy fats, and taste.",
          },
          {
            icon: "🌿",
            title: "Chicory Root Fibre",
            desc: "A natural prebiotic source with high nutritional value and low glycaemic index.",
          },
          {
            icon: "💪",
            title: "Plant Protein",
            desc: "Crunchy sunflower protein bites — clean, no animal origin.",
          },
          {
            icon: "○",
            title: "Erythritol",
            desc: "Natural sugar alcohol. Provides sweetness without counting as net carbs.",
          },
          {
            icon: "✦",
            title: "Lucuma",
            desc: "A Peruvian fruit with a soft, natural caramel taste. Used instead of refined sugar.",
          },
          {
            icon: "🧂",
            title: "Sea Salt",
            desc: "Finishes the taste. Balances the sweetness and amplifies the bar's character.",
          },
        ];

  return (
    <section
      id="ingredients"
      className="section-spacing"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Прозрачен състав" : "Transparent ingredients"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg" ? "Какво има вътре?" : "What's inside?"}
          </h2>
        </div>

        {/* Full ingredient string */}
        <div
          style={{
            background: "var(--caramel-lt)",
            borderRadius: "var(--r-md)",
            padding: "24px 28px",
            marginBottom: 40,
            borderLeft: "4px solid var(--caramel)",
          }}
        >
          <div className="label-tag" style={{ marginBottom: 10 }}>
            {lang === "bg"
              ? "Пълен списък на съставките"
              : "Full ingredient list"}
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-mid)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {lang === "bg"
              ? "Бадеми, фибри от корен на цикория, слънчогледови семки, хрупкави протеинови хапки от слънчоглед, тиквени семки, еритритол, лукума, натурален карамелен аромат, морска сол."
              : "Almonds, chicory root fibre, sunflower seeds, crunchy sunflower protein bites, pumpkin seeds, erythritol, lucuma, natural caramel flavour, sea salt."}
          </p>
        </div>

        {/* Ingredient cards */}
        <div
          className="pp-ingr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {cards.map(({ icon, title, desc }, i) => (
            <div key={i} className="card" style={{ padding: "24px 20px" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--plum)",
                  marginBottom: 8,
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontSize: "0.86rem",
                  color: "var(--text-soft)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Allergen note */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span
            style={{
              color: "var(--caramel)",
              fontSize: "1.2rem",
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            ⚠
          </span>
          <p
            style={{
              fontSize: "0.84rem",
              color: "var(--text-soft)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {lang === "bg"
              ? "Съдържа бадеми. Проверете етикета за пълна информация за алергени и възможни следи от други съставки."
              : "Contains almonds. Check the label for complete allergen information and possible traces of other ingredients."}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-ingr-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 900px) { .pp-ingr-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .pp-ingr-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── WHEN TO USE ────────────────────────────────────────────────────── */

function WhenSection({ lang }: { lang: Lang }) {
  const cards =
    lang === "bg"
      ? [
          {
            icon: "📚",
            title: "Между часовете",
            desc: "Умна междинна закуска за студенти и хора с динамичен ден.",
          },
          {
            icon: "🏃",
            title: "След тренировка",
            desc: "Протеин и фибри, без излишна захар — добра комбинация след движение.",
          },
          {
            icon: "💼",
            title: "В офиса",
            desc: 'Лесно за носене, без мирис, без трохи. Чекира кутията „по-добра алтернатива".',
          },
          {
            icon: "🚗",
            title: "По време на път",
            desc: "Прибира се в чантата. Не се топи, не се счупва, не изисква лъжица.",
          },
          {
            icon: "🍫",
            title: "Когато ти се хапва нещо сладко",
            desc: "По-обмислен избор за момента. Без компромис с вкуса.",
          },
        ]
      : [
          {
            icon: "📚",
            title: "Between classes",
            desc: "A smart snack for students and people with a packed day.",
          },
          {
            icon: "🏃",
            title: "After a workout",
            desc: "Protein and fibre, without excess sugar — a good combination after exercise.",
          },
          {
            icon: "💼",
            title: "At the office",
            desc: 'Easy to carry, no smell, no crumbs. Checks the "better alternative" box.',
          },
          {
            icon: "🚗",
            title: "On the road",
            desc: "Fits in your bag. Doesn't melt, doesn't break, doesn't need a spoon.",
          },
          {
            icon: "🍫",
            title: "When you crave something sweet",
            desc: "A more thoughtful choice for the moment. No compromise on taste.",
          },
        ];

  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--surface2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "За всеки момент" : "For every moment"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Кога да избереш ТЕПЕ bite?"
              : "When to choose ТЕПЕ bite?"}
          </h2>
        </div>

        <div
          className="pp-when-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {cards.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>{icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--plum)",
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-soft)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-when-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 1100px) { .pp-when-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .pp-when-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 420px)  { .pp-when-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── MANUFACTURER ───────────────────────────────────────────────────── */

function ManufacturerSection({ lang }: { lang: Lang }) {
  const certs =
    lang === "bg"
      ? [
          {
            img: "/images/certificates/ifs-food.png",
            initials: "IFS",
            title: "IFS Food",
            desc: "Производствената база на BioStyle Ltd. е свързана с IFS Food сертификация — международен стандарт за безопасност и качество в хранителното производство.",
          },
          {
            img: "/images/certificates/organic-certificate.jpeg",
            initials: "ORG",
            title: "Organic Certificate",
            desc: "BioStyle Ltd. работи с органично производство и има Organic Certificate. Това подкрепя фокуса върху по-съзнателен избор на суровини и производствени практики.",
          },
          {
            img: "/images/certificates/balkan-biocert.png",
            initials: "BBC",
            title: "Balkan Biocert",
            desc: "BioStyle Ltd. е посочена в органичен каталог със сертификация от Balkan Biocert — регионален орган за органична сертификация.",
          },
          {
            img: null,
            initials: "2012",
            title: "От 2012 г.",
            desc: "Производител с опит в разработката на органични, веган, безглутенови и здравословно ориентирани продукти.",
          },
        ]
      : [
          {
            img: "/images/certificates/ifs-food.png",
            initials: "IFS",
            title: "IFS Food",
            desc: "BioStyle Ltd.'s production facility is associated with IFS Food certification — an international standard for food safety and quality.",
          },
          {
            img: "/images/certificates/organic-certificate.jpeg",
            initials: "ORG",
            title: "Organic Certificate",
            desc: "BioStyle Ltd. operates organic production and holds an Organic Certificate, supporting a more conscious approach to raw materials and manufacturing practices.",
          },
          {
            img: "/images/certificates/balkan-biocert.png",
            initials: "BBC",
            title: "Balkan Biocert",
            desc: "BioStyle Ltd. is listed in an organic catalogue with Balkan Biocert certification — a regional organic certification body.",
          },
          {
            img: null,
            initials: "2012",
            title: "Since 2012",
            desc: "A manufacturer with experience developing organic, vegan, gluten-free and health-oriented food products.",
          },
        ];

  return (
    <section
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, var(--bg) 0%, oklch(95% 0.02 315 / 0.3) 100%)`,
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Производителят" : "The Manufacturer"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Произведено с грижа от BioStyle Ltd."
              : "Made with care by BioStyle Ltd."}
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: 650,
              margin: "16px auto 0",
              fontSize: "1.02rem",
            }}
          >
            {lang === "bg"
              ? "ТЕПЕ bite е създадено в Пловдив и се произвежда от BioStyle Ltd. — български производител на органични и иновативни храни, основан през 2012 г."
              : "ТЕПЕ bite is created in Plovdiv and manufactured by BioStyle Ltd. — a Bulgarian producer of organic and innovative foods, founded in 2012."}
          </p>
        </div>

        {/* Production photo strip */}
        <div
          style={{
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            marginBottom: 48,
            position: "relative",
            height: "clamp(160px, 20vw, 260px)",
          }}
        >
          {/* TODO: Replace with /assets/images/product/tepe-bite-production.jpg when available */}
          <Image
            src="/manufacturing.jpg"
            alt={
              lang === "bg"
                ? "Производствена база BioStyle Ltd."
                : "BioStyle Ltd. production facility"
            }
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "oklch(32% 0.09 315 / 0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                color: "white",
                textAlign: "center",
              }}
            >
              BioStyle Ltd. —{" "}
              {lang === "bg"
                ? "с. Брестовица, Пловдив"
                : "Brestovitsa, Plovdiv"}
            </div>
            <div
              style={{
                color: "oklch(80% 0.04 310)",
                fontSize: "0.88rem",
                textAlign: "center",
              }}
            >
              {lang === "bg"
                ? "Органично производство · IFS Food · Balkan Biocert"
                : "Organic production · IFS Food · Balkan Biocert"}
            </div>
          </div>
        </div>

        {/* Cert cards */}
        <div
          className="pp-trust-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {certs.map(({ img, initials, title, desc }, i) => (
            <div key={i} className="card" style={{ padding: "28px 22px" }}>
              {img ? (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--r-sm)",
                    background: "white",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 6,
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={img}
                    alt={title}
                    width={44}
                    height={44}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--r-sm)",
                    background: "var(--plum)",
                    border: "2px solid var(--plum)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "white",
                    letterSpacing: "0.04em",
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--plum)",
                  marginBottom: 10,
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-soft)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-trust-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 1000px) { .pp-trust-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .pp-trust-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── SUSTAINABILITY ─────────────────────────────────────────────────── */

function SustainabilitySection({ lang }: { lang: Lang }) {
  const cards =
    lang === "bg"
      ? [
          {
            icon: <IconLeaf />,
            title: "Органично производство",
            desc: "По-съзнателен избор на суровини, свързан с органично земеделие.",
          },
          {
            icon: "♻",
            title: "Компостиране",
            desc: "Производствените остатъци се насочват към компостиране.",
          },
          {
            icon: "💧",
            title: "Система за пречистване на вода",
            desc: "Вода от производствения процес се пречиства и не се изхвърля необработена.",
          },
          {
            icon: "⚡",
            title: "Посока към устойчива енергия",
            desc: "BioStyle Ltd. работи в посока по-устойчиви и възобновяеми енергийни източници.",
          },
          {
            icon: <IconLeaf />,
            title: "По-малък отпечатък",
            desc: "Производствени практики, насочени към намаляване на въздействието върху средата.",
          },
        ]
      : [
          {
            icon: <IconLeaf />,
            title: "Organic production",
            desc: "A more conscious approach to raw material sourcing, connected to organic farming.",
          },
          {
            icon: "♻",
            title: "Composting",
            desc: "Production residues are directed to composting.",
          },
          {
            icon: "💧",
            title: "Water treatment system",
            desc: "Water from the production process is treated rather than discharged untreated.",
          },
          {
            icon: "⚡",
            title: "Towards sustainable energy",
            desc: "BioStyle Ltd. works toward more sustainable and renewable energy sources.",
          },
          {
            icon: <IconLeaf />,
            title: "Smaller footprint",
            desc: "Manufacturing practices aimed at reducing environmental impact.",
          },
        ];

  return (
    <section
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, oklch(95% 0.025 145 / 0.18) 0%, var(--bg) 60%)`,
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div
            className="label-tag"
            style={{ marginBottom: 14, color: "oklch(48% 0.12 160)" }}
          >
            {lang === "bg"
              ? "Отговорно производство"
              : "Responsible production"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "С внимание към природата"
              : "With care for nature"}
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: 580,
              margin: "16px auto 0",
              fontSize: "1rem",
            }}
          >
            {lang === "bg"
              ? "За нас качеството не спира до състава. Вярваме, че храната трябва да бъде създавана с уважение към хората и природата. Затова работим с производител, който поставя акцент върху органично производство, по-отговорни производствени практики и намаляване на отпечатъка върху средата."
              : "For us, quality does not stop at the ingredients. We believe food should be created with respect for people and nature. That is why we work with a manufacturer that focuses on organic production, more responsible manufacturing practices, and reducing environmental footprint."}
          </p>
        </div>

        <div
          className="pp-sustain-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {cards.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "24px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 14,
                borderTop: `3px solid oklch(${52 + i * 4}% 0.14 ${145 + i * 8})`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "oklch(92% 0.04 145)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "oklch(42% 0.12 155)",
                  fontSize: typeof icon === "string" ? "1.3rem" : undefined,
                }}
              >
                {icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--plum)",
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-soft)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: "0.82rem",
            color: "var(--text-soft)",
            maxWidth: 520,
            margin: "28px auto 0",
          }}
        >
          {lang === "bg"
            ? "* Описаните практики отразяват посоката и стремежите на производителя. Не представляват абсолютни или сертифицирани твърдения."
            : "* The practices described reflect the direction and aspirations of the manufacturer. They do not represent absolute or certified claims."}
        </p>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-sustain-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 1100px) { .pp-sustain-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .pp-sustain-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 420px)  { .pp-sustain-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── MISSION ────────────────────────────────────────────────────────── */

function MissionSection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--plum)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 400,
          height: 400,
          background: "oklch(40% 0.08 315)",
          borderRadius: "50%",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 260,
          height: 260,
          background: "oklch(44% 0.09 55)",
          borderRadius: "50%",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 650, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 3,
              background: "var(--caramel)",
              borderRadius: 10,
              margin: "0 auto 28px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--caramel)",
              marginBottom: 20,
            }}
          >
            {lang === "bg"
              ? "Мисията зад барчето"
              : "The mission behind the bar"}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)",
              fontWeight: 600,
              color: "white",
              lineHeight: 1.2,
              marginBottom: 24,
              textWrap: "pretty",
            }}
          >
            {lang === "bg"
              ? "Всяко барче има кауза."
              : "Every bar has a mission."}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "oklch(80% 0.04 310)",
              lineHeight: 1.72,
              marginBottom: 26,
            }}
          >
            {lang === "bg"
              ? "Когато избираш ТЕПЕ bite, не избираш само междинна закуска. Подкрепяш младежки инициативи, които развиваме, проследяваме и показваме прозрачно."
              : "When you choose ТЕПЕ bite, you are not just choosing a snack. You support youth initiatives that we develop, track, and share transparently."}
          </p>
          {/* TODO: Link to /initiatives when that page is built */}
          <a
            href="/#initsiatiви"
            className="btn btn-caramel"
            style={{ fontSize: "1rem", padding: "15px 36px" }}
          >
            {lang === "bg"
              ? "Виж приноса ни към града"
              : "See our impact in the city"}
            <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── ORDER CTA ──────────────────────────────────────────────────────── */

function OrderSection({ lang }: { lang: Lang }) {
  const quantities =
    lang === "bg"
      ? [
          {
            qty: "10 броя",
            label: "За да опиташ ТЕПЕ bite",
            desc: "Опитай и реши сам. Подкрепи каузата и се запази с вкусно похапване за следващите дни.",
          },
          {
            qty: "20 броя",
            label: "За да се наслаждаваш за по-дълго",
            desc: "Вземи 20 барчета и получи безплатна доставка. Вземи достатъчно, за да похапваш по-дълго ТЕПЕ bite.",
          },
          {
            qty: "35 броя",
            label: "За да споделиш с приятели магията на ТЕПЕ bite",
            desc: "С покупката на 35 барчета получаваш по-ниска цена на бройка и безплатна доставка. Наслади се на ТЕПЕ bite и сподели с приятели. Спести и сподели.",
          },
        ]
      : [
          {
            qty: "10 pcs",
            label: "To try ТЕПЕ bite",
            desc: "Try and decide for yourself. Support the cause and keep a tasty snack for the next days.",
          },
          {
            qty: "20 pcs",
            label: "To enjoy longer",
            desc: "Get 20 bars and receive free shipping. Get enough to snack on ТЕПЕ bite for longer.",
          },
          {
            qty: "35 pcs",
            label: "To share the magic of ТЕПЕ bite with friends",
            desc: "With the purchase of 35 bars you get a lower price per piece and free shipping. Enjoy ТЕПЕ bite and share with friends. Save and share.",
          },
        ];

  return (
    <section
      id="order"
      className="section-spacing"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 80%, oklch(88% 0.05 315 / 0.18), transparent), var(--bg)`,
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Поръчай" : "Order"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Готов ли си да опиташ ТЕПЕ bite?"
              : "Ready to try ТЕПЕ bite?"}
          </h2>
          <p
            style={{
              marginTop: 14,
              maxWidth: 480,
              margin: "14px auto 0",
              fontSize: "1rem",
            }}
          >
            {lang === "bg"
              ? "Поръчай барчето със солен карамел и подкрепи първите ни инициативи още сега."
              : "Order the salted caramel bar and support our first initiatives right now."}
          </p>
        </div>

        {/* Quantity preview cards */}
        <div
          className="pp-order-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            marginBottom: 52,
          }}
        >
          {quantities.map(({ qty, label, desc }, i) => (
            <div
              key={i}
              className="card items-center justify-center flex flex-col"
              style={{
                padding: "28px 20px",
                textAlign: "center",
                borderTop:
                  i === 1
                    ? "3px solid var(--caramel)"
                    : "3px solid var(--border)",
                position: "relative",
                gridColumn: i === 2 ? "1 / -1" : undefined,
              }}
            >
              {i === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--caramel)",
                    color: "white",
                    borderRadius: 100,
                    padding: "3px 12px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lang === "bg" ? "популярен избор" : "popular choice"}
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "var(--plum)",
                  marginBottom: 8,
                }}
              >
                {qty}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-soft)",
                  margin: 0,
                }}
                className="text-justify max-w-[350px] w-full mx-auto"
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/order"
            className="btn btn-primary"
            style={{ fontSize: "1.05rem", padding: "16px 40px" }}
          >
            <IconShop />
            {lang === "bg" ? "Към поръчка" : "Place an order"}
          </a>
          <a
            href="mailto:tepe@mail.bg"
            className="btn btn-secondary"
            style={{ fontSize: "1.05rem", padding: "16px 32px" }}
          >
            <IconHeart />
            {lang === "bg" ? "Имам въпрос" : "I have a question"}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1350px) { .pp-order-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 900px)  { .pp-order-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .pp-order-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────── */

function FAQSection({ lang }: { lang: Lang }) {
  const faqs =
    lang === "bg"
      ? [
          {
            q: "Какво представлява ТЕПЕ bite?",
            a: "ТЕПЕ bite е нисковъглехидратно барче с вкус на солен карамел, създадено в Пловдив. Съдържа ядки, семена, фибри и растителен протеин. Подсладено е с еритритол.",
          },
          {
            q: "Колко грама е едно барче?",
            a: "Едно барче е 40 g.",
          },
          {
            q: "Подходящо ли е за кето режим?",
            a: "Барчето е с ниско съдържание на нетни въглехидрати (5.7 g на бар). Подходящостта зависи от индивидуалния режим и дневния лимит. Консултирайте се с личния си диетолог при нужда.",
          },
          {
            q: "Съдържа ли захар?",
            a: "В 1 бар има 1.4 g захари. Продуктът е подсладен с еритритол. Проверете финалния етикет за пълна информация.",
          },
          {
            q: "Какви са основните съставки?",
            a: "Бадеми, фибри от корен на цикория, слънчогледови семки, хрупкави протеинови хапки от слънчоглед, тиквени семки, еритритол, лукума, натурален карамелен аромат, морска сол.",
          },
          {
            q: "Кой е производителят?",
            a: "Производител е BioStyle Ltd. — български производител на органични и иновативни храни, основан през 2012 г.",
          },
          {
            q: "Какви сертификати има производителят?",
            a: "BioStyle Ltd. е свързан с IFS Food сертификация, притежава Organic Certificate и е посочен в органичен каталог на Balkan Biocert.",
          },
          {
            q: "Как покупката подкрепя инициативите?",
            a: "ТЕПЕ bite е бранд с мисия — подкрепят се младежки инициативи, чийто напредък се проследява и публикува прозрачно.",
          },
          {
            q: "Къде мога да поръчам?",
            a: "Можете да поръчате от страницата за поръчка на сайта. Следете нашия линк хъб и социалните мрежи за актуална информация.",
          },
        ]
      : [
          {
            q: "What is ТЕПЕ bite?",
            a: "ТЕПЕ bite is a low-carb snack bar with a salted caramel flavour, created in Plovdiv. It contains nuts, seeds, fibre, and plant protein. It is sweetened with erythritol.",
          },
          {
            q: "How many grams is one bar?",
            a: "One bar is 40 g.",
          },
          {
            q: "Is it suitable for a keto diet?",
            a: "The bar has a low net carb content (5.7 g per bar). Suitability depends on your individual diet and daily limits. Consult your dietitian if needed.",
          },
          {
            q: "Does it contain sugar?",
            a: "One bar contains 1.4 g sugars. The product is sweetened with erythritol. Check the final label for complete information.",
          },
          {
            q: "What are the main ingredients?",
            a: "Almonds, chicory root fibre, sunflower seeds, crunchy sunflower protein bites, pumpkin seeds, erythritol, lucuma, natural caramel flavour, sea salt.",
          },
          {
            q: "Who is the manufacturer?",
            a: "The manufacturer is BioStyle Ltd. — a Bulgarian producer of organic and innovative foods, founded in 2012.",
          },
          {
            q: "What certifications does the manufacturer hold?",
            a: "BioStyle Ltd. is associated with IFS Food certification, holds an Organic Certificate, and is listed in the Balkan Biocert organic catalogue.",
          },
          {
            q: "How does my purchase support the initiatives?",
            a: "ТЕПЕ bite is a brand with a mission — youth initiatives are supported, with progress tracked and published transparently.",
          },
          {
            q: "Where can I order?",
            a: "You can order from the order page on the website. Follow our link hub and social media for current information.",
          },
        ];

  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--surface2)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Въпроси" : "Questions"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Често задавани въпроси"
              : "Frequently asked questions"}
          </h2>
        </div>

        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {faqs.map(({ q, a }, i) => (
            <details
              key={i}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <summary
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--plum)",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>{q}</span>
                <span
                  style={{
                    color: "var(--caramel)",
                    flexShrink: 0,
                    fontSize: "1.2rem",
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </summary>
              <div
                style={{
                  padding: "0 24px 20px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    marginTop: 16,
                    fontSize: "0.92rem",
                    color: "var(--text-mid)",
                    lineHeight: 1.7,
                    margin: "16px 0 0",
                  }}
                >
                  {a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ROOT EXPORT ────────────────────────────────────────────────────── */

export default function ProductPageContent() {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <ProductHero lang={lang} />
      <ValueStrip lang={lang} />
      <TasteSection lang={lang} />
      <NutritionSection lang={lang} />
      <IngredientsSection lang={lang} />
      <WhenSection lang={lang} />
      <ManufacturerSection lang={lang} />
      <SustainabilitySection lang={lang} />
      <MissionSection lang={lang} />
      <OrderSection lang={lang} />
      <FAQSection lang={lang} />
    </>
  );
}
