const PUBLIC_CATALOG_GCS_FOLDERS = [
  "categories",
  "brands",
  "products",
] as const;

/** HTTPS GCS URL under categories/, brands/, or products/ (any site bucket). */
export function isPublicCatalogGcsImageUrl(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "storage.googleapis.com"
    ) {
      return false;
    }
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length < 3) {
      return false;
    }
    const folder = pathParts[1];
    return (PUBLIC_CATALOG_GCS_FOLDERS as readonly string[]).includes(folder);
  } catch {
    return false;
  }
}

export function catalogImageDownloadFilename(imageUrl: string): string {
  try {
    const path = decodeURIComponent(new URL(imageUrl).pathname);
    const base = path.split("/").pop() ?? "product-image";
    return base.length > 0 ? base : "product-image.webp";
  } catch {
    return "product-image.webp";
  }
}
