"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAdminReview,
  fetchAdminReviews,
  moderateReview,
} from "@platform/api-client";
import {
  type EntityColumn,
  EntityTable,
} from "@/components/admin/entity-table";
import { Icon } from "@/components/layout/icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/routes";
import {
  mapReviewDtoToApiReviewRow,
  type ApiReviewRow,
} from "@/lib/mappers/reviews";
import { ProductReviewsTableSkeleton } from "@/components/reviews/product-reviews-skeleton";
import { useBusyActionGuard } from "@platform/react-busy";

const statusClass: Record<ApiReviewRow["status"], string> = {
  approved: "bg-success-50 text-success-700",
  pending: "bg-warning-50 text-warning-700",
  rejected: "bg-error-50 text-error-700",
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ApiReviewsPanel({
  onLoadingChange,
  onStatsChange,
}: {
  onLoadingChange?: (loading: boolean) => void;
  onStatsChange?: (stats: {
    averageRating: number;
    pending: number;
    approved: number;
  }) => void;
}) {
  const [reviews, setReviews] = useState<ApiReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [moderationConfirm, setModerationConfirm] = useState<{
    reviewId: string;
    status: "approved" | "rejected";
    productName: string;
    customer: string;
  } | null>(null);

  useBusyActionGuard({ active: actionId !== null });

  const loadReviews = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) {
        setLoading(true);
        onLoadingChange?.(true);
      }
      setError(null);
      try {
        const response = await fetchAdminReviews({ limit: 100, page: 1 });
        const rows = response.data.map(mapReviewDtoToApiReviewRow);
        setReviews(rows);

        const approved = rows.filter((row) => row.status === "approved");
        const pending = rows.filter((row) => row.status === "pending").length;
        const averageRating =
          approved.length > 0
            ? Math.round(
                (approved.reduce((sum, row) => sum + row.rating, 0) /
                  approved.length) *
                  100
              ) / 100
            : 0;

        onStatsChange?.({
          averageRating,
          pending,
          approved: approved.length,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load reviews from the API."
        );
      } finally {
        if (!silent) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    },
    [onLoadingChange, onStatsChange]
  );

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function confirmModeration() {
    if (!moderationConfirm) {
      return;
    }
    const { reviewId, status } = moderationConfirm;
    setActionId(reviewId);
    setError(null);
    try {
      await moderateReview(reviewId, { status });
      await loadReviews({ silent: true });
      setModerationConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update review status."
      );
    } finally {
      setActionId(null);
    }
  }

  const columns: EntityColumn<ApiReviewRow>[] = useMemo(
    () => [
      {
        cellClassName: "min-w-0",
        colWidth: "14%",
        key: "product",
        label: "Product",
        render: (review) => (
          <span className="block font-semibold text-ink-900">
            {review.product}
          </span>
        ),
        sortValue: (review) => review.product,
      },
      {
        cellClassName: "min-w-0 truncate",
        colWidth: "12%",
        hideable: true,
        key: "customer",
        label: "Customer",
        render: (review) => review.customer,
        sortValue: (review) => review.customer,
      },
      {
        cellClassName: "tabular-nums",
        colWidth: "104px",
        headerTruncate: false,
        hideable: true,
        key: "rating",
        label: "Rating",
        render: (review) => (
          <span className="font-medium text-warning-500">
            {review.rating}/5
          </span>
        ),
        sortValue: (review) => review.rating,
      },
      {
        cellClassName: "min-w-0",
        colWidth: "10%",
        hideable: true,
        key: "title",
        label: "Title",
        render: (review) => (
          <span className="block font-medium text-ink-800">{review.title}</span>
        ),
        sortValue: (review) => review.title,
      },
      {
        cellClassName: "min-w-0",
        colWidth: "26%",
        headerTruncate: false,
        hideable: true,
        key: "review",
        label: "Review",
        render: (review) => (
          <span className="line-clamp-2 text-ink-500">{review.review}</span>
        ),
        sortValue: (review) => review.review,
      },
      {
        cellClassName: "whitespace-nowrap",
        colWidth: "120px",
        headerTruncate: false,
        hideable: true,
        key: "status",
        label: "Status",
        render: (review) => (
          <StatusBadge
            className={statusClass[review.status]}
            label={capitalize(review.status)}
          />
        ),
        sortValue: (review) => review.status,
      },
    ],
    []
  );

  const renderRowActions = useCallback(
    (
      review: ApiReviewRow,
      helpers: { requestDelete: (id: string) => void }
    ) => (
      <div className="flex flex-nowrap items-center justify-end gap-1">
        {review.status !== "approved" ? (
          <button
            className="rounded-base border border-success-200 bg-success-50 px-2 py-1 text-[12px] font-semibold text-success-700 disabled:opacity-50"
            disabled={actionId === review.id}
            onClick={() =>
              setModerationConfirm({
                reviewId: review.id,
                status: "approved",
                productName: review.product,
                customer: review.customer,
              })
            }
            type="button"
          >
            Approve
          </button>
        ) : null}
        {review.status !== "rejected" ? (
          <button
            className="rounded-base border border-surface-line px-2 py-1 text-[12px] font-semibold text-ink-600 disabled:opacity-50"
            disabled={actionId === review.id}
            onClick={() =>
              setModerationConfirm({
                reviewId: review.id,
                status: "rejected",
                productName: review.product,
                customer: review.customer,
              })
            }
            type="button"
          >
            Reject
          </button>
        ) : null}
        <button
          aria-label="Delete review"
          className="icon-button hover:bg-danger-50 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={actionId === review.id}
          onClick={() => helpers.requestDelete(review.id)}
          type="button"
        >
          <Icon className="h-4 w-4" name="trash-2" />
        </button>
      </div>
    ),
    [actionId]
  );

  if (loading) {
    return <ProductReviewsTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-base border border-error-200 bg-error-50 px-4 py-3 text-[14px] text-error-700">
          {error}
        </p>
      ) : null}
      <EntityTable
        columns={columns}
        deleteMessage="This review will be permanently removed from the catalog and will no longer appear on the storefront."
        editHref={routes.productReviews}
        filterGroups={[
          {
            ariaLabel: "Filter by rating",
            className: "w-[140px]",
            defaultValue: "all",
            key: "rating",
            options: [
              { label: "All ratings", match: () => true, value: "all" },
              ...([5, 4, 3, 2, 1] as const).map((stars) => ({
                label: `${stars} star${stars === 1 ? "" : "s"}`,
                match: (row: ApiReviewRow) => row.rating === stars,
                value: String(stars),
              })),
            ],
          },
        ]}
        filterOptions={[
          { label: "All reviews", match: () => true, value: "all" },
          {
            label: "Pending",
            match: (row) => row.status === "pending",
            value: "pending",
          },
          {
            label: "Approved",
            match: (row) => row.status === "approved",
            value: "approved",
          },
          {
            label: "Rejected",
            match: (row) => row.status === "rejected",
            value: "rejected",
          },
        ]}
        items={reviews}
        onDelete={async (ids) => {
          for (const id of ids) {
            await deleteAdminReview(id);
          }
          await loadReviews({ silent: true });
        }}
        renderRowActions={renderRowActions}
        rowActionsColWidth="160px"
        rowActionsHeaderLabel="Actions"
        searchFieldClassName="w-[340px] max-w-full"
        searchLabel="Search reviews"
        searchPlaceholder="Search product, customer, review"
        searchText={(review) =>
          `${review.product} ${review.customer} ${review.title} ${review.review}`
        }
        singularName="review"
      />
      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={
          moderationConfirm?.status === "approved"
            ? "Approve review"
            : "Reject review"
        }
        description={
          moderationConfirm ? (
            <>
              {moderationConfirm.status === "approved" ? (
                <>
                  Publish <strong>{moderationConfirm.customer}</strong>
                  &apos;s review for{" "}
                  <strong>{moderationConfirm.productName}</strong> on the
                  storefront?
                </>
              ) : (
                <>
                  Reject <strong>{moderationConfirm.customer}</strong>
                  &apos;s review for{" "}
                  <strong>{moderationConfirm.productName}</strong>? It will stay
                  hidden from shoppers.
                </>
              )}
            </>
          ) : null
        }
        loading={Boolean(
          moderationConfirm && actionId === moderationConfirm.reviewId
        )}
        loadingLabel="Updating…"
        onClose={() => {
          if (actionId === null) {
            setModerationConfirm(null);
          }
        }}
        onConfirm={() => void confirmModeration()}
        open={moderationConfirm !== null}
        title={
          moderationConfirm?.status === "approved"
            ? "Approve this review?"
            : "Reject this review?"
        }
        titleId="review-moderation-confirm-title"
        variant={
          moderationConfirm?.status === "rejected" ? "danger" : "default"
        }
      />
    </div>
  );
}
