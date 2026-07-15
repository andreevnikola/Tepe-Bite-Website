/**
 * ТЕПЕ bite Impact fund — placeholder config (v1).
 *
 * Single source of truth for the /impact page's fund figures and contact
 * details. Numbers are intentionally zeroed and `isLive` is `false` so the
 * page renders a "launching soon" state instead of fake data. When the fund
 * goes live, flip `isLive` to `true`, fill the cent amounts + `lastUpdatedISO`,
 * add the IBAN and any donors — a one-file change, no component edits.
 *
 * All monetary values are integer EUR cents (same convention as `@/lib/money`).
 */

import { SITE_INFO } from "./site-info";

export type ImpactDonor = {
  name: string;
  amountCents: number;
  dateISO: string;
  note?: string;
};

export type ImpactConfig = {
  /** When false, the dashboard shows "launching soon" instead of the numbers. */
  isLive: boolean;
  /** Collected to date from the fixed 0.15 € pledge, in EUR cents. */
  collectedCents: number;
  /** External donations received, in EUR cents. */
  externalDonationsCents: number;
  /** Expected incoming from remaining stock still to be sold, in EUR cents. */
  expectedIncomingCents: number;
  /** ISO date of the last public update, or null before launch. */
  lastUpdatedISO: string | null;
  /** Fund contact email (donations / proposals). */
  contactEmail: string;
  /** Separate fund account IBAN — team fills this in later. */
  iban: string | null;
  /** Public donor list. Empty until the first supporter. */
  donors: ImpactDonor[];
  /** Google Form URL for campaign proposals; empty → fall back to socials. */
  formUrl: string;
};

export const IMPACT: ImpactConfig = {
  isLive: false,
  collectedCents: 0,
  externalDonationsCents: 0,
  expectedIncomingCents: 0,
  lastUpdatedISO: null,
  contactEmail: SITE_INFO.contact.impactEmail,
  iban: null,
  donors: [],
  formUrl: process.env.NEXT_PUBLIC_IMPACT_FORM_URL ?? "",
};
