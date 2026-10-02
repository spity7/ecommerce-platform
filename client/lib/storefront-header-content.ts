import type { SiteConfig, SiteHeaderAnnouncement } from "@platform/shared";
import { getStorefrontSiteConfig } from "@/lib/site";
import { getSiteContactInfo } from "@/lib/site-branding";

function buildFallbackAnnouncements(
  config: SiteConfig
): SiteHeaderAnnouncement[] {
  const { email, emailHref } = getSiteContactInfo(config);
  const items: SiteHeaderAnnouncement[] = [
    { text: config.tagline, href: "/shop" },
    { text: config.name, href: "/" },
  ];
  if (email && emailHref) {
    items.push({ text: email, href: emailHref });
  }
  return items;
}

export function getStorefrontHeaderAnnouncements(
  site?: SiteConfig
): SiteHeaderAnnouncement[] {
  const config = site ?? getStorefrontSiteConfig();
  const configured = config.header?.announcements;
  if (configured && configured.length > 0) {
    return [...configured];
  }
  return buildFallbackAnnouncements(config);
}
