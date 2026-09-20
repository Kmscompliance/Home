import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight password gate for the Stage 3 admin dashboard — a shared
// password via HTTP Basic Auth, not a real user/session auth system.
// Stage 4 replaces this with proper per-admin authentication (e.g.
// NextAuth) before any real user data goes near it.
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse("Admin dashboard is not configured (ADMIN_PASSWORD is not set).", {
      status: 503,
    });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    const suppliedPassword = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";
    if (suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
