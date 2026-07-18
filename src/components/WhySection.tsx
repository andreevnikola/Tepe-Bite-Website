"use client";
import { IconArrow, IconStar } from "@/components/icons";
import { PledgeHeart, PLEDGE_EUR } from "@/components/ImpactPledge";
import InitiativeCard from "@/components/public/InitiativeCard";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── Engine-step icons (stroke, sky-tinted) — absorbed from the retired
   InitiativesPromo so the transparency pledge content is preserved. ── */
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>
);
const IconPartners = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCoins = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="M16.71 13.88l.7.71-2.82 2.82" />
  </svg>
);
const IconReport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

type EngineStep = { icon: React.ReactNode; title: string; copy: string };

/* Renders a single engine-step card. `cls` sets the grid-column span;
   `align="right"` right-aligns the content on desktop (used for the
   right-hand cards so they mirror inward toward the centred logo). */
function StepCard({
  s,
  cls,
  align = "left",
}: {
  s: EngineStep;
  cls: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`${cls}${align === "right" ? " eng-right" : ""}`}
      style={{
        background: "oklch(38% 0.07 315 / 0.5)",
        border: "1px solid oklch(74% 0.1 230 / 0.25)",
        borderRadius: "var(--r-md)",
        padding: "22px 20px",
      }}
    >
      <div
        className="step-icon-tile"
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
      <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "1rem", color: "white", marginBottom: 6 }}>
        {s.title}
      </div>
      <p style={{ color: "oklch(82% 0.03 310)", fontSize: "0.85rem", margin: 0, lineHeight: 1.55 }}>{s.copy}</p>
    </div>
  );
}

/* ── Portfolio rail — horizontal snap scroller mirroring MoreInitiativesSection ── */
function PortfolioRail({
  cards,
  moreCount,
  lang,
}: {
  cards: InitiativeDTO[];
  moreCount: number;
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

  // Trailing card: prefer a "see more" link when more initiatives exist,
  // otherwise a "coming soon" filler when only a single card is shown.
  const showSeeMore = moreCount > 0;
  const showFiller = !showSeeMore && cards.length === 1;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          className="label-tag"
          style={{ color: "oklch(82% 0.09 230)", margin: 0 }}
        >
          {bg ? "Нашето портфолио" : "Our portfolio"}
        </div>
        {showArrows && (
          <div style={{ display: "flex", gap: 10 }}>
            <RailArrow dir="prev" disabled={atStart} onClick={() => scrollByCards(-1)} label={bg ? "Назад" : "Back"} />
            <RailArrow dir="next" disabled={atEnd} onClick={() => scrollByCards(1)} label={bg ? "Напред" : "Forward"} />
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
        {cards.map((it) => (
          <div key={it.id} style={{ flex: "0 0 300px", width: 300, scrollSnapAlign: "start" }}>
            <InitiativeCard initiative={it} lang={lang} showPlannedBadge={it.status === "planned"} />
          </div>
        ))}

        {showSeeMore && (
          <Link
            href="/initiatives"
            className="rail-seemore"
            style={{
              flex: "0 0 300px",
              width: 300,
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 14,
              padding: "32px 24px",
              borderRadius: "var(--r-lg)",
              background: "linear-gradient(145deg, var(--plum-lt) 0%, var(--caramel-lt) 100%)",
              border: "1px dashed oklch(78% 0.06 52)",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "var(--caramel)", transform: "scale(1.6)" }}>
              <IconArrow />
            </span>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--plum)",
                lineHeight: 1.15,
              }}
            >
              {bg
                ? `Още ${moreCount} ${moreCount === 1 ? "инициатива" : "инициативи"}`
                : `+${moreCount} more ${moreCount === 1 ? "initiative" : "initiatives"}`}
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--caramel)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {bg ? "Виж всички" : "See all"} →
            </span>
          </Link>
        )}

        {showFiller && (
          <div
            className="rail-filler"
            style={{
              flex: "1 1 300px",
              minWidth: 300,
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 12,
              padding: "32px 24px",
              borderRadius: "var(--r-lg)",
              background: "linear-gradient(145deg, var(--plum-lt) 0%, var(--caramel-lt) 100%)",
              border: "1px dashed oklch(78% 0.06 52)",
            }}
          >
            <span style={{ color: "var(--caramel)", transform: "scale(1.8)" }}>
              <IconStar />
            </span>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.05rem", fontWeight: 700, color: "var(--plum)", margin: 0 }}>
              {bg ? "Още инициативи предстоят" : "More initiatives on the way"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", margin: 0, maxWidth: 240 }}>
              {bg
                ? "Тепърва започваме — очаквайте нови проекти за Пловдив скоро."
                : "We've just started — expect new projects for Plovdiv very soon."}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <Link
          href="/initiatives"
          className="btn justify-center"
          style={{ background: "transparent", color: "white", border: "2px solid oklch(100% 0 0 / 0.3)" }}
        >
          {bg ? "Виж всички инициативи" : "See all initiatives"}
          <IconArrow />
        </Link>
      </div>
    </>
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

export default function MissionSection({
  cards,
  moreCount = 0,
}: {
  cards: InitiativeDTO[];
  moreCount?: number;
}) {
  const lang = useAtomValue(langAtom);
  const bg = lang === "bg";

  const engine: EngineStep[] = bg
    ? [
        { icon: <IconTarget />, title: "Избираме каузата", copy: "Свързана с Пловдив, тепетата и младите хора." },
        { icon: <IconPartners />, title: "Намираме партньори", copy: "Организации, които реализират на терен." },
        { icon: <IconCoins />, title: "Осигуряваме съфинансиране", copy: "Спонсори и партньори, за да умножим всеки лев." },
        { icon: <IconReport />, title: "Отчитаме прозрачно", copy: "Какво обещахме, какво направихме, какво вложихме." },
      ]
    : [
        { icon: <IconTarget />, title: "We choose the cause", copy: "Tied to Plovdiv, its hills and young people." },
        { icon: <IconPartners />, title: "We find partners", copy: "Organisations that get it built on the ground." },
        { icon: <IconCoins />, title: "We secure co-funding", copy: "Sponsors and partners to multiply every lev." },
        { icon: <IconReport />, title: "We report openly", copy: "What we promised, did, and put in." },
      ];

  return (
    <section
      id="impact"
      className="section-spacing"
      style={{
        background: "var(--plum)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Solid silhouette logo watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -60,
          bottom: -10,
          width: "50vw",
          maxWidth: 350,
          minWidth: 250,
          aspectRatio: "1 / 1",
          backgroundColor: "rgb(82, 51, 95)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          maskImage: "url(/logo-nav.png)",
          maskSize: "contain",
          maskPosition: "center",
          maskRepeat: "no-repeat",
        }}
      />

      {/* Hills motif */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 0 }}
      >
        <path d="M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z" fill="rgb(82, 51, 95)" />
      </svg>

      {/* Sky glow blob — transparency accent */}
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
          zIndex: 0,
        }}
      />

      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header — introduce ТЕПЕ bite Impact ── */}
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
          <div className="section-divider" style={{ background: "var(--caramel)" }} />
          <div className="label-tag" style={{ color: "oklch(82% 0.09 230)", marginBottom: 20 }}>
            {bg ? "Нашата мисия" : "Our Mission"}
          </div>

          <h2 className="heading-lg" style={{ color: "white", margin: "0 auto 18px", maxWidth: 720 }}>
            {bg ? "Всяко барче захранва " : "Every bar powers "}
            <span style={{ color: "var(--caramel)" }}>
              ТЕПЕ bite{" "}
              <span style={{ fontFamily: "var(--font-brush)", fontWeight: 1000, lineHeight: 1 }}>Impact</span>
            </span>
          </h2>

          <p style={{ color: "oklch(90% 0.03 310)", fontSize: "1.08rem", margin: "0 auto", maxWidth: 700 }}>
            {bg
              ? "Под името ТЕПЕ bite Impact реализираме всяка социална инициатива за Пловдив — за градските пространства и тепетата, за общността и младите хора. Не спираме до дарение: избираме каузата, намираме партньори и съфинансиране и реализираме — за да извлечем максимума от всеки лев."
              : "Under the name ТЕПЕ bite Impact we deliver every social initiative for Plovdiv — for its public spaces and hills, for the community and young people. We don't stop at a donation: we choose the cause, find partners and co-funding, and get it built — to get the most out of every lev."}
          </p>
        </div>

        {/* ── The engine — 4 steps with the Impact logo centred among them ── */}
        <div className="mission-engine">
          <StepCard s={engine[0]} cls="eng-cell" />

          {/* Impact logo lockup on a light plate so it reads on plum */}
          <div className="eng-logo">
            <Image
              src="/brand/TEPEbiteImpact-crop.png"
              alt="ТЕПЕ bite Impact"
              width={400}
              height={160}
              style={{ height: "clamp(40px, 7vw, 56px)", width: "auto", display: "block" }}
            />
          </div>

          <StepCard s={engine[1]} cls="eng-cell" align="right" />
          <StepCard s={engine[2]} cls="eng-cell-wide" />
          <StepCard s={engine[3]} cls="eng-cell-wide" align="right" />
        </div>

        {/* ── Pledge lockup ── */}
        <div className="mission-pledge">
          <PledgeHeart size={72} fill="var(--caramel)" textColor="white" />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "white",
                lineHeight: 1.1,
              }}
            >
              {PLEDGE_EUR.toFixed(2)} €{" "}
              <span style={{ color: "var(--caramel)" }}>{bg ? "от всяко барче" : "from every bar"}</span>
            </div>
            <p style={{ color: "oklch(82% 0.03 310)", fontSize: "0.98rem", margin: "8px 0 0", maxWidth: 480 }}>
              {bg
                ? "С всяка покупка допринасяш с 15 цента за видими социални инициативи в Пловдив."
                : "Every purchase contributes 15 cents to visible social initiatives in Plovdiv."}
            </p>
          </div>
        </div>

        {/* ── Learn about the policy ── */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(28px, 4vw, 40px)" }}>
          <Link href="/impact" className="btn btn-sky justify-center">
            {bg ? "Разбери повече за политиката ни" : "Learn more about our policy"}
            <IconArrow />
          </Link>
        </div>

        {/* ── Portfolio rail ── */}
        {cards.length > 0 && (
          <div style={{ marginTop: "clamp(48px, 7vw, 80px)" }}>
            <PortfolioRail cards={cards} moreCount={moreCount} lang={lang} />
          </div>
        )}
      </div>

      <style>{`
        .rail-scroller::-webkit-scrollbar { display: none; }
        .mission-engine {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
          align-items: stretch;
          margin: clamp(36px, 5vw, 48px) auto 0;
          max-width: 980px;
        }
        .eng-cell { grid-column: span 2; }
        .eng-cell-wide { grid-column: span 3; }
        .eng-right { text-align: right; }
        .eng-right .step-icon-tile { margin-left: auto; }
        .eng-logo {
          grid-column: span 2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: var(--r-md);
          padding: 16px 22px;
          box-shadow: var(--shadow-lg);
        }
        .mission-pledge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: clamp(40px, 6vw, 60px) auto 0;
          max-width: 720px;
        }
        @media (max-width: 560px) {
          .mission-engine { grid-template-columns: 1fr !important; }
          .eng-cell, .eng-cell-wide, .eng-logo { grid-column: span 1 !important; }
          .eng-right { text-align: left; }
          .eng-right .step-icon-tile { margin-left: 0; }
          .eng-logo { order: -1; }
          .mission-pledge { flex-direction: column; text-align: center; gap: 14px; }
          .mission-pledge > div { text-align: center !important; }
        }
      `}</style>
    </section>
  );
}
