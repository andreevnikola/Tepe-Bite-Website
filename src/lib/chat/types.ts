import type { Lang } from "@/store/lang";
import type { PageType, RetrievalStatus, Topic } from "@/lib/i18n/metadata";

/**
 * Shared contracts for the site assistant.
 *
 * Pipeline: Groq planner → Cloudflare AI Search retrieval → Groq grounded
 * answer → application-rendered answer + trusted source cards. Cloudflare is
 * retrieval infrastructure only; it never generates the answer the visitor
 * reads, and the model never supplies a URL — it selects application-assigned
 * source ids which we map back to verified URLs.
 *
 * This module is deliberately free of `server-only` so the chat UI can import
 * the response types it renders. It must therefore never hold configuration,
 * credentials or prompts.
 */

// ─── Conversation ────────────────────────────────────────────────────────────

export type ChatRole = "user" | "assistant";

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

// ─── Planner ─────────────────────────────────────────────────────────────────

/**
 * What the visitor is asking for. Drives the retrieval profile, the metadata
 * pre-filters and how many distinct sources the answer needs.
 */
export const CHAT_INTENTS = [
  "brand",
  "product",
  "initiative_fact",
  "initiative_comparison",
  "impact",
  "partner",
  "location",
  "news",
  "legal",
  "ordering_delivery",
  "contact",
  "future_unverified",
  "other",
] as const;
export type ChatIntent = (typeof CHAT_INTENTS)[number];

export const RETRIEVAL_PROFILES = [
  "exact",
  "broad",
  "comparative",
  "follow_up",
  "future_unverified",
] as const;
export type RetrievalProfileName = (typeof RETRIEVAL_PROFILES)[number];

export type PlannerResult = {
  language: Lang;
  intent: ChatIntent;
  /** Standalone, enriched query in the language of the latest user message. */
  searchQuery: string;
  pagetypes: PageType[];
  topics: Topic[];
  statuses: RetrievalStatus[];
  retrievalProfile: RetrievalProfileName;
  requiresMultipleSources: boolean;
  allowCrossLanguageFallback: boolean;
};

/** How the plan was produced — surfaced in diagnostics, never to the visitor. */
export type PlannerOrigin = "groq" | "groq_retry" | "fallback";

export type PlannedQuery = {
  plan: PlannerResult;
  origin: PlannerOrigin;
  latencyMs: number;
};

// ─── Retrieval ───────────────────────────────────────────────────────────────

/** One chunk as returned by Cloudflare AI Search, normalised. */
export type RetrievedChunk = {
  /** Cloudflare's chunk id — used only for de-duplication. */
  chunkId: string;
  /** Verified source URL (`item.key`). Never model-supplied. */
  url: string;
  text: string;
  score: number;
  title: string;
  description: string;
  image: string | null;
  lang: Lang | null;
  pageType: PageType | null;
  topic: Topic | null;
  status: RetrievalStatus | null;
};

/**
 * A distinct source page assembled from its chunks, with the stable id the
 * answer model cites. Ids are assigned by the application (`S1`, `S2`, …) and
 * mapped back to `url` here, so a hallucinated citation cannot become a link.
 */
export type ChatSource = {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  lang: Lang | null;
  pageType: PageType | null;
  topic: Topic | null;
  status: RetrievalStatus | null;
  /** Best chunk score for this page — drives ordering, not shown to visitors. */
  score: number;
  /** Chunk texts belonging to this page, best first. */
  passages: string[];
};

/** Which stage of the staged fallback produced the final source set. */
export type RetrievalStage =
  | "preferred_language_filtered"
  | "preferred_language_broad"
  | "cross_language_filtered"
  | "corpus_wide"
  | "none";

export type RetrievalResult = {
  sources: ChatSource[];
  stage: RetrievalStage;
  /** Every query string actually sent to Cloudflare, in order. */
  queries: string[];
  latencyMs: number;
  /** Total chunks seen before de-duplication and trimming. */
  rawChunkCount: number;
};

// ─── Answer ──────────────────────────────────────────────────────────────────

export const ANSWER_STATUSES = [
  "answered",
  "inference",
  "clarification_required",
  "insufficient_evidence",
] as const;
export type AnswerStatus = (typeof ANSWER_STATUSES)[number];

export type ContactCategory = "office" | "impact";

export type AnswerResult = {
  status: AnswerStatus;
  answer: string;
  citedSourceIds: string[];
  learnMoreSourceIds: string[];
  confidenceReason?: string;
  contactCategory?: ContactCategory;
};

// ─── Public API payloads ─────────────────────────────────────────────────────

/** A source card, already resolved to a trusted URL by the server. */
export type SourceCard = {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  lang: Lang | null;
  pageType: PageType | null;
  /** `cited` backs a claim in the answer; `learn_more` is optional reading. */
  role: "cited" | "learn_more";
};

/**
 * Why the assistant could not produce a generated answer. Coarse, public and
 * localisable — it never carries a provider name, status code or message.
 */
export type ChatFailureKind =
  | "unavailable_temporary"
  | "unavailable_today"
  | "rate_limited"
  | "no_answer_but_sources";

export type ChatMessageResponse = {
  ok: true;
  status: AnswerStatus;
  answer: string;
  language: Lang;
  cards: SourceCard[];
  /** Server-chosen mailbox for the escalation flow; never picked by the browser. */
  contactCategory: ContactCategory;
  /** Present when generation failed but retrieval succeeded. */
  degraded?: ChatFailureKind;
  timings: ChatTimings;
};

export type ChatMessageErrorResponse = {
  ok: false;
  kind: ChatFailureKind;
  /** Seconds to wait before a retry can succeed, when knowable. */
  retryAfterSeconds?: number;
  /** Sources worth showing even though generation failed. */
  cards?: SourceCard[];
  contactCategory?: ContactCategory;
};

/** Measured independently so a slow stage can be identified without guessing. */
export type ChatTimings = {
  plannerMs: number;
  retrievalMs: number;
  answerMs: number;
  totalMs: number;
};

// ─── Availability ────────────────────────────────────────────────────────────

/**
 * The only shape the browser ever receives about provider health. Deliberately
 * coarse: no provider names, error strings, account ids or configuration.
 */
export type ChatAvailability = {
  available: boolean;
  /** `daily` unlocks the "try again tomorrow" copy; `temporary` never does. */
  scope?: "temporary" | "daily";
  /** False when the automatic "ask the team" submission is unavailable. */
  emailAutomation: boolean;
};
