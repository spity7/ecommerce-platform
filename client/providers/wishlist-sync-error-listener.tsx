"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUiElement } from "@/context/uiStore";
import {
  consumeWishlistAppliedToast,
  WISHLIST_APPLIED_MESSAGE,
} from "@/lib/pending-wishlist";
import { registerWishlistSyncErrorHandler } from "@/lib/wishlist-sync-notify";

export function WishlistSyncErrorListener() {
  const pathname = usePathname();
  const { showToaster } = useUiElement();

  useEffect(() => {
    registerWishlistSyncErrorHandler((message) => {
      showToaster(message);
    });
  }, [showToaster]);

  useEffect(() => {
    if (consumeWishlistAppliedToast()) {
      showToaster(WISHLIST_APPLIED_MESSAGE);
    }
  }, [pathname, showToaster]);

  return null;
}
