import type { ReviewDto } from "@platform/shared";
import type { ReviewDocument } from "../models/Review.js";

function normalizeAuthorAvatarUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function toIsoString(value: Date | string | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

export function toReviewDto(
  doc: ReviewDocument,
  options?: { authorAvatarUrl?: string }
): ReviewDto {
  const authorAvatarUrl = normalizeAuthorAvatarUrl(options?.authorAvatarUrl);

  return {
    id: doc._id.toString(),
    productId: doc.productId.toString(),
    productName: doc.productName,
    productSlug: doc.productSlug,
    userId: doc.userId.toString(),
    authorName: doc.authorName,
    ...(authorAvatarUrl ? { authorAvatarUrl } : {}),
    rating: doc.rating,
    title: doc.title,
    body: doc.body,
    status: doc.status,
    verifiedPurchase: doc.verifiedPurchase,
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}
