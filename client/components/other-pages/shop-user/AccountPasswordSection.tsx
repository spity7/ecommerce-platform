"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState, type FormEvent } from "react";
import { ApiError, changePassword } from "@platform/api-client";
import {
  getPasswordStrength,
  getPasswordValidationError,
} from "@/lib/passwordValidation";
import PasswordStrengthIndicator from "@/components/common/forms/PasswordStrengthIndicator";
import { useAuthSession } from "@/providers/auth-session-provider";

export default function AccountPasswordSection() {
  const { user } = useAuthSession();
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const passwordError = getPasswordValidationError(
    newPassword,
    confirmPassword
  );
  const settingInitialPassword = Boolean(user && !user.passwordSetByUser);
  const requiresGoogleConfirmation =
    settingInitialPassword && user?.oauthProvider === "google";

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setEditing(false);
  }

  async function savePassword(input: {
    currentPassword?: string;
    newPassword: string;
    idToken?: string;
  }) {
    setSubmitting(true);
    setError(null);

    try {
      await changePassword(input);
      resetForm();
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update your password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    await savePassword({
      currentPassword: settingInitialPassword ? undefined : currentPassword,
      newPassword,
    });
  }

  async function handleGoogleSetPassword(
    credentialResponse: CredentialResponse
  ) {
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google confirmation did not return a token.");
      return;
    }

    await savePassword({ newPassword, idToken });
  }

  if (!user) {
    return null;
  }

  return (
    <div className="rbt-single-info mb--24">
      <div className="rbt-single-info-header d-flex justify-content-between align-items-center mb--12 pt--4">
        <h6 className="mb--0">Password</h6>
        {!editing ? (
          <button
            type="button"
            className="rbt-btn rbt-btn-sm rbt-btn-secondary"
            onClick={() => setEditing(true)}
          >
            <i className="fa-light fa-pen-to-square mr--4" />
            {settingInitialPassword ? "Set password" : "Edit"}
          </button>
        ) : null}
      </div>
      {!editing ? (
        <p className="b1 mb--0">
          {settingInitialPassword ? "No password set yet." : "**********"}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          {!settingInitialPassword ? (
            <div className="rbt-input-field-grp">
              <label
                className="rbt-field-label"
                htmlFor="account_current_password"
              >
                Current password
              </label>
              <input
                id="account_current_password"
                className="rbt-input-field"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          ) : null}
          <div
            className={`rbt-input-field-grp ${settingInitialPassword ? "" : "mt--16"}`}
          >
            <label className="rbt-field-label" htmlFor="account_new_password">
              {settingInitialPassword ? "Password" : "New password"}
            </label>
            <input
              id="account_new_password"
              className="rbt-input-field"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              autoComplete="new-password"
            />
            {newPassword.length > 0 ? (
              <PasswordStrengthIndicator
                label={strength.label}
                hint={
                  strength.label === "Strong"
                    ? "Great! Your password is strong."
                    : "Use 8+ characters with mixed case, a number, and a symbol."
                }
                compact
              />
            ) : null}
          </div>
          <div className="rbt-input-field-grp mt--16">
            <label
              className="rbt-field-label"
              htmlFor="account_confirm_password"
            >
              Confirm {settingInitialPassword ? "password" : "new password"}
            </label>
            <input
              id="account_confirm_password"
              className="rbt-input-field"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {requiresGoogleConfirmation ? (
            <div className="mt--16">
              <GoogleLogin
                onSuccess={handleGoogleSetPassword}
                onError={() => setError("Google confirmation failed.")}
                text="continue_with"
              />
            </div>
          ) : (
            <div className="d-flex gap-2 mt--24">
              <button
                type="submit"
                className="rbt-btn rbt-btn-sm"
                disabled={submitting || strength.label !== "Strong"}
              >
                {submitting ? "Saving…" : "Save password"}
              </button>
              <button
                type="button"
                className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          )}
          {error ? (
            <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
          ) : null}
          {requiresGoogleConfirmation ? (
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary mt--16"
              onClick={resetForm}
            >
              Cancel
            </button>
          ) : null}
        </form>
      )}
    </div>
  );
}
