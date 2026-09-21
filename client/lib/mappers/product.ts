import type {
  ProductCardBadgeDto,
  StorefrontProductDto,
} from "@platform/shared";
import type { Product, ProductBadge } from "@/types/product";

const DEFAULT_PRODUCT_IMAGE =
  "/assets/images/product-img/beauty-product/beauty-product-st-05.webp";

function mapBadgeDtoToStorefront(badge: ProductCardBadgeDto): ProductBadge {
  return {
    text: badge.text,
    bg: badge.bg,
    kind: badge.kind,
  };
}

export function getProductReviewCount(
  product: Pick<Product, "reviewCount" | "ratingCount">
): number {
  return product.reviewCount ?? product.ratingCount ?? 0;
}

export function mapProductDtoToStorefront(
  product: StorefrontProductDto
): Product {
  const images =
    product.images.length > 0 ? product.images : [DEFAULT_PRODUCT_IMAGE];
  const reviewCount = product.reviewCount ?? 0;
  const averageRating = product.averageRating ?? 0;
  const storefrontBadges = (product.badges ?? []).map(mapBadgeDtoToStorefront);

  return {
    id: product.slug,
    apiProductId: product.id,
    title: product.name,
    price: product.price,
    imgSrc: images[0],
    images,
    oldPrice: product.compareAtPrice ?? null,
    category: product.categoryName ? [product.categoryName] : [],
    brandName: product.brandName || undefined,
    brandId: product.brandId,
    categoryId: product.categoryId,
    filterBrands: product.brandName ? [product.brandName] : [],
    filterCategory: product.categoryName ? [product.categoryName] : [],
    description: product.description || undefined,
    attributes: product.attributes,
    inStock: product.stock > 0,
    availableQuantity: product.stock,
    isStockOut: product.stock <= 0,
    rating: reviewCount > 0 ? averageRating : undefined,
    ratingCount: reviewCount,
    reviewCount,
    badge: storefrontBadges[0] ?? null,
    badges: storefrontBadges.length > 0 ? storefrontBadges : undefined,
  };
}

export function mapProductDtosToStorefront(
  products: StorefrontProductDto[]
): Product[] {
  return products.map(mapProductDtoToStorefront);
}
