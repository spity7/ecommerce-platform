"use client";

import { useState } from "react";
import { getPhoneValidationError, type CountryCode } from "@platform/shared";
import { getDefaultPhoneCountry } from "@platform/site-config";
import PhoneInput from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { cn } from "@/utils/cn";
import { getAdminSiteConfig } from "@/lib/site";
import { AdminPhoneCountrySelect } from "./phone-country-select";

type AdminPhoneInputProps = {
  className?: string;
  defaultValue?: string;
  help?: string;
  label: string;
  name: string;
  required?: boolean;
};

export function AdminPhoneInput({
  className,
  defaultValue = "",
  help,
  label,
  name,
  required,
}: AdminPhoneInputProps) {
  const defaultCountry = getDefaultPhoneCountry(getAdminSiteConfig());
  const [value, setValue] = useState(defaultValue);
  const validationError = getPhoneValidationError(value);

  return (
    <label className={cn("block", className)}>
      <span className="text-[13px] font-semibold text-ink-700">
        {label} {required ? <span className="text-danger-500">*</span> : null}
      </span>
      <PhoneInput
        international={false}
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        labels={en}
        value={value || undefined}
        onChange={(nextValue: string | undefined) => setValue(nextValue ?? "")}
        countrySelectComponent={AdminPhoneCountrySelect}
        countrySelectProps={{
          autoComplete: "tel-country-code",
        }}
        numberInputProps={{
          className:
            "admin-phone-number-input h-10 w-full min-w-0 flex-1 rounded-base border border-surface-line bg-surface-body px-3 text-[14px] placeholder:text-ink-400 focus:border-brand-600",
          required,
          autoComplete: "tel-national",
          placeholder: "Phone number",
          name: "phone-national",
        }}
        className="mt-1.5 flex w-full items-stretch gap-2"
      />
      <input name={name} type="hidden" value={value} />
      {help && !validationError ? (
        <p className="mt-1 text-[12px] text-ink-400">{help}</p>
      ) : null}
      {validationError ? (
        <p className="mt-1 text-[12px] text-danger-500">{validationError}</p>
      ) : null}
    </label>
  );
}
