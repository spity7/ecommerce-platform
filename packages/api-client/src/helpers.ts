import { platformApi } from "./generated/index.js";
import type {
  ListAttributeParams,
  ListBrandParams,
  ListCategoryParams,
  ListProductParams,
} from "./generated/platform.schemas.js";

export {
  createAttributeApi,
  createBrandApi,
  createCategoryApi,
  createProductApi,
  deleteAttributeApi,
  deleteBrandApi,
  deleteCategoryApi,
  deleteProductApi,
  getAttributeApi,
  getBrandApi,
  getCategoryApi,
  getProductApi,
  updateAttributeApi,
  updateBrandApi,
  updateCategoryApi,
  updateProductApi,
} from "./catalog-api.js";

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
    status: "published",
    limit: 100,
  });
  return response.data.find((product) => product.slug === slug) ?? null;
}

export async function fetchProductById(id: string) {
  return platformApi.getProduct(id);
}
