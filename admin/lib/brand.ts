import type { Metadata } from "next";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const brandName = site.name.replace(/ Admin$/, "");
export const adminBrandName = site.name;
export const adminBrandDescription = site.description;

export function createAdminMetadata(title: string): Metadata {
  return {
    title,
    description: site.description,
  };
}
