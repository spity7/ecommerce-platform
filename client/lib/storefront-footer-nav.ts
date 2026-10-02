import type { SiteConfig } from "@platform/shared";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { getStorefrontSiteConfig } from "@/lib/site";

export type StorefrontFooterLink = {
  href: string;
  label: string;
};

export type StorefrontFooterWidget = {
  title: string;
  items: StorefrontFooterLink[];
};

export function getStorefrontFooterWidgets(
  site?: SiteConfig
): StorefrontFooterWidget[] {
  const config = site ?? getStorefrontSiteConfig();

  const shop: StorefrontFooterLink[] = [
    { href: "/shop", label: "Shop all" },
    { href: CATEGORIES_PAGE_PATH, label: "Categories" },
  ];

  const support: StorefrontFooterLink[] = [
    { href: "/contact", label: "Contact us" },
    { href: "/return-policy", label: "Returns & refunds" },
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/terms-policy", label: "Terms & conditions" },
  ];

  const account: StorefrontFooterLink[] = [];
  if (config.features.customerAuth) {
    account.push(
      { href: "/account-info", label: "My account" },
      { href: "/my-order-history", label: "Order history" },
      { href: "/signin", label: "Sign in" }
    );
    if (config.features.wishlist) {
      account.push({ href: "/my-wishlist", label: "Wishlist" });
    }
  }

  return [
    { title: "Shop", items: shop },
    { title: "Customer service", items: support },
    {
      title: account.length > 0 ? "Your account" : "Company",
      items:
        account.length > 0
          ? account
          : [{ href: "/contact", label: "Get in touch" }],
    },
  ];
}
