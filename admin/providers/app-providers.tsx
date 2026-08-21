"use client";

import { useEffect, type ReactNode } from "react";
import { getAccessTokenFromCookie } from "@/lib/auth";
import { tryRefreshSession } from "@/lib/refresh-session";
import { registerUnauthorizedHandler, setAccessToken } from "@platform/api-client";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const token = getAccessTokenFromCookie();
    if (token) {
      setAccessToken(token);
    }

    registerUnauthorizedHandler(tryRefreshSession);
    return () => registerUnauthorizedHandler(null);
  }, []);

  return <>{children}</>;
}
