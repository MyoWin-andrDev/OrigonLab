export type ProjectCategory = "website" | "mobile";

export interface Project {
  slug: string;
  expNumber: string; // e.g. "001"
  year: number;
  title: string;
  category: ProjectCategory;
  tags: string[]; // e.g. ["WEBGL", "COMMERCE"]
  summary: string;
  introHeading: string;
  introBody: string;
  liveUrl?: string;
  /**
   * Real project imagery — a path under /public ("/work/meridian.jpg") or a
   * remote URL allowed by next.config remotePatterns. When absent the card
   * falls back to a context mockup built from `category`.
   */
  image?: string;
  /** Describes the image for screen readers; falls back to a generic label. */
  imageAlt?: string;
  // gradient behind the image/mockup, expressed as tailwind classes
  gradientFrom: string;
  gradientTo: string;
}

/** One labelled column of the stack table on a service page. */
export interface StackGroup {
  label: string;
  items: string[];
}

export type ServiceSlug = "graphic-design" | "ui-ux" | "website-development" | "mobile-development";

export interface Service {
  slug: ServiceSlug;
  expNumber: string;
  title: string;
  shortTitle: string; // for nav/cards
  tags: string[];
  summary: string;
  introHeading: string;
  introBody: string;
  deliverables: string[];
  /**
   * The tech this service is delivered on. Languages, frameworks and
   * databases only — deliberately no libraries, plugins or hosted services,
   * which date fast and say little about capability.
   */
  stack?: StackGroup[];
  gradientFrom: string;
  gradientTo: string;
  packageSlugs: string[]; // packages relevant to this service
  wizardTrack: string; // key into wizard tracks data
}

/** A named deliverable line: a short label plus what it actually includes. */
export interface Deliverable {
  label: string;
  detail: string;
}

export interface Package {
  slug: string;
  tier: "Starter" | "Growth" | "Scale" | "Enterprise";
  discipline: string;
  name: string;
  scope: string;
  price: string; // "250" or "Custom"
  /** Short bullets shown on the collapsed card. */
  features: string[];

  // ── Expanded detail ───────────────────────────────────────────
  /** Who the package is aimed at. */
  audience: string;
  /** Estimated delivery window, e.g. "5–7 business days". */
  timeline: string;
  /** Itemised scope, shown when the card is expanded. */
  deliverables: Deliverable[];
  /** Revision policy, e.g. "2 rounds on the chosen concept". */
  revisions: string;
  /** Handover terms at the LICENCE price — Origon retains the source. */
  handover: string;
  /** Handover terms when the client buys full ownership of the source. */
  handoverOwned: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  position: string;
  bio: string;
  /** What they do — capabilities, not tools. Shown as chips + in the dialog. */
  skills: string[];
  /** What they work in — concrete tools and languages. */
  tech: string[];
  /** Portrait photo — a path under /public, e.g. "/team/alex.jpg". */
  image?: string;
  /** Sprite/pixel source: skip optimisation and scale nearest-neighbour. */
  pixelArt?: boolean;
  /** Gradient shown behind the portrait, or instead of it while none exists. */
  gradientFrom: string;
  gradientTo: string;
}

export interface WizardOption {
  id: string;
  title: string;
  desc: string;
  cost: number;
}

export interface WizardStep {
  key: string;
  question: string;
  options: WizardOption[];
}

export interface WizardTrack {
  key: string;
  label: string;
  base: number;
  steps: WizardStep[];
}
