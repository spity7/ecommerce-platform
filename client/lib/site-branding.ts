import type { SiteConfig } from "@platform/shared";
import { getStorefrontSiteConfig } from "@/lib/site";

export type SiteChromeBranding = {
  siteName: string;
  phone: string;
  phoneHref: string;
  logo: string;
  logoDark: string;
};

export type SiteContactInfo = {
  email: string;
  emailHref: string;
  phone: string;
  phoneHref: string;
};

function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

export function getSiteContactInfo(site?: SiteConfig): SiteContactInfo {
  const config = site ?? getStorefrontSiteConfig();
  const phone = config.contact.phone;
  const email = config.contact.email;

  return {
    email,
    emailHref: email ? `mailto:${email}` : "",
    phone,
    phoneHref: toTelHref(phone),
  };
}

export function getSiteChromeBranding(site?: SiteConfig): SiteChromeBranding {
  const config = site ?? getStorefrontSiteConfig();
  const logoDark = config.branding.logoDark ?? config.branding.logo;
  const contact = getSiteContactInfo(config);

  return {
    siteName: config.name,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    logo: config.branding.logo,
    logoDark,
  };
}
