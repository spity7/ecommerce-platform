"use client";

import { useEffect, type ReactNode } from "react";
import { getAccessTokenFromCookie } from "@/lib/auth";
import { tryRefreshSession } from "@/lib/refresh-session";
import { clearSessionAndRedirectToSignIn } from "@/lib/session";
import { AuthSessionProvider } from "@/providers/auth-session-provider";
import {
  registerUnauthorizedHandler,
  setAccessToken,
} from "@platform/api-client";

type AppProvidersProps = {
  children: ReactNode;
};

async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await tryRefreshSession();
  if (refreshed) {
    window.dispatchEvent(new Event("auth:session-updated"));
    return true;
  }
  clearSessionAndRedirectToSignIn();
  return false;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const token = getAccessTokenFromCookie();
    if (token) {
      setAccessToken(token);
    }

    registerUnauthorizedHandler(handleUnauthorized);
    return () => registerUnauthorizedHandler(null);
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
