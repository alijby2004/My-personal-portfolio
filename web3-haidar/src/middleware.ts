import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This runs on the Edge runtime, which does NOT have access to Prisma /
// Node's `crypto`/DB drivers. So middleware only checks for the *presence*
// of a session cookie (cheap, fast, blocks the obvious case of "no cookie
// at all"). The actual session validity (exists in DB, not expired) is
// re-checked with a real DB query inside the admin layout server component,
// which does run in the Node runtime. This two-layer check means a forged
// or stale cookie still gets rejected — middleware is a fast first gate,
// not the sole line of defense.
const SESSION_COOKIE = "session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
