import "server-only";

import { getMongoose } from "@/lib/mongo";
import {
  ProviderHealth,
  type ChatProvider,
  type ProviderFailureKind,
  type ProviderHealthDoc,
} from "@/lib/mongo/models/ProviderHealth";

/**
 * Circuit breaker for the assistant's outbound providers.
 *
 * The point is to stop paying for a failure we already know about: once Groq or
 * Cloudflare has confirmably stopped working, every further visitor request
 * should fail in milliseconds from stored state instead of waiting out another
 * timeout. The state lives in Mongo (see `ProviderHealth`) so it is shared by
 * every serverless instance rather than re-learned per cold start.
 *
 * Three properties matter more than anything else here:
 *
 *  1. FAILING OPEN. If Mongo itself is unreachable the breaker degrades to
 *     process-local memory and the chat keeps serving. A datastore the chat does
 *     not otherwise need must never be able to take the chat down.
 *  2. ONE VISITOR CANNOT DISABLE THE CHATBOT. A malformed model reply
 *     (`bad_response`) is almost always one odd question, not an outage, so it
 *     is recorded and can never open the breaker. Transient network faults need
 *     a confirmed run of failures; only provider-confirmed conditions (auth,
 *     quota, rate limit) open on the first occurrence.
 *  3. NO READ-THEN-WRITE RACES. Every mutation is a single atomic
 *     `findOneAndUpdate`/`updateOne`; the open decision is made from the counter
 *     the increment itself returned, and the write that opens the breaker is
 *     guarded by that same counter.
 *
 * Nothing in this module logs or stores a key, a token, an account id or a
 * provider response body — only the classified `kind` enum and timestamps.
 */

export type { ChatProvider, ProviderFailureKind } from "@/lib/mongo/models/ProviderHealth";

/** `daily` is what unlocks "try again tomorrow" copy; `temporary` never does. */
export type BreakerScope = "temporary" | "daily";

/**
 * `half_open` is "the cooldown elapsed but nothing has proven the provider
 * healthy yet". It is not open (callers are not blocked outright) and not closed
 * (an expensive probe should be attempted by exactly one caller).
 */
export type BreakerPhase = "closed" | "open" | "half_open";

export type BreakerState = {
  open: boolean;
  scope: BreakerScope;
  openUntil: Date | null;
  phase: BreakerPhase;
};

// ─── Policy ──────────────────────────────────────────────────────────────────

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/** Transient faults must repeat before we believe them. */
const TRANSIENT_THRESHOLD = 3;
const TRANSIENT_COOLDOWN_MS = 60 * SECOND;

/**
 * An auth failure is a deploy problem, not a "come back tomorrow" problem: a
 * rotated or re-added key must recover within minutes, so the cooldown is short
 * and the scope stays `temporary` even though the condition is confirmed.
 */
const AUTH_COOLDOWN_MS = 5 * MINUTE;

/** Used when a 429 arrives without any usable `retry-after` information. */
const RATE_LIMIT_DEFAULT_MS = 30 * SECOND;
const RATE_LIMIT_MIN_MS = 5 * SECOND;
/** Clamp: a provider asking us to wait an hour for a burst limit is not credible. */
const RATE_LIMIT_MAX_MS = 5 * MINUTE;

/** A daily quota reset is never sooner than a minute or later than a day away. */
const QUOTA_MIN_MS = MINUTE;
const QUOTA_MAX_MS = 24 * HOUR;

/** How long one instance may hold the half-open recovery slot. */
const PROBE_LEASE_MS = 15 * SECOND;

/**
 * Memo over the Mongo read. Short enough that a breaker opened by another
 * instance is honoured almost immediately, long enough that a burst of visitor
 * requests reads the collection once instead of once per request.
 */
const MEMO_TTL_MS = 3 * SECOND;

type CooldownRule = "auth" | "utc_day_boundary" | "retry_after" | "transient" | "never";

type FailurePolicy = {
  /** Consecutive failures needed to open. `null` → this kind can never open it. */
  threshold: number | null;
  cooldown: CooldownRule;
  scope: BreakerScope;
};

const FAILURE_POLICY: Record<ProviderFailureKind, FailurePolicy> = {
  // Confirmed by the provider, non-transient: retrying cannot help, so open on
  // the very first occurrence.
  auth: { threshold: 1, cooldown: "auth", scope: "temporary" },
  quota_daily: { threshold: 1, cooldown: "utc_day_boundary", scope: "daily" },
  rate_limit: { threshold: 1, cooldown: "retry_after", scope: "temporary" },

  // Transient: one of these is normal internet weather. Only a run of them is
  // evidence of an outage.
  timeout: { threshold: TRANSIENT_THRESHOLD, cooldown: "transient", scope: "temporary" },
  server: { threshold: TRANSIENT_THRESHOLD, cooldown: "transient", scope: "temporary" },
  network: { threshold: TRANSIENT_THRESHOLD, cooldown: "transient", scope: "temporary" },

  // Recorded, never opens. A malformed reply is overwhelmingly ONE visitor's odd
  // question; letting it trip the breaker would let a single question disable
  // the chatbot for everyone. It does not even count towards the threshold, so
  // it cannot combine with real faults to open the circuit either.
  bad_response: { threshold: null, cooldown: "never", scope: "temporary" },

  // Same reasoning, and even more clearly a property of the one request rather
  // than of the provider: an oversized prompt says nothing about whether Groq is
  // up, and the next visitor's shorter question would have succeeded. Parking
  // the provider here would let one broad question black out the assistant.
  request_too_large: { threshold: null, cooldown: "never", scope: "temporary" },
};

// ─── Local fallback state (Mongo outage) ─────────────────────────────────────

/**
 * TRADE-OFF, deliberate: when Mongo is unreachable the breaker keeps working
 * from this module-level map instead of throwing. State then stops being shared
 * — an instance that has not seen the failure itself will still call the failing
 * provider, and a cold start begins with a clean slate. That is strictly better
 * than the alternatives: failing closed would take the whole chat down whenever
 * Mongo hiccups (a datastore the chat pipeline does not otherwise need), and
 * failing loud would surface a 500 to the visitor. We accept a weaker breaker
 * for the duration of a Mongo outage; we never accept a dead chat because of one.
 */
type LocalState = {
  consecutiveFailures: number;
  lastFailureKind: ProviderFailureKind | null;
  openUntilMs: number | null;
  probeInFlightUntilMs: number | null;
};

const localHealth = new Map<ChatProvider, LocalState>();

function readLocal(provider: ChatProvider): LocalState {
  return (
    localHealth.get(provider) ?? {
      consecutiveFailures: 0,
      lastFailureKind: null,
      openUntilMs: null,
      probeInFlightUntilMs: null,
    }
  );
}

// ─── Read memo ───────────────────────────────────────────────────────────────

type Memo = {
  state: BreakerState;
  /** True when the stored document needs no further success write. */
  clean: boolean;
  expiresAt: number;
};

const memo = new Map<ChatProvider, Memo>();

function readMemo(provider: ChatProvider, nowMs: number): Memo | null {
  const entry = memo.get(provider);
  if (!entry || entry.expiresAt <= nowMs) return null;
  return entry;
}

function writeMemo(
  provider: ChatProvider,
  state: BreakerState,
  clean: boolean,
  nowMs: number,
): void {
  // Never memoize past `openUntil`: the phase changes at that instant and a
  // stale "open" would delay recovery by up to the full memo window.
  const boundary = state.openUntil ? state.openUntil.getTime() : Number.POSITIVE_INFINITY;
  memo.set(provider, {
    state,
    clean,
    expiresAt: Math.min(nowMs + MEMO_TTL_MS, Math.max(boundary, nowMs + 1)),
  });
}

/** Drop the memo after a write that changed the document out from under it. */
function forgetMemo(provider: ChatProvider): void {
  memo.delete(provider);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Record a classified provider failure and return the resulting state.
 *
 * `retryAfterSeconds` is the provider's own answer (Groq's `retry-after`,
 * Cloudflare's throttling hints) and is trusted for `rate_limit` and
 * `quota_daily` only, clamped both ways so a bogus header cannot park the chat
 * for a week or hammer the provider a millisecond later.
 */
export async function recordFailure(
  provider: ChatProvider,
  kind: ProviderFailureKind,
  options: { retryAfterSeconds?: number } = {},
): Promise<BreakerState> {
  const policy = FAILURE_POLICY[kind];
  const now = new Date();
  const counts = policy.threshold !== null;

  try {
    await getMongoose();

    // Atomic increment-and-read: two instances failing in the same instant
    // produce 2, never 1 twice, so the threshold means what it says.
    const doc = await ProviderHealth.findOneAndUpdate(
      { _id: provider },
      {
        $inc: { consecutiveFailures: counts ? 1 : 0 },
        $set: {
          lastFailureKind: kind,
          lastFailureAt: now,
          // Whatever probe produced this failure is over; release the lease so
          // the next recovery attempt is not blocked waiting for it to lapse.
          probeInFlightUntil: null,
        },
      },
      { upsert: true, new: true },
    ).lean<ProviderHealthDoc | null>();

    const failures = doc?.consecutiveFailures ?? (counts ? 1 : 0);
    let openUntil = doc?.openUntil ? new Date(doc.openUntil) : null;

    if (policy.threshold !== null && failures >= policy.threshold) {
      openUntil = cooldownEnd(policy, options.retryAfterSeconds, now);
      // Guarded by the counter the increment returned: a `recordSuccess` landing
      // in between resets it to 0 and this write becomes a no-op, so a stale
      // decision can never re-open a breaker that has already recovered.
      await ProviderHealth.updateOne(
        { _id: provider, consecutiveFailures: { $gte: policy.threshold } },
        { $set: { openUntil } },
      );
    }

    localHealth.set(provider, {
      consecutiveFailures: failures,
      lastFailureKind: kind,
      openUntilMs: openUntil ? openUntil.getTime() : null,
      probeInFlightUntilMs: null,
    });

    const state = buildState(openUntil, kind, now.getTime());
    writeMemo(provider, state, false, now.getTime());
    return state;
  } catch {
    return recordFailureLocally(provider, kind, policy, options.retryAfterSeconds, now);
  }
}

/**
 * Record that the provider worked. Resets the counter and closes the breaker —
 * including a half-open one, which is how a recovery probe "wins".
 */
export async function recordSuccess(provider: ChatProvider): Promise<void> {
  const now = Date.now();

  // A healthy chat answers many messages a minute and each one would otherwise
  // cost a Mongo write that changes nothing. Skip it when this instance already
  // knows the document is clean; `lastSuccessAt` is diagnostic only, so a few
  // seconds of staleness costs nothing.
  const cached = readMemo(provider, now);
  if (cached?.clean) return;

  const state = buildState(null, null, now);

  try {
    await getMongoose();
    await ProviderHealth.updateOne(
      { _id: provider },
      {
        $set: {
          consecutiveFailures: 0,
          lastFailureKind: null,
          openUntil: null,
          probeInFlightUntil: null,
          lastSuccessAt: new Date(now),
        },
      },
      { upsert: true },
    );
  } catch {
    // Mongo is down. The provider still demonstrably works, so the local view
    // must record that regardless — see the fail-open trade-off above.
  }

  localHealth.set(provider, {
    consecutiveFailures: 0,
    lastFailureKind: null,
    openUntilMs: null,
    probeInFlightUntilMs: null,
  });
  writeMemo(provider, state, true, now);
}

/**
 * Current breaker state. Read-only and cheap (memoized for a few seconds) — safe
 * to call on the hot path of a chat message to decide whether a request is worth
 * attempting, and to explain *why* an already-open chat is degraded.
 */
export async function getBreakerState(provider: ChatProvider): Promise<BreakerState> {
  const now = Date.now();

  const cached = readMemo(provider, now);
  if (cached) return cached.state;

  try {
    await getMongoose();
    const doc = await ProviderHealth.findById(provider).lean<ProviderHealthDoc | null>();

    const openUntil = doc?.openUntil ? new Date(doc.openUntil) : null;
    const state = buildState(openUntil, doc?.lastFailureKind ?? null, now);

    // Mirror every successful read into the local fallback, so that if Mongo
    // disappears a moment later this instance still remembers the last known
    // truth instead of assuming everything is healthy.
    localHealth.set(provider, {
      consecutiveFailures: doc?.consecutiveFailures ?? 0,
      lastFailureKind: doc?.lastFailureKind ?? null,
      openUntilMs: openUntil ? openUntil.getTime() : null,
      probeInFlightUntilMs: doc?.probeInFlightUntil
        ? new Date(doc.probeInFlightUntil).getTime()
        : null,
    });

    const clean = (doc?.consecutiveFailures ?? 0) === 0 && openUntil === null;
    writeMemo(provider, state, clean, now);
    return state;
  } catch {
    // Never report "open" because of a Mongo failure: an unreachable breaker
    // store must not be able to hide the chat.
    const local = readLocal(provider);
    return buildState(
      local.openUntilMs ? new Date(local.openUntilMs) : null,
      local.lastFailureKind,
      now,
    );
  }
}

/**
 * Claim the single recovery slot for a half-open breaker.
 *
 * Returns true for exactly ONE caller across all instances: the conditional
 * update only matches a document whose cooldown has elapsed and whose lease is
 * free, so concurrent instances cannot all decide to probe the same dead
 * provider at once. The winner must follow up with `recordSuccess` (breaker
 * closes) or `recordFailure` (cooldown restarts from the new failure).
 */
export async function tryAcquireRecoveryProbe(provider: ChatProvider): Promise<boolean> {
  const now = new Date();
  const nowMs = now.getTime();
  const leaseUntil = new Date(nowMs + PROBE_LEASE_MS);

  try {
    await getMongoose();
    const claimed = await ProviderHealth.findOneAndUpdate(
      {
        _id: provider,
        // Half-open only: the cooldown has passed but no success has closed it.
        openUntil: { $ne: null, $lte: now },
        // A lease deadline rather than a flag, so a crashed prober frees the
        // slot by itself instead of wedging recovery forever.
        $or: [{ probeInFlightUntil: null }, { probeInFlightUntil: { $lte: now } }],
      },
      { $set: { probeInFlightUntil: leaseUntil } },
      { new: true },
    ).lean<ProviderHealthDoc | null>();

    if (claimed) forgetMemo(provider);
    return claimed !== null;
  } catch {
    return acquireLocalProbe(provider, nowMs, leaseUntil.getTime());
  }
}

// ─── Internals ───────────────────────────────────────────────────────────────

function buildState(
  openUntil: Date | null,
  lastFailureKind: ProviderFailureKind | null,
  nowMs: number,
): BreakerState {
  // Scope is derived rather than stored: `quota_daily` is the only condition
  // that survives to tomorrow, so one field cannot drift out of sync with it.
  const scope: BreakerScope = lastFailureKind === "quota_daily" ? "daily" : "temporary";

  if (!openUntil) return { open: false, scope: "temporary", openUntil: null, phase: "closed" };
  if (openUntil.getTime() > nowMs) return { open: true, scope, openUntil, phase: "open" };
  return { open: false, scope, openUntil, phase: "half_open" };
}

function cooldownEnd(
  policy: FailurePolicy,
  retryAfterSeconds: number | undefined,
  now: Date,
): Date {
  const nowMs = now.getTime();

  switch (policy.cooldown) {
    case "utc_day_boundary": {
      // The provider's own reset time wins when it supplied one; otherwise the
      // next UTC midnight, which is when per-day allowances roll over.
      if (retryAfterSeconds !== undefined) {
        return new Date(nowMs + clamp(retryAfterSeconds * SECOND, QUOTA_MIN_MS, QUOTA_MAX_MS));
      }
      const boundary = new Date(nowMs);
      boundary.setUTCHours(24, 0, 0, 0);
      return boundary;
    }
    case "retry_after": {
      const requested =
        retryAfterSeconds !== undefined ? retryAfterSeconds * SECOND : RATE_LIMIT_DEFAULT_MS;
      return new Date(nowMs + clamp(requested, RATE_LIMIT_MIN_MS, RATE_LIMIT_MAX_MS));
    }
    case "auth":
      return new Date(nowMs + AUTH_COOLDOWN_MS);
    case "transient":
      return new Date(nowMs + TRANSIENT_COOLDOWN_MS);
    case "never":
      // Unreachable: `never` always carries a null threshold. Kept total so a
      // future kind cannot fall through this switch unnoticed.
      return new Date(nowMs);
  }
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** The Mongo path's logic, applied to the process-local mirror. */
function recordFailureLocally(
  provider: ChatProvider,
  kind: ProviderFailureKind,
  policy: FailurePolicy,
  retryAfterSeconds: number | undefined,
  now: Date,
): BreakerState {
  const nowMs = now.getTime();
  const previous = readLocal(provider);
  const failures =
    policy.threshold === null ? previous.consecutiveFailures : previous.consecutiveFailures + 1;

  const openUntil =
    policy.threshold !== null && failures >= policy.threshold
      ? cooldownEnd(policy, retryAfterSeconds, now)
      : previous.openUntilMs
        ? new Date(previous.openUntilMs)
        : null;

  localHealth.set(provider, {
    consecutiveFailures: failures,
    lastFailureKind: kind,
    openUntilMs: openUntil ? openUntil.getTime() : null,
    probeInFlightUntilMs: null,
  });

  const state = buildState(openUntil, kind, nowMs);
  writeMemo(provider, state, false, nowMs);
  return state;
}

function acquireLocalProbe(
  provider: ChatProvider,
  nowMs: number,
  leaseUntilMs: number,
): boolean {
  const local = readLocal(provider);
  if (local.openUntilMs === null || local.openUntilMs > nowMs) return false;
  if (local.probeInFlightUntilMs !== null && local.probeInFlightUntilMs > nowMs) return false;

  localHealth.set(provider, { ...local, probeInFlightUntilMs: leaseUntilMs });
  forgetMemo(provider);
  return true;
}
