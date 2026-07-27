"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared behaviour for the site's horizontal-scroll "rail" carousels
 * (InitiativeCard rows, partner rows, news strip, etc).
 *
 * Encapsulates:
 * - atStart / atEnd edge tracking (drives disabled arrow state + fade sides)
 * - a JS-computed CSS mask-image for the edge fade, sized by `fadeWidth`
 * - scrollByVisible(dir): scrolls by the container's actual visible width,
 *   not a hardcoded card count — fixes the "scrolls 2 cards, shows 1" bug
 * - a 0..1 scroll progress ratio + whether the content overflows at all
 *   (progress bar should only render when it does)
 */
export function useScrollRail<T extends HTMLElement = HTMLDivElement>(
  fadeWidth = 32,
) {
  const ref = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overflows, setOverflows] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    setOverflows(max > 2);
    setProgress(max > 2 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByVisible = useCallback((dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }, []);

  const maskImage = `linear-gradient(to right, ${atStart ? "black" : "transparent"} 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), ${atEnd ? "black" : "transparent"} 100%)`;

  return { ref, atStart, atEnd, scrollByVisible, maskImage, progress, overflows };
}
