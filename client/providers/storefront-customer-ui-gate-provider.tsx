"use client";

import type { UserDto } from "@platform/shared";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAuthSessionSnapshot } from "@/lib/auth-session-state";
import { tryRefreshSession } from "@/lib/refresh-session";
import { getStorefrontSiteConfig } from "@/lib/site";
import { isStorefrontAdminSession } from "@/lib/storefront-customer-access";
import { useAuthSession } from "@/providers/auth-session-provider";

type StorefrontCustomerUiGateValue = {
  blocked: boolean;
  resolving: boolean;
  refreshSession: () => Promise<void>;
};

const StorefrontCustomerUiGateContext =
  createContext<StorefrontCustomerUiGateValue | null>(null);

function normalizeSessionUser(
  user: UserDto | null | undefined
): UserDto | null {
  if (!user) {
    return null;
  }
  return user.role === "customer" || user.role === "admin" ? user : null;
}

async function fetchSessionUserFromBff(): Promise<UserDto | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    if (await tryRefreshSession()) {
      return fetchSessionUserFromBff();
    }
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as UserDto | null;
  const user = normalizeSessionUser(body);
  if (user) {
    return user;
  }

  if (await tryRefreshSession()) {
    const retry = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (!retry.ok) {
      return null;
    }
    const retryBody = (await retry.json()) as UserDto | null;
    return normalizeSessionUser(retryBody);
  }

  return null;
}

export function StorefrontCustomerUiGateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const site = getStorefrontSiteConfig();
  const customerAuth = site.features.customerAuth;
  const { user, loading: contextLoading } = useAuthSession();
  const [verifiedUser, setVerifiedUser] = useState<UserDto | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(customerAuth);

  const syncVerifiedUser = useCallback(async () => {
    if (!customerAuth) {
      setVerifiedUser(null);
      setVerifyLoading(false);
      return;
    }

    setVerifyLoading(true);
    try {
      setVerifiedUser(await fetchSessionUserFromBff());
    } catch {
      setVerifiedUser(null);
    } finally {
      setVerifyLoading(false);
    }
  }, [customerAuth]);

  useEffect(() => {
    void syncVerifiedUser();

    function onSessionUpdated() {
      void syncVerifiedUser();
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, [syncVerifiedUser]);

  if (!customerAuth) {
    return (
      <StorefrontCustomerUiGateContext.Provider
        value={{
          blocked: false,
          resolving: false,
          refreshSession: async () => {},
        }}
      >
        {children}
      </StorefrontCustomerUiGateContext.Provider>
    );
  }

  const snapshot = getAuthSessionSnapshot();
  const resolvedUser = user ?? verifiedUser ?? snapshot.user ?? null;
  const resolving =
    (contextLoading || snapshot.loading || verifyLoading) && !resolvedUser;

  return (
    <StorefrontCustomerUiGateContext.Provider
      value={{
        blocked: isStorefrontAdminSession(resolvedUser),
        resolving,
        refreshSession: syncVerifiedUser,
      }}
    >
      {children}
    </StorefrontCustomerUiGateContext.Provider>
  );
}

export function useStorefrontCustomerUiGate(): StorefrontCustomerUiGateValue {
  const context = useContext(StorefrontCustomerUiGateContext);
  if (!context) {
    throw new Error(
      "useStorefrontCustomerUiGate must be used within StorefrontCustomerUiGateProvider"
    );
  }
  return context;
}
