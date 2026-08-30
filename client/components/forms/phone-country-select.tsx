"use client";

import type { ComponentType } from "react";
import { getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

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

export type StorefrontPhoneCountrySelectProps = {
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
  autoComplete?: string;
};

export function StorefrontPhoneCountrySelect({
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
}: StorefrontPhoneCountrySelectProps) {
  const callingCode = value ? getCountryCallingCode(value) : null;

  return (
    <div
      className={["PhoneInputCountry", "rbt-phone-country-select", className]
        .filter(Boolean)
        .join(" ")}
    >
      <select
        name={name}
        autoComplete="tel-country-code"
        aria-label={ariaLabel ?? "Country code"}
        className="PhoneInputCountrySelect rbt-phone-country-select__native"
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
      <div className="rbt-phone-country-select__display">
        {Icon && value ? (
          <span className="rbt-phone-country-select__flag">
            <Icon aria-hidden country={value} label="" />
          </span>
        ) : null}
        <span className="rbt-phone-country-select__code">
          {callingCode ? `+${callingCode}` : "Code"}
        </span>
        <span className="rbt-phone-country-select__arrow" aria-hidden="true">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </div>
    </div>
  );
}
