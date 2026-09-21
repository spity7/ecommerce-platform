import {
  DEFAULT_MERCHANDISING,
  type MerchandisingDefaults,
  type ProductBadgeKind,
  type SiteMerchandisingConfig,
} from "../types/product-badges.js";
import { SUPPRESSIBLE_AUTO_BADGE_KINDS } from "./registry.js";

export type AutoBadgeHintOptions = {
  config?: SiteMerchandisingConfig;
  /** When false, top_rated hints reflect that the rule cannot apply. */
  reviewsEnabled?: boolean;
};

function resolveMerchandisingDefaults(
  config?: SiteMerchandisingConfig
): MerchandisingDefaults {
  return {
    ...DEFAULT_MERCHANDISING,
    ...config,
  };
}

function formatRating(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function isSuppressibleAutoKind(
  kind: ProductBadgeKind
): kind is (typeof SUPPRESSIBLE_AUTO_BADGE_KINDS)[number] {
  return (
    SUPPRESSIBLE_AUTO_BADGE_KINDS as readonly ProductBadgeKind[]
  ).includes(kind);
}

/** Compact hint for admin UI (inline after badge label). */
export function getAutoProductBadgeRuleHintShort(
  kind: ProductBadgeKind,
  options?: AutoBadgeHintOptions
): string | undefined {
  if (!isSuppressibleAutoKind(kind)) {
    return undefined;
  }

  const m = resolveMerchandisingDefaults(options?.config);

  switch (kind) {
    case "sale":
      return "Compare-at > price";
    case "new":
      return `≤${m.newProductDays} days`;
    case "sold_out":
      return "Stock 0";
    case "low_stock":
      return `Stock ≤${m.lowStockThreshold}`;
    case "top_rated":
      if (options?.reviewsEnabled === false) {
        return "Reviews off on site";
      }
      return `${formatRating(m.topRatedMinRating)}+, ${m.topRatedMinReviews}+ reviews`;
    case "best_seller":
      return `≥${m.bestSellerMinUnitsSold} sold`;
    default:
      return undefined;
  }
}

/** Longer description for tooltips and accessibility. */
export function getAutoProductBadgeRuleHintLong(
  kind: ProductBadgeKind,
  options?: AutoBadgeHintOptions
): string | undefined {
  if (!isSuppressibleAutoKind(kind)) {
    return undefined;
  }

  const m = resolveMerchandisingDefaults(options?.config);
  const short = getAutoProductBadgeRuleHintShort(kind, options);

  switch (kind) {
    case "sale":
      return "Shows when compare-at price is set and higher than the selling price.";
    case "new":
      return `Shows for the first ${m.newProductDays} days after the product is created.`;
    case "sold_out":
      return "Shows when available stock is zero.";
    case "low_stock":
      return `Shows when stock is between 1 and ${m.lowStockThreshold} (inclusive).`;
    case "top_rated":
      if (options?.reviewsEnabled === false) {
        return "This site has reviews disabled, so the top rated rule does not run.";
      }
      return `Shows when average rating is at least ${formatRating(m.topRatedMinRating)} with ${m.topRatedMinReviews} or more reviews.`;
    case "best_seller":
      return `Shows when units sold is at least ${m.bestSellerMinUnitsSold}.`;
    default:
      return short;
  }
}
