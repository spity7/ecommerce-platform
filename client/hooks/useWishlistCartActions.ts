"use client";

import { useContextElement } from "@/context/Context";
import type { Product } from "@/types";
import { useStore } from "@/context/store";
import {
  isServerWishlistEnabled,
  syncMoveWishlistItemToCart,
} from "@/lib/wishlist-sync";

export function useWishlistCartActions() {
  const {
    addProductToCart,
    removeFromWishlist,
    isAddedToCartProducts,
    mounted,
  } = useContextElement();

  function handleAddToCart(product: Product): void {
    if (isAddedToCartProducts(product.id)) {
      return;
    }

    if (product.apiProductId && isServerWishlistEnabled()) {
      void syncMoveWishlistItemToCart(product.apiProductId).then((result) => {
        if (!result) {
          return;
        }

        useStore.setState({
          wishList: result.wishlist,
          cartProducts: result.cart,
          totalPrice: result.cart.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          ),
        });
      });
      return;
    }

    addProductToCart(product);
    removeFromWishlist(product.id);
  }

  return {
    handleAddToCart,
    isAddedToCartProducts,
    mounted,
  };
}
