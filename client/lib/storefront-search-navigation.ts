import { buildShopCatalogHref, createShopCatalogQuery } from "@/lib/shop-query";

export const STOREFRONT_PRODUCT_DETAILS_PATH = "/product";

export type StorefrontSearchRouter = {
  push: (href: string, options?: { scroll?: boolean }) => void;
};

export function buildStorefrontCatalogSearchHref(search?: string): string {
  const trimmed = search?.trim();
  return buildShopCatalogHref(
    createShopCatalogQuery({
      page: 1,
      search: trimmed || undefined,
    })
  );
}

export function navigateStorefrontCatalogSearch(
  router: StorefrontSearchRouter,
  search: string,
  options?: { scroll?: boolean }
): void {
  router.push(buildStorefrontCatalogSearchHref(search), {
    scroll: options?.scroll ?? false,
  });
}

export function navigateStorefrontProduct(
  router: StorefrontSearchRouter,
  slug: string,
  options?: { scroll?: boolean }
): void {
  router.push(`${STOREFRONT_PRODUCT_DETAILS_PATH}/${slug}`, {
    scroll: options?.scroll ?? true,
  });
}
