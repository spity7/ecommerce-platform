import type { SiteConfig } from "@platform/shared";
import { beautyStationConfig } from "./sites/beauty-station.js";

const siteRegistry = {
  "beauty-station": beautyStationConfig,
} as const satisfies Record<string, SiteConfig>;

export type SiteId = keyof typeof siteRegistry;

export const defaultSiteId: SiteId = "beauty-station";

export function resolveSiteId(siteId?: string | null): SiteId {
  if (siteId && siteId in siteRegistry) {
    return siteId as SiteId;
  }
  return defaultSiteId;
}

export function getSiteConfig(siteId?: string | null): SiteConfig {
  return siteRegistry[resolveSiteId(siteId)];
}

export function listSiteIds(): SiteId[] {
  return Object.keys(siteRegistry) as SiteId[];
}

export { siteRegistry, beautyStationConfig };
