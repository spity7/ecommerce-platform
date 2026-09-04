"use client";

import { useEffect } from "react";
import { useUiElement } from "@/context/uiStore";
import { registerWishlistSyncErrorHandler } from "@/lib/wishlist-sync-notify";

export function WishlistSyncErrorListener() {
  const { showToaster } = useUiElement();

  useEffect(() => {
    registerWishlistSyncErrorHandler((message) => {
      showToaster(message);
    });
  }, [showToaster]);

  return null;
}
