import type { CartDto } from "@platform/shared";
import {
  addCartItem,
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@platform/api-client";
import type { CartProduct } from "@/types/product";
import { getStorefrontSiteConfig } from "@/lib/site";

const FALLBACK_IMAGE =
  "/assets/images/product-img/beauty-product/beauty-product-st-05.webp";

export function isServerCartEnabled(): boolean {
  return getStorefrontSiteConfig().features.customerAuth;
}

export function mapCartDtoToCartProducts(cart: CartDto): CartProduct[] {
  return cart.items.map((item) => ({
    id: item.productSlug,
    apiProductId: item.productId,
    serverCartItemId: item.id,
    title: item.productName,
    price: item.price,
    imgSrc: item.productImage || FALLBACK_IMAGE,
    quantity: item.quantity,
  }));
}

export async function loadServerCart(): Promise<CartProduct[] | null> {
  if (!isServerCartEnabled()) {
    return null;
  }

  try {
    const cart = await fetchCart();
    return mapCartDtoToCartProducts(cart);
  } catch {
    return null;
  }
}

export async function syncAddToServerCart(
  apiProductId: string,
  quantity = 1
): Promise<CartProduct[] | null> {
  if (!isServerCartEnabled()) {
    return null;
  }

  try {
    const cart = await addCartItem(apiProductId, quantity);
    return mapCartDtoToCartProducts(cart);
  } catch {
    return null;
  }
}

export async function syncUpdateServerCartItem(
  serverCartItemId: string,
  quantity: number
): Promise<CartProduct[] | null> {
  if (!isServerCartEnabled()) {
    return null;
  }

  try {
    const cart = await updateCartItem(serverCartItemId, quantity);
    return mapCartDtoToCartProducts(cart);
  } catch {
    return null;
  }
}

export async function syncRemoveServerCartItem(
  serverCartItemId: string
): Promise<CartProduct[] | null> {
  if (!isServerCartEnabled()) {
    return null;
  }

  try {
    const cart = await removeCartItem(serverCartItemId);
    return mapCartDtoToCartProducts(cart);
  } catch {
    return null;
  }
}

export async function syncClearServerCart(): Promise<CartProduct[] | null> {
  if (!isServerCartEnabled()) {
    return null;
  }

  try {
    const cart = await clearCart();
    return mapCartDtoToCartProducts(cart);
  } catch {
    return null;
  }
}
