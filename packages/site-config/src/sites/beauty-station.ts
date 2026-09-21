import type { SiteConfig } from "@platform/shared";

export const beautyStationConfig = {
  id: "beauty-station",
  name: "Beauty Station",
  tagline: "Cosmetics & Skincare",
  description: "Premium cosmetics and skincare for every routine.",
  url: "http://localhost:3000",
  adminUrl: "http://localhost:3001",
  apiUrl: "http://localhost:5000",
  theme: {
    primaryColor: "#c9a87c",
    secondaryColor: "#2c2c2c",
    fontFamily: "Inter, sans-serif",
  },
  homeLayout: "cosmetic-beauty-two",
  features: {
    attributes: true,
    brands: true,
    blog: false,
    coupons: true,
    giftRegistry: false,
    reviews: true,
    sizeGuide: false,
    subscriptions: false,
    wishlist: true,
    customerAuth: true,
  },
  /** Badge auto thresholds; resolver hard-caps image badges at 2. */
  merchandising: {
    newProductDays: 30,
    lowStockThreshold: 5,
    topRatedMinRating: 4.5,
    topRatedMinReviews: 10,
    maxImageBadges: 2,
    bestSellerMinUnitsSold: 5,
    manualBadgeKinds: [
      "limited_offer",
      "best_seller",
      "cruelty_free",
      "organic",
    ],
  },
  defaultPhoneCountry: "LB",
  contact: {
    email: "hello@beautystation.com",
    phone: "+961 81 712 851",
  },
  branding: {
    logo: "/assets/sites/beauty-station/logo.png",
    logoDark: "/assets/sites/beauty-station/logo-dark.png",
    favicon: "/assets/sites/beauty-station/favicon.png",
    signInBanner: "/assets/images/banner/signin-banner.webp",
    signInBannerMobile:
      "/assets/images/banner/signin-banner-small-devices.webp",
  },
  seo: {
    title: "Beauty Station | Cosmetics & Skincare",
    description:
      "Discover premium cosmetics and skincare products at Beauty Station.",
  },
} as const satisfies SiteConfig;
