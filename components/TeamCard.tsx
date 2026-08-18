import type { CSSProperties } from "react";
import PortraitImage from "./PortraitImage";
import { TeamMember } from "@/lib/types";
import { initialsOf } from "@/lib/initials";

/* ── Card-local tokens ─────────────────────────────────────────────
 * The portrait plane is a saturated gradient (or a photo) in BOTH themes,
 * so everything layered on it is judged against the media, never against
 * --bg. A theme-flipping token would invert to dark-on-dark here. Declaring
 * the values once keeps raw colours out of the markup below.
 * ------------------------------------------------------------------ */
type CardVars = CSSProperties & Record<`--${string}`, string>;

const cardTokens: CardVars = {
  "--card-ink": "rgba(255, 255, 255, 0.98)",
  "--card-ink-dim": "rgba(255, 255, 255, 0.74)",
  "--card-ink-faint": "rgba(255, 255, 255, 0.55)",
  "--card-line": "rgba(255, 255, 255, 0.28)",
  "--card-initials": "rgba(255, 255, 255, 0.22)",
  /* The symbol is the subject of the tile, not a watermark behind it. */
  "--card-symbol": "rgba(255, 255, 255, 0.92)",
  "--card-rule": "rgba(255, 255, 255, 0.22)",
};

/* Bottom scrim deepens on hover so the revealed bio stays readable. */
const SCRIM =
  "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 32%, transparent 70%)";
const TOP_SCRIM =
  "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 100%)";

interface TeamCardProps {
  member: TeamMember;
  index: number;
  onOpen: (member: TeamMember, index: number) => void;
}

/**
 * Team member card — portrait plane with the details set *on* the card.
 *
 * Name and role always read; the bio expands on hover. On touch devices there
 * is no hover, so the `(hover: none)` variants pin the bio open rather than
 * leaving it permanently unreachable.
 *
 * The hover choreography is entirely CSS, so the card itself carries no
 * animation JS. It renders as a <button> because the whole card opens the
 * member's full profile — two lead skills show here, the complete skills and
 * tech lists live in TeamDialog.
 */
export default function TeamCard({ member, index, onOpen }: TeamCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(member, index)}
      data-cursor-grow
      aria-label={`${member.name} — ${member.position}. View full profile.`}
      style={cardTokens}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-card bg-card text-left"
    >
      {/* ── Media plane ─────────────────────────────────────────────
          Scaled from an inner wrapper so the parent's radius keeps clipping. */}
      {member.image ? (
        <PortraitImage
          src={member.image}
          alt={member.name}
          gradientFrom={member.gradientFrom}
          gradientTo={member.gradientTo}
          pixelArt={member.pixelArt}
          fullColour={member.fullColour}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="transition-transform duration-[900ms] ease-lusion will-change-transform group-hover:scale-[1.05]"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${member.gradientFrom} ${member.gradientTo} transition-transform duration-[900ms] ease-lusion will-change-transform group-hover:scale-[1.05]`}
        />
      )}

      {/* Element symbol — the monogram, read as a chemical symbol. Sits high
          in the tile so the details block below has clear air beneath it. */}
      {!member.image && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-[26%] flex justify-center transition-transform duration-[900ms] ease-lusion group-hover:scale-105"
        >
          <span
            className="type-display-xl"
            style={{
              color: "var(--card-symbol)",
              letterSpacing: "-0.03em",
            }}
          >
            {initialsOf(member.name)}
          </span>
        </span>
      )}

      {/* Scrims */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ backgroundImage: TOP_SCRIM }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[600ms] ease-lusion group-hover:opacity-100"
        style={{ backgroundImage: SCRIM, opacity: 0.9 }}
      />


      {/* ── Top row: index + dot ─────────────────────────────────── */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
        {/* Atomic number — plain, unpadded, as on a periodic tile */}
        <span
          className="type-label-sm tabular-nums"
          style={{ color: "var(--card-ink-dim)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-[600ms] ease-lusion group-hover:rotate-90"
          style={{ borderColor: "var(--card-line)" }}
        >
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--card-ink-dim)" }}
          />
        </span>
      </div>

      {/* ── Details, set on the card ────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        {/* Element name. type-title, not type-display-md: the display clamp is
            viewport-based, so at 4-up it stayed ~44px in a ~361px card. */}
        <h3
          className="type-title transition-transform duration-[600ms] ease-lusion group-hover:-translate-y-0.5"
          style={{ color: "var(--card-ink)" }}
        >
          {member.name}
        </h3>

        {/* Classification, beneath the name as on a periodic tile */}
        <span
          className="type-label-sm mt-1.5 block transition-transform duration-[600ms] ease-lusion group-hover:-translate-y-0.5"
          style={{ color: "var(--card-ink-faint)" }}
        >
          {member.position}
        </span>

        {/* Rule separating identity from properties */}
        <span
          aria-hidden
          className="mt-4 block h-px w-full"
          style={{ backgroundColor: "var(--card-rule)" }}
        />

        {/* Properties — a dot-separated data line, the way a periodic tile
            carries mass and configuration. Pills read as UI chips and fought
            the tile; plain data reads as part of the specimen. */}
        {member.skills.length > 0 && (
          <p
            className="type-label-sm mt-3"
            style={{ color: "var(--card-ink-dim)" }}
          >
            {member.skills.slice(0, 2).join(" · ")}
          </p>
        )}

        {/* Bio — expands on hover, pinned open where hover doesn't exist */}
        <div
          className="
            grid grid-rows-[0fr] opacity-0
            transition-[grid-template-rows,opacity] duration-[600ms] ease-lusion
            group-hover:grid-rows-[1fr] group-hover:opacity-100
            [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100
          "
        >
          {/* grid-rows 0fr→1fr animates to intrinsic height without a
              hardcoded max-height that would clip longer bios. */}
          <div className="overflow-hidden">
            <p
              className="type-body-sm pt-3"
              style={{ color: "var(--card-ink-dim)" }}
            >
              {member.bio}
            </p>
          </div>
        </div>

      </div>
    </button>
  );
}
