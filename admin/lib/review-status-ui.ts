import { REVIEW_STATUSES, type ReviewStatus } from "@platform/shared";
import { withBadgeBorderOpacity } from "@/lib/admin-status-badge-layout";

export function reviewStatusLabel(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

export function reviewStatusBadgeClass(status: ReviewStatus): string {
  let classes: string;
  switch (status) {
    case "approved":
      classes = "border-success-200 bg-success-50 text-success-700";
      break;
    case "pending":
      classes = "border-warning-200 bg-warning-50 text-warning-700";
      break;
    case "rejected":
      classes = "border-danger-200 bg-danger-50 text-danger-700";
      break;
    default:
      classes = "border-surface-line bg-surface-muted text-ink-600";
  }
  return withBadgeBorderOpacity(classes);
}

export function reviewStatusDotClass(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return "bg-success-500";
    case "pending":
      return "bg-warning-500";
    case "rejected":
      return "bg-danger-500";
    default:
      return "bg-ink-400";
  }
}

export function reviewStatusMenuTextClass(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return "text-success-700";
    case "pending":
      return "text-warning-700";
    case "rejected":
      return "text-danger-700";
    default:
      return "text-ink-700";
  }
}

export function reviewStatusCheckedRingClass(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return "data-[state=checked]:ring-success-600/25";
    case "pending":
      return "data-[state=checked]:ring-warning-600/25";
    case "rejected":
      return "data-[state=checked]:ring-danger-600/25";
    default:
      return "data-[state=checked]:ring-ink-400/30";
  }
}

export function reviewStatusBadgeClassImportant(status: ReviewStatus): string {
  return reviewStatusBadgeClass(status)
    .split(/\s+/)
    .map((token) => (token.startsWith("!") ? token : `!${token}`))
    .join(" ");
}

export function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}
