"use client";

import { IconArrow, IconExternal, IconStar } from "@/components/icons";
import InitiativeCard from "@/components/public/InitiativeCard";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import {
  PhaseBreakdown,
  type PhaseTotals,
} from "@/components/public/PhaseBreakdown";
import { formatDate, pick, StatusBadge } from "@/components/public/impactUi";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { formatMoneyBGN, formatMoneyEUR } from "@/lib/money";
import type { OverviewData } from "@/lib/public/initiatives";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── small building blocks ───────────────────────────────────────────────── */

function SectionHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div style={{ marginBottom: 36, maxWidth: 640 }}>
      <div className="label-tag" style={{ marginBottom: 12 }}>
        {label}
      </div>
      <h2 className="heading-lg" style={{ marginBottom: intro ? 12 : 0 }}>
        {title}
      </h2>
      {intro && <p style={{ fontSize: "1rem", margin: 0 }}>{intro}</p>}
    </div>
  );
}

const GRID_COLS = "repeat(auto-fill, minmax(300px, 1fr))";

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: GRID_COLS, gap: 24 }}>
      {children}
    </div>
  );
}

/* Grid that lets an optional filler card grow to finish the last row — it spans
   whatever columns remain, so an under-filled section still reads as complete. */
function FillGrid({
  count,
  filler,
  children,
}: {
  count: number;
  filler?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const tc = getComputedStyle(el).gridTemplateColumns;
      setCols(tc ? tc.split(" ").length : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rem = count % cols;
  const span = rem === 0 ? cols : cols - rem;

  return (
    <div
      ref={ref}
      style={{ display: "grid", gridTemplateColumns: GRID_COLS, gap: 24 }}
    >
      {children}
      {filler && <div style={{ gridColumn: `span ${span}` }}>{filler}</div>}
    </div>
  );
}

function CountPill({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 9,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 100,
        padding: "8px 18px",
        boxShadow: "var(--shadow)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "var(--caramel)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "0.82rem",
          color: "var(--text-mid)",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── background carousel layer: recently completed initiatives ──────────── */

function HeroBackground({
  items,
  idx,
}: {
  items: InitiativeDTO[];
  idx: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {items.map((it, i) => (
        <div
          key={it.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "scale(1.05)" : "scale(1)",
            transition: "opacity 1.4s ease, transform 7s ease",
          }}
        >
          {it.coverImage ? (
            <Image
              src={it.coverImage.url}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 100%)",
              }}
            />
          )}
        </div>
      ))}
      {/* legibility scrim: darker top & bottom, lighter middle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(24,14,32,0.82) 0%, rgba(24,14,32,0.5) 30%, rgba(24,14,32,0.55) 62%, rgba(24,14,32,0.9) 100%)",
        }}
      />
    </div>
  );
}

/* ─── funds-by-phase panel (reused: inside hero on desktop, standalone on mobile) */

function FundsPanel({
  totals,
  lang,
  onDark,
}: {
  totals: PhaseTotals;
  lang: Lang;
  onDark: boolean;
}) {
  const bg = lang === "bg";
  return (
    <div
      className="card"
      style={{
        padding: "clamp(22px, 3vw, 30px)",
        maxWidth: 680,
        width: "100%",
        margin: "0 auto",
        background: onDark ? "rgba(255,255,255,0.96)" : "var(--surface)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-soft)",
          }}
        >
          {bg ? "Осигорено финансиране" : "Aquired funding"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.05rem",
            fontWeight: 800,
            color: "var(--plum)",
          }}
        >
          {formatMoneyEUR(totals.total)}
        </span>
      </div>
      <PhaseBreakdown
        totals={totals}
        lang={lang}
        note={
          bg
            ? "От реално налични до планирани — проследимо по всяко време."
            : "From actually available to planned — traceable at any time."
        }
      />
    </div>
  );
}

/* ─── top stats band (full-height hero) ───────────────────────────────────── */

function TopBand({ data, lang }: { data: OverviewData; lang: Lang }) {
  const bg = lang === "bg";
  const { stats, recentlyCompleted } = data;
  const invested = stats.investedTotalCents;
  const totals = {
    available: invested,
    arranged: stats.arrangedTotalCents,
    planned: stats.plannedTotalCents,
    total: invested + stats.arrangedTotalCents + stats.plannedTotalCents,
    recordCount: 0,
  };
  const hasFinance = totals.total > 0;
  const hasCarousel = recentlyCompleted.length > 0;

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (recentlyCompleted.length <= 1) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % recentlyCompleted.length),
      6000,
    );
    return () => clearInterval(t);
  }, [recentlyCompleted.length]);
  const current = recentlyCompleted[idx];

  const pills: { value: number | string; label: string }[] = [];
  if (stats.realisedCount > 0)
    pills.push({
      value: stats.realisedCount,
      label: bg ? "завършени инициативи" : "completed initiatives",
    });
  if (data.byStatus.in_progress.length > 0)
    pills.push({
      value: data.byStatus.in_progress.length,
      label: bg ? "инициатива в прогрес" : "initiative in motion",
    });
  if (stats.partnerCount > 0)
    pills.push({
      value: stats.partnerCount,
      label: bg ? "партньори" : "partners",
    });

  const onDark = hasCarousel;
  const mutedText = onDark ? "rgba(255,255,255,0.85)" : "var(--text-mid)";
  const labelColor = onDark ? "oklch(88% 0.06 52)" : "var(--sky-dk)";
  const headText = onDark ? "white" : "var(--text)";
  const numberGlow = onDark ? "0 2px 24px rgba(0,0,0,0.35)" : "none";

  return (
    <>
      <section
        className="impact-hero"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: onDark
            ? "var(--plum)"
            : "radial-gradient(ellipse 62% 60% at 22% 15%, oklch(90% 0.05 230 / 0.5), transparent), radial-gradient(ellipse 55% 50% at 95% 90%, oklch(92% 0.06 52 / 0.4), transparent), var(--bg)",
        }}
      >
        {hasCarousel && <HeroBackground items={recentlyCompleted} idx={idx} />}

        {/* main content — copy + funds panel, vertically centred as a group */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(30px, 4vw, 48px)",
            paddingTop: 128,
            paddingBottom: hasCarousel ? 16 : "clamp(40px, 5vw, 64px)",
            paddingLeft: "clamp(20px, 5vw, 80px)",
            paddingRight: "clamp(20px, 5vw, 80px)",
          }}
        >
          {/* copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 760,
            }}
          >
            <div
              className="label-tag"
              style={{ color: labelColor, marginBottom: 16 }}
            >
              {bg ? "Нашето въздействие" : "Our impact"}
            </div>

            {invested > 0 ? (
              <>
                <p
                  className="heading-md"
                  style={{ margin: 0, color: headText, fontWeight: 600 }}
                >
                  {bg ? "Вложихме" : "We've invested"}
                </p>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    margin: "4px 0 6px",
                  }}
                >
                  {/* soft grounded glow behind the lower half of the number —
                    frosts the busy carousel so the figure pops, no hard underline */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-3%",
                      right: "-3%",
                      bottom: "9%",
                      height: "40%",
                      borderRadius: 999,
                      background: onDark
                        ? "rgba(18,10,26,0.34)"
                        : "oklch(92% 0.06 52 / 0.7)",
                      backdropFilter: onDark ? "blur(16px)" : undefined,
                      WebkitBackdropFilter: onDark ? "blur(16px)" : undefined,
                      // feather the shape's own edges so it reads as a soft glow,
                      // not a defined rectangle
                      filter: "blur(7px)",
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: "clamp(3.2rem, 9vw, 6rem)",
                      lineHeight: 1.02,
                      color: "var(--caramel)",
                      textShadow: numberGlow,
                      display: "inline-block",
                    }}
                  >
                    {formatMoneyEUR(invested)}
                  </span>
                </div>
                <h1
                  className="heading-md"
                  style={{ maxWidth: 640, margin: "6px 0 0", color: headText }}
                >
                  {bg ? "в социални инициативи" : "in social initiatives"}
                </h1>
                <p
                  style={{
                    fontSize: "1.02rem",
                    color: mutedText,
                    margin: "12px 0 22px",
                  }}
                >
                  {formatMoneyBGN(invested)} ·{" "}
                  {bg
                    ? "вложени във видими проекти в Пловдив"
                    : "invested in visible projects in Plovdiv"}
                </p>
              </>
            ) : (
              <>
                <h1
                  className="heading-xl"
                  style={{ maxWidth: 780, marginBottom: 18, color: headText }}
                >
                  {bg
                    ? "Изграждаме видима промяна за Пловдив"
                    : "Building visible change for Plovdiv"}
                </h1>
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: mutedText,
                    marginBottom: 26,
                    maxWidth: 620,
                  }}
                >
                  {bg
                    ? "Всяко барче добавя фиксираните 0.15 € към фонда. Ето какво вече задвижихме — открито и проследимо."
                    : "Every bar adds the fixed 0.15 € to the fund. Here's what we've already set in motion — openly and traceably."}
                </p>
              </>
            )}

            {pills.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                {pills.map((p) => (
                  <CountPill key={p.label} value={p.value} label={p.label} />
                ))}
              </div>
            )}
          </div>

          {/* funds by phase — inside the hero on desktop (moves below on mobile) */}
          {hasFinance && (
            <div
              className="hero-funds-inline"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FundsPanel totals={totals} lang={lang} onDark={onDark} />
            </div>
          )}
        </div>

        {/* recently-completed caption strip — normal flow, never overlaps */}
        {hasCarousel && current && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              textAlign: "center",
              padding: "0 clamp(20px, 5vw, 80px) clamp(22px, 3vw, 34px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: "0.64rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(86% 0.07 52)",
              }}
            >
              <span>{bg ? "Наскоро завършено" : "Recently completed"}</span>
              {current.completionDateISO && (
                <>
                  <span aria-hidden="true" style={{ opacity: 0.5 }}>
                    ·
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {formatDate(current.completionDateISO, lang)}
                  </span>
                </>
              )}
            </div>
            <Link
              href={`/initiatives/${current.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                textDecoration: "none",
                color: "white",
              }}
            >
              <strong
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {pick(lang, current.titleBg, current.titleEn)}
              </strong>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  background: "var(--caramel)",
                  color: "white",
                  flexShrink: 0,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.28)",
                }}
              >
                <IconExternal size={13} />
              </span>
            </Link>
            {pick(lang, current.descriptionBg, current.descriptionEn) && (
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.72)",
                  margin: 0,
                  maxWidth: 520,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {pick(lang, current.descriptionBg, current.descriptionEn)}
              </p>
            )}
            {recentlyCompleted.length > 1 && (
              <div style={{ display: "flex", gap: 7, marginTop: 6 }}>
                {recentlyCompleted.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    aria-label={pick(lang, it.titleBg, it.titleEn)}
                    onClick={() => setIdx(i)}
                    style={{
                      width: i === idx ? 22 : 7,
                      height: 7,
                      borderRadius: 10,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      background:
                        i === idx ? "var(--caramel)" : "rgba(255,255,255,0.45)",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* funds by phase — standalone element below the hero on mobile, so the
          carousel image stays short and un-stretched */}
      {hasFinance && (
        <section
          className="hero-funds-below"
          style={{
            background: "var(--bg)",
            padding: "clamp(28px, 7vw, 44px) clamp(20px, 5vw, 80px)",
          }}
        >
          <FundsPanel totals={totals} lang={lang} onDark={false} />
        </section>
      )}

      <style>{`
        .impact-hero { min-height: 100svh; }
        .hero-funds-below { display: none; }
        @media (max-width: 760px) {
          .impact-hero { min-height: auto; }
          .hero-funds-inline { display: none !important; }
          .hero-funds-below { display: block; }
        }
      `}</style>
    </>
  );
}

/* ─── spotlight ───────────────────────────────────────────────────────────── */

function Spotlight({
  data,
  lang,
  background = "var(--surface)",
}: {
  data: OverviewData;
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  const f = data.featured;
  if (!f) return null;
  const title = pick(lang, f.titleBg, f.titleEn);
  const desc = pick(lang, f.descriptionBg, f.descriptionEn);
  const doneSteps = f.steps.filter((s) => s.done).length;

  return (
    <section
      className="section-spacing"
      style={{
        background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative backdrop: soft colour blobs + a hill silhouette */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            top: "-12%",
            right: "-8%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "oklch(90% 0.06 52 / 0.45)",
            filter: "blur(70px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-18%",
            left: "-10%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "oklch(88% 0.05 235 / 0.4)",
            filter: "blur(80px)",
          }}
        />
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            width: "100%",
            height: 140,
            opacity: 0.55,
          }}
        >
          <path
            d="M0 200 L0 130 Q220 60 420 110 Q650 165 880 90 Q1050 40 1200 100 L1200 200 Z"
            fill="var(--bg)"
          />
        </svg>
      </div>

      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="spotlight-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "stretch",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 320,
              background: "var(--surface2)",
            }}
          >
            {f.coverImage ? (
              <Image
                src={f.coverImage.url}
                alt={title}
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(145deg, var(--plum-lt), oklch(94% 0.05 52))",
                }}
              />
            )}
          </div>

          <div
            style={{
              padding: "clamp(28px, 3.5vw, 44px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  alignSelf: "flex-start",
                  background: "var(--caramel-lt)",
                  color: "oklch(46% 0.13 60)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{ color: "var(--caramel)", display: "inline-flex" }}
                >
                  <IconStar />
                </span>
                {bg ? "На фокус" : "In focus"}
              </div>
              <StatusBadge status={f.status} lang={lang} />
            </div>

            <h2 className="heading-lg" style={{ margin: 0 }}>
              {title}
            </h2>
            <p
              style={{
                fontSize: "0.98rem",
                lineHeight: 1.7,
                color: "var(--text-mid)",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {desc}
            </p>

            {f.steps.length > 0 &&
              f.status !== "frozen" &&
              f.status !== "planned" && (
                <div>
                  <div className="progress-track" style={{ marginBottom: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(doneSteps / f.steps.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: "0.82rem", color: "var(--text-soft)" }}
                  >
                    {doneSteps}/{f.steps.length}{" "}
                    {bg ? "стъпки завършени" : "steps completed"}
                  </span>
                </div>
              )}

            <Link
              href={`/initiatives/${f.slug}`}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
            >
              {bg ? "Разгледай инициативата" : "Explore the initiative"}{" "}
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .spotlight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── filler for under-filled grids ───────────────────────────────────────── */

function ComingSoonCard({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 12,
        padding: "32px 24px",
        minHeight: 220,
        height: "100%",
        background:
          "linear-gradient(145deg, var(--plum-lt) 0%, var(--caramel-lt) 100%)",
        border: "1px dashed oklch(78% 0.06 52)",
      }}
    >
      <span style={{ color: "var(--caramel)", transform: "scale(1.8)" }}>
        <IconStar />
      </span>
      <h3
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--plum)",
          margin: 0,
        }}
      >
        {bg ? "Още инициативи предстоят" : "More initiatives on the way"}
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-mid)",
          margin: 0,
          maxWidth: 240,
        }}
      >
        {bg
          ? "Тепърва започваме — очаквайте нови проекти за Пловдив скоро."
          : "We've just started — expect new projects for Plovdiv very soon."}
      </p>
    </div>
  );
}

/* ─── status sections ─────────────────────────────────────────────────────── */

function InProgressSection({
  data,
  lang,
  background = "var(--bg)",
}: {
  data: OverviewData;
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  const active = data.byStatus.in_progress;
  const planned = data.byStatus.planned;
  const total = active.length + planned.length;
  if (total === 0) return null;

  return (
    <section className="section-spacing" style={{ background }}>
      <div className="section-inner">
        <SectionHeader
          label={bg ? "Сега" : "Now"}
          title={bg ? "Инициативи в развитие" : "Initiatives in motion"}
          intro={
            bg
              ? "Проекти, по които работим в момента — плюс такива, които тепърва започваме."
              : "Projects we're working on right now — plus ones we're about to begin."
          }
        />
        <FillGrid
          count={total}
          filler={total < 3 ? <ComingSoonCard lang={lang} /> : undefined}
        >
          {active.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
          {planned.map((i) => (
            <InitiativeCard
              key={i.id}
              initiative={i}
              lang={lang}
              showPlannedBadge
            />
          ))}
        </FillGrid>
      </div>
    </section>
  );
}

function FinishedSection({
  data,
  lang,
  background = "var(--surface)",
}: {
  data: OverviewData;
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  const done = data.byStatus.done;
  if (done.length === 0) return null;

  return (
    <section className="section-spacing" style={{ background }}>
      <div className="section-inner">
        <SectionHeader
          label={bg ? "Постигнато" : "Achieved"}
          title={bg ? "Завършени инициативи" : "Completed initiatives"}
        />
        <FillGrid
          count={done.length}
          filler={done.length < 3 ? <ComingSoonCard lang={lang} /> : undefined}
        >
          {done.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
        </FillGrid>
      </div>
    </section>
  );
}

function FrozenSection({
  data,
  lang,
  background = "var(--bg)",
}: {
  data: OverviewData;
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  const frozen = data.byStatus.frozen;
  if (frozen.length === 0) return null;

  return (
    <section className="section-spacing" style={{ background }}>
      <div className="section-inner">
        <SectionHeader
          label={bg ? "На пауза" : "On hold"}
          title={bg ? "Замразени инициативи" : "Frozen initiatives"}
          intro={
            bg
              ? "Проекти, които са на пауза към момента — оставаме честни за причините."
              : "Projects currently on hold — we stay honest about the reasons."
          }
        />
        <CardGrid>
          {frozen.map((i) => (
            <InitiativeCard key={i.id} initiative={i} lang={lang} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

/* ─── developing / empty states ───────────────────────────────────────────── */

function DevelopingNote({
  lang,
  background = "var(--surface)",
}: {
  lang: Lang;
  background?: string;
}) {
  const bg = lang === "bg";
  return (
    <section className="section-spacing" style={{ background }}>
      <div className="section-inner">
        <div
          style={{
            background:
              "linear-gradient(145deg, var(--sky-lt) 0%, var(--caramel-lt) 100%)",
            border: "1px dashed oklch(80% 0.07 230)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(32px, 5vw, 52px)",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--plum)",
              marginBottom: 12,
            }}
          >
            {bg
              ? "Разказът за нашето въздействие тепърва се пише"
              : "The story of our impact is only beginning"}
          </h3>
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "var(--text-mid)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {bg
              ? "Скоро тук ще виждате повече завършени проекти, партньори и вложени средства — стъпка по стъпка, открито и проследимо. Благодарим, че сте с нас от самото начало."
              : "Very soon you'll see more completed projects, partners and invested funds here — step by step, openly and traceably. Thank you for being with us from the very start."}
          </p>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div
        className="section-inner"
        style={{ maxWidth: 720, textAlign: "center", margin: "0 auto" }}
      >
        <div
          style={{
            background:
              "linear-gradient(145deg, var(--plum-lt) 0%, var(--caramel-lt) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(40px, 6vw, 72px) clamp(24px, 5vw, 48px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <span style={{ color: "var(--caramel)", transform: "scale(2.2)" }}>
              <IconStar />
            </span>
          </div>
          <h2 className="heading-md" style={{ marginBottom: 14 }}>
            {bg
              ? "Нашето въздействие тепърва започва"
              : "Our impact story is just beginning"}
          </h2>
          <p
            style={{
              fontSize: "1.02rem",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              maxWidth: 520,
              margin: "0 auto 28px",
            }}
          >
            {bg
              ? "Все още подготвяме първите си инициативи. Скоро тук ще споделяме конкретни проекти за Пловдив, партньорите зад тях и всяко вложено евро — открито и проследимо."
              : "We're still preparing our first initiatives. Very soon we'll share concrete projects for Plovdiv, the partners behind them, and every euro invested — openly and traceably."}
          </p>
          <Link href="/initiatives" className="btn btn-primary">
            {bg ? "Как работят инициативите ни" : "How our initiatives work"}{" "}
            <IconArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── page ────────────────────────────────────────────────────────────────── */

export default function InitiativesOverview({ data }: { data: OverviewData }) {
  const lang = useAtomValue(langAtom);
  const { byStatus, stats, hasAnyPartner } = data;

  const sparse =
    byStatus.done.length === 0 ||
    !hasAnyPartner ||
    (byStatus.in_progress.length === 0 && byStatus.planned.length === 0) ||
    stats.investedTotalCents === 0;

  // Alternate section backgrounds, but only across sections that actually
  // render — a hidden/null section must not break the surface/bg alternation.
  const willRender = [
    !!data.featured, // Spotlight
    data.partners.length > 0, // PartnersCarousel
    byStatus.in_progress.length > 0 || byStatus.planned.length > 0, // InProgressSection
    byStatus.done.length > 0, // FinishedSection
    byStatus.frozen.length > 0, // FrozenSection
    sparse, // DevelopingNote
  ];
  const bgs: string[] = [];
  let alt = false;
  for (const shown of willRender) {
    bgs.push(alt ? "var(--bg)" : "var(--surface)");
    if (shown) alt = !alt;
  }
  const [
    bgSpotlight,
    bgPartners,
    bgInProgress,
    bgFinished,
    bgFrozen,
    bgDeveloping,
  ] = bgs;

  return (
    <main>
      <TopBand data={data} lang={lang} />
      {data.hasAnyInitiative ? (
        <>
          <Spotlight data={data} lang={lang} background={bgSpotlight} />
          <PartnersCarousel
            items={data.partners}
            lang={lang}
            background={bgPartners}
          />
          <InProgressSection
            data={data}
            lang={lang}
            background={bgInProgress}
          />
          <FinishedSection data={data} lang={lang} background={bgFinished} />
          <FrozenSection data={data} lang={lang} background={bgFrozen} />
          {sparse && <DevelopingNote lang={lang} background={bgDeveloping} />}
        </>
      ) : (
        <EmptyState lang={lang} />
      )}
    </main>
  );
}
