import PillButton from "@/components/PillButton";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-6 pb-24 pt-36 md:px-10">
      <AnimatedSection delay={0.1} y={16}>
        <span className="type-label text-dim">Start a build</span>
      </AnimatedSection>

      <h1 className="type-display-xl mt-7 text-ink">
        <AnimatedText as="span" text="Tell us what" delay={0.18} className="block" />
        <AnimatedText as="span" text={"you're building."} delay={0.3} className="block" />
      </h1>

      <AnimatedSection delay={0.58} y={16}>
        <p className="type-body-lg mt-9 max-w-md text-dim">
          Email us directly, or price out your project first and bring the
          estimate with you.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-4">
          <PillButton href="mailto:hello@origon.dev">hello@origon.dev →</PillButton>
          <PillButton href="/pricing" variant="outline">
            Price it out first
          </PillButton>
        </div>
      </AnimatedSection>
    </main>
  );
}
