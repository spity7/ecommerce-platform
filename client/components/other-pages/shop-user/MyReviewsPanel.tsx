"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  deleteReview,
  fetchMyReviews,
  updateReview,
} from "@platform/api-client";
import { mapReviewDtoToStorefront } from "@/lib/mappers/reviews";
import {
  canManageOwnReviews,
  getAdminReviewsModerationUrl,
  isServerReviewsEnabled,
} from "@/lib/reviews-feature";
import { useAuthSession } from "@/providers/auth-session-provider";
import AccountConfirmDialog from "./AccountConfirmDialog";

function ReviewsEmptyState({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rbt-transparent-table-one-wrapper rbt-has-bg-gray p--32 text-center">
      <div
        aria-hidden
        className="mx-auto mb--16 d-inline-flex align-items-center justify-content-center rounded-circle rbt-bg-color-white"
        style={{ height: 72, width: 72 }}
      >
        <i className="fa-regular fa-star fs-3 rbt-text-color-primary" />
      </div>
      <h3 className="rbt-title mb--12">
        <span className="rbt-text-bold">{title}</span>
      </h3>
      <p className="b1 rbt-text-color-gray-700 mb--24 mx-auto max-w-md">
        {description}
      </p>
      <div className="d-flex flex-wrap justify-content-center rbt-gap--12">
        <Link className="rbt-btn" href={primaryHref}>
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link className="rbt-btn rbt-btn-border" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function MyReviewsPanel() {
  const { user, loading: authLoading } = useAuthSession();
  const [rows, setRows] = useState(
    [] as ReturnType<typeof mapReviewDtoToStorefront>[]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveConfirmId, setSaveConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const reviewToDelete = useMemo(
    () => rows.find((row) => row.id === deleteConfirmId) ?? null,
    [deleteConfirmId, rows]
  );

  const reviewToSave = useMemo(
    () => rows.find((row) => row.id === saveConfirmId) ?? null,
    [saveConfirmId, rows]
  );

  const loadReviews = useCallback(async () => {
    if (!canManageOwnReviews(user)) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (!user?.emailVerified) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const response = await fetchMyReviews();
      setRows(response.data.map(mapReviewDtoToStorefront));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to load your reviews.";
      setError(message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    setLoading(true);
    void loadReviews();
  }, [authLoading, loadReviews]);

  function closeDeleteConfirmation() {
    if (!deletingId) {
      setDeleteConfirmId(null);
    }
  }

  function closeSaveConfirmation() {
    if (!savingId) {
      setSaveConfirmId(null);
    }
  }

  async function handleDelete(reviewId: string) {
    setDeletingId(reviewId);
    setError(null);
    try {
      await deleteReview(reviewId);
      if (editingId === reviewId) {
        setEditingId(null);
      }
      await loadReviews();
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete review.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveEdit(reviewId: string) {
    setSavingId(reviewId);
    setError(null);
    try {
      await updateReview(reviewId, {
        title: editTitle,
        body: editBody,
        rating: editRating,
      });
      setEditingId(null);
      await loadReviews();
      setSaveConfirmId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update review.");
    } finally {
      setSavingId(null);
    }
  }

  if (!isServerReviewsEnabled()) {
    return (
      <div className="rbt-profile-content-area">
        <ReviewsEmptyState
          description="This storefront has not turned on product reviews yet."
          primaryHref="/shop"
          primaryLabel="Continue shopping"
          title="Reviews unavailable"
        />
      </div>
    );
  }

  if (!authLoading && user?.role === "admin") {
    const adminReviewsUrl = getAdminReviewsModerationUrl();
    return (
      <div className="rbt-profile-content-area">
        <ReviewsEmptyState
          description="Admin accounts moderate reviews in the admin dashboard, not here. Sign in with a customer account to write or manage your own product reviews on the storefront."
          primaryHref={adminReviewsUrl}
          primaryLabel="Open review moderation"
          secondaryHref="/account-info"
          secondaryLabel="Account settings"
          title="Customer account required"
        />
      </div>
    );
  }

  return (
    <div className="rbt-profile-content-area">
      <div className="rbt-component-section-title rbt-gap--4 mb--0 p-0 border-0">
        <h2 className="rbt-title mb--0">
          <span className="rbt-text-bold">My Reviews</span>
        </h2>
        <p className="b3 rbt-text-color-gray-600 mt--8 mb--0">
          Products you have rated and reviewed. Edits are sent for moderation
          again before they appear on the storefront.
        </p>
      </div>
      <hr className="mt--24 mb--24" />

      {authLoading || loading ? (
        <p className="b1 mb--0">Loading your reviews…</p>
      ) : null}

      {!authLoading && !loading && user && !user.emailVerified ? (
        <ReviewsEmptyState
          description="We need a verified email before you can save or view reviews here. Verify your address, then open any product page and use the Reviews tab to share feedback."
          primaryHref="/account-info?verify=1"
          primaryLabel="Verify email"
          secondaryHref="/shop"
          secondaryLabel="Browse products"
          title="Verify your email first"
        />
      ) : null}

      {!authLoading &&
      !loading &&
      error &&
      deleteConfirmId === null &&
      saveConfirmId === null ? (
        <div
          className="rbt-transparent-table-one-wrapper rbt-has-bg-gray p--24 mb--24"
          role="alert"
        >
          <p className="b1 rbt-text-color-danger mb--0">{error}</p>
        </div>
      ) : null}

      {!authLoading &&
      !loading &&
      user?.emailVerified &&
      !error &&
      rows.length === 0 ? (
        <ReviewsEmptyState
          description="Purchase something you love, then open the product page and scroll to the Reviews tab to rate it. Approved reviews will show up here."
          primaryHref="/shop"
          primaryLabel="Browse products"
          title="No reviews yet"
        />
      ) : null}

      {!authLoading && !loading && rows.length > 0 ? (
        <ul className="list-unstyled d-flex flex-column gap-4 mb--0">
          {rows.map((row) => (
            <li
              className="rbt-transparent-table-one-wrapper rbt-has-bg-gray p--24"
              key={row.id}
            >
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                <div>
                  <Link href={`/product/${row.productSlug}`}>
                    <strong>{row.productName}</strong>
                  </Link>
                  <p className="mb-0 b3 rbt-text-color-gray-600">
                    {row.rating}/5 ·{" "}
                    <span className="text-capitalize">{row.status}</span>
                    {row.status === "pending" ? (
                      <span className="ms-1">· Awaiting moderation</span>
                    ) : null}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="rbt-btn rbt-btn-sm rbt-btn-border"
                    onClick={() => {
                      setEditingId(row.id);
                      setEditTitle(row.title);
                      setEditBody(row.desc);
                      setEditRating(row.rating);
                    }}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rbt-btn rbt-btn-sm rbt-btn-border"
                    type="button"
                    onClick={() => {
                      setError(null);
                      setDeleteConfirmId(row.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingId === row.id ? (
                <div className="mt-3">
                  <input
                    className="rbt-input-field mb-2"
                    onChange={(event) => setEditTitle(event.target.value)}
                    value={editTitle}
                  />
                  <textarea
                    className="rbt-input-field mb-2"
                    onChange={(event) => setEditBody(event.target.value)}
                    rows={3}
                    value={editBody}
                  />
                  <input
                    className="rbt-input-field mb-2"
                    max={5}
                    min={1}
                    onChange={(event) =>
                      setEditRating(Number(event.target.value))
                    }
                    type="number"
                    value={editRating}
                  />
                  <button
                    className="rbt-btn rbt-btn-sm"
                    disabled={
                      editRating === row.rating &&
                      editTitle.trim() === row.title.trim() &&
                      editBody.trim() === row.desc.trim()
                    }
                    onClick={() => {
                      setError(null);
                      setSaveConfirmId(row.id);
                    }}
                    type="button"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="title mb-1">{row.title}</p>
                  <p className="b2 mb-0">{row.desc}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <AccountConfirmDialog
        confirmLabel="Yes, delete review"
        description={
          reviewToDelete ? (
            <>
              Permanently delete your review for{" "}
              <strong>{reviewToDelete.productName}</strong>? This cannot be
              undone.
            </>
          ) : (
            "Permanently delete this review?"
          )
        }
        error={deleteConfirmId ? error : null}
        iconClassName="fa-regular fa-trash-can"
        loading={deletingId !== null}
        loadingLabel="Deleting…"
        onClose={closeDeleteConfirmation}
        onConfirm={() => {
          if (deleteConfirmId) {
            void handleDelete(deleteConfirmId);
          }
        }}
        open={deleteConfirmId !== null}
        title="Delete this review?"
        titleId="delete-review-confirm-title"
        variant="danger"
      />

      <AccountConfirmDialog
        confirmLabel="Save changes"
        description={
          reviewToSave ? (
            <>
              Update your review for <strong>{reviewToSave.productName}</strong>
              ? It will be sent for moderation again and hidden from the
              storefront until approved.
            </>
          ) : (
            "Save your changes? Your review will be sent for moderation again."
          )
        }
        error={saveConfirmId ? error : null}
        iconClassName="fa-regular fa-pen-to-square"
        loading={savingId !== null}
        loadingLabel="Saving…"
        onClose={closeSaveConfirmation}
        onConfirm={() => {
          if (saveConfirmId) {
            void handleSaveEdit(saveConfirmId);
          }
        }}
        open={saveConfirmId !== null}
        title="Save review changes?"
        titleId="save-review-confirm-title"
      />
    </div>
  );
}
