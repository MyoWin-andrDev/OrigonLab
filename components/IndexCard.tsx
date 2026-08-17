import Link from "next/link";
import type { CSSProperties } from "react";
import { ProjectCategory } from "@/lib/types";
import ProjectVisual from "./ProjectVisual";

/**
 * IndexCard — the grid-view project/service card.
 *
 * Layout mirrors the Lusion Labs index tile:
 *   ┌──────────────────────────┐
 *   │ EXP 012            ( • ) │   ← mono meta / corner button
 *   │ 2026                     │
 *   │                          │
 *   │        [ media ]         │
 *   │                          │
 *   │ Small World              │   ← title over scrim
 *   │ WEBGL · SHADER · 3D      │   ← mono tags
 *   └──────────────────────────┘
 */

/* ── Card-local tokens ─────────────────────────────────────────────
 * The media plane is a saturated gradient in BOTH themes, so anything
 * layered on top of it is judged against the media — not against --bg.
 * A theme-flipping scrim token would invert to white here and destroy
 * contrast for the always-light on-media text. So the card declares its
 * own named scrim/ink tokens once, here, and every overlay below
 * consumes them by name — no raw colour values anywhere in the markup.
 * ------------------------------------------------------------------ */
type CardVars = CSSProperties & Record<`--${string}`, string>;

const cardTokens: CardVars = {
  "--card-ink": "rgba(255, 255, 255, 0.98)",
  "--card-ink-dim": "rgba(255, 255, 255, 0.68)",
  "--card-line": "rgba(255, 255, 255, 0.34)",
  "--card-line-hover": "rgba(255, 255, 255, 0.82)",
  "--card-fill": "rgba(255, 255, 255, 0.12)",
  "--card-fill-hover": "rgba(255, 255, 255, 0.22)",
  "--card-scrim": "rgba(0, 0, 0, 0.72)",
  "--card-scrim-soft": "rgba(0, 0, 0, 0.26)",
};

const BOTTOM_SCRIM =
  "linear-gradient(to top, var(--card-scrim) 0%, var(--card-scrim-soft) 32%, transparent 62%)";
const TOP_SCRIM =
  "linear-gradient(to bottom, var(--card-scrim-soft) 0%, transparent 100%)";

interface IndexCardProps {
  href: string;
  expNumber: string;
  year?: number;
  title: string;
  tags: string[];
  gradientFrom: string;
  gradientTo: string;
  /** Drives the fallback mockup; defaults to a website composition. */
  category?: ProjectCategory;
  /** Real imagery — /public path or an allowed remote URL. */
  image?: string;
  imageAlt?: string;
  /** Varies the fallback so sibling cards don't render identically. */
  seed?: number;
}

export default function IndexCard({
  href,
  expNumber,
  year,
  title,
  tags,
  gradientFrom,
  gradientTo,
  category = "website",
  image,
  imageAlt,
  seed = 0,
}: IndexCardProps) {
  return (
    <Link
      href={href}
      data-cursor-grow
      style={cardTokens}
      aria-label={`${title} — EXP ${expNumber}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-card"
    >
      {/* ── Media plane ───────────────────────────────────────────────
          Scaled on hover from this inner wrapper so the parent's
          rounded-card radius keeps clipping the corners. */}
      <div className="absolute inset-0 transition-[transform,filter] duration-[600ms] ease-lusion will-change-transform group-hover:scale-[1.03] group-hover:brightness-[1.06]">
        <ProjectVisual
          title={title}
          category={category}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          image={image}
          imageAlt={imageAlt}
          seed={seed}
        />
      </div>

      {/* ── Readability scrims (token-driven, dark in both themes) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: BOTTOM_SCRIM }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{ backgroundImage: TOP_SCRIM }}
      />

      {/* ── Top-left: EXP number, year beneath ───────────────────── */}
      <div className="absolute left-5 top-5 z-10">
        <span className="type-label-sm block text-[color:var(--card-ink)]">
          EXP {expNumber}
        </span>
        {year !== undefined && (
          <span className="type-label-sm mt-1 block text-[color:var(--card-ink-dim)]">
            {year}
          </span>
        )}
      </div>

      {/* ── Top-right: dot → arrow corner button ─────────────────── */}
      <span
        aria-hidden
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-pill border border-[color:var(--card-line)] bg-[color:var(--card-fill)] backdrop-blur-sm transition-colors duration-[600ms] ease-lusion group-hover:border-[color:var(--card-line-hover)] group-hover:bg-[color:var(--card-fill-hover)]"
      >
        {/* Resting state: a single dot */}
        <span className="absolute h-[5px] w-[5px] rounded-pill bg-[color:var(--card-ink)] transition-all duration-[600ms] ease-lusion group-hover:scale-0 group-hover:opacity-0" />
        {/* Hover state: the dot gives way to an arrow that swings 45° up-right */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="absolute -rotate-45 text-[color:var(--card-ink)] opacity-0 transition-all duration-[600ms] ease-lusion group-hover:rotate-0 group-hover:opacity-100"
        >
          <path
            d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* ── Bottom: title + mono tags, inside the card ───────────── */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 transition-transform duration-[600ms] ease-lusion group-hover:-translate-y-1 sm:p-6">
        <h3 className="type-title text-[color:var(--card-ink)]">{title}</h3>
        {tags.length > 0 && (
          <p className="type-label-sm mt-2 text-[color:var(--card-ink-dim)]">
            {tags.join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
