"use client";

import ModalTriggerButton from "@/components/action-buttons/ModalTriggerButton";
import type { Product } from "@/types";
import { useWishlistAction } from "@/hooks/useWishlistAction";

interface WishlistQuickLinkTriggerProps {
  product: Product;
  parentClass?: string;
}

export default function WishlistQuickLinkTrigger({
  product,
  parentClass = "rbt-quick-link",
}: WishlistQuickLinkTriggerProps) {
  const { toggleWishlist, isAddedtoWishlist } = useWishlistAction();

  const isWishlisted = isAddedtoWishlist(product.id);

  if (isWishlisted) {
    return (
      <button
        type="button"
        className={parentClass}
        onClick={() => toggleWishlist(product)}
      >
        <i className="fa-sharp fa-regular fa-heart" />
        Remove wishlist
      </button>
    );
  }

  return (
    <ModalTriggerButton
      openModalName="wishlistModal"
      className={parentClass}
      onClick={() => toggleWishlist(product)}
    >
      <i className="fa-sharp fa-regular fa-heart" />
      Add To Wishlist
    </ModalTriggerButton>
  );
}
