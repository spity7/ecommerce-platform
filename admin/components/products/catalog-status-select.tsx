"use client";

import type { ProductStatus } from "@platform/shared";
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
  inventoryBadgeClass,
  inventoryDotClass,
  isProductStatus,
} from "@/lib/catalog-status-ui";
import { cn } from "@/utils/cn";

const ALL_STATUSES_VALUE = "all";
const LOW_STOCK_VALUE = "low stock";

export const DEFAULT_CATALOG_STATUS_FILTER_OPTIONS = [
  "published",
  "draft",
  "archived",
] as const satisfies readonly ProductStatus[];

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

type CatalogStatusSelectProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  onValueChange: (value: ProductStatus) => void;
  statuses: readonly ProductStatus[];
  value: ProductStatus;
};

export function CatalogStatusSelect({
  ariaLabel = "Product status",
  className,
  disabled = false,
  name,
  onValueChange,
  statuses,
  value,
}: CatalogStatusSelectProps) {
  return (
    <div className={className}>
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <Select
        disabled={disabled}
        onValueChange={(next) => {
          if (isProductStatus(next)) {
            onValueChange(next);
          }
        }}
        value={value}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn(
            selectTriggerBase,
            catalogStatusBadgeClassImportant(value),
            "w-full hover:brightness-[0.98]"
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full",
                catalogStatusDotClass(value)
              )}
            />
            <SelectValue className="min-w-0 truncate" />
          </span>
        </SelectTrigger>
        <SelectContent
          align="start"
          className="min-w-(--radix-select-trigger-width)"
        >
          {statuses.map((status) => (
            <SelectItem
              className={cn(
                "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:text-ink-900 data-[state=checked]:ring-1",
                catalogStatusCheckedRingClass(status)
              )}
              key={status}
              textValue={catalogStatusLabel(status)}
              value={status}
            >
              <StatusOptionRow
                dotClass={catalogStatusDotClass(status)}
                label={catalogStatusLabel(status)}
                textClass={catalogStatusMenuTextClass(status)}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type CatalogStatusFilterValue =
  typeof ALL_STATUSES_VALUE | typeof LOW_STOCK_VALUE | ProductStatus;

type CatalogStatusFilterSelectProps = {
  allLabel?: string;
  ariaLabel?: string;
  catalogStatuses?: readonly ProductStatus[];
  className?: string;
  includeLowStock?: boolean;
  onValueChange: (value: CatalogStatusFilterValue | string) => void;
  value: CatalogStatusFilterValue | string;
};

export function CatalogStatusFilterSelect({
  allLabel = "All statuses",
  ariaLabel = "Filter by status",
  catalogStatuses = DEFAULT_CATALOG_STATUS_FILTER_OPTIONS,
  className,
  includeLowStock = true,
  onValueChange,
  value,
}: CatalogStatusFilterSelectProps) {
  const isActive = value !== ALL_STATUSES_VALUE;
  const selectedStatus = isProductStatus(value) ? value : null;
  const isLowStock = value === LOW_STOCK_VALUE;

  const triggerToneClass = selectedStatus
    ? cn(
        catalogStatusBadgeClassImportant(selectedStatus),
        "hover:brightness-[0.98]"
      )
    : isLowStock
      ? cn(
          inventoryBadgeClass("low")
            .split(/\s+/)
            .map((token) => `!${token}`)
            .join(" "),
          "hover:brightness-[0.98]"
        )
      : cn(
          "!border-surface-line !bg-surface-body !text-ink-700 hover:!bg-surface-muted",
          isActive && listFilterActiveClass
        );

  const triggerDotClass = selectedStatus
    ? catalogStatusDotClass(selectedStatus)
    : isLowStock
      ? inventoryDotClass("low")
      : "bg-ink-300";

  return (
    <div className={cn("relative", className)}>
      <Select
        onValueChange={(next) =>
          onValueChange(next as CatalogStatusFilterValue)
        }
        value={value}
      >
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
            value={ALL_STATUSES_VALUE}
          >
            <StatusOptionRow
              dotClass="bg-ink-300"
              label={allLabel}
              textClass="text-ink-800"
            />
          </SelectItem>
          {catalogStatuses.map((status) => (
            <SelectItem
              className={cn(
                "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:ring-1",
                catalogStatusCheckedRingClass(status)
              )}
              key={status}
              textValue={catalogStatusLabel(status)}
              value={status}
            >
              <StatusOptionRow
                dotClass={catalogStatusDotClass(status)}
                label={catalogStatusLabel(status)}
                textClass={catalogStatusMenuTextClass(status)}
              />
            </SelectItem>
          ))}
          {includeLowStock ? (
            <SelectItem
              className="py-2.5 data-[state=checked]:font-semibold data-[state=checked]:text-ink-900 data-[state=checked]:ring-1 data-[state=checked]:ring-warning-600/25"
              textValue="Low stock"
              value={LOW_STOCK_VALUE}
            >
              <StatusOptionRow
                dotClass={inventoryDotClass("low")}
                label="Low stock"
                textClass="text-warning-700"
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
