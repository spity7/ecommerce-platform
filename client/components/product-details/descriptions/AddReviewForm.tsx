"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchMyReviews, submitProductReview } from "@platform/api-client";
import AccountConfirmDialog from "@/components/other-pages/shop-user/AccountConfirmDialog";
import { mapReviewDtoToStorefront } from "@/lib/mappers/reviews";
import { getAdminReviewsModerationUrl } from "@/lib/reviews-feature";
import { WaveThinIcon } from "../../svg-icons";
import { useAuthSession } from "@/providers/auth-session-provider";
import type { StorefrontReview } from "@/lib/mappers/reviews";

type AddReviewFormProps = {
  productId: string;
  productName?: string;
  existingReview?: StorefrontReview | null;
  onSubmitted?: () => void;
};

export default function AddReviewForm({
  productId,
  productName,
  existingReview,
  onSubmitted,
}: AddReviewFormProps) {
  const { user, loading } = useAuthSession();
  const router = useRouter();
  const [ownedReview, setOwnedReview] = useState<StorefrontReview | null>(
    existingReview ?? null
  );
  const [loadingOwnedReview, setLoadingOwnedReview] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.desc ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isUpdate = ownedReview !== null;
  const displayProductName =
    ownedReview?.productName ?? productName ?? "this product";
  const hasReviewChanges = useMemo(() => {
    if (!ownedReview) {
      return true;
    }
    return (
      rating !== ownedReview.rating ||
      title.trim() !== ownedReview.title.trim() ||
      body.trim() !== ownedReview.desc.trim()
    );
  }, [body, ownedReview, rating, title]);

  useEffect(() => {
    if (existingReview) {
      setOwnedReview(existingReview);
      setRating(existingReview.rating);
      setTitle(existingReview.title);
      setBody(existingReview.desc);
    }
  }, [existingReview]);

  useEffect(() => {
    if (existingReview || !user?.emailVerified || !productId) {
      return;
    }

    let cancelled = false;
    setLoadingOwnedReview(true);

    void (async () => {
      try {
        const response = await fetchMyReviews();
        const dto = response.data.find((row) => row.productId === productId);
        if (cancelled || !dto) {
          return;
        }
        const mapped = mapReviewDtoToStorefront(dto);
        setOwnedReview(mapped);
        setRating(dto.rating);
        setTitle(dto.title);
        setBody(dto.body);
      } catch {
        // No owned review or request failed — treat as new review.
      } finally {
        if (!cancelled) {
          setLoadingOwnedReview(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [existingReview, productId, user?.emailVerified]);

  async function submitReview() {
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await submitProductReview(productId, { rating, title, body });
      setSaveConfirmOpen(false);
      setMessage(
        isUpdate
          ? "Your review was updated and is pending moderation again."
          : "Thanks! Your review was submitted and is pending moderation."
      );
      const response = await fetchMyReviews();
      const dto = response.data.find((row) => row.productId === productId);
      if (dto) {
        const mapped = mapReviewDtoToStorefront(dto);
        setOwnedReview(mapped);
        setRating(dto.rating);
        setTitle(dto.title);
        setBody(dto.body);
      }
      onSubmitted?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit your review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      const returnTo = encodeURIComponent(
        typeof window !== "undefined" ? window.location.pathname : "/"
      );
      router.push(`/signin?returnTo=${returnTo}`);
      return;
    }

    if (!user.emailVerified) {
      setError("Verify your email before submitting a review.");
      return;
    }

    if (isUpdate) {
      if (!hasReviewChanges) {
        return;
      }
      setSaveConfirmOpen(true);
      return;
    }

    void submitReview();
  }

  if (loading) {
    return null;
  }

  if (user?.role === "admin") {
    const adminReviewsUrl = getAdminReviewsModerationUrl();
    return (
      <div className="rbt-reviews-form">
        <div className="rbt-fshape-box-outline-style">
          <div className="rbt-fshape-box rbt-bg-color-white rbt-contact-form-fshape p--24">
            <p className="b1 rbt-text-color-gray-700 mb--16">
              Signed in as an admin. Product reviews are submitted with a{" "}
              <strong>customer</strong> account. Moderate reviews in the admin
              app.
            </p>
            <a
              className="rbt-btn rbt-btn-md"
              href={adminReviewsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Review moderation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rbt-reviews-form">
      <form onSubmit={handleSubmit} className="rbt-contact-form">
        <div className="rbt-fshape-box-outline-style">
          <div className="row">
            <div className="col-lg-12">
              <div className="rbt-component-section-title rbt-contact-form-title rbt-bg-color-white">
                <h6 className="rbt-title">
                  <span className="rbt-bold--text">
                    {isUpdate ? "Update your review" : "Add A Review"}
                  </span>
                </h6>
                <span className="rbt-fshape-right-portion">
                  <WaveThinIcon />
                </span>
              </div>
            </div>
          </div>
          <div className="rbt-fshape-box rbt-bg-color-white rbt-contact-form-fshape">
            {error && !saveConfirmOpen ? (
              <p className="mb--16 text-danger">{error}</p>
            ) : null}
            {isUpdate && ownedReview?.status === "pending" ? (
              <p className="mb--16 b3 rbt-text-color-gray-600">
                Your current review is awaiting moderation. Saving changes will
                keep it hidden until approved again.
              </p>
            ) : null}
            {loadingOwnedReview ? (
              <p className="mb--16 b3 rbt-text-color-gray-600">
                Loading your review…
              </p>
            ) : null}
            {message ? <p className="mb--16 text-success">{message}</p> : null}
            <div className="row">
              <div className="col-12 mb--16">
                <div className="rbt-contact-input-field-grp">
                  <ul className="rbt-review-inp-list">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <li className="rbt-review-inp" key={value}>
                        <input
                          checked={rating === value}
                          id={`rbt-review-radio-${value}`}
                          name="rbt-review-radio"
                          onChange={() => setRating(value)}
                          type="radio"
                        />
                        <label htmlFor={`rbt-review-radio-${value}`}>
                          <span className="rbt-rating-icon-list">
                            {Array.from({ length: value }).map((_, index) => (
                              <span key={index}>
                                <i className="fa-solid fa-star rbt-rated-icon" />
                              </span>
                            ))}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-12 mb--16">
                <div className="rbt-contact-input-field-grp">
                  <label htmlFor="review-title">Your Review Title</label>
                  <input
                    className="rbt-contact-input-field"
                    id="review-title"
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    type="text"
                    value={title}
                  />
                </div>
              </div>
              <div className="col-12 mb--16">
                <div className="rbt-contact-input-field-grp">
                  <label htmlFor="review-body">Your review</label>
                  <textarea
                    className="rbt-contact-input-field"
                    id="review-body"
                    name="message"
                    onChange={(event) => setBody(event.target.value)}
                    required
                    value={body}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-md-end mt--8 rbt-gap--12 flex-wrap">
                <button
                  className="rbt-btn rbt-btn-md"
                  disabled={
                    submitting ||
                    (Boolean(user?.emailVerified) && loadingOwnedReview) ||
                    (isUpdate && !hasReviewChanges)
                  }
                  type="submit"
                >
                  {submitting
                    ? "Submitting…"
                    : isUpdate
                      ? "Save changes"
                      : "Submit Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <AccountConfirmDialog
        confirmLabel="Save changes"
        description={
          <>
            Update your review for <strong>{displayProductName}</strong>? It
            will be sent for moderation again and hidden from the storefront
            until approved.
          </>
        }
        error={saveConfirmOpen ? error : null}
        iconClassName="fa-regular fa-pen-to-square"
        loading={submitting}
        loadingLabel="Saving…"
        onClose={() => {
          if (!submitting) {
            setSaveConfirmOpen(false);
          }
        }}
        onConfirm={() => void submitReview()}
        open={saveConfirmOpen}
        title="Save review changes?"
        titleId="pdp-save-review-confirm-title"
      />
    </div>
  );
}
