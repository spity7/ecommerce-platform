"use client";

import { useEffect, type ReactNode } from "react";
import { routes } from "@/config/routes";
import { tryRefreshSession } from "@/lib/refresh-session";
import { clearSessionAndRedirectToSignIn } from "@/lib/session";
import { AuthSessionProvider } from "@/providers/auth-session-provider";
import { registerUnauthorizedHandler } from "@platform/api-client";

type AppProvidersProps = {
  children: ReactNode;
};

function isAuthPublicPath(pathname: string): boolean {
  return (
    pathname === routes.signIn ||
    pathname === routes.forgotPassword ||
    pathname.startsWith(`${routes.signIn}/`) ||
    pathname.startsWith(`${routes.forgotPassword}/`)
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      const refreshed = await tryRefreshSession();
      if (
        !refreshed &&
        typeof window !== "undefined" &&
        !isAuthPublicPath(window.location.pathname)
      ) {
        await clearSessionAndRedirectToSignIn();
      }
      return refreshed;
    });
  }, []);

  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
