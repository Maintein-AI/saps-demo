import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side access gate.
 *
 * Runs on every request (except the login page, the auth API, and build assets)
 * BEFORE any page is rendered or sent to the browser. If the visitor does not
 * have a valid auth cookie, they are redirected to /login and never receive any
 * of the protected page content.
 *
 * Configure credentials in production via environment variables
 * (Vercel → Project → Settings → Environment Variables):
 *   GATE_USERNAME, GATE_PASSWORD, GATE_SECRET
 */

const COOKIE_NAME = "saps_gate";

function expectedToken() {
  return process.env.GATE_SECRET || "saps-gate-default-secret-change-me";
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (token && token === expectedToken()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  const from = req.nextUrl.pathname + req.nextUrl.search;
  if (from && from !== "/" && !from.startsWith("/login")) {
    loginUrl.searchParams.set("from", from);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Gate everything EXCEPT: the login page, the auth API routes, and Next.js
    // build assets / favicon (which the login page itself needs to load).
    "/((?!login|api/gate|_next/static|_next/image|favicon.ico).*)",
  ],
};
