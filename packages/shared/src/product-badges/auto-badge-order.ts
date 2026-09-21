import type { ProductBadgeKind } from "../types/product-badges.js";

/**
 * Storefront auto badge priority (lower index = higher priority when filling max 2 slots).
 * Manual pins are applied first in `resolveProductCardBadges`.
 * When stock is 0 and sold out is not suppressed, only sold out is shown on the card.
 */
export const AUTO_PRODUCT_BADGE_PRIORITY_ORDER = [
  "sale",
  "low_stock",
  "sold_out",
  "top_rated",
  "best_seller",
  "new",
] as const satisfies readonly ProductBadgeKind[];

export type AutoProductBadgePriorityKind =
  (typeof AUTO_PRODUCT_BADGE_PRIORITY_ORDER)[number];
