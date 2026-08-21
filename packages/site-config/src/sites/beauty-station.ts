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
  contact: {
    email: "hello@beautystation.com",
    phone: "+1 (555) 123-4567",
  },
  branding: {
    logo: "/assets/images/logo/logo.webp",
    logoDark: "/assets/images/logo/logo-blackbg.webp",
    favicon: "/assets/images/favicon.png",
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
