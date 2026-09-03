"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ApiError, updateUserProfile } from "@platform/api-client";
import {
  formatPhoneForDisplay,
  getPhoneValidationError,
} from "@platform/shared";
import { useUiElement } from "@/context/uiStore";
import { getStorefrontSiteConfig } from "@/lib/site";
import { getStorefrontDefaultPhoneCountry } from "@/lib/phone";
import StorefrontPhoneInput from "@/components/forms/phone-input";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountInfo from "./AccountInfo";
import AccountPasswordSection from "./AccountPasswordSection";
import AccountAddressesSection from "./AccountAddressesSection";
import AccountEmailVerificationSection from "./AccountEmailVerificationSection";
import AccountAvatarSection from "./AccountAvatarSection";
import AccountDeleteSection from "./AccountDeleteSection";
import { useAccountInfoGuard } from "./AccountInfoGuard";

export default function AccountInfoPanel() {
  const site = getStorefrontSiteConfig();

  if (!site.features.customerAuth) {
    return <AccountInfo />;
  }

  return (
    <AccountInfoApi />
  );
}

function AccountInfoApi() {
  const { showToaster } = useUiElement();
  const { user, loading, refreshUser } = useAuthSession();
  const { actionsDisabled, reportState } = useAccountInfoGuard("profile");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const defaultPhoneCountry = getStorefrontDefaultPhoneCountry();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1") {
      setShowVerifyPrompt(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("verify");
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const profileDirty = useMemo(() => {
    if (!user || !editing) {
      return false;
    }

    return (
      name.trim() !== user.name.trim() ||
      (phone.trim() || "") !== (user.phone ?? "").trim()
    );
  }, [editing, name, phone, user]);

  useEffect(() => {
    reportState({ busy: submitting, dirty: profileDirty });
  }, [profileDirty, reportState, submitting]);

  if (loading) {
    return <p className="mb--0">Loading profile…</p>;
  }

  if (!user) {
    return (
      <p className="mb--0">
        Sign in to view and update your account information.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPhoneError(null);

    const nextPhoneError = getPhoneValidationError(phone);
    if (nextPhoneError) {
      setPhoneError(nextPhoneError);
      return;
    }

    setSubmitting(true);

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      setEditing(false);
      showToaster("Profile updated");
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update your profile."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rbt-profile-content-area">
      {showVerifyPrompt && user && !user.emailVerified ? (
        <div className="rbt-transparent-table-one-wrapper rbt-has-bg-gray p--24 mb--24">
          <h6 className="mb--8">Verify your email</h6>
          <p className="b3 mb--12">
            We sent a verification link to <strong>{user.email}</strong>. Check
            your inbox to verify your account and place orders.
          </p>
          <button
            className="rbt-btn rbt-btn-sm rbt-btn-secondary"
            disabled={actionsDisabled}
            onClick={() => setShowVerifyPrompt(false)}
            type="button"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <div className="row row--12 mt_dec--24">
        <div className="col-12 mt--24">
          <div className="rbt-component-section-title rbt-gap--4 mb--0 p-0 border-0">
            <h2 className="rbt-title mb--0">
              <span className="rbt-text-bold">Personal Information</span>
            </h2>
          </div>
        </div>
      </div>
      <hr className="mt--20 mb--16" />
      <div className="rbt-scrollable-content hide-scrollbar">
        {!editing ? (
          <>
            <div className="rbt-single-info mb--24">
              <div className="rbt-single-info-header d-flex justify-content-between align-items-center mb--12 pt--4">
                <h6 className="mb--0">Basic Info</h6>
                <button
                  type="button"
                  className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                  disabled={actionsDisabled}
                  onClick={() => setEditing(true)}
                >
                  <i className="fa-light fa-pen-to-square mr--4" />
                  Edit
                </button>
              </div>
              <p className="b1 rbt-text-medium mb--8">{user.name}</p>
              <p className="b1 mb--0">{user.email}</p>
              {!user.emailVerified ? (
                <p className="b3 mt--8 mb--0">Email not verified yet.</p>
              ) : null}
            </div>
            <hr />
            <AccountAvatarSection />
            <hr />
            <div className="rbt-single-info mb--24">
              <h6 className="mb--12 pt--4">Contact</h6>
              <p className="b1 mb--0">
                {user.phone
                  ? formatPhoneForDisplay(user.phone)
                  : "No phone number yet"}
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="rbt-input-field-grp">
              <label className="rbt-field-label" htmlFor="profile_name">
                Full name
              </label>
              <input
                id="profile_name"
                className="rbt-input-field"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div className="mt--16">
              <StorefrontPhoneInput
                id="profile_phone"
                label="Phone"
                value={phone}
                onChange={(nextValue) => {
                  setPhone(nextValue);
                  setPhoneError(getPhoneValidationError(nextValue));
                }}
                defaultCountry={defaultPhoneCountry}
                disabled={submitting}
                error={phoneError}
              />
            </div>
            <p className="b3 mt--12 mb--0">Email: {user.email}</p>
            {error ? (
              <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
            ) : null}
            <div className="d-flex gap-2 mt--24">
              <button
                type="submit"
                className="rbt-btn rbt-btn-sm"
                disabled={submitting}
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                disabled={submitting}
                onClick={() => {
                  setName(user.name);
                  setPhone(user.phone ?? "");
                  setEditing(false);
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <hr className="mt--24" />
        <AccountEmailVerificationSection />
        <hr />
        <AccountPasswordSection />
        <hr />
        <AccountAddressesSection />
        <hr />
        <AccountDeleteSection />
      </div>
    </div>
  );
}
