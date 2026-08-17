import { TeamMember } from "@/lib/types";

// Photography still to come; the gradient + monogram stands in until then.
// The four roles map one-to-one onto the four disciplines in data/services.ts,
// and the tech lists reflect the stack OrigonLab actually builds on.
export const team: TeamMember[] = [
  {
    slug: "graphic-designer",
    name: "Charm",
    position: "Graphic Designer",
    bio: "Builds brand identities from the mark outward — logo, icon systems, and the 3D and motion work that brings them off the page.",
    skills: [
      // 3D sits second so it surfaces on the card, which shows the first two.
      "Brand identity",
      "3D modelling & rendering",
      "Texturing & lighting",
      "Product visualisation",
      "Motion & animation",
      // The bridge into OrigonLab's web and app work — optimised glTF, not
      // render-farm geometry that would never ship in a browser.
      "Web-ready 3D (glTF)",
      "Logo & wordmark",
      "Typography & iconography",
      "Art direction",
      "Print & packaging",
    ],
    tech: [
      // A coherent pipeline: model → texture → web, plus the 2D suite.
      "Blender",
      "Cinema 4D",
      "Substance 3D",
      "Spline",
      "Illustrator",
      "Photoshop",
      "After Effects",
      "InDesign",
      "Figma",
    ],
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-600",
  },
  {
    slug: "ui-ux-designer",
    name: "Zenith",
    position: "UI/UX Designer",
    bio: "Takes products from user research and flows through wireframes to a full interface system — then builds a clickable prototype you can test and sign off before a line of code is written.",
    skills: [
      // Prototyping sits second so it surfaces in the card's properties line,
      // which shows the first two.
      "User research",
      "Prototyping",
      "Interaction design",
      "Information architecture",
      "Wireframing",
      "Design systems",
      "Usability testing",
      "Accessibility (WCAG)",
    ],
    tech: ["Figma", "Framer", "ProtoPie", "Maze", "Storybook"],
    gradientFrom: "from-violet-500",
    gradientTo: "to-indigo-700",
  },
  {
    slug: "mobile-developer",
    name: "Zyden",
    position: "Mobile Developer",
    bio: "Ships iOS and Android applications end to end, from first screen to store listing and release.",
    skills: [
      "iOS & Android",
      "Cross-platform builds",
      "State management",
      "Offline-first sync",
      "Push notifications",
      "Store submission",
    ],
    tech: ["Flutter", "Dart", "Kotlin", "Swift", "Jetpack Compose"],
    gradientFrom: "from-teal-400",
    gradientTo: "to-cyan-700",
  },
  {
    slug: "fullstack-developer",
    name: "Adam",
    position: "Fullstack Developer",
    bio: "Designs the system before building it — architecture, data model and state machines — then ships the web build, the API behind it, and the infrastructure that keeps it running.",
    skills: [
      "System design",
      "App architecture",
      "Data modelling",
      "State machines",
      "API design",
      "Authentication",
      "CI/CD pipelines",
      "Infrastructure",
      "Performance & caching",
      "Project management",
    ],
    tech: [
      "TypeScript",
      "React",
      "Next.js",
      "Go",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
    ],
    gradientFrom: "from-rose-500",
    gradientTo: "to-fuchsia-700",
  },
];
