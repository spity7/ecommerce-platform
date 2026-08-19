export { ApiError, customFetch, getApiBaseUrl, unwrap } from "./mutator.js";
export type { CustomFetchOptions } from "./mutator.js";

export {
  listProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./generated/products/products.js";

export {
  listCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./generated/categories/categories.js";

export {
  listBrand,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./generated/brands/brands.js";

export {
  listAttribute,
  getAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "./generated/attributes/attributes.js";

export { getHealth } from "./generated/health/health.js";
export { uploadFile } from "./generated/uploads/uploads.js";

export type * from "./generated/models/index.js";

import { listAttribute } from "./generated/attributes/attributes.js";
import { listBrand } from "./generated/brands/brands.js";
import { listCategory } from "./generated/categories/categories.js";
import { deleteProduct, listProduct } from "./generated/products/products.js";
import { unwrap } from "./mutator.js";
import type {
  ListAttributeParams,
  ListBrandParams,
  ListCategoryParams,
  ListProductParams,
} from "./generated/models/index.js";

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
      { next: { revalidate: 60 } } as RequestInit,
    ),
  );
}

export async function fetchProductBySlug(slug: string) {
  const response = await fetchProducts({
    search: slug,
    limit: 1,
  });
  return response.data[0] ?? null;
}
