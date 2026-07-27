import { NextResponse, type NextRequest } from "next/server";

import { classifyContact, resolveRecipient } from "@/lib/chat/contact/classify";
import { buildChatContactEmail } from "@/lib/chat/contact/email";
import { recordFailure, recordSuccess } from "@/lib/chat/health/breaker";
import { ChatContactRequestSchema } from "@/lib/chat/schemas";
import { sendEmail } from "@/lib/email/client";
import { getMongoose } from "@/lib/mongo";
import { ChatContactSubmission } from "@/lib/mongo/models/ChatContactSubmission";
import { rateLimiter } from "@/lib/rate-limit";

/**
 * "Ask the team for me" — the escalation path when the assistant cannot answer.
 *
 * Two properties this route exists to guarantee:
 *
 * 1. **The recipient is chosen here.** The browser sends the conversation, not a
 *    mailbox. `classifyContact` picks the category and `resolveRecipient` is the
 *    only function that turns it into an address, so the endpoint can never be
 *    used to mail an arbitrary destination.
 * 2. **A retry cannot send twice.** The client generates `submissionId` once per
 *    draft and reuses it on every retry. We claim that id in MongoDB *before*
 *    calling Resend, so a request that timed out after delivery collides on the
 *    unique index and reports success instead of sending a second copy.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Same budget as the order form: enough for a genuine mistake, not for abuse. */
const RATE_LIMIT = 3;
const RATE_WINDOW_SECONDS = 3600;

const SUBMISSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type ContactResponse =
  | { ok: true; alreadySent?: true }
  | { ok: false; kind: "invalid" | "rate_limited" | "email_unavailable" };

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Mongo duplicate-key error, however the driver surfaces it. */
function isDuplicateKey(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

export async function POST(req: NextRequest): Promise<NextResponse<ContactResponse>> {
  const rl = await rateLimiter.check(
    `chat_contact:${getIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS,
  );
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, kind: "rate_limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, kind: "invalid" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills a field they cannot see. Answer 200 so
  // a bot cannot tell a rejection from a delivery and start probing.
  const honeypot = (raw as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = ChatContactRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, kind: "invalid" }, { status: 422 });
  }
  const data = parsed.data;

  // The visitor's own words decide the mailbox, not anything the browser claims.
  const category = classifyContact({
    question: `${data.question} ${data.subject} ${data.body}`,
  });
  const recipient = resolveRecipient(category);

  // Claim the submission id before sending.
  try {
    await getMongoose();
    await ChatContactSubmission.create({
      submissionId: data.submissionId,
      category,
      recipient,
      lang: data.uiLang,
      name: data.name,
      email: data.email,
      subject: data.subject,
      status: "pending",
      expiresAt: new Date(Date.now() + SUBMISSION_TTL_MS),
    });
  } catch (err) {
    if (isDuplicateKey(err)) {
      const existing = await ChatContactSubmission.findOne({
        submissionId: data.submissionId,
      })
        .select("status")
        .lean();
      // `sent` and `pending` are both "already handled" — the second one is a
      // concurrent duplicate, which is exactly what this guard is for. Only a
      // previously failed attempt may be retried.
      if (existing && existing.status !== "failed") {
        return NextResponse.json({ ok: true, alreadySent: true });
      }
      await ChatContactSubmission.updateOne(
        { submissionId: data.submissionId },
        { $set: { status: "pending", category, recipient } },
      );
    } else {
      // Without the idempotency record we cannot promise a retry is safe, so we
      // decline rather than risk a duplicate email.
      console.error("[chat] contact submission claim failed");
      return NextResponse.json({ ok: false, kind: "email_unavailable" }, { status: 503 });
    }
  }

  const { subject, html } = buildChatContactEmail({
    lang: data.uiLang,
    category,
    name: data.name,
    email: data.email,
    subject: data.subject,
    body: data.body,
    question: data.question,
  });

  const sent = await sendEmail({ to: recipient, subject, html });

  if (!sent.ok) {
    await ChatContactSubmission.updateOne(
      { submissionId: data.submissionId },
      { $set: { status: "failed" } },
    ).catch(() => undefined);
    // Resend is not critical to the chat itself — this only disables automatic
    // submission, and the UI falls back to a copyable draft plus the address.
    await recordFailure("resend", "server");
    // The provider error text is deliberately not forwarded to the browser.
    console.error("[chat] contact email send failed");
    return NextResponse.json({ ok: false, kind: "email_unavailable" }, { status: 503 });
  }

  await ChatContactSubmission.updateOne(
    { submissionId: data.submissionId },
    { $set: { status: "sent", messageId: sent.messageId } },
  ).catch(() => undefined);
  await recordSuccess("resend");

  return NextResponse.json({ ok: true });
}
