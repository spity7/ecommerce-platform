import { clearAuthCookies } from "@/lib/auth";
import { setAccessToken } from "@platform/api-client";

export function clearSession(): void {
  clearAuthCookies();
  setAccessToken(null);
}

export function clearSessionAndRedirectToSignIn(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}
