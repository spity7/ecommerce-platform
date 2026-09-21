"use client";

import { Icon } from "@/components/layout/icon";

const arrowButtonClass =
  "grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-surface-line text-ink-600 transition-colors hover:bg-surface-muted hover:text-ink-900";

type HorizontalScrollArrowsProps = {
  atEnd: boolean;
  atStart: boolean;
  nextLabel: string;
  onNext: () => void;
  onPrev: () => void;
  prevLabel: string;
};

export function HorizontalScrollArrows({
  atEnd,
  atStart,
  nextLabel,
  onNext,
  onPrev,
  prevLabel,
}: HorizontalScrollArrowsProps) {
  const showPrev = !atStart;
  const showNext = !atEnd;

  if (!showPrev && !showNext) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      {showPrev ? (
        <button
          aria-label={prevLabel}
          className={arrowButtonClass}
          onClick={onPrev}
          type="button"
        >
          <Icon className="h-4 w-4" name="chevron-left" />
        </button>
      ) : null}
      {showNext ? (
        <button
          aria-label={nextLabel}
          className={arrowButtonClass}
          onClick={onNext}
          type="button"
        >
          <Icon className="h-4 w-4" name="chevron-right" />
        </button>
      ) : null}
    </div>
  );
}
