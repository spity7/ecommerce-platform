import type { PaginatedResponse, ProductDto } from "@platform/shared";
import { apiFetch } from "./client";

export async function fetchPublishedProducts(limit = 8) {
  return apiFetch<PaginatedResponse<ProductDto>>("/api/products", {
    searchParams: {
      status: "published",
      limit,
    },
  });
}

export async function fetchProductBySlug(slug: string) {
  const response = await apiFetch<PaginatedResponse<ProductDto>>(
    "/api/products",
    {
      searchParams: {
        search: slug,
        limit: 1,
      },
    }
  );
  return response.data[0] ?? null;
}
