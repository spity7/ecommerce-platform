import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { fetchAdminUser } from "@/lib/validate-admin-session";

function redirectToSignIn(
  request: NextRequest,
  clearCookies = false
): NextResponse {
  const response = NextResponse.redirect(new URL("/signin", request.url));
  if (clearCookies) {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BFF auth routes must stay reachable without a session (login, refresh, logout).
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isSignIn = pathname === "/signin";

  if (!token) {
    if (isSignIn || refreshToken) {
      return NextResponse.next();
    }
    return redirectToSignIn(request);
  }

  const user = await fetchAdminUser(token);

  if (!user) {
    if (isSignIn) {
      const response = NextResponse.next();
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
    if (refreshToken) {
      return NextResponse.next();
    }
    return redirectToSignIn(request, true);
  }

  if (isSignIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
