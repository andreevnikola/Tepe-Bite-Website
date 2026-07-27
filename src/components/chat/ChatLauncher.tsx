"use client";

import type { RefObject } from "react";
import { CHAT_COPY, say } from "./copy";
import type { Lang } from "@/store/lang";

/**
 * The floating invitation to open the assistant.
 *
 * A pill rather than the usual circular bubble: pills are the shape language of
 * every ТЕПЕ bite control, and a worded invitation reads as a shop greeting
 * instead of a generic AI orb. It is only ever rendered once the server has
 * confirmed the assistant is available (see `ChatWidget`).
 */

/**
 * The Plovdiv hill silhouette, reduced to a mark small enough for a 26px badge.
 * Exported because the window header and the assistant avatar reuse it — the
 * same motif carries the brand through every surface of the widget.
 */
export function HillMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 18 L2 13.5 Q6 9.5 10 12 Q14 14.5 17 10 Q20 5.5 22 9 L22 18 Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  lang: Lang;
  open: boolean;
  onOpen: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

export default function ChatLauncher({ lang, open, onOpen, buttonRef }: Props) {
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={say(lang, CHAT_COPY.launcherAria)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="tb-chat-launcher"
        // `display` rather than visibility: the button must be focusable the
        // moment the window closes, so focus can return to it.
        style={{ display: open ? "none" : "inline-flex" }}
      >
        <span className="tb-chat-launcher-mark">
          <HillMark size={17} />
        </span>
        <span className="tb-chat-launcher-text">
          {say(lang, CHAT_COPY.launcherLabel)}
        </span>
      </button>

      <style>{`
        .tb-chat-launcher {
          position: fixed;
          right: clamp(16px, 3vw, 28px);
          bottom: clamp(16px, 3vw, 28px);
          z-index: 1050;
          align-items: center;
          gap: 10px;
          padding: 10px 20px 10px 10px;
          border: none;
          border-radius: 100px;
          background: var(--plum);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 6px 28px oklch(32% 0.09 315 / 0.34);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
          animation: tb-chat-launcher-in 0.34s ease both;
        }
        .tb-chat-launcher:hover {
          background: oklch(28% 0.1 315);
          transform: translateY(-2px);
          box-shadow: 0 10px 34px oklch(32% 0.09 315 / 0.42);
        }
        .tb-chat-launcher:focus-visible {
          outline: 3px solid var(--caramel);
          outline-offset: 3px;
        }
        .tb-chat-launcher-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--caramel);
          color: #fff;
          flex-shrink: 0;
        }

        @keyframes tb-chat-launcher-in {
          from { opacity: 0; transform: translateY(10px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Below the fold of a phone the wording still fits, but the pill tucks
           in tighter so it never crowds a bottom-anchored CTA. */
        @media (max-width: 420px) {
          .tb-chat-launcher {
            font-size: 0.88rem;
            padding: 8px 16px 8px 8px;
            gap: 8px;
          }
          .tb-chat-launcher-mark { width: 27px; height: 27px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tb-chat-launcher { animation: none; transition: none; }
          .tb-chat-launcher:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
