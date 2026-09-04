"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, changePassword } from "@platform/api-client";
import {
  getPasswordStrength,
  getPasswordValidationError,
} from "@/lib/passwordValidation";
import PasswordStrengthIndicator from "@/components/common/forms/PasswordStrengthIndicator";
import { clearLocalSession } from "@/lib/session";
import { storefrontPath } from "@/lib/paths";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountConfirmDialog from "./AccountConfirmDialog";
import { useAccountInfoGuard } from "./AccountInfoGuard";

type PendingPasswordInput = {
  currentPassword?: string;
  newPassword: string;
  idToken?: string;
};

export default function AccountPasswordSection() {
  const { user } = useAuthSession();
  const { actionsDisabled, reportState } = useAccountInfoGuard("password");
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingInput, setPendingInput] = useState<PendingPasswordInput | null>(
    null
  );

  const strength = getPasswordStrength(newPassword);
  const passwordError = getPasswordValidationError(
    newPassword,
    confirmPassword
  );
  const settingInitialPassword = Boolean(user && !user.passwordSetByUser);
  const requiresGoogleConfirmation =
    settingInitialPassword && user?.oauthProvider === "google";
  const passwordsReady =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    strength.label === "Strong" &&
    newPassword === confirmPassword;
  const canSavePassword = settingInitialPassword
    ? passwordsReady
    : passwordsReady && currentPassword.length > 0;

  const passwordDirty =
    editing && Boolean(currentPassword || newPassword || confirmPassword);

  useEffect(() => {
    reportState({ busy: submitting, dirty: passwordDirty });
  }, [passwordDirty, reportState, submitting]);

  function resetForm() {
    if (submitting) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setEditing(false);
    setConfirmOpen(false);
    setPendingInput(null);
  }

  async function savePassword(input: PendingPasswordInput) {
    setSubmitting(true);
    setError(null);

    try {
      await changePassword(input);
      await clearLocalSession();
      window.dispatchEvent(new Event("auth:session-updated"));
      const query = settingInitialPassword
        ? "passwordSet=1"
        : "passwordChanged=1";
      window.location.href = storefrontPath(`/signin?${query}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update your password."
      );
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
      setPendingInput(null);
    }
  }

  function requestPasswordSave(input: PendingPasswordInput) {
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (requiresGoogleConfirmation && !input.idToken) {
      setError("Confirm with Google to save your password.");
      return;
    }

    setError(null);
    setPendingInput(input);
    setConfirmOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (requiresGoogleConfirmation) {
      if (passwordError) {
        setError(passwordError);
      } else {
        setError("Confirm with Google to save your password.");
      }
      return;
    }

    requestPasswordSave({
      currentPassword: settingInitialPassword ? undefined : currentPassword,
      newPassword,
    });
  }

  async function handleGoogleSetPassword(
    credentialResponse: CredentialResponse
  ) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setError("Google confirmation did not return a token.");
      return;
    }

    requestPasswordSave({ newPassword, idToken });
  }

  function closeConfirmDialog() {
    if (!submitting) {
      setConfirmOpen(false);
      setPendingInput(null);
    }
  }

  function confirmPasswordChange() {
    if (!pendingInput) {
      return;
    }

    void savePassword(pendingInput);
  }

  if (!user) {
    return null;
  }

  const confirmDescription = settingInitialPassword
    ? "You will be signed out and need to sign in again with your email and new password."
    : "You will be signed out on all devices. Sign in again with your new password.";

  return (
    <>
      <div className="rbt-single-info mb--24">
        <div className="rbt-single-info-header d-flex justify-content-between align-items-center mb--12 pt--4">
          <h6 className="mb--0">Password</h6>
          {!editing ? (
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              disabled={actionsDisabled}
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
                  disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
                required
                autoComplete="new-password"
              />
            </div>
            {passwordError ? (
              <p className="rbt-text-color-danger mt--12 mb--0 b3">
                {passwordError}
              </p>
            ) : null}
            {requiresGoogleConfirmation ? (
              <>
                <p className="b3 mt--16 mb--0">
                  Confirm with Google to verify your identity, then we&apos;ll
                  save your password.
                </p>
                <div className="d-flex flex-wrap gap-2 align-items-center mt--16">
                  {canSavePassword && !submitting ? (
                    <GoogleLogin
                      onSuccess={handleGoogleSetPassword}
                      onError={() => setError("Google confirmation failed.")}
                      text="continue_with"
                    />
                  ) : (
                    <button
                      type="button"
                      className="rbt-btn rbt-btn-sm"
                      disabled
                      title="Enter matching strong passwords first"
                    >
                      Confirm with Google & save
                    </button>
                  )}
                  <button
                    type="button"
                    className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                    disabled={submitting}
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2 mt--24">
                <button
                  type="submit"
                  className="rbt-btn rbt-btn-sm"
                  disabled={submitting || !canSavePassword}
                >
                  {submitting ? "Saving…" : "Save password"}
                </button>
                <button
                  type="button"
                  className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                  disabled={submitting}
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            )}
            {error ? (
              <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
            ) : null}
          </form>
        )}
      </div>

      <AccountConfirmDialog
        confirmLabel={
          settingInitialPassword ? "Yes, set password" : "Yes, change password"
        }
        description={confirmDescription}
        error={confirmOpen ? error : null}
        iconClassName="fa-regular fa-key"
        loading={submitting}
        loadingLabel="Saving…"
        onClose={closeConfirmDialog}
        onConfirm={confirmPasswordChange}
        open={confirmOpen}
        title={
          settingInitialPassword
            ? "Set your password?"
            : "Change your password?"
        }
        titleId="change-password-confirm-title"
      />
    </>
  );
}
