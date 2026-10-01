import type { WishlistDto } from "@platform/shared";
import type { WishlistDocument } from "../models/Wishlist.js";
import { Product, type ProductDocument } from "../models/Product.js";
import { toStorefrontProductDto } from "../utils/serializers.js";

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
  const productById = new Map<string, ProductDocument>(
    products.map((product) => [product._id.toString(), product])
  );

  const items = doc.items.map((item) => {
    const productId = item.productId.toString();
    const product = productById.get(productId);
    const storefront = product ? toStorefrontProductDto(product) : null;

    return {
      productId,
      productName: item.productName,
      productSlug: item.productSlug,
      productImage: item.productImage,
      price: storefront?.price ?? item.price,
      compareAtPrice: storefront?.compareAtPrice,
      sku: storefront?.sku ?? "",
      badges: storefront?.badges ?? [],
      inStock:
        storefront != null
          ? storefront.status === "published" && storefront.stock > 0
          : false,
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
