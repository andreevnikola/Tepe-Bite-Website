"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnswerStatus,
  ChatAvailability,
  ChatFailureKind,
  ChatMessageErrorResponse,
  ChatMessageResponse,
  ChatTurn,
  ContactCategory,
  SourceCard,
} from "@/lib/chat/types";
import type { Lang } from "@/store/lang";

/**
 * Conversation state, every network call the widget makes, and the abort
 * handling that guarantees the loading indicator always clears.
 *
 * Two rules shape this module:
 *  1. No request may hang forever. Every fetch gets an `AbortController` and a
 *     client-side deadline, so a stalled provider surfaces as a retryable
 *     notice rather than an eternal spinner.
 *  2. The browser never decides whether the assistant is allowed to run. It
 *     only reports what the server told it, in the server's own coarse terms.
 */

// Retrieval legitimately takes tens of seconds, so the message deadline is
// generous; the other two calls are cheap and fail fast.
const AVAILABILITY_TIMEOUT_MS = 8_000;
const MESSAGE_TIMEOUT_MS = 60_000;
const CONTACT_TIMEOUT_MS = 20_000;

/** How many prior turns travel with a question. Enough for follow-ups, bounded. */
const HISTORY_TURNS = 8;

export type ChatEntry =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      cards: SourceCard[];
      status: AnswerStatus;
      /** Set when retrieval worked but the written answer did not arrive. */
      degraded?: ChatFailureKind;
      contactCategory: ContactCategory;
    };

/** A local kind for "we gave up waiting" — never returned by the server. */
export type ChatBlockerKind = ChatFailureKind | "network";

export type ChatBlocker = {
  kind: ChatBlockerKind;
  retryAfterSeconds?: number;
  /** True for the two availability kinds: new questions cannot succeed. */
  blocksInput: boolean;
  canRetry: boolean;
};

function newId(): string {
  // `randomUUID` needs a secure context; the fallback only has to be unique
  // within one conversation, never unguessable.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Public so the contact form can mint one id per draft and reuse it on retry. */
export const newSubmissionId = newId;

function blockerFor(
  kind: ChatBlockerKind,
  retryAfterSeconds?: number,
): ChatBlocker {
  const blocksInput =
    kind === "unavailable_temporary" || kind === "unavailable_today";
  return {
    kind,
    retryAfterSeconds,
    blocksInput,
    // Retrying a daily quota cannot help before tomorrow; everything else can.
    canRetry: kind !== "unavailable_today",
  };
}

/**
 * Runs `fetch` under a deadline. Resolves the response or throws — callers only
 * ever distinguish "usable response" from "did not arrive".
 */
async function fetchWithDeadline(
  input: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const relay = () => controller.abort();
  externalSignal?.addEventListener("abort", relay);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", relay);
  }
}

// ─── Availability ────────────────────────────────────────────────────────────

export type AvailabilityState =
  | { phase: "checking" }
  | { phase: "resolved"; value: ChatAvailability }
  | { phase: "failed" };

/**
 * Asks the server once per page view whether the assistant may be offered.
 *
 * Stays in `checking` until an answer arrives, which is what keeps the launcher
 * from flashing: the caller renders nothing at all in that phase. Any failure —
 * network, timeout, non-200, malformed body — resolves to `failed` and is never
 * retried, so the launcher stays hidden for the rest of the page view.
 */
export function useChatAvailability(): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>({ phase: "checking" });

  useEffect(() => {
    const abort = new AbortController();
    let active = true;

    (async () => {
      try {
        const res = await fetchWithDeadline(
          "/api/chat/availability",
          { method: "GET", headers: { accept: "application/json" } },
          AVAILABILITY_TIMEOUT_MS,
          abort.signal,
        );
        if (!res.ok) throw new Error("unavailable");
        const body: unknown = await res.json();
        if (!active) return;
        if (
          typeof body === "object" &&
          body !== null &&
          typeof (body as ChatAvailability).available === "boolean"
        ) {
          setState({ phase: "resolved", value: body as ChatAvailability });
        } else {
          setState({ phase: "failed" });
        }
      } catch {
        if (active) setState({ phase: "failed" });
      }
    })();

    return () => {
      active = false;
      abort.abort();
    };
  }, []);

  return state;
}

// ─── Conversation ────────────────────────────────────────────────────────────

type Attempt = { text: string; history: ChatTurn[] };

export function useChat(lang: Lang) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [pending, setPending] = useState(false);
  const [blocker, setBlocker] = useState<ChatBlocker | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastAttemptRef = useRef<Attempt | null>(null);

  // Abort any in-flight request when the widget leaves the tree, so a resolved
  // promise can never write state into an unmounted component.
  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(
    async (attempt: Attempt) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      lastAttemptRef.current = attempt;
      setBlocker(null);
      setPending(true);

      try {
        const res = await fetchWithDeadline(
          "/api/chat/message",
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              message: attempt.text,
              uiLang: lang,
              history: attempt.history,
            }),
          },
          MESSAGE_TIMEOUT_MS,
          controller.signal,
        );

        const body: unknown = await res.json().catch(() => null);

        if (
          typeof body === "object" &&
          body !== null &&
          (body as { ok?: unknown }).ok === true
        ) {
          const ok = body as ChatMessageResponse;
          setEntries((prev) => [
            ...prev,
            {
              id: newId(),
              role: "assistant",
              text: ok.answer,
              cards: ok.cards ?? [],
              status: ok.status,
              degraded: ok.degraded,
              contactCategory: ok.contactCategory,
            },
          ]);
          return;
        }

        if (
          typeof body === "object" &&
          body !== null &&
          (body as { ok?: unknown }).ok === false
        ) {
          const err = body as ChatMessageErrorResponse;
          // Retrieval can survive a generation failure; when it did, the cards
          // are worth showing rather than throwing the whole turn away.
          if (err.kind === "no_answer_but_sources" && err.cards?.length) {
            setEntries((prev) => [
              ...prev,
              {
                id: newId(),
                role: "assistant",
                text: "",
                cards: err.cards ?? [],
                status: "insufficient_evidence",
                degraded: "no_answer_but_sources",
                contactCategory: err.contactCategory ?? "office",
              },
            ]);
            return;
          }
          setBlocker(blockerFor(err.kind, err.retryAfterSeconds));
          return;
        }

        // A response we cannot read is treated as a transient outage, never as
        // a raw provider error shown to the visitor.
        setBlocker(blockerFor("unavailable_temporary"));
      } catch {
        // Covers the deadline abort, offline and DNS failures alike.
        setBlocker(blockerFor("network"));
      } finally {
        // Guard against a stale attempt clearing a newer request's spinner.
        if (abortRef.current === controller) {
          abortRef.current = null;
          setPending(false);
        }
      }
    },
    [lang],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      // The history is the conversation as it stood *before* this question.
      const history: ChatTurn[] = entries
        .map((e) => ({ role: e.role, content: e.text }))
        .filter((turn) => turn.content.length > 0)
        .slice(-HISTORY_TURNS);

      setEntries((prev) => [...prev, { id: newId(), role: "user", text }]);
      void run({ text, history });
    },
    [entries, pending, run],
  );

  /** Re-sends the last question with its original history — no duplicate turn. */
  const retryLast = useCallback(() => {
    const attempt = lastAttemptRef.current;
    if (!attempt || pending) return;
    void run(attempt);
  }, [pending, run]);

  /**
   * Marks the assistant unavailable without touching the transcript. Used when
   * an availability signal arrives while the window is open.
   */
  const blockWith = useCallback((kind: ChatBlockerKind) => {
    setBlocker(blockerFor(kind));
    setPending(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const dismissBlocker = useCallback(() => setBlocker(null), []);

  return {
    entries,
    pending,
    blocker,
    send,
    retryLast,
    blockWith,
    dismissBlocker,
    hasAsked: entries.length > 0,
  };
}

// ─── Contact escalation ──────────────────────────────────────────────────────

export type ContactPayload = {
  submissionId: string;
  uiLang: Lang;
  name: string;
  email: string;
  subject: string;
  body: string;
  question: string;
  /** Honeypot, named to match the project's other forms. Always empty for humans. */
  website: string;
};

export type ContactOutcome =
  | { ok: true }
  | { ok: false; reason: "rejected" | "failed" };

/**
 * Posts one contact draft.
 *
 * `submissionId` is minted once per draft by the caller and reused verbatim on
 * every retry, so a timeout followed by a retry is idempotent server-side and
 * the visitor's message can never be delivered twice.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<ContactOutcome> {
  try {
    const res = await fetchWithDeadline(
      "/api/chat/contact",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
      CONTACT_TIMEOUT_MS,
    );
    const body: unknown = await res.json().catch(() => null);
    if (
      typeof body === "object" &&
      body !== null &&
      (body as { ok?: unknown }).ok === true
    ) {
      return { ok: true };
    }
    // The server is authoritative on validation; a 4xx means the draft itself
    // needs changing, anything else is worth retrying with the same id.
    return { ok: false, reason: res.status >= 400 && res.status < 500 ? "rejected" : "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
