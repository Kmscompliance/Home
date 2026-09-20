import "server-only";

// A simple in-memory, fixed-window rate limiter. Good enough for a
// single-instance local demo or one long-running server — NOT durable or
// shared across instances, so on Vercel's serverless functions each cold
// start gets its own empty counters. That's the same limitation every
// other local store in this app has (see ARCHITECTURE.md); a real
// production deployment would need a shared store (e.g. Upstash Redis,
// Vercel KV) so limits hold across instances. Still genuinely useful here
// and locally: it stops one runaway loop or one bad actor from turning
// into an unbounded Claude API bill, which is exactly the risk worth
// closing off before any real API key is ever added.

type Bucket = { count: number; windowStartMs: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterMs: number;
};

/**
 * @param key Unique per limiter + identity, e.g. "claude:203.0.113.4"
 * @param limit Max requests allowed per window
 * @param windowMs Window length in ms
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStartMs >= windowMs) {
    buckets.set(key, { count: 1, windowStartMs: now });
    return { allowed: true, remaining: limit - 1, limit, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      retryAfterMs: windowMs - (now - existing.windowStartMs),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, limit, retryAfterMs: 0 };
}

/** Best-effort client IP from standard proxy headers — fine for a rough
 * per-client limit, not something to rely on for identity/security. */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Periodically forget old buckets so this doesn't grow forever in a
// long-running `next dev` / single-instance server.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_BUCKET_AGE_MS = 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStartMs > MAX_BUCKET_AGE_MS) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref?.();
