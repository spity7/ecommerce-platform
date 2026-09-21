function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-base bg-surface-body ${className ?? ""}`}
    />
  );
}

export function OrdersTableSkeleton({
  hideOrderColumn = false,
}: {
  hideOrderColumn?: boolean;
}) {
  const headerLabels = [
    ...(hideOrderColumn ? [] : (["Order ID"] as const)),
    "Customer",
    "Status",
    "Total",
    "Date Added",
    "Date Modified",
    "Action",
  ] as const;

  return (
    <section
      aria-busy="true"
      aria-label="Loading orders table"
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
            <SkeletonBar className="h-11 w-full md:w-[200px]" />
          </div>
        </div>
        <SkeletonBar className="hidden h-11 w-[120px] md:block" />
      </div>

      <div className="overflow-x-auto">
        <div className={hideOrderColumn ? "min-w-[620px]" : "min-w-[960px]"}>
          <div className="flex border-b border-surface-line pb-3">
            <SkeletonBar className="mx-3 h-4 w-4 shrink-0" />
            {headerLabels.map((label) => (
              <div
                className={
                  label === "Order ID"
                    ? "w-[108px] shrink-0 px-4"
                    : label === "Customer"
                      ? hideOrderColumn
                        ? "w-[108px] shrink-0 px-4"
                        : "w-[240px] shrink-0 px-4"
                      : label === "Status"
                        ? hideOrderColumn
                          ? "w-[128px] shrink-0 px-4"
                          : "w-[168px] shrink-0 px-4"
                        : label === "Total"
                          ? "w-[100px] shrink-0 px-4"
                          : label === "Date Added" || label === "Date Modified"
                            ? "w-[148px] shrink-0 px-4"
                            : label === "Action"
                              ? "w-[100px] shrink-0 px-4"
                              : "min-w-0 flex-1 px-4"
                }
                key={label}
              >
                <SkeletonBar className="h-3 w-16" />
              </div>
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              className="flex items-center border-b border-surface-line py-4 last:border-b-0"
              key={row}
            >
              <SkeletonBar className="mx-3 h-4 w-4 shrink-0" />
              {hideOrderColumn ? null : (
                <div className="w-[108px] shrink-0 px-4">
                  <SkeletonBar className="h-4 w-20" />
                </div>
              )}
              <div
                className={
                  hideOrderColumn
                    ? "w-[108px] shrink-0 px-4"
                    : "w-[240px] shrink-0 space-y-2 px-4"
                }
              >
                <SkeletonBar className="h-4 w-full max-w-[5rem]" />
                {hideOrderColumn ? null : (
                  <SkeletonBar className="h-3 w-40 max-w-full" />
                )}
              </div>
              <div
                className={
                  hideOrderColumn
                    ? "w-[128px] shrink-0 px-4"
                    : "w-[168px] shrink-0 px-4"
                }
              >
                <SkeletonBar className="h-8 w-full" />
              </div>
              <div className="w-[100px] shrink-0 px-4">
                <SkeletonBar className="h-4 w-14" />
              </div>
              <div className="w-[148px] shrink-0 px-4">
                <SkeletonBar className="h-4 w-24" />
              </div>
              <div className="w-[148px] shrink-0 px-4">
                <SkeletonBar className="h-4 w-24" />
              </div>
              <div className="flex w-[100px] shrink-0 justify-end gap-1 px-4">
                <SkeletonBar className="h-8 w-8" />
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
