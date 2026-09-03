"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ApiError,
  removeUserAvatar,
  uploadUserAvatar,
} from "@platform/api-client";
import {
  AVATAR_FILE_INPUT_ACCEPT,
  AVATAR_FORMATS_LABEL,
  AVATAR_MAX_BYTES,
  AVATAR_MAX_SIZE_LABEL,
  isAllowedAvatarUpload,
} from "@platform/shared";
import { useUiElement } from "@/context/uiStore";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountConfirmDialog from "./AccountConfirmDialog";
import { useAccountInfoGuard } from "./AccountInfoGuard";

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function validateAvatarFile(file: File): string | null {
  if (!isAllowedAvatarUpload(file)) {
    return `Choose a ${AVATAR_FORMATS_LABEL} image.`;
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return `Image must be ${AVATAR_MAX_SIZE_LABEL} or smaller.`;
  }
  return null;
}

export default function AccountAvatarSection() {
  const { showToaster } = useUiElement();
  const { user, refreshUser } = useAuthSession();
  const { actionsDisabled, reportState } = useAccountInfoGuard("avatar");
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = useMemo(() => {
    if (previewUrl) {
      return previewUrl;
    }
    return user?.avatarUrl ?? null;
  }, [previewUrl, user?.avatarUrl]);

  const avatarDirty = editing && Boolean(selectedFile || previewUrl);

  useEffect(() => {
    reportState({ busy: submitting || removing, dirty: avatarDirty });
  }, [avatarDirty, removing, reportState, submitting]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!user) {
    return null;
  }

  function resetSelection() {
    setSelectedFile(null);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function startEdit() {
    resetSelection();
    setEditing(true);
    setError(null);
  }

  function cancelEdit() {
    if (submitting || removing) {
      return;
    }

    resetSelection();
    setEditing(false);
    setError(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    resetSelection();

    if (!file) {
      return;
    }

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a photo to upload.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await uploadUserAvatar(selectedFile);
      await refreshUser();
      cancelEdit();
      showToaster("Profile photo updated");
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not upload your profile photo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openRemoveConfirmation() {
    if (!user?.avatarUrl || submitting || removing) {
      return;
    }

    setError(null);
    setConfirmRemoveOpen(true);
  }

  function closeRemoveConfirmation() {
    if (!removing) {
      setConfirmRemoveOpen(false);
    }
  }

  async function handleRemove() {
    if (!user?.avatarUrl) {
      return;
    }

    setRemoving(true);
    setError(null);

    try {
      await removeUserAvatar();
      await refreshUser();
      cancelEdit();
      setConfirmRemoveOpen(false);
      showToaster("Profile photo removed");
      window.dispatchEvent(new Event("auth:session-updated"));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not remove your profile photo."
      );
    } finally {
      setRemoving(false);
    }
  }

  const inputsDisabled = submitting || removing;

  return (
    <>
      <div className="rbt-single-info mb--24">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h6 className="mb--12 pt--4">Profile photo</h6>
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-circle object-fit-cover"
                unoptimized
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-light"
                style={{ width: 72, height: 72 }}
              >
                <i className="fa-regular fa-user b1 text-muted" aria-hidden />
              </div>
            )}
          </div>
          {!editing ? (
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              disabled={actionsDisabled}
              onClick={startEdit}
            >
              Edit
            </button>
          ) : null}
        </div>
        {editing ? (
          <form onSubmit={handleSubmit} className="mt--16">
            <div className="rbt-input-field-grp">
              <label className="rbt-field-label" htmlFor="profile_avatar_file">
                Upload photo
              </label>
              <input
                ref={fileInputRef}
                id="profile_avatar_file"
                className="rbt-input-field"
                type="file"
                accept={AVATAR_FILE_INPUT_ACCEPT}
                disabled={inputsDisabled}
                onChange={handleFileChange}
              />
              <p className="rbt-phone-input-field__hint b3 mb--0 mt--8">
                {AVATAR_FORMATS_LABEL}. Max {AVATAR_MAX_SIZE_LABEL}. HEIC photos
                are converted automatically.
              </p>
            </div>
            {selectedFile ? (
              <p className="b3 mb--0 mt--12">
                Selected: {selectedFile.name} (
                {formatFileSize(selectedFile.size)})
              </p>
            ) : null}
            {error ? (
              <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
            ) : null}
            <div className="d-flex flex-wrap gap-2 mt--16">
              <button
                type="submit"
                className="rbt-btn rbt-btn-sm"
                disabled={inputsDisabled || !selectedFile}
              >
                {submitting ? "Uploading…" : "Save photo"}
              </button>
              {user.avatarUrl ? (
                <button
                  type="button"
                  className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                  onClick={openRemoveConfirmation}
                  disabled={inputsDisabled}
                >
                  Remove photo
                </button>
              ) : null}
              <button
                type="button"
                className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                onClick={cancelEdit}
                disabled={inputsDisabled}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>

      <AccountConfirmDialog
        confirmLabel="Yes, remove photo"
        description="Your current profile photo will be removed. You can upload a new one anytime."
        error={confirmRemoveOpen ? error : null}
        iconClassName="fa-regular fa-user"
        loading={removing}
        loadingLabel="Removing…"
        onClose={closeRemoveConfirmation}
        onConfirm={() => void handleRemove()}
        open={confirmRemoveOpen}
        title="Remove profile photo?"
        titleId="remove-avatar-confirm-title"
        variant="danger"
      />
    </>
  );
}
