import { getApiBaseUrl } from "@platform/api-client";
import type { AuthResponse } from "@platform/shared";

export function getAuthApiBaseUrl(): string {
  return getApiBaseUrl();
}

export async function proxyAuthRequest(
  path: string,
  options: RequestInit & { accessToken?: string } = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return fetch(`${getAuthApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });
}

export type AuthApiSuccess = AuthResponse & { error?: string };

export async function readAuthResponse(response: Response): Promise<AuthApiSuccess> {
  return (await response.json()) as AuthApiSuccess;
}
