"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type AnimationEvent,
  type FormEvent,
} from "react";
import { getPhoneValidationError, type CountryCode } from "@platform/shared";
import PhoneInput from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import {
  coerceAutofilledPhone,
  looksLikeInternationalPhoneInput,
} from "@/lib/phone";
import { StorefrontPhoneCountrySelect } from "./phone-country-select";
import "./phone-input.scss";

type StorefrontPhoneInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultCountry: CountryCode;
  country?: CountryCode;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  hint?: string;
};

export default function StorefrontPhoneInput({
  id,
  label,
  value,
  onChange,
  defaultCountry,
  country,
  required = false,
  disabled = false,
  error = null,
  hint,
}: StorefrontPhoneInputProps) {
  const validationError = error ?? getPhoneValidationError(value);
  const selectedCountry = country ?? defaultCountry;
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSyncedRawRef = useRef("");

  const getNumberInput = useCallback(() => {
    return containerRef.current?.querySelector<HTMLInputElement>(
      ".rbt-phone-input-field__number"
    );
  }, []);

  const syncAutofillFromDom = useCallback(() => {
    const input = getNumberInput();
    if (!input?.value) {
      return;
    }

    const raw = input.value;
    if (raw === lastSyncedRawRef.current) {
      return;
    }

    if (!looksLikeInternationalPhoneInput(raw)) {
      return;
    }

    const normalized = coerceAutofilledPhone(raw, selectedCountry);
    lastSyncedRawRef.current = raw;

    if (normalized && normalized !== value) {
      onChange(normalized);
    }
  }, [getNumberInput, onChange, selectedCountry, value]);

  useEffect(() => {
    const timers = [50, 200, 500, 1000].map((delay) =>
      window.setTimeout(syncAutofillFromDom, delay)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [syncAutofillFromDom]);

  const handleNumberInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const raw = event.currentTarget.value;
      if (!looksLikeInternationalPhoneInput(raw)) {
        return;
      }

      const normalized = coerceAutofilledPhone(raw, selectedCountry);
      if (normalized && normalized !== value) {
        onChange(normalized);
      }
    },
    [onChange, selectedCountry, value]
  );

  const handleAutofillAnimation = useCallback(
    (event: AnimationEvent<HTMLInputElement>) => {
      if (event.animationName === "rbt-phone-autofill-start") {
        syncAutofillFromDom();
      }
    },
    [syncAutofillFromDom]
  );

  return (
    <div ref={containerRef} className="rbt-input-field-grp rbt-phone-input-field">
      <label className="rbt-field-label" htmlFor={id}>
        {label}
        {required ? <span className="rbt-text-color-danger"> *</span> : null}
      </label>
      <PhoneInput
        id={id}
        international={false}
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        country={selectedCountry}
        labels={en}
        value={value || undefined}
        onChange={(nextValue: string | undefined) => onChange(nextValue ?? "")}
        disabled={disabled}
        countrySelectComponent={StorefrontPhoneCountrySelect}
        countrySelectProps={{
          autoComplete: "tel-country-code",
        }}
        numberInputProps={{
          className: "rbt-input-field rbt-phone-input-field__number",
          required,
          autoComplete: "tel-national",
          placeholder: "Phone number",
          name: "phone-national",
          onInput: handleNumberInput,
          onAnimationStart: handleAutofillAnimation,
        }}
        className="rbt-phone-input-field__control"
      />
      {hint && !validationError ? (
        <p className="rbt-phone-input-field__hint b3 mb--0 mt--8">{hint}</p>
      ) : null}
      {validationError ? (
        <p className="rbt-text-color-danger b3 mb--0 mt--8">
          {validationError}
        </p>
      ) : null}
    </div>
  );
}
