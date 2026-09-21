"use client";

import { Icon } from "@/components/layout/icon";
import {
  ADMIN_LIST_TABLE_PAGE_SIZE,
  clampListTablePage,
} from "@/lib/list-table-pagination";

type ListTablePaginationProps = {
  disabled?: boolean;
  itemLabel: string;
  onPageChange: (page: number) => void;
  page: number;
  pageSize?: number;
  totalItems: number;
};

export function ListTablePagination({
  disabled = false,
  itemLabel,
  onPageChange,
  page,
  pageSize = ADMIN_LIST_TABLE_PAGE_SIZE,
  totalItems,
}: ListTablePaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = clampListTablePage(page, totalItems, pageSize);
  const rangeStart = (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);
  const canPaginate = totalItems > pageSize;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[13px] text-ink-500">
        Showing {rangeStart}–{rangeEnd} of {totalItems} {itemLabel}
      </p>
      {canPaginate ? (
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-base border border-surface-line text-ink-700 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            type="button"
          >
            <Icon className="h-4 w-4" name="chevron-left" />
          </button>
          <span
            key={safePage}
            className="admin-list-table-page-indicator min-w-[3.5rem] text-center text-[13px] font-semibold text-ink-600"
          >
            {safePage}/{totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-base border border-surface-line text-ink-700 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            type="button"
          >
            <Icon className="h-4 w-4" name="chevron-right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
