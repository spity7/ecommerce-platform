export type SiteBranding = {
  logo: string;
  logoDark?: string;
  favicon?: string;
  signInBanner?: string;
  signInBannerMobile?: string;
};

export type HomeLayoutId =
  | "cosmetic-beauty-two"
  | "cosmetic-beauty-three"
  | "cosmetic-beauty-four"
  | "sport"
  | "general";

import type { SiteMerchandisingConfig } from "./product-badges.js";

export type SiteFeatures = {
  attributes: boolean;
  brands: boolean;
  blog: boolean;
  coupons: boolean;
  giftRegistry: boolean;
  reviews: boolean;
  sizeGuide: boolean;
  subscriptions: boolean;
  wishlist: boolean;
  customerAuth: boolean;
};

export type SiteTheme = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

export type SiteHeaderAnnouncement = {
  text: string;
  href?: string;
};

export type SiteHeaderConfig = {
  announcements?: SiteHeaderAnnouncement[];
};

export type SiteConfig = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  adminUrl: string;
  apiUrl: string;
  theme: SiteTheme;
  homeLayout: HomeLayoutId;
  features: SiteFeatures;
  /** ISO 3166-1 alpha-2 default for customer phone inputs (e.g. "US"). */
  defaultPhoneCountry?: string;
  contact: {
    email: string;
    phone: string;
    /** Google Maps embed `src` URL for the contact page; omit to hide the map. */
    mapEmbedUrl?: string;
  };
  branding: SiteBranding;
  seo: {
    title: string;
    description: string;
  };
  merchandising?: SiteMerchandisingConfig;
  header?: SiteHeaderConfig;
};
