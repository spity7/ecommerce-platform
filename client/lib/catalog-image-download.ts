import {
  catalogImageDownloadFilename,
  isPublicCatalogGcsImageUrl,
} from "@platform/shared";

export function getCatalogImageLightGalleryDownloadAttrs(src: string): {
  "data-download-url"?: string;
  "data-download"?: string;
} {
  if (src.startsWith("/")) {
    const name = src.split("/").pop() ?? "image.webp";
    return {
      "data-download-url": src,
      "data-download": name,
    };
  }

  if (!isPublicCatalogGcsImageUrl(src)) {
    return {};
  }

  const params = new URLSearchParams({ url: src });
  return {
    "data-download-url": `/api/catalog-image-download?${params.toString()}`,
    "data-download": catalogImageDownloadFilename(src),
  };
}
