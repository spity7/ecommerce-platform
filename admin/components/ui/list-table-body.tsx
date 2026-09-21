"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Icon } from "@/components/layout/icon";
import { cn } from "@/utils/cn";

type ListTableBodyVariant = "fade" | "slide-back" | "slide-forward";

const variantClass: Record<ListTableBodyVariant, string> = {
  fade: "admin-list-table-body--fade",
  "slide-back": "admin-list-table-body--slide-back",
  "slide-forward": "admin-list-table-body--slide-forward",
};

function resolveVariant(
  previous: { filterSignature: string; page: number; rowSetToken: string },
  next: { filterSignature: string; page: number; rowSetToken: string }
): ListTableBodyVariant {
  if (previous.filterSignature !== next.filterSignature) {
    return "fade";
  }

  if (previous.page !== next.page) {
    return next.page > previous.page ? "slide-forward" : "slide-back";
  }

  if (previous.rowSetToken !== next.rowSetToken) {
    return "fade";
  }

  return "fade";
}

type ListTableBodyProps = {
  children: ReactNode;
  className?: string;
  filterSignature: string;
  page: number;
  rowSetToken: string;
};

export function ListTableBody({
  children,
  className,
  filterSignature,
  page,
  rowSetToken,
}: ListTableBodyProps) {
  const previousRef = useRef({
    filterSignature,
    page,
    rowSetToken,
  });

  const transition = useMemo(() => {
    const next = { filterSignature, page, rowSetToken };
    const variant = resolveVariant(previousRef.current, next);
    return {
      key: `${filterSignature}:${page}:${rowSetToken}`,
      variant,
    };
  }, [filterSignature, page, rowSetToken]);

  useEffect(() => {
    previousRef.current = { filterSignature, page, rowSetToken };
  }, [filterSignature, page, rowSetToken]);

  return (
    <tbody
      key={transition.key}
      className={cn(className, variantClass[transition.variant])}
    >
      {children}
    </tbody>
  );
}

export function pluralizeListEntityName(singular: string): string {
  if (/[^aeiou]y$/i.test(singular)) {
    return `${singular.slice(0, -1)}ies`;
  }
  return `${singular}s`;
}

export function getListTableEmptyCopy({
  hasActiveFilters,
  itemLabel,
}: {
  hasActiveFilters: boolean;
  itemLabel: string;
}): { description: string; icon: string; title: string } {
  if (hasActiveFilters) {
    return {
      description: `Try a different search, or clear filters to see all ${itemLabel}.`,
      icon: "search-x",
      title: `No matching ${itemLabel}`,
    };
  }

  return {
    description: `New ${itemLabel} will appear in this list.`,
    icon: "inbox",
    title: `No ${itemLabel} yet`,
  };
}

type ListTableEmptyMessageProps = {
  className?: string;
  description: string;
  filterSignature: string;
  icon?: string;
  onClearFilters?: () => void;
  title: string;
};

export function ListTableEmptyMessage({
  className,
  description,
  filterSignature,
  icon = "inbox",
  onClearFilters,
  title,
}: ListTableEmptyMessageProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "admin-list-table-empty-animate flex flex-col items-center px-6 py-14 text-center",
        className
      )}
      key={filterSignature}
      role="status"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-ink-400 ring-1 ring-inset ring-surface-line">
        <Icon className="h-5 w-5" name={icon} />
      </span>
      <p className="mt-3.5 text-[15px] font-semibold tracking-tight text-ink-800">
        {title}
      </p>
      <p className="mt-1.5 max-w-[20.5rem] text-[13px] leading-5 text-pretty text-ink-400">
        {description}
      </p>
      {onClearFilters ? (
        <button
          className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-base border border-danger-100 bg-danger-50 px-3.5 text-[13px] font-semibold text-danger-600 transition-colors hover:border-danger-600 hover:bg-danger-600 hover:text-white"
          onClick={onClearFilters}
          type="button"
        >
          <Icon className="h-3.5 w-3.5" name="filter-x" />
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
