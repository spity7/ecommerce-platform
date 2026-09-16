import DescriptionTab1 from "./DescriptionTab1";
import type { StorefrontReview } from "@/lib/mappers/reviews";

export default function Description4({
  description,
  parentClass = "rbt-component-area rbt-section-gap pt--0",
  reviewsEnabled = true,
  productId,
  productName,
  averageRating,
  reviewCount,
  ratingBreakdown,
  reviews,
  useApiReviews = false,
}: {
  description?: string;
  parentClass?: string;
  reviewsEnabled?: boolean;
  productId?: string;
  productName?: string;
  averageRating?: number;
  reviewCount?: number;
  ratingBreakdown?: { star: number; count: number }[];
  reviews?: StorefrontReview[];
  useApiReviews?: boolean;
}) {
  return (
    <div className={parentClass}>
      <div className="container">
        <div className="row row--12 mt_dec--24">
          <div className="col-xl-12 mt--24">
            <DescriptionTab1
              averageRating={averageRating}
              description={description}
              productId={productId}
              productName={productName}
              ratingBreakdown={ratingBreakdown}
              reviewCount={reviewCount}
              reviews={reviews}
              reviewsEnabled={reviewsEnabled}
              useApiReviews={useApiReviews}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
