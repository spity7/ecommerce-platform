import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAdminSiteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default async function Icon() {
  const site = getAdminSiteConfig();
  const assetPath = site.branding.favicon ?? site.branding.logo;
  const filePath = path.join(
    process.cwd(),
    "public",
    assetPath.replace(/^\//, "")
  );
  const buffer = await readFile(filePath);

  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
