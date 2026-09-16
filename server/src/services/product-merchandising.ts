import {
  mergeMerchandisingIntoMetadata,
  parseProductMerchandising,
  resolveProductCardBadges,
  type ProductMerchandising,
} from "@platform/shared";
import type { ProductDocument } from "../models/Product.js";
import { env } from "../config/env.js";

type ProductWritePayload = {
  metadata?: Record<string, unknown>;
  merchandising?: ProductMerchandising;
};

export function resolveMetadataForProductWrite(
  existing: Record<string, unknown> | undefined,
  payload: ProductWritePayload
): Record<string, unknown> | undefined {
  if (payload.metadata === undefined && payload.merchandising === undefined) {
    return undefined;
  }

  let metadata = payload.metadata ?? existing ?? {};
  if (payload.merchandising !== undefined) {
    metadata = mergeMerchandisingIntoMetadata(metadata, payload.merchandising);
  }
  return metadata;
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
    metadata: (doc.metadata as Record<string, unknown>) ?? {},
    averageRating: doc.averageRating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    unitsSold: doc.unitsSold ?? 0,
    reviewsEnabled: env.site.features.reviews,
    merchandisingConfig: env.site.merchandising,
  });
}

export function getMerchandisingFromDocument(doc: ProductDocument) {
  return parseProductMerchandising(
    (doc.metadata as Record<string, unknown>) ?? {}
  );
}
