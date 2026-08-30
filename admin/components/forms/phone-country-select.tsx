"use client";

import type { ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import { getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import { cn } from "@/utils/cn";

type CountryOption = {
  value?: Country | "ZZ";
  label: string;
  divider?: boolean;
};

type IconComponentProps = {
  country: Country;
  label?: string;
  "aria-hidden"?: boolean;
  aspectRatio?: number;
};

export type AdminPhoneCountrySelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  iconComponent?: ComponentType<IconComponentProps>;
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  name?: string;
  "aria-label"?: string;
  tabIndex?: number;
};

export function AdminPhoneCountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
  onFocus,
  onBlur,
  className,
  name,
  "aria-label": ariaLabel,
  tabIndex,
}: AdminPhoneCountrySelectProps) {
  const callingCode = value ? getCountryCallingCode(value) : null;

  return (
    <div
      className={cn(
        "PhoneInputCountry",
        "admin-phone-country-select",
        "relative flex h-10 min-w-[132px] shrink-0 items-stretch rounded-base border border-surface-line bg-surface-body transition-colors",
        "hover:border-ink-300 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/15",
        className
      )}
    >
      <select
        name={name}
        aria-label={ariaLabel ?? "Country code"}
        className="PhoneInputCountrySelect absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0"
        value={value || "ZZ"}
        disabled={disabled || readOnly}
        tabIndex={tabIndex}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "ZZ" ? undefined : (next as Country));
        }}
      >
        {options.map((option) => (
          <option
            key={option.divider ? "|" : option.value || "ZZ"}
            value={option.divider ? "|" : option.value || "ZZ"}
            disabled={option.divider}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none flex w-full items-center gap-2 px-3">
        {Icon && value ? (
          <span className="inline-flex shrink-0 [&_.PhoneInputCountryIcon]:h-[18px] [&_.PhoneInputCountryIcon]:w-[26px] [&_.PhoneInputCountryIcon]:overflow-hidden [&_.PhoneInputCountryIcon]:rounded-[2px]">
            <Icon aria-hidden country={value} label="" />
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-800">
          {callingCode ? `+${callingCode}` : "Code"}
        </span>
        <span className="inline-flex w-3.5 shrink-0 items-center justify-center text-ink-500">
          <ChevronDown aria-hidden className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
      </div>
    </div>
  );
}
