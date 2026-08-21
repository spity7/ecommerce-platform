import { platformApi } from "@platform/api-client";
import type {
  CreateAttributeBody,
  CreateBrandBody,
  CreateCategoryBody,
  CreateProductBody,
  UpdateAttributeBody,
  UpdateBrandBody,
  UpdateCategoryBody,
  UpdateProductBody,
} from "./generated/platform.schemas.js";

export async function createProductApi(body: CreateProductBody) {
  return platformApi.createProduct(body);
}

export async function updateProductApi(id: string, body: UpdateProductBody) {
  return platformApi.updateProduct(id, body);
}

export async function deleteProductApi(id: string) {
  return platformApi.deleteProduct(id);
}

export async function getProductApi(id: string) {
  return platformApi.getProduct(id);
}

export async function createCategoryApi(body: CreateCategoryBody) {
  return platformApi.createCategory(body);
}

export async function updateCategoryApi(id: string, body: UpdateCategoryBody) {
  return platformApi.updateCategory(id, body);
}

export async function deleteCategoryApi(id: string) {
  return platformApi.deleteCategory(id);
}

export async function getCategoryApi(id: string) {
  return platformApi.getCategory(id);
}

export async function createBrandApi(body: CreateBrandBody) {
  return platformApi.createBrand(body);
}

export async function updateBrandApi(id: string, body: UpdateBrandBody) {
  return platformApi.updateBrand(id, body);
}

export async function deleteBrandApi(id: string) {
  return platformApi.deleteBrand(id);
}

export async function getBrandApi(id: string) {
  return platformApi.getBrand(id);
}

export async function createAttributeApi(body: CreateAttributeBody) {
  return platformApi.createAttribute(body);
}

export async function updateAttributeApi(
  id: string,
  body: UpdateAttributeBody
) {
  return platformApi.updateAttribute(id, body);
}

export async function deleteAttributeApi(id: string) {
  return platformApi.deleteAttribute(id);
}

export async function getAttributeApi(id: string) {
  return platformApi.getAttribute(id);
}
