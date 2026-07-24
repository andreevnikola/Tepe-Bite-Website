export type CloudflareConfigResult = {
  valid: boolean
  issues: string[]
  accountId: string | null
  instance: string | null
  hasToken: boolean
}

/**
 * Presence check for the Cloudflare AI Search credentials used by the chatbot
 * retrieval layer (Phase 2). Non-throwing, mirroring the other validators, so
 * the app (and Phase 1) runs fine before these values are supplied — callers
 * decide how to react to `valid: false`. All three are server-only secrets and
 * must never be exposed via NEXT_PUBLIC_.
 */
export function validateCloudflareConfig(): CloudflareConfigResult {
  const issues: string[] = []

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? null
  const instance = process.env.CLOUDFLARE_AI_SEARCH_INSTANCE ?? null
  const hasToken = Boolean(process.env.CLOUDFLARE_AI_SEARCH_API_TOKEN)

  if (!accountId) issues.push('CLOUDFLARE_ACCOUNT_ID is missing')
  if (!instance) issues.push('CLOUDFLARE_AI_SEARCH_INSTANCE is missing')
  if (!hasToken) issues.push('CLOUDFLARE_AI_SEARCH_API_TOKEN is missing')

  return {
    valid: issues.length === 0,
    issues,
    accountId,
    instance,
    hasToken,
  }
}
