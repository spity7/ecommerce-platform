import { Product } from "../../models/Product.js";
import { Review } from "../../models/Review.js";
import { User } from "../../models/User.js";
import { recomputeProductReviewAggregates } from "../../services/product-review-aggregates.service.js";

export async function clearReviewData(): Promise<void> {
  await Review.deleteMany({});
}

export async function seedSampleReviews(
  demoCustomerEmail: string
): Promise<number> {
  const customer = await User.findOne({ email: demoCustomerEmail });
  if (!customer) {
    return 0;
  }

  const products = await Product.find({ status: "published" }).limit(4);
  const first = products[0];
  if (!first) {
    return 0;
  }

  const second = products[1] ?? first;
  const third = products[2] ?? first;

  const samples = [
    {
      product: first,
      status: "approved" as const,
      rating: 5,
      title: "Love it",
      body: "Great texture and fast shipping.",
    },
    {
      product: second,
      status: "pending" as const,
      rating: 4,
      title: "Waiting to publish",
      body: "Good so far, still testing.",
    },
    {
      product: third,
      status: "approved" as const,
      rating: 4,
      title: "Solid daily use",
      body: "Works well in my routine.",
    },
  ];

  const productIds = new Set<string>();

  for (const sample of samples) {
    productIds.add(sample.product._id.toString());
    await Review.findOneAndUpdate(
      { productId: sample.product._id, userId: customer._id },
      {
        $set: {
          authorName: customer.name,
          rating: sample.rating,
          title: sample.title,
          body: sample.body,
          status: sample.status,
          verifiedPurchase: false,
          productName: sample.product.name,
          productSlug: sample.product.slug,
        },
      },
      { upsert: true }
    );
  }

  for (const productId of productIds) {
    await recomputeProductReviewAggregates(productId);
  }

  return samples.length;
}
