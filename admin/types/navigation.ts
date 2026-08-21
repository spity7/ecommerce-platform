import type { SiteFeatures } from "@platform/shared";

export type NavigationItem = {
  label: string;
  href: string;
  icon?: string;
  key: string;
  title?: string;
  feature?: keyof SiteFeatures;
};

export type NavigationGroup = {
  children: NavigationItem[];
  icon: string;
  key: string;
  label: string;
  feature?: keyof SiteFeatures;
};
