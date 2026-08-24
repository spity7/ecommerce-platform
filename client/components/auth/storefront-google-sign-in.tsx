"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, mergeGuestCart, setAccessToken } from "@platform/api-client";
import type { AuthResponse } from "@platform/shared";
import { clearGuestCartId, getOrCreateGuestCartId } from "@/lib/guest-cart";

export default function StorefrontGoogleSignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google sign-in did not return a token.");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ provider: "google", idToken }),
      });
      const body = (await response.json()) as AuthResponse & { error?: string };

      if (!response.ok || !body.accessToken) {
        setError(body.error ?? "Google sign-in failed.");
        return;
      }

      setAccessToken(body.accessToken);

      const guestSessionId = getOrCreateGuestCartId();
      if (guestSessionId) {
        try {
          await mergeGuestCart(guestSessionId);
          clearGuestCartId();
        } catch {
          // Cart merge is best-effort after login.
        }
      }

      window.dispatchEvent(new Event("auth:session-updated"));
      router.push("/account-info");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Google sign-in failed. Please try again."
      );
    }
  }

  return (
    <div className="mt--16">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError("Google sign-in failed.")}
        text="signin_with"
        width="100%"
      />
      {error ? (
        <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
      ) : null}
    </div>
  );
}
