/**
 * Simple in-memory rate limiter. Keyed by IP, sliding window.
 * For production with multiple instances, swap for Upstash Redis.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetIn: windowMs };
  }

  if (bucket.count >= max) {
    return { ok: false, remaining: 0, resetIn: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count, resetIn: bucket.resetAt - now };
}

// Periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
  }, 60_000).unref?.();
}
