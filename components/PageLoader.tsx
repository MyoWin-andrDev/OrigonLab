"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   PAGE LOADER
   Reference: labs.lusion.co intro.
   Solid bg, bottom-aligned 90px counter on the right, mono wordmark
   on the left, hairline progress bar pinned to the very bottom edge.
   Shows once per session, then unmounts completely.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STORAGE_KEY = "origon-loaded";
const TOTAL = 100;
const DURATION_MS = 1800;
const TICK_MS = DURATION_MS / TOTAL; // 18ms per step
const HOLD_MS = 200; // beat on 100 before the exit
const EXIT_MS = 0.8; // seconds (framer)

type Phase =
  | "idle" // pre-decision (also the SSR pass) — renders nothing
  | "running" // counting up
  | "exiting" // playing the exit animation
  | "done"; // fully gone

/* Decide before paint on the client; fall back to useEffect on the server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function markSeen(): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / storage disabled — loader simply shows again */
  }
}

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PageLoader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useIsomorphicLayoutEffect(() => {
    const clearTimers = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Second visit of the session, or reduced motion — skip straight to done.
    if (alreadySeen() || prefersReducedMotion()) {
      markSeen();
      setPhase("done");
      return clearTimers;
    }

    setPhase("running");

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      setCount(current);

      if (current >= TOTAL) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          markSeen();
          setPhase("exiting");
        }, HOLD_MS);
      }
    }, TICK_MS);

    return clearTimers;
  }, []);

  // Nothing in the tree before the decision, and nothing after the exit —
  // so no stray fixed overlay can swallow clicks.
  if (phase === "idle" || phase === "done") return null;

  return (
    <AnimatePresence onExitComplete={() => setPhase("done")}>
      {phase === "running" && (
        <motion.div
          key="page-loader"
          aria-hidden
          className="fixed inset-0 z-[100] flex select-none flex-col justify-end bg-bg"
          exit={{ opacity: 0, y: "-4%" }}
          transition={{ duration: EXIT_MS, ease: EASE }}
        >
          <div className="flex w-full items-end justify-between gap-6 px-6 pb-12 md:px-12 md:pb-16">
            <span className="type-label-sm text-dim">OrigonLab</span>
            <span className="type-counter text-ink">
              {String(count).padStart(3, "0")}
            </span>
          </div>

          {/* Progress rail — pinned to the very bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-line">
            <motion.div
              className="h-full bg-ink"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ duration: TICK_MS / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
