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
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type CustomFetchOptions = RequestInit & {
  searchParams?: Record<string, string | number | boolean | undefined>;
};

type OrvalResponse<TData> = {
  data: TData;
  status: number;
  headers: Headers;
};

export async function customFetch<T>(
  path: string,
  options: CustomFetchOptions = {},
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
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init.headers,
    },
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

  let data: unknown;
  if (response.status === 204) {
    data = undefined;
  } else {
    data = await response.json();
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}

export async function unwrap<TData>(
  promise: Promise<OrvalResponse<TData>>,
): Promise<TData> {
  const response = await promise;
  return response.data;
}
