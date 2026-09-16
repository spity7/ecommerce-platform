import { CheckmarkSmallIcon } from "@/components/svg-icons/CheckmarkSmallIcon";

export function VerifiedPurchaseBadge() {
  return (
    <span
      className="rbt-reviewer-chk-badge rbt-verified-purchase-badge"
      title="This customer purchased this product from our store"
    >
      <CheckmarkSmallIcon aria-hidden />
      <span className="rbt-verified-purchase-label">Verified purchase</span>
    </span>
  );
}
