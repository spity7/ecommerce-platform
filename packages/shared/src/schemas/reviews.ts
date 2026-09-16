import { z } from "../zod.js";
import { REVIEW_STATUSES } from "../types/reviews.js";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(2000),
});

export const updateReviewSchema = createReviewSchema.partial();

export const reviewDtoSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productSlug: z.string(),
  userId: z.string(),
  authorName: z.string(),
  /** Populated from `User.avatarUrl` when serializing; not persisted on Review. */
  authorAvatarUrl: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string(),
  body: z.string(),
  status: z.enum(REVIEW_STATUSES),
  verifiedPurchase: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const paginatedReviewsSchema = z.object({
  data: z.array(reviewDtoSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

export const productReviewListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
});

export const adminReviewListQuerySchema = productReviewListQuerySchema.extend({
  status: z.enum(REVIEW_STATUSES).optional(),
  search: z.string().optional(),
});

export const adminReviewModerationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const productReviewSummarySchema = z.object({
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  ratingBreakdown: z.array(
    z.object({
      star: z.number().int().min(1).max(5),
      count: z.number().int().min(0),
    })
  ),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewDto = z.infer<typeof reviewDtoSchema>;
export type ProductReviewSummaryDto = z.infer<
  typeof productReviewSummarySchema
>;
export type ProductReviewListQuery = z.infer<
  typeof productReviewListQuerySchema
>;
export type AdminReviewListQuery = z.infer<typeof adminReviewListQuerySchema>;
