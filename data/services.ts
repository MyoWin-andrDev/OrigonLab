import { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "graphic-design",
    expNumber: "S01",
    title: "Graphic Design",
    shortTitle: "Graphic Design",
    tags: ["LOGO", "ICON SET", "3D", "SOCIAL"],
    summary: "Logos, icon sets, 3D visuals and social systems built to hold up across every size and surface.",
    introHeading: "Introduction",
    introBody:
      "Every product starts with a mark. We design logos, icon sets, and social media systems as one connected identity — not a logo file and a set of disconnected templates. Where it earns its place we take that identity into 3D: product renders, motion, and web-ready assets light enough to actually ship in a browser. Everything is built to scale from a favicon to a billboard.",
    deliverables: [
      "Logo design (concepts + refinement)",
      "Icon set",
      "3D product visualisation & renders",
      "Web-ready 3D assets (optimised glTF)",
      "Motion & animated brand assets",
      "Social media templates",
      "Brand guideline document",
    ],
    stack: [
      { label: "3D", items: ["Blender", "Cinema 4D", "Substance 3D"] },
      { label: "Web 3D", items: ["Spline", "glTF"] },
      { label: "2D", items: ["Illustrator", "Photoshop", "After Effects"] },
    ],
    gradientFrom: "from-yellow-500",
    gradientTo: "to-pink-600",
    packageSlugs: ["identity-basic", "brand-system"],
    wizardTrack: "design",
  },
  {
    slug: "ui-ux",
    expNumber: "S02",
    title: "UI/UX Design",
    shortTitle: "UI/UX Design",
    tags: ["WIREFRAMES", "PROTOTYPE", "SYSTEM"],
    summary: "Full product design — research, wireframes, and interface systems, end to end.",
    introHeading: "Introduction",
    introBody:
      "We take products from a blank page to a tested interface. Wireframes first, then a full design system, then high-fidelity screens ready to hand to engineering — with a working prototype at every stage so nothing gets built on assumptions.",
    deliverables: ["User flows & wireframes", "Design system / UI kit", "High-fidelity screens", "Interactive prototype"],
    stack: [
      { label: "Design", items: ["Figma", "Framer"] },
      { label: "Prototyping", items: ["ProtoPie", "Framer Motion"] },
      { label: "Handoff", items: ["Design tokens", "Storybook"] },
    ],
    gradientFrom: "from-indigo-500",
    gradientTo: "to-sky-500",
    packageSlugs: ["brand-system"],
    wizardTrack: "design",
  },
  {
    slug: "website-development",
    expNumber: "S03",
    title: "Website Development",
    shortTitle: "Website Development",
    tags: ["STATIC", "DYNAMIC", "CMS"],
    summary: "Static sites for speed, dynamic platforms for scale — built on whatever stack the project calls for.",
    introHeading: "Introduction",
    introBody:
      "Some sites should be five fast static pages. Others need a CMS, user accounts, and a payment gateway behind them. We build either — or the path between them — on a stack chosen for the project, not a default.",
    deliverables: ["Static or dynamic build", "CMS integration where needed", "Authentication & payments", "Admin dashboard where needed"],
    stack: [
      { label: "Frontend", items: ["React", "Next.js", "TypeScript"] },
      { label: "Backend", items: ["Go", "Node.js"] },
      { label: "Database", items: ["PostgreSQL", "MongoDB"] },
    ],
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    packageSlugs: ["static-launch", "dynamic-platform", "commerce-build"],
    wizardTrack: "web",
  },
  {
    slug: "mobile-development",
    expNumber: "S04",
    title: "Mobile Development",
    shortTitle: "Mobile Development",
    tags: ["IOS", "ANDROID", "CROSS-PLATFORM"],
    summary: "Native and cross-platform apps for iOS and Android, from first screen to store listing.",
    introHeading: "Introduction",
    introBody:
      "We build for one platform or both, native or cross-platform, depending on what the product needs. Every mobile build includes what it takes to actually ship — store listings, push infrastructure, and a backend that keeps up.",
    deliverables: ["iOS and/or Android build", "Backend & API integration", "Push notification infrastructure", "App store submission"],
    stack: [
      { label: "Mobile", items: ["Flutter", "Dart", "Kotlin", "Swift"] },
      { label: "Backend", items: ["Go", "Node.js"] },
      { label: "Database", items: ["PostgreSQL", "MongoDB"] },
    ],
    gradientFrom: "from-orange-500",
    gradientTo: "to-rose-600",
    packageSlugs: ["app-mvp", "dual-platform-app"],
    wizardTrack: "mobile",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
