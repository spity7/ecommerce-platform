import type { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth";

function cookieOptions(maxAge: number): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function attachAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    cookieOptions(ACCESS_TOKEN_MAX_AGE)
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    cookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}
