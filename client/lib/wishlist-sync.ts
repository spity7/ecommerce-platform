import type { WishlistDto } from "@platform/shared";
import {
  addWishlistItem,
  ApiError,
  fetchWishlist,
  moveWishlistItemToCart,
  removeWishlistItem,
} from "@platform/api-client";
import type { Product } from "@/types/product";
import { mapCartDtoToCartProducts } from "@/lib/cart-sync";
import { getStorefrontSiteConfig } from "@/lib/site";
import { notifyWishlistSyncError } from "@/lib/wishlist-sync-notify";

const FALLBACK_IMAGE =
  "/assets/images/product-img/beauty-product/beauty-product-st-05.webp";

export function isServerWishlistEnabled(): boolean {
  const site = getStorefrontSiteConfig();
  return Boolean(site.features.customerAuth && site.features.wishlist);
}

export function mapWishlistDtoToProducts(wishlist: WishlistDto): Product[] {
  return wishlist.items.map((item) => ({
    id: item.productSlug,
    apiProductId: item.productId,
    title: item.productName,
    price: item.price,
    oldPrice: item.compareAtPrice ?? null,
    sku: item.sku || undefined,
    imgSrc: item.productImage || FALLBACK_IMAGE,
    inStock: item.inStock,
    isStockOut: !item.inStock,
    badges:
      item.badges.length > 0
        ? item.badges.map((badge) => ({
            text: badge.text,
            bg: badge.bg,
            kind: badge.kind,
          }))
        : undefined,
    badge:
      item.badges[0] != null
        ? {
            text: item.badges[0].text,
            bg: item.badges[0].bg,
            kind: item.badges[0].kind,
          }
        : null,
  }));
}

function getWishlistSyncErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Could not update your wishlist. Please try again.";
}

function reportWishlistSyncError(error: unknown): void {
  notifyWishlistSyncError(getWishlistSyncErrorMessage(error));
}

export async function loadServerWishlist(): Promise<Product[] | null> {
  if (!isServerWishlistEnabled()) {
    return null;
  }

  try {
    const wishlist = await fetchWishlist();
    return mapWishlistDtoToProducts(wishlist);
  } catch {
    return null;
  }
}

export async function syncAddToServerWishlist(
  apiProductId: string
): Promise<Product[] | null> {
  if (!isServerWishlistEnabled()) {
    return null;
  }

  try {
    const wishlist = await addWishlistItem(apiProductId);
    return mapWishlistDtoToProducts(wishlist);
  } catch (error) {
    reportWishlistSyncError(error);
    return null;
  }
}

export async function syncRemoveFromServerWishlist(
  apiProductId: string
): Promise<Product[] | null> {
  if (!isServerWishlistEnabled()) {
    return null;
  }

  try {
    const wishlist = await removeWishlistItem(apiProductId);
    return mapWishlistDtoToProducts(wishlist);
  } catch (error) {
    reportWishlistSyncError(error);
    return null;
  }
}

export async function syncMoveWishlistItemToCart(
  apiProductId: string,
  quantity = 1
): Promise<{
  wishlist: Product[];
  cart: ReturnType<typeof mapCartDtoToCartProducts>;
} | null> {
  if (!isServerWishlistEnabled()) {
    return null;
  }

  try {
    const result = await moveWishlistItemToCart(apiProductId, quantity);
    return {
      wishlist: mapWishlistDtoToProducts(result.wishlist),
      cart: mapCartDtoToCartProducts(result.cart),
    };
  } catch (error) {
    reportWishlistSyncError(error);
    return null;
  }
}

export function getWishlistProductPath(product: Product): string {
  return product.apiProductId
    ? `/product/${product.id}`
    : `/product-single-default/${product.id}`;
}

let mutationChain: Promise<unknown> = Promise.resolve();
let pendingMutationCount = 0;

export function getPendingWishlistMutationCount(): number {
  return pendingMutationCount;
}

export function queueWishlistMutation(
  operation: () => Promise<Product[] | null>
): Promise<Product[] | null> {
  pendingMutationCount++;

  const result = mutationChain.then(operation);
  mutationChain = result.then(
    () => undefined,
    () => undefined
  );

  return result.finally(() => {
    pendingMutationCount--;
  });
}
