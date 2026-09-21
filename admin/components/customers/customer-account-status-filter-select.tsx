"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listFilterActiveClass } from "@/components/ui/list-filter-controls";
import {
  customerAccountFilterBadgeClassImportant,
  customerAccountFilterDotClass,
  isCustomerAccountFilterValue,
  type CustomerAccountFilterValue,
} from "@/lib/customer-account-status-ui";
import { cn } from "@/utils/cn";

const ALL_VALUE = "all";

const selectTriggerBase =
  "h-11 w-full justify-between gap-2 border px-3 text-[14px] font-semibold leading-none shadow-none transition-[filter,background-color,border-color] [&_[data-slot=select-value]]:line-clamp-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-current [&_svg]:opacity-75";

function FilterOptionRow({
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

type CustomerAccountStatusFilterSelectProps = {
  ariaLabel?: string;
  className?: string;
  onValueChange: (value: string) => void;
  value: string;
};

export function CustomerAccountStatusFilterSelect({
  ariaLabel = "Filter by customer status",
  className,
  onValueChange,
  value,
}: CustomerAccountStatusFilterSelectProps) {
  const isActive = value !== ALL_VALUE;
  const selectedFilter =
    value === "active" || value === "disabled" ? value : null;

  const triggerToneClass = selectedFilter
    ? cn(
        customerAccountFilterBadgeClassImportant(selectedFilter),
        "hover:brightness-[0.98]"
      )
    : cn(
        "!border-surface-line !bg-surface-body !text-ink-700 hover:!bg-surface-muted",
        isActive && listFilterActiveClass
      );

  const triggerDotClass = selectedFilter
    ? customerAccountFilterDotClass(selectedFilter)
    : "bg-ink-300";

  const options: { filter: CustomerAccountFilterValue; label: string }[] = [
    { filter: "all", label: "All customers" },
    { filter: "active", label: "Active" },
    { filter: "disabled", label: "Disabled" },
  ];

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
          {options.map((option) => {
            if (option.filter === "all") {
              return (
                <SelectItem
                  className="py-2.5 data-[state=checked]:font-semibold data-[state=checked]:text-ink-900 data-[state=checked]:ring-1 data-[state=checked]:ring-brand-600/20"
                  key={option.filter}
                  textValue={option.label}
                  value={ALL_VALUE}
                >
                  <FilterOptionRow
                    dotClass="bg-ink-300"
                    label={option.label}
                    textClass="text-ink-800"
                  />
                </SelectItem>
              );
            }

            const filter = option.filter;
            const ringClass =
              filter === "active"
                ? "data-[state=checked]:ring-success-600/25"
                : "data-[state=checked]:ring-danger-600/25";
            const textClass =
              filter === "active" ? "text-success-700" : "text-danger-700";

            return (
              <SelectItem
                className={cn(
                  "py-2.5 data-[state=checked]:font-semibold data-[state=checked]:ring-1",
                  ringClass
                )}
                key={option.filter}
                textValue={option.label}
                value={filter}
              >
                <FilterOptionRow
                  dotClass={customerAccountFilterDotClass(filter)}
                  label={option.label}
                  textClass={textClass}
                />
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {isActive && isCustomerAccountFilterValue(value) && value !== "all" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full border-2 border-surface-card bg-brand-600"
        />
      ) : null}
    </div>
  );
}
