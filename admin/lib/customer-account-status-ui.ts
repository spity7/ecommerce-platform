import { withBadgeBorderOpacity } from "@/lib/admin-status-badge-layout";

export type CustomerAccountFilterValue = "active" | "all" | "disabled";

export function customerAccountStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Disabled";
}

export function customerAccountStatusBadgeClass(isActive: boolean): string {
  const classes = isActive
    ? "border-success-200 bg-success-50 text-success-700"
    : "border-danger-200 bg-danger-50 text-danger-700";
  return withBadgeBorderOpacity(classes);
}

export function customerAccountStatusDotClass(isActive: boolean): string {
  return isActive ? "bg-success-500" : "bg-danger-500";
}

export function customerAccountFilterBadgeClassImportant(
  filter: Exclude<CustomerAccountFilterValue, "all">
): string {
  const base =
    filter === "active"
      ? customerAccountStatusBadgeClass(true)
      : customerAccountStatusBadgeClass(false);
  return base
    .split(/\s+/)
    .map((token) => (token.startsWith("!") ? token : `!${token}`))
    .join(" ");
}

export function customerAccountFilterDotClass(
  filter: Exclude<CustomerAccountFilterValue, "all">
): string {
  return filter === "active"
    ? customerAccountStatusDotClass(true)
    : customerAccountStatusDotClass(false);
}

export function isCustomerAccountFilterValue(
  value: string
): value is CustomerAccountFilterValue {
  return value === "all" || value === "active" || value === "disabled";
}
