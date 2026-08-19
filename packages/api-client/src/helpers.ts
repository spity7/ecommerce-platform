import { platformApi } from "./generated/index.js";
import type {
  ListAttributeParams,
  ListBrandParams,
  ListCategoryParams,
  ListProductParams,
} from "./generated/platform.schemas.js";

export async function fetchProducts(params?: ListProductParams) {
  return platformApi.listProduct(params);
}

export async function fetchCategories(params?: ListCategoryParams) {
  return platformApi.listCategory(params);
}

export async function fetchBrands(params?: ListBrandParams) {
  return platformApi.listBrand(params);
}

export async function fetchAttributes(params?: ListAttributeParams) {
  return platformApi.listAttribute(params);
}

export async function removeProduct(id: string) {
  await platformApi.deleteProduct(id);
}

export async function fetchPublishedProducts(limit = 8) {
  return platformApi.listProduct({
    status: "published",
    limit,
  });
}

export async function fetchProductBySlug(slug: string) {
  const response = await fetchProducts({
    search: slug,
    limit: 1,
  });
  return response.data[0] ?? null;
}
