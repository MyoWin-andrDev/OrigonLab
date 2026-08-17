import { Package } from "@/lib/types";

/**
 * Pricing packages.
 *
 * NOTE: timelines, revision counts and IP terms below are commercial
 * commitments — review them before this goes live. They were scaled
 * consistently from the Identity Basic spec, not quoted from contracts.
 */
export const packages: Package[] = [
  {
    slug: "identity-basic",
    tier: "Starter",
    discipline: "Design & Brand Identity",
    name: "Identity Basic",
    scope: "Single brand, small footprint",
    price: "250",
    features: ["Logo (2 concepts)", "Icon set (10)", "Social media kit"],
    audience:
      "Early-stage founders, solo creators, or side projects needing an authentic first brand presence.",
    timeline: "5–7 business days",
    deliverables: [
      {
        label: "Logo design",
        detail: "2 distinct creative concept directions → 1 final polished mark.",
      },
      {
        label: "Asset kit",
        detail:
          "Full vector exports (SVG, PNG, EPS), transparent dark/light variations, favicon and app icon.",
      },
      {
        label: "Icon pack",
        detail: "10 custom vector UI/brand icons aligned with your visual language.",
      },
      {
        label: "Social starter kit",
        detail: "Profile avatars and cover banners for 3 platforms (X, LinkedIn, Instagram).",
      },
      {
        label: "Colour & typography card",
        detail:
          "One-page spec sheet with HEX/RGB codes and Google Font recommendations.",
      },
    ],
    revisions: "2 rounds of revisions on the chosen concept",
    handover:
      "Licence to use the final marks commercially; OrigonLab retains the editable source files",
    handoverOwned:
      "Full ownership: editable source files, working artwork and 100% commercial IP rights assigned to you",
  },
  {
    slug: "static-launch",
    tier: "Starter",
    discipline: "Web Development",
    name: "Static Launch",
    scope: "Up to 5 pages, no backend",
    price: "400",
    features: ["Static site (5 pages)", "Responsive build", "Domain connection"],
    audience:
      "Studios, consultants and small businesses who need a fast, credible site without a CMS to maintain.",
    timeline: "7–10 business days",
    deliverables: [
      {
        label: "Static build",
        detail: "Up to 5 hand-built pages, sub-second load, no CMS overhead.",
      },
      {
        label: "Responsive layout",
        detail: "Verified across mobile, tablet and desktop breakpoints.",
      },
      {
        label: "Domain & hosting setup",
        detail: "Custom domain connected, SSL issued, deployment pipeline configured.",
      },
      {
        label: "Baseline SEO",
        detail: "Meta tags, Open Graph previews, sitemap and robots.txt.",
      },
      {
        label: "Analytics",
        detail: "Privacy-friendly analytics wired up with a basic traffic dashboard.",
      },
    ],
    revisions: "2 rounds of layout and copy revisions before launch",
    handover:
      "Hosted, deployed site plus a short walkthrough; OrigonLab maintains the codebase",
    handoverOwned:
      "Full ownership: source repository transferred to your account, yours to host and modify",
  },
  {
    slug: "app-mvp",
    tier: "Starter",
    discipline: "Mobile Development",
    name: "App MVP",
    scope: "Single platform, core screens",
    price: "900",
    features: ["iOS or Android", "Up to 6 screens", "Basic API integration"],
    audience:
      "Founders validating a product idea who need something real in testers' hands, not a prototype.",
    timeline: "3–4 weeks",
    deliverables: [
      {
        label: "Single-platform build",
        detail: "iOS or Android, your choice, built from a shared codebase.",
      },
      {
        label: "Core screens",
        detail: "Up to 6 screens including onboarding, main flow and settings.",
      },
      {
        label: "API integration",
        detail: "Connection to one existing backend or a simple hosted data layer.",
      },
      {
        label: "Auth",
        detail: "Email plus one social login provider.",
      },
      {
        label: "Store submission",
        detail: "Store listing assets prepared and the first submission handled for you.",
      },
    ],
    revisions: "2 rounds of UI revisions during the build",
    handover:
      "Published app under a licence to use; OrigonLab holds the repository and build credentials",
    handoverOwned:
      "Full ownership: repository, build credentials and store listing transferred to you",
  },
  {
    slug: "brand-system",
    tier: "Growth",
    discipline: "Design & Brand Identity",
    name: "Brand System",
    scope: "Full identity across channels",
    price: "650",
    features: ["Full brand guide", "Icon + illustration set", "Social + ad templates"],
    audience:
      "Businesses past first launch whose brand now has to hold up across product, marketing and print.",
    timeline: "2–3 weeks",
    deliverables: [
      {
        label: "Logo system",
        detail:
          "3 concept directions → primary mark, secondary lockups, monogram and responsive variants.",
      },
      {
        label: "Brand guidelines",
        detail:
          "Multi-page document covering usage, spacing, misuse, tone and full colour specification.",
      },
      {
        label: "Icon & illustration set",
        detail: "24 custom icons plus 3 spot illustrations in a consistent style.",
      },
      {
        label: "Template library",
        detail: "Social templates for 5 platforms, ad sizes, plus a presentation deck.",
      },
      {
        label: "Type & colour system",
        detail: "Full scale with licensed font recommendations and accessible colour pairings.",
      },
    ],
    revisions: "3 rounds across concept and refinement stages",
    handover:
      "Licence to use the identity across your channels; OrigonLab retains the editable source files",
    handoverOwned:
      "Full ownership: every editable source file and 100% commercial IP rights assigned to you",
  },
  {
    slug: "dynamic-platform",
    tier: "Growth",
    discipline: "Web Development",
    name: "Dynamic Platform",
    scope: "CMS-driven, up to 15 pages",
    price: "1,400",
    features: ["Dynamic site + CMS", "Auth (basic)", "Admin dashboard"],
    audience:
      "Teams who publish regularly and need to change content themselves without calling a developer.",
    timeline: "4–5 weeks",
    deliverables: [
      {
        label: "Dynamic build",
        detail: "Up to 15 templated pages driven by structured content models.",
      },
      {
        label: "CMS integration",
        detail: "Headless CMS configured with your content types, plus editor training.",
      },
      {
        label: "Authentication",
        detail: "Email and social login with role-based access.",
      },
      {
        label: "Admin dashboard",
        detail: "Custom interface for managing content, users and submissions.",
      },
      {
        label: "Performance & SEO",
        detail: "Server rendering, image optimisation, structured data and sitemaps.",
      },
    ],
    revisions: "3 rounds spanning design and build",
    handover:
      "Running platform with CMS access and an admin walkthrough; OrigonLab maintains the codebase",
    handoverOwned:
      "Full ownership: repository and CMS ownership transferred, with architecture documentation",
  },
  {
    slug: "dual-platform-app",
    tier: "Growth",
    discipline: "Mobile Development",
    name: "Dual Platform App",
    scope: "iOS + Android, shared backend",
    price: "2,600",
    features: ["iOS & Android", "Shared backend API", "Push notifications"],
    audience:
      "Products with real users on both platforms that need to stay in step without doubling the work.",
    timeline: "6–8 weeks",
    deliverables: [
      {
        label: "Dual-platform build",
        detail: "iOS and Android from one codebase, each tuned to feel native.",
      },
      {
        label: "Backend & API",
        detail: "Shared backend with database, REST/GraphQL layer and hosting.",
      },
      {
        label: "Push notifications",
        detail: "Segmented push with scheduling and delivery reporting.",
      },
      {
        label: "Auth & profiles",
        detail: "Biometric unlock, social login and account management.",
      },
      {
        label: "Store release",
        detail: "Both store listings prepared, submitted and shepherded through review.",
      },
    ],
    revisions: "3 rounds of UI revisions plus a post-beta pass",
    handover:
      "Both apps published and maintained by OrigonLab; you hold a licence to use them",
    handoverOwned:
      "Full ownership: repositories, infrastructure and both store listings transferred to you",
  },
  {
    slug: "commerce-build",
    tier: "Scale",
    discipline: "Full Stack",
    name: "Commerce Build",
    scope: "Store + payments + backend",
    price: "3,800",
    features: ["Dynamic storefront", "Payment gateway", "Hosting & deployment"],
    audience:
      "Retailers selling at volume who need checkout, inventory and fulfilment to actually hold together.",
    timeline: "8–10 weeks",
    deliverables: [
      {
        label: "Storefront",
        detail: "Custom catalogue, search, filtering, cart and checkout flow.",
      },
      {
        label: "Payments",
        detail: "Gateway integration, multiple methods, refunds and tax handling.",
      },
      {
        label: "Inventory & orders",
        detail: "Stock sync, order pipeline and fulfilment notifications.",
      },
      {
        label: "Admin dashboard",
        detail: "Products, orders, customers and revenue reporting in one place.",
      },
      {
        label: "Infrastructure",
        detail: "Production hosting, CDN, backups and uptime monitoring.",
      },
    ],
    revisions: "Unlimited revisions within the agreed scope during the build",
    handover:
      "Running store with admin access and team training; OrigonLab maintains the stack",
    handoverOwned:
      "Full ownership: complete stack transferred — repositories, infrastructure and documentation",
  },
  {
    slug: "product-launch",
    tier: "Scale",
    discipline: "Full Stack",
    name: "Product Launch",
    scope: "Web + mobile + backend combined",
    price: "6,500",
    features: ["Web + mobile app", "Full backend & auth", "CI/CD + release management"],
    audience:
      "Funded teams launching a complete product across web and mobile on a single, coherent stack.",
    timeline: "10–14 weeks",
    deliverables: [
      {
        label: "Web application",
        detail: "Full responsive product with marketing site and authenticated app.",
      },
      {
        label: "Mobile applications",
        detail: "iOS and Android sharing the web product's design system.",
      },
      {
        label: "Backend & auth",
        detail: "Database design, API layer, role-based access and third-party integrations.",
      },
      {
        label: "CI/CD",
        detail: "Automated testing, staging environment and one-command releases.",
      },
      {
        label: "Design system",
        detail: "Shared component library and tokens spanning every surface.",
      },
    ],
    revisions: "Unlimited within scope, run as two-week review cycles",
    handover:
      "Live product across web and mobile with a 30-day support window; OrigonLab maintains the code",
    handoverOwned:
      "Full ownership: entire codebase, infrastructure and architecture documentation transferred",
  },
  {
    slug: "lab-partnership",
    tier: "Enterprise",
    discipline: "Full Stack",
    name: "Lab Partnership",
    scope: "Ongoing, multi-product scope",
    price: "Custom",
    features: ["Dedicated team", "All disciplines on retainer", "SLA-backed support"],
    audience:
      "Organisations running several products who want a standing team rather than repeated project scoping.",
    timeline: "Ongoing — monthly retainer, 3-month minimum",
    deliverables: [
      {
        label: "Dedicated team",
        detail: "Named designers and engineers reserved for your roadmap each month.",
      },
      {
        label: "All disciplines",
        detail: "Brand, product design, web, mobile and infrastructure under one retainer.",
      },
      {
        label: "SLA support",
        detail: "Agreed response and resolution targets with priority escalation.",
      },
      {
        label: "Roadmap planning",
        detail: "Quarterly planning with monthly delivery reviews.",
      },
      {
        label: "Infrastructure management",
        detail: "Ongoing hosting, monitoring, security patching and cost optimisation.",
      },
    ],
    revisions: "Continuous — scope is agreed and re-prioritised each sprint",
    handover:
      "Everything produced stays licensed to you for the life of the retainer; no lock-in",
    handoverOwned:
      "Full ownership: all work product assigned to you as it ships, with exit assistance included",
  },
];

/** Which commercial model the visitor is pricing against. */
export type OwnershipMode = "licence" | "owned";

/**
 * Buying full ownership of the source (design files + code) is priced at
 * 1.7x the licence price. Single source of truth — the toggle, the cards and
 * the dialog all derive from this.
 */
export const OWNERSHIP_MULTIPLIER = 1.7;

/**
 * Clients who stay on the licence model keep their code with us, so any later
 * feature work is discounted — we already know and hold the codebase.
 * Expressed as a fraction: 0.3 === 30% off.
 */
export const FEATURE_DISCOUNT = 0.3;

/** "30%" — formatted for display, derived so copy can't drift from the value. */
export const FEATURE_DISCOUNT_LABEL = `${Math.round(FEATURE_DISCOUNT * 100)}%`;

function parsePrice(price: string): number | null {
  if (price === "Custom") return null;
  const n = Number(price.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Formatted price for a package under the given ownership model. */
export function priceFor(pkg: Package, mode: OwnershipMode): string {
  const base = parsePrice(pkg.price);
  if (base === null) return "Custom";
  const value = mode === "owned" ? Math.round(base * OWNERSHIP_MULTIPLIER) : base;
  return value.toLocaleString("en-US");
}

/** Handover terms matching the ownership model. */
export function handoverFor(pkg: Package, mode: OwnershipMode): string {
  return mode === "owned" ? pkg.handoverOwned : pkg.handover;
}

export function getPackagesBySlugs(slugs: string[]): Package[] {
  return packages.filter((p) => slugs.includes(p.slug));
}
