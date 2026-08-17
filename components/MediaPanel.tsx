import { ProjectCategory } from "@/lib/types";
import ProjectVisual from "./ProjectVisual";

interface MediaPanelProps {
  from: string;
  to: string;
  title: string;
  className?: string;
  /** Drives the fallback mockup. */
  category?: ProjectCategory;
  /** Real imagery — /public path or an allowed remote URL. */
  image?: string;
  imageAlt?: string;
}

/**
 * Large media plane on project and service detail pages.
 *
 * Shows real imagery when it exists, otherwise the same context mockup used on
 * the cards. The label and scrim are always light because the plane underneath
 * is a saturated gradient or a photo in both themes.
 */
export default function MediaPanel({
  from,
  to,
  title,
  className = "",
  category = "website",
  image,
  imageAlt,
}: MediaPanelProps) {
  return (
    <div className={`relative overflow-hidden rounded-card bg-card ${className}`}>
      <ProjectVisual
        title={title}
        category={category}
        gradientFrom={from}
        gradientTo={to}
        image={image}
        imageAlt={imageAlt}
        priority
        sizes="(max-width: 1024px) 100vw, 60vw"
      />

      {/* Bottom scrim so the label reads over any image or gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)",
        }}
      />

      <span
        className="type-label-sm absolute bottom-5 left-5"
        style={{ color: "rgba(255,255,255,0.72)" }}
      >
        {title}
      </span>
    </div>
  );
}
