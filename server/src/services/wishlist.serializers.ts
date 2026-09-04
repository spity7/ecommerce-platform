import type { WishlistDto } from "@platform/shared";
import type { WishlistDocument } from "../models/Wishlist.js";
import { Product, type ProductDocument } from "../models/Product.js";

function toIsoString(value: Date | string | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

export async function toWishlistDto(
  doc: WishlistDocument
): Promise<WishlistDto> {
  const productIds = doc.items.map((item) => item.productId);
  const products = productIds.length
    ? await Product.find({ _id: { $in: productIds } })
    : [];
  const stockByProductId = new Map(
    products.map((product) => [
      product._id.toString(),
      product.status === "published" && product.stock > 0,
    ])
  );

  const items = doc.items.map((item) => {
    const productId = item.productId.toString();
    return {
      productId,
      productName: item.productName,
      productSlug: item.productSlug,
      productImage: item.productImage,
      price: item.price,
      inStock: stockByProductId.get(productId) ?? false,
      addedAt: toIsoString(item.addedAt),
    };
  });

  return {
    id: doc._id.toString(),
    items,
    itemCount: items.length,
  };
}

export function mapWishlistItemSnapshot(product: ProductDocument) {
  return {
    productId: product._id,
    productName: product.name,
    productSlug: product.slug,
    productImage: product.images[0] ?? "",
    price: product.price,
    addedAt: new Date(),
  };
}
