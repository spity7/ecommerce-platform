import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export type { CountryCode };

export const DEFAULT_PHONE_COUNTRY: CountryCode = "US";

export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid phone number with country code.";

const COUNTRY_NAME_TO_ISO: Record<string, CountryCode> = {
  afghanistan: "AF",
  albania: "AL",
  algeria: "DZ",
  argentina: "AR",
  australia: "AU",
  austria: "AT",
  bahrain: "BH",
  bangladesh: "BD",
  belgium: "BE",
  brazil: "BR",
  bulgaria: "BG",
  canada: "CA",
  chile: "CL",
  china: "CN",
  colombia: "CO",
  croatia: "HR",
  cyprus: "CY",
  "czech republic": "CZ",
  czechia: "CZ",
  denmark: "DK",
  egypt: "EG",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  "hong kong": "HK",
  hungary: "HU",
  iceland: "IS",
  india: "IN",
  indonesia: "ID",
  ireland: "IE",
  israel: "IL",
  italy: "IT",
  japan: "JP",
  jordan: "JO",
  kenya: "KE",
  kuwait: "KW",
  latvia: "LV",
  lebanon: "LB",
  lithuania: "LT",
  luxembourg: "LU",
  malaysia: "MY",
  mexico: "MX",
  morocco: "MA",
  netherlands: "NL",
  "new zealand": "NZ",
  nigeria: "NG",
  norway: "NO",
  oman: "OM",
  pakistan: "PK",
  philippines: "PH",
  poland: "PL",
  portugal: "PT",
  qatar: "QA",
  romania: "RO",
  "saudi arabia": "SA",
  serbia: "RS",
  singapore: "SG",
  slovakia: "SK",
  slovenia: "SI",
  "south africa": "ZA",
  "south korea": "KR",
  korea: "KR",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  taiwan: "TW",
  thailand: "TH",
  turkey: "TR",
  "united arab emirates": "AE",
  uae: "AE",
  "united kingdom": "GB",
  uk: "GB",
  "great britain": "GB",
  england: "GB",
  scotland: "GB",
  wales: "GB",
  "united states": "US",
  "united states of america": "US",
  usa: "US",
  us: "US",
  vietnam: "VN",
};

export function resolveCountryCode(
  countryName: string | undefined | null
): CountryCode | undefined {
  if (!countryName?.trim()) {
    return undefined;
  }

  const normalized = countryName.trim().toLowerCase();
  return COUNTRY_NAME_TO_ISO[normalized];
}

export function isOptionalValidPhone(value: string | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }

  return isValidPhoneNumber(value.trim());
}

export function normalizePhoneNumber(
  value: string | undefined,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): string | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = parsePhoneNumberFromString(value.trim(), defaultCountry);
  if (!parsed?.isValid()) {
    return undefined;
  }

  return parsed.format("E.164");
}

export function formatPhoneForDisplay(value: string | undefined): string {
  if (!value?.trim()) {
    return "";
  }

  const parsed = parsePhoneNumberFromString(value.trim());
  if (parsed?.isValid()) {
    return parsed.formatInternational();
  }

  return value.trim();
}

export function getPhoneValidationError(value: string | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  return isOptionalValidPhone(value) ? null : PHONE_VALIDATION_MESSAGE;
}
