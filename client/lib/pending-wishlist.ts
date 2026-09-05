import type { Product } from "@/types/product";
import {
  getPendingWishlistMutationCount,
  isServerWishlistEnabled,
  syncAddToServerWishlist,
} from "@/lib/wishlist-sync";

const PENDING_WISHLIST_KEY = "pending-wishlist-products";
const LEGACY_PENDING_WISHLIST_KEY = "pending-wishlist-product";
const WISHLIST_APPLIED_TOAST_KEY = "wishlist-applied-toast";

export const WISHLIST_APPLIED_MESSAGE = "Added to Wishlist";

export type PendingWishlistProduct = Pick<
  Product,
  "id" | "apiProductId" | "title" | "price" | "imgSrc"
> & {
  apiProductId: string;
};

function readPendingWishlistProducts(): PendingWishlistProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = sessionStorage.getItem(PENDING_WISHLIST_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PendingWishlistProduct[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => Boolean(item?.apiProductId));
    } catch {
      return [];
    }
  }

  const legacyRaw = sessionStorage.getItem(LEGACY_PENDING_WISHLIST_KEY);
  if (!legacyRaw) {
    return [];
  }

  try {
    const parsed = JSON.parse(legacyRaw) as PendingWishlistProduct;
    if (!parsed.apiProductId) {
      return [];
    }

    return [parsed];
  } catch {
    return [];
  }
}

function writePendingWishlistProducts(products: PendingWishlistProduct[]): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(LEGACY_PENDING_WISHLIST_KEY);

  if (products.length === 0) {
    sessionStorage.removeItem(PENDING_WISHLIST_KEY);
    return;
  }

  sessionStorage.setItem(PENDING_WISHLIST_KEY, JSON.stringify(products));
}

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

  const existing = readPendingWishlistProducts();
  if (existing.some((item) => item.apiProductId === pending.apiProductId)) {
    return;
  }

  writePendingWishlistProducts([...existing, pending]);
}

export function consumePendingWishlistProducts(): PendingWishlistProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  const pending = readPendingWishlistProducts();
  writePendingWishlistProducts([]);
  return pending;
}

/** @deprecated Use consumePendingWishlistProducts */
export function consumePendingWishlistProduct(): PendingWishlistProduct | null {
  const pending = consumePendingWishlistProducts();
  return pending[0] ?? null;
}

export async function applyPendingWishlistAfterAuth(): Promise<boolean> {
  const pending = consumePendingWishlistProducts();
  if (pending.length === 0 || !isServerWishlistEnabled()) {
    return false;
  }

  let applied = false;

  for (const item of pending) {
    const serverWishlist = await syncAddToServerWishlist(item.apiProductId);
    if (!serverWishlist) {
      continue;
    }

    applyServerWishlistWhenIdle(serverWishlist);
    applied = true;
  }

  if (applied) {
    sessionStorage.setItem(WISHLIST_APPLIED_TOAST_KEY, "1");
  }

  return applied;
}

async function applyServerWishlistWhenIdle(serverWishlist: Product[]): Promise<void> {
  if (getPendingWishlistMutationCount() !== 0) {
    return;
  }

  const { useStore } = await import("@/context/store");
  useStore.setState({ wishList: serverWishlist });
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

export function getPendingWishlistProductCount(): number {
  return readPendingWishlistProducts().length;
}
