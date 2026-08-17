"use client";

import { motion } from "framer-motion";
import { Package } from "@/lib/types";
import {
  OwnershipMode,
  priceFor,
  FEATURE_DISCOUNT_LABEL,
} from "@/data/packages";

const EASE = [0.16, 1, 0.3, 1] as const;

interface PackageCardProps {
  pkg: Package;
  index: number;
  mode: OwnershipMode;
  onOpen: (pkg: Package) => void;
}

/**
 * Compact pricing cell. The full spec opens in a shared dialog rather than
 * expanding in place — inline expansion pushed the grid row taller and left
 * the shorter cards in that row showing the grid's gap colour behind them.
 */
export default function PackageCard({ pkg, index, mode, onOpen }: PackageCardProps) {
  const price = priceFor(pkg, mode);
  const isCustom = price === "Custom";

  return (
    <div className="flex h-full flex-col bg-bg p-7 transition-colors duration-300 ease-lusion hover:bg-elevated">
      <span className="type-label-sm text-faint">
        {pkg.tier} · {pkg.discipline} — {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="type-title-sm mt-3 text-ink">{pkg.name}</h3>
      <p className="type-body-sm mt-2 text-dim">{pkg.scope}</p>

      {/* Price — re-keyed so it replays its entrance when the model changes.
          Deliberately NOT AnimatePresence mode="wait": that queues the new
          value behind the old one's exit animation, so a dropped frame would
          leave the WRONG PRICE on screen. Keying without exit swaps the value
          immediately and animates only the incoming span. */}
      <div className="type-title mt-6 overflow-hidden text-ink">
        <motion.span
          key={`${mode}-${price}`}
          className="inline-block"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {isCustom ? "Custom" : `$${price}`}
          {!isCustom && <sup className="type-body-sm ml-0.5 text-dim">+</sup>}
        </motion.span>
      </div>

      {/* Timeline — the question everyone asks straight after price. */}
      <p className="type-label-sm mt-3 text-faint">{pkg.timeline}</p>

      <ul className="mt-5 space-y-1.5">
        {pkg.features.map((f) => (
          <li key={f} className="type-body-sm text-dim">
            — {f}
          </li>
        ))}
      </ul>

      {/* Ongoing-work note, only meaningful on the licence model */}
      {mode === "licence" && !isCustom && (
        <p className="type-body-sm mt-5 text-faint">
          Later features {FEATURE_DISCOUNT_LABEL} off
        </p>
      )}

      {/* mt-auto pins the action to the bottom so every card in a row aligns. */}
      <button
        type="button"
        onClick={() => onOpen(pkg)}
        data-cursor-grow
        className="type-label-sm mt-auto flex items-center gap-2 self-start pt-7 text-dim transition-colors duration-300 hover:text-ink"
      >
        Full details
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 10L10 2M10 2H3M10 2V9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
