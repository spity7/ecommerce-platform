"use client";

import type { Product } from "@/types";
import Tooltip from "@/components/common/ui/Tooltip";
import { useWishlistAction } from "@/hooks/useWishlistAction";

interface AddToWishlistProps {
  product: Product;
  tooltipDirection?: "top" | "right" | "bottom" | "left";
  parentClass?: string;
}

export default function AddToWishlistTwo({
  product,
  tooltipDirection = "left",
  parentClass = "rbt-wishlist-btn rbt-round-btn bg-light-one rbt-top-right--position tooltips",
}: AddToWishlistProps) {
  const { toggleWishlist, isAddedtoWishlist } = useWishlistAction();

  const isWishlisted = isAddedtoWishlist(product.id);

  const tooltipText = isWishlisted ? "Remove Wishlist" : "Add To Wishlist";
  const iconClass = isWishlisted
    ? "fa-sharp fa-solid fa-heart"
    : "fa-regular fa-heart";

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Tooltip content={tooltipText} placement={tooltipDirection}>
      <button
        className={`${parentClass} ${isWishlisted ? "added-wishlist" : ""}`}
        type="button"
        aria-label={tooltipText}
        onClick={handleClick}
      >
        <i className={iconClass} />
      </button>
    </Tooltip>
  );
}
