"use client";

import { useEffect, type ReactNode } from "react";
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

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    void tryRefreshSession();

    registerUnauthorizedHandler(async () => {
      const refreshed = await tryRefreshSession();
      if (!refreshed) {
        await clearSessionAndRedirectToSignIn();
      }
      return refreshed;
    });
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
