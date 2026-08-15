export type HomeLayoutId =
  | "cosmetic-beauty-two"
  | "cosmetic-beauty-three"
  | "cosmetic-beauty-four"
  | "sport"
  | "general";

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
};

export type SiteTheme = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
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
  contact: {
    email: string;
    phone: string;
  };
  seo: {
    title: string;
    description: string;
  };
};
