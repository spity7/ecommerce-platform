/**
 * Prefix a path with NEXT_PUBLIC_BASE_URL when the storefront is deployed under a subdirectory.
 * Use for client-side full-page redirects (window.location). Next.js router/link handle basePath automatically.
 */
export function storefrontPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return normalized;
  }

  const baseNorm = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${baseNorm}${normalized}`;
}
