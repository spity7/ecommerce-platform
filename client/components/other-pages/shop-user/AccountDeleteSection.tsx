"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, deleteAccount, setAccessToken } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";

export default function AccountDeleteSection() {
  const router = useRouter();
  const { user } = useAuthSession();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const requiresGoogleConfirmation =
    !user.passwordSetByUser && user.oauthProvider === "google";

  async function completeDeletion(input: {
    password?: string;
    idToken?: string;
  }) {
    setSubmitting(true);
    setError(null);

    try {
      await deleteAccount(input);
      setAccessToken(null);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.dispatchEvent(new Event("auth:session-updated"));
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not delete your account."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordDelete() {
    if (!password) {
      setError("Enter your password to confirm account deletion.");
      return;
    }

    await completeDeletion({ password });
  }

  async function handleGoogleDelete(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google confirmation did not return a token.");
      return;
    }

    await completeDeletion({ idToken });
  }

  return (
    <div className="rbt-single-info mb--24">
      <h6 className="mb--12 pt--4">Delete account</h6>
      <p className="b3 mb--12">
        Your account will be deactivated. You can sign in again within 14 days
        to reactivate it.
      </p>
      {requiresGoogleConfirmation ? (
        <GoogleLogin
          onSuccess={handleGoogleDelete}
          onError={() => setError("Google confirmation failed.")}
          text="continue_with"
        />
      ) : (
        <>
          <div className="rbt-input-field-grp">
            <label
              className="rbt-field-label"
              htmlFor="delete_account_password"
            >
              Confirm with password
            </label>
            <input
              id="delete_account_password"
              className="rbt-input-field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="button"
            className="rbt-btn rbt-btn-sm rbt-bg-color-danger mt--16 shadow-none"
            onClick={handlePasswordDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting…" : "Delete account"}
          </button>
        </>
      )}
      {error ? (
        <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
      ) : null}
    </div>
  );
}
