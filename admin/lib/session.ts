import { clearLegacyAuthCookies } from "@/lib/auth";
import { adminPath } from "@/lib/paths";
import { setAccessToken } from "@platform/api-client";

export function notifyAuthSessionUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:session-updated"));
  }
}

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
  notifyAuthSessionUpdated();
}

export async function clearSessionAndRedirectToSignIn(): Promise<void> {
  await clearLocalSession();
  if (typeof window !== "undefined") {
    window.location.href = adminPath("/signin");
  }
}
