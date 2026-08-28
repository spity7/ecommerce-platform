import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import {
  attachAuthCookies,
  clearAuthCookies,
} from "@/lib/auth-session-cookies";
import { proxyAuthRequest, readAuthResponse } from "@/lib/auth-session-api";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    const response = NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    );
    return clearAuthCookies(response);
  }

  const upstream = await proxyAuthRequest("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  const payload = await readAuthResponse(upstream);

  if (!upstream.ok || !payload.accessToken || !payload.refreshToken) {
    const response = NextResponse.json(
      { error: payload.error ?? "Session expired" },
      { status: upstream.status }
    );
    return clearAuthCookies(response);
  }

  if (payload.user?.role !== "admin") {
    const response = NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
    return clearAuthCookies(response);
  }

  const response = NextResponse.json({
    user: payload.user,
    accessToken: payload.accessToken,
  });
  return attachAuthCookies(response, payload.accessToken, payload.refreshToken);
}
