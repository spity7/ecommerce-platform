import {
  productMerchandisingSchema,
  type ProductMerchandising,
} from "../schemas/product-badges.js";
import type { ProductBadgeKind } from "../types/product-badges.js";

const MERCHANDISING_KEY = "merchandising";

export function parseProductMerchandising(
  metadata: Record<string, unknown> | undefined | null
): ProductMerchandising {
  const raw = metadata?.[MERCHANDISING_KEY];
  const parsed = productMerchandisingSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }

  return { manualBadges: [], suppressAutoBadges: undefined };
}

export function normalizeBadgeStyle(style: string): string {
  if (style.startsWith("rbt-product-badge-")) {
    return style;
  }
  if (style.startsWith("bg-")) {
    return `rbt-product-badge-${style.slice(3)}`;
  }
  return style.startsWith("rbt-") ? style : `rbt-product-badge-bg-${style}`;
}

export function mergeMerchandisingIntoMetadata(
  metadata: Record<string, unknown> | undefined,
  merchandising: ProductMerchandising
): Record<string, unknown> {
  const next = { ...(metadata ?? {}) };
  next[MERCHANDISING_KEY] = merchandising;
  delete next.cardBadge;
  return next;
}

export function isAutoBadgeSuppressed(
  merchandising: ProductMerchandising,
  kind: ProductBadgeKind
): boolean {
  return merchandising.suppressAutoBadges?.includes(kind) ?? false;
}
