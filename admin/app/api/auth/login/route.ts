import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import {
  attachAuthCookies,
  clearAuthCookies,
} from "@/lib/auth-session-cookies";
import { proxyAuthRequest, readAuthResponse } from "@/lib/auth-session-api";

export async function POST(request: Request) {
  const body = await request.json();
  const upstream = await proxyAuthRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const payload = await readAuthResponse(upstream);

  if (!upstream.ok || !payload.accessToken || !payload.refreshToken) {
    return NextResponse.json(
      { error: payload.error ?? "Sign in failed" },
      { status: upstream.status }
    );
  }

  if (payload.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const response = NextResponse.json({
    user: payload.user,
    accessToken: payload.accessToken,
  });
  return attachAuthCookies(response, payload.accessToken, payload.refreshToken);
}
