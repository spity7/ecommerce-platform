import { clearLegacyAuthCookies } from "@/lib/auth";
import { setAccessToken } from "@platform/api-client";

export async function clearSession(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // Still clear in-memory token if API is unreachable.
  }
  clearLegacyAuthCookies();
  setAccessToken(null);
}

export async function clearSessionAndRedirectToSignIn(): Promise<void> {
  await clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}
