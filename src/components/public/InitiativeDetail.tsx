"use client";

import { IconArrow, IconCheck, IconLink, IconMap, IconShop } from "@/components/icons";
import {
  CategoryChip,
  FreezeNote,
  StatusBadge,
  StarBadge,
  CompletedDateBadge,
  formatDate,
  pick,
  INFLOW_PHASE_LABELS,
  INFLOW_SOURCE_LABELS,
  ARRANGED_TYPE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
} from "@/components/public/impactUi";
import {
  PhaseBarMini,
  PhaseBreakdown,
  FundingSplitBar,
  inflowPhaseTotals,
} from "@/components/public/PhaseBreakdown";
import type { InitiativeDetail as InitiativeDetailData } from "@/lib/public/initiatives";
import type { InflowDTO, PartnerDTO } from "@/lib/dashboard/dto";
import { formatDualMoney, formatMoneyEUR } from "@/lib/money";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/* clock icon (upcoming milestones) */
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

/* ═══ HERO ═══ */
function Hero({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const i = detail.initiative;
  const title = pick(lang, i.titleBg, i.titleEn);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(340px, 48vw, 540px)",
        overflow: "hidden",
        background: "var(--plum)",
      }}
    >
      {i.coverImage ? (
        <Image
          src={i.coverImage.url}
          alt={title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", opacity: 0.72 }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 60%, oklch(52% 0.13 40) 100%)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(32,22,42,0.9) 0%, rgba(32,22,42,0.25) 55%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(24px, 5vw, 56px) clamp(20px, 5vw, 80px)",
        }}
      >
        <div className="section-inner">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <StatusBadge status={i.status} lang={lang} />
            {i.category && <CategoryChip category={i.category} lang={lang} />}
            {i.status === "done" && (
              <CompletedDateBadge dateISO={i.completionDateISO} lang={lang} />
            )}
          </div>
          <h1 className="heading-xl" style={{ color: "white", maxWidth: 800 }}>
            {title}
          </h1>
          {(i.locationBg || i.locationEn) && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "rgba(255,255,255,0.88)",
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              <span style={{ display: "inline-flex" }}>
                <IconMap />
              </span>
              {pick(lang, i.locationBg, i.locationEn)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ KEY FACTS + DESCRIPTION ═══ */
function Intro({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const desc = pick(lang, i.descriptionBg, i.descriptionEn);
  const isDone = i.status === "done";

  const facts: [string, string][] = [];
  if (i.locationBg || i.locationEn)
    facts.push([bg ? "Локация" : "Location", pick(lang, i.locationBg, i.locationEn)]);
  if (isDone) {
    if (i.spentCents > 0)
      facts.push([bg ? "Похарчени средства" : "Amount spent", formatMoneyEUR(i.spentCents)]);
  } else {
    if (i.expectedCostCents > 0)
      facts.push([bg ? "Очаквана цена" : "Expected cost", formatMoneyEUR(i.expectedCostCents)]);
    if (i.status === "in_progress") {
      const available = inflowPhaseTotals(i.inflows).available;
      facts.push([
        bg ? "Налични средства" : "Available funds",
        formatMoneyEUR(available),
      ]);
    }
  }

  return (
    <section
      style={{
        background: "var(--bg)",
        paddingTop: "clamp(32px, 4vw, 52px)",
        paddingBottom: "clamp(32px, 4vw, 52px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      <div className="section-inner" style={{ maxWidth: 900 }}>
        <Link
          href="/initiatives/all"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.86rem",
            fontWeight: 600,
            color: "var(--text-mid)",
            textDecoration: "none",
            marginBottom: 28,
          }}
        >
          ← {bg ? "Всички инициативи" : "All initiatives"}
        </Link>

        {i.status === "frozen" && (
          <div style={{ marginBottom: 24 }}>
            <FreezeNote
              reasonBg={i.frozenReasonBg}
              reasonEn={i.frozenReasonEn}
              lang={lang}
            />
          </div>
        )}

        <div
          className="intro-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: facts.length ? "1.6fr 1fr" : "1fr",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-mid)", whiteSpace: "pre-line" }}>
            {desc}
          </div>

          {facts.length > 0 && (
            <div className="card" style={{ padding: "22px 24px" }}>

              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-soft)",
                  marginBottom: 12,
                }}
              >
                {bg ? "Ключови факти" : "Key facts"}
              </div>
              {facts.map(([k, v], idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "9px 0",
                    borderBottom:
                      idx < facts.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{k}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--plum)",
                      fontSize: "0.85rem",
                      textAlign: "right",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .intro-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══ GALLERY + LIGHTBOX ═══ */
function Gallery({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const bg = lang === "bg";
  const gallery = detail.initiative.gallery;
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback(
    (idx: number) => setOpen(((idx % gallery.length) + gallery.length) % gallery.length),
    [gallery.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") show(open + 1);
      else if (e.key === "ArrowLeft") show(open - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, show]);

  if (gallery.length === 0) return null;
  const current = open !== null ? gallery[open] : null;

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div className="label-tag" style={{ marginBottom: 12 }}>
          {bg ? "Галерия" : "Gallery"}
        </div>
        <h2 className="heading-lg" style={{ marginBottom: 28 }}>
          {bg ? "От терена" : "From the ground"}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {gallery.map((g, idx) => (
            <button
              key={g.id}
              type="button"
              onClick={() => show(idx)}
              className="card-hover"
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                cursor: "pointer",
                padding: 0,
                background: "var(--surface2)",
              }}
              aria-label={
                pick(lang, g.captionBg, g.captionEn) ||
                (bg ? `Снимка ${idx + 1}` : `Photo ${idx + 1}`)
              }
            >
              <Image
                src={g.url}
                alt={pick(lang, g.captionBg, g.captionEn)}
                fill
                sizes="(max-width: 760px) 50vw, 240px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(20,12,26,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 48px)",
            animation: "page-fade-in 0.2s ease both",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* close */}
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label={bg ? "Затвори" : "Close"}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.14)",
              color: "white",
              fontSize: "1.4rem",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          {gallery.length > 1 && (
            <>
              <LightboxNav dir="prev" onClick={(e) => { e.stopPropagation(); show(open! - 1); }} label={bg ? "Предишна" : "Previous"} />
              <LightboxNav dir="next" onClick={(e) => { e.stopPropagation(); show(open! + 1); }} label={bg ? "Следваща" : "Next"} />
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 1100,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "min(72vh, 760px)",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Image
                src={current.url}
                alt={pick(lang, current.captionBg, current.captionEn)}
                fill
                sizes="100vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.88rem",
                gap: 16,
              }}
            >
              <span>{pick(lang, current.captionBg, current.captionEn)}</span>
              <span style={{ flexShrink: 0, opacity: 0.7 }}>
                {open! + 1} / {gallery.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function LightboxNav({
  dir,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir === "prev" ? "left" : "right"]: "clamp(8px, 2vw, 28px)",
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "none",
        background: "rgba(255,255,255,0.14)",
        color: "white",
        fontSize: "1.5rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as React.CSSProperties}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

/* ═══ MILESTONE TIMELINE ═══ */
function Progress({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const bg = lang === "bg";
  const steps = detail.initiative.steps;
  if (steps.length === 0) return null;

  const doneCount = steps.filter((s) => s.done).length;
  const currentIdx = detail.initiative.currentStepIndex;

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div className="label-tag" style={{ marginBottom: 12 }}>
          {bg ? "Прозрачност" : "Transparency"}
        </div>
        <h2 className="heading-lg" style={{ marginBottom: 8 }}>
          {bg ? "Докъде сме стигнали" : "Where we are now"}
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-soft)", marginBottom: 40 }}>
          {doneCount}/{steps.length} {bg ? "стъпки завършени" : "steps completed"}
        </p>

        <div
          className="progress-cta-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(260px, 0.9fr)",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "center",
          }}
        >
          {/* Timeline */}
          <div>
            {steps.map((s, i) => {
              const isCurrent = i === currentIdx && !s.done;
              const label = pick(lang, s.labelBg, s.labelEn);
              const detailText = pick(lang, s.detailBg, s.detailEn);
              return (
                <div key={s.id} style={{ display: "flex", gap: 18 }}>
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
                        background: s.done
                          ? "var(--caramel)"
                          : isCurrent
                            ? "var(--plum)"
                            : "var(--surface2)",
                        border: s.done || isCurrent ? "none" : "2px solid var(--plum-mid)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: s.done || isCurrent ? "white" : "var(--plum-mid)",
                      }}
                    >
                      {s.done ? <IconCheck /> : <IconClock />}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 22,
                          background: s.done ? "oklch(76% 0.10 52)" : "var(--border)",
                          margin: "3px 0",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        paddingTop: 6,
                        marginBottom: detailText ? 5 : 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: s.done || isCurrent ? "var(--text)" : "var(--plum-mid)",
                        }}
                      >
                        {label}
                      </span>
                      {s.done && s.completedDateISO && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "var(--caramel-lt)",
                            color: "oklch(44% 0.13 55)",
                            borderRadius: 100,
                            padding: "2px 10px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                          }}
                        >
                          <IconCheck />
                          {formatDate(s.completedDateISO, lang)}
                        </span>
                      )}
                      {isCurrent && (
                        <span
                          style={{
                            background: "var(--plum-lt)",
                            color: "var(--plum)",
                            borderRadius: 100,
                            padding: "2px 10px",
                            fontSize: "0.64rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {bg ? "Текуща" : "Current"}
                        </span>
                      )}
                    </div>
                    {detailText && (
                      <p
                        style={{
                          fontSize: "0.87rem",
                          color: s.done ? "var(--text-mid)" : "var(--text-soft)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {detailText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Product CTA */}
          <div
            className="progress-cta"
            style={{
              background:
                "linear-gradient(150deg, var(--plum) 0%, var(--plum-mid) 70%, oklch(52% 0.13 40) 100%)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(26px, 3vw, 34px)",
              color: "white",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: -70,
                right: -50,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "oklch(66% 0.16 52 / 0.28)",
                filter: "blur(50px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                className="label-tag"
                style={{ color: "oklch(88% 0.08 52)", marginBottom: 12 }}
              >
                {bg ? "Задвижи промяната" : "Power the change"}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.3,
                  marginBottom: 12,
                }}
              >
                {bg
                  ? "Всяко барче приближава тази инициатива до финала"
                  : "Every bar brings this initiative closer to done"}
              </h3>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  color: "oklch(90% 0.03 310)",
                  marginBottom: 22,
                }}
              >
                {bg
                  ? "Фиксираните 0.15 € от всяко барче влизат във фонда, който захранва точно такива проекти. Вземи ТЕПЕ bite от партниращ обект."
                  : "The fixed 0.15 € from every bar goes into the fund that powers projects exactly like this one. Grab a ТЕПЕ bite at a partnering spot."}
              </p>
              <Link
                href="/partnering-locations"
                className="btn btn-caramel"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <IconShop />
                {bg ? "Къде да купя" : "Where to buy"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .progress-cta-grid { grid-template-columns: 1fr !important; }
          .progress-cta { position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══ PARTNERS ═══ */
function partnerTotals(inflows: InflowDTO[], partnerId: string) {
  return inflowPhaseTotals(
    inflows.filter((f) => f.source === "partner" && f.partnerId === partnerId),
  );
}

function Partners({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const bg = lang === "bg";
  const list = detail.initiative.partners
    .map((p) => ({ link: p, partner: detail.partnersById[p.partnerId] as PartnerDTO | undefined }))
    .filter((x) => x.partner)
    .sort((a, b) => {
      if (a.partner!.isStarPartner !== b.partner!.isStarPartner)
        return a.partner!.isStarPartner ? -1 : 1;
      return 0;
    });

  if (list.length === 0) return null;

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <div className="label-tag" style={{ marginBottom: 12 }}>
          {bg ? "Заедно" : "Together"}
        </div>
        <h2 className="heading-lg" style={{ marginBottom: 28 }}>
          {bg ? "Партньори по инициативата" : "Initiative partners"}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {list.map(({ link, partner }) => {
            const name = pick(lang, partner!.nameBg, partner!.nameEn);
            const contribution = pick(lang, link.contributionBg, link.contributionEn);
            const financial = partnerTotals(detail.initiative.inflows, partner!.id);
            const typeLabel = PARTNERSHIP_TYPE_LABELS[link.partnershipType];
            return (
              <div
                key={link.id}
                className="card"
                style={{ padding: "22px 24px", display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <span
                    style={{
                      position: "relative",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "var(--plum-lt)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {partner!.image ? (
                      <Image src={partner!.image.url} alt={name} fill sizes="48px" style={{ objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--plum)" }}>
                        {name.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--plum)", fontSize: "1.02rem" }}>
                        {name}
                      </span>
                      {partner!.isStarPartner && <StarBadge lang={lang} compact />}
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        background: "var(--plum-lt)",
                        color: "var(--plum)",
                        borderRadius: 100,
                        padding: "2px 10px",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {lang === "en" ? typeLabel.en : typeLabel.bg}
                    </span>
                  </div>
                </div>

                {contribution && (
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-mid)", margin: "0 0 12px" }}>
                    {contribution}
                  </p>
                )}

                <div style={{ marginTop: "auto" }}>
                  {financial.total > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <PhaseBarMini
                        totals={financial}
                        lang={lang}
                        label={bg ? "Финансов принос" : "Financial support"}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      alignItems: "center",
                      paddingTop: 14,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                  <Link
                    href={`/initiatives/partners/${partner!.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: "var(--plum)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                    }}
                  >
                    {bg ? "Профил" : "Profile"} <IconArrow />
                  </Link>
                  {partner!.links.website && (
                    <a
                      href={partner!.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        color: "var(--text-mid)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                      }}
                    >
                      <IconLink /> {bg ? "Уебсайт" : "Website"}
                    </a>
                  )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ FINANCES ═══ */
const SOURCE_ACCENT: Record<InflowDTO["source"], string> = {
  impact_fund: "var(--sky-dk)",
  partner: "var(--caramel)",
  external_other: "var(--text-soft)",
};

/* Name/link for the source (partner names link to their profile); category badge shown separately. */
function InflowSourceName({
  f,
  detail,
  lang,
}: {
  f: InflowDTO;
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const nameStyle: React.CSSProperties = { fontWeight: 700, color: "var(--plum)", fontSize: "0.95rem" };
  if (f.source === "partner") {
    const p = f.partnerId ? detail.partnersById[f.partnerId] : undefined;
    if (p)
      return (
        <Link
          href={`/initiatives/partners/${p.slug}`}
          style={{ ...nameStyle, textDecoration: "underline", textDecorationColor: "var(--border)", textUnderlineOffset: 3 }}
        >
          {pick(lang, p.nameBg, p.nameEn)}
        </Link>
      );
    return <span style={nameStyle}>{INFLOW_SOURCE_LABELS.partner[lang === "en" ? "en" : "bg"]}</span>;
  }
  if (f.source === "impact_fund")
    return <span style={nameStyle}>{INFLOW_SOURCE_LABELS.impact_fund[lang === "en" ? "en" : "bg"]}</span>;
  const custom = pick(lang, f.sourceLabelBg, f.sourceLabelEn);
  return (
    <span style={nameStyle}>
      {custom || INFLOW_SOURCE_LABELS.external_other[lang === "en" ? "en" : "bg"]}
    </span>
  );
}

const PHASE_ACCENT: Record<InflowDTO["phase"], string> = {
  planned: "var(--sky-dk)",
  arranged: "var(--caramel)",
  available: "oklch(52% 0.12 150)",
};

const financeSubHeading: React.CSSProperties = {
  fontFamily: "var(--font-head)",
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "var(--plum)",
  marginBottom: 16,
};

function Finances({ detail, lang }: { detail: InitiativeDetailData; lang: Lang }) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const inflows = i.inflows;
  if (inflows.length === 0 && i.expectedCostCents === 0) return null;

  const pt = inflowPhaseTotals(inflows);
  const isDone = i.status === "done";

  // Funding source split (all phases): ТЕПЕ bite Impact vs partnering orgs + external.
  let impactCents = 0;
  let partnersCents = 0;
  for (const f of inflows) {
    if (f.source === "impact_fund") impactCents += f.amountCents;
    else partnersCents += f.amountCents;
  }

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div className="label-tag" style={{ marginBottom: 12 }}>
          {bg ? "Финанси" : "Finances"}
        </div>
        <h2 className="heading-lg" style={{ marginBottom: 28 }}>
          {bg ? "Всяко евро, открито" : "Every euro, in the open"}
        </h2>

        {/* summary: expected/spent + phase breakdown + funding split */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30, marginBottom: 40 }}>
          {(i.expectedCostCents > 0 || (isDone && i.spentCents > 0)) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {i.expectedCostCents > 0 && (
                <PhaseStat
                  label={bg ? "Очаквана цена" : "Expected cost"}
                  value={formatMoneyEUR(i.expectedCostCents)}
                  hint={bg ? "обща цел за проекта" : "total project target"}
                  accent="var(--plum-mid)"
                />
              )}
              {isDone && i.spentCents > 0 && (
                <PhaseStat
                  label={bg ? "Похарчени средства" : "Amount spent"}
                  value={formatMoneyEUR(i.spentCents)}
                  hint={bg ? "вложени в проекта" : "invested in the project"}
                  accent="oklch(52% 0.12 150)"
                />
              )}
            </div>
          )}

          {pt.total > 0 && (
            <div>
              <h3 style={financeSubHeading}>
                {bg ? "Средства по фази" : "Funds by phase"}
              </h3>
              <PhaseBreakdown
                totals={pt}
                lang={lang}
                note={
                  bg
                    ? `Общо ${formatMoneyEUR(pt.total)} обвързани средства за тази инициатива.`
                    : `${formatMoneyEUR(pt.total)} committed to this initiative in total.`
                }
              />
            </div>
          )}

          {impactCents + partnersCents > 0 && (
            <div>
              <h3 style={financeSubHeading}>
                {bg ? "Откъде идва финансирането" : "Where the funding comes from"}
              </h3>
              <FundingSplitBar
                impactCents={impactCents}
                partnersCents={partnersCents}
                lang={lang}
              />
            </div>
          )}
        </div>

        {/* per-record */}
        {inflows.length > 0 && (
          <>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--plum)",
                marginBottom: 18,
              }}
            >
              {bg ? "Откъде идва всяко евро" : "Where every euro comes from"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {inflows.map((f) => {
                const phaseLabel = INFLOW_PHASE_LABELS[f.phase][bg ? "bg" : "en"];
                const arranged =
                  f.phase === "arranged" && f.arrangedType
                    ? ARRANGED_TYPE_LABELS[f.arrangedType][bg ? "bg" : "en"]
                    : null;
                const note = pick(lang, f.noteBg, f.noteEn);
                return (
                  <div
                    key={f.id}
                    className="card"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <InflowSourceName f={f} detail={detail} lang={lang} />
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "var(--surface2)",
                            borderRadius: 100,
                            padding: "2px 10px",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: SOURCE_ACCENT[f.source],
                          }}
                        >
                          {INFLOW_SOURCE_LABELS[f.source][bg ? "bg" : "en"]}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "var(--surface2)",
                            borderRadius: 100,
                            padding: "2px 10px",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: PHASE_ACCENT[f.phase],
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: PHASE_ACCENT[f.phase] }} />
                          {phaseLabel}
                          {arranged ? ` · ${arranged}` : ""}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>
                        {formatDate(f.dateISO, lang)}
                        {note ? ` · ${note}` : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        color: "var(--caramel)",
                        fontSize: "1.05rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDualMoney(f.amountCents)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function PhaseStat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <div className="card" style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: accent }}
      />
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
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 700, color: "var(--plum)" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-mid)", marginTop: 4 }}>{hint}</div>
    </div>
  );
}

/* ═══ PAGE ═══ */
export default function InitiativeDetail({ detail }: { detail: InitiativeDetailData }) {
  const lang = useAtomValue(langAtom);
  return (
    <main>
      <Hero detail={detail} lang={lang} />
      <Intro detail={detail} lang={lang} />
      <Gallery detail={detail} lang={lang} />
      <Progress detail={detail} lang={lang} />
      <Partners detail={detail} lang={lang} />
      <Finances detail={detail} lang={lang} />
    </main>
  );
}
