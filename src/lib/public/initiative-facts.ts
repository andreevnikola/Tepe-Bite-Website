/**
 * Deterministic fact derivation for a single public initiative.
 *
 * Why this module exists
 * ----------------------
 * The initiative page used to express its quantitative truth only through
 * decorative money cards and a per-record ledger. Neither a human skimming the
 * page nor a retrieval crawler could answer "how much was invested here?" or
 * "what share of it came from product sales?" without doing arithmetic. Every
 * number below is computed here, in ordinary server/SSR code — never by a model
 * — so the rendered HTML states the facts instead of implying them.
 *
 * Rules this module obeys:
 *  - Pure. No React, no DB access, no `Date.now()`, no locale lookups beyond a
 *    literal decimal separator. Same input → same output, forever.
 *  - Only fields that genuinely exist on `InitiativeDTO`. Nothing is invented,
 *    estimated or back-filled with a placeholder.
 *  - Absent data yields `0` / `''` / `null`, and the renderer omits that row.
 *    A missing fact must never surface as "0 €" or "—".
 *  - No `NaN`, `Infinity` or `-0` may ever escape. Every division is guarded.
 *
 * Domain notes:
 *  - The ТЕПЕ bite Impact fund is filled by the fixed 0.15 € taken from every
 *    bar sold. An inflow with `source: "impact_fund"` therefore IS money raised
 *    through product sales. `partner` and `external_other` are everything else.
 *  - "Invested" means REALISED money across this site — available-phase inflows
 *    only. `OverviewStats.investedTotalCents` in `@/lib/public/initiatives` uses
 *    exactly that definition, and this module matches it so the initiative page
 *    and the site-wide totals can never disagree.
 *  - Total spend has no scalar field; it is the sum of `expenses[].amountCents`.
 *  - We deliberately do NOT derive a "bars sold" count. The fund is not live
 *    (`@/lib/config/impact` has `isLive: false`, `collectedCents: 0`), so any
 *    bar count would be a fabricated figure.
 */

import type { InitiativeDTO } from '@/lib/dashboard/dto'
import type { InitiativeCategory, InitiativeStatus } from '@/lib/dashboard/constants'

/* ─── internal guards ─────────────────────────────────────────────────────── */

/**
 * Coerce a stored cent amount to a safe non-negative integer-ish number.
 * Absent / non-numeric / NaN / Infinity / negative → 0, so a single corrupt
 * record can never poison a total or produce a nonsensical percentage.
 * (The Mongo schema already enforces `min: 0`, this is defence in depth.)
 */
function safeCents(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

/**
 * Parse a stored ISO date to a timestamp. Empty string (the schema default for
 * every optional date), non-strings and unparseable values → `null`, which
 * callers treat as "this record contributes no date".
 */
function toTime(iso: unknown): number | null {
  if (typeof iso !== 'string') return null
  const trimmed = iso.trim()
  if (trimmed === '') return null
  const t = new Date(trimmed).getTime()
  return Number.isFinite(t) ? t : null
}

/**
 * Round a raw 0–100 percentage for display: one decimal below 10% (so a small
 * but real contribution does not collapse to "0%" or jump to "1%"), whole
 * numbers at or above 10%. Clamped to [0, 100] and normalised so `-0` — which
 * `Math.round` happily produces from `-0.0` — can never reach the DOM.
 */
function roundPercent(raw: number): number {
  if (!Number.isFinite(raw)) return 0
  const clamped = Math.min(100, Math.max(0, raw))
  const rounded = clamped < 10 ? Math.round(clamped * 10) / 10 : Math.round(clamped)
  // `+ 0` collapses -0 to 0; Object.is(-0, 0) is false, so this matters.
  return rounded + 0
}

/** Render a percentage with the decimal separator the language actually uses. */
function formatPercent(percent: number, lang: 'bg' | 'en'): string {
  const digits = Number.isInteger(percent) ? String(percent) : percent.toFixed(1)
  return lang === 'bg' ? `${digits.replace('.', ',')}%` : `${digits}%`
}

/* ─── public shapes ───────────────────────────────────────────────────────── */

/**
 * Which pot of money the product-sales percentage is measured against.
 *  - `invested`  — available-phase inflows only; money actually in hand. This
 *                  is the primary basis and matches the site's use of the word.
 *  - `committed` — all phases (planned + arranged + available). Used only as a
 *                  fallback when nothing has landed yet, and the rendered
 *                  sentence says so explicitly.
 */
export type FundingBasis = 'invested' | 'committed'

/** A computed share of funding, carrying the exact inputs it was derived from. */
export type ProductSalesFunding = {
  /** 0–100, already rounded for display. Never NaN/Infinity/-0. */
  percent: number
  basis: FundingBasis
  /** ТЕПЕ bite Impact fund money on the chosen basis, in EUR cents. */
  numeratorCents: number
  /** All funding on the chosen basis, in EUR cents. Always > 0 here. */
  denominatorCents: number
}

export type InitiativeFacts = {
  status: InitiativeStatus
  category: InitiativeCategory | null
  locationBg: string
  locationEn: string

  /** Manually set only when the initiative is done; `''` otherwise. */
  completionDateISO: string
  /**
   * Oldest / newest dated record across inflows, expenses and completed steps.
   * `''` when the initiative has no dated records at all. These are labelled as
   * *recorded activity*, not as a project start/end — the data model has no
   * start date and we will not imply one.
   */
  firstActivityISO: string
  latestActivityISO: string

  /** Planned budget for the whole project. `0` when never entered. */
  expectedCostCents: number

  /** Inflow totals by lifecycle phase, in EUR cents. */
  inflowByPhase: {
    planned: number
    arranged: number
    available: number
    /** planned + arranged + available. */
    total: number
  }

  /** Inflow totals by origin, in EUR cents, on both bases. */
  inflowBySource: {
    impactFundAvailableCents: number
    otherAvailableCents: number
    impactFundCommittedCents: number
    otherCommittedCents: number
  }

  /** Realised money = `inflowByPhase.available`. The site's "invested". */
  investedTotalCents: number
  /** All money committed across every phase = `inflowByPhase.total`. */
  committedTotalCents: number
  /** Sum of `expenses[].amountCents` — the only measure of real spend. */
  accountedExpensesCents: number
  /** Number of expense records behind `accountedExpensesCents`. */
  accountedExpensesCount: number

  /** Formally listed partners on this initiative. */
  partnerCount: number
  /** Resolved partner names, in the order they are listed. Empty when unresolved. */
  partnerNamesBg: string[]
  partnerNamesEn: string[]

  steps: {
    completed: number
    total: number
    /** Label of the current (not-yet-done) step; `''` when there is none. */
    currentLabelBg: string
    currentLabelEn: string
  }

  /**
   * The outcome text of the most recently completed step — what was actually
   * achieved. `''` when no completed step carries an outcome.
   */
  latestOutcomeBg: string
  latestOutcomeEn: string

  /** `null` when the data cannot support an honest percentage. */
  productSalesFunding: ProductSalesFunding | null
  /**
   * Ready-made full sentences stating the percentage in plain language. Both
   * are `''` exactly when `productSalesFunding` is `null`, so a renderer can
   * branch on either. Wording differs by basis so the committed case is never
   * presented as money already in hand.
   */
  productSalesSentenceBg: string
  productSalesSentenceEn: string
}

/** Minimal partner lookup — accepts the page's `partnersById` map as-is. */
type PartnerNameLookup = Record<string, { nameBg: string; nameEn: string }>

/* ─── derivation ──────────────────────────────────────────────────────────── */

/**
 * Derive every public quantitative fact for one initiative.
 *
 * `partnersById` is optional: without it the facts still carry `partnerCount`
 * (which comes from the initiative document itself) but the name lists stay
 * empty and the renderer omits the names row rather than printing raw ids.
 */
export function deriveInitiativeFacts(
  initiative: InitiativeDTO,
  partnersById?: PartnerNameLookup,
): InitiativeFacts {
  const inflows = Array.isArray(initiative.inflows) ? initiative.inflows : []
  const expenses = Array.isArray(initiative.expenses) ? initiative.expenses : []
  const steps = Array.isArray(initiative.steps) ? initiative.steps : []
  const partners = Array.isArray(initiative.partners) ? initiative.partners : []

  // ── Inflows: one pass, split by phase and by origin ─────────────────────
  // An inflow whose phase is unknown/corrupt contributes to nothing (it is not
  // silently counted as `planned`), so totals stay conservative.
  let planned = 0
  let arranged = 0
  let available = 0
  let impactFundAvailableCents = 0
  let otherAvailableCents = 0
  let impactFundCommittedCents = 0
  let otherCommittedCents = 0

  for (const f of inflows) {
    const amount = safeCents(f?.amountCents)
    if (amount === 0) continue
    const isImpactFund = f?.source === 'impact_fund'

    if (f?.phase === 'available') {
      available += amount
      if (isImpactFund) impactFundAvailableCents += amount
      else otherAvailableCents += amount
    } else if (f?.phase === 'arranged') {
      arranged += amount
    } else if (f?.phase === 'planned') {
      planned += amount
    } else {
      continue // unknown phase → excluded from every total, including committed
    }

    if (isImpactFund) impactFundCommittedCents += amount
    else otherCommittedCents += amount
  }

  const committedTotalCents = planned + arranged + available

  // ── Expenses: the only source of truth for real spend ───────────────────
  // Zero/invalid amounts are skipped, and so are they in the count, so the
  // rendered "N разхода" always matches the rendered total.
  let accountedExpensesCents = 0
  let accountedExpensesCount = 0
  for (const e of expenses) {
    const amount = safeCents(e?.amountCents)
    if (amount === 0) continue
    accountedExpensesCents += amount
    accountedExpensesCount += 1
  }

  // ── Recorded-activity window ────────────────────────────────────────────
  // Built from dated records only: inflows, expenses and steps that are marked
  // done AND carry a completion date. Undated records simply do not widen the
  // window. When no record is dated at all, both ends stay `''` and the
  // renderer drops the row instead of showing a half range.
  let firstTime: number | null = null
  let lastTime: number | null = null
  let firstISO = ''
  let lastISO = ''
  const considerDate = (iso: unknown) => {
    const t = toTime(iso)
    if (t === null) return
    const value = (iso as string).trim()
    if (firstTime === null || t < firstTime) {
      firstTime = t
      firstISO = value
    }
    if (lastTime === null || t > lastTime) {
      lastTime = t
      lastISO = value
    }
  }
  for (const f of inflows) considerDate(f?.dateISO)
  for (const e of expenses) considerDate(e?.dateISO)
  for (const s of steps) if (s?.done) considerDate(s?.completedDateISO)

  // ── Steps ───────────────────────────────────────────────────────────────
  const completedSteps = steps.filter((s) => s?.done === true)
  // `currentStepIndex` is admin-maintained; treat an out-of-range or
  // already-done target as "no current step" rather than trusting the index.
  const currentIdx = initiative.currentStepIndex
  const currentStep =
    typeof currentIdx === 'number' &&
    Number.isInteger(currentIdx) &&
    currentIdx >= 0 &&
    currentIdx < steps.length &&
    steps[currentIdx]?.done === false
      ? steps[currentIdx]
      : null

  // Latest outcome = the outcome of the completed step with the newest
  // completion date. Falls back to document order when dates are missing, and
  // stays `''` when no completed step has any outcome text.
  let latestOutcomeBg = ''
  let latestOutcomeEn = ''
  let latestOutcomeTime = -Infinity
  for (const s of completedSteps) {
    const bg = (s?.outcomeBg ?? '').trim()
    const en = (s?.outcomeEn ?? '').trim()
    if (!bg && !en) continue
    const t = toTime(s?.completedDateISO) ?? -Infinity
    if (t >= latestOutcomeTime) {
      latestOutcomeTime = t
      latestOutcomeBg = bg
      latestOutcomeEn = en
    }
  }

  // ── Partners ────────────────────────────────────────────────────────────
  // Count comes from the initiative document. Names are resolved only when a
  // lookup is supplied AND the id is present in it — an unresolved id yields no
  // name at all, never a raw ObjectId string.
  const partnerNamesBg: string[] = []
  const partnerNamesEn: string[] = []
  if (partnersById) {
    for (const p of partners) {
      const found = p?.partnerId ? partnersById[p.partnerId] : undefined
      if (!found) continue
      const bg = (found.nameBg ?? '').trim()
      const en = (found.nameEn ?? '').trim()
      if (bg || en) {
        partnerNamesBg.push(bg || en)
        partnerNamesEn.push(en || bg)
      }
    }
  }

  // ── Product-sales funding share ─────────────────────────────────────────
  // Primary basis: realised money (available phase), matching the site's
  // definition of "invested". Fallback basis: everything committed, used only
  // when nothing has landed yet but money is on the books. Both denominators
  // are strictly > 0 here, so the division can never be 0/0 or produce a
  // non-finite value; if neither holds we return `null` and render nothing.
  let productSalesFunding: ProductSalesFunding | null = null
  if (available > 0) {
    productSalesFunding = {
      percent: roundPercent((impactFundAvailableCents / available) * 100),
      basis: 'invested',
      numeratorCents: impactFundAvailableCents,
      denominatorCents: available,
    }
  } else if (committedTotalCents > 0) {
    productSalesFunding = {
      percent: roundPercent((impactFundCommittedCents / committedTotalCents) * 100),
      basis: 'committed',
      numeratorCents: impactFundCommittedCents,
      denominatorCents: committedTotalCents,
    }
  }
  // else: no inflows at all, or every amount was invalid → no percentage.

  let productSalesSentenceBg = ''
  let productSalesSentenceEn = ''
  if (productSalesFunding) {
    const bgPct = formatPercent(productSalesFunding.percent, 'bg')
    const enPct = formatPercent(productSalesFunding.percent, 'en')
    if (productSalesFunding.basis === 'invested') {
      productSalesSentenceBg = `${bgPct} от вложените средства в тази инициатива са осигурени чрез продажби на продукта.`
      productSalesSentenceEn = `${enPct} of the investment in this initiative was funded through product sales.`
    } else {
      // Honest about the weaker basis: this money is committed, not in hand.
      productSalesSentenceBg = `${bgPct} от обвързаните средства за тази инициатива са осигурени чрез продажби на продукта — те са планирани или осигурени, но все още не са налични.`
      productSalesSentenceEn = `${enPct} of the funding committed to this initiative comes from product sales — that money is planned or arranged, but not yet available.`
    }
  }

  return {
    status: initiative.status,
    category: initiative.category ?? null,
    locationBg: (initiative.locationBg ?? '').trim(),
    locationEn: (initiative.locationEn ?? '').trim(),

    completionDateISO: toTime(initiative.completionDateISO) === null
      ? ''
      : (initiative.completionDateISO as string).trim(),
    firstActivityISO: firstISO,
    latestActivityISO: lastISO,

    expectedCostCents: safeCents(initiative.expectedCostCents),

    inflowByPhase: { planned, arranged, available, total: committedTotalCents },
    inflowBySource: {
      impactFundAvailableCents,
      otherAvailableCents,
      impactFundCommittedCents,
      otherCommittedCents,
    },

    investedTotalCents: available,
    committedTotalCents,
    accountedExpensesCents,
    accountedExpensesCount,

    partnerCount: partners.length,
    partnerNamesBg,
    partnerNamesEn,

    steps: {
      completed: completedSteps.length,
      total: steps.length,
      currentLabelBg: (currentStep?.labelBg ?? '').trim(),
      currentLabelEn: (currentStep?.labelEn ?? '').trim(),
    },

    latestOutcomeBg,
    latestOutcomeEn,

    productSalesFunding,
    productSalesSentenceBg,
    productSalesSentenceEn,
  }
}
