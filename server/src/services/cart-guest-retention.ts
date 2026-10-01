import type { CartDocument } from "../models/Cart.js";

/** Guest carts with no line items (edge cases after clear / hygiene). */
export const GUEST_EMPTY_CART_TTL_MS = 3 * 24 * 60 * 60 * 1000;

/** Abandoned guest carts that still have items. */
export const GUEST_CART_WITH_ITEMS_TTL_MS = 60 * 24 * 60 * 60 * 1000;

export function computeGuestCartExpiresAt(cart: CartDocument): Date {
  const ttlMs =
    cart.items.length === 0
      ? GUEST_EMPTY_CART_TTL_MS
      : GUEST_CART_WITH_ITEMS_TTL_MS;
  return new Date(Date.now() + ttlMs);
}

export function applyGuestCartExpiry(cart: CartDocument): void {
  if (!cart.guestSessionId) {
    return;
  }
  cart.expiresAt = computeGuestCartExpiresAt(cart);
}
