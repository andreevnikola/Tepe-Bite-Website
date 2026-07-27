/**
 * Public content RENDERING version — the sitemap's second `lastmod` input.
 *
 * The problem
 * -----------
 * `lastModified` in the sitemaps is driven by each record's Mongo `updatedAt`.
 * That correctly covers *data* edits: an admin changes an initiative, the
 * timestamp moves, the crawler re-fetches.
 *
 * It does not cover *code* changes. When we change how a content type is
 * rendered publicly — adding a key-facts section, exposing a figure that was
 * previously only implied, rewording a public label — the underlying records
 * are untouched, so every already-crawled URL keeps its old `lastmod` and is
 * never re-fetched. The retrieval index then serves the old HTML indefinitely.
 *
 * The fix
 * -------
 * A hand-maintained floor. `lastModified` becomes `max(record.updatedAt,
 * PUBLIC_CONTENT_SCHEMA_UPDATED_AT)`, so a rendering change invalidates the
 * whole content type exactly once, while records edited *after* the change keep
 * their own, newer timestamp.
 *
 * ⚠️ This MUST stay a hard-coded literal. Never `new Date()`, never
 * `process.env.BUILD_TIME`, never anything computed at request or build time: a
 * per-request value marks every page as freshly modified on every single
 * request, which destroys the crawler's change detection entirely and is
 * strictly worse than the stale-lastmod problem it was meant to solve.
 *
 * When to bump it
 * ---------------
 * Bump ONCE, by hand, in the commit that changes the public rendering of
 * initiative or partner pages. Do not bump for internal refactors, admin-only
 * changes, or anything a visitor/crawler cannot see in the HTML.
 *
 * Changelog:
 *  - 2026-07-27 — initiative pages gained the server-rendered "Ключови данни" /
 *    "Key facts" section: explicit invested / product-sales-funded / other-
 *    sources / accounted-expenses figures plus the derived product-sales
 *    funding sentence. Partner pages share the same public transparency
 *    rendering primitives, so they are floored together.
 */
export const PUBLIC_CONTENT_SCHEMA_UPDATED_AT = '2026-07-27T00:00:00.000Z'

/** Parsed once at module load. Guarded so a typo above cannot ship a bad date. */
const SCHEMA_TIME = (() => {
  const t = new Date(PUBLIC_CONTENT_SCHEMA_UPDATED_AT).getTime()
  return Number.isFinite(t) ? t : null
})()

/**
 * The later of a record's own `updatedAt` and the rendering-version floor.
 *
 * Behaviour by input:
 *  - valid `updatedAt` newer than the floor → that timestamp (record edited
 *    after the rendering change; its own edit is the real news).
 *  - valid `updatedAt` older than the floor → the floor.
 *  - missing / unparseable `updatedAt` → the floor, so the URL still carries a
 *    usable `lastmod` instead of an invalid one.
 *  - unparseable floor constant (should be impossible) → the record's own
 *    timestamp, or `undefined` if that is unusable too, which makes the sitemap
 *    omit `lastmod` for that URL rather than emit garbage.
 */
export function withContentSchemaFloor(
  updatedAt: Date | string | null | undefined,
): Date | undefined {
  const recordTime = updatedAt == null ? NaN : new Date(updatedAt).getTime()
  const hasRecord = Number.isFinite(recordTime)

  if (SCHEMA_TIME === null) return hasRecord ? new Date(recordTime) : undefined
  if (!hasRecord) return new Date(SCHEMA_TIME)
  return new Date(Math.max(recordTime, SCHEMA_TIME))
}
