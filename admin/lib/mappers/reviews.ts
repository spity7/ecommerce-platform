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
