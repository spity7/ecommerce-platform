"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ApiError, updateUserProfile } from "@platform/api-client";
import { useAuthSession } from "@/providers/auth-session-provider";

export default function AccountAvatarSection() {
  const { user, refreshUser } = useAuthSession();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  function startEdit() {
    if (!user) {
      return;
    }
    setAvatarUrl(user.avatarUrl ?? "");
    setEditing(true);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await updateUserProfile({
        avatarUrl: avatarUrl.trim() || "",
      });
      await refreshUser();
      setEditing(false);
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update your avatar."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rbt-single-info mb--24">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h6 className="mb--12 pt--4">Profile photo</h6>
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={72}
              height={72}
              className="rounded-circle"
              unoptimized
            />
          ) : (
            <p className="b3 mb--0">No profile photo yet.</p>
          )}
        </div>
        {!editing ? (
          <button
            type="button"
            className="rbt-btn rbt-btn-sm rbt-btn-secondary"
            onClick={startEdit}
          >
            Edit
          </button>
        ) : null}
      </div>
      {editing ? (
        <form onSubmit={handleSubmit} className="mt--16">
          <div className="rbt-input-field-grp">
            <label className="rbt-field-label" htmlFor="profile_avatar_url">
              Image URL
            </label>
            <input
              id="profile_avatar_url"
              className="rbt-input-field"
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {error ? (
            <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
          ) : null}
          <div className="d-flex gap-2 mt--16">
            <button
              type="submit"
              className="rbt-btn rbt-btn-sm"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save photo"}
            </button>
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
