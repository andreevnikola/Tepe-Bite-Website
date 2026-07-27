"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatAvailability, ContactCategory } from "@/lib/chat/types";
import type { Lang } from "@/store/lang";
import { CHAT_COPY, say } from "./copy";
import ChatComposer from "./ChatComposer";
import ChatContactForm from "./ChatContactForm";
import ChatMessageList from "./ChatMessageList";
import { useChat } from "./useChat";

/**
 * The assistant panel: a labelled modal dialog on desktop, a full-height sheet
 * on a phone.
 *
 * The window is deliberately built from the site's own card language — cream
 * surface, plum header carrying the Plovdiv hill line, caramel accents — so it
 * reads as the shop's own counter rather than a floating third-party widget.
 */

const SELECTORS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Below this width the panel becomes a full sheet and the page scroll locks. */
const SHEET_QUERY = "(max-width: 560px)";

type Props = {
  lang: Lang;
  availability: ChatAvailability;
  onClose: () => void;
};

export default function ChatWindow({ lang, availability, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const { entries, pending, blocker, send, retryLast } = useChat(lang);
  const [contactOpen, setContactOpen] = useState(false);

  // Move focus into the panel once, on open. The composer is the primary
  // action, and `aria-modal` makes the dialog name announce with it.
  useEffect(() => {
    composerRef.current?.focus();
  }, []);

  // Only the full sheet locks the page behind it; on desktop the visitor can
  // still read the page the assistant is talking about.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(SHEET_QUERY);
    const previous = document.body.style.overflow;
    const apply = () => {
      document.body.style.overflow = mq.matches ? "hidden" : previous;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.overflow = previous;
    };
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(SELECTORS),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  // The last question is what a contact draft is about; the server's category
  // from the most recent answer decides which mailbox we show.
  const lastQuestion =
    [...entries].reverse().find((e) => e.role === "user")?.text ?? "";
  const lastCategory: ContactCategory =
    [...entries].reverse().find((e) => e.role === "assistant")
      ?.contactCategory ?? "office";

  const inputDisabled = pending || Boolean(blocker?.blocksInput);

  return (
    <div
      ref={dialogRef}
      className="tb-chat-window"
      role="dialog"
      aria-modal="true"
      aria-label={say(lang, CHAT_COPY.windowAria)}
      onKeyDown={onKeyDown}
    >
      <header className="tb-chat-head">
        <svg
          className="tb-chat-hills"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z"
            fill="#fff"
          />
        </svg>
        <div className="tb-chat-head-text">
          <h2 className="tb-chat-title">{say(lang, CHAT_COPY.windowTitle)}</h2>
          <p className="tb-chat-sub">{say(lang, CHAT_COPY.windowSubtitle)}</p>
        </div>
        <button
          type="button"
          className="tb-chat-close"
          onClick={onClose}
          aria-label={say(lang, CHAT_COPY.closeAria)}
          title={say(lang, CHAT_COPY.close)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </header>

      <ChatMessageList
        lang={lang}
        entries={entries}
        pending={pending}
        blocker={blocker}
        onRetry={retryLast}
        onSuggestion={send}
        onAskTeam={() => setContactOpen(true)}
        contactSlot={
          contactOpen ? (
            <ChatContactForm
              lang={lang}
              question={lastQuestion}
              contactCategory={lastCategory}
              emailAutomation={availability.emailAutomation}
              onCancel={() => setContactOpen(false)}
            />
          ) : undefined
        }
      />

      <ChatComposer
        lang={lang}
        disabled={inputDisabled}
        pending={pending}
        onSend={send}
        inputRef={composerRef}
      />

      <style>{`
        .tb-chat-window {
          position: fixed;
          right: clamp(16px, 3vw, 28px);
          bottom: clamp(16px, 3vw, 28px);
          z-index: 1200;
          display: flex;
          flex-direction: column;
          width: min(400px, calc(100vw - 32px));
          /* Dynamic viewport units so the iOS keyboard shrinks the panel
             instead of pushing the composer off-screen. */
          height: min(640px, calc(100dvh - 120px));
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          box-shadow: 0 18px 60px oklch(20% 0.04 310 / 0.22);
          overflow: hidden;
          animation: tb-chat-window-in 0.24s ease both;
        }

        .tb-chat-head {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 16px 16px 18px;
          background: var(--plum);
          color: #fff;
          flex-shrink: 0;
          overflow: hidden;
        }
        /* The recurring Plovdiv hill line, at the section-footer opacity. */
        .tb-chat-hills {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          width: 100%;
          height: 42px;
          opacity: 0.08;
          pointer-events: none;
        }
        .tb-chat-head-text { position: relative; flex: 1; min-width: 0; }
        .tb-chat-title {
          font-family: var(--font-head);
          font-size: 1.15rem;
          font-weight: 600;
          line-height: 1.25;
          color: #fff;
        }
        .tb-chat-sub {
          margin-top: 3px;
          font-size: 0.78rem;
          line-height: 1.5;
          color: oklch(88% 0.03 315);
        }
        .tb-chat-close {
          position: relative;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: oklch(100% 0 0 / 0.12);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .tb-chat-close:hover { background: oklch(100% 0 0 / 0.24); }
        .tb-chat-close:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }

        @keyframes tb-chat-window-in {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Phone: an intentional full sheet, not a shrunken desktop panel. */
        @media (max-width: 560px) {
          .tb-chat-window {
            right: 0;
            bottom: 0;
            left: 0;
            top: 0;
            width: 100%;
            height: 100dvh;
            max-height: 100dvh;
            border: none;
            border-radius: 0;
            animation-name: tb-chat-sheet-in;
          }
          .tb-chat-head { padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 18px; }
        }
        @keyframes tb-chat-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tb-chat-window { animation: none; }
          .tb-chat-close { transition: none; }
        }
      `}</style>
    </div>
  );
}
