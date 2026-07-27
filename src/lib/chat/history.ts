import "server-only";
import type { ChatTurn } from "@/lib/chat/types";

/**
 * Conversation context, compressed.
 *
 * Replaying the transcript as real provider messages is the natural thing to do
 * and the single most expensive habit in the pipeline: every question would then
 * carry every earlier question AND every earlier answer, to both models, growing
 * without bound until the history cap cut it off. On a free daily allowance that
 * is the difference between a visitor asking three questions and asking ten.
 *
 * History earns its place for exactly one job — resolving what "it", "тя", "the
 * second one" refer to. That needs the last exchange in near-full and no more
 * than the *subjects* of what came before, so this module renders both into one
 * short block instead:
 *
 *   - the last turns verbatim (clamped), because a follow-up usually points at
 *     the immediately preceding exchange;
 *   - older turns reduced to the visitor's questions only, clamped hard. Our own
 *     earlier answers are the bulkiest part of a transcript and the least useful
 *     for reference resolution — what the visitor asked about is the subject; how
 *     we phrased the reply is not.
 *
 * The block is rendered as text inside the user message rather than as replayed
 * turns so it can carry an explicit "this is data" frame, which a bare sequence
 * of `role: "assistant"` messages cannot.
 */

export type HistoryBudget = {
  /** Trailing messages kept close to verbatim. */
  recentMessages: number;
  /** Character clamp applied to each of those. */
  recentChars: number;
  /** Older visitor questions summarised, newest of the old first. */
  olderQuestions: number;
  /** Character clamp applied to each older question. */
  olderQuestionChars: number;
};

/**
 * The planner only has to decide *what to search for*, so it needs the referent
 * and nothing else. The answer model has to sound like it remembers the
 * conversation, so it gets more of the last exchange — still a fraction of a
 * full replay.
 */
export const PLANNER_HISTORY_BUDGET: HistoryBudget = {
  recentMessages: 2,
  recentChars: 220,
  olderQuestions: 3,
  olderQuestionChars: 70,
};

export const ANSWER_HISTORY_BUDGET: HistoryBudget = {
  recentMessages: 2,
  recentChars: 400,
  olderQuestions: 3,
  olderQuestionChars: 70,
};

/**
 * Render the conversation so far, or `null` when there is nothing worth sending.
 * Callers put the result in their own framing; this function never emits
 * instructions of its own.
 */
export function buildHistoryContext(
  history: readonly ChatTurn[],
  budget: HistoryBudget,
): string | null {
  if (history.length === 0) return null;

  const split = Math.max(0, history.length - budget.recentMessages);
  const older = history.slice(0, split);
  const recent = history.slice(split);

  const lines: string[] = [];

  const earlierSubjects = older
    .filter((turn) => turn.role === "user")
    .slice(-budget.olderQuestions)
    .map((turn) => clamp(turn.content, budget.olderQuestionChars))
    .filter((text) => text.length > 0);

  if (earlierSubjects.length > 0) {
    lines.push(`earlier visitor questions: ${earlierSubjects.join(" | ")}`);
  }

  for (const turn of recent) {
    const text = clamp(turn.content, budget.recentChars);
    if (text) lines.push(`${turn.role === "user" ? "visitor" : "you"}: ${text}`);
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

function clamp(content: string, max: number): string {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}
