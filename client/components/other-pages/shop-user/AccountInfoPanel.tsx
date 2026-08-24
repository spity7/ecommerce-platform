"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError, updateUserProfile } from "@platform/api-client";
import { getStorefrontSiteConfig } from "@/lib/site";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountInfo from "./AccountInfo";
import AccountPasswordSection from "./AccountPasswordSection";
import AccountAddressesSection from "./AccountAddressesSection";
import AccountEmailVerificationSection from "./AccountEmailVerificationSection";
import AccountAvatarSection from "./AccountAvatarSection";
import AccountDeleteSection from "./AccountDeleteSection";

export default function AccountInfoPanel() {
  const site = getStorefrontSiteConfig();

  if (!site.features.customerAuth) {
    return <AccountInfo />;
  }

  return <AccountInfoApi />;
}

function AccountInfoApi() {
  const { user, loading, refreshUser } = useAuthSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

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
    setSubmitting(true);

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      setEditing(false);
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
              <p className="b1 mb--0">{user.phone || "No phone number yet"}</p>
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
                required
              />
            </div>
            <div className="rbt-input-field-grp mt--16">
              <label className="rbt-field-label" htmlFor="profile_phone">
                Phone
              </label>
              <input
                id="profile_phone"
                className="rbt-input-field"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
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
