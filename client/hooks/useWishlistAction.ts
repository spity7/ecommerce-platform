"use client";

import { useContextElement, useUiElement } from "@/context/Context";
import type { Product } from "@/types";

export function useWishlistAction() {
  const { addToWishlist, isAddedtoWishlist } = useContextElement();
  const { showToaster } = useUiElement();

  function toggleWishlist(product: Product): void {
    if (!product.id) {
      return;
    }

    const isWishlisted = isAddedtoWishlist(product.id);
    const result = addToWishlist(product);

    if (result === "auth_required") {
      return;
    }

    showToaster(
      isWishlisted ? "Removed from Wishlist" : "Added to Wishlist"
    );
  }

  return {
    toggleWishlist,
    isAddedtoWishlist,
  };
}
