"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchProductReviewSummary,
  fetchProductReviews,
} from "@platform/api-client";
import AddReviewForm from "./AddReviewForm";
import { ReviewAuthorAvatar } from "./ReviewAuthorAvatar";
import { VerifiedPurchaseBadge } from "./VerifiedPurchaseBadge";
import { productReviews as demoProductReviews } from "@/data/productDetails";
import { mapReviewDtoToStorefront } from "@/lib/mappers/reviews";
import type { StorefrontReview } from "@/lib/mappers/reviews";

type ProductReviewsPanelProps = {
  productId?: string;
  productName?: string;
  averageRating?: number;
  reviewCount?: number;
  ratingBreakdown?: { star: number; count: number }[];
  reviews?: StorefrontReview[];
  useApiData?: boolean;
};

function renderAverageStars(rating: number) {
  return [...Array(5)].map((_, index) => (
    <li key={index}>
      <i
        className={`fa-solid fa-star${index < Math.round(rating) ? " rbt-rated-icon" : ""}`}
      />
    </li>
  ));
}

export default function ProductReviewsPanel({
  productId,
  productName,
  averageRating = 0,
  reviewCount = 0,
  ratingBreakdown = [],
  reviews = [],
  useApiData = false,
}: ProductReviewsPanelProps) {
  const router = useRouter();
  const [apiReviews, setApiReviews] = useState(reviews);
  const [apiSummary, setApiSummary] = useState({
    averageRating,
    ratingBreakdown,
    reviewCount,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!useApiData) {
      return;
    }
    setApiReviews(reviews);
    setApiSummary({ averageRating, reviewCount, ratingBreakdown });
  }, [averageRating, ratingBreakdown, reviewCount, reviews, useApiData]);

  const refreshProductReviews = useCallback(async () => {
    if (!productId || !useApiData) {
      return;
    }
    setRefreshing(true);
    try {
      const [reviewList, summary] = await Promise.all([
        fetchProductReviews(productId, { limit: 20, page: 1 }),
        fetchProductReviewSummary(productId),
      ]);
      setApiReviews(reviewList.data.map(mapReviewDtoToStorefront));
      setApiSummary({
        averageRating: summary.averageRating,
        reviewCount: summary.reviewCount,
        ratingBreakdown: summary.ratingBreakdown,
      });
      router.refresh();
    } catch {
      // Keep showing the last loaded data if refresh fails.
    } finally {
      setRefreshing(false);
    }
  }, [productId, router, useApiData]);

  const listItems: StorefrontReview[] = useApiData
    ? apiReviews
    : demoProductReviews.map((review): StorefrontReview => ({
        id: String(review.id),
        author: review.author,
        rating: review.rating,
        date: review.date,
        title: review.title,
        desc: review.desc,
        verifiedPurchase: false,
        status: "approved",
        productSlug: "",
        productName: "",
      }));

  const displayAverage = useApiData ? apiSummary.averageRating : 4.33;
  const displayCount = useApiData ? apiSummary.reviewCount : 19;

  const breakdown = useApiData
    ? [5, 4, 3, 2, 1].map((star) => {
        const count =
          apiSummary.ratingBreakdown.find((row) => row.star === star)?.count ??
          0;
        const percent =
          apiSummary.reviewCount > 0
            ? Math.round((count / apiSummary.reviewCount) * 100)
            : 0;
        return { star, count, percent };
      })
    : [
        { star: 5, percent: 50, count: 6 },
        { star: 4, percent: 25, count: 4 },
        { star: 3, percent: 75, count: 6 },
        { star: 2, percent: 75, count: 6 },
        { star: 1, percent: 50, count: 9 },
      ];

  return (
    <div className="tab-pane fade active show">
      <div className="rbt-product-single-reviews-area">
        <div className="rbt-review-statistics-section">
          <div className="row row--12 mt_dec--24">
            <div className="col-md-6 mt--24">
              <div className="rbt-avr-review">
                <span className="rbt-abr-review-number-text">
                  {displayAverage.toFixed(useApiData ? 2 : 2)}
                </span>
                <div className="rbt-abr-review-content">
                  <ul className="rbt-rating-icon-list">
                    {renderAverageStars(displayAverage)}
                  </ul>
                  <p className="rating-text b3 mt--8 rbt-text-color-gray-700">
                    Based on {displayCount} Review
                    {displayCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt--24">
              <div className="rbt-rating-breakdown">
                {breakdown.map((item) => (
                  <div className="rbt-rating-item" key={item.star}>
                    <span className="icon">
                      <i className="fa-solid fa-star rbt-rated-icon" />
                    </span>
                    <span className="number-text">{item.star}</span>
                    <div
                      aria-label="Rating breakdown"
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={item.percent}
                      className="progress"
                      role="progressbar"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="number-text">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-busy={refreshing} className="rbt-prd-single-reviews-list-area">
        {refreshing ? (
          <p className="b3 rbt-text-color-gray-600 mb--16">Updating reviews…</p>
        ) : null}
        {listItems.length === 0 ? (
          <p className="b2 text-muted mb--24">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <ul className="rbt-comment-list">
            {listItems.map((review) => (
              <li className="comment" key={review.id}>
                <div className="comment-body">
                  <div className="single-comment">
                    <ReviewAuthorAvatar
                      author={review.author}
                      avatarUrl={review.authorAvatarUrl}
                    />
                    <div className="comment-inner">
                      <ul className="rbt-rating-icon-list">
                        {[...Array(5)].map((_, index) => (
                          <li key={index}>
                            <i
                              className={`fa-solid fa-star${index < review.rating ? " rbt-rated-icon" : ""}`}
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="comment-meta">
                        <div className="time-spent rbt-review-comment-meta">
                          <span className="rbt-review-comment-author">
                            {review.author}
                          </span>
                          <span
                            aria-hidden
                            className="rbt-review-comment-separator"
                          >
                            ·
                          </span>
                          {review.createdAt ? (
                            <time
                              className="rbt-review-comment-date"
                              dateTime={review.createdAt}
                            >
                              {review.date}
                            </time>
                          ) : (
                            <span className="rbt-review-comment-date">
                              {review.date}
                            </span>
                          )}
                          {review.verifiedPurchase ? (
                            <VerifiedPurchaseBadge />
                          ) : null}
                        </div>
                      </div>
                      <div className="comment-text">
                        <p className="title">{review.title}</p>
                        <p className="b1">{review.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {productId ? (
        <AddReviewForm
          onSubmitted={() => void refreshProductReviews()}
          productId={productId}
          productName={productName}
        />
      ) : null}
    </div>
  );
}
