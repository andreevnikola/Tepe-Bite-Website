import "server-only";

import { GENERAL_EMAIL, IMPACT_EMAIL } from "@/lib/config/site-info";
import type { ChatIntent, ContactCategory } from "../types";

/**
 * Which ТЕПЕ bite mailbox an escalation goes to.
 *
 * The browser never names a recipient and the answer model only *suggests* one:
 * both are untrusted. This module is the single authority, and
 * `resolveRecipient()` is the only place an address is produced — so a
 * compromised client or a creative model can at worst pick the wrong one of two
 * public mailboxes, never an arbitrary destination.
 */

/**
 * Intents that are inherently about the social-impact side of the brand.
 * `partner` lands here because partnership enquiries are handled by the same
 * people who run the initiatives, not by the shop.
 */
const IMPACT_INTENTS: ReadonlySet<ChatIntent> = new Set<ChatIntent>([
  "impact",
  "initiative_fact",
  "initiative_comparison",
  "partner",
]);

/**
 * Keyword override, checked before the intent. Wording beats classification:
 * a visitor who writes "искам да даря" is asking Impact regardless of which
 * intent the planner produced. Bulgarian entries are lowercase and unaccented;
 * matching is done on a lowercased haystack.
 */
const IMPACT_KEYWORDS = [
  // bg
  "дарен",
  "дарит",
  "дарявам",
  "дари",
  "инициатив",
  "кауз",
  "доброволц",
  "доброволе",
  "спонсор",
  "партньорств",
  "партнира",
  "фонд",
  "impact",
  "импакт",
  "благотворит",
  "общност",
  // en
  "donat",
  "initiative",
  "volunteer",
  "sponsor",
  "partnership",
  "collaborat",
  "charit",
  "fundrais",
  "social impact",
  "community project",
] as const;

/**
 * Commercial wording that must win even when the surrounding question mentions
 * the fund — "where can I buy a bar that supports the fund" is a shop question.
 */
const OFFICE_KEYWORDS = [
  // bg
  "поръчк",
  "поръча",
  "доставк",
  "куриер",
  "цена",
  "цени",
  "плащан",
  "фактур",
  "рекламац",
  "връщан",
  "магазин",
  "наличн",
  "купя",
  "купи",
  "закупя",
  "търгов",
  "едро",
  "дистрибут",
  // en
  "order",
  "deliver",
  "shipping",
  "courier",
  "price",
  "payment",
  "invoice",
  "refund",
  "return",
  "retail",
  "stock",
  "buy",
  "purchase",
  "wholesale",
  "distribut",
  "stockist",
] as const;

function containsAny(haystack: string, needles: readonly string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

/**
 * Decide the mailbox from everything we know, most trustworthy signal last.
 *
 * Order of precedence:
 *  1. Commercial keywords in the visitor's own words (shop questions are the
 *     ones that go wrong most expensively — an unanswered order enquiry).
 *  2. Impact keywords in the visitor's own words.
 *  3. The planner intent.
 *  4. The answer model's suggestion, used only as a tie-break.
 *  5. Office, the safe default: the general mailbox is staffed for triage and
 *     can forward, whereas the impact mailbox is not a customer-service desk.
 */
export function classifyContact(input: {
  question: string;
  intent?: ChatIntent;
  modelSuggestion?: ContactCategory;
}): ContactCategory {
  const text = (input.question ?? "").toLowerCase();

  if (containsAny(text, OFFICE_KEYWORDS)) return "office";
  if (containsAny(text, IMPACT_KEYWORDS)) return "impact";
  if (input.intent && IMPACT_INTENTS.has(input.intent)) return "impact";
  if (input.modelSuggestion === "impact") return "impact";
  return "office";
}

/** The only function that turns a category into an address. */
export function resolveRecipient(category: ContactCategory): string {
  return category === "impact" ? IMPACT_EMAIL : GENERAL_EMAIL;
}
