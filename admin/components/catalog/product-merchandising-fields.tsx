"use client";

import {
  MANUAL_PRODUCT_BADGE_KINDS,
  PRODUCT_BADGE_REGISTRY,
  SUPPRESSIBLE_AUTO_BADGE_KINDS,
  resolveProductCardBadges,
  type ProductBadgeKind,
  type ProductMerchandising,
  type SiteMerchandisingConfig,
} from "@platform/shared";
import { useMemo } from "react";
import { cn } from "@/utils/cn";

export type MerchandisingBadgePreviewInput = {
  price: number;
  compareAtPrice?: number;
  stock: number;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
  unitsSold?: number;
  reviewsEnabled?: boolean;
  merchandisingConfig?: SiteMerchandisingConfig;
};

type ProductMerchandisingFieldsProps = {
  disabled?: boolean;
  merchandising: ProductMerchandising;
  onChange: (next: ProductMerchandising) => void;
  preview?: MerchandisingBadgePreviewInput;
};

const manualOptions = MANUAL_PRODUCT_BADGE_KINDS.map((kind) => ({
  kind,
  label: PRODUCT_BADGE_REGISTRY[kind].label,
  style: PRODUCT_BADGE_REGISTRY[kind].style,
}));

export function ProductMerchandisingFields({
  disabled = false,
  merchandising,
  onChange,
  preview,
}: ProductMerchandisingFieldsProps) {
  const selectedKinds = useMemo(
    () => new Set(merchandising.manualBadges.map((badge) => badge.kind)),
    [merchandising.manualBadges]
  );

  const suppressSet = useMemo(
    () => new Set(merchandising.suppressAutoBadges ?? []),
    [merchandising.suppressAutoBadges]
  );

  const previewBadges = useMemo(() => {
    if (!preview || preview.price < 0 || Number.isNaN(preview.price)) {
      return [];
    }
    return resolveProductCardBadges({
      price: preview.price,
      compareAtPrice: preview.compareAtPrice,
      stock: Math.max(0, preview.stock),
      createdAt: preview.createdAt,
      averageRating: preview.averageRating ?? 0,
      reviewCount: preview.reviewCount ?? 0,
      unitsSold: preview.unitsSold ?? 0,
      reviewsEnabled: preview.reviewsEnabled,
      merchandisingConfig: preview.merchandisingConfig,
      metadata: { merchandising },
    });
  }, [merchandising, preview]);

  function toggleManual(kind: ProductBadgeKind) {
    const exists = merchandising.manualBadges.some(
      (badge) => badge.kind === kind
    );
    if (exists) {
      onChange({
        ...merchandising,
        manualBadges: merchandising.manualBadges.filter(
          (badge) => badge.kind !== kind
        ),
      });
      return;
    }

    if (merchandising.manualBadges.length >= 2) {
      return;
    }

    onChange({
      ...merchandising,
      manualBadges: [...merchandising.manualBadges, { kind }],
    });
  }

  function toggleSuppress(kind: ProductBadgeKind) {
    const current = merchandising.suppressAutoBadges ?? [];
    const next = suppressSet.has(kind)
      ? current.filter((item) => item !== kind)
      : [...current, kind];
    onChange({
      ...merchandising,
      suppressAutoBadges: next.length > 0 ? next : undefined,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-medium text-ink-800">
          Storefront badges (max 2)
        </p>
        <p className="mt-1 text-[12px] text-ink-400">
          Shown on the product image. Auto badges (priority: sold out, sale,
          new, low stock, top rated, best seller) fill free slots unless
          suppressed. Sold out always uses the first slot when stock is zero.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {manualOptions.map(({ kind, label, style }) => {
            const active = selectedKinds.has(kind);
            const atCapacity =
              !active && merchandising.manualBadges.length >= 2;
            return (
              <button
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                  active
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300",
                  (disabled || atCapacity) && "cursor-not-allowed opacity-50"
                )}
                disabled={disabled || atCapacity}
                key={kind}
                onClick={() => toggleManual(kind)}
                type="button"
              >
                <span
                  className={cn(
                    "mr-2 inline-block rounded px-1.5 py-0.5 text-[10px] uppercase text-white",
                    style.includes("gradient") ? "bg-brand-600" : ""
                  )}
                  style={
                    style.includes("gradient")
                      ? undefined
                      : { background: "var(--color-primary, #215ada)" }
                  }
                >
                  {label}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {merchandising.manualBadges.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {merchandising.manualBadges.map((badge) => (
            <span
              className="inline-flex items-center rounded-md bg-ink-900 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
              key={badge.kind}
            >
              {PRODUCT_BADGE_REGISTRY[badge.kind].label}
            </span>
          ))}
        </div>
      ) : null}

      {preview ? (
        <div className="rounded-lg border border-ink-100 bg-surface-body/80 p-3">
          <p className="text-[12px] font-medium text-ink-700">
            Storefront preview
          </p>
          <p className="mt-0.5 text-[11px] text-ink-400">
            Based on current price, stock, and ratings (not saved until you
            submit).
          </p>
          {previewBadges.length === 0 ? (
            <p className="mt-2 text-[12px] text-ink-500">No badges</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {previewBadges.map((badge) => (
                <span
                  className="inline-flex rounded-md bg-ink-900 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
                  key={badge.kind}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div>
        <p className="text-[13px] font-medium text-ink-800">
          Suppress automatic badges
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SUPPRESSIBLE_AUTO_BADGE_KINDS.map((kind) => (
            <label
              className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-600"
              key={kind}
            >
              <input
                checked={suppressSet.has(kind)}
                disabled={disabled}
                onChange={() => toggleSuppress(kind)}
                type="checkbox"
              />
              {PRODUCT_BADGE_REGISTRY[kind].label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
