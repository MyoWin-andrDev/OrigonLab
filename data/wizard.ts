import { WizardTrack } from "@/lib/types";

export const wizardTracks: Record<string, WizardTrack> = {
  web: {
    key: "web",
    label: "Website Development",
    base: 300,
    steps: [
      {
        key: "type",
        question: "Static or dynamic?",
        options: [
          { id: "static", title: "Static site", desc: "Fixed content, fastest to launch", cost: 0 },
          { id: "dynamic", title: "Dynamic site", desc: "CMS or database-driven", cost: 500 },
        ],
      },
      {
        key: "pages",
        question: "How many pages, roughly?",
        options: [
          { id: "p5", title: "Up to 5", desc: "Landing page or brochure site", cost: 0 },
          { id: "p15", title: "Up to 15", desc: "Multi-section marketing site", cost: 350 },
          { id: "p30", title: "30+", desc: "Large content site or portal", cost: 900 },
        ],
      },
      {
        key: "auth",
        question: "Does it need user accounts?",
        options: [
          { id: "none", title: "No accounts", desc: "Public content only", cost: 0 },
          { id: "basic", title: "Basic login", desc: "Email / password auth", cost: 400 },
          { id: "social", title: "Social + email login", desc: "OAuth providers included", cost: 650 },
        ],
      },
      {
        key: "payment",
        question: "Do you need a payment gateway?",
        options: [
          { id: "no", title: "No payments", desc: "Not an e-commerce site", cost: 0 },
          { id: "yes", title: "Yes, add checkout", desc: "Stripe / PayPal integration", cost: 700 },
        ],
      },
      {
        key: "admin",
        question: "Need an admin dashboard?",
        options: [
          { id: "no", title: "No dashboard", desc: "Content edited by us or CMS", cost: 0 },
          { id: "yes", title: "Custom admin panel", desc: "For managing content / orders", cost: 900 },
        ],
      },
    ],
  },
  mobile: {
    key: "mobile",
    label: "Mobile Development",
    base: 700,
    steps: [
      {
        key: "platform",
        question: "Which platform(s)?",
        options: [
          { id: "one", title: "iOS or Android", desc: "Single platform", cost: 0 },
          { id: "both", title: "iOS + Android", desc: "Shared codebase or native both", cost: 1400 },
        ],
      },
      {
        key: "screens",
        question: "How many core screens?",
        options: [
          { id: "s6", title: "Up to 6", desc: "Simple utility app", cost: 0 },
          { id: "s15", title: "Up to 15", desc: "Full-feature app", cost: 900 },
          { id: "s30", title: "30+", desc: "Complex, multi-flow app", cost: 2200 },
        ],
      },
      {
        key: "backend",
        question: "Does it need a custom backend?",
        options: [
          { id: "none", title: "No backend", desc: "Local data or third-party API only", cost: 0 },
          { id: "yes", title: "Custom backend", desc: "Our own API + database", cost: 1200 },
        ],
      },
      {
        key: "auth",
        question: "Authentication method?",
        options: [
          { id: "none", title: "No login", desc: "", cost: 0 },
          { id: "basic", title: "Email / password", desc: "", cost: 400 },
          { id: "social", title: "Social login", desc: "Google / Apple sign-in", cost: 600 },
        ],
      },
      {
        key: "push",
        question: "Push notifications?",
        options: [
          { id: "no", title: "Not needed", desc: "", cost: 0 },
          { id: "yes", title: "Yes, include push", desc: "", cost: 350 },
        ],
      },
    ],
  },
  design: {
    key: "design",
    label: "Graphic Design & UI/UX",
    base: 150,
    steps: [
      {
        key: "scope",
        question: "What do you need designed?",
        options: [
          { id: "logo", title: "Logo + icon only", desc: "", cost: 0 },
          { id: "brand", title: "Full brand system", desc: "Logo, icons, guide", cost: 400 },
          { id: "product", title: "Full product UI/UX", desc: "Wireframes to hi-fi screens", cost: 1100 },
        ],
      },
      {
        key: "social",
        question: "Ongoing social media design?",
        options: [
          { id: "no", title: "One-time only", desc: "", cost: 0 },
          { id: "yes", title: "Monthly social kit", desc: "Templates + monthly assets", cost: 300 },
        ],
      },
      {
        key: "screens",
        question: "If product UI — how many screens?",
        options: [
          { id: "na", title: "Not applicable", desc: "", cost: 0 },
          { id: "s10", title: "Up to 10 screens", desc: "", cost: 0 },
          { id: "s25", title: "Up to 25 screens", desc: "", cost: 600 },
        ],
      },
    ],
  },
  backend: {
    key: "backend",
    label: "Backend & Deployment",
    base: 250,
    steps: [
      {
        key: "hosting",
        question: "What hosting setup do you need?",
        options: [
          { id: "shared", title: "Standard hosting", desc: "Single environment", cost: 0 },
          { id: "scalable", title: "Scalable cloud setup", desc: "Auto-scaling, load balancing", cost: 900 },
        ],
      },
      {
        key: "domain",
        question: "Domain & DNS setup?",
        options: [
          { id: "no", title: "Already have it", desc: "", cost: 0 },
          { id: "yes", title: "Register + configure", desc: "", cost: 80 },
        ],
      },
      {
        key: "cicd",
        question: "Release pipeline?",
        options: [
          { id: "manual", title: "Manual deploys", desc: "", cost: 0 },
          { id: "cicd", title: "CI/CD pipeline", desc: "Automated build & deploy", cost: 600 },
        ],
      },
      {
        key: "monitor",
        question: "Monitoring & uptime alerts?",
        options: [
          { id: "no", title: "Not needed", desc: "", cost: 0 },
          { id: "yes", title: "Yes, include monitoring", desc: "", cost: 250 },
        ],
      },
    ],
  },
  full: {
    key: "full",
    label: "Full Bundle",
    base: 1200,
    steps: [
      {
        key: "product",
        question: "What are you building?",
        options: [
          { id: "web", title: "Website", desc: "", cost: 0 },
          { id: "mobile", title: "Mobile app", desc: "", cost: 900 },
          { id: "both", title: "Website + mobile app", desc: "", cost: 1800 },
        ],
      },
      {
        key: "design",
        question: "Include brand & UI/UX design?",
        options: [
          { id: "no", title: "We have our own", desc: "", cost: 0 },
          { id: "yes", title: "Yes, full design pass", desc: "", cost: 800 },
        ],
      },
      {
        key: "auth",
        question: "Authentication?",
        options: [
          { id: "basic", title: "Email / password", desc: "", cost: 400 },
          { id: "social", title: "Social + email", desc: "", cost: 650 },
        ],
      },
      {
        key: "payment",
        question: "Payment gateway?",
        options: [
          { id: "no", title: "Not needed", desc: "", cost: 0 },
          { id: "yes", title: "Yes, add checkout", desc: "", cost: 700 },
        ],
      },
      {
        key: "infra",
        question: "Hosting & deployment included?",
        options: [
          { id: "basic", title: "Standard hosting", desc: "", cost: 300 },
          { id: "scalable", title: "Scalable + CI/CD", desc: "", cost: 1200 },
        ],
      },
    ],
  },
};

export function getWizardTrack(key: string): WizardTrack | undefined {
  return wizardTracks[key];
}
