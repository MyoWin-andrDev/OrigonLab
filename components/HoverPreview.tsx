"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   HoverPreview — the floating thumbnail that trails the cursor.

   Reference: the labs.lusion.co index rows. Hovering a row raises a
   card that follows the pointer with a lag and banks into the
   direction of travel, then drops away when the pointer leaves.

   Motion notes
   ────────────
   • Position is lerped toward the pointer, so the card trails rather
     than sticking to it.
   • Tilt is driven by the *velocity* of the eased position, not the
     raw pointer, which keeps the bank smooth instead of jittery.
   • Everything is written straight to node style inside one rAF
     loop — React state only carries which item is hovered.
   ═══════════════════════════════════════════════════════════════ */

const WIDTH = 260;
const HEIGHT = 320;
const LERP = 0.14; // follow easing — lower trails further
const TILT_PER_PX = 0.55; // degrees of bank per px/frame of travel
const MAX_TILT = 16; // clamp so it never cartwheels
const SKEW_PER_PX = 0.14;
const MAX_SKEW = 5;

interface PreviewItem {
  title: string;
  gradientFrom: string;
  gradientTo: string;
}

interface PreviewCtx {
  show: (item: PreviewItem) => void;
  hide: () => void;
}

const Ctx = createContext<PreviewCtx>({ show: () => {}, hide: () => {} });

/** Call from any row/card to drive the shared floating preview. */
export const useHoverPreview = () => useContext(Ctx);

export default function HoverPreview({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<PreviewItem | null>(null);
  const [enabled, setEnabled] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Desktop + fine pointer only — a trailing card is meaningless on touch. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(mq.matches && !reduced.matches);
    sync();
    mq.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  /* One rAF loop for the whole lifetime — the card is only ever
     transformed, never re-rendered, while it follows. */
  useEffect(() => {
    if (!enabled) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let primed = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!primed) {
        // Drop the card at the pointer the first time so it doesn't
        // sweep across the screen on the very first hover.
        primed = true;
        cx = tx;
        cy = ty;
      }
    };

    const loop = () => {
      const prevX = cx;
      const prevY = cy;

      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;

      const node = cardRef.current;
      if (node) {
        const vx = cx - prevX;
        const vy = cy - prevY;

        // Bank into the turn; skew a little for a sense of air resistance.
        const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, vx * TILT_PER_PX));
        const skew = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, vy * SKEW_PER_PX));

        node.style.transform =
          `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) ` +
          `rotate(${tilt.toFixed(2)}deg) skewY(${skew.toFixed(2)}deg)`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  const show = (next: PreviewItem) => {
    if (enabled) setItem(next);
  };
  const hide = () => setItem(null);

  return (
    <Ctx.Provider value={{ show, hide }}>
      {children}

      {enabled && (
        <div
          ref={cardRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
        >
          <div
            className={[
              "overflow-hidden rounded-card",
              "transition-[opacity,scale] duration-500 ease-lusion",
              item ? "scale-100 opacity-100" : "scale-90 opacity-0",
            ].join(" ")}
            style={{ width: WIDTH, height: HEIGHT }}
          >
            {item && (
              <div
                className={`relative h-full w-full bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo}`}
              >
                {/* Scrim + label, matching the index cards */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)",
                  }}
                />
                <span
                  className="type-label-sm absolute bottom-4 left-4"
                  style={{ color: "rgba(255,255,255,0.92)" }}
                >
                  {item.title}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
