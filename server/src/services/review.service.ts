import type {
  AdminReviewListQuery,
  CreateReviewInput,
  ProductReviewListQuery,
  ProductReviewSummaryDto,
  ReviewStatus,
  UpdateReviewInput,
} from "@platform/shared";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { recomputeProductReviewAggregates } from "./product-review-aggregates.service.js";
import { toReviewDto } from "./review.serializers.js";
import type { ReviewDocument } from "../models/Review.js";

async function loadAvatarUrlByUserIds(
  userIds: string[]
): Promise<Map<string, string | undefined>> {
  const unique = [...new Set(userIds)];
  if (unique.length === 0) {
    return new Map();
  }

  const users = await User.find({ _id: { $in: unique } }).select("avatarUrl");
  return new Map(
    users.map((user) => [
      user._id.toString(),
      user.avatarUrl?.trim() || undefined,
    ])
  );
}

function toReviewDtos(
  docs: ReviewDocument[],
  avatarsByUserId: Map<string, string | undefined>
) {
  return docs.map((doc) =>
    toReviewDto(doc, {
      authorAvatarUrl: avatarsByUserId.get(doc.userId.toString()),
    })
  );
}

async function toReviewDtoWithUserAvatar(doc: ReviewDocument) {
  const avatarsByUserId = await loadAvatarUrlByUserIds([doc.userId.toString()]);
  return toReviewDto(doc, {
    authorAvatarUrl: avatarsByUserId.get(doc.userId.toString()),
  });
}

export function assertReviewsFeatureEnabled(): void {
  if (!env.site.features.reviews) {
    throw new AppError(403, "Reviews are not enabled for this site");
  }
}

async function assertPublishedProduct(productId: string) {
  const product = await Product.findById(productId);
  if (!product || product.status !== "published") {
    throw new AppError(404, "Product not found");
  }
  return product;
}

async function loadCustomerUser(userId: string) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt || user.isActive === false) {
    throw new AppError(401, "Authentication required");
  }
  if (user.role !== "customer") {
    throw new AppError(403, "Only customers can submit reviews");
  }
  if (!user.emailVerified) {
    throw new AppError(403, "Verify your email before submitting a review");
  }
  return user;
}

export async function computeVerifiedPurchase(
  userId: string,
  productId: string
): Promise<boolean> {
  const exists = await Order.exists({
    userId,
    status: { $ne: "cancelled" },
    "items.productId": new mongoose.Types.ObjectId(productId),
  });
  return Boolean(exists);
}

export async function refreshVerifiedPurchaseForUserProducts(
  userId: string,
  productIds: string[]
): Promise<void> {
  if (!env.site.features.reviews) {
    return;
  }

  const uniqueProductIds = [
    ...new Set(productIds.map((id) => id.trim()).filter(Boolean)),
  ];
  if (uniqueProductIds.length === 0) {
    return;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  await Promise.all(
    uniqueProductIds.map(async (productId) => {
      const verifiedPurchase = await computeVerifiedPurchase(userId, productId);
      await Review.updateMany(
        {
          userId: userObjectId,
          productId: new mongoose.Types.ObjectId(productId),
        },
        { $set: { verifiedPurchase } }
      );
    })
  );
}

type OrderVerificationSyncInput = {
  userId: { toString(): string };
  items: Array<{ productId: { toString(): string } }>;
};

export async function syncVerifiedPurchaseForOrder(
  order: OrderVerificationSyncInput
): Promise<void> {
  await refreshVerifiedPurchaseForUserProducts(
    order.userId.toString(),
    order.items.map((item) => item.productId.toString())
  );
}

export async function createOrUpdateReview(
  userId: string,
  productId: string,
  payload: CreateReviewInput
) {
  assertReviewsFeatureEnabled();
  const user = await loadCustomerUser(userId);
  const product = await assertPublishedProduct(productId);
  const verifiedPurchase = await computeVerifiedPurchase(userId, productId);

  const previous = await Review.findOne({ productId, userId });
  const wasApproved = previous?.status === "approved";

  const review = await Review.findOneAndUpdate(
    { productId, userId },
    {
      $set: {
        authorName: user.name,
        rating: payload.rating,
        title: payload.title,
        body: payload.body,
        status: "pending",
        verifiedPurchase,
        productName: product.name,
        productSlug: product.slug,
      },
    },
    { upsert: true, returnDocument: "after", runValidators: true }
  );

  if (wasApproved) {
    await recomputeProductReviewAggregates(productId);
  }

  return toReviewDto(review, {
    authorAvatarUrl: user.avatarUrl?.trim() || undefined,
  });
}

export async function listProductReviews(
  productId: string,
  query: ProductReviewListQuery
) {
  assertReviewsFeatureEnabled();
  await assertPublishedProduct(productId);

  const filter: Record<string, unknown> = {
    productId,
    status: "approved",
  };
  if (query.minRating !== undefined) {
    filter.rating = { $gte: query.minRating };
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Review.countDocuments(filter),
  ]);

  const avatarsByUserId = await loadAvatarUrlByUserIds(
    items.map((doc) => doc.userId.toString())
  );

  return {
    data: toReviewDtos(items, avatarsByUserId),
    total,
    page: query.page,
    limit: query.limit,
  };
}

export async function getReviewSummary(
  productId: string
): Promise<ProductReviewSummaryDto> {
  assertReviewsFeatureEnabled();
  await assertPublishedProduct(productId);

  const breakdown = await Review.aggregate<{ _id: number; count: number }>([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);

  const countByStar = new Map(breakdown.map((row) => [row._id, row.count]));
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: countByStar.get(star) ?? 0,
  }));

  const reviewCount = ratingBreakdown.reduce((sum, row) => sum + row.count, 0);
  const ratingSum = ratingBreakdown.reduce(
    (sum, row) => sum + row.star * row.count,
    0
  );
  const averageRating =
    reviewCount > 0 ? Math.round((ratingSum / reviewCount) * 100) / 100 : 0;

  return { averageRating, reviewCount, ratingBreakdown };
}

export async function listReviewsForUser(userId: string) {
  assertReviewsFeatureEnabled();
  await loadCustomerUser(userId);

  const items = await Review.find({ userId }).sort({ updatedAt: -1 });
  const avatarsByUserId = await loadAvatarUrlByUserIds([userId]);
  return {
    data: toReviewDtos(items, avatarsByUserId),
    total: items.length,
    page: 1,
    limit: items.length || 1,
  };
}

export async function updateOwnReview(
  userId: string,
  reviewId: string,
  payload: UpdateReviewInput
) {
  assertReviewsFeatureEnabled();
  const user = await loadCustomerUser(userId);

  const review = await Review.findById(reviewId);
  if (!review || review.userId.toString() !== userId) {
    throw new AppError(404, "Review not found");
  }

  const wasApproved = review.status === "approved";
  if (payload.rating !== undefined) {
    review.rating = payload.rating;
  }
  if (payload.title !== undefined) {
    review.title = payload.title;
  }
  if (payload.body !== undefined) {
    review.body = payload.body;
  }
  review.status = "pending";
  review.verifiedPurchase = await computeVerifiedPurchase(
    userId,
    review.productId.toString()
  );
  await review.save();

  if (wasApproved) {
    await recomputeProductReviewAggregates(review.productId.toString());
  }

  return toReviewDto(review, {
    authorAvatarUrl: user.avatarUrl?.trim() || undefined,
  });
}

export async function deleteOwnReview(userId: string, reviewId: string) {
  assertReviewsFeatureEnabled();
  await loadCustomerUser(userId);

  const review = await Review.findById(reviewId);
  if (!review || review.userId.toString() !== userId) {
    throw new AppError(404, "Review not found");
  }

  const productId = review.productId.toString();
  const wasApproved = review.status === "approved";
  await review.deleteOne();

  if (wasApproved) {
    await recomputeProductReviewAggregates(productId);
  }
}

export async function listAdminReviews(query: AdminReviewListQuery) {
  assertReviewsFeatureEnabled();

  const filter: Record<string, unknown> = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.search?.trim()) {
    const term = query.search.trim();
    filter.$or = [
      { productName: { $regex: term, $options: "i" } },
      { authorName: { $regex: term, $options: "i" } },
      { title: { $regex: term, $options: "i" } },
      { body: { $regex: term, $options: "i" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Review.countDocuments(filter),
  ]);

  const avatarsByUserId = await loadAvatarUrlByUserIds(
    items.map((doc) => doc.userId.toString())
  );

  return {
    data: toReviewDtos(items, avatarsByUserId),
    total,
    page: query.page,
    limit: query.limit,
  };
}

export async function moderateReview(
  reviewId: string,
  status: Extract<ReviewStatus, "approved" | "rejected">
) {
  assertReviewsFeatureEnabled();

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  const previousStatus = review.status;
  review.status = status;
  await review.save();

  if (previousStatus === "approved" || status === "approved") {
    await recomputeProductReviewAggregates(review.productId.toString());
  }

  return toReviewDtoWithUserAvatar(review);
}

export async function deleteReviewAdmin(reviewId: string) {
  assertReviewsFeatureEnabled();

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  const productId = review.productId.toString();
  const wasApproved = review.status === "approved";
  await review.deleteOne();

  if (wasApproved) {
    await recomputeProductReviewAggregates(productId);
  }
}
