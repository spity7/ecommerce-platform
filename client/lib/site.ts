import { getSiteConfig } from "@platform/site-config";
import type { SiteConfig } from "@platform/shared";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export function getStorefrontSiteConfig(): SiteConfig {
  const siteId =
    process.env.SITE_ID ?? process.env.NEXT_PUBLIC_SITE_ID ?? "beauty-station";
  const config = getSiteConfig(siteId);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const apiUrl =
    process.env.API_URL?.trim() ?? process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!siteUrl && !apiUrl) {
    return config;
  }

  return {
    ...config,
    ...(siteUrl ? { url: trimTrailingSlash(siteUrl) } : {}),
    ...(apiUrl ? { apiUrl: trimTrailingSlash(apiUrl) } : {}),
  };
}
