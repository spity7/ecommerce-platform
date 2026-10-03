import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminAppBaseUrl,
  isStorefrontCheckoutFlowPath,
  isStorefrontCustomerProtectedPath,
} from "@/lib/admin-app-link";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { fetchCustomerUser } from "@/lib/validate-customer-session";
import { getStorefrontSiteConfig } from "@/lib/site";

const AUTH_PATHS = ["/signin", "/signup"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function redirectToSignIn(
  request: NextRequest,
  clearCookies = false
): NextResponse {
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const signInUrl = new URL("/signin", request.url);
  if (returnTo && returnTo !== "/signin" && returnTo !== "/signup") {
    signInUrl.searchParams.set("returnTo", returnTo);
  }
  const response = NextResponse.redirect(signInUrl);
  if (clearCookies) {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }
  return response;
}

function redirectAdminToAdminApp(
  request: NextRequest,
  adminUrl: string
): NextResponse {
  const base = adminUrl.replace(/\/$/, "");
  if (base) {
    return NextResponse.redirect(base);
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export async function proxy(request: NextRequest) {
  const site = getStorefrontSiteConfig();
  if (!site.features.customerAuth) {
    return NextResponse.next();
  }

  const adminUrl = getAdminAppBaseUrl() || site.adminUrl || "";
  const { pathname } = request.nextUrl;
  const onAuthPage = isAuthPath(pathname);
  const requiresSignIn = isStorefrontCustomerProtectedPath(pathname);
  const adminCheckoutBlocked = isStorefrontCheckoutFlowPath(pathname);

  if (!onAuthPage && !requiresSignIn && !adminCheckoutBlocked) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    if (onAuthPage) {
      return NextResponse.next();
    }
    if (requiresSignIn) {
      return redirectToSignIn(request);
    }
    return NextResponse.next();
  }

  const session = await fetchCustomerUser(token);

  if (session.status === "rate_limited") {
    return NextResponse.next();
  }

  if (session.status === "invalid") {
    if (onAuthPage) {
      const response = NextResponse.next();
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
    if (requiresSignIn) {
      return redirectToSignIn(request, true);
    }
    return NextResponse.next();
  }

  if (session.status === "ok" && session.user.role === "admin") {
    if (onAuthPage || requiresSignIn || adminCheckoutBlocked) {
      return redirectAdminToAdminApp(request, adminUrl);
    }
  }

  if (onAuthPage) {
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    if (
      returnTo &&
      returnTo.startsWith("/") &&
      !returnTo.startsWith("//") &&
      returnTo !== "/signin" &&
      returnTo !== "/signup"
    ) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
    return NextResponse.redirect(new URL("/account-info", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Keep in sync with path lists in lib/admin-app-link.ts
  matcher: [
    "/signin",
    "/signup",
    "/checkout",
    "/checkout-delivery-step-one",
    "/checkout-delivery-step-two",
    "/checkout-payment",
    "/checkout-shipping",
    "/checkout-thankyou-style-1",
    "/multi-step-checkout",
    "/account-info",
    "/account-notifications",
    "/my-order-history",
    "/my-wishlist",
    "/my-reviews",
    "/my-payment-methods",
  ],
};
