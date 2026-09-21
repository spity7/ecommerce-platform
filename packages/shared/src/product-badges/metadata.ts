import type { ProductMerchandising } from "../schemas/product-badge-fields.js";
import type { ProductBadgeKind } from "../types/product-badges.js";
import {
  mergeMerchandisingPatch,
  sanitizeProductMerchandising,
  type SanitizeMerchandisingOptions,
} from "./sanitize.js";

const MERCHANDISING_KEY = "merchandising";

export {
  mergeMerchandisingPatch,
  sanitizeProductMerchandising,
  type SanitizeMerchandisingOptions,
} from "./sanitize.js";

export function parseProductMerchandising(
  metadata: Record<string, unknown> | undefined | null,
  options?: SanitizeMerchandisingOptions
): ProductMerchandising {
  const raw = metadata?.[MERCHANDISING_KEY];
  return sanitizeProductMerchandising(raw, options);
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
  merchandising: ProductMerchandising,
  options?: SanitizeMerchandisingOptions
): Record<string, unknown> {
  const next = { ...(metadata ?? {}) };
  next[MERCHANDISING_KEY] = sanitizeProductMerchandising(merchandising, options);
  delete next.cardBadge;
  return next;
}

export function isAutoBadgeSuppressed(
  merchandising: ProductMerchandising,
  kind: ProductBadgeKind
): boolean {
  return merchandising.suppressAutoBadges?.includes(kind) ?? false;
}

export function resolveProductMetadataForWrite(
  existing: Record<string, unknown> | undefined,
  payload: {
    metadata?: Record<string, unknown>;
    merchandising?: ProductMerchandising;
  },
  options?: SanitizeMerchandisingOptions
): Record<string, unknown> | undefined {
  if (payload.metadata === undefined && payload.merchandising === undefined) {
    return undefined;
  }

  const existingMerchandising = parseProductMerchandising(existing, options);
  let metadata: Record<string, unknown>;

  if (payload.metadata !== undefined) {
    const { merchandising: merchandisingPatch, ...restMetadata } =
      payload.metadata;
    metadata = { ...(existing ?? {}), ...restMetadata };
    if (merchandisingPatch !== undefined) {
      metadata[MERCHANDISING_KEY] = mergeMerchandisingPatch(
        existingMerchandising,
        merchandisingPatch,
        options
      );
    }
  } else {
    metadata = { ...(existing ?? {}) };
  }

  if (payload.merchandising !== undefined) {
    metadata = mergeMerchandisingIntoMetadata(
      metadata,
      payload.merchandising,
      options
    );
  }

  if (metadata[MERCHANDISING_KEY] !== undefined) {
    metadata[MERCHANDISING_KEY] = sanitizeProductMerchandising(
      metadata[MERCHANDISING_KEY],
      options
    );
  }

  return metadata;
}
