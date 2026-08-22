import { setAccessToken } from "@platform/api-client";
import type { AuthResponse } from "@platform/shared";

export async function tryRefreshSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const body = (await response.json()) as AuthResponse;

    if (!body.accessToken || !body.user) {
      return false;
    }

    setAccessToken(body.accessToken);
    return true;
  } catch {
    return false;
  }
}
