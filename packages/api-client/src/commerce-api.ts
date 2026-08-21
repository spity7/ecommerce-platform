import { platformApi } from "./generated/index.js";

export async function fetchCart() {
  return platformApi.getCart();
}

export async function addCartItem(productId: string, quantity = 1) {
  return platformApi.addCartItem({ productId, quantity });
}

export async function updateCartItem(itemId: string, quantity: number) {
  return platformApi.updateCartItem(itemId, { quantity });
}

export async function removeCartItem(itemId: string) {
  return platformApi.removeCartItem(itemId);
}

export async function clearCart() {
  return platformApi.clearCart();
}

export async function mergeGuestCart(guestSessionId: string) {
  return platformApi.mergeCart({ guestSessionId });
}

export async function createOrderFromCart(shippingAddress?: {
  name: string;
  line1: string;
  city: string;
  country: string;
  phone?: string;
}) {
  return platformApi.createOrder(shippingAddress ? { shippingAddress } : {});
}

export async function fetchOrders() {
  return platformApi.listOrders();
}

export async function fetchOrder(id: string) {
  return platformApi.getOrder(id);
}

export async function updateUserProfile(input: {
  name?: string;
  phone?: string;
}) {
  return platformApi.updateUserProfile(input);
}
