export { ApiError, customFetch, getApiBaseUrl, unwrap } from "./mutator.js";
export type { CustomFetchOptions } from "./mutator.js";

export * from "./generated/client.js";

import {
  deleteProduct,
  listAttribute,
  listBrand,
  listCategory,
  listProduct,
} from "./generated/client.js";
import { unwrap } from "./mutator.js";
import type {
  ListAttributeParams,
  ListBrandParams,
  ListCategoryParams,
  ListProductParams,
} from "./generated/client.js";

export async function fetchProducts(params?: ListProductParams) {
  return unwrap(listProduct(params));
}

export async function fetchCategories(params?: ListCategoryParams) {
  return unwrap(listCategory(params));
}

export async function fetchBrands(params?: ListBrandParams) {
  return unwrap(listBrand(params));
}

export async function fetchAttributes(params?: ListAttributeParams) {
  return unwrap(listAttribute(params));
}

export async function removeProduct(id: string) {
  await deleteProduct(id);
}

export async function fetchPublishedProducts(limit = 8) {
  return unwrap(
    listProduct(
      {
        status: "published",
        limit,
      },
      { next: { revalidate: 60 } } as RequestInit
    )
  );
}

export async function fetchProductBySlug(slug: string) {
  const response = await fetchProducts({
    search: slug,
    limit: 1,
  });
  return response.data[0] ?? null;
}
