"use client";

import { useEffect, useRef } from "react";
import PortraitImage from "./PortraitImage";
import { AnimatePresence, motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { initialsOf } from "@/lib/initials";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TeamDialogProps {
  member: TeamMember | null;
  index: number;
  onClose: () => void;
}

/**
 * Full member profile — bio, skills and tech stack.
 *
 * Same dialog pattern as PackageDialog: one instance shared by the grid, so
 * opening a profile never reflows the cards behind it.
 */
export default function TeamDialog({ member, index, onClose }: TeamDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const open = member !== null;

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
    // Focus synchronously — deferring to rAF silently skips focus in a
    // throttled or backgrounded tab.
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
      {member && (
        <motion.div
          key="team-dialog"
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            data-cursor-grow
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-dialog-title"
            tabIndex={-1}
            initial={{ y: 28, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.99, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="
              relative flex max-h-[88vh] w-full max-w-3xl flex-col
              overflow-hidden rounded-t-card border border-line bg-elevated
              outline-none sm:max-h-[85vh] sm:rounded-card
            "
          >
            {/* Header — portrait strip beside the identity */}
            <div className="flex items-stretch gap-5 border-b border-line p-6 sm:gap-7 sm:p-8">
              <div
                className={`relative hidden h-28 w-24 shrink-0 overflow-hidden rounded-panel bg-gradient-to-br sm:block ${member.gradientFrom} ${member.gradientTo}`}
              >
                {member.image ? (
                  <PortraitImage
                    src={member.image}
                    alt={member.name}
                    gradientFrom={member.gradientFrom}
                    gradientTo={member.gradientTo}
                    pixelArt={member.pixelArt}
                    sizes="96px"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="type-title absolute inset-0 flex items-center justify-center"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {initialsOf(member.name)}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span className="type-label-sm text-faint">
                  T{String(index + 1).padStart(2, "0")} · {member.position}
                </span>
                <h2 id="team-dialog-title" className="type-display-md mt-2 text-ink">
                  {member.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                data-cursor-grow
                aria-label="Close profile"
                className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full border border-line text-dim transition-colors duration-300 hover:border-lineStrong hover:text-ink"
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

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
              <p className="type-body-lg text-inkMuted">{member.bio}</p>

              {/* Skills — what they do */}
              <span className="type-label-sm mt-9 block text-faint">Skills</span>
              <ul className="mt-4 flex flex-wrap gap-2">
                {member.skills.map((skill, i) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: 0.08 + i * 0.03,
                    }}
                    className="type-body-sm rounded-pill border border-line px-3.5 py-1.5 text-inkMuted"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>

              {/* Tech — what they work in */}
              <span className="type-label-sm mt-9 block text-faint">Tech</span>
              <ul className="mt-4 flex flex-wrap gap-2">
                {member.tech.map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: 0.16 + i * 0.03,
                    }}
                    className="type-label-sm rounded-pill bg-card px-3.5 py-2 text-ink"
                  >
                    {t}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line p-6 sm:px-8">
              <a
                href="/contact"
                data-cursor-grow
                className="type-label-sm inline-flex items-center gap-2.5 rounded-pill bg-ink px-6 py-3.5 text-bg transition-opacity duration-300 hover:opacity-85"
              >
                Work with us →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
