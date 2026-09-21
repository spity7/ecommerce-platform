import {
  parseProductMerchandising,
  resolveManualProductBadgeKinds,
  resolveProductCardBadges,
  resolveProductMetadataForWrite,
  type ProductMerchandising,
} from "@platform/shared";
import type { ProductDocument } from "../models/Product.js";
import { env } from "../config/env.js";

type ProductWritePayload = {
  metadata?: Record<string, unknown>;
  merchandising?: ProductMerchandising;
};

function siteMerchandisingSanitizeOptions() {
  const allowedManualKinds = resolveManualProductBadgeKinds(
    env.site.merchandising
  );
  const allowlist = env.site.merchandising?.manualBadgeKinds;
  return allowlist?.length
    ? { allowedManualKinds: allowedManualKinds }
    : undefined;
}

function metadataForBadgeResolve(doc: ProductDocument): Record<string, unknown> {
  const raw = (doc.metadata as Record<string, unknown>) ?? {};
  const merchandising = parseProductMerchandising(
    raw,
    siteMerchandisingSanitizeOptions()
  );
  return { ...raw, merchandising };
}

export function resolveMetadataForProductWrite(
  existing: Record<string, unknown> | undefined,
  payload: ProductWritePayload
): Record<string, unknown> | undefined {
  return resolveProductMetadataForWrite(
    existing,
    payload,
    siteMerchandisingSanitizeOptions()
  );
}

export function stripMerchandisingFromAssignPayload<
  T extends ProductWritePayload,
>(payload: T): Omit<T, "merchandising"> {
  const { merchandising: _merchandising, ...rest } = payload;
  return rest;
}

export function resolveBadgesForProductDocument(doc: ProductDocument) {
  return resolveProductCardBadges({
    price: doc.price,
    compareAtPrice: doc.compareAtPrice ?? null,
    stock: doc.stock,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : new Date(doc.createdAt ?? 0).toISOString(),
    metadata: metadataForBadgeResolve(doc),
    averageRating: doc.averageRating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    unitsSold: Math.max(0, doc.unitsSold ?? 0),
    reviewsEnabled: env.site.features.reviews,
    merchandisingConfig: env.site.merchandising,
  });
}

export function getMerchandisingFromDocument(doc: ProductDocument) {
  return parseProductMerchandising(
    (doc.metadata as Record<string, unknown>) ?? {},
    siteMerchandisingSanitizeOptions()
  );
}
