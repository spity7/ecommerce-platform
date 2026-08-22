"use client";

import { useState, type FormEvent } from "react";
import { ApiError, changePassword } from "@platform/api-client";
import {
  getPasswordStrength,
  getPasswordValidationError,
} from "@/lib/passwordValidation";
import PasswordStrengthIndicator from "@/components/common/forms/PasswordStrengthIndicator";

export default function AccountPasswordSection() {
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

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      resetForm();
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
            Edit
          </button>
        ) : null}
      </div>
      {!editing ? (
        <p className="b1 mb--0">**********</p>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <div className="rbt-input-field-grp mt--16">
            <label className="rbt-field-label" htmlFor="account_new_password">
              New password
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
              Confirm new password
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
          {error ? (
            <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
          ) : null}
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
        </form>
      )}
    </div>
  );
}
