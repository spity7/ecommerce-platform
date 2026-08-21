import type { SiteFeatures } from "@platform/shared";
import { primaryNavigation } from "@/config/navigation";
import type { NavigationGroup, NavigationItem } from "@/types/navigation";

function isNavigationGroup(
  item: NavigationGroup | NavigationItem
): item is NavigationGroup {
  return "children" in item;
}

function isFeatureEnabled(
  features: SiteFeatures,
  feature: keyof SiteFeatures | undefined
): boolean {
  if (!feature) {
    return true;
  }
  return features[feature];
}

export function filterNavigationByFeatures(
  features: SiteFeatures
): Array<NavigationGroup | NavigationItem> {
  return primaryNavigation
    .map((item) => {
      if (!isFeatureEnabled(features, item.feature)) {
        return null;
      }

      if (isNavigationGroup(item)) {
        const children = item.children.filter((child) =>
          isFeatureEnabled(features, child.feature)
        );

        if (children.length === 0) {
          return null;
        }

        return { ...item, children };
      }

      return item;
    })
    .filter((item): item is NavigationGroup | NavigationItem => item !== null);
}
