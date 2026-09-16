"use client";

import { getAvatarInitials, normalizeAvatarUrl } from "@platform/shared";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

type UserProfileAvatarProps = {
  avatarUrl?: string | null;
  alt: string;
  size: number;
  className?: string;
  imageClassName?: string;
  /** Shown when the account has no profile photo URL. */
  missingPhotoFallbackClassName?: string;
  missingPhotoIconClassName?: string;
  /** Shown when a profile photo URL exists but the image fails to load. */
  failedPhotoFallbackClassName?: string;
  /** When true, photo uses a native img (referrerPolicy) instead of next/image. */
  nativePhoto?: boolean;
  unoptimized?: boolean;
  style?: CSSProperties;
};

export function UserProfileAvatar({
  avatarUrl,
  alt,
  size,
  imageClassName,
  missingPhotoFallbackClassName = "d-flex align-items-center justify-content-center rbt-bg-color-gray-light h-100 w-100",
  missingPhotoIconClassName = "fa-regular fa-user rbt-text-color-gray-600",
  failedPhotoFallbackClassName = "d-flex align-items-center justify-content-center rbt-bg-color-brand-50 h-100 w-100",
  nativePhoto = false,
  unoptimized = true,
  style,
}: UserProfileAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = normalizeAvatarUrl(avatarUrl);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const iconSizeClass =
    size >= 72 ? "fs-3" : size >= 56 ? "fs-4" : size >= 40 ? "fs-5" : "b1";

  const initialsSizeClass =
    size >= 72 ? "fs-4" : size >= 56 ? "fs-5" : size >= 40 ? "b1" : "b2";

  if (src && !imageFailed) {
    if (nativePhoto) {
      return (
        <img
          alt=""
          aria-hidden
          className={imageClassName}
          onError={() => setImageFailed(true)}
          referrerPolicy="no-referrer"
          src={src}
          style={{
            display: "block",
            height: "100%",
            objectFit: "cover",
            width: "100%",
            ...style,
          }}
        />
      );
    }

    return (
      <Image
        alt={alt}
        className={imageClassName}
        height={size}
        onError={() => setImageFailed(true)}
        src={src}
        style={style}
        unoptimized={unoptimized}
        width={size}
      />
    );
  }

  if (src && imageFailed) {
    return (
      <div
        aria-label={`${alt} (profile photo unavailable)`}
        className={failedPhotoFallbackClassName}
        role="img"
        style={{ height: "100%", width: "100%", ...style }}
      >
        <span
          aria-hidden
          className={`rbt-text-bold rbt-text-color-brand-700 text-uppercase ${initialsSizeClass}`}
        >
          {getAvatarInitials(alt)}
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label={alt}
      className={missingPhotoFallbackClassName}
      role="img"
      style={{ height: "100%", width: "100%", ...style }}
    >
      <i
        aria-hidden
        className={`${missingPhotoIconClassName} ${iconSizeClass}`.trim()}
      />
    </div>
  );
}
