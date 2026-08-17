"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal trigger that cannot leave content stranded at opacity 0.
 *
 * `whileInView` alone is fragile: if an element is scrolled past without ever
 * intersecting — a restored scroll position on refresh, an in-page anchor, or a
 * very fast flick — the observer never fires and the content stays invisible.
 *
 * This hook reveals when ANY of these is true:
 *   1. the element intersects the viewport (normal case),
 *   2. it is already at or above the fold on mount (restored scroll / anchor),
 *   3. a short safety timeout elapses (last-resort guarantee).
 *
 * Once revealed it never reverts, so there is no flicker.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show immediately, skip the observer entirely.
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    // (2) Already in or above the viewport when we mounted.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setShown(true);
      return;
    }

    // (1) Normal path.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setShown(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    observer.observe(el);

    // (3) Safety net — nothing stays hidden for longer than this.
    const failsafe = window.setTimeout(() => {
      setShown(true);
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return { ref, shown };
}
