import type { SiteConfig, SiteFeatures } from "@platform/shared";
import { AUTH_PUBLIC_PATHS } from "@/lib/auth-public-paths";
import { STOREFRONT_ACCOUNT_PATHS } from "@/lib/admin-app-link";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { getStorefrontSiteConfig } from "@/lib/site";

export type StorefrontNavVariant = "demo" | "production";

/** Category rows in header off-canvas + mobile “shop by category” (same fetch cap). */
export const STOREFRONT_HEADER_CATEGORY_PREVIEW_LIMIT = 50;

/**
 * Paths that use production header chrome and production mobile menu / category drawer.
 * Keep aligned with `app/(storefront)/`, `/`, and account layout routes in docs/ROUTES.md.
 */
const STOREFRONT_PRODUCTION_NAV_PATHS: readonly string[] = [
  "/",
  "/shop",
  CATEGORIES_PAGE_PATH,
  "/product",
  "/contact",
  "/checkout",
  "/checkout-thankyou",
  "/privacy-policy",
  "/terms-policy",
  "/return-policy",
  ...AUTH_PUBLIC_PATHS,
  ...STOREFRONT_ACCOUNT_PATHS,
];

function matchesProductionNavPath(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function resolveStorefrontNavVariant(
  pathname: string
): StorefrontNavVariant {
  const normalized = pathname.split("?")[0]?.split("#")[0] || "/";
  if (
    STOREFRONT_PRODUCTION_NAV_PATHS.some((path) =>
      matchesProductionNavPath(normalized, path)
    )
  ) {
    return "production";
  }
  return "demo";
}

export type StorefrontNavItem = {
  label: string;
  href: string;
  /** When set, item is shown only if this feature flag is true. */
  feature?: keyof SiteFeatures;
};

const PRODUCTION_NAV_ITEMS: StorefrontNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: CATEGORIES_PAGE_PATH },
  { label: "Blog", href: "/blog-default", feature: "blog" },
  { label: "Contact", href: "/contact" },
];

export function getStorefrontProductionNavItems(
  site?: SiteConfig
): StorefrontNavItem[] {
  const config = site ?? getStorefrontSiteConfig();
  const features = config.features;

  return PRODUCTION_NAV_ITEMS.filter((item) => {
    if (!item.feature) {
      return true;
    }
    return Boolean(features[item.feature]);
  });
}

export function isStorefrontWishlistEnabled(site?: SiteConfig): boolean {
  const config = site ?? getStorefrontSiteConfig();
  return Boolean(config.features.customerAuth && config.features.wishlist);
}

export function isStorefrontCustomerAuthEnabled(site?: SiteConfig): boolean {
  const config = site ?? getStorefrontSiteConfig();
  return Boolean(config.features.customerAuth);
}
