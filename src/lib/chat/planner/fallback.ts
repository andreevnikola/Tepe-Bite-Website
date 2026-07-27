import "server-only";
import { DEFAULT_LANG, type Lang } from "@/store/lang";
import type {
  ChatIntent,
  ChatTurn,
  PlannerResult,
  RetrievalProfileName,
} from "@/lib/chat/types";

/**
 * The plan we use when Groq cannot produce one.
 *
 * This is what keeps the assistant usable on a free tier: when the planner is
 * rate-limited, times out, is unconfigured or returns nonsense twice, retrieval
 * still runs and the visitor still gets source cards — and, if the answer model
 * is healthy, still gets an answer. A chat that dies because a *planner* was
 * unavailable would be a self-inflicted outage.
 *
 * Deliberately dumb and dependency-free: no network, no model, no cleverness.
 * A conservative plan that retrieves slightly too much beats a confident plan
 * that retrieves the wrong thing, because the answer model can ignore a weak
 * source but cannot recover a page the filters removed.
 */

// ─── Language ────────────────────────────────────────────────────────────────

// Escapes rather than literal characters: the Cyrillic block boundaries are
// invisible in a source file and trivially broken by a stray edit.
const CYRILLIC_CHAR = /[\u0400-\u04FF]/g;
const LATIN_CHAR = /[A-Za-z]/g;

/**
 * Bulgarian questions routinely carry Latin fragments — the brand itself is
 * written "ТЕПЕ bite", and retailer names stay Latin — so a "contains Cyrillic"
 * test is too crude and an "is majority Latin" test misfires. A ratio with a low
 * threshold reads "there is real Bulgarian here" without being thrown by borrowed
 * words.
 */
const CYRILLIC_RATIO_FOR_BG = 0.3;

export function detectLanguage(message: string, uiLang: Lang): Lang {
  const cyrillic = message.match(CYRILLIC_CHAR)?.length ?? 0;
  const latin = message.match(LATIN_CHAR)?.length ?? 0;
  const letters = cyrillic + latin;

  // No letters at all ("?", "15", an emoji): nothing to detect, trust the UI.
  if (letters === 0) return uiLang || DEFAULT_LANG;
  if (cyrillic / letters >= CYRILLIC_RATIO_FOR_BG) return "bg";
  return "en";
}

// ─── Keyword families ────────────────────────────────────────────────────────

/**
 * Markers are stems, matched at a word start. A stem (not a whole word) is what
 * Bulgarian needs — "инициатива / инициативата / инициативи" share one prefix —
 * and anchoring to a non-letter boundary stops short English stems like "bar"
 * from matching inside unrelated words.
 */
function family(...markers: readonly string[]): RegExp {
  const alternation = markers
    .map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return new RegExp(
    `(?:^|[^0-9a-z\\u0400-\\u04ff])(?:${alternation})`,
    "i",
  );
}

/** Comparisons, rankings and superlatives, in both languages. */
const COMPARISON = family(
  "най-", "най ", "сравн", "разлик", "класац", "повече от", "по-голям", "по-значим",
  "most", "best", "biggest", "largest", "greatest", "top ", "compare", "comparison",
  "difference", "which one", "rank", "significant",
);

/** Anything unannounced: dates, retail availability, plans. */
const FUTURE = family(
  "кога", "ще има", "ще бъде", "ще се", "ще започн", "ще пусн", "скоро", "предстои",
  "предстоящ", "планира", "в бъдеще", "очаква се",
  "when will", "when are", "when do you", "will there", "will you", "will it",
  "soon", "upcoming", "coming to", "plan to", "planning to", "launch", "release date",
);

/** Named chains and retail vocabulary — availability we have not announced. */
const RETAIL = family(
  "кауфланд", "лидл", "хипермаркет", "супермаркет", "верига", "дистрибут",
  "kaufland", "lidl", "billa", "hypermarket", "supermarket", "retail", "chain",
  "distributor", "stocked",
);

const LEGAL = family(
  "поверителн", "лични данни", "бисквитк", "общи условия", "условия за", "правн",
  "право на отказ", "рекламац", "връщан", "гаранц", "гдпр", "политика за",
  "privacy", "cookie", "terms", "gdpr", "refund", "return", "withdrawal",
  "warranty", "legal", "data protection",
);

const ORDERING = family(
  "доставк", "поръчк", "поръча", "плащан", "плати", "куриер", "еконт", "спиди",
  "количк", "изпращан",
  "delivery", "shipping", "order", "checkout", "cart", "payment", "courier",
  "track",
);

const CONTACT = family(
  "контакт", "свържа", "свържете", "имейл", "мейл", "телефон", "пишете",
  "contact", "get in touch", "email", "e-mail", "phone", "reach you",
);

const IMPACT = family(
  "импакт", "фонд", "дарен", "кауза", "благотвор", "прозрачн", "разход", "0,15",
  "impact", "fund", "donat", "charit", "cause", "transparen", "expense", "0.15",
);

const INITIATIVE = family("инициатив", "проект", "initiative", "project");

const PARTNER = family(
  "партн", "спонсор", "дарител", "подкрепя",
  "partner", "sponsor", "supporter", "donor", "collaborat",
);

const PRODUCT = family(
  "продукт", "барче", "състав", "вкус", "алерг", "калори", "опаковк", "захар",
  "протеин", "цена", "струва", "карамел",
  "product", "bar", "ingredient", "flavor", "flavour", "taste", "allergen",
  "nutrition", "calorie", "sugar", "protein", "price", "cost", "caramel",
);

const LOCATION = family(
  "къде", "магазин", "обект", "локац", "карта", "намеря", "продава се",
  "where", "store", "buy", "location", "map", "find you", "sold",
);

const NEWS = family("новин", "блог", "статия", "news", "blog", "article", "announce");

const BRAND = family(
  "тепе", "пловдив", "компани", "истори", "екип", "мисия", "марка", "кои сте",
  "tepe", "plovdiv", "company", "story", "team", "mission", "brand", "who are you",
  "about you",
);

/**
 * Evaluated top to bottom; first match wins. Order encodes specificity, not
 * importance: "как се харчат парите от фонда за инициативи" is an impact
 * question that happens to mention initiatives, so IMPACT is tested first.
 */
const FAMILIES: ReadonlyArray<{ pattern: RegExp; intent: ChatIntent }> = [
  { pattern: LEGAL, intent: "legal" },
  { pattern: ORDERING, intent: "ordering_delivery" },
  { pattern: CONTACT, intent: "contact" },
  { pattern: IMPACT, intent: "impact" },
  { pattern: INITIATIVE, intent: "initiative_fact" },
  { pattern: PARTNER, intent: "partner" },
  { pattern: NEWS, intent: "news" },
  { pattern: LOCATION, intent: "location" },
  { pattern: PRODUCT, intent: "product" },
  { pattern: BRAND, intent: "brand" },
];

/** Intents whose answer usually lives on exactly one page. */
const EXACT_INTENTS: ReadonlySet<ChatIntent> = new Set<ChatIntent>([
  "legal",
  "ordering_delivery",
  "contact",
  "product",
  "location",
]);

// ─── Follow-up detection ─────────────────────────────────────────────────────

const FOLLOW_UP_OPENER = family(
  "а ", "ами", "и защо", "защо", "как така", "а какво", "а коя", "а кой", "тя",
  "той", "там", "това",
  "and ", "what about", "why", "how come", "it ", "that one", "there",
);

/** Below this a message almost never stands on its own after a prior turn. */
const FOLLOW_UP_MAX_CHARS = 60;

// ─── Plan ────────────────────────────────────────────────────────────────────

export function deterministicPlan(
  userMessage: string,
  history: readonly ChatTurn[],
  uiLang: Lang,
): PlannerResult {
  const message = userMessage.replace(/\s+/g, " ").trim();
  const language = detectLanguage(message, uiLang);

  const isComparison = COMPARISON.test(message);
  const isFuture = FUTURE.test(message) || RETAIL.test(message);

  const intent = pickIntent(message, isComparison, isFuture);
  const retrievalProfile = pickProfile(message, history, intent, isComparison, isFuture);

  return {
    language,
    intent,
    /**
     * The visitor's own words, untouched. Rewriting a query without a model is
     * how a fallback turns a recoverable miss into a confident wrong search —
     * the retriever is hybrid + reranked and copes well with a raw question.
     */
    searchQuery: message.slice(0, 400) || brandFallbackQuery(language),
    /**
     * No metadata filters, ever. Keyword matching is not evidence, and these
     * are applied as hard post-filters: guessing `topic: "returns"` on a
     * delivery question deletes the delivery page from the result set. An
     * unfiltered search is slightly noisier and always recoverable.
     */
    pagetypes: [],
    topics: [],
    statuses: [],
    retrievalProfile,
    requiresMultipleSources: isComparison,
    /**
     * Always allowed. Both language versions of the site carry the same facts,
     * so an English page is a far better outcome than no source at all — and
     * without a model we cannot tell when the language actually matters.
     */
    allowCrossLanguageFallback: true,
  };
}

function pickIntent(
  message: string,
  isComparison: boolean,
  isFuture: boolean,
): ChatIntent {
  // Checked first because both change what the answer is *allowed* to say, not
  // merely where to look.
  if (isFuture) return "future_unverified";
  if (isComparison) return "initiative_comparison";

  for (const { pattern, intent } of FAMILIES) {
    if (pattern.test(message)) return intent;
  }
  return "other";
}

function pickProfile(
  message: string,
  history: readonly ChatTurn[],
  intent: ChatIntent,
  isComparison: boolean,
  isFuture: boolean,
): RetrievalProfileName {
  if (isFuture) return "future_unverified";
  if (isComparison) return "comparative";

  const hasContext = history.length > 0;
  const looksLikeFollowUp =
    hasContext &&
    (message.length <= FOLLOW_UP_MAX_CHARS || FOLLOW_UP_OPENER.test(message));
  if (looksLikeFollowUp) return "follow_up";

  return EXACT_INTENTS.has(intent) ? "exact" : "broad";
}

/** Used only when the message carries no searchable text at all. */
function brandFallbackQuery(language: Lang): string {
  return language === "bg" ? "ТЕПЕ bite" : "TEPE bite";
}
