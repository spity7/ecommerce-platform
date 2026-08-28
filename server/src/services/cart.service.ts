import type { Request } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { AppError } from "../middleware/errorHandler.js";
import { toCartDto } from "./commerce.serializers.js";

export const GUEST_CART_HEADER = "x-guest-cart-id";

export function getGuestSessionId(req: Request): string | undefined {
  const header = req.header(GUEST_CART_HEADER);
  return header?.trim() || undefined;
}

export async function resolveCart(req: AuthenticatedRequest) {
  const userId = req.auth?.userId;
  const guestSessionId = getGuestSessionId(req);

  if (userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  }

  if (!guestSessionId) {
    throw new AppError(400, "Guest cart id header is required");
  }

  let cart = await Cart.findOne({ guestSessionId });
  if (!cart) {
    cart = await Cart.create({ guestSessionId, items: [] });
  }
  return cart;
}

export async function getOrCreateUserCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

export async function addProductToCart(
  cart: Awaited<ReturnType<typeof resolveCart>>,
  productId: string,
  quantity: number
) {
  const product = await Product.findById(productId);
  if (!product || product.status !== "published") {
    throw new AppError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new AppError(400, "Insufficient stock");
  }

  const existing = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existing) {
    const nextQty = existing.quantity + quantity;
    if (product.stock < nextQty) {
      throw new AppError(400, "Insufficient stock");
    }
    existing.quantity = nextQty;
  } else {
    cart.items.push({
      productId: product._id,
      quantity,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0] ?? "",
      price: product.price,
    });
  }

  await cart.save();
  return toCartDto(cart);
}

export async function mergeGuestCartIntoUser(
  userId: string,
  guestSessionId: string
) {
  const guestCart = await Cart.findOne({ guestSessionId });
  const userCart = await getOrCreateUserCart(userId);

  if (!guestCart) {
    return toCartDto(userCart);
  }

  if (guestCart.items.length > 0) {
    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find(
        (item) => item.productId.toString() === guestItem.productId.toString()
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
  }

  await Cart.deleteOne({ _id: guestCart._id });
  return toCartDto(userCart);
}
