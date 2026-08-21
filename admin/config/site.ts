import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const siteConfig = {
  name: `${site.name} Admin`,
  displayName: site.name,
  description: `${site.name} admin dashboard for ecommerce operations.`,
  url: site.adminUrl,
  siteId: site.id,
  storefrontUrl: site.url,
  apiUrl: site.apiUrl,
  tagline: site.tagline,
  features: site.features,
  branding: site.branding,
} as const;
