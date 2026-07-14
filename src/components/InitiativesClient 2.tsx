"use client";

import { IconArrow, IconInfo, IconShop } from "@/components/icons";
import ImpactPledge from "@/components/ImpactPledge";
import FocusDeepDive from "@/components/public/FocusDeepDive";
import InitiativeCard from "@/components/public/InitiativeCard";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import {
  CategoryChip,
  CompletedDateBadge,
  StatusBadge,
  pick,
} from "@/components/public/impactUi";
import { FundingSplitBar } from "@/components/public/PhaseBreakdown";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { formatMoneyEUR } from "@/lib/money";
import type { InitiativeDetail, OverviewData } from "@/lib/public/initiatives";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Link from "next/link";

const IMPACT_EMAIL = "impact@tepebite.eu";

/* ─── Local icons (pillars / section emblems) ────────────────────────────── */

const IconMountain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const IconBrush = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconCoins = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const IconHandshake = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);

const IconBulb = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

/* ─── Hill SVG motif (reused from the site) ──────────────────────────────── */

function HillSVG({ opacity = 0.06, fill = "var(--plum)" }: { opacity?: number; fill?: string }) {
  return (
    <svg
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", opacity, pointerEvents: "none" }}
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
      <span aria-hidden="true" style={{ color: "var(--caramel)", flexShrink: 0, marginTop: 1, display: "inline-flex" }}>
        <IconInfo size={16} />
      </span>
      <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.55, color: "var(--text-soft)" }}>
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

const HERO_EYEBROW: Record<InitiativeDTO["status"], { bg: string; en: string; pulse: boolean }> = {
  in_progress: { bg: "Текущ фокус", en: "Current focus", pulse: true },
  done: { bg: "Наскоро реализирано", en: "Recently delivered", pulse: false },
  planned: { bg: "Предстои", en: "Coming up", pulse: false },
  frozen: { bg: "Инициатива", en: "Initiative", pulse: false },
};

function HeroSection({ lang, heroPick }: { lang: Lang; heroPick: InitiativeDTO | null }) {
  const bg = lang === "bg";
  const hasCard = Boolean(heroPick);

  return (
    <section
      id="initiatives-hero"
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
      <div className="hero-blob" style={{ width: 380, height: 380, background: "oklch(86% 0.07 315)", top: -80, right: -40 }} />
      <div className="hero-blob" style={{ width: 260, height: 260, background: "oklch(89% 0.09 52)", bottom: -40, left: "6%" }} />
      <HillSVG />

      <div className="section-inner" style={{ width: "100%", position: "relative", zIndex: 1 }}>
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
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 24 }}>
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
                  {bg ? "Инициативи с видими резултати" : "Initiatives with visible results"}
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
                  {bg ? "Публикуваме всяко евро" : "Every euro, published"}
                </span>
              </div>

              <h1 className="heading-xl text-4xl!" style={{ maxWidth: 630, marginBottom: 20 }}>
                {bg ? "От Пловдивчани. За Пловдив." : "From Plovdivchani. For Plovdiv."}
              </h1>

              <p
                className="text-justify"
                style={{ fontSize: "clamp(0.97rem, 1.4vw, 1.08rem)", maxWidth: 630, marginBottom: 36, lineHeight: 1.72 }}
              >
                {bg
                  ? "Избираме инициативи с видима промяна в Пловдив — неща, които се усещат из града. Купувайки барче, ставаш част от нещо реално: фиксираните 0.15 € от всяко влизат във фонд ТЕПЕ bite Impact, умножаваме ги с партньори и публикуваме всяко евро."
                  : "We pick initiatives with visible change in Plovdiv — things you feel around the city. Buy a bar and you become part of something real: a fixed 0.15 € from each goes into the ТЕПЕ bite Impact fund, we multiply it through partners, and we publish every euro."}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#focus" className="btn btn-primary max-sm:text-[0.72rem]! max-sm:px-8!">
                  {bg ? "Разгледай инициатива" : "Explore an initiative"} <IconArrow />
                </a>
                <a href="#impact" className="btn btn-secondary max-sm:text-[0.72rem]! max-sm:px-4! flex justify-center max-sm:grow grow-0">
                  {bg ? "Как работи фондът?" : "How the fund works"}
                </a>
              </div>

              <div style={{ marginTop: 24 }}>
                <ImpactPledge variant="chip" className="max-[640px]:w-full!" />
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

function HeroFocusCard({ initiative, lang }: { initiative: InitiativeDTO; lang: Lang }) {
  const bg = lang === "bg";
  const eyebrow = HERO_EYEBROW[initiative.status];
  const title = pick(lang, initiative.titleBg, initiative.titleEn);
  const desc = pick(lang, initiative.descriptionBg, initiative.descriptionEn);
  const location = pick(lang, initiative.locationBg, initiative.locationEn);

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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: location ? 14 : 0 }}>
          <StatusBadge status={initiative.status} lang={lang} />
          {initiative.category && <CategoryChip category={initiative.category} lang={lang} />}
          {initiative.status === "done" && (
            <CompletedDateBadge dateISO={initiative.completionDateISO} lang={lang} />
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
   SECTION 2 · „Инициативи, които се виждат" — the type we choose
   ═══════════════════════════════════════════════════════════════════════════ */

function VisibleInitiativesSection({
  lang,
  reconnect,
  showRepeat,
}: {
  lang: Lang;
  reconnect: InitiativeDetail | null;
  showRepeat: boolean;
}) {
  const bg = lang === "bg";
  const pillars = [
    { icon: <IconMountain />, label: bg ? "Опазване" : "Preserve", color: "var(--plum)", chip: "var(--plum-lt)" },
    { icon: <IconBrush />, label: bg ? "Облагородяване" : "Improve", color: "oklch(44% 0.14 52)", chip: "var(--caramel-lt)" },
    { icon: <IconUsers />, label: bg ? "Младежко действие" : "Youth action", color: "var(--plum-mid)", chip: "oklch(91% 0.03 295)" },
  ];

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div
          className="visible-grid"
          style={{
            display: "grid",
            gridTemplateColumns: reconnect ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Copy */}
          <div>
            <div className="section-divider" style={{ marginBottom: 18 }} />
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "Какви инициативи избираме" : "The initiatives we choose"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 18 }}>
              {bg ? "Инициативи, които се виждат" : "Initiatives you can see"}
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-mid)", marginBottom: 18 }}>
              {bg
                ? "Избираме инициативи с видимо въздействие в Пловдив — места и промени, които хората забелязват и с които се идентифицират."
                : "We choose initiatives with visible impact in Plovdiv — places and changes people notice and identify with."}
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-mid)", margin: 0 }}>
              {bg
                ? "Затова, когато купуваш барче, ставаш част от нещо реално: минаваш покрай наш проект в града и можеш да кажеш „аз допринесох за това“."
                : "So when you buy a bar, you become part of something real: you walk past one of our projects in the city and can say “I helped make this.”"}
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              {pillars.map((p) => (
                <div
                  key={p.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: p.chip,
                    borderRadius: 100,
                    padding: "8px 16px 8px 10px",
                    color: p.color,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>{p.icon}</span>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600 }}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proof: a real initiative card */}
          {reconnect ? (
            <div>
              <div style={{ maxWidth: 420 }}>
                <InitiativeCard initiative={reconnect.initiative} lang={lang} />
              </div>
              {showRepeat && <RepeatNote lang={lang} />}
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .visible-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 · ТЕПЕ bite Impact — the vehicle (sky-accented)
   ═══════════════════════════════════════════════════════════════════════════ */

function ImpactVehicleSection({ lang, stats }: { lang: Lang; stats: OverviewData["stats"] }) {
  const bg = lang === "bg";
  const hasFunds = stats.investedTotalCents > 0;

  return (
    <section
      id="impact"
      className="section-spacing"
      style={{ background: "var(--sky-lt)", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}
    >
      <HillSVG opacity={0.05} fill="var(--sky-dk)" />
      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div className="section-divider" style={{ marginBottom: 18, background: "var(--sky-mid)" }} />
          <div className="label-tag" style={{ marginBottom: 12, color: "var(--sky-dk)" }}>
            {bg ? "Инструментът" : "The vehicle"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg ? "ТЕПЕ bite Impact захранва всичко това" : "ТЕПЕ bite Impact powers all of it"}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-mid)" }}>
            {bg
              ? "ТЕПЕ bite Impact е фондът зад инициативите: фиксираните 0.15 € от всяко барче се събират в общ пул и се умножават чрез партньори, дарени материали и външна подкрепа."
              : "ТЕПЕ bite Impact is the fund behind the initiatives: the fixed 0.15 € from every bar pools together and is multiplied through partners, donated materials, and outside support."}
          </p>
        </div>

        <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)", background: "var(--surface)" }}>
          {hasFunds ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 8,
                  }}
                >
                  {bg ? "Реализирани средства по всички инициативи" : "Realised funds across all initiatives"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontSize: "clamp(2.4rem, 6vw, 3.4rem)",
                    fontWeight: 800,
                    color: "var(--plum)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatMoneyEUR(stats.investedTotalCents)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 12,
                  }}
                >
                  {bg ? "Откъде идва финансирането" : "Where the funding comes from"}
                </div>
                <FundingSplitBar
                  impactCents={stats.investedImpactCents}
                  partnersCents={stats.investedExternalCents}
                  lang={lang}
                />
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.6, margin: 0 }}>
                {bg
                  ? "Всяка сума е реално преведена и вложена — не обещание. Пълната разбивка по фази и по всяко постъпление е публикувана."
                  : "Every amount here has actually been transferred and spent — not a promise. The full breakdown by phase and by inflow is published."}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.7, margin: 0 }}>
              {bg
                ? "Фондът тепърва се пълни. Щом първите средства бъдат вложени в инициатива, ще ги видиш тук — открито и с точна разбивка."
                : "The fund is just starting to fill. As soon as the first money is invested in an initiative, you'll see it here — openly and broken down."}
            </p>
          )}

          <div style={{ marginTop: 24 }}>
            <Link
              href="/impact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--sky-dk)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              {bg ? "Разгледай фонд ТЕПЕ bite Impact" : "Explore the ТЕПЕ bite Impact fund"} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 · Transparency — „Публикуваме всичко"
   ═══════════════════════════════════════════════════════════════════════════ */

function TransparencySection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const points = [
    {
      icon: <IconList />,
      title: bg ? "Всяка стъпка" : "Every step",
      text: bg
        ? "Публикуваме напредъка на всяка инициатива — какво е готово и какво предстои."
        : "We publish each initiative's progress — what's done and what's next.",
    },
    {
      icon: <IconCoins />,
      title: bg ? "Всяко евро" : "Every euro",
      text: bg
        ? "Показваме всяко постъпление поотделно — откъде идва и в коя фаза е."
        : "We show every inflow individually — where it comes from and which phase it's in.",
    },
    {
      icon: <IconEye />,
      title: bg ? "Без скрити числа" : "Nothing hidden",
      text: bg
        ? "Разделяме налични, осигурени и планирани средства, за да не подвеждаме."
        : "We separate available, arranged, and planned funds so nothing misleads.",
    },
  ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <div className="section-divider" style={{ marginBottom: 18 }} />
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Прозрачност" : "Transparency"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg ? "Публикуваме всичко" : "We publish everything"}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-mid)" }}>
            {bg
              ? "За всяка инициатива отваряме стъпките, партньорите и всяко евро — за да можеш сам да провериш, а не просто да ни вярваш."
              : "For every initiative we open the steps, the partners, and every euro — so you can check for yourself instead of taking our word for it."}
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
            <div key={p.title} className="card" style={{ padding: "26px 24px" }}>
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
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 700, color: "var(--plum)", marginBottom: 8 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-mid)", margin: 0 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/initiatives/all" className="btn btn-primary">
            {bg ? "Виж целия регистър" : "See the full ledger"} <IconArrow />
          </Link>
          <Link href="/legal/initiative-transparency" className="btn btn-secondary">
            {bg ? "Политика за прозрачност" : "Transparency policy"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6b · Firms invite (after the partners carousel)
   ═══════════════════════════════════════════════════════════════════════════ */

function FirmsInviteSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const subject = encodeURIComponent(bg ? "Партньорство с ТЕПЕ bite Impact" : "Partnership with ТЕПЕ bite Impact");
  const body = encodeURIComponent(
    bg
      ? "Здравейте,\n\nПредставляваме фирма, която иска да подкрепи инициатива на ТЕПЕ bite. Ето какво можем да предложим:\n\n"
      : "Hello,\n\nWe're a company that would like to support a ТЕПЕ bite initiative. Here's what we can offer:\n\n",
  );
  const mailto = `mailto:${IMPACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--r-lg)",
            padding: "clamp(28px, 4vw, 48px)",
            background: "linear-gradient(135deg, var(--caramel-lt) 0%, var(--surface) 70%)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", top: -60, right: -50, width: 240, height: 240, borderRadius: "50%", background: "oklch(89% 0.09 52 / 0.4)", filter: "blur(60px)", pointerEvents: "none" }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--plum)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <IconHandshake />
            </div>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "За фирми" : "For companies"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              {bg ? "Партньорите умножават фонда" : "Partners multiply the fund"}
            </h2>
            <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--text-mid)", marginBottom: 24 }}>
              {bg
                ? "Всеки партньор добавя доверие и ресурс — материали, експертиза, институционална подкрепа или финансиране. Ако сте фирма, която иска да подкрепи конкретна инициатива, пишете ни."
                : "Every partner adds trust and resource — materials, expertise, institutional backing, or funding. If you're a company that wants to support a specific initiative, get in touch."}
            </p>
            <a href={mailto} className="btn btn-primary">
              <IconArrow />
              {bg ? "Станете партньор" : "Become a partner"}
            </a>
            <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", marginTop: 16, marginBottom: 0 }}>
              {bg ? "Или пишете директно на " : "Or email us directly at "}
              <a href={mailto} style={{ color: "var(--caramel)", fontWeight: 700, wordBreak: "break-all" }}>
                {IMPACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 · Ideas invite (public suggestions)
   ═══════════════════════════════════════════════════════════════════════════ */

function IdeasInviteSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const subject = encodeURIComponent(bg ? "Идея за инициатива в Пловдив" : "An initiative idea for Plovdiv");
  const body = encodeURIComponent(
    bg
      ? "Здравейте,\n\nИмам идея за инициатива в Пловдив:\n\n"
      : "Hello,\n\nI have an idea for an initiative in Plovdiv:\n\n",
  );
  const mailto = `mailto:${IMPACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div
          className="ideas-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(20px, 4vw, 40px)",
            alignItems: "center",
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--caramel-lt)", color: "oklch(44% 0.14 52)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconBulb />
          </div>
          <div>
            <div className="label-tag" style={{ marginBottom: 10 }}>
              {bg ? "Твоята идея" : "Your idea"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 14 }}>
              {bg ? "Знаеш място, което заслужава внимание?" : "Know a place that deserves attention?"}
            </h2>
            <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "var(--text-mid)", marginBottom: 22, maxWidth: 620 }}>
              {bg
                ? "Инициативите ни тръгват от хора, които обичат Пловдив. Ако имаш идея за инициатива — кът, тепе, училищен двор, зона, която заслужава грижа — разкажи ни."
                : "Our initiatives start with people who love Plovdiv. If you have an idea — a corner, a hill, a schoolyard, a spot that deserves care — tell us."}
            </p>
            <a href={mailto} className="btn btn-caramel">
              <IconArrow />
              {bg ? "Изпрати идея" : "Send an idea"}
            </a>
            <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", marginTop: 16, marginBottom: 0 }}>
              {bg ? "На " : "To "}
              <a href={mailto} style={{ color: "var(--caramel)", fontWeight: 700, wordBreak: "break-all" }}>
                {IMPACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) { .ideas-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 · Closing CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function ClosingCTASection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(48px, 6vw, 80px)",
        paddingBottom: "clamp(48px, 6vw, 80px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner">
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--r-lg)",
            padding: "clamp(32px, 5vw, 60px)",
            background: "linear-gradient(150deg, var(--plum) 0%, var(--plum-mid) 70%, oklch(52% 0.13 40) 100%)",
            color: "white",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", bottom: -80, right: -50, width: 280, height: 280, borderRadius: "50%", background: "oklch(66% 0.16 52 / 0.28)", filter: "blur(60px)", pointerEvents: "none" }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <div className="label-tag" style={{ color: "oklch(88% 0.08 52)", marginBottom: 14 }}>
              {bg ? "Стани част" : "Become part of it"}
            </div>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.02em" }}>
              {bg ? "Едно барче. Реална промяна за Пловдив." : "One bar. Real change for Plovdiv."}
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "oklch(90% 0.03 310)", marginBottom: 30 }}>
              {bg
                ? "Всяко барче добавя фиксирани 0.15 € към фонда — и те превръща в част от следващата видима инициатива в града."
                : "Every bar adds a fixed 0.15 € to the fund — and makes you part of the next visible initiative in the city."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/order" className="btn btn-caramel">
                <IconShop />
                {bg ? "Купи ТЕПЕ bite" : "Buy ТЕПЕ bite"}
              </Link>
              <Link href="/initiatives/all" className="btn btn-ghost">
                {bg ? "Виж всички инициативи" : "See all initiatives"} <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function InitiativesClient({
  data,
  reconnect,
  heroPick,
}: {
  data: OverviewData;
  reconnect: InitiativeDetail | null;
  heroPick: InitiativeDTO | null;
}) {
  const lang = useAtomValue(langAtom);

  // Track initiative ids in render order (hero → §2 card → §3 deep-dive) so any
  // appearance after the first gets a small RepeatNote (see CLAUDE.md / plan).
  const seen = new Set<string>();
  if (heroPick) seen.add(heroPick.id);

  const card2Id = reconnect?.initiative.id ?? null;
  const card2Repeat = card2Id ? seen.has(card2Id) : false;
  if (card2Id) seen.add(card2Id);

  // The deep-dive spotlights the pinned (RE-CONNECT) enriched detail.
  const deepDetail = reconnect;
  const deepId = deepDetail?.initiative.id ?? null;
  const deepRepeat = deepId ? seen.has(deepId) : false;
  if (deepId) seen.add(deepId);

  return (
    <>
      <HeroSection lang={lang} heroPick={heroPick} />
      <VisibleInitiativesSection lang={lang} reconnect={reconnect} showRepeat={card2Repeat} />
      {deepDetail && (
        <div id="focus" style={{ scrollMarginTop: 80 }}>
          <FocusDeepDive detail={deepDetail} lang={lang} />
          {deepRepeat && (
            <div
              className="section-inner"
              style={{
                paddingLeft: "clamp(20px, 5vw, 80px)",
                paddingRight: "clamp(20px, 5vw, 80px)",
                marginTop: -24,
                marginBottom: 8,
              }}
            >
              <RepeatNote lang={lang} />
            </div>
          )}
        </div>
      )}
      <ImpactVehicleSection lang={lang} stats={data.stats} />
      <TransparencySection lang={lang} />
      {data.hasAnyPartner && (
        <PartnersCarousel items={data.partners} lang={lang} background="var(--surface)" />
      )}
      <FirmsInviteSection lang={lang} />
      <IdeasInviteSection lang={lang} />
      <ClosingCTASection lang={lang} />
    </>
  );
}
