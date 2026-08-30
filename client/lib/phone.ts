import { getDefaultPhoneCountry } from "@platform/site-config";
import {
  normalizePhoneNumber,
  resolveCountryCode,
  type CountryCode,
} from "@platform/shared";
import { getStorefrontSiteConfig } from "@/lib/site";

export function getStorefrontDefaultPhoneCountry(): CountryCode {
  return getDefaultPhoneCountry(getStorefrontSiteConfig());
}

export function resolveStorefrontPhoneCountry(
  countryName?: string
): CountryCode {
  return resolveCountryCode(countryName) ?? getStorefrontDefaultPhoneCountry();
}

/** Normalize browser autofill values (often full international) to E.164. */
export function coerceAutofilledPhone(
  raw: string,
  defaultCountry: CountryCode
): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  const normalized = normalizePhoneNumber(trimmed, defaultCountry);
  if (normalized) {
    return normalized;
  }

  return trimmed;
}

export function looksLikeInternationalPhoneInput(raw: string): boolean {
  const trimmed = raw.trim();
  return trimmed.startsWith("+") || trimmed.startsWith("00");
}
