"use client";

import { IconArrow, IconCheck, IconHeart, IconShop } from "@/components/icons";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Extra icons ────────────────────────────────────────────────────────── */

const IconClock = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconExternal = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconMountain = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const IconBrush = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

const IconUsers = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTarget = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconShare = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconHandshake = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);

const IconEye = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconChevron = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─── Hill SVG motif ─────────────────────────────────────────────────────── */

function HillSVG({
  opacity = 0.06,
  fill = "var(--plum)",
  variant = 1,
}: {
  opacity?: number;
  fill?: string;
  variant?: 1 | 2;
}) {
  const path =
    variant === 1
      ? "M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z"
      : "M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z";
  return (
    <svg
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        opacity,
        pointerEvents: "none",
      }}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="lg:-mb-10 mb-0"
    >
      <path d={path} fill={fill} />
    </svg>
  );
}

/* ─── Wave connector between sections ───────────────────────────────────── */

function WaveTop({
  fromColor,
  toColor,
}: {
  fromColor: string;
  toColor: string;
}) {
  return (
    <div
      style={{
        height: 56,
        background: toColor,
        position: "relative",
        marginTop: -1,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M0 0 Q300 56 600 28 Q900 0 1200 40 L1200 0 Z"
          fill={fromColor}
        />
      </svg>
    </div>
  );
}

/* ─── Image placeholder ──────────────────────────────────────────────────── */

function ImgPlaceholder({
  label,
  todoAsset,
  ratio = "4/3",
}: {
  label: string;
  todoAsset: string;
  ratio?: string;
}) {
  return (
    /* TODO: Replace with actual asset: {todoAsset} */
    <div
      data-todo={`Asset needed: ${todoAsset}`}
      style={{
        aspectRatio: ratio,
        background:
          "linear-gradient(145deg, var(--plum-lt) 0%, oklch(94% 0.04 52) 100%)",
        borderRadius: "var(--r-md)",
        border: "2px dashed oklch(80% 0.07 315)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 600 180"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          opacity: 0.18,
        }}
        aria-hidden="true"
      >
        <path
          d="M0 180 L0 110 Q120 40 240 75 Q360 110 480 55 Q545 25 600 50 L600 180 Z"
          fill="var(--plum)"
        />
      </svg>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--plum-mid)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <p
        style={{
          color: "var(--plum-mid)",
          fontSize: "0.78rem",
          fontWeight: 500,
          textAlign: "center",
          padding: "0 28px",
          maxWidth: 280,
          zIndex: 1,
          lineHeight: 1.55,
          position: "relative",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 · HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="initiatives-hero"
      style={{
        minHeight: "68vh",
        background: `radial-gradient(ellipse 70% 50% at 35% 30%, oklch(88% 0.05 315 / 0.28), transparent), var(--bg)`,
        display: "flex",
        alignItems: "center",
        paddingTop: 110,
        paddingBottom: 64,
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-blob"
        style={{
          width: 380,
          height: 380,
          background: "oklch(86% 0.07 315)",
          top: -80,
          right: -40,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 260,
          height: 260,
          background: "oklch(89% 0.09 52)",
          bottom: -40,
          left: "6%",
        }}
      />
      <HillSVG />

      <div
        className="section-inner"
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div className="flex max-[1200px]:w-full justify-center w-fit">
            <div className="w-fit block">
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  flexWrap: "wrap",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    padding: "5px 14px",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "var(--plum)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {lang === "bg"
                    ? "С грижа за символа на града - тепетата"
                    : "Caring for the symbol of the city - the hills"}
                </span>
                <span
                  style={{
                    background: "var(--caramel-lt)",
                    border: "1px solid oklch(84% 0.09 52)",
                    borderRadius: 100,
                    padding: "5px 14px",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "oklch(42% 0.12 52)",
                  }}
                >
                  {lang === "bg"
                    ? "Младежка инициатива"
                    : "Youth-led initiative"}
                </span>
              </div>

              <h1
                className="heading-xl max-sm:text-3xl!"
                style={{ maxWidth: 630, marginBottom: 20 }}
              >
                {lang === "bg"
                  ? "От Пловдив. За Пловдив."
                  : "From Plovdiv. For Plovdiv."}
              </h1>

              <p
                className="text-justify"
                style={{
                  fontSize: "clamp(0.97rem, 1.4vw, 1.08rem)",
                  maxWidth: 630,
                  marginBottom: 36,
                  lineHeight: 1.72,
                }}
              >
                {lang === "bg"
                  ? "ТЕПЕ bite е бранд, създаден от млади хора в Пловдив с една ясна идея: част от стойността, която създаваме, да се връща обратно към града — започвайки от тепетата."
                  : "ТЕПЕ bite is a brand created by young people in Plovdiv with one clear idea: part of the value we create should return to the city — starting with the hills."}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="#first-initiative"
                  className="btn btn-primary max-sm:text-[0.7rem]! max-sm:px-8!"
                >
                  {lang === "bg"
                    ? "Виж първата инициатива"
                    : "See the first initiative"}{" "}
                  <IconArrow />
                </a>
                <a
                  href="#model"
                  className="btn btn-secondary max-sm:text-[0.7rem]! max-sm:px-4! flex justify-center max-sm:grow grow-0"
                >
                  {lang === "bg"
                    ? "Как работи моделът?"
                    : "How the model works"}
                </a>
              </div>
            </div>
          </div>

          {/* Hero teaser card */}
          <div className="flex max-[1200px]:w-full justify-center w-fit">
            <a
              href="#first-initiative"
              className="hero-teaser-card card-hover cursor-pointer block"
              style={{
                background: "var(--surface)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                padding: "28px 24px",
                minWidth: 260,
                maxWidth: 350,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--caramel)",
                    animation: "pulse-dot 2s infinite",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--caramel)",
                  }}
                >
                  {lang === "bg" ? "Текущ фокус" : "Current focus"}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                RE-CONNECT БУНАРДЖИКА
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  margin: "0 0 18px",
                  color: "var(--text-mid)",
                }}
              >
                {lang === "bg"
                  ? 'Пилотна инициатива за облагородяване на зона около чешмичката на „Кръгчето".'
                  : "A pilot initiative to improve the area around the fountain at 'Krugcheto'."}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "oklch(93% 0.04 150)",
                    color: "oklch(36% 0.1 150)",
                    borderRadius: 100,
                    padding: "4px 12px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {lang === "bg" ? "В подготовка" : "In preparation"}
                </span>
                <span
                  style={{
                    background: "var(--plum-lt)",
                    color: "var(--plum)",
                    borderRadius: 100,
                    padding: "4px 12px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Бунарджика
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-teaser-card { max-width: 640px !important; min-width: auto !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 · WHAT ARE OUR INITIATIVES
   ═══════════════════════════════════════════════════════════════════════════ */

function IntroSection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "clamp(32px, 5vw, 72px)",
            alignItems: "center",
          }}
          className="intro-grid"
        >
          {/* Left: label + heading */}
          <div>
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {lang === "bg" ? "Нашата кауза" : "Our cause"}
            </div>
            <h2 className="heading-lg min-[1130px]:text-4xl! min-[900px]:text-3xl!">
              {lang === "bg"
                ? "Какво представляват нашите инициативи?"
                : "What are our initiatives?"}
            </h2>
            <div
              style={{
                width: 40,
                height: 3,
                background: "var(--caramel)",
                borderRadius: 10,
                marginTop: 24,
              }}
            />
          </div>

          {/* Right: editorial copy */}
          <div>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text-mid)",
                marginBottom: 24,
              }}
            >
              {lang === "bg"
                ? "Нашите инициативи са начинът, по който ТЕПЕ bite превръща продукт, кампании и партньорства в реални действия за Пловдив."
                : "Our initiatives are the way ТЕПЕ bite turns a product, campaigns, and partnerships into real action for Plovdiv."}
            </p>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text-mid)",
                marginBottom: 0,
              }}
            >
              {lang === "bg"
                ? "Някои проекти създаваме и организираме сами. Други можем да подкрепяме, когато отговарят на нашите ценности — грижа за града, природата, тепетата и общността."
                : "Some projects are created and organized by our own team. Others may be supported when they match our values — care for the city, nature, the hills, and the community."}
            </p>

            {/* Three pillars — compact inline */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  icon: <IconMountain />,
                  label: lang === "bg" ? "Опазване" : "Preserve",
                  color: "var(--plum)",
                  bg: "var(--plum-lt)",
                },
                {
                  icon: <IconBrush />,
                  label: lang === "bg" ? "Облагородяване" : "Improve",
                  color: "oklch(44% 0.14 52)",
                  bg: "var(--caramel-lt)",
                },
                {
                  icon: <IconUsers />,
                  label: lang === "bg" ? "Младежко действие" : "Youth action",
                  color: "var(--plum-mid)",
                  bg: "oklch(91% 0.03 295)",
                },
              ].map(({ icon, label, color, bg }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: bg,
                    borderRadius: 100,
                    padding: "8px 16px 8px 10px",
                    color,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {icon}
                  </span>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) { .intro-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 · MODEL "Как работи моделът"
   ═══════════════════════════════════════════════════════════════════════════ */

function ModelSection({ lang }: { lang: Lang }) {
  const steps = [
    {
      num: "01",
      icon: <IconTarget />,
      iconBg: "var(--plum)",
      title: lang === "bg" ? "Създаваме стойност" : "We create value",
      text:
        lang === "bg"
          ? "Чрез продукта, кампании и партньорства."
          : "Through the product, campaigns, and partnerships.",
    },
    {
      num: "02",
      icon: <IconHeart />,
      iconBg: "var(--caramel)",
      title: lang === "bg" ? "Избираме кауза" : "We choose a cause",
      text:
        lang === "bg"
          ? "Фокусираме се върху конкретен проблем или място в Пловдив."
          : "We focus on a concrete problem or place in Plovdiv.",
    },
    {
      num: "03",
      icon: <IconCheck />,
      iconBg: "var(--plum)",
      title: lang === "bg" ? "Показваме резултата" : "We show the result",
      text:
        lang === "bg"
          ? "Публикуваме напредъка, партньорствата и следващите стъпки."
          : "We publish progress, partnerships, and next steps.",
    },
  ];

  return (
    <section
      id="model"
      className="section-spacing"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-inner">
        <div style={{ marginBottom: 52 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === "bg" ? "Нашият модел" : "Our model"}
          </div>
          <h2
            className="heading-lg"
            style={{ maxWidth: 520, marginBottom: 16 }}
          >
            {lang === "bg" ? "Как работи моделът" : "How the model works"}
          </h2>
          <p style={{ maxWidth: 540, fontSize: "1rem" }}>
            {lang === "bg"
              ? "Идеята е проста: ТЕПЕ bite създава стойност чрез продукт и кампании, а част от тази стойност се насочва към конкретни градски инициативи."
              : "The idea is simple: ТЕПЕ bite creates value through a product and campaigns, and part of that value is directed toward concrete urban initiatives."}
          </p>
        </div>

        <div
          style={{ display: "flex", alignItems: "stretch", gap: 0 }}
          className="model-steps gap-y-5!"
        >
          {steps.map(({ num, icon, iconBg, title, text }, i) => (
            <div key={i} style={{ display: "flex", flex: 1 }}>
              <div
                className="card"
                style={{
                  padding: "32px 26px",
                  flex: 1,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "3.5rem",
                    fontWeight: 900,
                    color: "var(--border)",
                    lineHeight: 1,
                    position: "absolute",
                    top: 10,
                    right: 18,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                >
                  {num}
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: iconBg,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--plum)",
                    marginBottom: 10,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "0.92rem", margin: 0 }}>{text}</p>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginLeft: 10,
                  }}
                  aria-hidden="true"
                >
                  <svg width="26" height="16" viewBox="0 0 26 16">
                    <path
                      d="M0 8 L18 8 M12 2 L18 8 L12 14"
                      stroke="var(--border)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .model-steps { flex-direction: column !important; }
          .model-steps > div > div[aria-hidden="true"] { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 · GENERAL FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function GeneralFAQSection({ lang }: { lang: Lang }) {
  const items =
    lang === "bg"
      ? [
          {
            q: "Само ваши инициативи ли реализирате?",
            a: "Не задължително. Основният фокус са инициативи, които нашият екип създава и движи сам. В бъдеще можем да подкрепяме и външни инициативи, ако отговарят на нашите ценности.",
          },
          {
            q: "Откъде идват средствата?",
            a: "От продукта, кампаниите и партньорствата около ТЕПЕ bite. Когато има точни проценти и бюджети, ще ги публикуваме прозрачно.",
          },
          {
            q: "Защо тепетата?",
            a: "Те са един от най-силните символи на Пловдив — природни, културни и социални пространства, които заслужават постоянна грижа.",
          },
        ]
      : [
          {
            q: "Do you only run your own initiatives?",
            a: "Not necessarily. Our main focus is on initiatives our team creates and drives ourselves. In the future, we may also support external initiatives if they match our values.",
          },
          {
            q: "Where do the funds come from?",
            a: "From the product, campaigns, and partnerships around ТЕПЕ bite. Once exact percentages and budgets are confirmed, we will publish them transparently.",
          },
          {
            q: "Why the hills?",
            a: "They are one of Plovdiv's strongest symbols — natural, cultural, and social spaces that deserve continuous care.",
          },
        ];

  return (
    <section
      style={{
        background: "var(--surface)",
        paddingTop: "clamp(48px, 6vw, 80px)",
        paddingBottom: "clamp(48px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner">
        <div
          style={{
            background: "var(--bg)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            padding: "clamp(28px, 4vw, 48px)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div className="label-tag" style={{ marginBottom: 10 }}>
              {lang === "bg" ? "Контекст" : "Context"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--plum)",
              }}
            >
              {lang === "bg"
                ? "Въпроси за инициативите"
                : "Questions about the initiatives"}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(({ q, a }, i) => (
              <details key={i} className="faq-item faq-light">
                <summary className="faq-summary faq-summary-light">
                  <span>{q}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-body faq-body-light">
                  <p style={{ margin: 0, fontSize: "0.93rem" }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-light .faq-summary-light {
          padding: 15px 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.93rem;
          color: var(--plum);
          background: var(--surface);
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          user-select: none;
          transition: background 0.18s;
        }
        .faq-light .faq-summary-light::-webkit-details-marker { display: none; }
        .faq-light .faq-summary-light:hover { background: var(--plum-lt); }
        .faq-light.faq-item { border-radius: var(--r-sm); }
        .faq-light details[open] .faq-summary-light,
        .faq-light[open] .faq-summary-light {
          border-radius: var(--r-sm) var(--r-sm) 0 0;
          background: var(--plum-lt);
        }
        .faq-body-light {
          padding: 15px 20px 18px;
          background: var(--plum-lt);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 var(--r-sm) var(--r-sm);
        }
        .faq-plus {
          font-size: 1.25rem;
          color: var(--caramel);
          flex-shrink: 0;
          font-weight: 300;
          transition: transform 0.2s;
        }
        details[open] .faq-plus { transform: rotate(45deg); }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 · TRANSITION TO FIRST INITIATIVE
   ═══════════════════════════════════════════════════════════════════════════ */

function TransitionSection({ lang }: { lang: Lang }) {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, var(--plum-lt) 0%, oklch(94% 0.05 52 / 0.5) 100%)",
        paddingTop: "clamp(52px, 6vw, 80px)",
        paddingBottom: "clamp(52px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -60,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "oklch(89% 0.09 52 / 0.35)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 640 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Първа стъпка" : "First step"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 18 }}>
            {lang === "bg"
              ? "Започваме с Бунарджика."
              : "We begin with Bunardzhika."}
          </h2>
          <p
            style={{ fontSize: "1.03rem", lineHeight: 1.78, marginBottom: 28 }}
          >
            {lang === "bg"
              ? "За да докажем модела, започваме с конкретен проект — малка, видима и реалистична намеса в едно от най-разпознаваемите места на Пловдив."
              : "To prove the model, we begin with a concrete project — a small, visible, and realistic intervention in one of Plovdiv's most recognizable places."}
          </p>
          <a href="#first-initiative" className="btn btn-primary">
            {lang === "bg" ? "Виж инициативата" : "See the initiative"}{" "}
            <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 · FEATURED INITIATIVE — RE-CONNECT БУНАРДЖИКА
   ═══════════════════════════════════════════════════════════════════════════ */

function FeaturedInitiativeSection({ lang }: { lang: Lang }) {
  const facts =
    lang === "bg"
      ? [
          ["Локация", 'Парк Бунарджика, зоната около чешмичката на „Кръгчето"'],
          ["Формат", "Съвременно графично изкуство / арт намеса"],
          ["Цел", "Облагородяване и активиране на социална зона"],
          ["Финансиране", "Моделът ТЕПЕ bite"],
          ["Статус", "В подготовка — предстои съгласуване"],
        ]
      : [
          [
            "Location",
            'Bunardzhika Park, the area around the fountain at "Krugcheto"',
          ],
          ["Format", "Contemporary graphic art / art intervention"],
          ["Goal", "Improving and activating a social space"],
          ["Funding", "The ТЕПЕ bite model"],
          ["Status", "In preparation — coordination pending"],
        ];

  const badges =
    lang === "bg"
      ? [
          {
            text: "Пилотен проект",
            color: "var(--plum)",
            bg: "var(--plum-lt)",
          },
          {
            text: "Бунарджика, Пловдив",
            color: "oklch(42% 0.12 52)",
            bg: "var(--caramel-lt)",
          },
          {
            text: "В подготовка",
            color: "oklch(34% 0.1 150)",
            bg: "oklch(92% 0.05 150)",
          },
          {
            text: "Предстои съгласуване",
            color: "oklch(38% 0.08 220)",
            bg: "oklch(93% 0.04 220)",
          },
        ]
      : [
          { text: "Pilot project", color: "var(--plum)", bg: "var(--plum-lt)" },
          {
            text: "Bunardzhika, Plovdiv",
            color: "oklch(42% 0.12 52)",
            bg: "var(--caramel-lt)",
          },
          {
            text: "In preparation",
            color: "oklch(34% 0.1 150)",
            bg: "oklch(92% 0.05 150)",
          },
          {
            text: "Coordination pending",
            color: "oklch(38% 0.08 220)",
            bg: "oklch(93% 0.04 220)",
          },
        ];

  return (
    <section
      id="first-initiative"
      className="section-spacing"
      style={{ background: "var(--bg)", scrollMarginTop: 80 }}
    >
      <div className="section-inner">
        {/* Section header */}
        <div style={{ marginBottom: 48 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Пилотен проект" : "Pilot project"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg" ? "RE-CONNECT БУНАРДЖИКА" : "RE-CONNECT BUNARDZHIKA"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.15fr) minmax(280px, 0.85fr)",
            gap: "clamp(32px, 5vw, 56px)",
            alignItems: "start",
          }}
          className="initiative-detail-grid"
        >
          {/* Left: image + caption */}
          <div>
            {/*
              TODO: Replace placeholder with:
              /assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg
              Add to public/ then use <Image> or <img> with borderRadius "var(--r-md)".
            */}
            <Image
              src="/images/social-project-preview.jpg"
              alt="Social Project Preview"
              width={600}
              height={400}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--r-md)",
              }}
            />
            <p
              style={{
                marginTop: 10,
                fontSize: "0.8rem",
                color: "var(--text-soft)",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              {lang === "bg"
                ? 'Концептуална визуализация на графичната намеса около чешмичката на „Кръгчето".'
                : "Concept visualization of the graphic intervention around the fountain at 'Krugcheto'."}
            </p>

            {/* Visual concept cards below image */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                marginTop: 20,
              }}
              className="concept-mini-cards"
            >
              {[
                {
                  symbol: "❀",
                  bg: "var(--caramel-lt)",
                  color: "oklch(44% 0.14 52)",
                  label:
                    lang === "bg"
                      ? "Разкрасяване на комуникативно точка"
                      : "Beautifying a transit point",
                },
                {
                  symbol: "⬡",
                  bg: "var(--plum-lt)",
                  color: "var(--plum)",
                  label: lang === "bg" ? "Социална функция" : "Social function",
                },
                {
                  symbol: "𖣂",
                  bg: "oklch(92% 0.04 150)",
                  color: "oklch(34% 0.1 150)",
                  label:
                    lang === "bg" ? "Фокус върху природата" : "Focus on nature",
                },
              ].map(({ symbol, bg, color, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center"
                  style={{
                    background: bg,
                    borderRadius: "var(--r-sm)",
                    padding: "14px 12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.4rem", color, marginBottom: 6 }}>
                    {symbol}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      color,
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: badges + copy + facts */}
          <div>
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                marginBottom: 22,
              }}
            >
              {badges.map(({ text, color, bg }) => (
                <span
                  key={text}
                  style={{
                    background: bg,
                    color,
                    borderRadius: 100,
                    padding: "5px 13px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {text}
                </span>
              ))}
            </div>

            <p style={{ marginBottom: 28, fontSize: "1rem", lineHeight: 1.75 }}>
              {lang === "bg"
                ? 'Пилотният ни проект за естетическо облагородяване на пространството около чешмичката на „Кръгчето" в парк Бунарджика чрез съвременно графично изкуство.'
                : "Our pilot project for the aesthetic improvement of the area around the fountain at 'Krugcheto' in Bunardzhika Park through contemporary graphic art."}
            </p>

            <p
              style={{
                marginBottom: 28,
                fontSize: "0.97rem",
                lineHeight: 1.75,
                fontStyle: "italic",
                color: "var(--text-mid)",
                borderLeft: "3px solid var(--caramel)",
                paddingLeft: 16,
              }}
            >
              {lang === "bg"
                ? "Искаме да превърнем транзитна точка в място, което хората забелязват, използват и преживяват. Флуидните линии и цветните акценти насочват движението и превръщат зоната около чешмичката в по-живо пространство."
                : "We want to turn a transitional point into a place people notice, use, and experience. Fluid lines and color accents guide movement and make the area around the fountain feel more alive."}
            </p>

            {/* Key facts */}
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-soft)",
                marginBottom: 10,
              }}
            >
              {lang === "bg" ? "Ключови факти" : "Key facts"}
            </div>
            {facts.map(([key, val], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    color: "var(--text-soft)",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--plum)",
                    fontSize: "0.85rem",
                    textAlign: "right",
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .initiative-detail-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .concept-mini-cards { grid-template-columns: 1fr 1fr 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 · PROGRESS
   ═══════════════════════════════════════════════════════════════════════════ */

function ProgressSection({ lang }: { lang: Lang }) {
  type Milestone = {
    done: boolean;
    title: string;
    text: string;
    link: { href: string; label: string } | null;
  };

  const milestones: Milestone[] = [
    {
      done: true,
      title:
        lang === "bg" ? "Идентифицирахме каузата" : "We identified the cause",
      text:
        lang === "bg"
          ? "Фокусът е ясен: грижа за тепетата и облагородяване на конкретна зона на Бунарджика."
          : "The focus is clear: caring for the hills and improving a specific area of Bunardzhika.",
      link: null,
    },
    {
      done: true,
      title:
        lang === "bg"
          ? "Проверихме осъществимостта"
          : "We assessed feasibility",
      text:
        lang === "bg"
          ? "Проектът е структуриран като реалистична първа стъпка, а не като абстрактна идея."
          : "The project is structured as a realistic first step, not an abstract idea.",
      link: null,
    },
    {
      done: true,
      title:
        lang === "bg"
          ? "Осигурихме техническо партньорство с Оргахим"
          : "We secured technical partnership with Orgachim",
      text:
        lang === "bg"
          ? "Оргахим ще подкрепи проекта с нужните инструменти и материали за реализацията."
          : "Orgachim will support the project with the tools and materials needed for implementation.",
      link: {
        href: "https://www.orgachim.bg/bg/",
        label: lang === "bg" ? "Към Оргахим" : "Visit Orgachim",
      },
    },
    {
      done: true,
      title:
        lang === "bg"
          ? "Намерихме артистичен екип"
          : "We found the artist team",
      text:
        lang === "bg"
          ? "Работим с група артисти, които ще развият и изпълнят финалната визуална намеса."
          : "We are working with a group of artists who will develop and execute the final visual intervention.",
      link: null,
    },
    {
      done: true,
      title:
        lang === "bg"
          ? "Разработихме първи дизайн идеи"
          : "We developed first design ideas",
      text:
        lang === "bg"
          ? "Създадени са концептуални визуализации за графичната посока и усещането на пространството."
          : "Concept visuals have been created for the graphic direction and the feeling of the space.",
      link: null,
    },
    {
      done: false,
      title:
        lang === "bg"
          ? 'Предстои координация с Район „Централен"'
          : "Coordination with Central District is next",
      text:
        lang === "bg"
          ? 'Следващата важна стъпка е координация с кмета на район „Централен" и администрацията.'
          : "The next important step is coordination with the mayor of Central District and the administration.",
      link: {
        href: "https://plovdivcentral.org/rajonna-administratsiya/kmet/",
        label: lang === "bg" ? 'Район „Централен"' : "Central District",
      },
    },
    {
      done: false,
      title:
        lang === "bg"
          ? "Предстои реализация на арт намесата"
          : "Art execution remains",
      text:
        lang === "bg"
          ? "След финално съгласуване преминаваме към подготовка на терена и изпълнение на графичното изкуство."
          : "After final coordination, we move toward preparing the site and executing the graphic artwork.",
      link: null,
    },
  ];

  const doneCount = milestones.filter((m) => m.done).length;
  const pct = Math.round((doneCount / milestones.length) * 100);

  return (
    <section
      id="progress"
      className="section-spacing"
      style={{ background: "var(--surface)", scrollMarginTop: 80 }}
    >
      <div className="section-inner">
        <div style={{ marginBottom: 48 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Прозрачност" : "Transparency"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Докъде сме стигнали" : "Where we are now"}
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-soft)",
              fontStyle: "italic",
              borderLeft: "3px solid var(--caramel)",
              paddingLeft: 14,
              maxWidth: 560,
            }}
          >
            {lang === "bg"
              ? "Това е напредък по подготовката на инициативата, не финално институционално одобрение."
              : "This is progress in preparing the initiative, not final institutional approval."}
          </p>
        </div>

        {/* 2-column layout: summary left, milestones right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px, 0.7fr) minmax(300px, 1.3fr)",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "start",
          }}
          className="progress-layout"
        >
          {/* Left: summary card */}
          <div
            style={{
              background: "var(--bg)",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              padding: "32px 28px",
              position: "sticky",
              top: 100,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "3.2rem",
                fontWeight: 900,
                color: "var(--plum)",
                lineHeight: 1,
              }}
            >
              {doneCount}
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--text-soft)",
                  fontWeight: 400,
                }}
              >
                /{milestones.length}
              </span>
            </div>
            <p
              style={{
                margin: "8px 0 20px",
                fontSize: "0.88rem",
                color: "var(--text-mid)",
              }}
            >
              {lang === "bg" ? "подготвени стъпки" : "prepared steps"}
            </p>
            <div className="progress-track" style={{ marginBottom: 20 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--caramel)",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                }}
              >
                <IconCheck /> {lang === "bg" ? "Подготвено" : "Prepared"}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--plum-mid)",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                }}
              >
                <IconClock /> {lang === "bg" ? "Предстои" : "Upcoming"}
              </div>
            </div>
          </div>

          {/* Right: milestone list */}
          <div>
            {milestones.map(({ done, title, text, link }, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 18, position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 36,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: done ? "var(--caramel)" : "var(--surface2)",
                      border: done ? "none" : "2px solid var(--plum-mid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: done ? "white" : "var(--plum-mid)",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    {done ? <IconCheck /> : <IconClock />}
                  </div>
                  {i < milestones.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 24,
                        background: done
                          ? "oklch(76% 0.10 52)"
                          : "var(--border)",
                        margin: "3px 0",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    paddingBottom: i < milestones.length - 1 ? 26 : 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      color: done ? "var(--text)" : "var(--plum-mid)",
                      marginBottom: 5,
                      paddingTop: 7,
                    }}
                  >
                    {title}
                  </div>
                  <p
                    style={{
                      fontSize: "0.87rem",
                      color: done ? "var(--text-mid)" : "var(--text-soft)",
                      margin: 0,
                    }}
                  >
                    {text}
                  </p>
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 8,
                        color: "var(--caramel)",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color =
                          "oklch(55% 0.16 52)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--caramel)")
                      }
                    >
                      {link.label} <IconExternal />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .progress-layout { grid-template-columns: 1fr !important; }
          .progress-layout > div:first-child { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 · RE-CONNECT FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function ReconnectFAQSection({ lang }: { lang: Lang }) {
  const items =
    lang === "bg"
      ? [
          {
            q: "Проектът вече одобрен ли е?",
            a: 'Не. Проектът е в подготовка. Имаме концепция, техническо партньорство, артистичен екип и първи дизайн идеи. Следващата важна стъпка е координация с Район „Централен".',
          },
          {
            q: "Кой ще изпълни рисунката?",
            a: "Проектът предвижда участие на артистичен екип. Публичните имена и детайли трябва да бъдат показани само след финално потвърждение.",
          },
          {
            q: "Как участва Оргахим?",
            a: "Оргахим е технически партньор и ще подкрепи проекта с нужните инструменти и материали за реализацията.",
          },
          {
            q: "Какво остава да се направи?",
            a: 'Предстои координация с Район „Централен", финализиране на детайлите и реализация на арт намесата след съгласуване.',
          },
        ]
      : [
          {
            q: "Has the project been approved already?",
            a: "No. The project is in preparation. We have a concept, technical partnership, artist team, and first design ideas. The next important step is coordination with Central District.",
          },
          {
            q: "Who will create the artwork?",
            a: "The project includes an artist team. Public names and details should only be shown after final confirmation.",
          },
          {
            q: "How is Orgachim involved?",
            a: "Orgachim is a technical partner and will support the project with the tools and materials needed for implementation.",
          },
          {
            q: "What remains to be done?",
            a: "Coordination with Central District, finalizing the details, and executing the art intervention after approval.",
          },
        ];

  return (
    <section
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(52px, 6vw, 80px)",
        paddingBottom: "clamp(52px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner">
        <div
          style={{
            background: "var(--plum-lt)",
            borderRadius: "var(--r-lg)",
            border: "1px solid oklch(82% 0.05 315)",
            padding: "clamp(28px, 4vw, 48px)",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div className="label-tag" style={{ marginBottom: 10 }}>
              {lang === "bg"
                ? "RE-CONNECT БУНАРДЖИКА"
                : "RE-CONNECT BUNARDZHIKA"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--plum)",
              }}
            >
              {lang === "bg"
                ? "Въпроси за инициативата"
                : "Questions about the initiative"}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(({ q, a }, i) => (
              <details key={i} className="faq-item faq-reconnect">
                <summary className="faq-summary faq-summary-reconnect">
                  <span>{q}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-body faq-body-reconnect">
                  <p style={{ margin: 0, fontSize: "0.93rem" }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-reconnect .faq-summary-reconnect {
          padding: 15px 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.93rem;
          color: var(--plum);
          background: var(--surface);
          border-radius: var(--r-sm);
          border: 1px solid oklch(82% 0.05 315);
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          user-select: none;
          transition: background 0.18s;
        }
        .faq-reconnect .faq-summary-reconnect::-webkit-details-marker { display: none; }
        .faq-reconnect .faq-summary-reconnect:hover { background: oklch(96% 0.03 315); }
        .faq-reconnect.faq-item { border-radius: var(--r-sm); }
        .faq-reconnect[open] .faq-summary-reconnect {
          border-radius: var(--r-sm) var(--r-sm) 0 0;
          background: oklch(96% 0.03 315);
        }
        .faq-body-reconnect {
          padding: 15px 20px 18px;
          background: oklch(94% 0.04 315);
          border: 1px solid oklch(82% 0.05 315);
          border-top: none;
          border-radius: 0 0 var(--r-sm) var(--r-sm);
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 9 · PARTNERS & COORDINATION
   ═══════════════════════════════════════════════════════════════════════════ */

function PartnersSection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ marginBottom: 44 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Партньорства" : "Partnerships"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg"
              ? "Партньори, екип и координация"
              : "Partners, team, and coordination"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
          }}
          className="partners-grid"
        >
          {/* Orgachim */}
          <div className="card" style={{ padding: "30px 26px" }}>
            {/* TODO: Replace icon with Orgachim logo: /assets/images/partners/orgachim-logo.svg */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--r-md)",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                color: "var(--plum-mid)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div className="label-tag" style={{ marginBottom: 8 }}>
              {lang === "bg" ? "Технически партньор" : "Technical partner"}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--plum)",
                marginBottom: 12,
              }}
            >
              Оргахим
            </h3>
            <p style={{ fontSize: "0.88rem", marginBottom: 18 }}>
              {lang === "bg"
                ? "Оргахим ще подкрепи проекта с нужните инструменти и материали за реализацията."
                : "Orgachim will support the project with the tools and materials needed for implementation."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <a
                href="https://www.orgachim.bg/bg/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--caramel)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "underline")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
                    "none")
                }
              >
                {lang === "bg" ? "Сайт на Оргахим" : "Orgachim website"}{" "}
                <IconExternal />
              </a>
              <a
                href="https://corporate.orgachim.bg/bg/blog/proekt-gradoobitateli/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--text-soft)",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--plum)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-soft)")
                }
              >
                {lang === "bg"
                  ? "Градски арт проект с Оргахим"
                  : "Urban art project example"}{" "}
                <IconExternal />
              </a>
            </div>
          </div>

          {/* Artist team */}
          {/* TODO: Replace with final artist/team names and links when confirmed. */}
          <div
            className="card"
            style={{
              padding: "30px 26px",
              borderStyle: "dashed",
              opacity: 0.9,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--r-md)",
                background: "var(--plum-lt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                color: "var(--plum-mid)",
              }}
            >
              <IconUsers />
            </div>
            <div className="label-tag" style={{ marginBottom: 8 }}>
              {lang === "bg" ? "Изпълнение на дизайна" : "Design execution"}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--plum)",
                marginBottom: 12,
              }}
            >
              {lang === "bg" ? "Артистичен екип" : "Artist team"}
            </h3>
            <p style={{ fontSize: "0.88rem", fontStyle: "italic", margin: 0 }}>
              {lang === "bg"
                ? "Рисунката ще бъде разработена и изпълнена с помощта на артистичен екип. Детайли се публикуват след финално потвърждение."
                : "The artwork will be developed and executed with the help of an artist team. Details will be published after final confirmation."}
            </p>
          </div>

          {/* Central District */}
          <div
            className="card"
            style={{
              padding: "30px 26px",
              borderStyle: "dashed",
              opacity: 0.9,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--r-md)",
                background: "oklch(92% 0.04 220)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                color: "oklch(42% 0.1 220)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div
              className="label-tag"
              style={{ marginBottom: 8, color: "oklch(42% 0.1 220)" }}
            >
              {lang === "bg"
                ? "Предстояща координация"
                : "Pending coordination"}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--plum)",
                marginBottom: 12,
              }}
            >
              {lang === "bg" ? 'Район „Централен"' : "Central District"}
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              {lang === "bg"
                ? "Следващата важна стъпка е официална координация. До съгласуване проектът остава в подготвителна фаза."
                : "The next important step is official coordination. Until approval, the project remains in preparation."}
            </p>
            <a
              href="https://plovdivcentral.org/kontakti/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--text-soft)",
                fontSize: "0.8rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--plum)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--text-soft)")
              }
            >
              {lang === "bg"
                ? 'Контакти на Район „Централен"'
                : "Central District contacts"}{" "}
              <IconExternal />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .partners-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .partners-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 10 · WHAT HAPPENS NEXT
   ═══════════════════════════════════════════════════════════════════════════ */

function WhatNextSection({ lang }: { lang: Lang }) {
  const steps =
    lang === "bg"
      ? [
          "Съгласуване с общината",
          "Одобрение на дизайна",
          "Подготовка на мястото",
          "Реализация",
          "Публикуване на резултати",
        ]
      : ["Coordination", "Final design", "Site preparation", "Execution"];
  const stepCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [equalCardHeight, setEqualCardHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateEqualCardHeight = () => {
      stepCardRefs.current = stepCardRefs.current.slice(0, steps.length);
      const tallest = Math.max(
        ...stepCardRefs.current.map((el) => (el ? el.scrollHeight : 0)),
        0,
      );
      setEqualCardHeight(tallest > 0 ? tallest : null);
    };

    updateEqualCardHeight();
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateEqualCardHeight)
        : null;
    stepCardRefs.current.forEach((el) => {
      if (el) resizeObserver?.observe(el);
    });
    window.addEventListener("resize", updateEqualCardHeight);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateEqualCardHeight);
    };
  }, [lang, steps.length]);

  return (
    <section
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(52px, 6vw, 80px)",
        paddingBottom: "clamp(52px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "center",
          }}
          className="whats-next-grid"
        >
          <div>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {lang === "bg" ? "Следващи стъпки" : "Next steps"}
            </div>
            <h2 className="heading-lg">
              {lang === "bg" ? "Какво следва" : "What happens next"}
            </h2>
          </div>
          <div
            style={{ display: "flex", alignItems: "stretch" }}
            className="next-steps-flow gap-y-3 gap-x-0"
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 0 }}
                className="grow"
              >
                <div
                  ref={(el) => {
                    stepCardRefs.current[i] = el;
                  }}
                  style={{
                    background: i === 0 ? "var(--plum)" : "var(--surface)",
                    border: `2px solid ${i === 0 ? "var(--plum)" : "var(--border)"}`,
                    borderRadius: "var(--r-sm)",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: equalCardHeight ? `${equalCardHeight}px` : undefined,
                    textAlign: "center",
                  }}
                  className="grow"
                >
                  <div
                    style={{
                      padding: "14px 18px 8px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: i === 0 ? "var(--caramel)" : "var(--text-soft)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 18px 14px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: i === 0 ? "white" : "var(--plum)",
                        lineHeight: 1.3,
                      }}
                    >
                      {step}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 20,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                    className="max-[800px]:hidden!"
                  >
                    <svg width="20" height="12" viewBox="0 0 20 12">
                      <path
                        d="M0 6 L14 6 M8 1 L14 6 L8 11"
                        stroke="var(--border)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .whats-next-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 800px) { .next-steps-flow { flex-direction: column !important; align-items: stretch !important; } .next-steps-flow > div > div[aria-hidden="true"] { display: none; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 11 · LONG-TERM VISION
   ═══════════════════════════════════════════════════════════════════════════ */

function LongTermSection({ lang }: { lang: Lang }) {
  return (
    <section
      style={{
        background:
          "linear-gradient(160deg, var(--plum) 0%, oklch(28% 0.08 305) 100%)",
        color: "white",
        paddingTop: "clamp(64px, 7vw, 96px)",
        paddingBottom: "clamp(64px, 7vw, 96px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "oklch(88% 0.06 315 / 0.08)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "oklch(76% 0.12 52 / 0.1)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <HillSVG opacity={0.06} fill="white" variant={2} />

      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
          className="longterm-grid"
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(85% 0.08 315)",
                marginBottom: 14,
              }}
            >
              {lang === "bg" ? "Дългосрочна визия" : "Long-term vision"}
            </div>
            <h2
              className="heading-lg"
              style={{ color: "white", marginBottom: 18 }}
            >
              {lang === "bg" ? "След Бунарджика" : "After Bunardzhika"}
            </h2>
            <p
              style={{
                color: "oklch(84% 0.04 310)",
                maxWidth: 560,
                fontSize: "1rem",
                lineHeight: 1.78,
              }}
            >
              {lang === "bg"
                ? "RE-CONNECT БУНАРДЖИКА е пилотната стъпка. Дългосрочната ни цел е да изградим модел, в който продукт, кампании, партньори и младежка активност работят за по-добри градски пространства в Пловдив."
                : "RE-CONNECT BUNARDZHIKA is the pilot step. Our long-term goal is to build a model where a product, campaigns, partners, and youth action work together for better urban spaces in Plovdiv."}
            </p>
          </div>

          {/* Future idea card */}
          <div
            className="longterm-card"
            style={{
              background: "oklch(40% 0.07 315)",
              borderRadius: "var(--r-lg)",
              padding: "28px 26px",
              minWidth: 240,
              maxWidth: 280,
              border: "1px solid oklch(46% 0.07 315)",
            }}
          >
            <span
              style={{
                background: "oklch(48% 0.09 315)",
                borderRadius: 100,
                padding: "4px 13px",
                fontSize: "0.67rem",
                fontWeight: 700,
                color: "oklch(84% 0.06 315)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: 16,
              }}
            >
              {lang === "bg" ? "Бъдеща идея" : "Future idea"}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--caramel)",
                marginBottom: 12,
              }}
            >
              TEPE Connect
            </h3>
            <p
              style={{
                color: "oklch(78% 0.04 310)",
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: 1.65,
              }}
            >
              {lang === "bg"
                ? "Идея за информационна инфраструктура с табели за превенция на пожари и замърсяване, както и важни контакти при спешни ситуации."
                : "An idea for informational infrastructure with signs for fire and pollution prevention, as well as important emergency contacts."}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .longterm-grid { grid-template-columns: 1fr !important; } .longterm-card { max-width: 100% !important; min-width: auto !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 12 · HOW TO SUPPORT
   ═══════════════════════════════════════════════════════════════════════════ */

function HowToSupportSection({ lang }: { lang: Lang }) {
  const cards = [
    {
      icon: <IconShop />,
      iconBg: "var(--plum)",
      title: lang === "bg" ? "Поръчай ТЕПЕ bite" : "Order ТЕПЕ bite",
      text:
        lang === "bg"
          ? "Подкрепяш модела чрез продукта."
          : "You support the model through the product.",
    },
    {
      icon: <IconShare />,
      iconBg: "var(--caramel)",
      title: lang === "bg" ? "Сподели инициативата" : "Share the initiative",
      text:
        lang === "bg"
          ? "Помагаш повече хора и партньори да научат за проекта."
          : "You help more people and partners learn about the project.",
    },
    {
      icon: <IconHandshake />,
      iconBg: "var(--plum)",
      title:
        lang === "bg" ? "Свържи ни с партньор" : "Connect us with a partner",
      text:
        lang === "bg"
          ? "Ако познаваш организация, артист или компания, която може да помогне — пиши ни."
          : "If you know an organization, artist, or company that can help — contact us.",
    },
    {
      icon: <IconEye />,
      iconBg: "var(--caramel)",
      title: lang === "bg" ? "Следи напредъка" : "Follow the progress",
      text:
        lang === "bg"
          ? "Показваме какво е направено и какво предстои."
          : "We show what has been done and what comes next.",
    },
  ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ marginBottom: 48 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {lang === "bg" ? "Участие" : "Participation"}
          </div>
          <h2 className="heading-lg">
            {lang === "bg" ? "Как можеш да помогнеш" : "How you can help"}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
          className="support-cards"
        >
          {cards.map(({ icon, iconBg, title, text }, i) => (
            <div
              key={i}
              className="card card-hover"
              style={{ padding: "28px 22px" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: iconBg,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--plum)",
                  marginBottom: 10,
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .support-cards { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px) { .support-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 13 · FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function CTASection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{
        background:
          "linear-gradient(135deg, oklch(62% 0.16 52) 0%, oklch(58% 0.17 40) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          opacity: 0.08,
          pointerEvents: "none",
        }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z"
          fill="white"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: -50,
          left: "50%",
          transform: "translateX(-50%)",
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "oklch(72% 0.12 52 / 0.2)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <div
        className="section-inner"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <h2 className="heading-lg" style={{ color: "white", marginBottom: 16 }}>
          {lang === "bg"
            ? "Стани част от първата стъпка."
            : "Be part of the first step."}
        </h2>
        <p
          style={{
            color: "oklch(97% 0.012 52)",
            maxWidth: 520,
            margin: "0 auto 36px",
            fontSize: "1.03rem",
            lineHeight: 1.72,
          }}
        >
          {lang === "bg"
            ? "Подкрепи ТЕПЕ bite, проследи RE-CONNECT БУНАРДЖИКА и помогни една младежка идея от Пловдив да се превърне в реална промяна."
            : "Support ТЕПЕ bite, follow RE-CONNECT BUNARDZHIKA, and help a youth-led idea from Plovdiv become real change."}
        </p>

        {/* Small "still have questions?" line */}
        <p
          style={{
            color: "oklch(92% 0.06 52)",
            fontSize: "0.85rem",
            marginBottom: 28,
          }}
        >
          {lang === "bg" ? "Все още имаш въпроси? " : "Still have questions? "}
          <a
            href="mailto:tepe@mail.bg"
            style={{
              color: "white",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            {lang === "bg" ? "Пиши ни." : "Write to us."}
          </a>
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/#order"
            className="btn"
            style={{ background: "var(--plum)", color: "white" }}
          >
            <IconShop />
            {lang === "bg" ? "Поръчай ТЕПЕ bite" : "Order ТЕПЕ bite"}
          </a>
          <a
            href="/"
            className="btn"
            style={{
              background: "white",
              color: "oklch(44% 0.14 52)",
              fontWeight: 700,
            }}
          >
            {lang === "bg" ? "Виж продукта" : "See the product"}
          </a>
          <a
            href="mailto:tepe@mail.bg"
            className="btn"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          >
            {lang === "bg" ? "Свържи се с нас" : "Contact us"}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function InitiativesClient() {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <HeroSection lang={lang} />
      <IntroSection lang={lang} />
      <ModelSection lang={lang} />
      <GeneralFAQSection lang={lang} />
      <TransitionSection lang={lang} />
      <FeaturedInitiativeSection lang={lang} />
      <ProgressSection lang={lang} />
      <ReconnectFAQSection lang={lang} />
      <PartnersSection lang={lang} />
      <WhatNextSection lang={lang} />
      <LongTermSection lang={lang} />
      <HowToSupportSection lang={lang} />
      <CTASection lang={lang} />
    </>
  );
}
