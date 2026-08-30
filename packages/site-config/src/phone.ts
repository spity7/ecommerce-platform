import {
  DEFAULT_PHONE_COUNTRY,
  type CountryCode,
} from "@platform/shared";
import type { SiteConfig } from "@platform/shared";

export function getDefaultPhoneCountry(site: SiteConfig): CountryCode {
  const configured = site.defaultPhoneCountry;
  if (
    configured &&
    typeof configured === "string" &&
    configured.length === 2
  ) {
    return configured.toUpperCase() as CountryCode;
  }

  return DEFAULT_PHONE_COUNTRY;
}
