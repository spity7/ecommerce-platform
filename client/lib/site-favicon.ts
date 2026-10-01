import { readFile } from "node:fs/promises";
import path from "node:path";
import { getStorefrontSiteConfig } from "@/lib/site";

export function getSiteFaviconAssetPath(): string {
  const site = getStorefrontSiteConfig();
  return site.branding.favicon ?? site.branding.logo;
}

export function getSiteFaviconMetadataUrl(): string {
  const assetPath = getSiteFaviconAssetPath().replace(/^\//, "");
  const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() ?? "";

  if (!base) {
    return `/${assetPath}`;
  }

  const baseNorm = base.endsWith("/") ? base : `${base}/`;
  return `${baseNorm}${assetPath}`;
}

export async function readSiteFaviconBuffer(): Promise<Buffer> {
  const assetPath = getSiteFaviconAssetPath();
  const filePath = path.join(
    process.cwd(),
    "public",
    assetPath.replace(/^\//, "")
  );
  return readFile(filePath);
}
