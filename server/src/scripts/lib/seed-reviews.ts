import bcrypt from "bcryptjs";
import type { Types } from "mongoose";
import { Product } from "../../models/Product.js";
import { Review } from "../../models/Review.js";
import { User } from "../../models/User.js";
import { recomputeProductReviewAggregates } from "../../services/product-review-aggregates.service.js";

type SeedReviewer = {
  _id: Types.ObjectId;
  name: string;
};

export type SeedSampleReviewsResult = {
  count: number;
  summaryNote: string | null;
};

const SEED_REVIEWER_PASSWORD = "SeedReview1!";
const SEED_REVIEWER_COUNT = 12;

const BEAUTY_TOP_RATED_SLUGS = [
  "peptide-firming-eye-cream",
  "rosewater-balancing-toner",
] as const;

const REVIEW_SNIPPETS = [
  {
    title: "Exactly what I needed",
    body: "Noticed results within the first week.",
  },
  {
    title: "Repurchasing",
    body: "Already on my second bottle — staple product.",
  },
  {
    title: "Great for daily use",
    body: "Light texture and no irritation on my skin.",
  },
  {
    title: "Worth the price",
    body: "Quality feels premium and lasts a long time.",
  },
  { title: "Gift-worthy", body: "Bought one for myself and one for a friend." },
  {
    title: "Sensitive skin friendly",
    body: "No redness or breakouts after switching.",
  },
  { title: "Fast delivery", body: "Packaging was secure and arrived quickly." },
  { title: "Lovely scent", body: "Subtle fragrance that does not overpower." },
  { title: "Visible glow", body: "Skin looks brighter and more even." },
  { title: "Works under makeup", body: "Layers well without pilling." },
  { title: "Hydrating", body: "Keeps my skin comfortable through the day." },
  {
    title: "Five stars",
    body: "One of the best products I have tried this year.",
  },
];

export async function clearReviewData(): Promise<void> {
  await Review.deleteMany({});
}

async function ensureSeedReviewers(): Promise<SeedReviewer[]> {
  const passwordHash = await bcrypt.hash(SEED_REVIEWER_PASSWORD, 10);
  const reviewers: SeedReviewer[] = [];

  for (let index = 1; index <= SEED_REVIEWER_COUNT; index += 1) {
    const padded = String(index).padStart(2, "0");
    const email = `catalog-seed-reviewer-${padded}@example.com`;
    const name = `Seed Reviewer ${padded}`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        passwordHash,
        role: "customer",
        emailVerified: true,
        passwordSetByUser: true,
        isActive: true,
      });
    }

    reviewers.push({ _id: user._id, name: user.name });
  }

  return reviewers;
}

async function upsertReview(input: {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  status: "approved" | "pending" | "rejected";
  verifiedPurchase?: boolean;
  productName: string;
  productSlug: string;
}): Promise<void> {
  await Review.findOneAndUpdate(
    { productId: input.productId, userId: input.userId },
    {
      $set: {
        authorName: input.authorName,
        rating: input.rating,
        title: input.title,
        body: input.body,
        status: input.status,
        verifiedPurchase: input.verifiedPurchase ?? false,
        productName: input.productName,
        productSlug: input.productSlug,
      },
    },
    { upsert: true }
  );
}

async function seedTopRatedReviews(
  reviewers: SeedReviewer[],
  slug: string,
  ratings: number[]
): Promise<number> {
  const product = await Product.findOne({ slug, status: "published" });
  if (!product || ratings.length === 0) {
    return 0;
  }

  let count = 0;
  for (let index = 0; index < ratings.length; index += 1) {
    const reviewer = reviewers[index];
    if (!reviewer) {
      break;
    }
    const snippet =
      REVIEW_SNIPPETS[index % REVIEW_SNIPPETS.length] ?? REVIEW_SNIPPETS[0]!;
    await upsertReview({
      productId: product._id,
      userId: reviewer._id,
      authorName: reviewer.name,
      rating: ratings[index] ?? 5,
      title: snippet.title,
      body: snippet.body,
      status: "approved",
      verifiedPurchase: index % 3 === 0,
      productName: product.name,
      productSlug: product.slug,
    });
    count += 1;
  }

  await recomputeProductReviewAggregates(product._id.toString());
  return count;
}

async function recomputeAggregatesForSlugs(
  slugs: string[],
  bySlug: (slug: string) => { _id: Types.ObjectId } | undefined
): Promise<void> {
  for (const slug of slugs) {
    const product = bySlug(slug);
    if (product) {
      await recomputeProductReviewAggregates(product._id.toString());
    }
  }
}

async function seedBeautySampleReviews(
  demoCustomerEmail: string
): Promise<SeedSampleReviewsResult> {
  const reviewers = await ensureSeedReviewers();
  const customer = await User.findOne({ email: demoCustomerEmail });

  let total = 0;
  const touchedProductIds = new Set<string>();

  const published = await Product.find({ status: "published" }).sort({
    sku: 1,
  });
  const bySlug = (slug: string) =>
    published.find((product) => product.slug === slug);

  const vitaminC = bySlug("hydrating-vitamin-c-serum") ?? published[0];
  const spfMoisturizer = bySlug("spf-50-daily-moisturizer") ?? published[1];
  const matteLip = bySlug("matte-lip-color") ?? published[4];

  if (customer && vitaminC) {
    await upsertReview({
      productId: vitaminC._id,
      userId: customer._id,
      authorName: customer.name,
      rating: 5,
      title: "Love it",
      body: "Great texture and fast shipping.",
      status: "approved",
      verifiedPurchase: true,
      productName: vitaminC.name,
      productSlug: vitaminC.slug,
    });
    touchedProductIds.add(vitaminC._id.toString());
    total += 1;
  }

  if (customer && spfMoisturizer) {
    await upsertReview({
      productId: spfMoisturizer._id,
      userId: customer._id,
      authorName: customer.name,
      rating: 4,
      title: "Waiting to publish",
      body: "Good so far, still testing.",
      status: "pending",
      productName: spfMoisturizer.name,
      productSlug: spfMoisturizer.slug,
    });
    touchedProductIds.add(spfMoisturizer._id.toString());
    total += 1;
  }

  if (customer && matteLip) {
    await upsertReview({
      productId: matteLip._id,
      userId: customer._id,
      authorName: customer.name,
      rating: 4,
      title: "Solid daily use",
      body: "Works well in my routine.",
      status: "approved",
      productName: matteLip.name,
      productSlug: matteLip.slug,
    });
    touchedProductIds.add(matteLip._id.toString());
    total += 1;
  }

  total += await seedTopRatedReviews(
    reviewers,
    BEAUTY_TOP_RATED_SLUGS[0],
    Array.from({ length: 12 }, () => 5)
  );

  total += await seedTopRatedReviews(
    reviewers.slice(0, 10),
    BEAUTY_TOP_RATED_SLUGS[1],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 4]
  );

  const extras: Array<{
    slug: string;
    rating: number;
    status: "approved" | "pending";
  }> = [
    { slug: "strobe-glow-highlighter", rating: 5, status: "approved" },
    { slug: "rose-eau-de-parfum", rating: 5, status: "approved" },
    { slug: "luminous-foundation", rating: 3, status: "pending" },
    { slug: "repairing-hair-mask", rating: 4, status: "pending" },
  ];

  for (const [index, extra] of extras.entries()) {
    const product = bySlug(extra.slug);
    const reviewer = reviewers[(index + 2) % reviewers.length];
    if (!product || !reviewer) {
      continue;
    }

    const snippet =
      REVIEW_SNIPPETS[(index + 3) % REVIEW_SNIPPETS.length] ??
      REVIEW_SNIPPETS[0]!;
    await upsertReview({
      productId: product._id,
      userId: reviewer._id,
      authorName: reviewer.name,
      rating: extra.rating,
      title: snippet.title,
      body: snippet.body,
      status: extra.status,
      verifiedPurchase: extra.status === "approved" && index === 0,
      productName: product.name,
      productSlug: product.slug,
    });
    touchedProductIds.add(product._id.toString());
    total += 1;
  }

  for (const productId of touchedProductIds) {
    await recomputeProductReviewAggregates(productId);
  }

  await recomputeAggregatesForSlugs([...BEAUTY_TOP_RATED_SLUGS], bySlug);

  return {
    count: total,
    summaryNote: "incl. Top rated demos on peptide eye cream + rosewater toner",
  };
}

async function seedGenericSampleReviews(
  demoCustomerEmail: string
): Promise<SeedSampleReviewsResult> {
  const reviewers = await ensureSeedReviewers();
  const customer = await User.findOne({ email: demoCustomerEmail });

  const published = await Product.find({ status: "published" }).sort({
    sku: 1,
  });
  if (published.length === 0) {
    return { count: 0, summaryNote: null };
  }

  const bySlug = (slug: string) =>
    published.find((product) => product.slug === slug);

  let total = 0;
  const touchedProductIds = new Set<string>();
  const topRatedSlugs: string[] = [];

  const primary = published[0]!;
  const secondary = published[1];
  const tertiary = published[2];

  if (customer) {
    await upsertReview({
      productId: primary._id,
      userId: customer._id,
      authorName: customer.name,
      rating: 5,
      title: "Love it",
      body: "Great quality and fast shipping.",
      status: "approved",
      verifiedPurchase: true,
      productName: primary.name,
      productSlug: primary.slug,
    });
    touchedProductIds.add(primary._id.toString());
    total += 1;

    if (secondary) {
      await upsertReview({
        productId: secondary._id,
        userId: customer._id,
        authorName: customer.name,
        rating: 4,
        title: "Waiting to publish",
        body: "Good so far, still testing.",
        status: "pending",
        productName: secondary.name,
        productSlug: secondary.slug,
      });
      touchedProductIds.add(secondary._id.toString());
      total += 1;
    }

    if (tertiary) {
      await upsertReview({
        productId: tertiary._id,
        userId: customer._id,
        authorName: customer.name,
        rating: 4,
        title: "Solid daily use",
        body: "Works well for me.",
        status: "approved",
        productName: tertiary.name,
        productSlug: tertiary.slug,
      });
      touchedProductIds.add(tertiary._id.toString());
      total += 1;
    }
  }

  total += await seedTopRatedReviews(
    reviewers,
    primary.slug,
    Array.from({ length: 12 }, () => 5)
  );
  topRatedSlugs.push(primary.slug);

  if (secondary) {
    total += await seedTopRatedReviews(
      reviewers.slice(0, 10),
      secondary.slug,
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 4]
    );
    topRatedSlugs.push(secondary.slug);
  }

  for (const productId of touchedProductIds) {
    await recomputeProductReviewAggregates(productId);
  }

  await recomputeAggregatesForSlugs(topRatedSlugs, bySlug);

  const topRatedNames = topRatedSlugs
    .map((slug) => bySlug(slug)?.name)
    .filter(Boolean)
    .join(" + ");

  return {
    count: total,
    summaryNote: topRatedNames
      ? `incl. Top rated demos on ${topRatedNames}`
      : "mixed approved and pending samples",
  };
}

export async function seedSampleReviews(
  demoCustomerEmail: string,
  datasetLabel: string
): Promise<SeedSampleReviewsResult> {
  if (datasetLabel === "beauty") {
    return seedBeautySampleReviews(demoCustomerEmail);
  }

  return seedGenericSampleReviews(demoCustomerEmail);
}
