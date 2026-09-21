import type { CatalogStatus } from "@/data/products/data";

export function isAdminOutOfStock(stock: number): boolean {
  return stock <= 0;
}

/** Published products with stock in (0, threshold] — not sold out. */
export function isAdminLowStock(
  catalogStatus: CatalogStatus | undefined,
  stock: number,
  threshold: number
): boolean {
  if (catalogStatus !== "published") {
    return false;
  }
  return stock > 0 && stock <= threshold;
}
