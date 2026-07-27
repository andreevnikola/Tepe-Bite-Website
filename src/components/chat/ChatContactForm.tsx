"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import HoneypotField from "@/components/checkout/HoneypotField";
import {
  GENERAL_EMAIL,
  IMPACT_EMAIL,
  mailtoHref,
} from "@/lib/config/site-info";
import type { ContactCategory } from "@/lib/chat/types";
import type { Lang } from "@/store/lang";
import { CHAT_COPY, say, sayWith } from "./copy";
import { newSubmissionId, submitContact } from "./useChat";

/**
 * The "ask the team for me" draft.
 *
 * Nothing leaves the browser until the visitor reads the message and presses
 * send: subject and body are pre-filled from the conversation but fully
 * editable, and there is no auto-submit path.
 *
 * Double delivery is prevented on two levels. `submissionIdRef` is minted once
 * when this component mounts — one draft, one id — and is reused verbatim by
 * every retry, so the server can recognise a repeat of the same submission.
 * On top of that `inFlightRef` rejects a second click synchronously, before
 * React has flushed the disabled state, and a delivered draft moves to a
 * terminal "sent" view with no submit control at all.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Keeps the generated subject to a readable single line. */
const SUBJECT_QUESTION_MAX = 70;

type Props = {
  lang: Lang;
  /** The visitor's question, used to pre-fill the draft. */
  question: string;
  /** Chosen by the server; the browser only maps it to a published address. */
  contactCategory: ContactCategory;
  /** False when the server reports automatic sending is switched off. */
  emailAutomation: boolean;
  onCancel: () => void;
};

type FieldKey = "name" | "email" | "subject" | "body";

export default function ChatContactForm({
  lang,
  question,
  contactCategory,
  emailAutomation,
  onCancel,
}: Props) {
  // One id per draft. It survives every re-render and every retry of this same
  // draft, which is exactly what makes a retry after a timeout idempotent.
  const submissionIdRef = useRef<string>(newSubmissionId());
  const inFlightRef = useRef(false);

  const recipient = contactCategory === "impact" ? IMPACT_EMAIL : GENERAL_EMAIL;

  const shortQuestion =
    question.length > SUBJECT_QUESTION_MAX
      ? `${question.slice(0, SUBJECT_QUESTION_MAX).trimEnd()}…`
      : question;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(() =>
    sayWith(lang, CHAT_COPY.contactSubjectPrefill, "q", shortQuestion),
  );
  const [body, setBody] = useState(() =>
    sayWith(lang, CHAT_COPY.contactBodyPrefill, "q", question),
  );
  const [website, setWebsite] = useState("");

  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<"failed" | "rejected" | null>(null);
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => {
    const out: Partial<Record<FieldKey, string>> = {};
    const req = say(lang, CHAT_COPY.required);
    if (!name.trim()) out.name = req;
    if (!email.trim()) out.email = req;
    else if (!EMAIL_RE.test(email.trim()))
      out.email = say(lang, CHAT_COPY.emailInvalid);
    if (!subject.trim()) out.subject = req;
    if (!body.trim()) out.body = req;
    return out;
  }, [lang, name, email, subject, body]);

  const showError = (key: FieldKey) =>
    (touched[key] || attempted) && errors[key] ? errors[key] : undefined;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Synchronous latch: a second click in the same tick cannot get through,
      // even before `sending` has re-rendered the button as disabled.
      if (inFlightRef.current || sent) return;
      setAttempted(true);
      if (Object.keys(errors).length > 0) return;

      inFlightRef.current = true;
      setSending(true);
      setFailure(null);

      const outcome = await submitContact({
        submissionId: submissionIdRef.current,
        uiLang: lang,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        body: body.trim(),
        question,
        // Matches the field name the project's other forms use.
        website,
      });

      inFlightRef.current = false;
      setSending(false);
      if (outcome.ok) setSent(true);
      else setFailure(outcome.reason);
    },
    [errors, sent, lang, name, email, subject, body, question, website],
  );

  const copyDraft = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be denied; the text stays selectable either way.
    }
  }, [subject, body]);

  const field = (
    key: FieldKey,
    label: string,
    node: React.ReactNode,
  ) => {
    const err = showError(key);
    return (
      <div className="tb-cf-field">
        <label className="tb-cf-label" htmlFor={`tb-cf-${key}`}>
          {label}
        </label>
        {node}
        {err ? (
          <span className="tb-cf-err" id={`tb-cf-err-${key}`} role="alert">
            {err}
          </span>
        ) : null}
      </div>
    );
  };

  const inputProps = (key: FieldKey) => ({
    id: `tb-cf-${key}`,
    className: `tb-cf-input${showError(key) ? " tb-cf-input-err" : ""}`,
    onBlur: () => setTouched((p) => ({ ...p, [key]: true })),
    "aria-invalid": Boolean(showError(key)),
    "aria-describedby": showError(key) ? `tb-cf-err-${key}` : undefined,
  });

  return (
    <section className="tb-cf" aria-label={say(lang, CHAT_COPY.contactTitle)}>
      <h3 className="tb-cf-title">{say(lang, CHAT_COPY.contactTitle)}</h3>

      {sent ? (
        <>
          <p className="tb-cf-sent" role="status">
            {say(lang, CHAT_COPY.contactSent)}
          </p>
          <div className="tb-cf-actions">
            <button type="button" className="tb-cf-ghost" onClick={onCancel}>
              {say(lang, CHAT_COPY.close)}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="tb-cf-intro">
            {emailAutomation
              ? say(lang, CHAT_COPY.contactIntro)
              : say(lang, CHAT_COPY.contactManual)}
          </p>

          <p className="tb-cf-to">
            <span className="label-tag tb-cf-to-label">
              {say(lang, CHAT_COPY.contactRecipient)}
            </span>
            <a className="tb-cf-mail" href={mailtoHref(recipient)}>
              {recipient}
            </a>
          </p>

          {/* The name and reply address only matter when we send on the
              visitor's behalf; in manual mode their own client supplies them. */}
          {emailAutomation && (
            <>
              {field(
                "name",
                say(lang, CHAT_COPY.contactName),
                <input
                  {...inputProps("name")}
                  type="text"
                  value={name}
                  autoComplete="name"
                  placeholder={say(lang, CHAT_COPY.contactNamePh)}
                  onChange={(e) => setName(e.target.value)}
                />,
              )}
              {field(
                "email",
                say(lang, CHAT_COPY.contactEmail),
                <input
                  {...inputProps("email")}
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder={say(lang, CHAT_COPY.contactEmailPh)}
                  onChange={(e) => setEmail(e.target.value)}
                />,
              )}
            </>
          )}

          {field(
            "subject",
            say(lang, CHAT_COPY.contactSubject),
            <input
              {...inputProps("subject")}
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />,
          )}

          {field(
            "body",
            say(lang, CHAT_COPY.contactBody),
            <textarea
              {...inputProps("body")}
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />,
          )}

          <HoneypotField
            value={website}
            onChange={setWebsite}
            fieldId="tb-chat-website"
          />

          {failure ? (
            <p className="tb-cf-fail" role="alert">
              {say(
                lang,
                failure === "rejected"
                  ? CHAT_COPY.contactRejected
                  : CHAT_COPY.contactFailed,
              )}
            </p>
          ) : null}

          <div className="tb-cf-actions">
            {emailAutomation ? (
              <button
                type="submit"
                className="btn btn-caramel tb-cf-submit"
                disabled={sending}
              >
                {say(
                  lang,
                  sending ? CHAT_COPY.contactSending : CHAT_COPY.contactSend,
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-caramel tb-cf-submit"
                  onClick={copyDraft}
                >
                  {say(
                    lang,
                    copied ? CHAT_COPY.contactCopied : CHAT_COPY.contactCopy,
                  )}
                </button>
                <a
                  className="tb-cf-ghost"
                  href={mailtoHref(recipient, { subject, body })}
                >
                  {say(lang, CHAT_COPY.contactOpenMail)}
                </a>
              </>
            )}
            <button
              type="button"
              className="tb-cf-ghost"
              onClick={onCancel}
              disabled={sending}
            >
              {say(lang, CHAT_COPY.contactCancel)}
            </button>
          </div>
        </form>
      )}

      <style>{`
        .tb-cf {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          box-shadow: inset 0 4px 0 var(--caramel), var(--shadow);
          padding: 18px 15px 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tb-cf form { display: flex; flex-direction: column; gap: 10px; }
        .tb-cf-title {
          font-family: var(--font-head);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--plum);
          line-height: 1.25;
        }
        .tb-cf-intro, .tb-cf-sent {
          font-size: 0.83rem;
          line-height: 1.55;
          color: var(--text-mid);
        }
        .tb-cf-sent {
          background: oklch(93% 0.04 150);
          color: oklch(34% 0.1 150);
          border-radius: var(--r-sm);
          padding: 11px 13px;
        }
        .tb-cf-to {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
          background: var(--surface2);
          border-radius: var(--r-sm);
          padding: 8px 11px;
        }
        .tb-cf-to-label { font-size: 0.62rem; letter-spacing: 0.1em; }
        .tb-cf-mail {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--plum);
          text-decoration: none;
          overflow-wrap: anywhere;
        }
        .tb-cf-mail:hover { color: var(--caramel); }
        .tb-cf-mail:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }

        .tb-cf-field { display: flex; flex-direction: column; gap: 4px; }
        .tb-cf-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-mid);
        }
        .tb-cf-input {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: var(--r-sm);
          background: #fff;
          padding: 9px 12px;
          font-family: var(--font-body);
          /* 16px stops iOS Safari zooming the sheet when a field takes focus. */
          font-size: 16px;
          line-height: 1.5;
          color: var(--text);
          outline: none;
          resize: vertical;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .tb-cf-input:focus {
          border-color: var(--caramel);
          box-shadow: 0 0 0 3px oklch(66% 0.16 52 / 0.16);
        }
        .tb-cf-input-err { border-color: oklch(55% 0.18 20); }
        .tb-cf-err, .tb-cf-fail {
          font-size: 0.76rem;
          color: oklch(45% 0.18 20);
          line-height: 1.45;
        }

        .tb-cf-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }
        .tb-cf-submit { padding: 10px 20px; font-size: 0.85rem; }
        .tb-cf-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .tb-cf-ghost {
          border: none;
          background: none;
          color: var(--text-soft);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 8px;
        }
        .tb-cf-ghost:hover:not(:disabled) { color: var(--plum); }
        .tb-cf-ghost:focus-visible { outline: 3px solid var(--caramel); outline-offset: 2px; }
        .tb-cf-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (prefers-reduced-motion: reduce) {
          .tb-cf-input { transition: none; }
        }
      `}</style>
    </section>
  );
}
