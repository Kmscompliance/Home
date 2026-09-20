import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/adminAuth";

// Accepts a plain HTML form POST (see the logout button on /admin) as well
// as a fetch — either way, clears the session and sends the browser back
// to the login page.
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
