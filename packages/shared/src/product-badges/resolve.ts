import type { ProductCardBadgeDto } from "../schemas/product-badges.js";
import {
  DEFAULT_MERCHANDISING,
  type MerchandisingDefaults,
  type ProductBadgeKind,
  type SiteMerchandisingConfig,
} from "../types/product-badges.js";
import {
  isAutoBadgeSuppressed,
  normalizeBadgeStyle,
  parseProductMerchandising,
} from "./metadata.js";
import { PRODUCT_BADGE_REGISTRY } from "./registry.js";

export type ResolveProductCardBadgesInput = {
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
  averageRating?: number;
  reviewCount?: number;
  unitsSold?: number;
  /** When false, skip review-based auto badges (e.g. site without reviews). */
  reviewsEnabled?: boolean;
  merchandisingConfig?: SiteMerchandisingConfig;
  now?: Date;
};

function resolveMerchandisingConfig(
  config?: SiteMerchandisingConfig
): MerchandisingDefaults {
  return {
    ...DEFAULT_MERCHANDISING,
    ...config,
  };
}

function isOnSale(price: number, compareAtPrice?: number | null): boolean {
  if (
    compareAtPrice == null ||
    compareAtPrice <= price ||
    compareAtPrice <= 0
  ) {
    return false;
  }
  return true;
}

function isNewProduct(
  createdAt: string,
  newProductDays: number,
  now: Date
): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }
  const windowMs = newProductDays * 24 * 60 * 60 * 1000;
  return now.getTime() - created <= windowMs;
}

function toBadgeDto(kind: ProductBadgeKind): ProductCardBadgeDto {
  const entry = PRODUCT_BADGE_REGISTRY[kind];
  const bg = normalizeBadgeStyle(entry.style);
  return { kind, text: entry.label, bg };
}

function kindAlreadyUsed(
  badges: ProductCardBadgeDto[],
  kind: ProductBadgeKind
): boolean {
  return badges.some((badge) => badge.kind === kind);
}

function tryAddBadge(
  badges: ProductCardBadgeDto[],
  max: number,
  kind: ProductBadgeKind
): void {
  if (badges.length >= max || kindAlreadyUsed(badges, kind)) {
    return;
  }
  badges.push(toBadgeDto(kind));
}

export function resolveProductCardBadges(
  input: ResolveProductCardBadgesInput
): ProductCardBadgeDto[] {
  const config = resolveMerchandisingConfig(input.merchandisingConfig);
  /** Storefront UI supports at most two image badges regardless of site config. */
  const max = Math.max(1, Math.min(config.maxImageBadges, 2));
  const now = input.now ?? new Date();
  const merchandising = parseProductMerchandising(input.metadata);
  const badges: ProductCardBadgeDto[] = [];

  const suppressed = (kind: ProductBadgeKind) =>
    isAutoBadgeSuppressed(merchandising, kind);

  const soldOutActive = input.stock <= 0 && !suppressed("sold_out");

  if (soldOutActive) {
    tryAddBadge(badges, max, "sold_out");
    for (const manual of merchandising.manualBadges) {
      if (badges.length >= max) {
        break;
      }
      tryAddBadge(badges, max, manual.kind);
    }
    return badges.slice(0, max);
  }

  for (const manual of merchandising.manualBadges) {
    if (badges.length >= max) {
      break;
    }
    tryAddBadge(badges, max, manual.kind);
  }

  const autoCandidates = collectAutoProductBadgeCandidates(
    input,
    config,
    merchandising,
    now
  );

  for (const kind of autoCandidates) {
    if (badges.length >= max) {
      break;
    }
    tryAddBadge(badges, max, kind);
  }

  return badges.slice(0, max);
}

/** Ordered auto kinds that qualify for this product (before max-badge slot limits). */
export function collectAutoProductBadgeCandidates(
  input: ResolveProductCardBadgesInput,
  config: MerchandisingDefaults = resolveMerchandisingConfig(
    input.merchandisingConfig
  ),
  merchandising = parseProductMerchandising(input.metadata),
  now: Date = input.now ?? new Date()
): ProductBadgeKind[] {
  const suppressed = (kind: ProductBadgeKind) =>
    isAutoBadgeSuppressed(merchandising, kind);

  if (input.stock <= 0) {
    return [];
  }

  const autoCandidates: ProductBadgeKind[] = [];

  if (isOnSale(input.price, input.compareAtPrice) && !suppressed("sale")) {
    autoCandidates.push("sale");
  }

  if (
    !suppressed("new") &&
    isNewProduct(input.createdAt, config.newProductDays, now)
  ) {
    autoCandidates.push("new");
  }

  if (input.stock <= config.lowStockThreshold && !suppressed("low_stock")) {
    autoCandidates.push("low_stock");
  }

  const reviewCount = input.reviewCount ?? 0;
  const averageRating = input.averageRating ?? 0;
  if (
    input.reviewsEnabled !== false &&
    reviewCount >= config.topRatedMinReviews &&
    averageRating >= config.topRatedMinRating &&
    !suppressed("top_rated")
  ) {
    autoCandidates.push("top_rated");
  }

  const unitsSold = Math.max(0, input.unitsSold ?? 0);
  if (
    unitsSold >= config.bestSellerMinUnitsSold &&
    !suppressed("best_seller")
  ) {
    autoCandidates.push("best_seller");
  }

  return autoCandidates;
}

export function listEligibleAutoProductBadgeKinds(
  input: ResolveProductCardBadgesInput
): ProductBadgeKind[] {
  const config = resolveMerchandisingConfig(input.merchandisingConfig);
  const merchandising = parseProductMerchandising(input.metadata);
  const now = input.now ?? new Date();
  return collectAutoProductBadgeCandidates(input, config, merchandising, now);
}
