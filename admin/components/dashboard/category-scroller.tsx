"use client";

import Image from "next/image";
import Link from "next/link";
import { HorizontalScrollArrows } from "@/components/ui/horizontal-scroll-arrows";
import { useHorizontalScroller } from "@/hooks/use-horizontal-scroller";
import { routes } from "@/config/routes";

type CategoryScrollerProps = {
  categories: Array<{
    image: string;
    label: string;
  }>;
};

export function CategoryScroller({ categories }: CategoryScrollerProps) {
  const { atEnd, atStart, scrollerRef, scrollByDirection, updateArrows } =
    useHorizontalScroller(categories);

  return (
    <section className="mt-6 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <div className="flex items-center justify-end gap-3">
        <Link
          className="text-[14px] font-semibold text-brand-600 hover:text-brand-700"
          href={routes.categories}
        >
          View all
        </Link>
        <HorizontalScrollArrows
          atEnd={atEnd}
          atStart={atStart}
          nextLabel="Next categories"
          onNext={() => scrollByDirection("next")}
          onPrev={() => scrollByDirection("prev")}
          prevLabel="Previous categories"
        />
      </div>
      <div
        className="no-scrollbar mt-5 flex flex-nowrap gap-5 overflow-x-auto pb-2"
        onScroll={updateArrows}
        ref={scrollerRef}
      >
        {categories.map((category) => (
          <Link
            className="group min-w-[110px] text-center"
            href={routes.products}
            key={category.label}
          >
            <span className="mx-auto block h-[104px] w-[104px] transition duration-300">
              <Image
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                height={104}
                src={category.image}
                width={104}
              />
            </span>
            <span className="mt-3 block truncate text-[14px] tracking-normal text-ink-600 transition-colors group-hover:text-brand-600">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
