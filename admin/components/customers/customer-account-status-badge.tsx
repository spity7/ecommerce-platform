import {
  customerAccountStatusBadgeClass,
  customerAccountStatusDotClass,
  customerAccountStatusLabel,
} from "@/lib/customer-account-status-ui";
import {
  adminStatusBadgeRootClass,
  adminStatusBadgeSizeClass,
} from "@/lib/admin-status-badge-layout";
import { cn } from "@/utils/cn";

type CustomerAccountStatusBadgeProps = {
  className?: string;
  isActive: boolean;
  size?: "md" | "sm";
};

export function CustomerAccountStatusBadge({
  className,
  isActive,
  size = "md",
}: CustomerAccountStatusBadgeProps) {
  const sizing = adminStatusBadgeSizeClass[size];
  const label = customerAccountStatusLabel(isActive);

  return (
    <span
      aria-label={`Status: ${label}`}
      className={cn(
        adminStatusBadgeRootClass,
        sizing.root,
        customerAccountStatusBadgeClass(isActive),
        className
      )}
      role="status"
    >
      <span
        aria-hidden
        className={cn(
          "rounded-full",
          sizing.dot,
          customerAccountStatusDotClass(isActive)
        )}
      />
      <span className={sizing.text}>{label}</span>
    </span>
  );
}
