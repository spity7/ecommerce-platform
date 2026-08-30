import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes } from "@/config/routes";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { fetchSessionUser } from "@/lib/validate-admin-session";

const AUTH_PUBLIC_PATHS = [
  routes.signIn,
  routes.forgotPassword,
  routes.resetPassword,
];

function isAuthPublicPath(pathname: string): boolean {
  return AUTH_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function redirectToSignIn(
  request: NextRequest,
  clearCookies = false
): NextResponse {
  const response = NextResponse.redirect(new URL(routes.signIn, request.url));
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
  const onAuthPage = isAuthPublicPath(pathname);

  if (!token) {
    if (onAuthPage || refreshToken) {
      return NextResponse.next();
    }
    return redirectToSignIn(request);
  }

  const sessionUser = await fetchSessionUser(token);

  if (!sessionUser || sessionUser.role !== "admin") {
    if (sessionUser && sessionUser.role !== "admin") {
      if (onAuthPage) {
        return NextResponse.next();
      }
      return redirectToSignIn(request);
    }

    if (onAuthPage) {
      return NextResponse.next();
    }
    if (refreshToken) {
      return NextResponse.next();
    }
    return redirectToSignIn(request, true);
  }

  if (pathname === routes.signIn) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
