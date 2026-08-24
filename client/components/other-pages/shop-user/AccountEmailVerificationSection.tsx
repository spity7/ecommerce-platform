"use client";

import { useState } from "react";
import {
  ApiError,
  requestEmailVerification,
  verifyEmail,
} from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";

export default function AccountEmailVerificationSection() {
  const { user, refreshUser } = useAuthSession();
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user) {
    return null;
  }

  if (user.emailVerified) {
    return (
      <div className="rbt-single-info mb--24">
        <h6 className="mb--12 pt--4">Email verification</h6>
        <p className="b1 mb--0">
          <i className="fa-regular fa-circle-check mr--4" />
          Your email is verified.
        </p>
      </div>
    );
  }

  async function handleSendCode() {
    setSending(true);
    setError(null);
    setDevCode(null);

    try {
      const result = await requestEmailVerification();
      setDevCode(result.devVerificationCode ?? null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send a verification code."
      );
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    if (!code.trim()) {
      setError("Enter the verification code from your email.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await verifyEmail(code.trim());
      await refreshUser();
      setCode("");
      setDevCode(null);
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not verify your email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rbt-single-info mb--24">
      <h6 className="mb--12 pt--4">Email verification</h6>
      <p className="b3 mb--12">
        Verify {user.email} to secure your account and receive order updates.
      </p>
      {devCode ? (
        <p className="b3 mb--12" style={{ color: "#0d6efd" }}>
          Dev verification code: <strong>{devCode}</strong>
        </p>
      ) : null}
      <div className="d-flex flex-wrap gap-2 mb--12">
        <button
          type="button"
          className="rbt-btn rbt-btn-sm rbt-btn-secondary"
          onClick={handleSendCode}
          disabled={sending}
        >
          {sending ? "Sending…" : "Send code"}
        </button>
      </div>
      <div className="rbt-input-field-grp">
        <label className="rbt-field-label" htmlFor="verify_email_code">
          Verification code
        </label>
        <input
          id="verify_email_code"
          className="rbt-input-field"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          maxLength={6}
        />
      </div>
      {error ? (
        <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
      ) : null}
      <button
        type="button"
        className="rbt-btn rbt-btn-sm mt--16"
        onClick={handleVerify}
        disabled={submitting}
      >
        {submitting ? "Verifying…" : "Verify email"}
      </button>
    </div>
  );
}
