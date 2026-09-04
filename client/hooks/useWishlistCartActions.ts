"use client";

import { useContextElement } from "@/context/Context";
import type { Product } from "@/types";

export function useWishlistCartActions() {
  const { addProductToCart, isAddedToCartProducts, mounted } =
    useContextElement();

  function handleAddToCart(product: Product): void {
    if (isAddedToCartProducts(product.id)) {
      return;
    }

    // Keep wishlist and cart independent — same as adding from the product page.
    addProductToCart(product);
  }

  return {
    handleAddToCart,
    isAddedToCartProducts,
    mounted,
  };
}
