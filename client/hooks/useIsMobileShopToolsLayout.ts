"use client";

import { useSyncExternalStore } from "react";

const MOBILE_SHOP_TOOLS_QUERY = "(max-width: 767px)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_SHOP_TOOLS_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_SHOP_TOOLS_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobileShopToolsLayout(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
