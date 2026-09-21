import type { ProductStatus } from "@platform/shared";
import { withBadgeBorderOpacity } from "@/lib/admin-status-badge-layout";

export function catalogStatusLabel(status: ProductStatus): string {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

export function catalogStatusBadgeClass(status: ProductStatus): string {
  let classes: string;
  switch (status) {
    case "published":
      classes = "border-success-200 bg-success-50 text-success-700";
      break;
    case "draft":
      classes = "border-brand-200 bg-brand-50 text-brand-700";
      break;
    case "archived":
      classes = "border-surface-line bg-surface-muted text-ink-500";
      break;
    default:
      classes = "border-surface-line bg-surface-muted text-ink-600";
  }
  return withBadgeBorderOpacity(classes);
}

export function catalogStatusDotClass(status: ProductStatus): string {
  switch (status) {
    case "published":
      return "bg-success-500";
    case "draft":
      return "bg-brand-500";
    case "archived":
      return "bg-ink-400";
    default:
      return "bg-ink-400";
  }
}

export function inventoryBadgeClass(variant: "low" | "out"): string {
  const classes =
    variant === "out"
      ? "border-danger-200 bg-danger-50 text-danger-700"
      : "border-warning-200 bg-warning-50 text-warning-700";
  return withBadgeBorderOpacity(classes);
}

export function inventoryDotClass(variant: "low" | "out"): string {
  return variant === "out" ? "bg-danger-500" : "bg-warning-500";
}

export function catalogStatusMenuTextClass(status: ProductStatus): string {
  switch (status) {
    case "published":
      return "text-success-700";
    case "draft":
      return "text-brand-700";
    case "archived":
      return "text-ink-500";
    default:
      return "text-ink-700";
  }
}

export function catalogStatusCheckedRingClass(status: ProductStatus): string {
  switch (status) {
    case "published":
      return "data-[state=checked]:ring-success-600/25";
    case "draft":
      return "data-[state=checked]:ring-brand-600/25";
    case "archived":
      return "data-[state=checked]:ring-ink-400/30";
    default:
      return "data-[state=checked]:ring-ink-400/30";
  }
}

export function catalogStatusBadgeClassImportant(
  status: ProductStatus
): string {
  return catalogStatusBadgeClass(status)
    .split(/\s+/)
    .map((token) => (token.startsWith("!") ? token : `!${token}`))
    .join(" ");
}

export function isProductStatus(value: string): value is ProductStatus {
  return value === "draft" || value === "published" || value === "archived";
}
