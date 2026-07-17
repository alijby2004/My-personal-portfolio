// ─────────────────────────────────────────────────────────────────────────
// Generic in-memory, per-instance rate limiter. See the note in
// auth/rate-limit.ts (which now wraps this) about why in-memory is an
// acceptable tradeoff for this app's scale, and how to swap in Redis
// (e.g. Upstash) later if the app grows past a single server instance.
// ─────────────────────────────────────────────────────────────────────────

type Attempt = { count: number; firstAttemptAt: number };

export function createRateLimiter(windowMs: number, maxAttempts: number) {
  const attempts = new Map<string, Attempt>();

  function check(identifier: string): { allowed: boolean; retryAfterMs?: number } {
    const now = Date.now();
    const entry = attempts.get(identifier);

    if (!entry || now - entry.firstAttemptAt > windowMs) {
      attempts.set(identifier, { count: 1, firstAttemptAt: now });
      return { allowed: true };
    }

    if (entry.count >= maxAttempts) {
      return { allowed: false, retryAfterMs: windowMs - (now - entry.firstAttemptAt) };
    }

    entry.count += 1;
    return { allowed: true };
  }

  function reset(identifier: string) {
    attempts.delete(identifier);
  }

  return { check, reset };
}
