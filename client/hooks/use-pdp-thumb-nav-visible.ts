"use client";

import { useEffect, useState } from "react";
import { getPdpThumbSlidesPerView } from "@/lib/product-card-image";

function thumbNavNeeded(imageCount: number): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const visible = getPdpThumbSlidesPerView(imageCount, window.innerWidth);
  return imageCount > visible;
}

/** True when the thumb strip has more images than fit in the current viewport row. */
export function usePdpThumbNavVisible(imageCount: number): boolean {
  const [visible, setVisible] = useState(() => thumbNavNeeded(imageCount));

  useEffect(() => {
    const update = () => {
      setVisible(thumbNavNeeded(imageCount));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [imageCount]);

  return visible;
}
