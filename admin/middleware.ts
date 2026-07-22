import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_KEY_COOKIE, cookieHasSession } from "@/lib/session";

const PUBLIC = ["/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    PUBLIC.some((p) => pathname === p || pathname.startsWith("/_next")) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(API_KEY_COOKIE)?.value;
  const envKey = process.env.DRPE_API_KEY;
  if (!cookieHasSession(session) && !envKey) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)"],
};
