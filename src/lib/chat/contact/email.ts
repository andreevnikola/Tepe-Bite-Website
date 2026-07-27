import "server-only";

import { SITE_INFO, SITE_URL } from "@/lib/config/site-info";
import type { Lang } from "@/store/lang";
import type { ContactCategory } from "../types";

/**
 * The email the assistant sends to a ТЕПЕ bite mailbox when it could not answer.
 *
 * Everything interpolated here came from a visitor's keyboard, so every value is
 * HTML-escaped before it reaches the template. The mail client that opens this
 * message must never execute markup a stranger typed into a chat box.
 */

/** Escape the characters that could break out of text or an attribute. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Preserve the visitor's paragraph breaks without allowing any other markup. */
function escMultiline(value: string): string {
  return esc(value).replace(/\r?\n/g, "<br />");
}

export type ChatContactEmailData = {
  lang: Lang;
  category: ContactCategory;
  name: string;
  email: string;
  subject: string;
  body: string;
  /** The question the assistant could not answer — context for the team. */
  question: string;
};

const LABELS = {
  bg: {
    heading: "Запитване през асистента на сайта",
    from: "От",
    email: "Имейл",
    question: "Въпрос към асистента",
    message: "Съобщение",
    footer:
      "Изпратено автоматично от асистента на tepebite.eu. Отговорете директно на посочения имейл.",
    routedOffice: "Насочено към общата поща",
    routedImpact: "Насочено към ТЕПЕ bite Impact",
  },
  en: {
    heading: "Enquiry via the website assistant",
    from: "From",
    email: "Email",
    question: "Question asked to the assistant",
    message: "Message",
    footer:
      "Sent automatically by the tepebite.eu assistant. Reply directly to the address above.",
    routedOffice: "Routed to the general mailbox",
    routedImpact: "Routed to ТЕПЕ bite Impact",
  },
} as const;

/**
 * Subject and HTML for the team-facing email. Returns the subject separately so
 * the caller can log it without re-parsing the body.
 */
export function buildChatContactEmail(data: ChatContactEmailData): {
  subject: string;
  html: string;
} {
  const t = LABELS[data.lang];
  const routed =
    data.category === "impact" ? t.routedImpact : t.routedOffice;

  // The prefix makes assistant traffic filterable in the shared mailbox without
  // relying on the sender address, which is always our own Resend identity.
  const subject = `[${SITE_INFO.brand.name}] ${data.subject}`.slice(0, 200);

  const questionBlock = data.question
    ? `<tr>
        <td style="padding:12px 0 4px;color:#6b7280;font-size:13px;">${esc(t.question)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;font-style:italic;color:#374151;">${escMultiline(data.question)}</td>
      </tr>`
    : "";

  const html = `<!doctype html>
<html lang="${data.lang}">
  <body style="margin:0;padding:24px;background:#f6f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;">
      <tr>
        <td style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;padding-bottom:6px;">${esc(routed)}</td>
      </tr>
      <tr>
        <td style="font-size:20px;font-weight:600;padding-bottom:16px;">${esc(t.heading)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:13px;">${esc(t.from)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;font-weight:600;">${esc(data.name)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:13px;">${esc(t.email)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;"><a href="mailto:${esc(data.email)}" style="color:#1f2937;">${esc(data.email)}</a></td>
      </tr>
      ${questionBlock}
      <tr>
        <td style="padding:12px 0 4px;color:#6b7280;font-size:13px;">${esc(t.message)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 20px;line-height:1.6;">${escMultiline(data.body)}</td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e5e7eb;padding-top:14px;color:#9ca3af;font-size:12px;line-height:1.5;">
          ${esc(t.footer)}<br />
          <a href="${esc(SITE_URL)}" style="color:#9ca3af;">${esc(SITE_URL)}</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}
