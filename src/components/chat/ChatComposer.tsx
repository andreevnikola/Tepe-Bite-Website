"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import type { Lang } from "@/store/lang";
import { CHAT_COPY, say } from "./copy";

/**
 * The question field.
 *
 * Enter sends, Shift+Enter adds a newline — the convention visitors already
 * expect from a chat box — and the same rule is spelled out under the field so
 * nobody has to guess. The textarea grows with the text up to a ceiling, past
 * which it scrolls, so a long question never eats the transcript.
 */

const MAX_HEIGHT_PX = 128;
/** Generous, but bounded: the planner has no use for an essay. */
const MAX_CHARS = 1000;

type Props = {
  lang: Lang;
  /** True while a question is in flight or while the assistant is blocked. */
  disabled: boolean;
  pending: boolean;
  onSend: (text: string) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
};

export default function ChatComposer({
  lang,
  disabled,
  pending,
  onSend,
  inputRef,
}: Props) {
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const grow = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [inputRef]);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    // Reset the grown height with the value, or the box keeps the tall shape.
    const el = inputRef.current;
    if (el) el.style.height = "auto";
  }, [value, disabled, onSend, inputRef]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      ref={formRef}
      className="tb-composer"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="tb-composer-row">
        <textarea
          ref={inputRef}
          className="tb-composer-input"
          rows={1}
          value={value}
          maxLength={MAX_CHARS}
          disabled={disabled && !pending}
          placeholder={say(lang, CHAT_COPY.placeholder)}
          aria-label={say(lang, CHAT_COPY.placeholder)}
          onChange={(e) => {
            setValue(e.target.value);
            grow();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="submit"
          className="tb-composer-send"
          disabled={!canSend}
          aria-label={say(lang, CHAT_COPY.sendAria)}
          title={say(lang, CHAT_COPY.send)}
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="tb-composer-hint">{say(lang, CHAT_COPY.composerHint)}</p>

      <style>{`
        .tb-composer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 12px clamp(14px, 4vw, 18px)
                   calc(10px + env(safe-area-inset-bottom, 0px));
          flex-shrink: 0;
        }
        .tb-composer-row { display: flex; align-items: flex-end; gap: 9px; }
        .tb-composer-input {
          flex: 1;
          min-width: 0;
          resize: none;
          border: 1.5px solid var(--border);
          border-radius: var(--r-sm);
          background: #fff;
          padding: 10px 13px;
          font-family: var(--font-body);
          /* 16px keeps iOS Safari from zooming the page on focus. */
          font-size: 16px;
          line-height: 1.5;
          color: var(--text);
          outline: none;
          max-height: ${MAX_HEIGHT_PX}px;
          overflow-y: auto;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .tb-composer-input::placeholder { color: var(--text-soft); }
        .tb-composer-input:focus {
          border-color: var(--caramel);
          box-shadow: 0 0 0 3px oklch(66% 0.16 52 / 0.16);
        }
        .tb-composer-input:disabled {
          background: var(--surface2);
          color: var(--text-soft);
          cursor: not-allowed;
        }
        .tb-composer-send {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 50%;
          background: var(--plum);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
        }
        .tb-composer-send:hover:not(:disabled) {
          background: oklch(28% 0.1 315);
          transform: translateY(-1px);
        }
        .tb-composer-send:disabled {
          background: var(--surface2);
          color: var(--text-soft);
          cursor: not-allowed;
        }
        .tb-composer-send:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }
        .tb-composer-hint {
          margin-top: 7px;
          font-size: 0.7rem;
          color: var(--text-soft);
          text-align: center;
        }
        @media (max-width: 420px) {
          .tb-composer-hint { font-size: 0.66rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tb-composer-send:hover:not(:disabled) { transform: none; }
        }
      `}</style>
    </form>
  );
}
