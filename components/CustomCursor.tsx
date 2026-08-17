"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * CustomCursor — labs.lusion.co style pointer.
 *
 * A single large, soft, blurred orb (~90px) that trails the real pointer with
 * heavy rAF lerp smoothing. `mix-blend-mode: difference` makes it invert against
 * dark backgrounds, light backgrounds and imagery alike, so one element covers
 * both themes without any colour branching.
 *
 * Desktop + fine pointer only. Position is written straight to the node's style
 * inside the rAF loop — React state is only touched for hover / visibility,
 * never per frame.
 */

const SIZE = 54;               // orb diameter in px
const BLUR = 6;                // softness — scaled with SIZE to stay proportional
const LERP = 0.1;              // follow factor → visible trailing lag
const HOVER_SCALE = 1.5;       // growth over [data-cursor-grow]
const BASE_OPACITY = 0.5;      // translucent: the orb sits *in* the page, not on it
const HOVER_OPACITY = 0.36;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const DESKTOP_QUERY = "(min-width: 901px) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hovering, setHovering] = useState(false);
  // Visible from the start. The native cursor is hidden via CSS, so waiting for
  // a first mousemove would leave the user with no pointer at all on load.
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  /* ── Capability gates: desktop pointer + reduced-motion preference ──────── */
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motion = window.matchMedia(REDUCED_QUERY);

    const syncDesktop = () => setEnabled(desktop.matches);
    const syncMotion = () => setReduced(motion.matches);

    syncDesktop();
    syncMotion();

    desktop.addEventListener("change", syncDesktop);
    motion.addEventListener("change", syncMotion);

    return () => {
      desktop.removeEventListener("change", syncDesktop);
      motion.removeEventListener("change", syncMotion);
    };
  }, []);

  /* ── rAF lerp loop: transform written directly to the node ──────────────── */
  useEffect(() => {
    if (!enabled) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    // Target (real pointer) and current (rendered) positions.
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let started = false;

    // Reduced motion: pin to the pointer, no trailing lag.
    const factor = reduced ? 1 : LERP;

    const paint = () => {
      wrap.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    };

    paint();

    const onMove = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      // The orb starts visible at centre, so it glides to the pointer on the
      // first move rather than teleporting there.
      if (!started) started = true;
    };

    const onWindowLeave = () => setVisible(false);
    const onWindowEnter = () => {
      if (started) setVisible(true);
    };

    const loop = () => {
      cx += (tx - cx) * factor;
      cy += (ty - cy) * factor;
      paint();
      raf = window.requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onWindowLeave);
    document.addEventListener("mouseenter", onWindowEnter);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onWindowLeave);
      document.removeEventListener("mouseenter", onWindowEnter);
    };
  }, [enabled, reduced]);

  /* ── Hover targets: bind [data-cursor-grow], re-scan as the DOM changes ─── */
  useEffect(() => {
    if (!enabled) return;

    type Handlers = { enter: () => void; leave: () => void };
    const bound = new Map<Element, Handlers>();
    let active: Element | null = null;

    const setActive = (el: Element | null) => {
      active = el;
      setHovering(el !== null);
    };

    const scan = () => {
      const present = new Set<Element>();

      document.querySelectorAll("[data-cursor-grow]").forEach((el) => {
        present.add(el);
        if (bound.has(el)) return;

        const enter = () => setActive(el);
        const leave = () => {
          if (active === el) setActive(null);
        };

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        bound.set(el, { enter, leave });
      });

      // Unbind nodes that were removed or lost the attribute; release a stuck
      // hover state if the element we were over disappeared mid-transition.
      bound.forEach((handlers, el) => {
        if (present.has(el)) return;
        el.removeEventListener("pointerenter", handlers.enter);
        el.removeEventListener("pointerleave", handlers.leave);
        bound.delete(el);
        if (active === el) setActive(null);
      });
    };

    scan();

    // Route transitions and lazy sections mount after this effect runs, so keep
    // watching the tree instead of relying on the single initial query.
    let queued = 0;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = window.requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cursor-grow"],
    });

    return () => {
      observer.disconnect();
      if (queued) window.cancelAnimationFrame(queued);
      bound.forEach((handlers, el) => {
        el.removeEventListener("pointerenter", handlers.enter);
        el.removeEventListener("pointerleave", handlers.leave);
      });
      bound.clear();
      active = null;
      setHovering(false);
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-0 w-0"
      style={{
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: reduced ? "none" : `opacity 0.4s ${EASE}`,
        willChange: "transform",
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: SIZE,
          height: SIZE,
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
          backgroundColor: "var(--cursor)",
          filter: `blur(${BLUR}px)`,
          opacity: hovering ? HOVER_OPACITY : BASE_OPACITY,
          transform: `scale(${hovering ? HOVER_SCALE : 1})`,
          transition: reduced
            ? "none"
            : `transform 0.5s ${EASE}, opacity 0.5s ${EASE}`,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
