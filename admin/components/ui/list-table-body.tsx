"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
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

type ListTableEmptyMessageProps = {
  children: ReactNode;
  className?: string;
  filterSignature: string;
};

export function ListTableEmptyMessage({
  children,
  className,
  filterSignature,
}: ListTableEmptyMessageProps) {
  return (
    <p
      key={filterSignature}
      className={cn(
        "admin-list-table-empty-animate py-10 text-center text-[14px] text-ink-400",
        className
      )}
    >
      {children}
    </p>
  );
}
