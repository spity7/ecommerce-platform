import type { SiteConfig } from "@platform/shared";
import { getStorefrontSiteConfig } from "@/lib/site";

export type SiteChromeBranding = {
  siteName: string;
  phone: string;
  phoneHref: string;
  logo: string;
  logoDark: string;
};

function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

export function getSiteChromeBranding(
  site?: SiteConfig
): SiteChromeBranding {
  const config = site ?? getStorefrontSiteConfig();
  const logoDark = config.branding.logoDark ?? config.branding.logo;

  return {
    siteName: config.name,
    phone: config.contact.phone,
    phoneHref: toTelHref(config.contact.phone),
    logo: config.branding.logo,
    logoDark,
  };
}
