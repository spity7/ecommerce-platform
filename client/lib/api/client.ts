const DEFAULT_API_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_URL
  ).replace(/\/$/, "");
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
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
