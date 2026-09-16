"use client";

import type { OrderStatus } from "@platform/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";

export const ORDER_API_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function withImportant(classes: string): string {
  return classes
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => (token.startsWith("!") ? token : `!${token}`))
    .join(" ");
}

export function orderStatusBadgeClass(
  status: OrderStatus,
  options?: { important?: boolean }
): string {
  let classes: string;
  switch (status) {
    case "delivered":
      classes = "border-success-100 bg-success-50 text-success-700";
      break;
    case "cancelled":
      classes = "border-danger-100 bg-danger-50 text-danger-600";
      break;
    case "shipped":
      classes = "border-warning-100 bg-warning-50 text-warning-600";
      break;
    case "processing":
      classes = "border-brand-200 bg-brand-50 text-brand-700";
      break;
    default:
      classes = "border-surface-line bg-surface-muted text-ink-600";
  }

  return options?.important ? withImportant(classes) : classes;
}

export function orderStatusDotClass(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "bg-success-500";
    case "cancelled":
      return "bg-danger-500";
    case "shipped":
      return "bg-warning-500";
    case "processing":
      return "bg-brand-500";
    default:
      return "bg-ink-400";
  }
}

export function orderStatusMenuTextClass(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "text-success-700";
    case "cancelled":
      return "text-danger-600";
    case "shipped":
      return "text-warning-600";
    case "processing":
      return "text-brand-700";
    default:
      return "text-ink-700";
  }
}

function OrderStatusLabel({
  status,
  variant = "menu",
}: {
  status: OrderStatus;
  variant?: "menu" | "trigger";
}) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "shrink-0 rounded-full",
          variant === "trigger" ? "size-2" : "size-2.5",
          orderStatusDotClass(status)
        )}
      />
      <span
        className={cn(
          "truncate",
          variant === "menu" && orderStatusMenuTextClass(status)
        )}
      >
        {capitalize(status)}
      </span>
    </span>
  );
}

type OrderStatusSelectProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  onValueChange: (status: OrderStatus) => void;
  size?: "sm" | "default";
  value: OrderStatus;
};

export function OrderStatusSelect({
  ariaLabel = "Order status",
  className,
  disabled,
  onValueChange,
  size = "sm",
  value,
}: OrderStatusSelectProps) {
  const isCompact = size === "sm";

  return (
    <Select
      disabled={disabled}
      onValueChange={(next) => onValueChange(next as OrderStatus)}
      value={value}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "justify-between gap-2 border font-semibold shadow-none",
          "transition-[filter,background-color] hover:brightness-[0.98]",
          "[&_[data-slot=select-value]]:line-clamp-none",
          "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-current [&_svg]:opacity-75",
          isCompact
            ? "h-8 rounded-full px-2.5 text-[12px] leading-none"
            : "h-10 rounded-base px-3 text-[14px]",
          orderStatusBadgeClass(value, { important: true }),
          className
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span
            aria-hidden
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              orderStatusDotClass(value)
            )}
          />
          <SelectValue className="min-w-0 truncate" />
        </span>
      </SelectTrigger>
      <SelectContent
        align="start"
        className="min-w-(--radix-select-trigger-width)"
      >
        {ORDER_API_STATUSES.map((status) => (
          <SelectItem
            key={status}
            className={cn(
              "font-medium",
              "data-[state=checked]:font-semibold",
              "data-[state=checked]:ring-1 data-[state=checked]:ring-brand-600/20"
            )}
            textValue={capitalize(status)}
            value={status}
          >
            <OrderStatusLabel status={status} variant="menu" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
