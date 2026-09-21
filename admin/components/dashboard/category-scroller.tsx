"use client";

import Image from "next/image";
import Link from "next/link";
import { HorizontalScrollArrows } from "@/components/ui/horizontal-scroll-arrows";
import { useHorizontalScroller } from "@/hooks/use-horizontal-scroller";
import { ADMIN_SHOWCASE_CIRCLE } from "@/lib/catalog-image-display";
import { routes } from "@/config/routes";
import { cn } from "@/utils/cn";

export type DashboardCategoryItem = {
  href: string;
  image: string;
  label: string;
};

type CategoryScrollerProps = {
  categories: DashboardCategoryItem[];
};

export function CategoryScroller({ categories }: CategoryScrollerProps) {
  const { atEnd, atStart, scrollerRef, scrollByDirection, updateArrows } =
    useHorizontalScroller(categories);
  const showArrows = !atStart || !atEnd;

  return (
    <section
      aria-label="Categories"
      className="mt-6 rounded-card border border-surface-line bg-surface-card px-6 pb-6 pt-5 shadow-card"
    >
      {showArrows ? (
        <div className="flex items-center justify-end gap-3">
          <HorizontalScrollArrows
            atEnd={atEnd}
            atStart={atStart}
            nextLabel="Next categories"
            onNext={() => scrollByDirection("next")}
            onPrev={() => scrollByDirection("prev")}
            prevLabel="Previous categories"
          />
        </div>
      ) : null}
      {categories.length === 0 ? (
        <p
          className={cn(
            "text-center text-[14px] text-ink-400",
            showArrows ? "mt-6" : ""
          )}
        >
          No categories yet.{" "}
          <Link
            className="font-semibold text-brand-600 hover:text-brand-700"
            href={routes.addCategory}
          >
            Add a category
          </Link>
        </p>
      ) : (
        <div
          className={cn(
            "no-scrollbar flex flex-nowrap gap-4 overflow-x-auto pb-1 sm:gap-5",
            showArrows ? "mt-5" : ""
          )}
          onScroll={updateArrows}
          ref={scrollerRef}
        >
          {categories.map((category) => (
            <Link
              className="group flex w-[88px] shrink-0 flex-col items-center text-center sm:w-[104px]"
              href={category.href}
              key={`${category.href}-${category.label}`}
            >
              <span className="grid h-20 w-20 place-items-center sm:h-[104px] sm:w-[104px]">
                <Image
                  alt=""
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  src={category.image}
                  {...ADMIN_SHOWCASE_CIRCLE}
                />
              </span>
              <span className="mt-3 block w-full truncate whitespace-nowrap text-[14px] tracking-normal text-ink-600 transition-colors group-hover:text-brand-600">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
