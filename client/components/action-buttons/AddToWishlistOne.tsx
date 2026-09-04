"use client";

import { useContextElement } from "@/context/Context";
import type { Product } from "@/types";
import Tooltip from "../common/ui/Tooltip";
import { useWishlistAction } from "@/hooks/useWishlistAction";

interface AddToWishlistProps {
  product: Product;
  parentClass?: string;
}

export default function AddToWishlist({
  parentClass = "rbt-wishlist-btn rbt-quick-btn",
  product,
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
    <Tooltip content={tooltipText} placement="left">
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
