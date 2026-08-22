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
import { setAccessToken } from "@platform/api-client";
import { tryRefreshSession } from "@/lib/refresh-session";

type AuthSessionContextValue = {
  user: UserDto | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

async function fetchSessionUser(): Promise<UserDto | null> {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as UserDto;
    return user.role === "admin" ? user : null;
  } catch {
    return null;
  }
}

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    let sessionUser = await fetchSessionUser();

    if (!sessionUser && (await tryRefreshSession())) {
      sessionUser = await fetchSessionUser();
    }

    if (!sessionUser) {
      setAccessToken(null);
    }

    setUser(sessionUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshUser();

    function onSessionUpdated() {
      void refreshUser();
    }

    window.addEventListener("auth:session-updated", onSessionUpdated);
    return () => {
      window.removeEventListener("auth:session-updated", onSessionUpdated);
    };
  }, [refreshUser]);

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
