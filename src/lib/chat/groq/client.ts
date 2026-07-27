import "server-only";
import { GROQ_CHAT_COMPLETIONS_URL } from "@/lib/chat/config";
import {
  ProviderError,
  providerErrorFromResponse,
  providerErrorFromThrown,
} from "./errors";

/**
 * The single Groq entry point for the whole assistant.
 *
 * Deliberately prompt-agnostic: the planner and the answer generator differ
 * only in their messages, model, temperature and token budget, so there is one
 * transport with one timeout policy and one error classification instead of two
 * near-identical copies drifting apart.
 *
 * We call the OpenAI-compatible endpoint with `fetch` rather than an SDK — the
 * project has no `groq-sdk` dependency and one POST does not justify adding one.
 */

export type GroqRole = "system" | "user" | "assistant";

export type GroqMessage = {
  role: GroqRole;
  content: string;
};

export type GroqJsonCompletionOptions = {
  apiKey: string;
  model: string;
  messages: GroqMessage[];
  temperature: number;
  maxCompletionTokens: number;
  /** Passed through verbatim; Qwen accepts "none". */
  reasoningEffort: string;
  timeoutMs: number;
  /** Coarse label for failure logs ("planner" / "answer"). Never a prompt. */
  label: string;
};

/**
 * What the call actually cost, as the provider counted it — not as we estimated
 * it. On a free tier the daily token allowance is the binding constraint on how
 * many questions the assistant can answer, so every stage reports its real cost
 * and the route sums them; guessing from character counts is off by the ratio
 * between Cyrillic and Latin tokenisation, which is nearly 1.5×.
 */
export type GroqUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export const ZERO_USAGE: GroqUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};

export function addUsage(a: GroqUsage, b: GroqUsage): GroqUsage {
  return {
    promptTokens: a.promptTokens + b.promptTokens,
    completionTokens: a.completionTokens + b.completionTokens,
    totalTokens: a.totalTokens + b.totalTokens,
  };
}

export type GroqJsonCompletionResult<T> = {
  /**
   * The exact JSON text the model produced. Kept even when it parses, because
   * the corrective retry prompt quotes the model's own output back at it.
   */
  raw: string;
  latencyMs: number;
  /**
   * `JSON.parse(raw)` when it succeeds. UNVALIDATED — `T` is the caller's
   * expectation, not a guarantee; every caller runs a zod schema over it.
   * `undefined` means the model emitted something that is not JSON at all,
   * which the caller may treat as worth exactly one corrective retry.
   */
  data?: T;
  /** Short reason `data` is missing. Safe to log. */
  parseError?: string;
  /** Provider-reported cost of this one call. Zero if it did not report any. */
  usage: GroqUsage;
};

/** Only the fields we actually consume. Everything else is ignored. */
type GroqCompletionEnvelope = {
  choices?: Array<{
    message?: {
      content?: unknown;
      /**
       * Present on reasoning models. Chain-of-thought must never reach the
       * browser, a log or an error message, so it is deleted on arrival and
       * never read.
       */
      reasoning?: unknown;
    };
  }>;
  usage?: {
    prompt_tokens?: unknown;
    completion_tokens?: unknown;
    total_tokens?: unknown;
  };
};

function readUsage(envelope: GroqCompletionEnvelope): GroqUsage {
  const n = (value: unknown): number =>
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  const promptTokens = n(envelope.usage?.prompt_tokens);
  const completionTokens = n(envelope.usage?.completion_tokens);
  return {
    promptTokens,
    completionTokens,
    totalTokens: n(envelope.usage?.total_tokens) || promptTokens + completionTokens,
  };
}

export async function groqJsonCompletion<T = unknown>(
  opts: GroqJsonCompletionOptions,
): Promise<GroqJsonCompletionResult<T>> {
  const controller = new AbortController();
  // `AbortSignal.timeout()` would be terser, but we need our own flag to tell a
  // deadline abort apart from any other AbortError when classifying.
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, opts.timeoutMs);

  const startedAt = Date.now();

  try {
    let response: Response;
    try {
      response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${opts.apiKey}`,
        },
        body: JSON.stringify({
          model: opts.model,
          messages: opts.messages,
          temperature: opts.temperature,
          max_completion_tokens: opts.maxCompletionTokens,
          reasoning_effort: opts.reasoningEffort,
          // Structured output is the whole contract with both prompts: without
          // it the model wraps JSON in prose and every response fails zod.
          response_format: { type: "json_object" },
          stream: false,
        }),
        signal: controller.signal,
        // Next patches `fetch` with its own cache; a chat completion must never
        // be served from it.
        cache: "no-store",
      });
    } catch (err) {
      throw logged(providerErrorFromThrown(err, timedOut), opts, startedAt);
    }

    if (!response.ok) {
      // Read the body so the 429 classifier can see which bucket was exhausted.
      // It is used for classification only and is never carried into `message`.
      const bodyText = await response.text().catch(() => "");
      throw logged(providerErrorFromResponse(response, bodyText), opts, startedAt);
    }

    let envelope: GroqCompletionEnvelope;
    try {
      envelope = (await response.json()) as GroqCompletionEnvelope;
    } catch (err) {
      // The deadline can also fire while the body is still streaming, so route
      // aborts through the normal classifier instead of calling them malformed.
      const aborted = timedOut || (err instanceof Error && err.name === "AbortError");
      throw logged(
        aborted
          ? providerErrorFromThrown(err, timedOut)
          : new ProviderError("bad_response", "envelope is not json", { cause: err }),
        opts,
        startedAt,
      );
    }

    const message = envelope.choices?.[0]?.message;
    if (message && "reasoning" in message) {
      // Drop it at the boundary rather than relying on every downstream reader
      // to remember it exists.
      delete message.reasoning;
    }

    const content = typeof message?.content === "string" ? message.content : "";
    const latencyMs = Date.now() - startedAt;
    const usage = readUsage(envelope);

    if (!content.trim()) {
      throw logged(
        new ProviderError("bad_response", "empty completion"),
        opts,
        startedAt,
      );
    }

    try {
      return { raw: content, latencyMs, usage, data: JSON.parse(content) as T };
    } catch {
      // Not a provider failure: the transport worked and the model simply wrote
      // something unusable. The caller decides whether to spend a retry on it.
      return { raw: content, latencyMs, usage, parseError: "content is not valid json" };
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The only logging in this module. Model name, latency and the classified kind
 * are safe; the key, the Authorization header, the prompt and the provider body
 * are not, and none of them are reachable from here.
 */
function logged(
  error: ProviderError,
  opts: GroqJsonCompletionOptions,
  startedAt: number,
): ProviderError {
  console.warn(
    `[chat] groq ${opts.label} failed model=${opts.model} kind=${error.kind} latency=${
      Date.now() - startedAt
    }ms`,
  );
  return error;
}
