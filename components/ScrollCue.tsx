"use client";

import { motion } from "framer-motion";

/**
 * "SCROLL DOWN" cue from labs.lusion.co — a mono label with a thin line
 * that travels downward on a loop.
 */
export default function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="type-label-sm text-faint">Scroll down</span>
      <span className="relative block h-10 w-px overflow-hidden bg-line">
        <motion.span
          className="absolute inset-x-0 block h-4 bg-ink"
          initial={{ y: "-100%" }}
          animate={{ y: "250%" }}
          transition={{
            duration: 1.9,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      </span>
    </div>
  );
}
