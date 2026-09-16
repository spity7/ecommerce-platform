import { normalizeAvatarUrl, type ReviewDto } from "@platform/shared";

export type StorefrontReview = {
  id: string;
  author: string;
  authorAvatarUrl?: string;
  rating: number;
  date: string;
  /** ISO datetime for accessible `<time>`; omitted for demo/static reviews. */
  createdAt?: string;
  title: string;
  desc: string;
  verifiedPurchase: boolean;
  status: ReviewDto["status"];
  productSlug: string;
  productName: string;
};

function formatReviewDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function mapReviewDtoToStorefront(dto: ReviewDto): StorefrontReview {
  return {
    id: dto.id,
    author: dto.authorName,
    authorAvatarUrl: normalizeAvatarUrl(dto.authorAvatarUrl),
    rating: dto.rating,
    date: formatReviewDate(dto.createdAt),
    createdAt: dto.createdAt,
    title: dto.title,
    desc: dto.body,
    verifiedPurchase: dto.verifiedPurchase,
    status: dto.status,
    productSlug: dto.productSlug,
    productName: dto.productName,
  };
}
