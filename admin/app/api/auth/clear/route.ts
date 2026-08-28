import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-session-cookies";

/** Clears httpOnly auth cookies without revoking refresh tokens on the API. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearAuthCookies(response);
}
