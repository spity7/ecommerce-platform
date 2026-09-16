"use client";

import { getAvatarInitials, normalizeAvatarUrl } from "@platform/shared";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/layout/icon";
import { cn } from "@/utils/cn";

type UserProfileAvatarProps = {
  alt: string;
  avatarUrl?: string | null;
  className?: string;
  size: number;
};

export function UserProfileAvatar({
  alt,
  avatarUrl,
  className,
  size,
}: UserProfileAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = normalizeAvatarUrl(avatarUrl);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  if (src && !imageFailed) {
    return (
      <Image
        alt={alt}
        className={cn("shrink-0 rounded-full object-cover", className)}
        height={size}
        onError={() => setImageFailed(true)}
        src={src}
        unoptimized
        width={size}
      />
    );
  }

  if (src && imageFailed) {
    return (
      <span
        aria-label={`${alt} (profile photo unavailable)`}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[13px] font-semibold uppercase text-brand-700",
          className
        )}
        role="img"
        style={{ height: size, width: size }}
      >
        {getAvatarInitials(alt)}
      </span>
    );
  }

  return (
    <span
      aria-label={alt}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-surface-line bg-surface-muted text-ink-400",
        className
      )}
      role="img"
      style={{ height: size, width: size }}
    >
      <Icon aria-hidden className="h-[55%] w-[55%]" name="user" />
    </span>
  );
}
