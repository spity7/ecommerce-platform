export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const AVATAR_MAX_SIZE_LABEL = "5 MB";

export const AVATAR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const AVATAR_ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
] as const;

export const AVATAR_FORMATS_LABEL = "JPEG, PNG, WebP, or HEIC";

export const AVATAR_FILE_INPUT_ACCEPT = [
  ...AVATAR_ALLOWED_MIME_TYPES,
  ...AVATAR_ALLOWED_EXTENSIONS,
].join(",");

export function isAllowedAvatarMimeType(mimeType: string): boolean {
  return (AVATAR_ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function getAvatarFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

export function isAllowedAvatarUpload(file: {
  type?: string;
  name: string;
}): boolean {
  if (file.type && isAllowedAvatarMimeType(file.type)) {
    return true;
  }

  return (AVATAR_ALLOWED_EXTENSIONS as readonly string[]).includes(
    getAvatarFileExtension(file.name)
  );
}

/** One or two uppercase initials from a display name (for avatar fallbacks). */
export function getAvatarInitials(name: string, maxLength = 2): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "?";
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, maxLength).toUpperCase();
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  const combined = `${first}${last}`.slice(0, maxLength);
  return combined.toUpperCase() || "?";
}

/** Returns a safe http(s) avatar URL, or undefined when missing or invalid. */
export function normalizeAvatarUrl(url?: string | null): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}
