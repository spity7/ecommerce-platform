"use client";

import { REVIEW_STATUSES, type ReviewStatus } from "@platform/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listFilterActiveClass } from "@/components/ui/list-filter-controls";
import {
  catalogStatusBadgeClassImportant,
  catalogStatusCheckedRingClass,
  catalogStatusDotClass,
  catalogStatusLabel,
  catalogStatusMenuTextClass,
} from "@/lib/catalog-status-ui";
import {
  isReviewStatus,
  reviewStatusBadgeClassImportant,
  reviewStatusCheckedRingClass,
  reviewStatusDotClass,
  reviewStatusLabel,
  reviewStatusMenuTextClass,
} from "@/lib/review-status-ui";
import { cn } from "@/utils/cn";

const ALL_VALUE = "all";

const selectTriggerBase =
  "h-11 w-full justify-between gap-2 border px-3 text-[14px] font-semibold leading-none shadow-none transition-[filter,background-color,border-color] [&_[data-slot=select-value]]:line-clamp-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-current [&_svg]:opacity-75";

function StatusOptionRow({
  dotClass,
  label,
  textClass = "text-ink-700",
}: {
  dotClass: string;
  label: string;
  textClass?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className={cn("size-2.5 shrink-0 rounded-full", dotClass)}
      />
      <span className={cn("truncate text-[14px] font-medium", textClass)}>
        {label}
      </span>
    </span>
  );
}

type ReviewStatusFilterSelectProps = {
  allLabel?: string;
  ariaLabel?: string;
  className?: string;
  includeDraftCatalogOption?: boolean;
  onValueChange: (value: string) => void;
  value: string;
};

export function ReviewStatusFilterSelect({
  allLabel = "All reviews",
  ariaLabel = "Filter by review status",
  className,
  includeDraftCatalogOption = false,
  onValueChange,
  value,
}: ReviewStatusFilterSelectProps) {
  const isActive = value !== ALL_VALUE;
  const selectedStatus = isReviewStatus(value) ? value : null;
  const isDraftCatalog = value === "draft";

  const triggerToneClass = selectedStatus
    ? cn(
        reviewStatusBadgeClassImportant(selectedStatus),
        "hover:brightness-[0.98]"
      )
    : isDraftCatalog
      ? cn(catalogStatusBadgeClassImportant("draft"), "hover:brightness-[0.98]")
      : cn(
          "!border-surface-line !bg-surface-body !text-ink-700 hover:!bg-surface-muted",
          isActive && listFilterActiveClass
        );

  const triggerDotClass = selectedStatus
    ? reviewStatusDotClass(selectedStatus)
    : isDraftCatalog
      ? catalogStatusDotClass("draft")
      : "bg-ink-300";

  return (
    <div className={cn("relative", className)}>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn(selectTriggerBase, triggerToneClass)}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", triggerDotClass)}
            />
            <SelectValue className="min-w-0 truncate" />
          </span>
        </SelectTrigger>
        <SelectContent
          align="start"
          className="min-w-(--radix-select-trigger-width)"
        >
          <SelectItem
            className="py-2.5 data-[state=checked]:font-semibold data-[state=checked]:text-ink-900 data-[state=checked]:ring-1 data-[state=checked]:ring-brand-600/20"
            textValue={allLabel}
            value={ALL_VALUE}
          >
            <StatusOptionRow
              dotClass="bg-ink-300"
              label={allLabel}
              textClass="text-ink-800"
            />
          </SelectItem>
          {REVIEW_STATUSES.map((status) => (
            <SelectItem
              className={cn(
                "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:ring-1",
                reviewStatusCheckedRingClass(status)
              )}
              key={status}
              textValue={reviewStatusLabel(status)}
              value={status}
            >
              <StatusOptionRow
                dotClass={reviewStatusDotClass(status)}
                label={reviewStatusLabel(status)}
                textClass={reviewStatusMenuTextClass(status)}
              />
            </SelectItem>
          ))}
          {includeDraftCatalogOption ? (
            <SelectItem
              className={cn(
                "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:ring-1",
                catalogStatusCheckedRingClass("draft")
              )}
              textValue={catalogStatusLabel("draft")}
              value="draft"
            >
              <StatusOptionRow
                dotClass={catalogStatusDotClass("draft")}
                label={catalogStatusLabel("draft")}
                textClass={catalogStatusMenuTextClass("draft")}
              />
            </SelectItem>
          ) : null}
        </SelectContent>
      </Select>
      {isActive ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full border-2 border-surface-card bg-brand-600"
        />
      ) : null}
    </div>
  );
}
