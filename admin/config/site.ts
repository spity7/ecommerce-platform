import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const siteConfig = {
  name: `${site.name} Admin`,
  description: `${site.name} admin dashboard for ecommerce operations.`,
  url: site.adminUrl,
  siteId: site.id,
  storefrontUrl: site.url,
  apiUrl: site.apiUrl,
} as const;
