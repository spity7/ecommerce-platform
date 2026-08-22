import type { ProductDto } from "@platform/shared";
import type { Product } from "@/types/product";

export function mapProductDtoToStorefront(product: ProductDto): Product {
  return {
    id: product.slug,
    apiProductId: product.id,
    title: product.name,
    price: product.price,
    imgSrc:
      product.images[0] ??
      "/assets/images/product-img/beauty-product/beauty-product-st-05.webp",
    oldPrice: product.compareAtPrice ?? null,
    category: product.categoryName ? [product.categoryName] : [],
    inStock: product.stock > 0,
    availableQuantity: product.stock,
    rating: 5,
    ratingCount: 0,
  };
}

export function mapProductDtosToStorefront(products: ProductDto[]): Product[] {
  return products.map(mapProductDtoToStorefront);
}
