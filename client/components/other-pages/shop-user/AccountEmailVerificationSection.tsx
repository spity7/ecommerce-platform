"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, requestEmailVerification } from "@platform/api-client";
import { useUiElement } from "@/context/uiStore";
import { useAuthSession } from "@/providers/auth-session-provider";
import { useAccountInfoGuard } from "./AccountInfoGuard";

export default function AccountEmailVerificationSection() {
  const { showToaster } = useUiElement();
  const { user } = useAuthSession();
  const { actionsDisabled, reportState } = useAccountInfoGuard("email-verify");
  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    reportState({ busy: sending, dirty: false });
  }, [reportState, sending]);

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

  async function handleSendLink() {
    setSending(true);
    setError(null);
    setDevVerifyUrl(null);

    try {
      const result = await requestEmailVerification();
      if (result.devVerificationToken) {
        setDevVerifyUrl(
          `/verify-email?token=${encodeURIComponent(result.devVerificationToken)}`
        );
      }
      setSent(true);
      showToaster("Verification link sent");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send a verification link."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rbt-single-info mb--24">
      <h6 className="mb--12 pt--4">Email verification</h6>
      <p className="b3 mb--12">
        Verify {user.email} to secure your account and receive order updates.
      </p>
      {sent ? (
        <p className="b3 mb--12">
          <i className="fa-regular fa-envelope mr--4" />
          Check your inbox for a verification link. It expires in 15 minutes.
        </p>
      ) : null}
      {devVerifyUrl ? (
        <p className="b3 mb--12" style={{ color: "#0d6efd" }}>
          Dev verification link:{" "}
          <Link href={devVerifyUrl}>
            <strong>Open verify page</strong>
          </Link>
        </p>
      ) : null}
      <div className="d-flex flex-wrap gap-2 mb--12">
        <button
          type="button"
          className="rbt-btn rbt-btn-sm rbt-btn-secondary"
          disabled={actionsDisabled || sending}
          onClick={handleSendLink}
        >
          {sending
            ? "Sending…"
            : sent
              ? "Resend link"
              : "Send verification link"}
        </button>
      </div>
      {error ? (
        <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
      ) : null}
    </div>
  );
}
