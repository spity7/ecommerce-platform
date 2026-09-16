"use client";

import { useState } from "react";
import { ApiReviewsPanel } from "@/components/reviews/api-reviews-panel";
import { ProductReviewsStatsSkeleton } from "@/components/reviews/product-reviews-skeleton";
import { PageHeader } from "@/components/layout/page-header";

export default function ProductReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    pending: 0,
    approved: 0,
  });

  return (
    <>
      <PageHeader
        description="Review, approve, and respond to customer product feedback."
        eyebrow="Moderation"
        title="Product Reviews"
      />
      {loading ? (
        <ProductReviewsStatsSkeleton />
      ) : (
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
            <p className="text-[13px] text-ink-500">
              Average rating (approved)
            </p>
            <h2 className="mt-1 text-[24px] font-semibold text-warning-600">
              {stats.approved > 0 ? `${stats.averageRating}/5` : "—"}
            </h2>
          </article>
          <article className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
            <p className="text-[13px] text-ink-500">Pending reviews</p>
            <h2 className="mt-1 text-[24px] font-semibold text-ink-900">
              {stats.pending}
            </h2>
          </article>
          <article className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
            <p className="text-[13px] text-ink-500">Approved (loaded)</p>
            <h2 className="mt-1 text-[24px] font-semibold text-success-600">
              {stats.approved}
            </h2>
          </article>
        </section>
      )}
      <ApiReviewsPanel onLoadingChange={setLoading} onStatsChange={setStats} />
    </>
  );
}
