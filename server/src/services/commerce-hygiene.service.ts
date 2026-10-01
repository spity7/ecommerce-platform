import { Product } from "../models/Product.js";
import type { CartDocument } from "../models/Cart.js";
import { deleteEmptyGuestCart } from "./cart-guest-cleanup.js";
import type { getOrCreateUserWishlist } from "./wishlist.service.js";

type MutableCart = CartDocument;
type MutableWishlist = Awaited<ReturnType<typeof getOrCreateUserWishlist>>;

export async function refreshCartLineItems(
  cart: MutableCart
): Promise<boolean> {
  if (cart.items.length === 0) {
    return false;
  }

  const productIds = [
    ...new Set(cart.items.map((item) => item.productId.toString())),
  ];
  const products = await Product.find({ _id: { $in: productIds } });
  const productById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  let modified = false;

  for (let index = cart.items.length - 1; index >= 0; index -= 1) {
    const item = cart.items[index];
    if (!item) {
      continue;
    }
    const product = productById.get(item.productId.toString());
    if (!product || product.status !== "published") {
      cart.items.splice(index, 1);
      modified = true;
      continue;
    }

    const image = product.images[0] ?? "";
    if (
      item.productName !== product.name ||
      item.productSlug !== product.slug ||
      item.productImage !== image ||
      item.price !== product.price
    ) {
      item.productName = product.name;
      item.productSlug = product.slug;
      item.productImage = image;
      item.price = product.price;
      modified = true;
    }
  }

  if (modified) {
    await cart.save();
    if (cart.items.length === 0) {
      await deleteEmptyGuestCart(cart);
    }
  }

  return modified;
}

export async function refreshWishlistLineItems(
  wishlist: MutableWishlist
): Promise<boolean> {
  if (wishlist.items.length === 0) {
    return false;
  }

  const productIds = [
    ...new Set(wishlist.items.map((item) => item.productId.toString())),
  ];
  const products = await Product.find({ _id: { $in: productIds } });
  const productById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  let modified = false;

  for (let index = wishlist.items.length - 1; index >= 0; index -= 1) {
    const item = wishlist.items[index];
    if (!item) {
      continue;
    }
    const product = productById.get(item.productId.toString());
    if (!product || product.status !== "published") {
      wishlist.items.splice(index, 1);
      modified = true;
      continue;
    }

    const image = product.images[0] ?? "";
    if (
      item.productName !== product.name ||
      item.productSlug !== product.slug ||
      item.productImage !== image ||
      item.price !== product.price
    ) {
      item.productName = product.name;
      item.productSlug = product.slug;
      item.productImage = image;
      item.price = product.price;
      modified = true;
    }
  }

  if (modified) {
    await wishlist.save();
  }

  return modified;
}
