"use client";

import { UserProfileAvatar } from "@/components/common/UserProfileAvatar";

const AVATAR_SIZE_PX = 80;

const containerStyle = {
  flexShrink: 0,
  height: AVATAR_SIZE_PX,
  marginBottom: 0,
  maxWidth: AVATAR_SIZE_PX,
  minWidth: AVATAR_SIZE_PX,
  width: AVATAR_SIZE_PX,
} as const;

const frameStyle = {
  alignItems: "center",
  background: "var(--color-white, #fff)",
  border: "2px solid var(--color-brand-200, #dbeafe)",
  borderRadius: "50%",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  overflow: "hidden",
  width: "100%",
} as const;

type ReviewAuthorAvatarProps = {
  author: string;
  avatarUrl?: string;
};

export function ReviewAuthorAvatar({
  author,
  avatarUrl,
}: ReviewAuthorAvatarProps) {
  return (
    <div className="comment-img" style={containerStyle}>
      <div style={frameStyle}>
        <UserProfileAvatar
          alt={author}
          avatarUrl={avatarUrl}
          failedPhotoFallbackClassName="d-flex align-items-center justify-content-center rbt-bg-color-brand-50"
          missingPhotoFallbackClassName="d-flex align-items-center justify-content-center rbt-bg-color-gray-light"
          missingPhotoIconClassName="fa-regular fa-user rbt-text-color-gray-600"
          nativePhoto
          size={AVATAR_SIZE_PX}
        />
      </div>
    </div>
  );
}
