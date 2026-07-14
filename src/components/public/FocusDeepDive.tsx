"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrow, IconCheck, IconInfo, IconMap } from "@/components/icons";
import Gallery from "@/components/public/Gallery";
import {
  CategoryChip,
  CompletedDateBadge,
  StatusBadge,
  formatDate,
  pick,
} from "@/components/public/impactUi";
import type { InitiativeDetail } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";

/* small clock for upcoming steps */
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* Compact steps timeline — lighter than the detail page's, no detail/outcome text. */
function CompactSteps({
  detail,
  lang,
}: {
  detail: InitiativeDetail;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const steps = detail.initiative.steps;
  const currentIdx = detail.initiative.currentStepIndex;
  if (steps.length === 0) return null;
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--text-soft)",
          }}
        >
          {bg ? "Стъпки" : "Steps"}
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--plum)" }}>
          {doneCount}/{steps.length}
        </span>
      </div>

      <div>
        {steps.map((s, i) => {
          const isCurrent = i === currentIdx && !s.done;
          const label = pick(lang, s.labelBg, s.labelEn);
          return (
            <div key={s.id} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 26 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: s.done ? "var(--caramel)" : isCurrent ? "var(--plum)" : "var(--surface2)",
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
                      minHeight: 14,
                      background: s.done ? "oklch(76% 0.10 52)" : "var(--border)",
                      margin: "2px 0",
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: i < steps.length - 1 ? 14 : 0, flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingTop: 3 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: s.done || isCurrent ? "var(--text)" : "var(--plum-mid)",
                    }}
                  >
                    {label}
                  </span>
                  {s.done && s.completedDateISO && (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-soft)" }}>
                      {formatDate(s.completedDateISO, lang)}
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      style={{
                        background: "var(--plum-lt)",
                        color: "var(--plum)",
                        borderRadius: 100,
                        padding: "1px 8px",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {bg ? "Текуща" : "Current"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Concise deep-dive of ONE initiative for the /initiatives page (§3).
 * Cover (falls back to first gallery image) + gallery beneath it on the left;
 * badges, title, steps, partners and a CTA on the right. All from the DTO.
 */
export default function FocusDeepDive({
  detail,
  lang,
  showRepeat = false,
}: {
  detail: InitiativeDetail;
  lang: Lang;
  showRepeat?: boolean;
}) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const title = pick(lang, i.titleBg, i.titleEn);
  const location = pick(lang, i.locationBg, i.locationEn);
  const isDone = i.status === "done";

  const cover = i.coverImage ?? (i.gallery.length > 0 ? i.gallery[0] : null);

  const partnerChips = i.partners
    .map((p) => detail.partnersById[p.partnerId])
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .sort((a, b) => Number(b.isStarPartner) - Number(a.isStarPartner));

  return (
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        {/* Header stack */}
        <div style={{ marginBottom: 40, maxWidth: 640 }}>
          <div className="label-tag" style={{ marginBottom: 12 }}>
            {bg ? "Отблизо" : "Up close"}
          </div>
          <h2 className="heading-lg" style={{ margin: 0 }}>
            {bg ? "Една инициатива, разгледана изцяло" : "One initiative, seen in full"}
          </h2>
        </div>

        <div
          className="focus-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "start",
          }}
        >
          {/* Media column */}
          <div>
            {showRepeat && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                  color: "var(--text-soft)",
                  fontSize: "0.74rem",
                  lineHeight: 1.4,
                }}
              >
                <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0 }}>
                  <IconInfo size={13} />
                </span>
                {bg
                  ? "Показана и по-горе — още инициативи предстоят."
                  : "Also shown above — more initiatives on the way."}
              </div>
            )}

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                background: "var(--plum)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {cover ? (
                <Image
                  src={cover.url}
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
                      "linear-gradient(135deg, var(--plum) 0%, var(--plum-mid) 60%, oklch(52% 0.13 40) 100%)",
                  }}
                />
              )}
            </div>

            {i.gallery.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <Gallery items={i.gallery} lang={lang} thumbMin={96} />
              </div>
            )}
          </div>

          {/* Content column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {isDone ? (
                <CompletedDateBadge dateISO={i.completionDateISO} lang={lang} tone="green" />
              ) : (
                <StatusBadge status={i.status} lang={lang} />
              )}
              {i.category && <CategoryChip category={i.category} lang={lang} />}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
                fontWeight: 700,
                color: "var(--plum)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {title}
            </h3>

            {location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: "0.9rem",
                  color: "var(--text-soft)",
                }}
              >
                <span style={{ display: "inline-flex", color: "var(--caramel)" }}>
                  <IconMap />
                </span>
                {location}
              </div>
            )}

            <CompactSteps detail={detail} lang={lang} />

            {partnerChips.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: 10,
                  }}
                >
                  {bg ? "Партньори по инициативата" : "Initiative partners"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {partnerChips.map((p) => (
                    <Link
                      key={p.id}
                      href={`/initiatives/partners/${p.slug}`}
                      title={p.isYouthLed ? (bg ? "Младежка организация" : "Youth-led organisation") : undefined}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--plum-lt)",
                        color: "var(--plum)",
                        borderRadius: 100,
                        padding: "6px 14px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {p.isYouthLed && (
                        <span aria-hidden="true" style={{ display: "inline-flex", color: "var(--plum-mid)" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </span>
                      )}
                      {pick(lang, p.nameBg, p.nameEn)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/initiatives/${i.slug}`}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
            >
              {bg ? "Виж пълната инициатива" : "See the full initiative"}
              <IconArrow />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .focus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
