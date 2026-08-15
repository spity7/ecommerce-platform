import { getStorefrontSiteConfig } from "@/lib/site";

const site = getStorefrontSiteConfig();

/** Evaluated at build time from SITE_ID / site config */
export const brandName = site.name;
export const brandTitleSuffix = site.seo.title;
export const brandDescription = site.seo.description;
export const brandTagline = site.tagline;
