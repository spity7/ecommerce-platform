"use client";

import {
  PRODUCT_BADGE_REGISTRY,
  SUPPRESSIBLE_AUTO_BADGE_KINDS,
  getAutoProductBadgeRuleHintLong,
  getAutoProductBadgeRuleHintShort,
  getProductBadgeChipAppearanceForKind,
  resolveProductCardBadges,
  type ProductBadgeKind,
  type ProductMerchandising,
  type SiteMerchandisingConfig,
} from "@platform/shared";
import { useMemo } from "react";
import { AdminProductBadgeChip } from "@/components/catalog/admin-product-badge-chip";
import { Icon } from "@/components/layout/icon";
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
  manualBadgeKinds: ProductBadgeKind[];
  merchandising: ProductMerchandising;
  onChange: (next: ProductMerchandising) => void;
  preview?: MerchandisingBadgePreviewInput;
  /** Site thresholds for auto badge hints (used when preview is unavailable). */
  merchandisingConfig?: SiteMerchandisingConfig;
  reviewsEnabled?: boolean;
};

function buildManualOptions(kinds: ProductBadgeKind[]) {
  return kinds.map((kind) => ({
    kind,
    label: PRODUCT_BADGE_REGISTRY[kind].label,
    appearance: getProductBadgeChipAppearanceForKind(kind),
  }));
}

export function ProductMerchandisingFields({
  disabled = false,
  manualBadgeKinds,
  merchandising,
  onChange,
  preview,
  merchandisingConfig: merchandisingConfigProp,
  reviewsEnabled: reviewsEnabledProp,
}: ProductMerchandisingFieldsProps) {
  const manualOptions = useMemo(
    () => buildManualOptions(manualBadgeKinds),
    [manualBadgeKinds]
  );
  const selectedKinds = useMemo(
    () => new Set(merchandising.manualBadges.map((badge) => badge.kind)),
    [merchandising.manualBadges]
  );

  const suppressSet = useMemo(
    () => new Set(merchandising.suppressAutoBadges ?? []),
    [merchandising.suppressAutoBadges]
  );

  const merchandisingConfig =
    preview?.merchandisingConfig ?? merchandisingConfigProp;
  const reviewsEnabled = preview?.reviewsEnabled ?? reviewsEnabledProp ?? true;

  const autoHintOptions = useMemo(
    () => ({
      config: merchandisingConfig,
      reviewsEnabled,
    }),
    [merchandisingConfig, reviewsEnabled]
  );

  const resolveInput = useMemo(() => {
    if (!preview || preview.price < 0 || Number.isNaN(preview.price)) {
      return null;
    }
    return {
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
    };
  }, [merchandising, preview]);

  const previewBadges = useMemo(() => {
    if (!resolveInput) {
      return [];
    }
    return resolveProductCardBadges(resolveInput);
  }, [resolveInput]);

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

  const panelHeaderClass =
    "border-b border-surface-line/80 px-4 py-3.5 sm:px-5";
  const panelTitleClass = "text-sm font-semibold leading-tight text-ink-900";
  const panelSubtitleClass = "mt-1 text-xs leading-normal text-ink-500";

  return (
    <div className="space-y-6">
      <div>
        <p className={panelTitleClass}>Manual badges (max 2)</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {manualOptions.map(({ kind, label, appearance }) => {
            const active = selectedKinds.has(kind);
            const atCapacity =
              !active && merchandising.manualBadges.length >= 2;
            const ariaLabel =
              kind === "best_seller"
                ? `${label} — manual pin or automatic when units sold threshold is met`
                : label;
            return (
              <li className="max-w-full min-w-0" key={kind}>
                <button
                  aria-label={ariaLabel}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2",
                    active
                      ? "border-2 border-brand-500 bg-brand-50/70 pr-2 shadow-[0_2px_12px_rgba(33,90,218,0.18),0_1px_3px_rgba(16,24,40,0.06)]"
                      : "border-2 border-transparent bg-transparent shadow-none hover:bg-surface-muted/35",
                    (disabled || atCapacity) &&
                      !active &&
                      "cursor-not-allowed opacity-40 hover:bg-transparent"
                  )}
                  disabled={disabled || (atCapacity && !active)}
                  onClick={() => toggleManual(kind)}
                  title={ariaLabel}
                  type="button"
                >
                  <AdminProductBadgeChip
                    appearance={appearance}
                    className="max-w-full"
                    size="lg"
                    text={label}
                  />
                  {active ? (
                    <span
                      aria-hidden
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"
                    >
                      <Icon className="h-3 w-3" name="check" />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="min-w-0">
        <div
          className={cn(
            "grid min-w-0 gap-4",
            preview
              ? "md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:items-stretch"
              : undefined
          )}
        >
          {preview ? (
            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-surface-line/80 bg-surface-card shadow-card md:max-w-[11rem]">
              <div className={panelHeaderClass}>
                <p className={panelTitleClass}>Storefront preview</p>
                <p className={panelSubtitleClass}>
                  Resolved from price, stock, reviews, and units sold.
                </p>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div
                  aria-label="Product card badge preview"
                  className="relative min-h-[9rem] flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-surface-muted via-surface-body to-ink-100 ring-1 ring-inset ring-surface-line/60 md:min-h-[11rem]"
                  role="img"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.85) 0%, transparent 50%)",
                    }}
                  />
                  {previewBadges.length === 0 ? (
                    <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-medium text-ink-500">
                      No badges would show on the card
                    </p>
                  ) : (
                    <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-col gap-1.5 sm:left-4 sm:top-4">
                      {previewBadges.map((badge) => (
                        <AdminProductBadgeChip
                          bgClass={badge.bg}
                          key={badge.kind ?? badge.text}
                          size="md"
                          text={badge.text}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-surface-line/80 bg-surface-card shadow-card">
            <div className={panelHeaderClass}>
              <p className={panelTitleClass}>Automatic badges</p>
              <p className={panelSubtitleClass}>
                Uncheck to suppress an auto badge for this product.
              </p>
            </div>
            <ul className="grid flex-1 grid-cols-2 gap-1.5 p-4 sm:p-5">
              {SUPPRESSIBLE_AUTO_BADGE_KINDS.map((kind) => {
                const suppressed = suppressSet.has(kind);
                const enabled = !suppressed;
                const label = PRODUCT_BADGE_REGISTRY[kind].label;
                const appearance = getProductBadgeChipAppearanceForKind(kind);
                const hintShort = getAutoProductBadgeRuleHintShort(
                  kind,
                  autoHintOptions
                );
                const hintLong = getAutoProductBadgeRuleHintLong(
                  kind,
                  autoHintOptions
                );
                return (
                  <li className="min-w-0" key={kind}>
                    <label
                      className={cn(
                        "group flex h-full w-full min-w-0 cursor-pointer flex-col gap-1 rounded-lg px-2.5 py-2 ring-1 ring-inset transition-[background-color,box-shadow,opacity,ring-color] duration-200 ease-out focus-within:outline focus-within:ring-2 focus-within:ring-brand-500/35 focus-within:ring-offset-2",
                        enabled
                          ? "bg-surface-card shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-surface-line/90"
                          : "bg-surface-muted/20 ring-surface-line/60 hover:bg-surface-muted/35",
                        disabled &&
                          "cursor-not-allowed opacity-50 hover:bg-surface-muted/20"
                      )}
                      title={hintLong}
                    >
                      <input
                        aria-label={`${label}${hintShort ? ` — ${hintShort}` : ""}. ${enabled ? "Shown on storefront when rules match" : "Suppressed for this product"}`}
                        checked={enabled}
                        className="sr-only"
                        disabled={disabled}
                        onChange={() => toggleSuppress(kind)}
                        type="checkbox"
                      />
                      <span className="flex min-w-0 items-center justify-between gap-2">
                        <AdminProductBadgeChip
                          appearance={appearance}
                          className={cn(
                            "min-w-0 max-w-[calc(100%-1.75rem)] truncate",
                            suppressed && "opacity-40 saturate-[0.55]"
                          )}
                          labelStyle="sentence"
                          size="sm"
                          text={label}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                            enabled
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-ink-300/80 bg-surface-card text-transparent group-hover:border-ink-400"
                          )}
                        >
                          <Icon className="h-3 w-3" name="check" />
                        </span>
                      </span>
                      {hintShort ? (
                        <span
                          className={cn(
                            "block text-[11px] leading-snug",
                            enabled ? "text-ink-600" : "text-ink-400"
                          )}
                        >
                          {hintShort}
                        </span>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
