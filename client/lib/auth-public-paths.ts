export const AUTH_PUBLIC_PATHS = [
  "/signin",
  "/signup",
  "/forgot-password",
] as const;

export function isAuthPublicPath(pathname: string): boolean {
  return AUTH_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
