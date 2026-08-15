import { HomeLayoutRenderer } from "@/components/site/HomeLayoutRenderer";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
};

export default function HomePage() {
  return <HomeLayoutRenderer layout={site.homeLayout} />;
}
