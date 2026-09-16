"use client";

import type { OrderStatus } from "@platform/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listFilterActiveClass } from "@/components/ui/list-filter-controls";
import {
  ORDER_API_STATUSES,
  orderStatusBadgeClass,
  orderStatusDotClass,
  orderStatusMenuTextClass,
} from "@/components/orders/order-status-select";
import { cn } from "@/utils/cn";

const ALL_STATUSES_VALUE = "all";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_API_STATUSES as readonly string[]).includes(value);
}

function checkedRingClass(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "data-[state=checked]:ring-success-600/25";
    case "cancelled":
      return "data-[state=checked]:ring-danger-600/25";
    case "shipped":
      return "data-[state=checked]:ring-warning-600/25";
    case "processing":
      return "data-[state=checked]:ring-brand-600/25";
    default:
      return "data-[state=checked]:ring-ink-400/30";
  }
}

function FilterStatusOption({
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

type OrderStatusFilterSelectProps = {
  ariaLabel?: string;
  className?: string;
  onValueChange: (value: string) => void;
  value: string;
};

export function OrderStatusFilterSelect({
  ariaLabel = "Filter by order status",
  className,
  onValueChange,
  value,
}: OrderStatusFilterSelectProps) {
  const isActive = value !== ALL_STATUSES_VALUE;
  const selectedStatus = isOrderStatus(value) ? value : null;

  return (
    <div className={cn("relative", className)}>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn(
            "h-11 justify-between gap-2 border px-3 text-[14px] font-semibold leading-none shadow-none",
            "transition-[filter,background-color,border-color]",
            "[&_[data-slot=select-value]]:line-clamp-none",
            "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-current [&_svg]:opacity-75",
            selectedStatus
              ? cn(
                  orderStatusBadgeClass(selectedStatus, { important: true }),
                  "hover:brightness-[0.98]"
                )
              : cn(
                  "!border-surface-line !bg-surface-body !text-ink-700 hover:!bg-surface-muted",
                  isActive && listFilterActiveClass
                )
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full",
                selectedStatus
                  ? orderStatusDotClass(selectedStatus)
                  : "bg-ink-300"
              )}
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
            textValue="All statuses"
            value={ALL_STATUSES_VALUE}
          >
            <FilterStatusOption
              dotClass="bg-ink-300"
              label="All statuses"
              textClass="text-ink-800"
            />
          </SelectItem>
          {ORDER_API_STATUSES.map((status) => (
            <SelectItem
              key={status}
              className={cn(
                "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:ring-1",
                checkedRingClass(status)
              )}
              textValue={capitalize(status)}
              value={status}
            >
              <FilterStatusOption
                dotClass={orderStatusDotClass(status)}
                label={capitalize(status)}
                textClass={orderStatusMenuTextClass(status)}
              />
            </SelectItem>
          ))}
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
