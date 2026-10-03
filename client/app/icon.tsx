import { readSiteFaviconBuffer } from "@/lib/site-favicon";

export default async function Icon() {
  const buffer = await readSiteFaviconBuffer();

  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
}
