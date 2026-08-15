import type {
  AttributeDto,
  BrandDto,
  CategoryDto,
  ProductDto,
} from "@platform/shared";
import { fetchPaginated, apiFetch } from "./client";

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return fetchPaginated<ProductDto>("/api/products", params);
}

export async function deleteProduct(id: string) {
  return apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
}

export async function fetchCategories(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return fetchPaginated<CategoryDto>("/api/categories", params);
}

export async function fetchBrands(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return fetchPaginated<BrandDto>("/api/brands", params);
}

export async function fetchAttributes(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return fetchPaginated<AttributeDto>("/api/attributes", params);
}
