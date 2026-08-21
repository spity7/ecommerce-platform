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
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;
  const isSignIn = pathname === "/signin";

  if (!token) {
    return isSignIn ? NextResponse.next() : redirectToSignIn(request);
  }

  const user = await fetchAdminUser(token);

  if (!user) {
    if (isSignIn) {
      const response = NextResponse.next();
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
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
