"use client";

import { IconArrow, IconInfo, IconInsta, IconShop } from "@/components/icons";
import ImpactPledge, { PledgeHeart } from "@/components/ImpactPledge";
import FocusDeepDive from "@/components/public/FocusDeepDive";
import InitiativeCard from "@/components/public/InitiativeCard";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import {
  CategoryChip,
  CompletedDateBadge,
  StatusBadge,
  YouthBadge,
  pick,
  PARTNERSHIP_TYPE_LABELS,
} from "@/components/public/impactUi";
import { IMPACT } from "@/lib/config/impact";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { formatMoneyEUR } from "@/lib/money";
import type { InitiativeDetail, OverviewData } from "@/lib/public/initiatives";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/tepe.bite/";
const proposeHref = IMPACT.formUrl || `mailto:${IMPACT.contactEmail}`;

/* ─── Icons ───────────────────────────────────────────────────────────────── */

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
const IconBuilding = () => (
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
    <path d="M3 21h18" />
    <path d="M5 21V8l7-4 7 4v13" />
    <path d="M9 21v-5h6v5" />
    <path d="M9 11h.01M15 11h.01" />
  </svg>
);
const IconBulb = () => (
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
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);
const IconCoins = () => (
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
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);
const IconList = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
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
/* engine-step icons (size 20) */
const IconTarget = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);
const IconPartners = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCoinsSm = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88l.7.71-2.82 2.82" />
  </svg>
);
const IconReport = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

/* ─── Hill SVG motif ──────────────────────────────────────────────────────── */

function HillSVG({
  opacity = 0.06,
  fill = "var(--plum)",
}: {
  opacity?: number;
  fill?: string;
}) {
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
        zIndex: 0,
      }}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z"
        fill={fill}
      />
    </svg>
  );
}

/* ─── Repeat note (shown on 2nd+ appearance of the same initiative) ───────── */

function RepeatNote({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <div
      style={{
        marginTop: 20,
        maxWidth: 640,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: "var(--surface2)",
        border: "1px dashed var(--border)",
        borderRadius: "var(--r-sm)",
        padding: "12px 16px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          color: "var(--caramel)",
          flexShrink: 0,
          marginTop: 1,
          display: "inline-flex",
        }}
      >
        <IconInfo size={16} />
      </span>
      <p
        style={{
          margin: 0,
          fontSize: "0.82rem",
          lineHeight: 1.55,
          color: "var(--text-soft)",
        }}
      >
        {bg
          ? "Току-що започнахме — предстоят още много инициативи. Виждате една и съща инициатива на повече места, защото историята ни е все още малка, а искаме да покажем нагледно това, което описваме."
          : "We've only just started — many more initiatives are on the way. You're seeing the same initiative in more than one place because our track record is still small, and we'd rather show than just tell."}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 · HERO — headline + dynamic focus card
   ═══════════════════════════════════════════════════════════════════════════ */

const HERO_EYEBROW: Record<
  InitiativeDTO["status"],
  { bg: string; en: string; pulse: boolean }
> = {
  in_progress: { bg: "Текущ фокус", en: "Current focus", pulse: true },
  done: { bg: "Наскоро реализирано", en: "Recently delivered", pulse: false },
  planned: { bg: "Предстои", en: "Coming up", pulse: false },
  frozen: { bg: "Инициатива", en: "Initiative", pulse: false },
};

function HeroSection({
  lang,
  heroPick,
}: {
  lang: Lang;
  heroPick: InitiativeDTO | null;
}) {
  const bg = lang === "bg";
  const hasCard = Boolean(heroPick);

  return (
    <section
      id="impact-hero"
      style={{
        minHeight: "64vh",
        background:
          "radial-gradient(ellipse 70% 50% at 35% 30%, oklch(88% 0.05 315 / 0.28), transparent), var(--bg)",
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
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: hasCard ? "1fr auto" : "1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
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
                  {bg
                    ? "Инициативи с видими резултати"
                    : "Initiatives with visible results"}
                </span>
                <span
                  style={{
                    background: "var(--sky-lt)",
                    border: "1px solid oklch(85% 0.06 230)",
                    borderRadius: 100,
                    padding: "5px 14px",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "var(--sky-dk)",
                  }}
                >
                  {bg ? "Пълна прозрачност" : "Complete transparency"}
                </span>
              </div>

              <h1
                className="heading-xl text-4xl!"
                style={{ maxWidth: 630, marginBottom: 20 }}
              >
                {bg
                  ? "От Пловдивчани. За Пловдив."
                  : "From Plovdivchani. For Plovdiv."}
              </h1>

              <p
                className="text-justify"
                style={{
                  fontSize: "clamp(0.97rem, 1.4vw, 1.08rem)",
                  maxWidth: 630,
                  marginBottom: 28,
                  lineHeight: 1.72,
                }}
              >
                {bg
                  ? "Реализираме социални проекти с видим и дългосрочен резултат в Пловдив - проекти забележими от Пловдивчани. Закупувайки продукта ставаш част от нашата активност: с всяка твоя покупка допринасяш с 15 цента за фонда към ТЕПЕ bite Impact. Ние умножаваме събраните средства чрез партньорства и спонсори. Отчитаме всяко евро от фонда и държим процеса по реализация на инициативите ни прозрачен."
                  : "We implement social projects with visible and long-term results in Plovdiv - projects that are noticeable to Plovdivchani. By purchasing the product, you become part of our activity: with every purchase, you contribute 15 cents to the ТЕПЕ bite Impact fund. We multiply the collected funds through partnerships and sponsorships. We account for every euro from the fund and keep the process of implementing our initiatives transparent."}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "stretch",
                }}
              >
                <Link
                  href="/initiatives"
                  className="btn btn-primary max-sm:text-[0.72rem]! max-sm:px-8! max-[1200px]:w-full! justify-center"
                >
                  {bg ? "Виж инициативите ни" : "Explore an initiative"}{" "}
                  <IconArrow />
                </Link>
                <ImpactPledge
                  variant="chip"
                  href="#instrument"
                  className="max-[1200px]:w-full! max-[1200px]:justify-center!"
                />
              </div>
            </div>
          </div>

          {/* Dynamic focus card */}
          {heroPick && <HeroFocusCard initiative={heroPick} lang={lang} />}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-focus-card { max-width: 640px !important; min-width: auto !important; }
        }
      `}</style>
    </section>
  );
}

function HeroFocusCard({
  initiative,
  lang,
}: {
  initiative: InitiativeDTO;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const eyebrow = HERO_EYEBROW[initiative.status];
  const title = pick(lang, initiative.titleBg, initiative.titleEn);
  const desc = pick(lang, initiative.descriptionBg, initiative.descriptionEn);

  return (
    <div className="flex max-[1200px]:w-full justify-center w-fit">
      <Link
        href={`/initiatives/${initiative.slug}`}
        className="hero-focus-card card-hover cursor-pointer block"
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          padding: "26px 24px",
          minWidth: 260,
          maxWidth: 350,
          width: "100%",
          textDecoration: "none",
          color: "inherit",
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
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--caramel)",
              animation: eyebrow.pulse ? "pulse-dot 2s infinite" : undefined,
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
            {bg ? eyebrow.bg : eyebrow.en}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--plum)",
            marginBottom: 10,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {desc && (
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.6,
              margin: "0 0 16px",
              color: "var(--text-mid)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {desc}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          {initiative.status === "done" ? (
            <CompletedDateBadge
              dateISO={initiative.completionDateISO}
              lang={lang}
              tone="green"
            />
          ) : (
            <StatusBadge status={initiative.status} lang={lang} />
          )}
          {initiative.category && (
            <CategoryChip category={initiative.category} lang={lang} />
          )}
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--caramel)",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          {bg ? "Виж детайли" : "See details"} →
        </span>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 · What initiatives we choose — 4 characteristic cards + proof
   ═══════════════════════════════════════════════════════════════════════════ */

function WhatWeChooseSection({
  lang,
  reconnect,
  showRepeat,
}: {
  lang: Lang;
  reconnect: InitiativeDetail | null;
  showRepeat: boolean;
}) {
  const bg = lang === "bg";
  const cards = [
    {
      icon: <IconBrush />,
      color: "var(--plum)",
      chip: "var(--plum-lt)",
      title: bg ? "Обновяваме обществени места" : "We renew public spaces",
      copy: bg
        ? "Връщаме живот на занемарени градски кътове — така че хората да ги усетят като свои."
        : "We bring neglected corners of the city back to life — so people feel them as their own.",
    },
    {
      icon: <IconUsers />,
      color: "oklch(44% 0.14 52)",
      chip: "var(--caramel-lt)",
      title: bg ? "Задвижваме младежко действие" : "We power youth action",
      copy: bg
        ? "Каним младежки организации да съорганизират видими инициативи за града."
        : "We invite youth-led organisations to co-run visible initiatives for the city.",
    },
    {
      icon: <IconBuilding />,
      color: "var(--sky-dk)",
      chip: "var(--sky-lt)",
      title: bg ? "Работим с общините" : "We work with the municipality",
      copy: bg
        ? "Заедно с институциите намираме реалните проблеми, които заслужават решение."
        : "Together with the institutions we pinpoint the real problems worth solving.",
    },
    {
      icon: <IconBulb />,
      color: "oklch(40% 0.1 150)",
      chip: "oklch(93% 0.04 150)",
      title: bg ? "Отворени сме за предложения" : "We're open to your ideas",
      copy: bg
        ? "Всеки може да предложи място или кауза — следващата инициатива може да е твоя."
        : "Anyone can suggest a place or a cause — the next initiative could be yours.",
    },
  ];

  return (
    <section
      className="section-spacing"
      style={{
        background:
          "linear-gradient(180deg, var(--plum-lt) 0%, var(--surface) 100%)",
      }}
    >
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 36 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Какви инициативи избираме" : "The initiatives we choose"}
          </div>
          <h2
            className="heading-lg choose-h2"
            style={{ marginBottom: 16, whiteSpace: "nowrap" }}
          >
            {bg ? "Инициативи, които се виждат" : "Initiatives you can see"}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              margin: 0,
            }}
          >
            {bg
              ? "Избираме проекти за градско обновяване — намеси, които хората в Пловдив реално виждат, ползват и които клиентите ни разпознават като свои. Ето какво ги обединява."
              : "We choose urban-renewal projects — interventions people in Plovdiv genuinely see, use, and which our customers recognise as their own. Here's what they share."}
          </p>
        </div>

        <div
          className="choose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: reconnect
              ? "minmax(0, 1.05fr) minmax(0, 0.95fr)"
              : "1fr",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "stretch",
          }}
        >
          {/* Left column: 4 characteristic cards + brand logo below them */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 4 characteristic cards, 2×2 */}
            <div
              className="choose-cards"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="card"
                  style={{ padding: "22px 22px" }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: c.chip,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    {c.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "1.02rem",
                      fontWeight: 700,
                      color: "var(--plum)",
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      color: "var(--text-mid)",
                      margin: 0,
                    }}
                  >
                    {c.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Brand logo — bottom aligns with the proof card on desktop */}
            <div
              className="choose-logo"
              style={{
                flex: 1,
                minHeight: 200,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingTop: 8,
              }}
            >
              <Image
                src="/brand/TEPEbiteImpact-crop.png"
                alt="ТЕПЕ bite Impact"
                width={600}
                height={286}
                style={{
                  width: "auto",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                  objectPosition: "center bottom",
                }}
              />
            </div>
          </div>

          {/* Proof: the first initiative, tied to the copy */}
          {reconnect ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                className="label-tag"
                style={{
                  color: "var(--plum-mid)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 2,
                    background: "var(--caramel)",
                    borderRadius: 2,
                  }}
                />
                {bg ? "Нашата първа инициатива" : "Our first initiative"}
              </div>
              <InitiativeCard initiative={reconnect.initiative} lang={lang} />
              {showRepeat && <RepeatNote lang={lang} />}
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .choose-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .choose-h2 { white-space: normal !important; } }
        @media (max-width: 460px) { .choose-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 · How ТЕПЕ bite Impact works (dark plum, the instrument)
   ═══════════════════════════════════════════════════════════════════════════ */

function HowImpactWorksSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const steps = bg
    ? [
        {
          icon: <IconTarget />,
          title: "Избираме каузата",
          copy: "Инициатива с видим от Пловдивчани резултат.",
        },
        {
          icon: <IconPartners />,
          title: "Намираме партньори",
          copy: "Общини, фирми, младежки организации...",
        },
        {
          icon: <IconCoinsSm />,
          title: "Съфинансиране",
          copy: "Спонсори и партньори допринасят материално.",
        },
        {
          icon: <IconReport />,
          title: "Прозрачност",
          copy: "Какво обещахме, какво направихме, какво вложихме.",
        },
      ]
    : [
        {
          icon: <IconTarget />,
          title: "We choose the cause",
          copy: "Initiative with a visible result for Plovdivchani.",
        },
        {
          icon: <IconPartners />,
          title: "We find partners",
          copy: "Municipalities, companies, youth organisations..",
        },
        {
          icon: <IconCoinsSm />,
          title: "Co-funding",
          copy: "Sponsors and partners contribute materially.",
        },
        {
          icon: <IconReport />,
          title: "Transparency",
          copy: "What we promised, did, and put in.",
        },
      ];

  return (
    <section
      id="instrument"
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: 80,
      }}
    >
      {/* Bottom-left ТЕПЕ bite Impact logo, masked into the plum */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -24,
          bottom: -16,
          width: "min(46vw, 360px)",
          aspectRatio: "2.1 / 1",
          backgroundColor: "rgb(82, 51, 95)",
          maskImage: "url(/brand/TEPEbiteImpact-crop.png)",
          maskSize: "contain",
          maskPosition: "left bottom",
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(/brand/TEPEbiteImpact-crop.png)",
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "left bottom",
          WebkitMaskRepeat: "no-repeat",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: "18%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "oklch(74% 0.1 230 / 0.18)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <div
            className="label-tag"
            style={{ color: "oklch(82% 0.09 230)", marginBottom: 18 }}
          >
            {bg ? "Инструментът" : "The instrument"}
          </div>
          <div
            className="engine-lockup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <PledgeHeart size={68} fill="var(--caramel)" textColor="white" />
            <h2
              className="heading-lg"
              style={{
                color: "white",
                textAlign: "left",
                margin: 0,
                fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
                lineHeight: 1.15,
              }}
            >
              <span style={{ display: "block" }}>
                {bg ? "Със всяка покупка" : "With every purchase"}
              </span>
              <span style={{ display: "block", color: "var(--caramel)" }}>
                {bg ? "подпомагаш за нашия" : "you support our"}
                <span
                  style={{
                    fontFamily: "var(--font-brush)",
                    fontWeight: 1000,
                    color: "var(--caramel)",
                    lineHeight: 1,
                  }}
                >
                  {" "}
                  Impact
                </span>
              </span>
            </h2>
          </div>
          <p
            style={{
              color: "oklch(90% 0.03 310)",
              fontSize: "1.06rem",
              margin: "0 auto",
              maxWidth: 680,
            }}
          >
            {bg
              ? "Под името ТЕПЕ bite Impact реализираме цялата наша социална дейност. Във отделна компонента на фирмената сметка заделяме по 15 евро цента за всяко продадено барче. Събраните средства наричаме фондът ТЕПЕ bite Impact. С тях, с външни партньори, спонсори, организации и общини организираме социални инициативи със стойност в пъти по-голяма от събраната сума."
              : "Under the name ТЕПЕ bite Impact we run all our social activity. In a separate component of the company account we set aside 15 euro cents for every bar sold. The collected funds are called the ТЕПЕ bite Impact fund. With them, with external partners, sponsors, organisations and municipalities, we organise social initiatives with a value many times greater than the amount collected."}
          </p>
        </div>

        <div
          className="engine-steps"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            margin: "44px auto 0",
            maxWidth: 980,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                background: "oklch(38% 0.07 315 / 0.5)",
                border: "1px solid oklch(74% 0.1 230 / 0.25)",
                borderRadius: "var(--r-md)",
                padding: "22px 20px",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "oklch(74% 0.1 230 / 0.15)",
                  color: "oklch(85% 0.09 230)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "white",
                  marginBottom: 6,
                }}
              >
                {s.title}
              </div>
              <p
                style={{
                  color: "oklch(82% 0.03 310)",
                  fontSize: "0.85rem",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .engine-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) {
          .engine-lockup { flex-direction: column !important; gap: 12px !important; }
          .engine-lockup h2 { text-align: center !important; }
        }
        @media (max-width: 480px) { .engine-steps { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 · Responsibilities — the three players + legal-entity notice
   ═══════════════════════════════════════════════════════════════════════════ */

function ResponsibilitiesSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const players = [
    {
      icon: <IconShop />,
      color: "var(--plum)",
      chip: "var(--plum-lt)",
      logo: false,
      title: bg ? "Търговската дейност" : "The commercial side",
      copy: bg
        ? "Продава и разраства бранда. Всяка продажба добавя фиксираните 0.15 € към фонда — колкото повече барчета, толкова повече средства за инициативи."
        : "Sells and grows the brand. Every sale adds the fixed 0.15 € to the fund — the more bars, the more money for initiatives.",
    },
    {
      icon: <IconTarget />,
      color: "var(--sky-dk)",
      chip: "var(--sky-lt)",
      logo: true,
      title: "ТЕПЕ bite",
      copy: bg
        ? "Избира каузите, намира спонсори, партньори и общини, организира реализацията и поддържа сайта актуален за пълна прозрачност."
        : "Chooses the causes, finds sponsors, partners and municipalities, organises delivery, and keeps this site up to date for full transparency.",
    },
    {
      icon: <IconHandshake />,
      color: "oklch(44% 0.14 52)",
      chip: "var(--caramel-lt)",
      logo: false,
      title: bg ? "Партньорите" : "The partners",
      copy: bg
        ? "Подкрепят инициативите по договорен начин — с финансиране, материали, експертиза или труд. Централна част от модела ни."
        : "Support the initiatives in an agreed way — funding, materials, expertise or labour. A central part of our model.",
    },
  ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ maxWidth: 1000, marginBottom: 36 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Кой какво прави" : "Who does what"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg
              ? "Как е устроена социалната ни дейност"
              : "How our social activity is structured"}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              margin: 0,
            }}
          >
            {bg
              ? "За социалната ни дейност, ни трябва както комерсиалната част от бизнеса, така и партньорите на бранда, така и структурата отговорна за реализацията на инициативите."
              : "For our social activity, we need the commercial side of the business, the brand partners, and the structure responsible for implementing the initiatives."}
          </p>
        </div>

        <div
          className="players-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 28,
          }}
        >
          {players.map((p) => (
            <div
              key={p.title}
              className="card"
              style={{ padding: "28px 26px" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: p.chip,
                  color: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {p.icon}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  marginBottom: 10,
                }}
              >
                {p.title}
                {p.logo && (
                  <span
                    style={{
                      fontFamily: "var(--font-brush)",
                      fontWeight: 1000,
                      color: "var(--caramel)",
                      lineHeight: 1,
                    }}
                  >
                    {" "}
                    Impact
                  </span>
                )}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--text-mid)",
                  margin: 0,
                }}
              >
                {p.copy}
              </p>
            </div>
          ))}
        </div>

        {/* Single-legal-entity + NGO notice */}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            background: "var(--sky-lt)",
            borderLeft: "3px solid var(--sky-mid)",
            borderRadius: "var(--r-sm)",
            padding: "18px 22px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: "var(--sky-dk)",
              flexShrink: 0,
              marginTop: 1,
              display: "inline-flex",
            }}
          >
            <IconInfo size={18} />
          </span>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.65,
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "Търговската дейност и ТЕПЕ bite Impact работят под едно юридическо лице — ФИВОРА ООД. Управлението на две отделни организации носи правна и административна сложност, несъразмерна с мащаба ни днес. В близко бъдеще планираме да регистрираме НПО."
              : "The commercial activity and ТЕПЕ bite Impact operate under one legal entity — ФИВОРА ООД. Running two separate organisations carries legal and administrative complexity disproportionate to our scale today. We plan to register an NGO (НПО) in the near future."}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .players-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5b · More initiatives rail (chronological)
   ═══════════════════════════════════════════════════════════════════════════ */

function MoreInitiativesSection({
  items,
  lang,
}: {
  items: InitiativeDTO[];
  lang: Lang;
}) {
  const bg = lang === "bg";
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCards = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * 320 * 2, behavior: "smooth" });

  const showArrows = !(atStart && atEnd);
  const edgeMask = `linear-gradient(to right, ${atStart ? "black" : "transparent"} 0, black 32px, black calc(100% - 32px), ${atEnd ? "black" : "transparent"} 100%)`;

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--bg)", overflow: "hidden" }}
    >
      <div className="section-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 1000 }}>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "Още проекти" : "More projects"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 14 }}>
              {bg
                ? "Още от приноса ни за Пловдив"
                : "More of our contribution to Plovdiv"}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--text-mid)",
                margin: 0,
              }}
            >
              {bg
                ? "От планираните до вече завършените — това е нашето портфолио."
                : "From planned to already completed — this is our portfolio."}
            </p>
          </div>
          {showArrows && (
            <div style={{ display: "flex", gap: 10 }}>
              <RailArrow
                dir="prev"
                disabled={atStart}
                onClick={() => scrollByCards(-1)}
                label={bg ? "Назад" : "Back"}
              />
              <RailArrow
                dir="next"
                disabled={atEnd}
                onClick={() => scrollByCards(1)}
                label={bg ? "Напред" : "Forward"}
              />
            </div>
          )}
        </div>

        <div
          ref={scroller}
          className="rail-scroller"
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            overflowY: "visible",
            scrollSnapType: "x mandatory",
            paddingBottom: 6,
            scrollbarWidth: "none",
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                flex: "0 0 300px",
                width: 300,
                scrollSnapAlign: "start",
              }}
            >
              <InitiativeCard
                initiative={it}
                lang={lang}
                showPlannedBadge={it.status === "planned"}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <Link
            href="/initiatives"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--caramel)",
              fontWeight: 1000,
              fontSize: "0.92rem",
              textDecoration: "none",
              padding: "0px 8px",
              lineHeight: 0.9,
              borderLeft: "2px solid var(--caramel)",
            }}
          >
            {bg
              ? "Разбери повече за инициативите ни"
              : "Learn more about our initiatives"}{" "}
            →
          </Link>
        </div>
      </div>

      <style>{`
        .rail-scroller::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

function RailArrow({
  dir,
  disabled,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: disabled ? "var(--text-soft)" : "var(--plum)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontSize: "1.3rem",
        boxShadow: "var(--shadow)",
        transition: "opacity 0.2s, transform 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 · Transparency — „Показваме всичко"
   ═══════════════════════════════════════════════════════════════════════════ */

function TransparencySection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const points = [
    {
      icon: <IconCoins />,
      title: bg ? "Източниците на средствата" : "Where the money comes from",
      text: bg
        ? "Показваме откъде идва всяко евро, което влагаме — от фонда, от партньор или от външно финансиране."
        : "We show where every euro we invest comes from — the fund, a partner, or outside funding.",
    },
    {
      icon: <IconList />,
      title: bg ? "Постъпления и разходи" : "Inflows & outflows",
      text: bg
        ? "Проследяваме какво влиза и какво излиза от ТЕПЕ bite Impact за всяка инициатива."
        : "We track what goes into and out of ТЕПЕ bite Impact for each initiative.",
    },
    {
      icon: <IconHandshake />,
      title: bg ? "Как умножаваме ефекта" : "How we multiply impact",
      text: bg
        ? "Партньори, дарени материали и собствено действие превръщат всеки цент в повече от цент."
        : "Partners, donated materials, and our own work turn every cent into more than a cent.",
    },
  ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ maxWidth: 620, marginBottom: 40 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Прозрачност" : "Transparency"}
          </div>
          <h2
            className="heading-lg"
            style={
              { marginBottom: 16, textWrap: "balance" } as React.CSSProperties
            }
          >
            {bg ? "Показваме всичко" : "We show everything"}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "Нищо не остава скрито: показваме откъде идват средствата, които влагаме, какво постига ТЕПЕ bite Impact и как умножаваме неговия ефект."
              : "Nothing stays hidden: we show where the money we invest comes from, what ТЕПЕ bite Impact achieves, and how we multiply its effect."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {points.map((p) => (
            <div
              key={p.title}
              className="card"
              style={{ padding: "26px 24px" }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "var(--plum-lt)",
                  color: "var(--plum)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  marginBottom: 8,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  color: "var(--text-mid)",
                  margin: 0,
                }}
              >
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/initiatives" className="btn btn-primary">
            {bg ? "Виж целия регистър" : "See the full ledger"} <IconArrow />
          </Link>
          <Link
            href="/legal/initiative-transparency"
            className="btn btn-secondary"
          >
            {bg ? "Политика за прозрачност" : "Transparency policy"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 · Fiscal — the numbers behind the initiatives
   ═══════════════════════════════════════════════════════════════════════════ */

function FiscalSection({
  lang,
  stats,
}: {
  lang: Lang;
  stats: OverviewData["stats"];
}) {
  const bg = lang === "bg";
  const expensesTotal = stats.accountedExpensesTotalCents;
  const impactAll = stats.fundedImpactAllPhasesCents;
  const externalAll = stats.fundedExternalAllPhasesCents;
  const raisedTotal = impactAll + externalAll;
  const impactPct =
    raisedTotal > 0 ? Math.round((impactAll / raisedTotal) * 100) : 0;
  const externalPct = 100 - impactPct;
  const hasExpenses = expensesTotal > 0;
  const hasRaised = raisedTotal > 0;

  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--sky-lt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <HillSVG opacity={0.05} fill="var(--sky-dk)" />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 680, marginBottom: 40 }}>
          <div
            className="label-tag"
            style={{ marginBottom: 12, color: "var(--sky-dk)" }}
          >
            {bg ? "Финансова прозрачност" : "The numbers"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg
              ? "Числата зад инициативите"
              : "The numbers behind the initiatives"}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "Фондът не е отделно юридическо лице — водим го като ясно обособено перо. Числата тук идват директно от инициативите: какво реално сме вложили и колко сме набрали."
              : "The fund is not a separate legal entity — we keep it as a clearly ring-fenced line. These figures come straight from the initiatives: what we've actually invested and how much we've raised."}
          </p>
        </div>

        {/* Accounted expenses headline */}
        <div
          className="card"
          style={{
            padding: "clamp(28px, 4vw, 44px)",
            background: "var(--surface)",
          }}
        >
          <div
            className="fiscal-hero-row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: hasExpenses ? "flex-end" : "center",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            {hasExpenses ? (
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 10,
                  }}
                >
                  {bg
                    ? "Усчетоводени разходи за инициативи"
                    : "Accounted expenses for initiatives"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(2.8rem, 7vw, 4.2rem)",
                    fontWeight: 800,
                    color: "var(--plum)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatMoneyEUR(expensesTotal)}
                </div>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-mid)",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                {bg
                  ? "Първите средства тепърва тръгват към инициативите. Щом похарчим за проект, разходите се появяват тук — открито и с доказателство."
                  : "The first money is only just heading to initiatives. As soon as we spend on a project, expenses show up here — openly and with proof."}
              </p>
            )}
            <Link
              href="/initiatives"
              className="btn btn-sky"
              style={{ flexShrink: 0 }}
            >
              {bg ? "Разгледай въздействието ни" : "Explore our impact"}
              <IconArrow />
            </Link>
          </div>
        </div>

        {/* Outside-funding narrative + combined funding card */}
        {hasRaised && (
          <div style={{ marginTop: 28 }}>
            <div style={{ maxWidth: 680, marginBottom: 20 }}>
              <div
                className="label-tag"
                style={{ marginBottom: 10, color: "var(--sky-dk)" }}
              >
                {bg ? "Външно финансиране" : "Outside funding"}
              </div>
              <p
                style={{
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                  color: "var(--text-mid)",
                  margin: 0,
                }}
              >
                {bg
                  ? "Стремим се основната част от финансирането на инициативите да идва от външни източници — спонсори и партньори — а не само от фонда. Така всеки цент от ТЕПЕ bite Impact върши повече."
                  : "We aim for the bulk of initiative funding to come from outside sources — sponsors and partners — not the fund alone. That way every cent of ТЕПЕ bite Impact does more."}
              </p>
            </div>

            <div
              className="card"
              style={{
                padding: "clamp(24px, 3.5vw, 38px)",
                background: "var(--surface)",
              }}
            >
              <div
                className="fiscal-funds-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "clamp(20px, 4vw, 44px)",
                  marginBottom: 26,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-soft)",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "var(--sky-mid)",
                        flexShrink: 0,
                      }}
                    />
                    {bg ? "Фонд ТЕПЕ bite Impact" : "ТЕПЕ bite Impact fund"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
                      fontWeight: 800,
                      color: "var(--plum)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatMoneyEUR(impactAll)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-soft)",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "var(--caramel)",
                        flexShrink: 0,
                      }}
                    />
                    {bg ? "Партньори и външни" : "Partners & external"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
                      fontWeight: 800,
                      color: "var(--plum)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatMoneyEUR(externalAll)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  height: 12,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--border)",
                }}
                role="img"
                aria-label={
                  bg
                    ? `Разпределение: фонд ${impactPct}%, външни ${externalPct}%`
                    : `Split: fund ${impactPct}%, external ${externalPct}%`
                }
              >
                <div
                  style={{
                    width: `${impactPct}%`,
                    background: "var(--sky-mid)",
                  }}
                />
                <div
                  style={{
                    width: `${externalPct}%`,
                    background: "var(--caramel)",
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  margin: "18px 0 0",
                }}
              >
                {bg
                  ? `Общо набрани ${formatMoneyEUR(raisedTotal)} за социалните ни инициативи`
                  : `${formatMoneyEUR(raisedTotal)} raised in total for our social initiatives`}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--text-soft)",
                  margin: "8px 0 0",
                }}
              >
                {bg
                  ? "Това са всички средства — налични, осигурени и планирани — които сме привлекли или заделили за инициативите: от фонд ТЕПЕ bite Impact и от външни източници. Разликата между двете числа показва колко от подкрепата идва отвън."
                  : "These are all the funds — available, arranged and planned — we've secured or set aside for initiatives: from the ТЕПЕ bite Impact fund and from outside sources. The gap between the two figures shows how much of the support comes from outside."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .fiscal-hero-row { flex-direction: column; align-items: flex-start !important; }
          .fiscal-funds-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 · FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function FAQSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const items = bg
    ? [
        {
          q: "Защо точно 0.15 €?",
          a: "Това е фиксирана сума от всяко продадено барче — ясна, проследима и еднаква за всеки. Предпочитаме твърдо обещание пред неясен процент.",
        },
        {
          q: "Регистрирана благотворителна организация ли е ТЕПЕ bite Impact?",
          a: "Не в класическия смисъл. Търговската дейност и ТЕПЕ bite Impact работят под едно юридическо лице — ФИВОРА ООД. Като малка фирма засега водим средствата на фонда като ясно обособено и внимателно проследявано перо и ги използваме точно както е обявено. С разрастването ни планираме отделна сметка и регистрация на НПО.",
        },
        {
          q: "Как се харчат парите?",
          a: "Обединяваме средствата, избираме конкретна кауза за Пловдив, намираме партньори и съфинансиране, реализираме и отчитаме какво сме вложили.",
        },
        {
          q: "Приемате ли дарения?",
          a: "Засега не. Работим единствено чрез партньорства. Приемането на дарения е в плановете ни, но все още не е възможно поради правни усложнения — ще го въведем веднага щом законово можем.",
        },
        {
          q: "Ще има ли отчети?",
          a: "Да. Обявяваме публично събраните средства, избраните каузи и напредъка по всяка стъпка — какво обещахме, какво направихме и какво вложихме.",
        },
      ]
    : [
        {
          q: "Why exactly 0.15 €?",
          a: "It's a fixed amount from every bar sold — clear, traceable, and the same for everyone. We prefer a firm promise over a vague percentage.",
        },
        {
          q: "Is ТЕПЕ bite Impact a registered charity?",
          a: "Not in the classic sense. The commercial activity and ТЕПЕ bite Impact operate under one legal entity — ФИВОРА ООД. As a small company we currently track the fund as a clearly ring-fenced, carefully monitored line and use it exactly as stated. As we grow, we plan a separate account and to register an NGO.",
        },
        {
          q: "How is the money spent?",
          a: "We pool the funds, choose a concrete cause for Plovdiv, find partners and co-funding, execute, and report what we put in.",
        },
        {
          q: "Do you accept donations?",
          a: "Not yet. We work solely through partnerships. Accepting donations is part of our plans, but is not yet possible due to legal complications — we'll introduce it the moment we legally can.",
        },
        {
          q: "Will there be reports?",
          a: "Yes. We publicly announce the funds collected, the causes chosen, and progress at every step — what we promised, did, and put in.",
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
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              FAQ
            </div>
            <h2 className="heading-lg">
              {bg ? "Често задавани въпроси" : "Frequently asked questions"}
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
          padding: 15px 20px; cursor: pointer; font-weight: 600; font-size: 0.93rem;
          color: var(--plum); background: var(--surface); border-radius: var(--r-sm);
          border: 1px solid var(--border); list-style: none; display: flex;
          justify-content: space-between; align-items: center; gap: 12px;
          user-select: none; transition: background 0.18s;
        }
        .faq-light .faq-summary-light::-webkit-details-marker { display: none; }
        .faq-light .faq-summary-light:hover { background: var(--plum-lt); }
        .faq-light.faq-item { border-radius: var(--r-sm); }
        .faq-light details[open] .faq-summary-light,
        .faq-light[open] .faq-summary-light {
          border-radius: var(--r-sm) var(--r-sm) 0 0; background: var(--plum-lt);
        }
        .faq-body-light {
          padding: 15px 20px 18px; background: var(--plum-lt);
          border: 1px solid var(--border); border-top: none;
          border-radius: 0 0 var(--r-sm) var(--r-sm);
        }
        .faq-plus { font-size: 1.25rem; color: var(--caramel); flex-shrink: 0; font-weight: 300; transition: transform 0.2s; }
        details[open] .faq-plus { transform: rotate(45deg); }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 9 · Partners — why & how we partner (before the carousel)
   ═══════════════════════════════════════════════════════════════════════════ */

function PartnersIntroSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const types: { key: keyof typeof PARTNERSHIP_TYPE_LABELS; desc: string }[] = [
    {
      key: "sponsor",
      desc: bg
        ? "Осигуряват финансиране за инициативата."
        : "Provide funding for the initiative.",
    },
    {
      key: "technical",
      desc: bg
        ? "Дават експертиза, инструменти или материали."
        : "Contribute expertise, tools, or materials.",
    },
    {
      key: "executional",
      desc: bg
        ? "Помагат с реалното изпълнение на терен."
        : "Help with hands-on delivery on the ground.",
    },
    {
      key: "institutional",
      desc: bg
        ? "Осигуряват достъп, съгласуване и легитимност."
        : "Provide access, approvals, and legitimacy.",
    },
  ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 32 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Партньори" : "Partners"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg ? "Заедно постигаме повече" : "Together we go further"}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "ТЕПЕ bite работи с партньори, за да създава въздействие с по-висока стойност — повече, отколкото един бранд може да постигне сам."
              : "ТЕПЕ bite works with partners to create higher-value impact — more than any one brand can achieve alone."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {types.map(({ key, desc }) => (
            <div key={key} className="card" style={{ padding: "20px 22px" }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.02rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  marginBottom: 8,
                }}
              >
                {bg
                  ? PARTNERSHIP_TYPE_LABELS[key].bg
                  : PARTNERSHIP_TYPE_LABELS[key].en}
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  lineHeight: 1.55,
                  color: "var(--text-mid)",
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Minimalist youth-led sub-section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(14px, 3vw, 24px)",
            flexWrap: "wrap",
            padding: "clamp(18px, 2.5vw, 26px) clamp(20px, 3vw, 28px)",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border)",
            background: "var(--plum-lt)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "var(--surface)",
              color: "var(--plum)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconUsers />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--plum)",
                  margin: 0,
                }}
              >
                {bg
                  ? "Подкрепяме младежки организации"
                  : "We support youth-led organisations"}
              </h3>
              <YouthBadge lang={lang} compact />
            </div>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "var(--text-mid)",
                margin: 0,
              }}
            >
              {bg
                ? "Насърчаваме младежката инициативност, като даваме на младежки организации възможност да участват в организирането на видими инициативи за града. Разпознайте ги по значката по-долу."
                : "We encourage youth initiative by giving youth-led organisations a chance to help organise visible initiatives for the city. Spot them by the badge below."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 10 · Firms invite (minimalist)
   ═══════════════════════════════════════════════════════════════════════════ */

function FirmsInviteSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const subject = encodeURIComponent(
    bg
      ? "Партньорство с ТЕПЕ bite Impact"
      : "Partnership with ТЕПЕ bite Impact",
  );
  const body = encodeURIComponent(
    bg
      ? "Здравейте,\n\nПредставляваме фирма, която иска да подкрепи инициатива на ТЕПЕ bite. Ето какво можем да предложим:\n\n"
      : "Hello,\n\nWe're a company that would like to support a ТЕПЕ bite initiative. Here's what we can offer:\n\n",
  );
  const mailto = `mailto:${IMPACT.contactEmail}?subject=${subject}&body=${body}`;

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div
        className="section-inner"
        style={{
          maxWidth: 720,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="section-divider" />
        <div className="label-tag" style={{ marginBottom: 14 }}>
          {bg ? "За фирми" : "For companies"}
        </div>
        <h2 className="heading-lg" style={{ marginBottom: 16 }}>
          {bg
            ? "Създайте видима промяна за Пловдив — заедно с нас."
            : "Create visible change for Plovdiv — together with us."}
        </h2>
        <p
          style={{
            fontSize: "1.02rem",
            lineHeight: 1.7,
            color: "var(--text-mid)",
            margin: "0 0 26px",
            maxWidth: 540,
          }}
        >
          {bg
            ? "Спонсорство, материали, експертиза или реализация на терен — партньорствата са в основата на модела ни."
            : "Sponsorship, materials, expertise or hands-on delivery — partnerships are the core of our model."}
        </p>
        <a href={mailto} className="btn btn-secondary">
          {bg ? "Станете партньор" : "Become a partner"} <IconArrow />
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 11 · Propose a cause (public suggestions)
   ═══════════════════════════════════════════════════════════════════════════ */

function ProposeSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const criteria = bg
    ? [
        "Свързана с Пловдив, тепетата или младите хора",
        "Видим, снимаем резултат на терен",
        "Има отчет: обещано, направено, вложени ресурси",
        "Реализуема чрез партньорски организации",
        "Екипът координира и прави финалния избор",
      ]
    : [
        "Tied to Plovdiv, its hills, or young people",
        "A visible, photographable result on the ground",
        "Has a report: promised, done, resources put in",
        "Deliverable through partner organisations",
        "The team coordinates and makes the final choice",
      ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div
          className="propose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <div className="label-tag" style={{ marginBottom: 14 }}>
              {bg ? "Твоята идея" : "Your idea"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 18 }}>
              {bg ? "Предложи кауза за Пловдив" : "Propose a cause for Plovdiv"}
            </h2>
            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              {bg
                ? "Знаеш ли място на тепетата или в Пловдив, което заслужава грижа? Всеки може да предложи кауза. Разгледай критериите и ни пиши."
                : "Know a spot on the hills or in Plovdiv that deserves care? Anyone can propose a cause. Check the criteria and reach out."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={proposeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {IMPACT.formUrl
                  ? bg
                    ? "Попълни формата"
                    : "Fill in the form"
                  : bg
                    ? "Предложи по имейл"
                    : "Propose by email"}
                <IconArrow />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Instagram <IconInsta />
              </a>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(28px, 4vw, 40px)",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-soft)",
                marginBottom: 18,
              }}
            >
              {bg ? "Как избираме" : "How we choose"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {criteria.map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--sky-lt)",
                      color: "var(--sky-dk)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "0.92rem",
                      color: "var(--text-mid)",
                      lineHeight: 1.5,
                      paddingTop: 2,
                    }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) { .propose-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 12 · Where the money goes (band → /initiatives)
   ═══════════════════════════════════════════════════════════════════════════ */

function WhereItGoesSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing pb-28 pt-0"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-inner">
        <div
          className="wheregoes"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--r-lg)",
            background:
              "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 60%, oklch(52% 0.13 40) 100%)",
            color: "white",
            padding: "clamp(32px, 5vw, 56px)",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
            boxShadow: "var(--shadow-lg)",
            marginTop: "-80px",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -80,
              left: -40,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "oklch(66% 0.16 52 / 0.25)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="label-tag"
              style={{ color: "oklch(88% 0.08 52)", marginBottom: 14 }}
            >
              {bg ? "Накъде отиват парите" : "Where the money goes"}
            </div>
            <h2
              className="heading-lg"
              style={{ color: "white", marginBottom: 16, maxWidth: 850 }}
            >
              {bg ? "Фондът за реални проекти" : "The fund for real projects"}
            </h2>
            <p
              style={{
                color: "oklch(92% 0.03 310)",
                fontSize: "1.02rem",
                maxWidth: 850,
                marginBottom: 30,
              }}
            >
              {bg
                ? "Всеки цент вложен в ТЕПЕ bite Impact се уползотворява за реализацията на конкретни инициативи. Съвместно с партньори и нас (екипа зад бранда), реализираме видими инициативи съфинансирани от събраните средства."
                : "Every cent put into ТЕПЕ bite Impact is used to deliver concrete initiatives. Together with partners and us (the team behind the brand), we deliver visible initiatives co-funded by the funds raised."}
            </p>
            <Link href="/initiatives" className="btn btn-caramel">
              {bg ? "Разгледай всички инициативи" : "Explore all initiatives"}{" "}
              <IconArrow />
            </Link>
          </div>

          <div
            className="wheregoes-visual"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "oklch(100% 0 0 / 0.1)",
                border: "1px solid oklch(100% 0 0 / 0.22)",
                borderRadius: "var(--r-lg)",
                padding: "32px 28px",
                textAlign: "center",
                width: "100%",
                maxWidth: 280,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <PledgeHeart
                  size={92}
                  fill="var(--caramel)"
                  textColor="white"
                />
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: 4,
                }}
              >
                {bg ? "Всеки цент работи" : "Every cent works"}
              </div>
              <div
                style={{ fontSize: "0.82rem", color: "oklch(92% 0.03 310)" }}
              >
                {bg
                  ? "избрано, съфинансирано, отчетено"
                  : "chosen, co-funded, reported"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .wheregoes { grid-template-columns: 1fr !important; }
          .wheregoes-visual { order: -1; max-width: 280px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 13 · Closing CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function ClosingCTASection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <HillSVG fill="rgb(82, 51, 95)" opacity={1} />
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1, maxWidth: 680 }}
      >
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PledgeHeart size={72} fill="var(--caramel)" textColor="white" />
        </div>
        <h2 className="heading-lg" style={{ color: "white", marginBottom: 16 }}>
          {bg ? "Едно барче. Едно обещание." : "One bar. One promise."}
        </h2>
        <p
          style={{
            color: "oklch(90% 0.03 310)",
            fontSize: "1.06rem",
            marginBottom: 32,
            maxWidth: 560,
            marginInline: "auto",
          }}
        >
          {bg
            ? "Всяка покупка добавя фиксираните 0.15 € към фонда. Поръчай, следи ни и виж как расте въздействието за Пловдив."
            : "Every purchase adds the fixed 0.15 € to the fund. Order, follow along, and watch the impact for Plovdiv grow."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/order" className="btn btn-caramel">
            {bg ? "Поръчай сега" : "Order now"} <IconShop />
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid oklch(100% 0 0 / 0.3)",
            }}
          >
            {bg ? "Последвай ни" : "Follow us"} <IconInsta />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ImpactPageContent({
  data,
  reconnect,
  heroPick,
}: {
  data: OverviewData;
  reconnect: InitiativeDetail | null;
  heroPick: InitiativeDTO | null;
}) {
  const lang = useAtomValue(langAtom);

  // Track initiative ids in render order (hero → §2 card → §5 deep-dive) so any
  // appearance after the first gets a small RepeatNote.
  const seen = new Set<string>();
  if (heroPick) seen.add(heroPick.id);

  const card2Id = reconnect?.initiative.id ?? null;
  const card2Repeat = card2Id ? seen.has(card2Id) : false;
  if (card2Id) seen.add(card2Id);

  const deepDetail = reconnect;
  const deepId = deepDetail?.initiative.id ?? null;
  const deepRepeat = deepId ? seen.has(deepId) : false;
  if (deepId) seen.add(deepId);

  const allInitiatives = orderedInitiatives(data.byStatus);

  return (
    <>
      <HeroSection lang={lang} heroPick={heroPick} />
      <WhatWeChooseSection
        lang={lang}
        reconnect={reconnect}
        showRepeat={card2Repeat}
      />
      <HowImpactWorksSection lang={lang} />
      <ResponsibilitiesSection lang={lang} />
      {deepDetail && (
        <div id="focus" style={{ scrollMarginTop: 80 }}>
          <FocusDeepDive
            detail={deepDetail}
            lang={lang}
            showRepeat={deepRepeat}
          />
        </div>
      )}
      {allInitiatives.length > 1 && (
        <MoreInitiativesSection items={allInitiatives} lang={lang} />
      )}
      <WhereItGoesSection lang={lang} />
      <TransparencySection lang={lang} />
      <ProposeSection lang={lang} />
      <FiscalSection lang={lang} stats={data.stats} />
      <FAQSection lang={lang} />
      <PartnersIntroSection lang={lang} />
      {data.hasAnyPartner && (
        <PartnersCarousel
          items={data.partners}
          lang={lang}
          background="var(--surface)"
        />
      )}
      <FirmsInviteSection lang={lang} />
      <ClosingCTASection lang={lang} />
    </>
  );
}

/**
 * Chronological order for the "more projects" rail: planned first, then
 * in-progress (by most recent completed step), then completed (by completion
 * date, newest first), with frozen appended last.
 */
function orderedInitiatives(
  byStatus: OverviewData["byStatus"],
): InitiativeDTO[] {
  const latestStepDate = (i: InitiativeDTO): string =>
    i.steps
      .filter((s) => s.done && s.completedDateISO)
      .map((s) => s.completedDateISO)
      .sort()
      .pop() ?? "";

  const inProgress = [...byStatus.in_progress].sort((a, b) =>
    latestStepDate(b).localeCompare(latestStepDate(a)),
  );
  const done = [...byStatus.done].sort((a, b) =>
    (b.completionDateISO || "").localeCompare(a.completionDateISO || ""),
  );

  return [...byStatus.planned, ...inProgress, ...done, ...byStatus.frozen];
}
