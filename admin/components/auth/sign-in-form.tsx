"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@platform/shared";
import { routes } from "@/config/routes";
import { adminBrandName } from "@/lib/brand";
import { setAuthCookies } from "@/lib/auth";
import { getApiBaseUrl, setAccessToken } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";

export function SignInForm() {
  const router = useRouter();
  const { refreshUser } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = (await response.json()) as AuthResponse & {
        error?: string;
      };

      if (!response.ok) {
        setError(body.error ?? "Sign in failed");
        return;
      }

      if (!body.accessToken || !body.refreshToken) {
        setError("Invalid response from server");
        return;
      }

      if (body.user?.role !== "admin") {
        setError("Admin access required");
        return;
      }

      setAuthCookies(body.accessToken, body.refreshToken);
      setAccessToken(body.accessToken);
      await refreshUser();
      router.push(routes.dashboard);
      router.refresh();
    } catch {
      setError("Unable to reach the API server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card relative"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
          Welcome back
        </p>
        <h1 className="text-[26px] font-semibold text-ink-900">
          Sign in to {adminBrandName}
        </h1>
        <p className="mt-2 text-[14px] text-ink-500">
          Use your admin credentials to access the {adminBrandName} dashboard.
        </p>
      </div>

      <div className="mt-6 space-y-4">
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
        <label className="block">
          <span className="text-[14px] font-semibold text-ink-700">
            Password
          </span>
          <input
            autoComplete="current-password"
            className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
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
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
