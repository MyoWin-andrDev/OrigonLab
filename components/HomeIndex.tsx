"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import IndexCard from "./IndexCard";
import ProjectRow from "./ProjectRow";
import AnimatedText from "./AnimatedText";
import AnimatedSection from "./AnimatedSection";
import ScrollCue from "./ScrollCue";
import PillButton from "./PillButton";
import { useViewMode } from "./ViewModeProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

type Filter = "all" | "website" | "mobile";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "website", label: "Website" },
  { key: "mobile", label: "Mobile" },
];

export default function HomeIndex() {
  const [filter, setFilter] = useState<Filter>("all");
  const { mode } = useViewMode();

  const counts = useMemo(
    () => ({
      all: projects.length,
      website: projects.filter((p) => p.category === "website").length,
      mobile: projects.filter((p) => p.category === "mobile").length,
    }),
    []
  );

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const mobileProjects = useMemo(
    () => projects.filter((p) => p.category === "mobile"),
    []
  );

  return (
    <main className="mx-auto max-w-content px-6 md:px-10">
      {/* ══ HERO ══════════════════════════════════════════════════
          Content sits low in the viewport so the animated backdrop
          carries the upper half, as on labs.lusion.co. */}
      <section className="flex min-h-[88vh] flex-col justify-end pb-16 pt-36 md:min-h-screen md:pb-20">
        <AnimatedSection delay={0.1} y={16}>
          <span className="type-label text-dim">Labs area</span>
        </AnimatedSection>

        <h1 className="type-display-xl mt-7 text-ink">
          <AnimatedText as="span" text="Play ground" delay={0.15} className="block" />
          <AnimatedText as="span" text="R&D collection" delay={0.28} className="block" />
          <AnimatedText as="span" text="Experiments" delay={0.41} className="block" />
        </h1>

        <AnimatedSection delay={0.62} y={16}>
          <p className="type-body-lg mt-9 max-w-md text-dim">
            A studio dedicated to anticipating how new technology reshapes products —
            and how people actually end up using them.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.78} y={16} className="mt-14">
          <ScrollCue />
        </AnimatedSection>
      </section>

      {/* ══ FILTER TABS ═══════════════════════════════════════════ */}
      <AnimatedSection y={18} className="pt-6">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                data-cursor-grow
                aria-pressed={active}
                className="group flex items-center gap-2.5"
              >
                <span
                  className={`type-tab transition-colors duration-300 ease-lusion ${
                    active ? "text-ink" : "text-dim group-hover:text-ink"
                  }`}
                >
                  {f.label}
                </span>
                <span
                  className={`type-label-sm flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 transition-colors duration-300 ease-lusion ${
                    active
                      ? "bg-ink text-bg"
                      : "border border-line text-faint group-hover:border-lineStrong"
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ══ PROJECT INDEX — list or grid ══════════════════════════ */}
      <section className="mt-12 md:mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            // Re-keying on mode+filter makes AnimatePresence cross-fade the
            // whole set instead of snapping between layouts.
            key={`${mode}-${filter}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {mode === "list" ? (
              <div>
                {visible.map((p, i) => (
                  <ProjectRow
                    key={p.slug}
                    index={i}
                    href={`/work/${p.slug}`}
                    expNumber={p.expNumber}
                    year={p.year}
                    title={p.title}
                    tags={p.tags}
                    gradientFrom={p.gradientFrom}
                    gradientTo={p.gradientTo}
                  />
                ))}
                {/* Closing rule so the last row reads as part of a table */}
                <div className="hairline" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((p, i) => (
                  <AnimatedSection key={p.slug} delay={Math.min(i, 6) * 0.05} y={20}>
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
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ══ MOBILE BUILDS ═════════════════════════════════════════ */}
      {mobileProjects.length > 0 && (
        <section className="hairline mt-32 pt-14 md:mt-40 md:pt-16">
          <AnimatedSection>
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <AnimatedText as="h2" text="Mobile builds" className="type-display-md text-ink" />
              <p className="type-label-sm text-faint">
                (Apps we shipped end to end)
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {mobileProjects.map((p, i) => (
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

      {/* ══ CLOSING CTA ═══════════════════════════════════════════ */}
      <AnimatedSection className="hairline mt-32 flex flex-col items-start gap-8 pt-14 md:mt-40">
        <AnimatedText
          as="h2"
          text="Have something to build?"
          className="type-display-md max-w-lg text-ink"
        />
        <div className="flex flex-wrap gap-3">
          <PillButton href="/services">Our services</PillButton>
          <PillButton href="/pricing" variant="outline">
            Get a price
          </PillButton>
        </div>
      </AnimatedSection>
    </main>
  );
}
