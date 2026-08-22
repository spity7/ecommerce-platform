"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { mergeGuestCart, setAccessToken, ApiError } from "@platform/api-client";
import type { AuthResponse } from "@platform/shared";
import { getOrCreateGuestCartId, clearGuestCartId } from "@/lib/guest-cart";
import { getSiteChromeBranding } from "@/lib/site-branding";

export function StorefrontSignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || undefined,
        }),
      });
      const body = (await response.json()) as AuthResponse & {
        error?: string;
      };

      if (!response.ok || !body.accessToken) {
        setError(body.error ?? "Registration failed. Please try again.");
        return;
      }

      setAccessToken(body.accessToken);

      const guestSessionId = getOrCreateGuestCartId();
      if (guestSessionId) {
        try {
          await mergeGuestCart(guestSessionId);
          clearGuestCartId();
        } catch {
          // Cart merge is best-effort after registration.
        }
      }

      window.dispatchEvent(new Event("auth:session-updated"));
      router.push("/account-info");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rbt-input-field-grp">
        <label className="rbt-field-label" htmlFor="signup_name">
          Full name <span className="rbt-text-color-danger">*</span>
        </label>
        <input
          className="rbt-input-field"
          type="text"
          id="signup_name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </div>
      <div className="rbt-input-field-grp mt--16">
        <label className="rbt-field-label" htmlFor="signup_email">
          Email <span className="rbt-text-color-danger">*</span>
        </label>
        <input
          className="rbt-input-field"
          type="email"
          id="signup_email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="rbt-input-field-grp mt--16">
        <label className="rbt-field-label" htmlFor="signup_phone">
          Phone
        </label>
        <input
          className="rbt-input-field"
          type="tel"
          id="signup_phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
        />
      </div>
      <div className="rbt-input-field-grp mt--16">
        <label className="rbt-field-label" htmlFor="signup_password">
          Password <span className="rbt-text-color-danger">*</span>
        </label>
        <input
          className="rbt-input-field"
          type="password"
          id="signup_password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error ? (
        <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
      ) : null}
      <button
        type="submit"
        className="rbt-btn d-block w-100 mt--24 mb--16"
        disabled={submitting}
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>
      <div className="rbt-login-system-switch rbt-link-hover">
        Already have an account?{" "}
        <Link className="rbt-switch-btn ml--4" href="/signin">
          <span>Sign in</span>
        </Link>
      </div>
    </form>
  );
}

export function StorefrontSignUpShell() {
  const { siteName: brandName, logo } = getSiteChromeBranding();

  return (
    <div className="rbt-login-form-top">
      <div className="logo">
        <Link href="/">
          <Image
            alt={`${brandName} logo`}
            src={logo}
            width={1487}
            height={334}
          />
        </Link>
      </div>
      <h6 className="rbt-title rbt-text-bold mb--16">
        Create your {brandName} account
      </h6>
      <StorefrontSignUpForm />
    </div>
  );
}
