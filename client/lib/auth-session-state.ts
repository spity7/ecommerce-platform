import type { UserDto } from "@platform/shared";
import { getAccessToken } from "@platform/api-client";

export type AuthSessionSnapshot = {
  user: UserDto | null;
  loading: boolean;
};

let sessionUser: UserDto | null = null;
let sessionLoading = true;
const loadingWaiters: Array<(snapshot: AuthSessionSnapshot) => void> = [];

export function setAuthSessionSnapshot(snapshot: AuthSessionSnapshot): void {
  sessionUser = snapshot.user;
  sessionLoading = snapshot.loading;

  if (!sessionLoading) {
    const waiters = loadingWaiters.splice(0);
    for (const resolve of waiters) {
      resolve({ user: sessionUser, loading: false });
    }
  }
}

export function getAuthSessionSnapshot(): AuthSessionSnapshot {
  return { user: sessionUser, loading: sessionLoading };
}

export function waitForAuthSessionReady(): Promise<AuthSessionSnapshot> {
  const snapshot = getAuthSessionSnapshot();
  if (!snapshot.loading) {
    return Promise.resolve(snapshot);
  }

  return new Promise((resolve) => {
    loadingWaiters.push(resolve);
  });
}

export function isWishlistAuthenticated(): boolean {
  return Boolean(getAccessToken() || sessionUser);
}
