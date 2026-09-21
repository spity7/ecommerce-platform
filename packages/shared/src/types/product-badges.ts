export const PRODUCT_BADGE_KINDS = [
  "sale",
  "clearance",
  "limited_offer",
  "bundle",
  "free_gift",
  "new",
  "preorder",
  "coming_soon",
  "sold_out",
  "low_stock",
  "back_in_stock",
  "best_seller",
  "trending",
  "top_rated",
  "staff_pick",
  "exclusive",
  "hot",
  "cruelty_free",
  "vegan",
  "organic",
] as const;

export type ProductBadgeKind = (typeof PRODUCT_BADGE_KINDS)[number];

export type ProductBadgeSource = "auto" | "manual";

export type ProductBadgeRegistryEntry = {
  label: string;
  style: string;
  source: ProductBadgeSource;
};

export type MerchandisingDefaults = {
  newProductDays: number;
  lowStockThreshold: number;
  topRatedMinRating: number;
  topRatedMinReviews: number;
  maxImageBadges: number;
  bestSellerMinUnitsSold: number;
};

export const DEFAULT_MERCHANDISING: MerchandisingDefaults = {
  newProductDays: 30,
  lowStockThreshold: 5,
  topRatedMinRating: 4.5,
  topRatedMinReviews: 10,
  /** Hard cap in resolver is 2; keep at 2 unless theme adds multi-badge layout support. */
  maxImageBadges: 2,
  bestSellerMinUnitsSold: 5,
};

export type SiteMerchandisingConfig = Partial<MerchandisingDefaults> & {
  /** When set, only these manual badge kinds appear in admin and persist on products. */
  manualBadgeKinds?: ProductBadgeKind[];
};
