"use client";

import { useEffect } from "react";
import { getAccessToken, setGuestCartId } from "@platform/api-client";
import { clearGuestCartId, getOrCreateGuestCartId } from "@/lib/guest-cart";
import { loadServerCart } from "@/lib/cart-sync";
import { useStore } from "@/context/store";
import { useAuthSession } from "@/providers/auth-session-provider";

function applyServerCartToStore(
  serverCart: Awaited<ReturnType<typeof loadServerCart>>
): void {
  if (!serverCart) {
    return;
  }

  useStore.setState({
    cartProducts: serverCart,
    totalPrice: serverCart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ),
  });
}

function syncGuestCartIdForSession(isAuthenticated: boolean): void {
  if (isAuthenticated) {
    clearGuestCartId();
    return;
  }

  setGuestCartId(getOrCreateGuestCartId());
}

export function CartSessionSync() {
  const { user, loading } = useAuthSession();

  useEffect(() => {
    if (loading) {
      return;
    }

    syncGuestCartIdForSession(Boolean(user));
    void loadServerCart().then(applyServerCartToStore);
  }, [user, loading]);

  useEffect(() => {
    function onSessionUpdated() {
      const isAuthenticated = Boolean(getAccessToken());
      syncGuestCartIdForSession(isAuthenticated);
      void loadServerCart().then(applyServerCartToStore);
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, []);

  return null;
}
