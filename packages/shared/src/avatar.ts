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
