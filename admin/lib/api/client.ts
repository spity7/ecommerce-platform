import type { PaginatedResponse } from "@platform/shared";

const DEFAULT_API_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_URL
  ).replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & {
  searchParams?: Record<string, string | number | undefined>;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { searchParams, ...init } = options;
  const url = new URL(`${getApiBaseUrl()}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchPaginated<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<PaginatedResponse<T>> {
  return apiFetch<PaginatedResponse<T>>(path, { searchParams: params });
}
