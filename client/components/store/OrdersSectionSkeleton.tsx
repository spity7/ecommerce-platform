type OrdersSectionSkeletonProps = {
  cardCount?: number;
};

export default function OrdersSectionSkeleton({
  cardCount = 2,
}: OrdersSectionSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading orders"
      className="rbt-orders-section-skeleton"
    >
      <div className="rbt-orders-section-skeleton__header text-center">
        <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--title" />
        <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--desc" />
      </div>
      <div className="rbt-orders-section-skeleton__cards">
        {Array.from({ length: cardCount }, (_, index) => (
          <div
            key={`orders-skeleton-card-${index}`}
            className="rbt-orders-section-skeleton__card rbt-has-bg-gray"
          >
            <div className="rbt-orders-section-skeleton__card-head">
              <div className="rbt-orders-section-skeleton__card-head-meta">
                <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__order-line" />
                <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__date-line" />
              </div>
              <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__status-pill" />
            </div>
            <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__summary-line" />
            <div className="rbt-orders-section-skeleton__item-lines">
              <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__item-line" />
              <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__item-line" />
            </div>
            <div className="rbt-wishlist-skeleton-block rbt-orders-section-skeleton__action" />
          </div>
        ))}
      </div>
    </div>
  );
}
