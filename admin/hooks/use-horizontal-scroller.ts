"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalScroller<T>(items: T[]) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateArrows = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 1) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    setAtStart(scroller.scrollLeft <= 1);
    setAtEnd(scroller.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    updateArrows();

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const observer = new ResizeObserver(() => updateArrows());
    observer.observe(scroller);

    return () => observer.disconnect();
  }, [items, updateArrows]);

  function scrollByDirection(direction: "next" | "prev") {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const step = Math.max(scroller.clientWidth * 0.8, 200);
    scroller.scrollTo({
      behavior: "smooth",
      left: scroller.scrollLeft + (direction === "next" ? step : -step),
    });
  }

  return {
    atEnd,
    atStart,
    scrollerRef,
    scrollByDirection,
    updateArrows,
  };
}
