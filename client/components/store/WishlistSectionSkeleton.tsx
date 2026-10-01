type WishlistSectionSkeletonProps = {
  rowCount?: number;
};

export default function WishlistSectionSkeleton({
  rowCount = 2,
}: WishlistSectionSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading wishlist"
      className="rbt-wishlist-section-skeleton"
    >
      <div className="rbt-wishlist-section-skeleton__header text-center">
        <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--title" />
        <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--desc" />
      </div>
      <div className="rbt-wishlist-section-skeleton__list rbt-has-bg-gray">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={`wishlist-skeleton-row-${index}`}
            className="rbt-wishlist-section-skeleton__row"
          >
            <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--remove rbt-wishlist-skeleton-remove-col" />
            <div className="rbt-wishlist-section-skeleton__media">
              <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--thumb" />
              <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--remove rbt-wishlist-skeleton-remove-overlay" />
            </div>
            <div className="rbt-wishlist-section-skeleton__meta">
              <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--line-lg" />
              <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--line-md" />
              <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--line-sm" />
            </div>
            <div className="rbt-wishlist-skeleton-block rbt-wishlist-skeleton-block--action" />
          </div>
        ))}
      </div>
    </div>
  );
}
