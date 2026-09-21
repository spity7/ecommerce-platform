import type { ProductBadgeKind } from "../types/product-badges.js";
import { normalizeBadgeStyle } from "./metadata.js";
import { PRODUCT_BADGE_REGISTRY } from "./registry.js";

/** Inline styles mirroring storefront `.rbt-product-badge-*` (_card.scss + theme vars). */
export type ProductBadgeChipAppearance = {
  background: string;
  color: string;
  border?: string;
};

const BADGE_CHIP_APPEARANCE: Record<string, ProductBadgeChipAppearance> = {
  "rbt-product-badge-bg-primary": {
    background: "#215ada",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-secondary": {
    background: "#ff4c1a",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-primary-gradient": {
    background: "linear-gradient(90deg, #215ada 2.66%, #001a53 100%)",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-secondary-gradient": {
    background: "linear-gradient(90deg, #fe3d06 0%, #f1a800 100%)",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-yellow": {
    background: "#fcc418",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-danger": {
    background: "#d12626",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-green": {
    background: "#24bd25",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-disabled": {
    background: "#c1c1c1",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-light-green": {
    background: "#e5fae5",
    color: "#157f16",
    border: "1px solid #24bd25",
  },
  "rbt-product-badge-bg-info": {
    background: "#215ada",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-warning": {
    background: "#fcc418",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-success": {
    background: "#24bd25",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-red": {
    background: "#d12626",
    color: "#ffffff",
  },
  "rbt-product-badge-bg-light-red": {
    background: "#fde8e8",
    color: "#d12626",
    border: "1px solid #d12626",
  },
};

const DEFAULT_CHIP: ProductBadgeChipAppearance =
  BADGE_CHIP_APPEARANCE["rbt-product-badge-bg-primary"]!;

export function getProductBadgeChipAppearance(
  bgClass: string
): ProductBadgeChipAppearance {
  const key = normalizeBadgeStyle(bgClass);
  return BADGE_CHIP_APPEARANCE[key] ?? DEFAULT_CHIP;
}

export function getProductBadgeChipAppearanceForKind(
  kind: ProductBadgeKind
): ProductBadgeChipAppearance {
  return getProductBadgeChipAppearance(PRODUCT_BADGE_REGISTRY[kind].style);
}
