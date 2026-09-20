import "server-only";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { appendApiUsage, type ApiUsageRoute } from "@/lib/store/apiUsageLog";

// Cost control for the routes that call Claude. Defaults are generous for
// a demo (a real quote flow makes a handful of these calls per session);
// tune via env vars once you have a sense of real traffic.
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 20);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

/**
 * Call at the top of every route handler that calls Claude. Logs the
 * attempt either way, and returns a 429 response to return immediately if
 * this client has exceeded the limit — otherwise returns null and the
 * handler proceeds normally.
 *
 * Scope note: only applied at the public route boundary. The assistant
 * chat route's internal call to explainPremium() (for the "why this
 * price" text on a completed quote) isn't separately guarded — it's
 * already covered by the rate limit on the assistant-chat call it's part
 * of, and double-counting one user action as two Claude calls would
 * overstate usage.
 */
export async function guardClaudeCall(route: ApiUsageRoute, req: Request): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const result = checkRateLimit(`claude:${route}:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

  await appendApiUsage({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    route,
    rateLimited: !result.allowed,
  });

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests — please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) } },
    );
  }

  return null;
}
