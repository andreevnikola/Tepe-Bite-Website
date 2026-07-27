"use client";

/**
 * "Ключови данни" / "Key facts" — the initiative's real, labelled, quantitative
 * record, rendered as two semantic definition lists.
 *
 * This is the section a retrieval crawler parses to answer "how much was
 * invested here?" and "what share came from product sales?", so every figure
 * carries an explicit, unambiguous visible label and every number is derived in
 * `@/lib/public/initiative-facts` (pure, server/SSR, never by a model).
 *
 * There is deliberately NO hidden, clipped or crawler-only text: everything a
 * machine reads here is text a visitor reads too. A fact with no data simply
 * has no row — never a placeholder, never a "0 €" standing in for "unknown".
 */

import { PLEDGE_EUR, PledgeHeart } from "@/components/ImpactPledge";
import {
  CategoryChip,
  StatusBadge,
  formatDate,
  pick,
} from "@/components/public/impactUi";
import { EXPENSE_LABELS } from "@/lib/dashboard/constants";
import { formatDualMoney, formatMoneyEUR } from "@/lib/money";
import { deriveInitiativeFacts } from "@/lib/public/initiative-facts";
import type { InitiativeDetail as InitiativeDetailData } from "@/lib/public/initiatives";
import type { Lang } from "@/store/lang";
import type { ReactNode } from "react";

type FactRow = {
  /** Visible `<dt>` text. Must stand alone — this is what the crawler indexes. */
  term: string;
  value: ReactNode;
  /** Optional clarifier under the value (how the number is defined). */
  hint?: string;
  /**
   * Prose values (names, outcome text) stack the term above the value and run
   * full width; short values (money, dates, badges) sit opposite the term.
   */
  block?: boolean;
};

/** Sentence-case the shared lowercase BG expenses wording. */
function expensesLabel(lang: Lang): string {
  return lang === "en"
    ? EXPENSE_LABELS.en
    : EXPENSE_LABELS.bg.charAt(0).toUpperCase() + EXPENSE_LABELS.bg.slice(1);
}

/** One `<dl>` under its own sub-heading. Renders nothing when it has no rows. */
function FactList({
  heading,
  accent,
  rows,
}: {
  heading: string;
  accent: string;
  rows: FactRow[];
}) {
  if (rows.length === 0) return null;
  return (
    <div
      className="card kf-card"
      style={{
        padding: "clamp(22px, 3vw, 30px)",
        // Top accent as an inset shadow so it follows the card radius exactly
        // (same technique as PhaseBreakdown's phase boxes).
        boxShadow: `inset 0 4px 0 ${accent}, var(--shadow)`,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--plum)",
          margin: "0 0 4px",
        }}
      >
        {heading}
      </h3>
      <dl className="kf-list">
        {rows.map((row) => (
          <div
            key={row.term}
            className={row.block ? "kf-row kf-row-block" : "kf-row"}
          >
            <dt className="kf-term">{row.term}</dt>
            <dd className="kf-def">
              <span className="kf-value">{row.value}</span>
              {row.hint ? <span className="kf-hint">{row.hint}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function InitiativeKeyFacts({
  detail,
  lang,
}: {
  detail: InitiativeDetailData;
  lang: Lang;
}) {
  const bg = lang === "bg";
  const i = detail.initiative;
  const f = deriveInitiativeFacts(i, detail.partnersById);
  const title = pick(lang, i.titleBg, i.titleEn);

  /* ── The initiative ────────────────────────────────────────────────────── */
  const aboutRows: FactRow[] = [
    {
      term: bg ? "Статус" : "Status",
      value: <StatusBadge status={f.status} lang={lang} />,
    },
  ];

  if (f.category)
    aboutRows.push({
      term: bg ? "Категория" : "Category",
      value: <CategoryChip category={f.category} lang={lang} />,
    });

  const location = pick(lang, f.locationBg, f.locationEn);
  if (location)
    aboutRows.push({ term: bg ? "Локация" : "Location", value: location });

  if (f.completionDateISO)
    aboutRows.push({
      term: bg ? "Завършена на" : "Completed on",
      value: formatDate(f.completionDateISO, lang),
    });

  // Only rendered when at least one record is dated; a single dated record
  // shows one date rather than a range with the same value on both ends.
  if (f.firstActivityISO)
    aboutRows.push({
      term: bg ? "Отчетена дейност" : "Recorded activity",
      value:
        f.latestActivityISO && f.latestActivityISO !== f.firstActivityISO
          ? `${formatDate(f.firstActivityISO, lang)} – ${formatDate(f.latestActivityISO, lang)}`
          : formatDate(f.firstActivityISO, lang),
      hint: bg
        ? "период на публично отчетените постъпления, разходи и стъпки"
        : "span of the publicly recorded inflows, expenses and steps",
    });

  if (f.steps.total > 0)
    aboutRows.push({
      term: bg ? "Напредък" : "Progress",
      value: bg
        ? `${f.steps.completed} от ${f.steps.total} стъпки завършени`
        : `${f.steps.completed} of ${f.steps.total} steps completed`,
    });

  const currentStep = pick(lang, f.steps.currentLabelBg, f.steps.currentLabelEn);
  if (currentStep)
    aboutRows.push({
      term: bg ? "Текуща стъпка" : "Current step",
      value: currentStep,
      block: true,
    });

  // Names are listed only when they actually resolved; otherwise just the count.
  const partnerNames = bg ? f.partnerNamesBg : f.partnerNamesEn;
  if (f.partnerCount > 0)
    aboutRows.push({
      term: bg ? "Партньори" : "Partners",
      value: partnerNames.length > 0 ? partnerNames.join(", ") : f.partnerCount,
      hint:
        partnerNames.length > 0
          ? bg
            ? `${f.partnerCount} партньорски организации по инициативата`
            : `${f.partnerCount} partner organisations on this initiative`
          : undefined,
      block: partnerNames.length > 0,
    });

  const outcome = pick(lang, f.latestOutcomeBg, f.latestOutcomeEn);
  if (outcome)
    aboutRows.push({
      term: bg ? "Постигнат резултат" : "Outcome achieved",
      value: outcome,
      block: true,
    });

  /* ── Finances ──────────────────────────────────────────────────────────── */
  // When nothing has landed yet we fall back to the committed basis, and every
  // label says "обвързани / committed" so the two are never conflated.
  const realised = f.investedTotalCents > 0;
  const totalCents = realised ? f.investedTotalCents : f.committedTotalCents;
  const salesCents = realised
    ? f.inflowBySource.impactFundAvailableCents
    : f.inflowBySource.impactFundCommittedCents;
  const otherCents = realised
    ? f.inflowBySource.otherAvailableCents
    : f.inflowBySource.otherCommittedCents;

  const moneyRows: FactRow[] = [];

  if (totalCents > 0)
    moneyRows.push({
      term: realised
        ? bg
          ? "Общо вложени средства"
          : "Total invested"
        : bg
          ? "Общо обвързани средства"
          : "Total committed funding",
      value: formatMoneyEUR(totalCents),
      hint: realised
        ? bg
          ? "налични средства — реално постъпили по инициативата"
          : "available funds — money actually received for this initiative"
        : bg
          ? "планирани и осигурени средства, които още не са налични"
          : "planned and arranged funding, not yet available",
    });

  if (salesCents > 0)
    moneyRows.push({
      term: bg
        ? "Осигурени чрез продажби на продукта"
        : "Funded through product sales",
      value: formatMoneyEUR(salesCents),
      hint: bg
        ? "постъпления от Фонд ТЕПЕ bite Impact"
        : "inflows from the ТЕПЕ bite Impact fund",
    });

  if (otherCents > 0)
    moneyRows.push({
      term: bg
        ? "Осигурени от партньори и външни източници"
        : "Funded by partners and external sources",
      value: formatMoneyEUR(otherCents),
      hint: bg
        ? "дарения, съфинансиране и остойностени материали"
        : "donations, co-funding and valued in-kind materials",
    });

  // Shown only when it adds information beyond the realised total above.
  if (realised && f.committedTotalCents > f.investedTotalCents)
    moneyRows.push({
      term: bg
        ? "Обвързани средства, всички фази"
        : "Committed funding, all phases",
      value: formatMoneyEUR(f.committedTotalCents),
      hint: bg
        ? "налични + осигурени + планирани"
        : "available + arranged + planned",
    });

  if (f.accountedExpensesCents > 0)
    moneyRows.push({
      term: expensesLabel(lang),
      value: formatMoneyEUR(f.accountedExpensesCents),
      hint: bg
        ? `${f.accountedExpensesCount} ${f.accountedExpensesCount === 1 ? "разход" : "разхода"} с приложено доказателство`
        : `${f.accountedExpensesCount} ${f.accountedExpensesCount === 1 ? "expense" : "expenses"} with attached proof`,
    });

  if (f.expectedCostCents > 0)
    moneyRows.push({
      term: bg ? "Очаквана цена" : "Expected cost",
      value: formatMoneyEUR(f.expectedCostCents),
      hint: bg ? "обща цел за проекта" : "total project target",
    });

  // Nothing derivable at all → render no section rather than an empty shell.
  if (aboutRows.length === 0 && moneyRows.length === 0) return null;

  const share = f.productSalesFunding;
  const sentence = pick(lang, f.productSalesSentenceBg, f.productSalesSentenceEn);
  const pledge = PLEDGE_EUR.toFixed(2).replace(".", bg ? "," : ".");

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--bg)", paddingTop: 0 }}
    >
      <div className="section-inner">
        <div className="label-tag" style={{ marginBottom: 12 }}>
          {bg ? "Прозрачност" : "Transparency"}
        </div>
        <h2 className="heading-lg" style={{ margin: "0 0 12px" }}>
          {bg ? "Ключови данни" : "Key facts"}
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-mid)",
            lineHeight: 1.7,
            margin: "0 0 clamp(24px, 3vw, 34px)",
            maxWidth: "62ch",
          }}
        >
          {bg
            ? `Всичко, което отчитаме публично за „${title}“, събрано на едно място.`
            : `Everything we report publicly about “${title}”, in one place.`}
        </p>

        {/* The headline transparency claim — sky is this site's Impact-fund
            colour, and the basis line makes the arithmetic auditable. */}
        {share && sentence && (
          <div
            className="kf-share"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(18px, 3vw, 34px)",
              background:
                "linear-gradient(135deg, var(--sky-lt) 0%, var(--surface) 72%)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(22px, 3vw, 34px)",
              boxShadow: "var(--shadow)",
              marginBottom: "clamp(20px, 2.5vw, 28px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              <PledgeHeart
                size={44}
                label={`.${Math.round(PLEDGE_EUR * 100)}€`}
                fill="var(--sky-dk)"
                textColor="var(--surface)"
              />
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "clamp(2.4rem, 7vw, 3.4rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: "var(--sky-dk)",
                  letterSpacing: "-0.02em",
                }}
              >
                {bg
                  ? `${String(share.percent).replace(".", ",")}%`
                  : `${share.percent}%`}
              </span>
            </div>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 1.12rem)",
                  lineHeight: 1.6,
                  color: "var(--text)",
                  fontWeight: 600,
                  margin: "0 0 8px",
                  textWrap: "pretty",
                }}
              >
                {sentence}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--text-soft)",
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {bg
                  ? `Изчислено като ${formatDualMoney(share.numeratorCents)} от ${formatMoneyEUR(share.denominatorCents)} ${share.basis === "invested" ? "вложени" : "обвързани"} средства. Фиксираните ${pledge} € от всяко продадено барче отиват във Фонд ТЕПЕ bite Impact.`
                  : `Calculated as ${formatDualMoney(share.numeratorCents)} of ${formatMoneyEUR(share.denominatorCents)} in ${share.basis === "invested" ? "invested" : "committed"} funding. The fixed ${pledge} € from every bar sold goes to the ТЕПЕ bite Impact fund.`}
              </p>
            </div>
          </div>
        )}

        <div className="kf-grid">
          <FactList
            heading={bg ? "Инициативата" : "The initiative"}
            accent="var(--plum-mid)"
            rows={aboutRows}
          />
          <FactList
            heading={bg ? "Финанси" : "Finances"}
            accent="var(--sky-dk)"
            rows={moneyRows}
          />
        </div>
      </div>

      <style>{`
        .kf-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          align-items: start;
        }
        .kf-list { margin: 0; }
        .kf-row {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 6px 18px;
          align-items: baseline;
          padding: 13px 0;
          border-bottom: 1px solid var(--border);
        }
        .kf-row:last-child { border-bottom: none; padding-bottom: 0; }
        .kf-row-block { grid-template-columns: minmax(0, 1fr); }
        .kf-term {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-soft);
          margin: 0;
        }
        .kf-def {
          margin: 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-align: right;
        }
        .kf-row-block .kf-def { text-align: left; }
        .kf-value {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--plum);
          overflow-wrap: anywhere;
        }
        .kf-row-block .kf-value {
          font-weight: 500;
          color: var(--text-mid);
        }
        .kf-hint {
          font-size: 0.78rem;
          line-height: 1.5;
          font-weight: 400;
          color: var(--text-soft);
          overflow-wrap: anywhere;
        }
        @media (max-width: 900px) {
          .kf-grid { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 560px) {
          .kf-row { grid-template-columns: minmax(0, 1fr); gap: 4px; }
          .kf-def { text-align: left; }
        }
      `}</style>
    </section>
  );
}
