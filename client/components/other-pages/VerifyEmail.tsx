"use client";

import Link from "next/link";
import Image from "next/image";
import ReviewSlider from "./ReviewSlider";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, verifyEmail } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";
import { getStorefrontSiteConfig } from "@/lib/site";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const site = getStorefrontSiteConfig();
  if (site.features.customerAuth) {
    return <VerifyEmailApi />;
  }
  return <VerifyEmailDemo />;
}

function VerifyEmailDemo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");

  useEffect(() => {
    if (!token) {
      return;
    }
    const timer = window.setTimeout(() => {
      setState("success");
      window.setTimeout(() => router.push("/account-info"), 1500);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [router, token]);

  return <VerifyEmailLayout state={state} />;
}

function VerifyEmailApi() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { refreshUser } = useAuthSession();
  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!token || attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    void (async () => {
      try {
        await verifyEmail(token);
        await refreshUser();
        window.dispatchEvent(new Event("auth:session-updated"));
        setState("success");
        window.setTimeout(() => router.push("/account-info"), 1500);
      } catch (err) {
        setState("error");
        if (err instanceof ApiError) {
          console.error(err.message);
        }
      }
    })();
  }, [refreshUser, router, token]);

  return <VerifyEmailLayout state={state} />;
}

function VerifyEmailLayout({ state }: { state: VerifyState }) {
  return (
    <div className="rbt-component-area rbt-section-gap2Bottom rbt-section-gap2Top">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
            <div className="rbt-login-form">
              <div className="rbt-login-form-inner">
                <div className="rbt-login-form-top">
                  <div className="logo">
                    <Link href={`/`}>
                      <Image
                        alt="Ecommerce Logo Images"
                        src="/assets/images/logo/logo.webp"
                        width={1487}
                        height={334}
                      />
                    </Link>
                  </div>
                  <h6 className="rbt-title rbt-text-bold mb--16">
                    Email Verification
                  </h6>

                  {state === "loading" && (
                    <p className="rbt-description mb--0">
                      Verifying your email…
                    </p>
                  )}

                  {state === "success" && (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(25,135,84,0.1), rgba(13,110,253,0.08))",
                        border: "1px solid rgba(25,135,84,0.25)",
                        borderRadius: "12px",
                        padding: "18px 16px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center mb--8"
                        style={{ color: "#198754", fontWeight: 700 }}
                      >
                        <i className="fa-regular fa-circle-check mr--8" />
                        Email verified
                      </div>
                      <p className="rbt-description mb--0">
                        Your email is verified. Redirecting to your account…
                      </p>
                    </div>
                  )}

                  {state === "error" && (
                    <div>
                      <p className="rbt-description mb--16">
                        This verification link is invalid or has expired. You
                        can request a new one from your account settings.
                      </p>
                      <Link
                        className="rbt-btn d-block w-100 text-center mb--12"
                        href="/account-info?verify=1"
                      >
                        Go to account
                      </Link>
                      <Link
                        className="rbt-btn rbt-btn-border d-block w-100 text-center"
                        href="/signin"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                </div>
                <ReviewSlider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
