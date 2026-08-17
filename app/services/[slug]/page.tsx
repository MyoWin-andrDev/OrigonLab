import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, services } from "@/data/services";
import { getPackagesBySlugs } from "@/data/packages";
import { getWizardTrack } from "@/data/wizard";
import MediaPanel from "@/components/MediaPanel";
import PricingWizard from "@/components/PricingWizard";
import PackageGrid from "@/components/PackageGrid";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return notFound();

  const relevantPackages = getPackagesBySlugs(service.packageSlugs);
  const track = getWizardTrack(service.wizardTrack);

  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-28 md:px-10 md:pt-32">
      {/* ── Back link ─────────────────────────────────────────────── */}
      <AnimatedSection delay={0.05} y={16}>
        <Link
          href="/services"
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
          All services
        </Link>
      </AnimatedSection>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[380px_1fr] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start lg:pb-4">
          <AnimatedSection delay={0.12} y={16}>
            <span className="type-label block text-dim">EXP {service.expNumber}</span>
          </AnimatedSection>

          <AnimatedText
            as="h1"
            text={service.title}
            delay={0.2}
            stagger={0.07}
            className="type-display-lg mt-5 text-ink"
          />

          <AnimatedSection delay={0.4} y={16}>
            <p className="type-body mt-6 max-w-sm text-dim">{service.summary}</p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.22}>
          <MediaPanel
            from={service.gradientFrom}
            to={service.gradientTo}
            title={service.shortTitle}
            className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[480px]"
          />
        </AnimatedSection>
      </div>

      {/* ── Scope + Introduction ──────────────────────────────────── */}
      <AnimatedSection className="hairline mt-24 grid grid-cols-1 gap-12 pt-14 lg:mt-32 lg:grid-cols-[380px_1fr] lg:gap-16 lg:pt-16 xl:gap-24">
        <div>
          <span className="type-label block text-dim">Scope</span>
          <p className="type-label mt-5 text-ink">{service.tags.join(" · ")}</p>
        </div>

        <div className="max-w-2xl">
          <span className="type-label block text-dim">{service.introHeading}</span>
          <p className="type-body-lg mt-5 text-inkMuted">{service.introBody}</p>

          {/* Tech stack — languages, frameworks and databases only. */}
          {service.stack && service.stack.length > 0 && (
            <>
              <span className="type-label mt-12 block text-dim">Stack</span>
              <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
                {service.stack.map((group) => (
                  <div key={group.label} className="bg-bg p-5">
                    <span className="type-label-sm block text-faint">
                      {group.label}
                    </span>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="type-label-sm rounded-pill bg-card px-3 py-1.5 text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          <span className="type-label mt-12 block text-dim">What&apos;s included</span>
          <ul className="mt-5 space-y-3">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-dim" />
                <span className="type-body text-inkMuted">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      {/* ── Relevant packages ─────────────────────────────────────── */}
      {relevantPackages.length > 0 && (
        <AnimatedSection className="hairline mt-28 pt-14 lg:mt-36 lg:pt-16">
          <span className="type-label text-dim">Relevant packages</span>
          <AnimatedText
            as="h2"
            text="Where this usually starts"
            className="type-display-md mt-4 text-ink"
          />

          <div className="mt-12">
            <PackageGrid packages={relevantPackages} />
          </div>
        </AnimatedSection>
      )}

      {/* ── Estimate ──────────────────────────────────────────────── */}
      {track && (
        <AnimatedSection className="hairline mt-28 pt-14 lg:mt-36 lg:pt-16">
          <span className="type-label text-dim">Estimate</span>
          <AnimatedText
            as="h2"
            text={`Price out a ${service.shortTitle.toLowerCase()} project`}
            className="type-display-md mt-4 max-w-2xl text-ink"
          />
          <p className="type-body mt-5 max-w-md text-dim">
            Answer a few questions about scope and get a live number — no call
            required to start.
          </p>
          <div className="mt-12">
            <PricingWizard track={track} />
          </div>
        </AnimatedSection>
      )}
    </main>
  );
}
