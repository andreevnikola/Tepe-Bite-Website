/**
 * Development evaluation harness for the ТЕПЕ bite site assistant.
 *
 *   node --env-file=.env.local scripts/chat-eval.mjs
 *   node --env-file=.env.local scripts/chat-eval.mjs --base https://tepebite.eu
 *   node --env-file=.env.local scripts/chat-eval.mjs --only R1-most-significant,R4-unsupported-retailer
 *   node --env-file=.env.local scripts/chat-eval.mjs --group funding --json report.json
 *
 * It drives the real `/api/chat/message` endpoint, so it exercises the whole
 * pipeline — planner, retrieval, grounded answer, card resolution and mailbox
 * classification — exactly as a visitor would.
 *
 * Against a development server the endpoint also returns a `debug` block with
 * the planner result, the queries issued and the retrieval stage; production
 * never emits it. To keep the retrieval half of the suite meaningful in
 * production, `--retrieval` additionally queries Cloudflare AI Search directly
 * (the index is a single shared instance, so it is the same corpus either way).
 *
 * Secrets are read from the environment and never printed.
 */

import { writeFileSync } from "node:fs";
import { CASES } from "./chat-eval-cases.mjs";

// ─── CLI ─────────────────────────────────────────────────────────────────────

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const has = (name) => process.argv.includes(`--${name}`);

const BASE = (arg("base", "http://localhost:3000") || "").replace(/\/$/, "");
const ONLY = arg("only");
const GROUP = arg("group");
const JSON_OUT = arg("json");
const WITH_RETRIEVAL = has("retrieval");
const REQUEST_TIMEOUT_MS = Number(arg("timeout", "45000"));
/**
 * Pause between cases. The suite is the only client that ever fires questions
 * back-to-back, and Groq's free tier is measured per minute — without pacing the
 * run throttles itself, the circuit breaker opens on the resulting 429 and every
 * later case fails for a reason that has nothing to do with the assistant.
 *
 * The binding limit is tokens, not requests: the free tier allows 8000 tokens
 * per minute, and one question costs the planner call plus an answer call
 * carrying the system prompt and the retrieved passages — commonly 5–6k tokens
 * together. 45s therefore keeps a run inside the budget with a little headroom.
 * Lower it only against a paid key.
 */
const DELAY_MS = Number(arg("delay", "45000"));
/** How many times one case may be re-asked after a throttle. */
const THROTTLE_RETRIES = Number(arg("retries", "2"));

let cases = CASES;
if (ONLY) {
  const ids = new Set(ONLY.split(",").map((s) => s.trim()));
  cases = cases.filter((c) => ids.has(c.id));
}
if (GROUP) cases = cases.filter((c) => c.group === GROUP);
if (cases.length === 0) {
  console.error("No cases matched the filters.");
  process.exit(2);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

/** Script detection is enough to tell the two supported languages apart. */
function detectLanguage(text) {
  const cyr = (text.match(/[Ѐ-ӿ]/g) || []).length;
  const lat = (text.match(/[A-Za-z]/g) || []).length;
  if (cyr === 0 && lat === 0) return null;
  // The brand wordmark is "ТЕПЕ bite", so an English answer always carries some
  // Cyrillic. Require a clear majority rather than any occurrence.
  return cyr > lat ? "bg" : "en";
}

function truncate(s, n) {
  const one = String(s ?? "").replace(/\s+/g, " ").trim();
  return one.length > n ? `${one.slice(0, n - 1)}…` : one;
}

/**
 * The endpoint rate-limits per client IP (20 requests / 10 min), which is sized
 * for a human conversation, not for a suite that asks 28 questions in a row from
 * one machine. Without a distinct address per case the run would trip its own
 * defence and report failures that say nothing about the assistant.
 *
 * The addresses are private-range and synthetic — this only works against a
 * local dev server, which is where the suite runs; a production deployment sits
 * behind a proxy that overwrites the header.
 */
let clientSeq = 0;
function nextTestIp() {
  clientSeq += 1;
  return `10.99.${Math.floor(clientSeq / 250)}.${(clientSeq % 250) + 1}`;
}

async function postJson(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": nextTestIp() },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* non-JSON body is itself a finding */
    }
    return { httpStatus: res.status, json, text, wallMs: Date.now() - started };
  } catch (err) {
    return {
      httpStatus: 0,
      json: null,
      text: err?.name === "AbortError" ? "client timeout" : String(err?.message ?? err),
      wallMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Direct AI Search probe — the retrieval half of the suite, environment-free. */
async function probeRetrieval(query) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const instance = process.env.CLOUDFLARE_AI_SEARCH_INSTANCE;
  const token = process.env.CLOUDFLARE_AI_SEARCH_API_TOKEN;
  if (!accountId || !instance || !token) {
    return { error: "cloudflare env not configured", urls: [] };
  }
  const started = Date.now();
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai-search/instances/${instance}/search`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, rewrite_query: false, max_num_results: 10 }),
      },
    );
    const json = await res.json();
    const chunks = json?.result?.chunks ?? [];
    const urls = [];
    for (const c of chunks) {
      const url = c?.item?.key;
      if (url && !urls.includes(url)) urls.push(url);
    }
    return {
      urls: urls.slice(0, 6),
      chunkCount: chunks.length,
      topScore: chunks[0]?.score ?? null,
      latencyMs: Date.now() - started,
    };
  } catch (err) {
    // Never surface the URL (it carries the account id) or the headers.
    return { error: `probe failed: ${err?.name ?? "error"}`, urls: [] };
  }
}

// ─── Assertions ──────────────────────────────────────────────────────────────

function checkExpectations(expect, ctx) {
  const failures = [];
  if (!expect) return failures;

  const { answer, status, cards, language, contactCategory } = ctx;

  if (expect.statusIn && !expect.statusIn.includes(status)) {
    failures.push(`status "${status}" not in [${expect.statusIn.join(", ")}]`);
  }
  if (expect.language && language && language !== expect.language) {
    failures.push(`answer language "${language}" ≠ "${expect.language}"`);
  }
  for (const re of expect.answerMatches ?? []) {
    if (!re.test(answer)) failures.push(`answer does not match ${re}`);
  }
  for (const re of expect.answerNotMatches ?? []) {
    if (re.test(answer)) failures.push(`answer must not match ${re}`);
  }
  if (expect.minCards != null && cards.length < expect.minCards) {
    failures.push(`${cards.length} cards, expected ≥ ${expect.minCards}`);
  }
  for (const frag of expect.cardUrlIncludes ?? []) {
    if (!cards.some((c) => (c.url ?? "").includes(frag))) {
      failures.push(`no card URL contains "${frag}"`);
    }
  }
  for (const frag of expect.cardUrlNotIncludes ?? []) {
    if (cards.some((c) => (c.url ?? "").includes(frag))) {
      failures.push(`a card URL contains forbidden "${frag}"`);
    }
  }
  if (expect.distinctInitiatives != null) {
    const slugs = new Set(
      cards
        .map((c) => /\/initiatives\/(?!partners\/)([^/?#]+)/.exec(c.url ?? "")?.[1])
        .filter(Boolean),
    );
    if (slugs.size < expect.distinctInitiatives) {
      failures.push(
        `${slugs.size} distinct initiative pages, expected ≥ ${expect.distinctInitiatives}`,
      );
    }
  }
  if (expect.contactCategory && contactCategory !== expect.contactCategory) {
    failures.push(`contactCategory "${contactCategory}" ≠ "${expect.contactCategory}"`);
  }
  // `oneOf` passes when ANY alternative passes — used where two honest outcomes
  // are both acceptable (a real percentage, or an explicit lack of evidence).
  if (expect.oneOf) {
    const anyPassed = expect.oneOf.some(
      (alt) => checkExpectations(alt, ctx).length === 0,
    );
    if (!anyPassed) failures.push("none of the oneOf alternatives passed");
  }
  return failures;
}

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log(
  `${C.bold}Chat evaluation${C.reset} ${C.dim}base=${BASE} cases=${cases.length}${C.reset}\n`,
);

const results = [];
let passed = 0;
let failed = 0;
let criticalFailed = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Kinds that mean "the provider was busy", not "the assistant is wrong". */
const THROTTLE_KINDS = new Set([
  "rate_limited",
  "unavailable_temporary",
  "no_answer_but_sources",
]);

/**
 * Ask one question, waiting out a throttle rather than recording it as a
 * failure. The server tells us how long to wait; we add a small margin so the
 * retry never lands on the same second the window reopens.
 */
async function ask(testCase) {
  const body = {
    message: testCase.message,
    uiLang: testCase.uiLang,
    history: testCase.history ?? [],
  };

  let res = await postJson("/api/chat/message", body);
  for (let attempt = 0; attempt < THROTTLE_RETRIES; attempt += 1) {
    const payload = res.json ?? {};
    if (payload.ok === true || !THROTTLE_KINDS.has(payload.kind)) break;
    const waitMs = Math.max(2000, Number(payload.retryAfterSeconds ?? 0) * 1000 + 2000);
    console.log(
      `     ${C.dim}throttled (${payload.kind}) — retrying in ${Math.round(waitMs / 1000)}s${C.reset}`,
    );
    await sleep(waitMs);
    res = await postJson("/api/chat/message", body);
  }
  return res;
}

let caseIndex = 0;
for (const testCase of cases) {
  if (caseIndex > 0 && DELAY_MS > 0) await sleep(DELAY_MS);
  caseIndex += 1;

  const res = await ask(testCase);

  const payload = res.json ?? {};
  const ok = payload.ok === true;
  const answer = ok ? String(payload.answer ?? "") : "";
  const cards = (ok ? payload.cards : payload.cards) ?? [];
  const status = ok ? payload.status : `http_${res.httpStatus}:${payload.kind ?? "?"}`;
  const language = detectLanguage(answer);
  const timings = payload.timings ?? {};
  const debug = payload.debug ?? null;

  const failures = ok
    ? checkExpectations(testCase.expect, {
        answer,
        status,
        cards,
        language,
        contactCategory: payload.contactCategory,
      })
    : [`request failed (${res.httpStatus}) ${truncate(res.text, 140)}`];

  let retrieval = null;
  if (WITH_RETRIEVAL) {
    retrieval = await probeRetrieval(debug?.plan?.searchQuery ?? testCase.message);
  }

  const record = {
    id: testCase.id,
    group: testCase.group,
    critical: Boolean(testCase.critical),
    uiLang: testCase.uiLang,
    message: testCase.message,
    ok,
    status,
    answerLanguage: language,
    answer,
    cards: cards.map((c) => ({ id: c.id, url: c.url, title: c.title, role: c.role })),
    contactCategory: payload.contactCategory ?? null,
    degraded: payload.degraded ?? null,
    timings: { ...timings, wallMs: res.wallMs },
    plan: debug?.plan ?? null,
    queries: debug?.queries ?? null,
    retrievalStage: debug?.stage ?? null,
    plannerOrigin: debug?.plannerOrigin ?? null,
    directRetrieval: retrieval,
    failures,
  };
  results.push(record);

  const mark = failures.length === 0 ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
  if (failures.length === 0) passed += 1;
  else {
    failed += 1;
    if (testCase.critical) criticalFailed += 1;
  }

  const flag = testCase.critical ? `${C.yellow}★${C.reset}` : " ";
  console.log(
    `${mark} ${flag} ${C.bold}${testCase.id}${C.reset} ${C.dim}(${testCase.group}, ui=${testCase.uiLang}, ${res.wallMs}ms)${C.reset}`,
  );
  console.log(`     ${C.cyan}Q${C.reset} ${truncate(testCase.message, 110)}`);
  if (debug?.plan) {
    console.log(
      `     ${C.cyan}plan${C.reset} intent=${debug.plan.intent} profile=${debug.plan.retrievalProfile} lang=${debug.plan.language} origin=${debug.plannerOrigin}`,
    );
    console.log(`     ${C.cyan}query${C.reset} ${truncate(debug.plan.searchQuery, 110)}`);
    const filters = [
      debug.plan.pagetypes?.length ? `pagetype=${debug.plan.pagetypes.join("|")}` : null,
      debug.plan.topics?.length ? `topic=${debug.plan.topics.join("|")}` : null,
      debug.plan.statuses?.length ? `status=${debug.plan.statuses.join("|")}` : null,
    ].filter(Boolean);
    console.log(
      `     ${C.cyan}filters${C.reset} ${filters.length ? filters.join(" ") : "(none)"} → stage=${debug.stage}`,
    );
  }
  if (retrieval?.urls?.length) {
    console.log(`     ${C.cyan}top${C.reset} ${retrieval.urls.slice(0, 3).join("\n         ")}`);
  }
  console.log(`     ${C.cyan}A${C.reset} [${status}/${language ?? "?"}] ${truncate(answer, 180)}`);
  if (cards.length) {
    console.log(
      `     ${C.cyan}cards${C.reset} ${cards.map((c) => `${c.id}:${(c.url ?? "").replace("https://tepebite.eu", "")}`).join("  ")}`,
    );
  }
  if (timings.plannerMs != null) {
    console.log(
      `     ${C.dim}timings planner=${timings.plannerMs}ms retrieval=${timings.retrievalMs}ms answer=${timings.answerMs}ms total=${timings.totalMs}ms${C.reset}`,
    );
  }
  for (const f of failures) console.log(`     ${C.red}✗ ${f}${C.reset}`);
  console.log();
}

console.log(
  `${C.bold}${passed} passed, ${failed} failed${C.reset}` +
    (criticalFailed ? ` ${C.red}(${criticalFailed} critical)${C.reset}` : ""),
);

if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
  console.log(`${C.dim}report → ${JSON_OUT}${C.reset}`);
}

// A critical regression failing is what blocks a deploy; the rest is signal.
process.exit(criticalFailed > 0 ? 1 : 0);
