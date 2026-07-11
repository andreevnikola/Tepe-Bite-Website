/**
 * Money formatting helpers. All inputs are integer EUR cents.
 * Product prices are NOT stored here — they live in the ProductPlan DB table.
 * BGN conversion uses the fixed EUR/BGN rate from pricing config.
 */

import { PRICING } from "@/lib/config/pricing";

// Use a locale that formats numbers with a space as the thousands separator
// and a comma as the decimal separator (e.g. "10 000,00").
const GROUPED = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format EUR cents as "€3,750.00" (grouped thousands) */
export function formatMoneyEUR(cents: number): string {
  return `€${GROUPED.format(cents / 100)}`;
}

/** Format EUR cents as BGN display string: "7,334.36 лв." */
export function formatMoneyBGN(cents: number): string {
  const bgn = (cents / 100) * PRICING.EUR_TO_BGN;
  return `${GROUPED.format(bgn)} лв.`;
}

/** Format EUR cents as dual currency: "€30.00 (58.67 лв.)" */
export function formatDualMoney(cents: number): string {
  return `${formatMoneyEUR(cents)} (${formatMoneyBGN(cents)})`;
}

/**
 * Convert EUR cents to BGN cents (rounded to nearest cent).
 * Use only for display — never store BGN amounts; all persisted values are EUR cents.
 */
export function eurCentsToBgnCents(eurCents: number): number {
  return Math.round(eurCents * PRICING.EUR_TO_BGN);
}
