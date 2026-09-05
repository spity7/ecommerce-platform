import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { UserDto } from "@platform/shared";
import {
  getAuthSessionSnapshot,
  isWishlistAuthenticated,
  setAuthSessionSnapshot,
  waitForAuthSessionReady,
} from "../lib/auth-session-state";

const testUser: UserDto = {
  id: "u1",
  name: "Test User",
  email: "a@b.com",
  role: "customer",
  emailVerified: true,
  passwordSetByUser: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("auth session state", () => {
  it("resolves waitForAuthSessionReady when loading completes", async () => {
    setAuthSessionSnapshot({ user: null, loading: true });

    const readyPromise = waitForAuthSessionReady();
    setAuthSessionSnapshot({
      user: testUser,
      loading: false,
    });

    const snapshot = await readyPromise;
    assert.equal(snapshot.loading, false);
    assert.equal(snapshot.user?.id, "u1");
    assert.equal(isWishlistAuthenticated(), true);
    assert.equal(getAuthSessionSnapshot().loading, false);
  });
});
