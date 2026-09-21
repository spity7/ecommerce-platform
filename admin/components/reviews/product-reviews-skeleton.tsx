function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-base bg-surface-body ${className ?? ""}`}
    />
  );
}

export function ProductReviewsStatsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading review statistics"
      className="mb-6 grid gap-4 md:grid-cols-3"
    >
      {[0, 1, 2].map((index) => (
        <article
          className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card"
          key={index}
        >
          <SkeletonBar className="h-4 w-36" />
          <SkeletonBar className="mt-3 h-8 w-20" />
        </article>
      ))}
    </section>
  );
}

export function ProductReviewsTableSkeleton() {
  const headerLabels = [
    "Product",
    "Customer",
    "Rating",
    "Title",
    "Review",
    "Status",
    "Actions",
  ];

  return (
    <section
      aria-busy="true"
      aria-label="Loading reviews table"
      className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:contents">
            <SkeletonBar className="h-11 w-full md:w-[340px]" />
            <SkeletonBar className="h-11 w-11 md:hidden" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:contents">
            <SkeletonBar className="h-11 w-full md:w-[180px]" />
            <SkeletonBar className="h-11 w-full md:w-[140px]" />
          </div>
        </div>
        <SkeletonBar className="hidden h-11 w-[120px] md:block" />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="flex border-b border-surface-line pb-3">
            <SkeletonBar className="mx-3 h-4 w-4 shrink-0" />
            {headerLabels.map((label) => (
              <div className="flex-1 px-4" key={label}>
                <SkeletonBar className="h-3 w-16" />
              </div>
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              className="flex border-b border-surface-line py-4 last:border-b-0"
              key={row}
            >
              <SkeletonBar className="mx-3 h-4 w-4 shrink-0" />
              <div className="flex flex-[1.2] px-4">
                <SkeletonBar className="h-4 w-3/4" />
              </div>
              <div className="flex flex-1 px-4">
                <SkeletonBar className="h-4 w-2/3" />
              </div>
              <div className="flex w-[104px] shrink-0 px-4">
                <SkeletonBar className="h-4 w-10" />
              </div>
              <div className="flex flex-1 px-4">
                <SkeletonBar className="h-4 w-1/2" />
              </div>
              <div className="flex flex-[1.6] px-4">
                <SkeletonBar className="h-4 w-full" />
              </div>
              <div className="flex w-[120px] shrink-0 px-4">
                <SkeletonBar className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex w-[160px] shrink-0 justify-end gap-1 px-4">
                <SkeletonBar className="h-8 w-14" />
                <SkeletonBar className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <SkeletonBar className="h-4 w-40" />
        <div className="flex gap-2">
          <SkeletonBar className="h-9 w-20" />
          <SkeletonBar className="h-9 w-16" />
        </div>
      </div>
    </section>
  );
}
