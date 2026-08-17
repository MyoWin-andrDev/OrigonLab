"use client";

import { motion } from "framer-motion";
import {
  OwnershipMode,
  OWNERSHIP_MULTIPLIER,
  FEATURE_DISCOUNT_LABEL,
} from "@/data/packages";

const EASE = [0.16, 1, 0.3, 1] as const;

const OPTIONS: {
  key: OwnershipMode;
  label: string;
  note: string;
  benefit: string;
}[] = [
  {
    key: "licence",
    label: "We keep the source",
    note: "Listed price",
    benefit: `Later features ${FEATURE_DISCOUNT_LABEL} off — we hold and maintain the code`,
  },
  {
    key: "owned",
    label: "You own everything",
    note: `${OWNERSHIP_MULTIPLIER}× listed price`,
    benefit: "Design files and full source assigned to you, yours to take anywhere",
  },
];

interface OwnershipToggleProps {
  mode: OwnershipMode;
  onChange: (mode: OwnershipMode) => void;
  /**
   * "panels" — two explained cards, for the pricing page.
   * "inline" — a compact segmented pill, for tighter contexts like the
   *            estimator, where the explanation already sits nearby.
   */
  variant?: "panels" | "inline";
}

/**
 * Chooses the commercial model every price on the page is quoted against.
 *
 * Built as two explained panels rather than a bare switch: the difference is
 * not just a multiplier, so each side has to say what you actually get.
 */
export default function OwnershipToggle({
  mode,
  onChange,
  variant = "panels",
}: OwnershipToggleProps) {
  if (variant === "inline") {
    return (
      <div
        role="radiogroup"
        aria-label="Ownership model"
        className="inline-flex items-center rounded-pill border border-line p-1"
      >
        {OPTIONS.map((option) => {
          const active = mode === option.key;
          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.key)}
              data-cursor-grow
              className="relative rounded-pill px-4 py-2"
            >
              {active && (
                <motion.span
                  layoutId="ownership-active-inline"
                  aria-hidden
                  className="absolute inset-0 rounded-pill bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                />
              )}
              <span
                className={`type-label-sm relative z-10 whitespace-nowrap transition-colors duration-300 ${
                  active ? "text-bg" : "text-dim"
                }`}
              >
                {option.key === "owned" ? "I own it" : "You keep it"}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Ownership model"
      className="grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2"
    >
      {OPTIONS.map((option) => {
        const active = mode === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.key)}
            data-cursor-grow
            className="group relative bg-bg p-6 text-left transition-colors duration-300 ease-lusion hover:bg-elevated sm:p-7"
          >
            {/* Sliding active fill — one layoutId so it travels between panels */}
            {active && (
              <motion.span
                layoutId="ownership-active"
                aria-hidden
                className="absolute inset-0 bg-elevated"
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
              />
            )}

            <span className="relative z-10 block">
              <span className="flex items-center gap-2.5">
                {/* Radio dot */}
                <span
                  aria-hidden
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    active ? "border-ink" : "border-lineStrong"
                  }`}
                >
                  <motion.span
                    className="block h-2 w-2 rounded-full bg-ink"
                    animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>

                <span
                  className={`type-title-sm transition-colors duration-300 ${
                    active ? "text-ink" : "text-dim group-hover:text-ink"
                  }`}
                >
                  {option.label}
                </span>
              </span>

              <span className="type-label-sm mt-3 block text-faint">
                {option.note}
              </span>

              <span className="type-body-sm mt-2 block text-dim">
                {option.benefit}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
