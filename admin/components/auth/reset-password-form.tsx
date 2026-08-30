"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiError, resetPassword } from "@platform/api-client";
import { routes } from "@/config/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

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
      await resetPassword({ token, newPassword });
      setDone(true);
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

  if (done) {
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

  if (!token) {
    return (
      <div className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
        <h1 className="text-[26px] font-semibold text-ink-900">
          Invalid reset link
        </h1>
        <p className="mt-2 text-[14px] text-ink-500">
          This reset link is invalid or has expired. Request a new one from the
          forgot password page.
        </p>
        <Link
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-base bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700"
          href={routes.forgotPassword}
        >
          Request new link
        </Link>
      </div>
    );
  }

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
          Choose a new password
        </h1>
      </div>

      <div className="mt-6 space-y-4">
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
