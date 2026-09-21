import type { ReviewStatus } from "@platform/shared";
import {
  reviewStatusBadgeClass,
  reviewStatusDotClass,
  reviewStatusLabel,
} from "@/lib/review-status-ui";
import {
  adminStatusBadgeRootClass,
  adminStatusBadgeSizeClass,
} from "@/lib/admin-status-badge-layout";
import { cn } from "@/utils/cn";

type ReviewStatusBadgeProps = {
  className?: string;
  size?: "md" | "sm";
  status: ReviewStatus;
};

export function ReviewStatusBadge({
  className,
  size = "md",
  status,
}: ReviewStatusBadgeProps) {
  const sizing = adminStatusBadgeSizeClass[size];

  return (
    <span
      aria-label={`Status: ${reviewStatusLabel(status)}`}
      className={cn(
        adminStatusBadgeRootClass,
        sizing.root,
        reviewStatusBadgeClass(status),
        className
      )}
      role="status"
    >
      <span
        aria-hidden
        className={cn("rounded-full", sizing.dot, reviewStatusDotClass(status))}
      />
      <span className={sizing.text}>{reviewStatusLabel(status)}</span>
    </span>
  );
}
