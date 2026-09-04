import type { CartDto } from "@platform/shared";
import type { CartProduct } from "@/types/product";
import { mapCartDtoToCartProducts } from "@/lib/cart-sync";

export type CartCheckoutValidationResult =
  | { ok: true; serverCart: CartProduct[] }
  | { ok: false; message: string; serverCart?: CartProduct[] };

function cartSignature(items: CartProduct[]): string {
  return items
    .map(
      (item) =>
        `${item.serverCartItemId ?? "local"}:${item.apiProductId ?? item.id}:${item.quantity}`
    )
    .sort()
    .join("|");
}

export function validateCartForCheckout(
  localCart: CartProduct[],
  serverCartDto: CartDto
): CartCheckoutValidationResult {
  const serverCart = mapCartDtoToCartProducts(serverCartDto);

  if (localCart.length === 0 && serverCart.length === 0) {
    return { ok: false, message: "Your cart is empty." };
  }

  const localOnlyItems = localCart.filter((item) => !item.apiProductId);
  if (localOnlyItems.length > 0) {
    return {
      ok: false,
      message:
        "Some items in your cart are demo-only and cannot be purchased. Remove them or add products from the shop.",
      serverCart,
    };
  }

  const localMissingServerIds = localCart.filter(
    (item) => !item.serverCartItemId
  );
  if (localMissingServerIds.length > 0) {
    return {
      ok: false,
      message:
        "Your cart is still syncing with the server. Refresh the page and try again.",
      serverCart,
    };
  }

  if (serverCart.length === 0 && localCart.length > 0) {
    return {
      ok: false,
      message:
        "Your saved cart does not match the server. We refreshed it — review your items before checkout.",
      serverCart,
    };
  }

  if (cartSignature(localCart) !== cartSignature(serverCart)) {
    return {
      ok: false,
      message:
        "Your cart changed on the server. Review the updated items before placing your order.",
      serverCart,
    };
  }

  return { ok: true, serverCart };
}
