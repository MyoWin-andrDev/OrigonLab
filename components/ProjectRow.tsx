"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { useHoverPreview } from "./HoverPreview";

interface ProjectRowProps {
  href: string;
  expNumber: string;
  year?: number;
  title: string;
  tags: string[];
  /** Position in the list — drives the scroll-reveal stagger. */
  index?: number;
  /** Media for the floating hover preview. Omit to disable it for this row. */
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * List-view row (labs.lusion.co index layout).
 *
 *   EXP 001    2026    Meridian    COMMERCE · DYNAMIC · CMS    (•)
 *
 * Desktop: one grid line — EXP | year | title (flex) | tags | button.
 * Mobile:  EXP + year on top, title, then tags; button pinned right, centred.
 *
 * Hovering raises the shared floating preview card, which trails the cursor.
 */
export default function ProjectRow({
  href,
  expNumber,
  year,
  title,
  tags,
  index = 0,
  gradientFrom,
  gradientTo,
}: ProjectRowProps) {
  const { show, hide } = useHoverPreview();
  const hasPreview = Boolean(gradientFrom && gradientTo);

  return (
    <AnimatedSection y={18} delay={Math.min(index, 6) * 0.06}>
      <Link
        href={href}
        data-cursor-grow
        className="group block hairline"
        onPointerEnter={(e) => {
          if (e.pointerType === "touch" || !hasPreview) return;
          show({ title, gradientFrom: gradientFrom!, gradientTo: gradientTo! });
        }}
        onPointerLeave={hide}
        // Hides immediately on press, so the card is gone before the route
        // transition begins rather than lingering through it.
        onPointerDown={hide}
        // A row can be left via keyboard or by the page navigating away;
        // blur covers the focus case so the card never sticks.
        onBlur={hide}
      >
        <div
          className="
            grid grid-cols-[auto_minmax(0,1fr)_2.5rem] items-center gap-x-5 gap-y-3 px-4 py-7
            transition-colors duration-[400ms] ease-lusion
            group-hover:bg-elevated
            md:grid-cols-[6rem_5rem_minmax(0,1fr)_auto_2.5rem] md:gap-x-6 md:gap-y-0 md:px-6 md:py-8
          "
        >
          {/* EXP number */}
          <span className="type-label col-start-1 row-start-1 whitespace-nowrap text-dim">
            EXP {expNumber}
          </span>

          {/* Year */}
          {year !== undefined && (
            <span className="type-label col-start-2 row-start-1 whitespace-nowrap text-dim">
              {year}
            </span>
          )}

          {/* Title — nudges right on hover */}
          <h3
            className="
              type-title col-span-2 col-start-1 row-start-2 min-w-0 truncate text-ink
              transition-transform duration-[400ms] ease-lusion
              group-hover:translate-x-1.5
              md:col-span-1 md:col-start-3 md:row-start-1
            "
          >
            {title}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <span
              className="
                type-label col-span-2 col-start-1 row-start-3 text-dim
                md:col-span-1 md:col-start-4 md:row-start-1 md:whitespace-nowrap md:text-right
              "
            >
              {tags.join(" · ")}
            </span>
          )}

          {/* Circular indicator — dot swaps to an arrow on row hover */}
          <span
            aria-hidden
            className="
              relative col-start-3 row-span-3 row-start-1 flex h-10 w-10 items-center justify-center
              self-center justify-self-end rounded-full border border-line
              transition-colors duration-[400ms] ease-lusion
              group-hover:border-lineStrong
              md:col-start-5 md:row-span-1 md:row-start-1
            "
          >
            <span
              className="
                absolute h-1.5 w-1.5 rounded-full bg-dim
                transition-all duration-[400ms] ease-lusion
                group-hover:scale-0 group-hover:opacity-0
              "
            />
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="
                absolute rotate-45 scale-90 text-ink opacity-0
                transition-all duration-[400ms] ease-lusion
                group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100
              "
            >
              <path
                d="M2 10L10 2M10 2H3M10 2V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
}
