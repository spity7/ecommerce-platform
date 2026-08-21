import { getApiBaseUrl, setAccessToken } from "@platform/api-client";
import { getRefreshTokenFromCookie, setAuthCookies } from "@/lib/auth";

export async function tryRefreshSession(): Promise<boolean> {
  const refreshToken = getRefreshTokenFromCookie();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const body = (await response.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (!body.accessToken || !body.refreshToken) {
      return false;
    }

    setAuthCookies(body.accessToken, body.refreshToken);
    setAccessToken(body.accessToken);
    return true;
  } catch {
    return false;
  }
}
