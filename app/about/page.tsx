import AnimatedSection from "@/components/AnimatedSection";
import AnimatedText from "@/components/AnimatedText";
import PillButton from "@/components/PillButton";

interface Principle {
  title: string;
  body: string;
}

const principles: Principle[] = [
  {
    title: "One pipeline, five disciplines",
    body: "Design and engineering sit in the same room here. A logo, a UI system, and the backend it ships on all come from one process, not three handoffs.",
  },
  {
    title: "Price before you commit",
    body: "You can price a project yourself before ever getting on a call with us. We built the estimator so you'd never have to guess what something costs.",
  },
  {
    title: "Built to stay up",
    body: "We don't consider a project done at launch. Hosting, deployment, and monitoring are part of the build, not an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-36 md:px-10 md:pt-48">
      {/* ── Intro ─────────────────────────────────────────────── */}
      <section className="max-w-3xl">
        <AnimatedSection delay={0.1}>
          <p className="type-label text-dim">About</p>
        </AnimatedSection>

        <h1 className="type-display-xl mt-6 text-ink">
          <AnimatedText
            as="span"
            text="A lab,"
            delay={0.2}
            stagger={0.06}
            className="block"
          />
          <AnimatedText
            as="span"
            text="not an agency."
            delay={0.32}
            stagger={0.06}
            className="block"
          />
        </h1>

        <AnimatedSection delay={0.55}>
          <p className="type-body-lg mt-8 text-inkMuted">
            OrigonLab is a software development lab. We design brand identities, build interfaces,
            ship websites and mobile apps, and run the infrastructure underneath them — usually
            all for the same client, all from the same process.
          </p>
          <p className="type-body mt-5 max-w-lg text-dim">
            We started OrigonLab because most agencies hand a project between three separate teams —
            a design studio, a dev shop, and a hosting provider — and something gets lost at every
            handoff. We keep it in one place.
          </p>
        </AnimatedSection>
      </section>

      {/* ── Principles ────────────────────────────────────────── */}
      <AnimatedSection delay={0.1} className="mt-28">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
          {principles.map((principle, i) => (
            <div
              key={principle.title}
              className="bg-bg p-8 transition-colors duration-300 ease-lusion hover:bg-elevated"
            >
              <span className="type-label-sm text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="type-title-sm mt-4 text-ink">{principle.title}</h3>
              <p className="type-body-sm mt-3 text-dim">{principle.body}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Closing CTA ───────────────────────────────────────── */}
      <AnimatedSection
        delay={0.1}
        className="hairline mt-28 flex flex-col items-start gap-8 pt-16"
      >
        <AnimatedText
          as="h2"
          text={"Want to see who's building it?"}
          delay={0.05}
          stagger={0.05}
          className="type-display-md max-w-md text-ink"
        />
        <PillButton href="/team">Meet the team →</PillButton>
      </AnimatedSection>
    </main>
  );
}
