export const ACCESS_TOKEN_COOKIE = "platform_access_token";
export const REFRESH_TOKEN_COOKIE = "platform_refresh_token";

const DEFAULT_ACCESS_MAX_AGE = 60 * 15;
const DEFAULT_REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

function parseMaxAge(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const ACCESS_TOKEN_MAX_AGE = parseMaxAge(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_MAX_AGE,
  DEFAULT_ACCESS_MAX_AGE
);

export const REFRESH_TOKEN_MAX_AGE = parseMaxAge(
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_MAX_AGE,
  DEFAULT_REFRESH_MAX_AGE
);

/** Clears legacy non-httpOnly cookies from older sessions. */
export function clearLegacyAuthCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`;
}
