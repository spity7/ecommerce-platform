import mongoose from "mongoose";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";

export async function recomputeProductReviewAggregates(
  productId: string
): Promise<void> {
  const objectId = new mongoose.Types.ObjectId(productId);
  const match = { productId: objectId, status: "approved" as const };

  const [stats] = await Review.aggregate<{
    _id: null;
    averageRating: number;
    reviewCount: number;
  }>([
    { $match: match },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats?.averageRating
    ? Math.round(stats.averageRating * 100) / 100
    : 0;
  const reviewCount = stats?.reviewCount ?? 0;

  await Product.updateOne(
    { _id: productId },
    { $set: { averageRating, reviewCount } }
  );
}

export async function syncReviewProductSnapshots(
  productId: string,
  productName: string,
  productSlug: string
): Promise<void> {
  await Review.updateMany(
    { productId },
    { $set: { productName, productSlug } }
  );
}
