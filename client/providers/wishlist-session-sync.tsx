"use client";

import { useEffect } from "react";
import { getAccessToken } from "@platform/api-client";
import {
  isServerWishlistEnabled,
  loadServerWishlist,
} from "@/lib/wishlist-sync";
import { applyPendingWishlistAfterAuth } from "@/lib/pending-wishlist";
import { useStore } from "@/context/store";
import { useAuthSession } from "@/providers/auth-session-provider";

function applyServerWishlistToStore(
  serverWishlist: Awaited<ReturnType<typeof loadServerWishlist>>
): void {
  if (!serverWishlist) {
    return;
  }

  useStore.setState({ wishList: serverWishlist });
}

export function WishlistSessionSync() {
  const { user, loading } = useAuthSession();

  useEffect(() => {
    if (loading || !isServerWishlistEnabled()) {
      return;
    }

    if (!user) {
      useStore.setState({ wishList: [] });
      return;
    }

    void (async () => {
      await applyPendingWishlistAfterAuth();
      void loadServerWishlist().then(applyServerWishlistToStore);
    })();
  }, [user, loading]);

  useEffect(() => {
    function onSessionUpdated() {
      if (!isServerWishlistEnabled()) {
        return;
      }

      const isAuthenticated = Boolean(getAccessToken());
      if (!isAuthenticated) {
        useStore.setState({ wishList: [] });
        return;
      }

      void (async () => {
        await applyPendingWishlistAfterAuth();
        void loadServerWishlist().then(applyServerWishlistToStore);
      })();
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, []);

  return null;
}
