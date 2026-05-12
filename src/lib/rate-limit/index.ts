/**
 * In-memory rate limiter.
 * Process-local: counts reset on cold start and do not sync across multiple instances.
 * Acceptable for initial launch. Replace by swapping in a RedisRateLimiter (same interface)
 * if multi-instance consistency becomes required.
 */

export interface RateLimiter {
  check(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }>
  reset(key: string): Promise<void>
}

type WindowEntry = {
  count: number
  windowStart: number
  windowSeconds: number
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly store = new Map<string, WindowEntry>()
  private lastCleanup = Date.now()
  private readonly cleanupIntervalMs: number

  constructor(cleanupIntervalMs = 60_000) {
    this.cleanupIntervalMs = cleanupIntervalMs
  }

  async check(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    this.maybeCleanup()

    const now = Date.now()
    const windowMs = windowSeconds * 1000
    const entry = this.store.get(key)

    if (!entry || now - entry.windowStart >= windowMs) {
      // Start a new window
      this.store.set(key, { count: 1, windowStart: now, windowSeconds })
      return { allowed: true, remaining: limit - 1, resetAt: new Date(now + windowMs) }
    }

    if (entry.count >= limit) {
      const resetAt = new Date(entry.windowStart + windowMs)
      return { allowed: false, remaining: 0, resetAt }
    }

    entry.count += 1
    const resetAt = new Date(entry.windowStart + windowMs)
    return { allowed: true, remaining: limit - entry.count, resetAt }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key)
  }

  private maybeCleanup(): void {
    const now = Date.now()
    if (now - this.lastCleanup < this.cleanupIntervalMs) return
    this.lastCleanup = now
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.windowStart >= entry.windowSeconds * 1000) {
        this.store.delete(key)
      }
    }
  }
}

/** Shared process-local instance. Import this in route handlers. */
export const rateLimiter: RateLimiter = new InMemoryRateLimiter()
