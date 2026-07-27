"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Lang } from "@/store/lang";
import { CHAT_COPY, say, sayWith } from "./copy";
import { HillMark } from "./ChatLauncher";
import ChatSourceCard from "./ChatSourceCard";
import type { ChatBlocker, ChatEntry } from "./useChat";

/**
 * The transcript: greeting, turns, source cards, failure notices and the
 * escalation affordance, inside one polite live region.
 *
 * Assistant turns are cards on the warm surface with the hill mark beside them;
 * visitor turns are plum-tinted pills. The asymmetry does the work a colour-
 * coded "bot/you" label normally would, without shouting on every message.
 */

/** At most three cards — beyond that the panel stops being a conversation. */
const MAX_CARDS = 3;

type Props = {
  lang: Lang;
  entries: ChatEntry[];
  pending: boolean;
  blocker: ChatBlocker | null;
  onRetry: () => void;
  onSuggestion: (text: string) => void;
  onAskTeam: () => void;
  /** Rendered at the very end of the transcript when a draft is open. */
  contactSlot?: ReactNode;
};

function blockerMessage(lang: Lang, blocker: ChatBlocker): string {
  switch (blocker.kind) {
    case "unavailable_today":
      return say(lang, CHAT_COPY.unavailableToday);
    case "unavailable_temporary":
      return say(lang, CHAT_COPY.unavailableTemporary);
    case "rate_limited":
      return blocker.retryAfterSeconds
        ? `${say(lang, CHAT_COPY.rateLimited)} ${sayWith(
            lang,
            CHAT_COPY.rateLimitedIn,
            "s",
            String(blocker.retryAfterSeconds),
          )}`
        : say(lang, CHAT_COPY.rateLimited);
    case "no_answer_but_sources":
      return say(lang, CHAT_COPY.noAnswerButSources);
    case "network":
    default:
      return say(lang, CHAT_COPY.networkFailed);
  }
}

export default function ChatMessageList({
  lang,
  entries,
  pending,
  blocker,
  onRetry,
  onSuggestion,
  onAskTeam,
  contactSlot,
}: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  // Keep the newest turn in view. `block: "end"` avoids yanking the whole page
  // on iOS, where the sheet shares the document scroller.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [entries, pending, blocker, contactSlot]);

  const last = entries[entries.length - 1];
  const lastFailed =
    last?.role === "assistant" &&
    (last.degraded !== undefined ||
      last.status === "insufficient_evidence" ||
      last.status === "clarification_required");
  // The escalation is prominent only when we actually fell short; otherwise it
  // stays a quiet, always-available option.
  const escalationProminent = Boolean(lastFailed || blocker);
  const showEscalation = entries.length > 0 && !contactSlot;

  return (
    <div className="tb-chat-scroll">
      <div
        className="tb-chat-log"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label={say(lang, CHAT_COPY.conversationAria)}
      >
        {/* ── Opening ── */}
        <div className="tb-msg tb-msg-a">
          <span className="tb-msg-mark" aria-hidden="true">
            <HillMark size={15} />
          </span>
          <div className="tb-bubble tb-bubble-a">
            <p className="tb-bubble-text">{say(lang, CHAT_COPY.greeting)}</p>
            <p className="tb-ai-note">{say(lang, CHAT_COPY.aiNote)}</p>
          </div>
        </div>

        {entries.length === 0 && (
          <div className="tb-suggest">
            <span className="label-tag tb-suggest-label">
              {say(lang, CHAT_COPY.suggestionsLabel)}
            </span>
            <div className="tb-suggest-row">
              {CHAT_COPY.suggestions[lang].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="tb-chip"
                  onClick={() => onSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Turns ── */}
        {entries.map((entry) =>
          entry.role === "user" ? (
            <div key={entry.id} className="tb-msg tb-msg-u">
              <div className="tb-bubble tb-bubble-u">
                <p className="tb-bubble-text">{entry.text}</p>
              </div>
            </div>
          ) : (
            <div key={entry.id} className="tb-msg tb-msg-a">
              <span className="tb-msg-mark" aria-hidden="true">
                <HillMark size={15} />
              </span>
              <div className="tb-bubble tb-bubble-a">
                {/* Retrieval survived but generation did not: say so plainly
                    rather than letting the cards imply an answer. */}
                {entry.degraded === "no_answer_but_sources" && (
                  <p className="tb-degraded">
                    {say(lang, CHAT_COPY.noAnswerButSources)}
                  </p>
                )}
                {entry.text ? (
                  <p className="tb-bubble-text">{entry.text}</p>
                ) : null}

                {entry.cards.length > 0 && (
                  <div className="tb-cards">
                    <span className="label-tag tb-cards-label">
                      {say(lang, CHAT_COPY.sourcesHeading)}
                    </span>
                    {entry.cards.slice(0, MAX_CARDS).map((card) => (
                      <ChatSourceCard key={card.id} card={card} lang={lang} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {/* ── Waiting ── */}
        {pending && (
          <div className="tb-msg tb-msg-a">
            <span className="tb-msg-mark" aria-hidden="true">
              <HillMark size={15} />
            </span>
            <div className="tb-bubble tb-bubble-a tb-typing">
              <span className="tb-dot" />
              <span className="tb-dot" />
              <span className="tb-dot" />
              <span className="tb-typing-text">
                {say(lang, CHAT_COPY.thinking)}
              </span>
            </div>
          </div>
        )}

        {/* ── Failure notice ── */}
        {blocker && (
          <div className="tb-notice" role="status">
            <p className="tb-notice-text">{blockerMessage(lang, blocker)}</p>
            {blocker.canRetry && !pending && (
              <button type="button" className="tb-notice-btn" onClick={onRetry}>
                {say(lang, CHAT_COPY.retry)}
              </button>
            )}
          </div>
        )}

        {/* ── Escalation ── */}
        {showEscalation &&
          (escalationProminent ? (
            <div className="tb-escalate">
              <button
                type="button"
                className="btn btn-caramel tb-escalate-btn"
                onClick={onAskTeam}
              >
                {say(lang, CHAT_COPY.contactTrigger)}
              </button>
            </div>
          ) : (
            <button type="button" className="tb-quiet" onClick={onAskTeam}>
              {say(lang, CHAT_COPY.contactTrigger)}
            </button>
          ))}

        {contactSlot}

        <div ref={endRef} />
      </div>

      <style>{`
        .tb-chat-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          background: var(--bg);
        }
        .tb-chat-log {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px clamp(14px, 4vw, 18px) 20px;
        }

        .tb-msg { display: flex; gap: 8px; max-width: 100%; }
        .tb-msg-a { align-items: flex-start; }
        .tb-msg-u { justify-content: flex-end; }

        .tb-msg-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--caramel-lt);
          color: var(--caramel);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tb-bubble {
          border-radius: var(--r-md);
          padding: 11px 14px;
          max-width: calc(100% - 34px);
          min-width: 0;
        }
        .tb-bubble-a {
          background: var(--surface);
          border: 1px solid var(--border);
          border-bottom-left-radius: 7px;
          box-shadow: var(--shadow);
        }
        .tb-bubble-u {
          background: var(--plum-lt);
          border-bottom-right-radius: 7px;
          max-width: 86%;
        }
        .tb-bubble-text {
          font-size: 0.92rem;
          line-height: 1.62;
          color: var(--text-mid);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .tb-bubble-u .tb-bubble-text { color: var(--plum); font-weight: 500; }

        .tb-ai-note {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
          font-size: 0.74rem;
          line-height: 1.5;
          color: var(--text-soft);
        }
        .tb-degraded {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--sky-dk);
          background: var(--sky-lt);
          border-radius: var(--r-sm);
          padding: 9px 11px;
          margin-bottom: 10px;
        }

        .tb-cards {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }
        .tb-cards-label { font-size: 0.62rem; letter-spacing: 0.1em; }

        .tb-suggest { display: flex; flex-direction: column; gap: 8px; padding-left: 34px; }
        .tb-suggest-label { font-size: 0.62rem; letter-spacing: 0.1em; }
        .tb-suggest-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .tb-chip {
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--plum);
          border-radius: 100px;
          padding: 7px 14px;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1.3;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .tb-chip:hover {
          background: var(--caramel-lt);
          border-color: var(--caramel);
          transform: translateY(-1px);
        }
        .tb-chip:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }

        .tb-typing { display: flex; align-items: center; gap: 5px; }
        .tb-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--caramel);
          animation: pulse-dot 1.4s infinite;
        }
        .tb-dot:nth-child(2) { animation-delay: 0.18s; }
        .tb-dot:nth-child(3) { animation-delay: 0.36s; }
        .tb-typing-text {
          margin-left: 5px;
          font-size: 0.8rem;
          color: var(--text-soft);
        }

        .tb-notice {
          background: var(--caramel-lt);
          border-left: 4px solid var(--caramel);
          border-radius: var(--r-sm);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 9px;
        }
        .tb-notice-text {
          font-size: 0.85rem;
          line-height: 1.55;
          color: oklch(38% 0.1 55);
        }
        .tb-notice-btn {
          border: none;
          background: var(--plum);
          color: #fff;
          border-radius: 100px;
          padding: 8px 18px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .tb-notice-btn:hover { background: oklch(28% 0.1 315); }
        .tb-notice-btn:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }

        .tb-escalate { display: flex; justify-content: center; padding-top: 2px; }
        .tb-escalate-btn { padding: 11px 22px; font-size: 0.88rem; }
        .tb-quiet {
          align-self: center;
          border: none;
          background: none;
          color: var(--caramel);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
        }
        .tb-quiet:hover { color: oklch(56% 0.16 52); }
        .tb-quiet:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          .tb-dot { animation: none; opacity: 0.75; }
          .tb-chip:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
