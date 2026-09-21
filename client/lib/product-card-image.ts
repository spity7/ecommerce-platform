/**
 * Next/Image width/height drive the optimizer srcset, not the on-screen CSS box.
 * Theme HTML used 312×312 for ProductCard5 layout; request ~800px for 4-col grid @2x DPR.
 */
export const PRODUCT_CARD_SQUARE_IMAGE = {
  width: 800,
  height: 800,
  sizes: "(max-width: 575px) 50vw, (max-width: 991px) 50vw, 25vw",
  quality: 85,
} as const;

/** Slider3 / cosmetic PDP — theme uses 848×848 square frames. */
export const PDP_GALLERY_SQUARE_IMAGE = {
  width: 848,
  height: 848,
  sizes: "(max-width: 767px) 100vw, 50vw",
  quality: 85,
} as const;

export const PDP_GALLERY_THUMB_IMAGE = {
  sizes: "(max-width: 991px) 22vw, 12vw",
  quality: 85,
} as const;

/** Thumb row visible slots by viewport (see `getPdpThumbSlidesPerView`). */
export const PDP_GALLERY_THUMB_MOBILE_MAX = 4;
export const PDP_GALLERY_THUMB_LARGE_PHONE_MAX = 5;
export const PDP_GALLERY_THUMB_TABLET_MAX = 6;
export const PDP_GALLERY_THUMB_DESKTOP_MAX = 8;

export function getPdpThumbSlidesPerView(
  imageCount: number,
  viewportWidth: number
): number {
  if (viewportWidth >= 992) {
    return Math.min(imageCount, PDP_GALLERY_THUMB_DESKTOP_MAX);
  }
  if (viewportWidth >= 768) {
    return Math.min(imageCount, PDP_GALLERY_THUMB_TABLET_MAX);
  }
  if (viewportWidth >= 576) {
    return Math.min(imageCount, PDP_GALLERY_THUMB_LARGE_PHONE_MAX);
  }
  return Math.min(imageCount, PDP_GALLERY_THUMB_MOBILE_MAX);
}
