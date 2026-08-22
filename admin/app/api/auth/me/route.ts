import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";
import { clearAuthCookies } from "@/lib/auth-session-cookies";
import { proxyAuthRequest } from "@/lib/auth-session-api";

export async function GET() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upstream = await proxyAuthRequest("/api/auth/me", {
    method: "GET",
    accessToken,
  });

  const body = await upstream.json();
  return NextResponse.json(body, { status: upstream.status });
}
