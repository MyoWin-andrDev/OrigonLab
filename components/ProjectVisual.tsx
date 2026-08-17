import Image from "next/image";
import { ProjectCategory } from "@/lib/types";
import ContextMockup from "./ContextMockup";

interface ProjectVisualProps {
  title: string;
  category: ProjectCategory;
  gradientFrom: string;
  gradientTo: string;
  /** Real imagery — /public path or an allowed remote URL. */
  image?: string;
  imageAlt?: string;
  /** Varies the fallback composition between sibling cards. */
  seed?: number;
  /** Rendered at card size by default; pass true for the large detail panel. */
  priority?: boolean;
  sizes?: string;
}

/**
 * The media plane for a project.
 *
 * Prefers real imagery; falls back to a context mockup on the project's
 * gradient. Swapping a placeholder for a real screenshot is a one-line data
 * change — set `image` in data/projects.ts and nothing here needs touching.
 */
export default function ProjectVisual({
  title,
  category,
  gradientFrom,
  gradientTo,
  image,
  imageAlt,
  seed = 0,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProjectVisualProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={imageAlt ?? `${title} — project preview`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
    >
      <ContextMockup category={category} seed={seed} />
    </div>
  );
}
