import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { fetchCustomerUser } from "@/lib/validate-customer-session";
import { getStorefrontSiteConfig } from "@/lib/site";

const ACCOUNT_PATHS = [
  "/account-info",
  "/account-notifications",
  "/my-order-history",
  "/my-wishlist",
  "/my-reviews",
  "/my-payment-methods",
];

const CHECKOUT_PATHS = ["/checkout"];

const AUTH_PATHS = ["/signin", "/signup"];

function isAccountPath(pathname: string): boolean {
  return ACCOUNT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isCheckoutPath(pathname: string): boolean {
  return CHECKOUT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isProtectedPath(pathname: string): boolean {
  return isAccountPath(pathname) || isCheckoutPath(pathname);
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

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
  const site = getStorefrontSiteConfig();
  if (!site.features.customerAuth) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const onAuthPage = isAuthPath(pathname);
  const onProtectedPage = isProtectedPath(pathname);

  if (!onAuthPage && !onProtectedPage) {
    return NextResponse.next();
  }

  if (!token) {
    return onAuthPage ? NextResponse.next() : redirectToSignIn(request);
  }

  const user = await fetchCustomerUser(token);

  if (!user) {
    if (onAuthPage) {
      const response = NextResponse.next();
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
    return redirectToSignIn(request, true);
  }

  if (onAuthPage) {
    return NextResponse.redirect(new URL("/account-info", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/checkout",
    "/account-info",
    "/account-notifications",
    "/my-order-history",
    "/my-wishlist",
    "/my-reviews",
    "/my-payment-methods",
  ],
};
