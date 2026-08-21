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
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
