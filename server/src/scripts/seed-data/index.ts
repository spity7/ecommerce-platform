import type { HomeLayoutId } from "@platform/shared";
import { beautySeedData } from "./beauty.js";
import { generalSeedData } from "./general.js";
import { sportSeedData } from "./sport.js";
import type { SiteSeedData } from "./types.js";

export function getSeedDataForSite(
  siteId: string,
  homeLayout: HomeLayoutId
): SiteSeedData {
  if (homeLayout === "sport") {
    return sportSeedData;
  }

  if (homeLayout === "general") {
    return generalSeedData;
  }

  if (siteId === "beauty-station" || homeLayout.startsWith("cosmetic-beauty")) {
    return beautySeedData;
  }

  return generalSeedData;
}
