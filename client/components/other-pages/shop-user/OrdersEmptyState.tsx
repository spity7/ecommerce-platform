import Link from "next/link";

type OrdersEmptyStateProps = {
  browseHref?: string;
  browseLabel?: string;
  description?: string;
  title?: string;
};

export default function OrdersEmptyState({
  browseHref = "/shop",
  browseLabel = "Browse products",
  description = "When you place an order, it will show up here with status, items, and details.",
  title = "No orders yet",
}: OrdersEmptyStateProps) {
  return (
    <div className="rbt-transparent-table-one-wrapper rbt-has-bg-gray rbt-orders-page-empty">
      <div aria-hidden="true" className="rbt-orders-page-empty__icon">
        <i className="fa-regular fa-bag-shopping" />
      </div>
      <h3 className="rbt-orders-page-empty__title rbt-title rbt-text-bold mb--8">
        {title}
      </h3>
      <p className="b2 mb--0 rbt-text-color-gray-500 rbt-orders-page-empty__hint">
        {description}
      </p>
      <Link
        className="rbt-btn rbt-btn-md rbt-btn-primary mt--24"
        href={browseHref}
      >
        {browseLabel}
      </Link>
    </div>
  );
}
