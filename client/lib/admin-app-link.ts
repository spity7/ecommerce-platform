import { getStorefrontSiteConfig } from "@/lib/site";

export const STOREFRONT_ACCOUNT_PATHS = [
  // Keep `client/proxy.ts` config.matcher in sync when adding paths.
  "/account-info",
  "/account-notifications",
  "/my-order-history",
  "/my-wishlist",
  "/my-reviews",
  "/my-payment-methods",
] as const;

export const STOREFRONT_CHECKOUT_PATHS = ["/checkout"] as const;

/** Theme demo checkout URLs — guests may browse; block signed-in admins when `customerAuth`. */
export const STOREFRONT_DEMO_CHECKOUT_PATHS = [
  // Keep `client/proxy.ts` config.matcher demo checkout entries in sync.
  "/checkout-delivery-step-one",
  "/checkout-delivery-step-two",
  "/checkout-payment",
  "/checkout-shipping",
  "/checkout-thankyou-style-1",
  "/multi-step-checkout",
] as const;

function matchesPathPrefix(
  pathname: string,
  paths: readonly string[]
): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function isStorefrontAccountPath(pathname: string): boolean {
  return matchesPathPrefix(pathname, STOREFRONT_ACCOUNT_PATHS);
}

export function isStorefrontCheckoutPath(pathname: string): boolean {
  return matchesPathPrefix(pathname, STOREFRONT_CHECKOUT_PATHS);
}

export function isStorefrontDemoCheckoutPath(pathname: string): boolean {
  return matchesPathPrefix(pathname, STOREFRONT_DEMO_CHECKOUT_PATHS);
}

/** Production + demo checkout — used to keep admins out of any checkout UI. */
export function isStorefrontCheckoutFlowPath(pathname: string): boolean {
  return (
    isStorefrontCheckoutPath(pathname) || isStorefrontDemoCheckoutPath(pathname)
  );
}

export function isStorefrontAccountOrCheckoutPath(pathname: string): boolean {
  return (
    isStorefrontAccountPath(pathname) || isStorefrontCheckoutPath(pathname)
  );
}

/** Account + production `/checkout` — requires sign-in when `customerAuth`. */
export function isStorefrontCustomerProtectedPath(pathname: string): boolean {
  return isStorefrontAccountOrCheckoutPath(pathname);
}

export function getAdminAppBaseUrl(): string {
  const site = getStorefrontSiteConfig();
  return site.adminUrl?.replace(/\/$/, "") ?? "";
}

export function redirectAdminToAdminApp(): void {
  if (typeof window === "undefined") {
    return;
  }

  const base = getAdminAppBaseUrl();
  if (base) {
    window.location.assign(base);
    return;
  }

  window.location.assign("/");
}
