import type { ReviewDto } from "@platform/shared";

export type ApiReviewRow = {
  id: string;
  product: string;
  productSlug: string;
  customer: string;
  rating: number;
  title: string;
  review: string;
  status: ReviewDto["status"];
};

export function mapReviewDtoToApiReviewRow(dto: ReviewDto): ApiReviewRow {
  return {
    id: dto.id,
    product: dto.productName,
    productSlug: dto.productSlug,
    customer: dto.authorName,
    rating: dto.rating,
    title: dto.title,
    review: dto.body,
    status: dto.status,
  };
}

/** One-line label for delete confirmation lists and titles. */
export function formatReviewDeleteLabel(row: ApiReviewRow): string {
  const stars = `${row.rating} star${row.rating === 1 ? "" : "s"}`;
  const excerptSource = row.title.trim() || row.review.trim();
  const excerpt =
    excerptSource.length > 72
      ? `${excerptSource.slice(0, 69).trimEnd()}…`
      : excerptSource;

  if (excerpt) {
    return `${row.customer} on ${row.product} (${stars}) — “${excerpt}”`;
  }

  return `${row.customer} on ${row.product} (${stars})`;
}
