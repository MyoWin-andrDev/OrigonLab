"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Package } from "@/lib/types";
import {
  OwnershipMode,
  priceFor,
  handoverFor,
  FEATURE_DISCOUNT_LABEL,
} from "@/data/packages";

const EASE = [0.16, 1, 0.3, 1] as const;

interface PackageDialogProps {
  pkg: Package | null;
  /** Ownership model the price and handover terms are quoted against. */
  mode: OwnershipMode;
  onClose: () => void;
}

/**
 * Full package spec, shown as a centred dialog.
 *
 * Expanding inline inside the 3-up grid pushed the row taller and exposed the
 * grid's gap colour behind the shorter cards. A dialog keeps the grid perfectly
 * intact and gives the detail room to breathe.
 */
export default function PackageDialog({ pkg, mode, onClose }: PackageDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const open = pkg !== null;

  /* Esc to close, focus handling, and scroll lock while open. */
  useEffect(() => {
    if (!open) return;

    restoreFocus.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      // Minimal focus trap: keep Tab inside the panel.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Lock scroll without the layout jumping as the scrollbar disappears.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", onKey);
    // Focus synchronously: the panel is already committed by the time this
    // effect runs, and deferring to rAF would silently skip focus entirely in
    // a throttled or backgrounded tab.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {pkg && (
        <motion.div
          key="package-dialog"
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            data-cursor-grow
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="package-dialog-title"
            tabIndex={-1}
            initial={{ y: 28, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.99, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="
              relative flex max-h-[88vh] w-full max-w-2xl flex-col
              overflow-hidden rounded-t-card border border-line bg-elevated
              outline-none sm:max-h-[85vh] sm:rounded-card
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6 border-b border-line px-7 py-6 sm:px-9">
              <div className="min-w-0">
                <span className="type-label-sm text-faint">
                  {pkg.tier} · {pkg.discipline}
                </span>
                <h2 id="package-dialog-title" className="type-display-md mt-2 text-ink">
                  {pkg.name}
                </h2>
                <p className="type-body-sm mt-2 text-dim">{pkg.scope}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                data-cursor-grow
                aria-label="Close details"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-dim transition-colors duration-300 hover:border-lineStrong hover:text-ink"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Price + timeline strip */}
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-7 py-5 sm:px-9">
              <span className="type-display-md text-ink">
                {priceFor(pkg, mode) === "Custom"
                  ? "Custom"
                  : `$${priceFor(pkg, mode)}`}
                {priceFor(pkg, mode) !== "Custom" && (
                  <sup className="type-body-sm ml-0.5 text-dim">+</sup>
                )}
              </span>
              <span className="type-label-sm text-right text-faint">
                <span className="block">{pkg.timeline}</span>
                <span className="mt-1 block">
                  {mode === "owned" ? "You own the source" : "We keep the source"}
                </span>
              </span>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-7 py-7 sm:px-9">
              <span className="type-label-sm text-faint">Who it&apos;s for</span>
              <p className="type-body mt-2 text-inkMuted">{pkg.audience}</p>

              <span className="type-label-sm mt-8 block text-faint">What you get</span>
              <ul className="mt-4 space-y-5">
                {pkg.deliverables.map((d) => (
                  <li key={d.label}>
                    <span className="type-title-sm block text-ink">{d.label}</span>
                    <span className="type-body-sm mt-1 block text-dim">{d.detail}</span>
                  </li>
                ))}
              </ul>

              <span className="type-label-sm mt-8 block text-faint">
                Revisions &amp; handover
              </span>
              <p className="type-body-sm mt-2 text-inkMuted">{pkg.revisions}</p>
              <p className="type-body-sm mt-1.5 text-inkMuted">
                {handoverFor(pkg, mode)}
              </p>

              {mode === "licence" && (
                <p className="type-body-sm mt-4 rounded-panel border border-line p-4 text-dim">
                  Because the code stays with us, any feature you add later is{" "}
                  {FEATURE_DISCOUNT_LABEL} off our standard rate.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-line px-7 py-5 sm:px-9">
              <a
                href="/contact"
                data-cursor-grow
                className="type-label-sm inline-flex items-center gap-2.5 rounded-pill bg-ink px-6 py-3.5 text-bg transition-opacity duration-300 hover:opacity-85"
              >
                Start this package →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
