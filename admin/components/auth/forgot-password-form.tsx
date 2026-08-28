"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, forgotPassword, resetPassword } from "@platform/api-client";
import { routes } from "@/config/routes";
import { adminBrandName } from "@/lib/brand";

type Step = "request" | "reset" | "done";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email.trim());
      setDevCodeHint(result.devResetCode ?? null);
      setStep("reset");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not send a verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });
      setStep("done");
      setTimeout(() => {
        router.push(routes.signIn);
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not reset your password."
      );
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
        <h1 className="text-[26px] font-semibold text-ink-900">
          Password updated
        </h1>
        <p className="mt-2 text-[14px] text-ink-500">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <form
        className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
        onSubmit={handleResetPassword}
      >
        <div>
          <p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
            Reset password
          </p>
          <h1 className="text-[26px] font-semibold text-ink-900">
            Enter verification code
          </h1>
          <p className="mt-2 text-[14px] text-ink-500">
            We sent a 6-digit code to <strong>{email}</strong>.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Code</span>
            <input
              autoComplete="one-time-code"
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              required
              value={code}
            />
          </label>
          {devCodeHint ? (
            <p className="text-[13px] text-ink-500">
              Dev code: <code>{devCodeHint}</code>
            </p>
          ) : null}
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              New password
            </span>
            <input
              autoComplete="new-password"
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
              minLength={8}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="password"
              value={newPassword}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Confirm password
            </span>
            <input
              autoComplete="new-password"
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
              minLength={8}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-[14px] text-danger-600">{error}</p>
        ) : null}

        <button
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-base bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    );
  }

  return (
    <form
      className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
      onSubmit={handleSendCode}
    >
      <div>
        <p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
          Forgot password
        </p>
        <h1 className="text-[26px] font-semibold text-ink-900">
          Reset {adminBrandName} access
        </h1>
        <p className="mt-2 text-[14px] text-ink-500">
          Enter the email for your admin account. We will send a verification
          code when SMTP is configured.
        </p>
      </div>

      <div className="mt-6">
        <label className="block">
          <span className="text-[14px] font-semibold text-ink-700">
            Email address
          </span>
          <input
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-[14px] text-danger-600">{error}</p>
      ) : null}

      <button
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-base bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Sending…" : "Send verification code"}
      </button>

      <p className="mt-4 text-center text-[14px] text-ink-500">
        <Link
          className="font-semibold text-brand-600 hover:text-brand-700"
          href={routes.signIn}
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
