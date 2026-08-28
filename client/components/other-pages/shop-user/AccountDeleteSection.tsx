"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ApiError, deleteAccount, setAccessToken } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";

export default function AccountDeleteSection() {
  const router = useRouter();
  const { user } = useAuthSession();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requiresGoogleConfirmation = Boolean(
    user && !user.passwordSetByUser && user.oauthProvider === "google"
  );

  useEffect(() => {
    if (!confirmOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        setConfirmOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [confirmOpen, submitting]);

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
    } finally {
      setSubmitting(false);
    }
  }

  function openDeleteConfirmation() {
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
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
        ) : null}
        <button
          type="button"
          className="rbt-btn rbt-btn-sm rbt-bg-color-danger mt--16 shadow-none"
          onClick={openDeleteConfirmation}
          disabled={submitting}
        >
          {submitting ? "Deleting…" : "Delete account"}
        </button>
        {error ? (
          <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
        ) : null}
      </div>

      {confirmOpen
        ? createPortal(
            <div
              aria-labelledby="delete-account-confirm-title"
              aria-modal="true"
              className="managed-bs-modal-layer is-open"
              role="dialog"
              style={{ zIndex: 1055 }}
            >
              <div
                aria-hidden
                className="modal-backdrop fade show"
                onClick={closeDeleteConfirmation}
              />
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                      <button
                        aria-label="Close"
                        className="rbt-round-btn rbt-modal-dis-btn ms-auto"
                        disabled={submitting}
                        onClick={closeDeleteConfirmation}
                        type="button"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                    <div className="modal-body pt-0 text-center">
                      <div className="mx-auto mb--16 d-flex align-items-center justify-content-center rbt-round-btn rbt-bg-color-danger opacity-75">
                        <i className="fa-regular fa-trash-can-slash" />
                      </div>
                      <h5
                        className="rbt-title mb--12"
                        id="delete-account-confirm-title"
                      >
                        Delete your account?
                      </h5>
                      <p className="b3 mb--0">
                        Your account will be deactivated immediately. You can
                        sign in again within 14 days to reactivate it.
                      </p>
                      {error ? (
                        <p className="rbt-text-color-danger mt--12 mb--0 b3">
                          {error}
                        </p>
                      ) : null}
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
                            onError={() =>
                              setError("Google confirmation failed.")
                            }
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
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
