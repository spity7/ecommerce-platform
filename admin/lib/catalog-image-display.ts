/**
 * Next/Image width/height drive the optimizer srcset, not the on-screen CSS box.
 * Layout classes (h-12, h-36, etc.) define display size; request ~2× for retina.
 */

/** Category/brand/product sidebar thumbnail (`h-36 w-36`, 144px). */
export const ADMIN_CATALOG_THUMB_PREVIEW = {
  width: 288,
  height: 288,
  sizes: "144px",
  quality: 85,
} as const;

/** Product list + category list row thumb (`h-12 w-12`, 48px). */
export const ADMIN_LIST_ROW_THUMB = {
  width: 96,
  height: 96,
  sizes: "48px",
  quality: 85,
} as const;

/** Product form multi-image grid (`grid-cols-2 sm:grid-cols-3`, square cells). */
export const ADMIN_PRODUCT_GALLERY_GRID = {
  width: 400,
  height: 400,
  sizes: "(max-width: 639px) 45vw, 30vw",
  quality: 85,
} as const;

/** Assigned-products picker row (`h-9 w-9`, 36px). */
export const ADMIN_ASSIGNED_PRODUCT_THUMB = {
  width: 72,
  height: 72,
  sizes: "36px",
  quality: 85,
} as const;

/** Dashboard category/brand scroller circle (`h-26 w-26`, 104px). */
export const ADMIN_SHOWCASE_CIRCLE = {
  width: 208,
  height: 208,
  sizes: "104px",
  quality: 85,
} as const;

/** Local file picks before upload — Next cannot optimize blob URLs. */
export function catalogPreviewImageUnoptimized(src: string): boolean {
  return src.startsWith("blob:");
}
