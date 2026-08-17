import { services } from "@/data/services";
import ProjectRow from "@/components/ProjectRow";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-36 md:px-10 md:pt-48">
      <section className="mb-20 max-w-2xl md:mb-28">
        <AnimatedSection delay={0.1} y={16}>
          <span className="type-label text-dim">What we do</span>
        </AnimatedSection>

        <AnimatedText
          as="h1"
          text="Services"
          delay={0.2}
          className="type-display-xl mt-7 text-ink"
        />

        <AnimatedSection delay={0.5} y={16}>
          <p className="type-body-lg mt-8 max-w-md text-dim">
            Four disciplines that work as one pipeline — hire one, or run all of
            them end to end.
          </p>
        </AnimatedSection>
      </section>

      <section>
        {services.map((s, i) => (
          <ProjectRow
            key={s.slug}
            index={i}
            href={`/services/${s.slug}`}
            expNumber={s.expNumber}
            title={s.title}
            tags={s.tags}
            gradientFrom={s.gradientFrom}
            gradientTo={s.gradientTo}
          />
        ))}
        <div className="hairline" />
      </section>
    </main>
  );
}
