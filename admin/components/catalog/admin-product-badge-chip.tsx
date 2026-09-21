import {
  getProductBadgeChipAppearance,
  type ProductBadgeChipAppearance,
} from "@platform/shared";
import { cn } from "@/utils/cn";

type AdminProductBadgeChipProps = {
  text: string;
  bgClass?: string;
  appearance?: ProductBadgeChipAppearance;
  size?: "xs" | "sm" | "md" | "lg";
  /** Storefront-style uppercase vs readable sentence case (lists). */
  labelStyle?: "caps" | "sentence";
  className?: string;
  title?: string;
};

export function AdminProductBadgeChip({
  text,
  bgClass,
  appearance,
  size = "md",
  labelStyle = "caps",
  className,
  title,
}: AdminProductBadgeChipProps) {
  const chip =
    appearance ??
    getProductBadgeChipAppearance(bgClass ?? "rbt-product-badge-bg-primary");

  return (
    <span
      className={cn(
        "inline-block max-w-full truncate font-semibold leading-none",
        labelStyle === "caps" && "uppercase tracking-wide",
        labelStyle === "sentence" && "normal-case tracking-normal",
        size === "xs" &&
          labelStyle === "sentence" &&
          "rounded px-1.5 py-0.5 text-[10px] font-medium leading-snug shadow-sm",
        size === "sm" &&
          (labelStyle === "sentence"
            ? "rounded-md px-2 py-0.5 text-[11px]"
            : "rounded px-1.5 py-0.5 text-[9px]"),
        size === "md" && "rounded px-2 py-1 text-[10px]",
        size === "lg" &&
          "rounded-md px-4 py-2 text-[12px] font-bold tracking-wide sm:text-[13px]",
        className
      )}
      title={title ?? text}
      style={{
        background: chip.background,
        color: chip.color,
        border: chip.border,
      }}
    >
      {text}
    </span>
  );
}
