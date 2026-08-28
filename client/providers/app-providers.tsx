"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, type ReactNode } from "react";
import {
  registerUnauthorizedHandler,
  setAccessToken,
  setGuestCartId,
} from "@platform/api-client";
import { tryRefreshSession } from "@/lib/refresh-session";
import { clearSessionAndRedirectToSignIn } from "@/lib/session";
import { getOrCreateGuestCartId } from "@/lib/guest-cart";
import { loadServerCart } from "@/lib/cart-sync";
import { useStore } from "@/context/store";
import { AuthSessionProvider } from "@/providers/auth-session-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    setGuestCartId(getOrCreateGuestCartId());

    registerUnauthorizedHandler(async () => {
      const refreshed = await tryRefreshSession();
      if (!refreshed) {
        await clearSessionAndRedirectToSignIn();
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

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const session = <AuthSessionProvider>{children}</AuthSessionProvider>;

  if (!googleClientId) {
    return session;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {session}
    </GoogleOAuthProvider>
  );
}
