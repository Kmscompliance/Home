import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";

// Session-based gate for the admin dashboard (src/lib/adminAuth.ts) — a
// real login page and a signed, expiring cookie, not the browser's native
// Basic Auth popup this replaced. Still a single shared admin account,
// not per-admin identity; see src/lib/adminAuth.ts for why NextAuth
// wasn't used here and what upgrading to it would look like.
export async function proxy(req: NextRequest) {
  // The login page (and its own API route) must stay reachable even when
  // there's no valid session yet — otherwise nobody could ever log in.
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
    return new NextResponse(
      "Admin dashboard is not configured (ADMIN_PASSWORD and AUTH_SECRET must both be set).",
      { status: 503 },
    );
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
