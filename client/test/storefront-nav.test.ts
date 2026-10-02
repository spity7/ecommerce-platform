import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SiteConfig } from "@platform/shared";
import {
  getStorefrontProductionNavItems,
  isStorefrontWishlistEnabled,
} from "../lib/storefront-nav.js";

const baseSite = {
  id: "test",
  name: "Test",
  tagline: "Tag",
  description: "Desc",
  url: "http://localhost:3000",
  adminUrl: "http://localhost:3001",
  apiUrl: "http://localhost:5000",
  theme: {
    primaryColor: "#000",
    secondaryColor: "#fff",
    fontFamily: "sans-serif",
  },
  homeLayout: "general",
  features: {
    attributes: true,
    brands: true,
    blog: false,
    coupons: false,
    giftRegistry: false,
    reviews: true,
    sizeGuide: false,
    subscriptions: false,
    wishlist: true,
    customerAuth: true,
  },
  contact: { email: "a@b.com", phone: "+1" },
  branding: { logo: "/logo.png" },
  seo: { title: "T", description: "D" },
} satisfies SiteConfig;

describe("storefront-nav", () => {
  it("returns core production links", () => {
    const hrefs = getStorefrontProductionNavItems(baseSite).map((i) => i.href);
    assert.ok(hrefs.includes("/"));
    assert.ok(hrefs.includes("/shop"));
    assert.ok(hrefs.includes("/categories"));
    assert.ok(hrefs.includes("/contact"));
  });

  it("omits blog link when feature is disabled", () => {
    const hrefs = getStorefrontProductionNavItems(baseSite).map((i) => i.href);
    assert.ok(!hrefs.includes("/blog-default"));
    const withBlog = getStorefrontProductionNavItems({
      ...baseSite,
      features: { ...baseSite.features, blog: true },
    }).map((i) => i.href);
    assert.ok(withBlog.includes("/blog-default"));
  });

  it("requires customerAuth and wishlist for wishlist chrome", () => {
    assert.equal(isStorefrontWishlistEnabled(baseSite), true);
    assert.equal(
      isStorefrontWishlistEnabled({
        ...baseSite,
        features: { ...baseSite.features, wishlist: false },
      }),
      false
    );
    assert.equal(
      isStorefrontWishlistEnabled({
        ...baseSite,
        features: { ...baseSite.features, customerAuth: false },
      }),
      false
    );
  });
});
