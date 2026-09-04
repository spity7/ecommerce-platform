import type { Product } from "@/types/product";
import {
  isServerWishlistEnabled,
  syncAddToServerWishlist,
} from "@/lib/wishlist-sync";
import { useStore } from "@/context/store";

const PENDING_WISHLIST_KEY = "pending-wishlist-product";
const WISHLIST_APPLIED_TOAST_KEY = "wishlist-applied-toast";

export const WISHLIST_APPLIED_MESSAGE = "Added to Wishlist";

export type PendingWishlistProduct = Pick<
  Product,
  "id" | "apiProductId" | "title" | "price" | "imgSrc"
> & {
  apiProductId: string;
};

export function stashPendingWishlistProduct(product: Product): void {
  if (!product.apiProductId || typeof window === "undefined") {
    return;
  }

  const pending: PendingWishlistProduct = {
    id: product.id,
    apiProductId: product.apiProductId,
    title: product.title,
    price: product.price,
    imgSrc: product.imgSrc,
  };

  sessionStorage.setItem(PENDING_WISHLIST_KEY, JSON.stringify(pending));
}

export function consumePendingWishlistProduct(): PendingWishlistProduct | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(PENDING_WISHLIST_KEY);
  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(PENDING_WISHLIST_KEY);

  try {
    const parsed = JSON.parse(raw) as PendingWishlistProduct;
    if (!parsed.apiProductId) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function applyPendingWishlistAfterAuth(): Promise<boolean> {
  const pending = consumePendingWishlistProduct();
  if (!pending || !isServerWishlistEnabled()) {
    return false;
  }

  const serverWishlist = await syncAddToServerWishlist(pending.apiProductId);
  if (!serverWishlist) {
    return false;
  }

  useStore.setState({ wishList: serverWishlist });
  sessionStorage.setItem(WISHLIST_APPLIED_TOAST_KEY, "1");
  return true;
}

export function consumeWishlistAppliedToast(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!sessionStorage.getItem(WISHLIST_APPLIED_TOAST_KEY)) {
    return false;
  }

  sessionStorage.removeItem(WISHLIST_APPLIED_TOAST_KEY);
  return true;
}
