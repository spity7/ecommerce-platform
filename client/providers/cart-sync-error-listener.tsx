"use client";

import { useEffect } from "react";
import { useUiElement } from "@/context/uiStore";
import { registerCartSyncErrorHandler } from "@/lib/cart-sync-notify";

export function CartSyncErrorListener() {
  const { showToaster } = useUiElement();

  useEffect(() => {
    registerCartSyncErrorHandler((message) => {
      showToaster(message);
    });
  }, [showToaster]);

  return null;
}
