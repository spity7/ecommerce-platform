import type { SiteConfig, SiteFeatures } from "@platform/shared";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { getStorefrontSiteConfig } from "@/lib/site";

export type StorefrontNavVariant = "demo" | "production";

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
