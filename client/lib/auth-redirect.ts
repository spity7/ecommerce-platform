import { storefrontPath } from "@/lib/paths";

export const RETURN_TO_PARAM = "returnTo";

const DEFAULT_POST_AUTH_PATH = "/account-info";

function sanitizeReturnPath(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return null;
  }

  if (path === "/signin" || path === "/signup") {
    return null;
  }

  return path;
}

export function getCurrentReturnPath(): string {
  if (typeof window === "undefined") {
    return DEFAULT_POST_AUTH_PATH;
  }

  return `${window.location.pathname}${window.location.search}`;
}

export function getReturnToFromSearchParams(
  searchParams: URLSearchParams
): string {
  return sanitizeReturnPath(searchParams.get(RETURN_TO_PARAM)) ??
    DEFAULT_POST_AUTH_PATH;
}

export function buildSignInPath(returnTo?: string): string {
  const path = sanitizeReturnPath(returnTo) ?? sanitizeReturnPath(getCurrentReturnPath());
  if (!path) {
    return "/signin";
  }

  const params = new URLSearchParams();
  params.set(RETURN_TO_PARAM, path);
  return `/signin?${params.toString()}`;
}

export function buildSignUpPath(returnTo?: string): string {
  const path = sanitizeReturnPath(returnTo) ?? sanitizeReturnPath(getCurrentReturnPath());
  if (!path) {
    return "/signup";
  }

  const params = new URLSearchParams();
  params.set(RETURN_TO_PARAM, path);
  return `/signup?${params.toString()}`;
}

export function redirectToSignIn(returnTo?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = storefrontPath(buildSignInPath(returnTo));
}

export function getPostAuthRedirectPath(
  searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()
): string {
  return getReturnToFromSearchParams(searchParams);
}
