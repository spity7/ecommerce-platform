/** Maps solid badge border tokens to low-alpha hues (readable but not heavy). */
const SOFT_BADGE_BORDER: Record<string, string> = {
  "border-brand-200": "border-brand-600/12",
  "border-danger-100": "border-danger-600/10",
  "border-danger-200": "border-danger-600/12",
  "border-success-100": "border-success-600/10",
  "border-success-200": "border-success-600/12",
  "border-surface-line": "border-ink-400/18",
  "border-warning-100": "border-warning-600/10",
  "border-warning-200": "border-warning-600/12",
};

/** Softens badge outline without changing fill or text tokens. */
export function withBadgeBorderOpacity(classNames: string): string {
  return classNames
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const important = token.startsWith("!");
      const bare = important ? token.slice(1) : token;
      if (!bare.startsWith("border-")) {
        return token;
      }
      if (bare.includes("/")) {
        return token;
      }
      const soft = SOFT_BADGE_BORDER[bare];
      if (soft) {
        return `${important ? "!" : ""}${soft}`;
      }
      return `${important ? "!" : ""}${bare}/25`;
    })
    .join(" ");
}

/** Shared pill badge metrics — avoid `leading-none`, which clips descenders (g, p, y). */
export const adminStatusBadgeSizeClass = {
  md: {
    dot: "size-2 shrink-0",
    root: "gap-1.5 px-2.5 py-1.5 text-[12px] leading-snug tracking-[0.02em]",
    text: "min-w-0 truncate leading-snug",
  },
  sm: {
    dot: "size-1.5 shrink-0",
    root: "gap-1 px-2 py-1 text-[11px] leading-snug tracking-[0.02em]",
    text: "min-w-0 truncate leading-snug",
  },
} as const;

export const adminStatusBadgeRootClass =
  "inline-flex max-w-full items-center rounded-full border font-semibold";
