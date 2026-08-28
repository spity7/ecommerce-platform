import { clearLegacyAuthCookies } from "@/lib/auth";
import { storefrontPath } from "@/lib/paths";
import { setAccessToken } from "@platform/api-client";

/** Clears local session state and cookies without revoking server refresh tokens. */
export async function clearLocalSession(): Promise<void> {
  try {
    await fetch("/api/auth/clear", { method: "POST", credentials: "include" });
  } catch {
    // Still clear in-memory token if API is unreachable.
  }
  clearLegacyAuthCookies();
  setAccessToken(null);
}

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
  await clearLocalSession();
  if (typeof window !== "undefined") {
    window.location.href = storefrontPath("/signin");
  }
}
