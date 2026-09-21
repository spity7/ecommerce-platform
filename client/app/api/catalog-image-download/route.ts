import {
  catalogImageDownloadFilename,
  isPublicCatalogGcsImageUrl,
} from "@platform/shared";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url || !isPublicCatalogGcsImageUrl(url)) {
    return new Response("Invalid catalog image URL.", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url);
  } catch {
    return new Response("Failed to fetch image.", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Image not found.", { status: 404 });
  }

  const filename = catalogImageDownloadFilename(url);
  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
