import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";
import { clearAuthCookies } from "@/lib/auth-session-cookies";
import { proxyAuthRequest } from "@/lib/auth-session-api";

export async function POST() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    try {
      await proxyAuthRequest("/api/auth/logout", {
        method: "POST",
        accessToken,
      });
    } catch {
      // Clear local session even if API is unreachable.
    }
  }

  const response = NextResponse.json({ ok: true });
  return clearAuthCookies(response);
}
