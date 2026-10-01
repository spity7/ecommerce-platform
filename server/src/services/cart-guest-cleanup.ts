import { Cart, type CartDocument } from "../models/Cart.js";

export async function deleteEmptyGuestCart(
  cart: CartDocument
): Promise<boolean> {
  if (!cart.guestSessionId || cart.items.length > 0) {
    return false;
  }

  const result = await Cart.deleteOne({
    _id: cart._id,
    guestSessionId: cart.guestSessionId,
  });
  return result.deletedCount === 1;
}

export async function deleteGuestCartDocument(
  cart: CartDocument
): Promise<boolean> {
  if (!cart.guestSessionId) {
    return false;
  }

  const result = await Cart.deleteOne({
    _id: cart._id,
    guestSessionId: cart.guestSessionId,
  });
  return result.deletedCount === 1;
}
