# Origon

A software development lab site — portfolio, services, packages, and an interactive
pricing estimator. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and
Framer Motion, styled after labs.lusion.co's design language (near-black UI, mono
eyebrow labels, serif display type, EXP-numbered project pages).

## Getting started

This project was hand-written (not scaffolded via `create-next-app`) because the build
environment had no network access to npm. Before running it, install dependencies:

```bash
npm install
```

Then run the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  page.tsx                 → Home: portfolio grid (website + mobile projects)
  work/[slug]/page.tsx      → Project detail (EXP-style, like Lusion's "Akari" page)
  services/page.tsx         → Services grid (4 disciplines)
  services/[slug]/page.tsx  → Service detail — includes relevant packages + embedded pricing wizard
  pricing/page.tsx          → All 9 packages + general pricing wizard (track switcher)
  about/page.tsx
  team/page.tsx
  contact/page.tsx

components/
  Nav.tsx                   → Top nav (logo mark, links, mobile menu)
  CustomCursor.tsx           → Soft blurred cursor (desktop only, disabled below 901px)
  IndexCard.tsx               → Grid card used on Home + Services ("Explore more" pattern)
  MediaPanel.tsx              → Gradient placeholder for project/service hero visuals
  TagRow.tsx                   → Mono uppercase tag list (e.g. "WEBGL · 2D")
  PillButton.tsx                → Rounded CTA button (solid / outline variants)
  PricingWizard.tsx              → The step-by-step estimator itself
  PricingWizardSection.tsx        → Client wrapper adding track-switching for /pricing

data/
  projects.ts    → Portfolio case studies (PLACEHOLDER — replace with real work)
  services.ts     → The 4 service disciplines and their copy
  packages.ts      → The 9 packages
  wizard.ts         → Step-by-step wizard questions/costs per track
  team.ts            → Team members (PLACEHOLDER — replace with real people)

lib/
  types.ts  → Shared TypeScript types for all content above
```

## What's placeholder and needs real content

- **`data/projects.ts`** — 6 dummy case studies (Meridian, Northline, etc). Replace with
  real client work. `gradientFrom`/`gradientTo` are Tailwind classes used by `MediaPanel`
  as a stand-in visual until you have real project screenshots/video — swap `MediaPanel`
  for an `<Image>`/`<video>` once you have assets.
- **`data/team.ts`** — 4 placeholder members with "Name Surname". Replace with real names,
  positions, bios, and ideally real headshots (currently rendered as initials).
- **Logo mark** — `components/Nav.tsx` currently renders a plain "O" in a rounded square
  as a text-based placeholder. Swap for a real SVG mark when ready.
- **Pricing numbers** — all costs in `data/packages.ts` and `data/wizard.ts` are estimates
  from early discussion, not final rates. Update both files together — the "closest
  package" suggestion logic in `PricingWizard.tsx` (`suggestionFor()`) uses hardcoded
  price bands, so revisit those thresholds if package prices change materially.
- **Contact form** — `/contact` currently only offers a `mailto:` link and no backend.
  The wizard also doesn't submit anywhere yet. Wire up an API route or a form service
  (Resend, Formspree, etc.) when ready to capture real leads.

## Design tokens

Defined in `tailwind.config.ts`:

- `bg` #0D0D0D, `surface` #141414, `card` #1A1A1A, `line` #2A2A2A — background layers
- `ink` #F5F5F5, `dim` #8A8A8A, `faint` #5A5A5A — text layers
- `font-display` (Fraunces, serif) for headlines, `font-body` (Inter) for copy,
  `font-mono` (JetBrains Mono) for eyebrows/tags/prices
- No accent color is used in UI chrome — color only appears in each project's/service's
  `gradientFrom`/`gradientTo` media panel, matching Lusion's grayscale-UI-plus-colorful-media
  pattern.

## Known limitations / next steps

- No CMS — all content is edited directly in the `data/` TypeScript files, as discussed.
- No backend — the pricing wizard calculates entirely client-side and doesn't persist
  or send results anywhere yet.
- Fonts load via `next/font/google`, which fetches at build time — first `npm run build`
  needs network access.
- Reduced-motion is respected globally via `prefers-reduced-motion` in `globals.css`.
