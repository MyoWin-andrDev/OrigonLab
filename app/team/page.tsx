import { team } from "@/data/team";
import TeamGrid from "@/components/TeamGrid";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";

export default function TeamPage() {
  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-36 md:px-10 md:pt-48">
      <section className="max-w-2xl">
        <AnimatedSection delay={0.1} y={16}>
          <span className="type-label text-dim">Team</span>
        </AnimatedSection>

        <AnimatedText
          as="h1"
          text={"Who's building"}
          delay={0.2}
          stagger={0.07}
          className="type-display-xl mt-7 text-ink"
        />

        <AnimatedSection delay={0.5} y={16}>
          <p className="type-body-lg mt-8 max-w-md text-dim">
            A small, dedicated group covering design, mobile, and infrastructure —
            the same people you&apos;ll talk to are the ones building it.
          </p>
        </AnimatedSection>
      </section>

      <section className="mt-20 lg:mt-24">
        <TeamGrid team={team} />
      </section>
    </main>
  );
}
