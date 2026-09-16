import { getStorefrontSiteConfig } from "@/lib/site";
import type { UserDto } from "@platform/shared";

const site = getStorefrontSiteConfig();

export function isServerReviewsEnabled(): boolean {
  return Boolean(site.features.customerAuth && site.features.reviews);
}

/** Storefront review forms and `/my-reviews` — API allows `customer` role only. */
export function canManageOwnReviews(user: UserDto | null | undefined): boolean {
  return isServerReviewsEnabled() && user?.role === "customer";
}

export function getAdminReviewsModerationUrl(): string {
  const base = site.adminUrl?.replace(/\/$/, "") ?? "";
  return base ? `${base}/product-reviews` : "/product-reviews";
}
