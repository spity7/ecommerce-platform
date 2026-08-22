"use client";

import { useEffect, type ReactNode } from "react";
import {
  registerUnauthorizedHandler,
  setAccessToken,
  setGuestCartId,
} from "@platform/api-client";
import { getAccessTokenFromCookie } from "@/lib/auth";
import { getOrCreateGuestCartId } from "@/lib/guest-cart";
import { tryRefreshSession } from "@/lib/refresh-session";
import { clearSessionAndRedirectToSignIn } from "@/lib/session";
import { loadServerCart } from "@/lib/cart-sync";
import { useStore } from "@/context/store";
import { AuthSessionProvider } from "@/providers/auth-session-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const token = getAccessTokenFromCookie();
    if (token) {
      setAccessToken(token);
    }

    setGuestCartId(getOrCreateGuestCartId());

    registerUnauthorizedHandler(async () => {
      const refreshed = await tryRefreshSession();
      if (!refreshed) {
        clearSessionAndRedirectToSignIn();
      }
      return refreshed;
    });

    void loadServerCart().then((serverCart) => {
      if (serverCart) {
        useStore.setState({
          cartProducts: serverCart,
          totalPrice: serverCart.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          ),
        });
      }
    });

    function onSessionUpdated() {
      void loadServerCart().then((serverCart) => {
        if (serverCart) {
          useStore.setState({
            cartProducts: serverCart,
            totalPrice: serverCart.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
            ),
          });
        }
      });
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
