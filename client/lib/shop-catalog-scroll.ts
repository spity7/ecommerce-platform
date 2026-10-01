export const SHOP_PRODUCT_GRID_SCROLL_ID = "shop-product-grid";

export function scrollToShopProductGrid(
  behavior: ScrollBehavior = "smooth"
): void {
  const element = document.getElementById(SHOP_PRODUCT_GRID_SCROLL_ID);
  element?.scrollIntoView({ behavior, block: "start" });
}
