"use client";

import type { UserDto } from "@platform/shared";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { setAccessToken, getAccessToken } from "@platform/api-client";
import { isAuthPublicPath } from "@/lib/auth-public-paths";
import { tryRefreshSession } from "@/lib/refresh-session";

type AuthSessionContextValue = {
  user: UserDto | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type SessionFetchResult = {
  user: UserDto | null;
  shouldTryRefresh: boolean;
};

async function fetchSessionUser(): Promise<SessionFetchResult> {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (response.status === 401) {
      return { user: null, shouldTryRefresh: true };
    }

    if (!response.ok) {
      return { user: null, shouldTryRefresh: false };
    }

    const user = (await response.json()) as UserDto | null;
    if (!user) {
      return { user: null, shouldTryRefresh: false };
    }

    const validUser =
      user.role === "customer" || user.role === "admin" ? user : null;
    return { user: validUser, shouldTryRefresh: false };
  } catch {
    return { user: null, shouldTryRefresh: false };
  }
}

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    let { user: sessionUser, shouldTryRefresh } = await fetchSessionUser();

    if (!sessionUser && shouldTryRefresh && (await tryRefreshSession())) {
      ({ user: sessionUser } = await fetchSessionUser());
    }

    if (sessionUser && !getAccessToken()) {
      await tryRefreshSession();
    }

    if (!sessionUser) {
      setAccessToken(null);
    }

    setUser(sessionUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthPublicPath(pathname)) {
      setUser(null);
      setLoading(false);
      return;
    }

    void refreshUser();

    function onSessionUpdated() {
      void refreshUser();
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, [pathname, refreshUser]);

  return (
    <AuthSessionContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
