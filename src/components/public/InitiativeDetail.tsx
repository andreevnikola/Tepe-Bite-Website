"use client";

import {
  IconArrow,
  IconCheck,
  IconLink,
  IconMap,
  IconShop,
} from "@/components/icons";
import {
  CategoryChip,
  FreezeNote,
  StatusBadge,
  StarBadge,
  YouthBadge,
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
import Gallery from "@/components/public/Gallery";
import type { InitiativeDetail as InitiativeDetailData } from "@/lib/public/initiatives";
import type { ExpenseDTO, InflowDTO, PartnerDTO } from "@/lib/dashboard/dto";
import { SITE_INFO } from "@/lib/config/site-info";
import { formatDualMoney, formatMoneyEUR } from "@/lib/money";
import { langAtom, type Lang } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* Sum of tracked expense amounts, in cents. */
function expenseTotalCents(expenses: ExpenseDTO[]): number {
  return expenses.reduce((s, e) => s + e.amountCents, 0);
}

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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 14,
            }}
          >
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
  const expensesTotal = expenseTotalCents(i.expenses);

  const facts: [string, string][] = [];
  if (i.locationBg || i.locationEn)
    facts.push([
      bg ? "Локация" : "Location",
      pick(lang, i.locationBg, i.locationEn),
    ]);
  if (isDone) {
    if (expensesTotal > 0)
      facts.push([
        bg ? "Усчетоводени разходи" : "Accounted expenses",
        formatMoneyEUR(expensesTotal),
      ]);
  } else {
    if (i.expectedCostCents > 0)
      facts.push([
        bg ? "Очаквана цена" : "Expected cost",
        formatMoneyEUR(i.expectedCostCents),
      ]);
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
          href="/initiatives"
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
          <div
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-mid)",
              whiteSpace: "pre-line",
            }}
          >
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
                      idx < facts.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <span
                    style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}
                  >
                    {k}
                  </span>
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

/* ═══ GALLERY ═══ */
function GallerySection({
  detail,
  lang,
}: {
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const bg = lang === "bg";
  if (detail.initiative.gallery.length === 0) return null;
  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <Gallery
          items={detail.initiative.gallery}
          lang={lang}
          eyebrow={bg ? "Галерия" : "Gallery"}
          heading={bg ? "От терена" : "From the ground"}
        />
      </div>
    </section>
  );
}

/* Completion note shown under a done step — what was actually accomplished.
   Minimal: thin accent rule, no label; collapses past 20 words with an inline toggle. */
function StepOutcome({ text, lang }: { text: string; lang: Lang }) {
  const bg = lang === "bg";
  const [expanded, setExpanded] = useState(false);
  const words = text.trim().split(/\s+/);
  const isLong = words.length > 20;
  const shown = isLong && !expanded ? words.slice(0, 20).join(" ") + "…" : text;

  return (
    <p
      style={{
        marginTop: 6,
        paddingLeft: 12,
        borderLeft: "2px solid var(--caramel)",
        fontSize: "0.84rem",
        color: "var(--text-mid)",
        lineHeight: 1.55,
      }}
    >
      {shown}
      {isLong && (
        <>
          {" "}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              font: "inherit",
              fontWeight: 700,
              color: "var(--caramel)",
              cursor: "pointer",
            }}
          >
            {expanded ? (bg ? "по-малко" : "less") : bg ? "още" : "more"}
          </button>
        </>
      )}
    </p>
  );
}

/* ═══ MILESTONE TIMELINE ═══ */
function Progress({
  detail,
  lang,
}: {
  detail: InitiativeDetailData;
  lang: Lang;
}) {
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
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-soft)",
            marginBottom: 40,
          }}
        >
          {doneCount}/{steps.length}{" "}
          {bg ? "стъпки завършени" : "steps completed"}
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
              const outcomeText = s.done
                ? pick(lang, s.outcomeBg, s.outcomeEn)
                : "";
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
                        border:
                          s.done || isCurrent
                            ? "none"
                            : "2px solid var(--plum-mid)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          s.done || isCurrent ? "white" : "var(--plum-mid)",
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
                          background: s.done
                            ? "oklch(76% 0.10 52)"
                            : "var(--border)",
                          margin: "3px 0",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      paddingBottom: i < steps.length - 1 ? 24 : 0,
                      flex: 1,
                    }}
                  >
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
                          color:
                            s.done || isCurrent
                              ? "var(--text)"
                              : "var(--plum-mid)",
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
                          color: s.done
                            ? "var(--text-mid)"
                            : "var(--text-soft)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {detailText}
                      </p>
                    )}
                    {outcomeText && (
                      <StepOutcome text={outcomeText} lang={lang} />
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
              position: "relative",
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

function Partners({
  detail,
  lang,
}: {
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const list = detail.initiative.partners
    .map((p) => ({
      link: p,
      partner: detail.partnersById[p.partnerId] as PartnerDTO | undefined,
    }))
    .filter((x) => x.partner)
    .sort((a, b) => {
      if (a.partner!.isStarPartner !== b.partner!.isStarPartner)
        return a.partner!.isStarPartner ? -1 : 1;
      return 0;
    });

  if (list.length === 0) return null;

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
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
            const contribution = pick(
              lang,
              link.contributionBg,
              link.contributionEn,
            );
            const financial = partnerTotals(
              detail.initiative.inflows,
              partner!.id,
            );
            return (
              <div
                key={link.id}
                className="card"
                style={{
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Partnership-type badges (+ star / youth) sit on top */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {link.partnershipTypes.map((t) => {
                    const tl = PARTNERSHIP_TYPE_LABELS[t];
                    return (
                      <span
                        key={t}
                        style={{
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
                        {lang === "en" ? tl.en : tl.bg}
                      </span>
                    );
                  })}
                  {partner!.isStarPartner && <StarBadge lang={lang} compact />}
                  {partner!.isYouthLed && <YouthBadge lang={lang} compact />}
                </div>

                {/* almost-invisible divider between badges and the rest */}
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    background: "var(--border)",
                    opacity: 0.6,
                    margin: "0 0 16px",
                  }}
                />

                {/* avatar + name, with profile/website links beneath the name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
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
                      <Image
                        src={partner!.image.url}
                        alt={name}
                        fill
                        sizes="48px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-head)",
                          fontWeight: 700,
                          color: "var(--plum)",
                        }}
                      >
                        {name.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        color: "var(--plum)",
                        fontSize: "1.02rem",
                        display: "block",
                      }}
                    >
                      {name}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: 14,
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginTop: 6,
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

                {contribution && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      color: "var(--text-mid)",
                      margin: "0 0 12px",
                    }}
                  >
                    {contribution}
                  </p>
                )}

                {financial.total > 0 && (
                  <div style={{ marginTop: "auto" }}>
                    <PhaseBarMini
                      totals={financial}
                      lang={lang}
                      label={bg ? "Финансов принос" : "Financial support"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ FINANCES ═══ */
/* Semantic colours for the money ledger: green = money in, red = money out.
   Green reuses the available-funds hue; red is a restrained warm OKLCH red. */
const INFLOW_GREEN = "oklch(52% 0.13 150)";
const EXPENSE_RED = "oklch(55% 0.19 25)";

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
  const nameStyle: React.CSSProperties = {
    fontWeight: 700,
    color: "var(--plum)",
    fontSize: "0.95rem",
  };
  if (f.source === "partner") {
    const p = f.partnerId ? detail.partnersById[f.partnerId] : undefined;
    if (p)
      return (
        <Link
          href={`/initiatives/partners/${p.slug}`}
          style={{
            ...nameStyle,
            textDecoration: "underline",
            textDecorationColor: "var(--border)",
            textUnderlineOffset: 3,
          }}
        >
          {pick(lang, p.nameBg, p.nameEn)}
        </Link>
      );
    return (
      <span style={nameStyle}>
        {INFLOW_SOURCE_LABELS.partner[lang === "en" ? "en" : "bg"]}
      </span>
    );
  }
  if (f.source === "impact_fund")
    return (
      <span style={nameStyle}>
        {INFLOW_SOURCE_LABELS.impact_fund[lang === "en" ? "en" : "bg"]}
      </span>
    );
  const custom = pick(lang, f.sourceLabelBg, f.sourceLabelEn);
  return (
    <span style={nameStyle}>
      {custom ||
        INFLOW_SOURCE_LABELS.external_other[lang === "en" ? "en" : "bg"]}
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

/* One inflow row — green left accent, "+" before the amount. Keeps the source
   and phase badges from the original design. */
function InflowRow({
  f,
  detail,
  lang,
}: {
  f: InflowDTO;
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const phaseLabel = INFLOW_PHASE_LABELS[f.phase][bg ? "bg" : "en"];
  const arranged =
    f.phase === "arranged" && f.arrangedType
      ? ARRANGED_TYPE_LABELS[f.arrangedType][bg ? "bg" : "en"]
      : null;
  const note = pick(lang, f.noteBg, f.noteEn);
  return (
    <div
      className="card"
      style={{
        padding: "16px 20px",
        borderLeft: `4px solid ${INFLOW_GREEN}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 240px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
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
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: PHASE_ACCENT[f.phase],
              }}
            />
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
          color: INFLOW_GREEN,
          fontSize: "1.05rem",
          whiteSpace: "nowrap",
        }}
      >
        +{formatDualMoney(f.amountCents)}
      </div>
    </div>
  );
}

/* One expense row — red left accent, "−" before the amount. Expenses carry no
   source/phase; instead we show the description, date and a proof thumbnail. */
function ExpenseRow({ e, lang }: { e: ExpenseDTO; lang: Lang }) {
  const bg = lang === "bg";
  const desc = pick(lang, e.descriptionBg, e.descriptionEn);
  return (
    <div
      className="card"
      style={{
        padding: "16px 20px",
        borderLeft: `4px solid ${EXPENSE_RED}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          minWidth: 0,
          flex: "1 1 240px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {e.proof?.url && (
          <a
            href={e.proof.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flexShrink: 0, display: "inline-flex" }}
            aria-label={bg ? "Виж доказателството" : "View proof"}
          >
            <Image
              src={e.proof.url}
              alt={bg ? "Доказателство за разход" : "Expense proof"}
              width={44}
              height={44}
              style={{
                width: 44,
                height: 44,
                objectFit: "cover",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--border)",
                filter: "grayscale(100%)",
              }}
            />
          </a>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              color: "var(--plum)",
              fontSize: "0.95rem",
            }}
          >
            {desc}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>
            {formatDate(e.dateISO, lang)}
            {" · "}
            {bg ? "с доказателство" : "with proof"}
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          color: EXPENSE_RED,
          fontSize: "1.05rem",
          whiteSpace: "nowrap",
        }}
      >
        −{formatDualMoney(e.amountCents)}
      </div>
    </div>
  );
}

/* Open, transparent ask shown when a live initiative is still short of its
   budget — invites companies / individuals to help close the gap by email. */
function FundingGapInvite({
  gapCents,
  title,
  lang,
}: {
  gapCents: number;
  title: string;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const gap = formatMoneyEUR(gapCents);
  const email = SITE_INFO.contact.impactEmail;
  const subject = encodeURIComponent(
    bg
      ? `Подкрепа за инициатива: ${title}`
      : `Support for initiative: ${title}`,
  );
  const body = encodeURIComponent(
    bg
      ? `Здравейте,\n\nБихме искали да подкрепим инициативата „${title}“ и да помогнем за нейната реализация.\n\n`
      : `Hello,\n\nWe'd like to support the "${title}" initiative and help make it happen.\n\n`,
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--r-lg)",
        padding: "clamp(22px, 3vw, 32px)",
        background:
          "linear-gradient(135deg, var(--caramel-lt) 0%, var(--surface) 68%)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="label-tag" style={{ marginBottom: 10 }}>
        {bg ? "Отворена покана" : "Open invitation"}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "clamp(1.2rem, 2.4vw, 1.55rem)",
          fontWeight: 700,
          color: "var(--plum)",
          lineHeight: 1.2,
          margin: "0 0 10px",
          maxWidth: "24ch",
        }}
      >
        {bg ? (
          <>
            Търсим още <span style={{ color: "var(--caramel)" }}>{gap}</span>,
            за да завършим тази инициатива
          </>
        ) : (
          <>
            We&apos;re <span style={{ color: "var(--caramel)" }}>{gap}</span>{" "}
            short of completing this initiative
          </>
        )}
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--text-mid)",
          lineHeight: 1.6,
          margin: "0 0 20px",
          maxWidth: "58ch",
        }}
      >
        {bg
          ? "Нищо не крием — това е разликата до пълния бюджет. Ако сте фирма или човек, който иска да помогне тя да се случи, ще се радваме да се включите."
          : "We're hiding nothing — this is the gap to the full budget. If you're a company or a person who wants to help make it real, we'd love to have you on board."}
      </p>
      <a
        href={`mailto:${email}?subject=${subject}&body=${body}`}
        className="btn btn-primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          maxWidth: "100%",
        }}
      >
        <IconArrow />
        {bg ? "Пишете ни" : "Email us"}
      </a>
      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--text-soft)",
          lineHeight: 1.55,
          margin: "14px 0 0",
        }}
      >
        {bg ? "Изпратете имейл на " : "Send an email to "}
        <a
          href={`mailto:${email}?subject=${subject}&body=${body}`}
          style={{
            color: "var(--caramel)",
            fontWeight: 700,
            wordBreak: "break-all",
          }}
        >
          {email}
        </a>
        {bg
          ? " с името на инициативата и че искате да я подкрепите."
          : " with the initiative's name and that you'd like to support it."}
      </p>
    </div>
  );
}

function Finances({
  detail,
  lang,
}: {
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const inflows = i.inflows;
  const expenses = i.expenses;
  if (inflows.length === 0 && expenses.length === 0 && i.expectedCostCents === 0)
    return null;

  const pt = inflowPhaseTotals(inflows);
  const isDone = i.status === "done";
  const expensesTotal = expenseTotalCents(expenses);
  const availableLeft = pt.available - expensesTotal;

  // Unified money ledger — inflows (money in) and expenses (money out) merged
  // and shown newest-first, so the record list reads as one honest statement.
  const ledger: (
    | { kind: "inflow"; date: string; data: InflowDTO }
    | { kind: "expense"; date: string; data: ExpenseDTO }
  )[] = [
    ...inflows.map((f) => ({ kind: "inflow" as const, date: f.dateISO, data: f })),
    ...expenses.map((e) => ({ kind: "expense" as const, date: e.dateISO, data: e })),
  ].sort((a, b) => b.date.localeCompare(a.date));

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            marginBottom: 40,
          }}
        >
          {i.expectedCostCents > 0 && !isDone && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <PhaseStat
                label={bg ? "Очаквана цена" : "Expected cost"}
                value={formatMoneyEUR(i.expectedCostCents)}
                hint={bg ? "обща цел за проекта" : "total project target"}
                accent="var(--plum-mid)"
              />
            </div>
          )}

          {i.status !== "done" &&
            i.status !== "frozen" &&
            i.expectedCostCents > 0 &&
            pt.total < i.expectedCostCents && (
              <FundingGapInvite
                gapCents={i.expectedCostCents - pt.total}
                title={pick(lang, i.titleBg, i.titleEn)}
                lang={lang}
              />
            )}

          {pt.total > 0 && (
            <div>
              <h3 style={financeSubHeading}>
                {bg ? "Осигурено финансиране" : "Acquired funding"}
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
                {bg
                  ? "Откъде идва финансирането"
                  : "Where the funding comes from"}
              </h3>
              <FundingSplitBar
                impactCents={impactCents}
                partnersCents={partnersCents}
                lang={lang}
              />
            </div>
          )}

          {expensesTotal > 0 && (
            <div>
              <h3 style={financeSubHeading}>
                {bg ? "Усчетоводени разходи" : "Accounted expenses"}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <PhaseStat
                  label={bg ? "Усчетоводени разходи" : "Accounted expenses"}
                  value={formatMoneyEUR(expensesTotal)}
                  hint={bg ? "общо реално похарчено" : "total actually spent"}
                  accent={EXPENSE_RED}
                />
                <PhaseStat
                  label={bg ? "Налични средства" : "Available funds"}
                  value={formatMoneyEUR(availableLeft)}
                  hint={
                    bg
                      ? "налични (фаза 3) − осчетоводени разходи"
                      : "available (phase 3) − accounted expenses"
                  }
                  accent={INFLOW_GREEN}
                />
              </div>
            </div>
          )}
        </div>

        {/* per-record ledger: inflows (green, +) and expenses (red, −) */}
        {ledger.length > 0 && (
          <>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--plum)",
                marginBottom: 12,
              }}
            >
              {bg ? "Всяко евро, проследено" : "Every euro, traced"}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 18px",
                marginBottom: 18,
                fontSize: "0.78rem",
                color: "var(--text-soft)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: INFLOW_GREEN,
                  }}
                />
                {bg ? "Постъпление" : "Inflow"}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: EXPENSE_RED,
                  }}
                />
                {bg ? "Разход" : "Expense"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ledger.map((item) =>
                item.kind === "inflow" ? (
                  <InflowRow
                    key={`in_${item.data.id}`}
                    f={item.data}
                    detail={detail}
                    lang={lang}
                  />
                ) : (
                  <ExpenseRow
                    key={`ex_${item.data.id}`}
                    e={item.data}
                    lang={lang}
                  />
                ),
              )}
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
    <div
      className="card"
      style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: accent,
        }}
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
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--plum)",
        }}
      >
        {value}
      </div>
      <div
        style={{ fontSize: "0.78rem", color: "var(--text-mid)", marginTop: 4 }}
      >
        {hint}
      </div>
    </div>
  );
}

/* ═══ PAGE ═══ */
export default function InitiativeDetail({
  detail,
}: {
  detail: InitiativeDetailData;
}) {
  const lang = useAtomValue(langAtom);
  return (
    <main>
      <Hero detail={detail} lang={lang} />
      <Intro detail={detail} lang={lang} />
      <GallerySection detail={detail} lang={lang} />
      <Progress detail={detail} lang={lang} />
      <Partners detail={detail} lang={lang} />
      <Finances detail={detail} lang={lang} />
    </main>
  );
}
