"use client";

import { useEffect } from "react";
import {
  isServerWishlistEnabled,
  loadServerWishlist,
} from "@/lib/wishlist-sync";
import { applyPendingWishlistAfterAuth } from "@/lib/pending-wishlist";
import {
  applyServerWishlistToStoreWhenIdle,
  useStore,
} from "@/context/store";
import {
  isWishlistAuthenticated,
  waitForAuthSessionReady,
} from "@/lib/auth-session-state";
import { useAuthSession } from "@/providers/auth-session-provider";

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
      const serverWishlist = await loadServerWishlist();
      if (serverWishlist) {
        applyServerWishlistToStoreWhenIdle(serverWishlist);
      }
    })();
  }, [user, loading]);

  useEffect(() => {
    function onSessionUpdated() {
      if (!isServerWishlistEnabled()) {
        return;
      }

      void (async () => {
        await waitForAuthSessionReady();

        if (!isWishlistAuthenticated()) {
          useStore.setState({ wishList: [] });
          return;
        }

        await applyPendingWishlistAfterAuth();
        const serverWishlist = await loadServerWishlist();
        if (serverWishlist) {
          applyServerWishlistToStoreWhenIdle(serverWishlist);
        }
      })();
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, []);

  return null;
}
