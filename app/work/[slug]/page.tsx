import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, projects } from "@/data/projects";
import MediaPanel from "@/components/MediaPanel";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";
import IndexCard from "@/components/IndexCard";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${project.tags.join(", ")}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

/* ── Social row ────────────────────────────────────────────────────
 * Icons live as inline SVG so the buttons carry no external deps and
 * inherit `currentColor` from the link's own token-driven text colour.
 * ------------------------------------------------------------------ */
const SOCIALS = [
  {
    label: "Share on X",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
      </svg>
    ),
  },
  {
    label: "Share on LinkedIn",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
  {
    label: "Copy link to this project",
    href: "#",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return notFound();

  const related = projects.filter((p) => p.slug !== params.slug).slice(0, 3);

  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-28 md:px-10 md:pt-32">
      {/* ── Back link ─────────────────────────────────────────────── */}
      <AnimatedSection delay={0.05} y={16}>
        <Link
          href="/"
          data-cursor-grow
          className="type-label inline-flex items-center gap-2 text-dim transition-colors duration-500 ease-lusion hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M11 7H3M3 7L7 3M3 7L7 11"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
      </AnimatedSection>

      {/* ── Hero: info column + media plane ───────────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[380px_1fr] lg:gap-16 xl:gap-24">
        {/* Left — sticky on desktop */}
        <div className="flex flex-col justify-between gap-14 lg:sticky lg:top-28 lg:self-start lg:pb-4">
          <div>
            <AnimatedSection delay={0.12} y={16}>
              <span className="type-label block text-dim">EXP {project.expNumber}</span>
            </AnimatedSection>

            <AnimatedText
              text={project.title}
              as="h1"
              delay={0.2}
              stagger={0.08}
              className="type-display-lg mt-5 text-ink"
            />

            <AnimatedSection delay={0.4} y={16}>
              <p className="type-body mt-6 max-w-sm text-dim">{project.summary}</p>
            </AnimatedSection>
          </div>

          {/* Social row + live link */}
          <AnimatedSection delay={0.5} y={16} className="flex flex-col items-start gap-7">
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  data-cursor-grow
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-dim transition-colors duration-500 ease-lusion hover:border-lineStrong hover:text-ink"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                data-cursor-grow
                className="type-label-sm inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-bg transition-opacity duration-500 ease-lusion hover:opacity-80"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-bg" />
                View live
              </a>
            )}
          </AnimatedSection>
        </div>

        {/* Right — media plane */}
        <AnimatedSection delay={0.22}>
          <MediaPanel
            from={project.gradientFrom}
            to={project.gradientTo}
            title={project.title}
            category={project.category}
            image={project.image}
            imageAlt={project.imageAlt}
            className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[580px]"
          />
        </AnimatedSection>
      </div>

      {/* ── Technology + Introduction ─────────────────────────────── */}
      <AnimatedSection className="hairline mt-24 grid grid-cols-1 gap-12 pt-14 lg:mt-32 lg:grid-cols-[380px_1fr] lg:gap-16 lg:pt-16 xl:gap-24">
        <div>
          <span className="type-label block text-dim">Technology</span>
          <p className="type-label mt-5 text-ink">{project.tags.join(" · ")}</p>
          <p className="type-label-sm mt-6 text-faint">{project.year}</p>
        </div>

        <div className="max-w-2xl">
          <span className="type-label block text-dim">{project.introHeading}</span>
          <p className="type-body-lg mt-5 text-inkMuted">{project.introBody}</p>
        </div>
      </AnimatedSection>

      {/* ── Explore more ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="hairline mt-28 pt-14 lg:mt-36 lg:pt-16">
          <AnimatedSection>
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <AnimatedText text="Explore more" as="h2" className="type-display-md text-ink" />
              <p className="type-label-sm text-faint">
                (Discover what you&apos;ve been missing)
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {related.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.07} y={20}>
                <IndexCard
                  href={`/work/${p.slug}`}
                  expNumber={p.expNumber}
                  year={p.year}
                  title={p.title}
                  tags={p.tags}
                  gradientFrom={p.gradientFrom}
                  gradientTo={p.gradientTo}
                  category={p.category}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  seed={i}
                />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
