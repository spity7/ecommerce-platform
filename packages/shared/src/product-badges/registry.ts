import type {
  ProductBadgeKind,
  ProductBadgeRegistryEntry,
} from "../types/product-badges.js";

export const PRODUCT_BADGE_REGISTRY: Record<
  ProductBadgeKind,
  ProductBadgeRegistryEntry
> = {
  sale: {
    label: "Sale",
    style: "rbt-product-badge-bg-secondary",
    source: "auto",
  },
  clearance: {
    label: "Clearance",
    style: "rbt-product-badge-bg-danger",
    source: "manual",
  },
  limited_offer: {
    label: "Limited time",
    style: "rbt-product-badge-bg-primary-gradient",
    source: "manual",
  },
  bundle: {
    label: "Bundle",
    style: "rbt-product-badge-bg-primary",
    source: "manual",
  },
  free_gift: {
    label: "Free gift",
    style: "rbt-product-badge-bg-green",
    source: "manual",
  },
  new: {
    label: "New",
    style: "rbt-product-badge-bg-green",
    source: "auto",
  },
  new_arrival: {
    label: "New arrival",
    style: "rbt-product-badge-bg-primary",
    source: "auto",
  },
  preorder: {
    label: "Pre-order",
    style: "rbt-product-badge-bg-primary",
    source: "manual",
  },
  coming_soon: {
    label: "Coming soon",
    style: "rbt-product-badge-bg-disabled",
    source: "manual",
  },
  sold_out: {
    label: "Sold out",
    style: "rbt-product-badge-bg-disabled",
    source: "auto",
  },
  low_stock: {
    label: "Low stock",
    style: "rbt-product-badge-bg-yellow",
    source: "auto",
  },
  back_in_stock: {
    label: "Back in stock",
    style: "rbt-product-badge-bg-green",
    source: "manual",
  },
  best_seller: {
    label: "Best seller",
    style: "rbt-product-badge-bg-secondary-gradient",
    source: "manual",
  },
  trending: {
    label: "Trending",
    style: "rbt-product-badge-bg-yellow",
    source: "manual",
  },
  top_rated: {
    label: "Top rated",
    style: "rbt-product-badge-bg-green",
    source: "auto",
  },
  staff_pick: {
    label: "Staff pick",
    style: "rbt-product-badge-bg-primary",
    source: "manual",
  },
  exclusive: {
    label: "Exclusive",
    style: "rbt-product-badge-bg-primary-gradient",
    source: "manual",
  },
  hot: {
    label: "Hot",
    style: "rbt-product-badge-bg-danger",
    source: "manual",
  },
  cruelty_free: {
    label: "Cruelty-free",
    style: "rbt-product-badge-bg-light-green",
    source: "manual",
  },
  vegan: {
    label: "Vegan",
    style: "rbt-product-badge-bg-green",
    source: "manual",
  },
  organic: {
    label: "Organic",
    style: "rbt-product-badge-bg-green",
    source: "manual",
  },
};

/** Manual kinds shown in admin picker (excludes auto-only kinds). */
export const MANUAL_PRODUCT_BADGE_KINDS = (
  Object.entries(PRODUCT_BADGE_REGISTRY) as [
    ProductBadgeKind,
    ProductBadgeRegistryEntry,
  ][]
)
  .filter(([, entry]) => entry.source === "manual")
  .map(([kind]) => kind);

export const AUTO_PRODUCT_BADGE_KINDS = (
  Object.entries(PRODUCT_BADGE_REGISTRY) as [
    ProductBadgeKind,
    ProductBadgeRegistryEntry,
  ][]
)
  .filter(([, entry]) => entry.source === "auto")
  .map(([kind]) => kind);
