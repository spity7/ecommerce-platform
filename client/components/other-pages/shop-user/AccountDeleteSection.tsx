"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, deleteAccount, setAccessToken } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountConfirmDialog from "./AccountConfirmDialog";
import { useAccountInfoGuard } from "./AccountInfoGuard";

export default function AccountDeleteSection() {
  const router = useRouter();
  const { user } = useAuthSession();
  const { actionsDisabled, reportState } = useAccountInfoGuard("delete-account");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requiresGoogleConfirmation = Boolean(
    user && !user.passwordSetByUser && user.oauthProvider === "google"
  );

  const deleteDirty = Boolean(password.trim()) || confirmOpen;

  useEffect(() => {
    reportState({ busy: submitting, dirty: deleteDirty });
  }, [deleteDirty, reportState, submitting]);

  if (!user) {
    return null;
  }

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
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  function openDeleteConfirmation() {
    if (submitting) {
      return;
    }

    if (!requiresGoogleConfirmation && !password) {
      setError("Enter your password to confirm account deletion.");
      return;
    }

    setError(null);
    setConfirmOpen(true);
  }

  function closeDeleteConfirmation() {
    if (!submitting) {
      setConfirmOpen(false);
    }
  }

  async function confirmPasswordDelete() {
    if (!password) {
      setError("Enter your password to confirm account deletion.");
      setConfirmOpen(false);
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
    <>
      <div className="rbt-single-info mb--24">
        <h6 className="mb--12 pt--4">Delete account</h6>
        <p className="b3 mb--12">
          Your account will be deactivated. You can sign in again within 14 days
          to reactivate it.
        </p>
        {!requiresGoogleConfirmation ? (
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
              disabled={submitting || actionsDisabled}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
        ) : null}
        <button
          type="button"
          className="rbt-btn rbt-btn-sm rbt-bg-color-danger mt--16 shadow-none"
          disabled={submitting || actionsDisabled}
          onClick={openDeleteConfirmation}
        >
          {submitting ? "Deleting…" : "Delete account"}
        </button>
        {error && !confirmOpen ? (
          <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
        ) : null}
      </div>

      <AccountConfirmDialog
        confirmLabel="Yes, delete account"
        description="Your account will be deactivated immediately. You can sign in again within 14 days to reactivate it."
        error={confirmOpen ? error : null}
        footer={
          <div className="d-flex justify-content-center rbt-gap--16 mt--24">
            <button
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              disabled={submitting}
              onClick={closeDeleteConfirmation}
              type="button"
            >
              Cancel
            </button>
            {requiresGoogleConfirmation ? (
              <GoogleLogin
                onSuccess={handleGoogleDelete}
                onError={() => setError("Google confirmation failed.")}
                text="continue_with"
              />
            ) : (
              <button
                className="rbt-btn rbt-btn-sm rbt-bg-color-danger shadow-none"
                disabled={submitting}
                onClick={() => void confirmPasswordDelete()}
                type="button"
              >
                {submitting ? "Deleting…" : "Yes, delete account"}
              </button>
            )}
          </div>
        }
        iconClassName="fa-regular fa-trash-can-slash"
        loading={submitting}
        loadingLabel="Deleting…"
        onClose={closeDeleteConfirmation}
        onConfirm={() => void confirmPasswordDelete()}
        open={confirmOpen}
        title="Delete your account?"
        titleId="delete-account-confirm-title"
        variant="danger"
      />
    </>
  );
}
