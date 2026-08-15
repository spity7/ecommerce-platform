import { getSiteConfig } from "@platform/site-config";

export function getAdminSiteConfig() {
  const siteId =
    process.env.SITE_ID ?? process.env.NEXT_PUBLIC_SITE_ID ?? "beauty-station";
  return getSiteConfig(siteId);
}
