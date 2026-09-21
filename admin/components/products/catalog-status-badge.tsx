import type { ProductStatus } from "@platform/shared";
import {
  catalogStatusBadgeClass,
  catalogStatusDotClass,
  catalogStatusLabel,
  inventoryBadgeClass,
  inventoryDotClass,
} from "@/lib/catalog-status-ui";
import {
  adminStatusBadgeRootClass,
  adminStatusBadgeSizeClass,
} from "@/lib/admin-status-badge-layout";
import { cn } from "@/utils/cn";

type CatalogStatusBadgeProps = {
  className?: string;
  size?: "md" | "sm";
  status: ProductStatus;
};

export function CatalogStatusBadge({
  className,
  size = "md",
  status,
}: CatalogStatusBadgeProps) {
  const sizing = adminStatusBadgeSizeClass[size];

  return (
    <span
      aria-label={`Status: ${catalogStatusLabel(status)}`}
      className={cn(
        adminStatusBadgeRootClass,
        sizing.root,
        catalogStatusBadgeClass(status),
        className
      )}
      role="status"
    >
      <span
        aria-hidden
        className={cn(
          "rounded-full",
          sizing.dot,
          catalogStatusDotClass(status)
        )}
      />
      <span className={sizing.text}>{catalogStatusLabel(status)}</span>
    </span>
  );
}

type ProductInventoryBadgeProps = {
  className?: string;
  stock: number;
  variant: "low" | "out";
};

export function ProductInventoryBadge({
  className,
  stock,
  variant,
}: ProductInventoryBadgeProps) {
  const label = variant === "out" ? "Out of stock" : "Low stock";

  return (
    <span
      aria-label={`${label}: ${stock} units`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-semibold tabular-nums leading-snug",
        inventoryBadgeClass(variant),
        className
      )}
      role="status"
      title={label}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          inventoryDotClass(variant)
        )}
      />
      {stock}
    </span>
  );
}
