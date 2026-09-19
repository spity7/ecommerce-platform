import {
  manualProductBadgeSchema,
  type ManualProductBadge,
  type ProductMerchandising,
} from "../schemas/product-badge-fields.js";
import { PRODUCT_BADGE_KINDS, type ProductBadgeKind } from "../types/product-badges.js";
import { AUTO_ONLY_MANUAL_BADGE_KINDS } from "./registry.js";

const VALID_KINDS = new Set<string>(PRODUCT_BADGE_KINDS);

function isValidKind(value: unknown): value is ProductBadgeKind {
  return typeof value === "string" && VALID_KINDS.has(value);
}

/** Lenient normalize: drop invalid entries instead of failing entirely. */
export function sanitizeProductMerchandising(raw: unknown): ProductMerchandising {
  if (!raw || typeof raw !== "object") {
    return { manualBadges: [], suppressAutoBadges: undefined };
  }

  const record = raw as Record<string, unknown>;
  const seenManual = new Set<ProductBadgeKind>();
  const manualBadges: ManualProductBadge[] = [];

  if (Array.isArray(record.manualBadges)) {
    for (const item of record.manualBadges) {
      if (manualBadges.length >= 2) {
        break;
      }
      if (!item || typeof item !== "object") {
        continue;
      }
      const kind = (item as { kind?: unknown }).kind;
      if (!isValidKind(kind) || AUTO_ONLY_MANUAL_BADGE_KINDS.includes(kind)) {
        continue;
      }
      if (seenManual.has(kind)) {
        continue;
      }
      seenManual.add(kind);

      const parsed = manualProductBadgeSchema.safeParse(item);
      if (parsed.success) {
        manualBadges.push(parsed.data);
      } else {
        manualBadges.push({ kind });
      }
    }
  }

  const suppressSet = new Set<ProductBadgeKind>();
  if (Array.isArray(record.suppressAutoBadges)) {
    for (const kind of record.suppressAutoBadges) {
      if (isValidKind(kind)) {
        suppressSet.add(kind);
      }
    }
  }

  return {
    manualBadges,
    suppressAutoBadges:
      suppressSet.size > 0 ? [...suppressSet] : undefined,
  };
}

/** Partial PATCH of nested `metadata.merchandising` (omit keys to keep existing). */
export function mergeMerchandisingPatch(
  base: ProductMerchandising,
  patch: unknown
): ProductMerchandising {
  if (!patch || typeof patch !== "object") {
    return sanitizeProductMerchandising(base);
  }

  const record = patch as Record<string, unknown>;
  return sanitizeProductMerchandising({
    manualBadges:
      record.manualBadges !== undefined
        ? record.manualBadges
        : base.manualBadges,
    suppressAutoBadges:
      record.suppressAutoBadges !== undefined
        ? record.suppressAutoBadges
        : base.suppressAutoBadges,
  });
}
