import { Project } from "@/lib/types";
import thumbnails from "./thumbnails.generated.json";

/**
 * Figma thumbnails downloaded by `npm run figma:pull` land in
 * data/thumbnails.generated.json as { slug: "/work/<slug>.png" }.
 * An explicit `image` on a project always wins; otherwise the generated
 * thumbnail is used; otherwise the card falls back to a context mockup.
 */
const generated = thumbnails as Record<string, string>;

function withThumbnails(list: Project[]): Project[] {
  return list.map((p) => (p.image ? p : { ...p, image: generated[p.slug] }));
}

const baseProjects: Project[] = [
  {
    slug: "meridian-commerce",
    expNumber: "001",
    year: 2026,
    title: "Meridian",
    category: "website",
    tags: ["COMMERCE", "DYNAMIC", "CMS"],
    summary: "A full commerce rebuild with a custom checkout and inventory dashboard.",
    introHeading: "Introduction",
    introBody:
      "Meridian came to us with a storefront that couldn't keep up with their catalog. We rebuilt it as a dynamic, CMS-driven platform with a custom checkout flow, inventory sync, and an admin dashboard their team actually enjoys using.",
    liveUrl: "#",
    gradientFrom: "from-amber-500",
    gradientTo: "to-emerald-600",
  },
  {
    slug: "northline-banking",
    expNumber: "002",
    year: 2026,
    title: "Northline",
    category: "mobile",
    tags: ["IOS", "ANDROID", "FINTECH"],
    summary: "A dual-platform banking app with biometric auth and real-time transfers.",
    introHeading: "Introduction",
    introBody:
      "Northline needed a single app that felt equally native on iOS and Android, with banking-grade security. We shipped biometric authentication, real-time transfer confirmations, and a shared backend that keeps both platforms in sync.",
    liveUrl: "#",
    gradientFrom: "from-sky-500",
    gradientTo: "to-indigo-700",
  },
  {
    slug: "vantage-portfolio",
    expNumber: "003",
    year: 2025,
    title: "Vantage",
    category: "website",
    tags: ["STATIC", "PORTFOLIO"],
    summary: "A five-page static site built for speed and clarity.",
    introHeading: "Introduction",
    introBody:
      "Vantage wanted something fast, simple, and confident — no CMS, no bloat. A static five-page build gave them a sub-second load time and a design that gets out of the way of the work.",
    liveUrl: "#",
    gradientFrom: "from-rose-500",
    gradientTo: "to-orange-500",
  },
  {
    slug: "harbor-logistics",
    expNumber: "004",
    year: 2025,
    title: "Harbor",
    category: "mobile",
    tags: ["ANDROID", "LOGISTICS", "BACKEND"],
    summary: "A driver-facing logistics app with live routing and a custom backend.",
    introHeading: "Introduction",
    introBody:
      "Harbor's dispatch team was running on spreadsheets. We built a driver-facing Android app with live routing, plus the backend and admin tools their dispatch team needed to actually replace the spreadsheet.",
    liveUrl: "#",
    gradientFrom: "from-teal-500",
    gradientTo: "to-cyan-600",
  },
  {
    slug: "solace-studio",
    expNumber: "005",
    year: 2025,
    title: "Solace",
    category: "website",
    tags: ["DYNAMIC", "AUTH", "COMMUNITY"],
    summary: "A membership platform with gated content and social login.",
    introHeading: "Introduction",
    introBody:
      "Solace runs a paid community and needed gated content behind a clean login. We built the membership platform with social auth, a members-only content layer, and the admin tools to manage it.",
    liveUrl: "#",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-purple-700",
  },
  {
    slug: "pallet-retail",
    expNumber: "006",
    year: 2024,
    title: "Pallet",
    category: "mobile",
    tags: ["IOS", "RETAIL", "PUSH"],
    summary: "A loyalty and ordering app with push-driven promotions.",
    introHeading: "Introduction",
    introBody:
      "Pallet wanted repeat customers, not just first-time ones. The iOS app pairs mobile ordering with a loyalty system and push notifications tuned to bring people back without feeling like spam.",
    liveUrl: "#",
    gradientFrom: "from-lime-500",
    gradientTo: "to-emerald-600",
  },
];

export const projects: Project[] = withThumbnails(baseProjects);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
