"use client";

import Image from "next/image";
import Link from "next/link";
import { HorizontalScrollArrows } from "@/components/ui/horizontal-scroll-arrows";
import { useHorizontalScroller } from "@/hooks/use-horizontal-scroller";
import { ADMIN_SHOWCASE_CIRCLE } from "@/lib/catalog-image-display";
import { brandEditPath, categoryEditPath } from "@/lib/paths";
import { cn } from "@/utils/cn";

type CategoryShowcaseItem = {
  id: string;
  image: string;
  name: string;
};

type BrandShowcaseItem = {
  id: string;
  initials: string;
  name: string;
  tileClass: string;
};

type ShowcaseStripProps =
  | {
      items: BrandShowcaseItem[];
      type: "brand";
    }
  | {
      items: CategoryShowcaseItem[];
      type: "category";
    };

export function ShowcaseStrip({ items, type }: ShowcaseStripProps) {
  const isCategory = type === "category";
  const prevLabel = isCategory ? "Previous categories" : "Previous brands";
  const nextLabel = isCategory ? "Next categories" : "Next brands";
  const { atEnd, atStart, scrollerRef, scrollByDirection, updateArrows } =
    useHorizontalScroller(items);
  const showArrows = !atStart || !atEnd;

  return (
    <section className="mb-6 rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
      {showArrows ? (
        <div className="flex items-center justify-end gap-3">
          <HorizontalScrollArrows
            atEnd={atEnd}
            atStart={atStart}
            nextLabel={nextLabel}
            onNext={() => scrollByDirection("next")}
            onPrev={() => scrollByDirection("prev")}
            prevLabel={prevLabel}
          />
        </div>
      ) : null}
      <div
        className={cn(
          "no-scrollbar flex flex-nowrap gap-3 overflow-x-auto pb-2",
          showArrows ? "mt-5" : ""
        )}
        onScroll={updateArrows}
        ref={scrollerRef}
      >
        {isCategory
          ? items.map((item) => (
              <Link
                className="group flex min-w-27.5 flex-col items-center rounded-base px-4 py-4 text-center transition-colors"
                href={categoryEditPath(item.id)}
                key={item.id}
              >
                <Image
                  alt={item.name}
                  className="h-26 w-26 rounded-full object-cover transition-transform group-hover:scale-105"
                  src={item.image}
                  {...ADMIN_SHOWCASE_CIRCLE}
                />
                <span className="mt-3 line-clamp-1 text-[14px] font-semibold text-ink-900 group-hover:text-brand-600">
                  {item.name}
                </span>
              </Link>
            ))
          : items.map((item) => (
              <Link
                className="group flex min-w-27.5 flex-col items-center rounded-base px-4 py-4 text-center transition-colors"
                href={brandEditPath(item.id)}
                key={item.id}
              >
                <span
                  className={cn(
                    "grid h-20 w-20 place-items-center rounded-full text-[22px] font-semibold transition-transform group-hover:scale-105",
                    item.tileClass
                  )}
                >
                  {item.initials}
                </span>
                <span className="mt-3 line-clamp-1 text-[14px] font-semibold text-ink-900 group-hover:text-brand-600">
                  {item.name}
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}
