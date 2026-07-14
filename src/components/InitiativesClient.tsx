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
  YouthBadge,
  pick,
  PARTNERSHIP_TYPE_LABELS,
} from "@/components/public/impactUi";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { formatMoneyEUR } from "@/lib/money";
import type { InitiativeDetail, OverviewData } from "@/lib/public/initiatives";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
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
                  {bg ? "Виж инициативите ни" : "Explore an initiative"} <IconArrow />
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

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {initiative.status === "done" ? (
            <CompletedDateBadge dateISO={initiative.completionDateISO} lang={lang} tone="green" />
          ) : (
            <StatusBadge status={initiative.status} lang={lang} />
          )}
          {initiative.category && <CategoryChip category={initiative.category} lang={lang} />}
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
    <section
      className="section-spacing"
      style={{ background: "linear-gradient(180deg, var(--plum-lt) 0%, var(--surface) 100%)" }}
    >
      <div className="section-inner">
        <div
          className="visible-grid"
          style={{
            display: "grid",
            gridTemplateColumns: reconnect ? "minmax(0, 1.05fr) minmax(0, 0.95fr)" : "1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Copy */}
          <div>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "Какви инициативи избираме" : "The initiatives we choose"}
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 18 }}>
              {bg ? "Инициативи, които се виждат" : "Initiatives you can see"}
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-mid)", marginBottom: 18 }}>
              {bg
                ? "Нашите инициативи са проекти за градско обновяване — намеси, които хората в Пловдив реално виждат, ползват и разпознават като свои."
                : "Our initiatives are urban-renewal projects — interventions people in Plovdiv can genuinely see, use, and recognise as their own."}
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-mid)", margin: 0 }}>
              {bg
                ? "Първата ни такава инициатива обнови силно натоварено обществено пространство, пълно с майки и деца. Беше сиво и безлично — добавихме визуална концепция върху бетона на земята, включително детски игри, за да имат децата какво по-смислено да правят."
                : "Our first such initiative renewed a heavily-used public space full of mothers and children. It was grey and lifeless — so we added a visual concept onto the concrete on the ground, including children's games, giving the kids something more meaningful to do."}
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

          {/* Proof: the first initiative, tied to the copy */}
          {reconnect ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                className="label-tag"
                style={{ color: "var(--plum-mid)", display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  aria-hidden="true"
                  style={{ width: 22, height: 2, background: "var(--caramel)", borderRadius: 2 }}
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
  const expensesTotal = stats.accountedExpensesTotalCents;
  const impactAll = stats.fundedImpactAllPhasesCents;
  const externalAll = stats.fundedExternalAllPhasesCents;
  const raisedTotal = impactAll + externalAll;
  const impactPct = raisedTotal > 0 ? Math.round((impactAll / raisedTotal) * 100) : 0;
  const externalPct = 100 - impactPct;
  const hasExpenses = expensesTotal > 0;
  const hasRaised = raisedTotal > 0;

  return (
    <section
      id="impact"
      className="section-spacing"
      style={{ background: "var(--sky-lt)", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}
    >
      <HillSVG opacity={0.05} fill="var(--sky-dk)" />
      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 660, marginBottom: 40 }}>
          <div className="label-tag" style={{ marginBottom: 12, color: "var(--sky-dk)" }}>
            {bg ? "Инструментът" : "The vehicle"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg ? "Всеки цент, умножен" : "Every cent, multiplied"}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-mid)" }}>
            {bg
              ? "От всяка продажба заделяме фиксирани 0.15 € във фонд ТЕПЕ bite Impact. Целта ни е проста: да умножим стойността на всеки даден цент чрез партньори, дарени материали и външна подкрепа."
              : "From every sale we set aside a fixed 0.15 € into the ТЕПЕ bite Impact fund. Our goal is simple: to multiply the value of every cent given — through partners, donated materials, and outside support."}
          </p>
        </div>

        {/* ── Section 1: accounted expenses headline ─────────────────────── */}
        <div
          className="card"
          style={{ padding: "clamp(28px, 4vw, 44px)", background: "var(--surface)" }}
        >
          <div
            className="impact-hero-row"
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
              <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
                {bg
                  ? "Първите средства тепърва тръгват към инициативите. Щом похарчим за проект, разходите се появяват тук — открито и с доказателство."
                  : "The first money is only just heading to initiatives. As soon as we spend on a project, expenses show up here — openly and with proof."}
              </p>
            )}
            <Link href="/initiatives/all" className="btn btn-sky" style={{ flexShrink: 0 }}>
              {bg ? "Разгледай въздействието ни" : "Explore our impact"}
              <IconArrow />
            </Link>
          </div>
        </div>

        {/* ── Section 2: outside-funding narrative + combined funding card ── */}
        {hasRaised && (
          <div style={{ marginTop: 28 }}>
            <div style={{ maxWidth: 660, marginBottom: 20 }}>
              <div className="label-tag" style={{ marginBottom: 10, color: "var(--sky-dk)" }}>
                {bg ? "Външно финансиране" : "Outside funding"}
              </div>
              <p style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "var(--text-mid)", margin: 0 }}>
                {bg
                  ? "Стремим се основната част от финансирането на инициативите да идва от външни източници — спонсори, дарения и партньори — а не само от фонда. Така всеки цент от ТЕПЕ bite Impact върши повече."
                  : "We aim for the bulk of initiative funding to come from outside sources — sponsors, donations and partners — not the fund alone. That way every cent of ТЕПЕ bite Impact does more."}
              </p>
            </div>

            <div className="card" style={{ padding: "clamp(24px, 3.5vw, 38px)", background: "var(--surface)" }}>
              <div
                className="impact-funds-grid"
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
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--sky-mid)", flexShrink: 0 }} />
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
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--caramel)", flexShrink: 0 }} />
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

              {/* proportion bar */}
              <div
                style={{ display: "flex", height: 12, borderRadius: 10, overflow: "hidden", background: "var(--border)" }}
                role="img"
                aria-label={
                  bg
                    ? `Разпределение: фонд ${impactPct}%, външни ${externalPct}%`
                    : `Split: fund ${impactPct}%, external ${externalPct}%`
                }
              >
                <div style={{ width: `${impactPct}%`, background: "var(--sky-mid)" }} />
                <div style={{ width: `${externalPct}%`, background: "var(--caramel)" }} />
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
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-soft)", margin: "8px 0 0" }}>
                {bg
                  ? "Това са всички средства — налични, осигурени и планирани — които сме привлекли или заделили за инициативите: от фонд ТЕПЕ bite Impact и от външни източници. Това е парите, които имаме или ще вложим в проекти; разликата между двете числа показва колко от подкрепата идва отвън."
                  : "These are all the funds — available, arranged and planned — we've secured or set aside for initiatives: from the ТЕПЕ bite Impact fund and from outside sources. It's the money we have or will invest in projects; the gap between the two figures shows how much of the support comes from outside."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .impact-hero-row { flex-direction: column; align-items: flex-start !important; }
          .impact-funds-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
      icon: <IconCoins />,
      title: bg ? "Източниците на средствата" : "Where the money comes from",
      text: bg
        ? "Показваме откъде идва всяко евро, което влагаме — от фонда, от партньор или от външно дарение."
        : "We show where every euro we invest comes from — the fund, a partner, or an outside donation.",
    },
    {
      icon: <IconList />,
      title: bg ? "Постъпления и разходи" : "Inflows & outflows",
      text: bg
        ? "Проследяваме какво влиза и какво излиза от фонд ТЕПЕ bite Impact за всяка инициатива."
        : "We track what goes into and out of the ТЕПЕ bite Impact fund for each initiative.",
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
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div style={{ maxWidth: 620, marginBottom: 40 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Прозрачност" : "Transparency"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16, textWrap: "balance" } as React.CSSProperties}>
            {bg ? "Показваме всичко" : "We show everything"}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-mid)" }}>
            {bg
              ? "Нищо не остава скрито: показваме откъде идват средствата, които влагаме, какво постига фонд ТЕПЕ bite Impact и как умножаваме неговия ефект."
              : "Nothing stays hidden: we show where the money we invest comes from, what the ТЕПЕ bite Impact fund achieves, and how we multiply its effect."}
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
          className="firms-band"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(20px, 4vw, 48px)",
            flexWrap: "wrap",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "clamp(28px, 4vw, 40px) 0",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div className="label-tag" style={{ marginBottom: 12 }}>
              {bg ? "За фирми" : "For companies"}
            </div>
            <h2
              className="heading-lg"
              style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2.1rem)" } as React.CSSProperties}
            >
              {bg
                ? "Фирма? Да създадем видима промяна в Пловдив — заедно."
                : "A company? Let's create visible change in Plovdiv — together."}
            </h2>
          </div>
          <a href={mailto} className="btn btn-primary" style={{ flexShrink: 0 }}>
            {bg ? "Станете партньор" : "Become a partner"}
            <IconArrow />
          </a>
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
      <div
        className="section-inner"
        style={{ maxWidth: 640, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span
          style={{ color: "var(--caramel)", display: "inline-flex", marginBottom: 16 }}
          aria-hidden="true"
        >
          <IconBulb />
        </span>
        <h2 className="heading-lg" style={{ marginBottom: 14 }}>
          {bg ? "Имаш силата да предложиш промяна" : "You have the power to suggest change"}
        </h2>
        <p style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "var(--text-mid)", margin: "0 0 24px" }}>
          {bg
            ? "Знаеш място в Пловдив, което заслужава внимание? Разкажи ни — следващата инициатива може да е твоя идея."
            : "Know a place in Plovdiv that deserves attention? Tell us — the next initiative could be your idea."}
        </p>
        <a href={mailto} className="btn btn-caramel">
          <IconArrow />
          {bg ? `Пиши на ${IMPACT_EMAIL}` : `Email ${IMPACT_EMAIL}`}
        </a>
      </div>
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
          <div
            className="closing-grid"
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "4fr 3fr",
              gap: "clamp(24px, 4vw, 56px)",
              alignItems: "center",
            }}
          >
            <div className="closing-copy">
              <div className="label-tag" style={{ color: "oklch(88% 0.08 52)", marginBottom: 14 }}>
                {bg ? "Стани част" : "Become part of it"}
              </div>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 28, letterSpacing: "-0.02em" }}>
                {bg ? "Едно барче. Реална промяна за Пловдив." : "One bar. Real change for Plovdiv."}
              </h2>
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

            <div
              className="closing-photo"
              style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}
            >
              <Image
                src="/bar-product.png"
                alt={bg ? "Барче ТЕПЕ bite" : "ТЕПЕ bite bar"}
                fill
                sizes="(max-width: 680px) 260px, 40vw"
                className="animate-float"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 24px 40px oklch(20% 0.05 315 / 0.5))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .closing-grid { grid-template-columns: 1fr !important; }
          .closing-photo { order: -1; width: 100%; max-width: 240px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6a · Partners — why & how we partner (before the carousel)
   ═══════════════════════════════════════════════════════════════════════════ */

function PartnersIntroSection({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const types: { key: keyof typeof PARTNERSHIP_TYPE_LABELS; desc: string }[] = [
    { key: "sponsor", desc: bg ? "Осигуряват финансиране за инициативата." : "Provide funding for the initiative." },
    { key: "technical", desc: bg ? "Дават експертиза, инструменти или материали." : "Contribute expertise, tools, or materials." },
    { key: "executional", desc: bg ? "Помагат с реалното изпълнение на терен." : "Help with hands-on delivery on the ground." },
    { key: "institutional", desc: bg ? "Осигуряват достъп, съгласуване и легитимност." : "Provide access, approvals, and legitimacy." },
  ];

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 32 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Партньори" : "Partners"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            {bg ? "Заедно постигаме повече" : "Together we go further"}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-mid)" }}>
            {bg
              ? "ТЕПЕ bite работи с партньори, за да създава въздействие с по-висока стойност — повече, отколкото един бранд може да постигне сам."
              : "ТЕПЕ bite works with partners to create higher-value impact — more than any one brand can achieve alone."}
          </p>
        </div>

        {/* Partnership types */}
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
                {bg ? PARTNERSHIP_TYPE_LABELS[key].bg : PARTNERSHIP_TYPE_LABELS[key].en}
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--text-mid)", margin: 0 }}>
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
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--surface)", color: "var(--plum)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconUsers />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 700, color: "var(--plum)", margin: 0 }}>
                {bg ? "Подкрепяме младежки организации" : "We support youth-led organisations"}
              </h3>
              <YouthBadge lang={lang} compact />
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-mid)", margin: 0 }}>
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
   SECTION · More initiatives rail (chronological)
   ═══════════════════════════════════════════════════════════════════════════ */

function MoreInitiativesSection({ items, lang }: { items: InitiativeDTO[]; lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section className="section-spacing" style={{ background: "var(--bg)", overflow: "hidden" }}>
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 28 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Още проекти" : "More projects"}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 14 }}>
            {bg ? "Имаме и други инициативи" : "We have other initiatives too"}
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-mid)", margin: 0 }}>
            {bg
              ? "От планираните до вече завършените — ето по какво още работим за Пловдив."
              : "From planned to already completed — here's what else we're building for Plovdiv."}
          </p>
        </div>
      </div>

      <div
        className="rail-scroller"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: "4px clamp(20px, 5vw, 80px) 8px",
          scrollbarWidth: "none",
        }}
      >
        {items.map((it) => (
          <div key={it.id} style={{ flex: "0 0 300px", width: 300, scrollSnapAlign: "start" }}>
            <InitiativeCard initiative={it} lang={lang} showPlannedBadge={it.status === "planned"} />
          </div>
        ))}
      </div>

      <div className="section-inner" style={{ marginTop: 24 }}>
        <Link
          href="/initiatives/all"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--caramel)",
            fontWeight: 700,
            fontSize: "0.92rem",
            textDecoration: "none",
          }}
        >
          {bg ? "Разгледай всички инициативи" : "Explore all initiatives"} →
        </Link>
      </div>

      <style>{`
        .rail-scroller::-webkit-scrollbar { display: none; }
      `}</style>
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

  const allInitiatives = orderedInitiatives(data.byStatus);

  return (
    <>
      <HeroSection lang={lang} heroPick={heroPick} />
      <VisibleInitiativesSection lang={lang} reconnect={reconnect} showRepeat={card2Repeat} />
      {deepDetail && (
        <div id="focus" style={{ scrollMarginTop: 80 }}>
          <FocusDeepDive detail={deepDetail} lang={lang} showRepeat={deepRepeat} />
        </div>
      )}
      {allInitiatives.length > 1 && (
        <MoreInitiativesSection items={allInitiatives} lang={lang} />
      )}
      <ImpactVehicleSection lang={lang} stats={data.stats} />
      <TransparencySection lang={lang} />
      <PartnersIntroSection lang={lang} />
      {data.hasAnyPartner && (
        <PartnersCarousel items={data.partners} lang={lang} background="var(--surface)" />
      )}
      <FirmsInviteSection lang={lang} />
      <IdeasInviteSection lang={lang} />
      <ClosingCTASection lang={lang} />
    </>
  );
}

/**
 * Chronological order for the "more projects" rail: planned first, then
 * in-progress (by most recent completed step), then completed (by completion
 * date, newest first), with frozen appended last.
 */
function orderedInitiatives(byStatus: OverviewData["byStatus"]): InitiativeDTO[] {
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
