"use client";

import { useEffect, useState } from "react";
import {
  getPdpThumbSlidesPerView,
  PDP_GALLERY_THUMB_DESKTOP_MAX,
} from "@/lib/product-card-image";

export type PdpThumbStripLayout = {
  showNavigation: boolean;
  slidesPerView: number;
};

function getThumbStripLayout(imageCount: number, viewportWidth: number): PdpThumbStripLayout {
  const slidesPerView = getPdpThumbSlidesPerView(imageCount, viewportWidth);
  return {
    slidesPerView,
    showNavigation: imageCount > slidesPerView,
  };
}

function getInitialThumbStripLayout(imageCount: number): PdpThumbStripLayout {
  if (typeof window === "undefined") {
    const slidesPerView = Math.min(imageCount, PDP_GALLERY_THUMB_DESKTOP_MAX);
    return {
      slidesPerView,
      showNavigation: imageCount > slidesPerView,
    };
  }
  return getThumbStripLayout(imageCount, window.innerWidth);
}

/** Layout for the PDP thumb row (visible slots + whether prev/next is needed). */
export function usePdpThumbStripLayout(imageCount: number): PdpThumbStripLayout {
  const [layout, setLayout] = useState(() => getInitialThumbStripLayout(imageCount));

  useEffect(() => {
    const update = () => {
      setLayout(getThumbStripLayout(imageCount, window.innerWidth));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [imageCount]);

  return layout;
}

/** True when the thumb strip has more images than fit in the current viewport row. */
export function usePdpThumbNavVisible(imageCount: number): boolean {
  return usePdpThumbStripLayout(imageCount).showNavigation;
}
