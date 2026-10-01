import { readSiteFaviconBuffer } from "@/lib/site-favicon";

export default async function AppleIcon() {
  const buffer = await readSiteFaviconBuffer();

  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
