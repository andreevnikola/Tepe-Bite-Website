import { z } from "zod";
import { LANGS } from "@/store/lang";
import { PAGE_TYPES, TOPICS } from "@/lib/i18n/metadata";
import {
  ANSWER_STATUSES,
  CHAT_INTENTS,
  RETRIEVAL_PROFILES,
} from "./types";
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS } from "./config";

/**
 * Every boundary the assistant crosses is validated here: what the browser
 * sends us, and what each model sends back. Model output is untrusted input —
 * a planner that invents a `pagetype` or an answer that invents a source id
 * must fail validation loudly rather than reach the retriever or the renderer.
 */

// ─── Browser → server ────────────────────────────────────────────────────────

const TurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const ChatMessageRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  /** UI language — a hint only; the planner detects the real one per message. */
  uiLang: z.enum(LANGS),
  history: z.array(TurnSchema).max(MAX_HISTORY_TURNS * 2).default([]),
});
export type ChatMessageRequest = z.infer<typeof ChatMessageRequestSchema>;

/**
 * The escalation flow. The browser never names a recipient: it sends the
 * conversation context and we classify the mailbox server-side.
 * `submissionId` makes the send idempotent so a retry after a timeout cannot
 * deliver the same message twice.
 */
export const ChatContactRequestSchema = z.object({
  submissionId: z.string().trim().min(8).max(128),
  uiLang: z.enum(LANGS),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(255),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
  /** The question that could not be answered — used only for classification. */
  question: z.string().trim().max(MAX_MESSAGE_CHARS).default(""),
});
export type ChatContactRequest = z.infer<typeof ChatContactRequestSchema>;

// ─── Groq planner output ─────────────────────────────────────────────────────

/**
 * Strict on the closed vocabularies: an unknown intent or profile is a failed
 * plan, not a value to coerce. `pagetypes`/`topics`/`statuses` are the one
 * exception — unknown entries are dropped rather than failing the whole plan,
 * because a single stray tag should not cost us the good query the model wrote.
 */
export const PlannerOutputSchema = z.object({
  language: z.enum(LANGS),
  intent: z.enum(CHAT_INTENTS),
  searchQuery: z.string().trim().min(2).max(400),
  pagetypes: z.array(z.string()).max(12).default([]),
  topics: z.array(z.string()).max(12).default([]),
  statuses: z.array(z.string()).max(4).default([]),
  retrievalProfile: z.enum(RETRIEVAL_PROFILES),
  requiresMultipleSources: z.boolean(),
  allowCrossLanguageFallback: z.boolean(),
});
export type PlannerOutput = z.infer<typeof PlannerOutputSchema>;

// ─── Groq answer output ──────────────────────────────────────────────────────

export const AnswerOutputSchema = z.object({
  status: z.enum(ANSWER_STATUSES),
  answer: z.string().trim().max(4000),
  citedSourceIds: z.array(z.string().max(8)).max(8).default([]),
  learnMoreSourceIds: z.array(z.string().max(8)).max(8).default([]),
  confidenceReason: z.string().trim().max(600).optional(),
  contactCategory: z.enum(["office", "impact"]).optional(),
});
export type AnswerOutput = z.infer<typeof AnswerOutputSchema>;

/** The vocabularies the prompts quote, kept in sync with the metadata module. */
export const ALLOWED_PAGETYPES = PAGE_TYPES;
export const ALLOWED_TOPICS = TOPICS;
