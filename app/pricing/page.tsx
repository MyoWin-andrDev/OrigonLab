import {
  packages,
  OWNERSHIP_MULTIPLIER,
  FEATURE_DISCOUNT_LABEL,
} from "@/data/packages";
import PackageGrid from "@/components/PackageGrid";
import PricingWizardSection from "@/components/PricingWizardSection";
import AnimatedText from "@/components/AnimatedText";
import AnimatedSection from "@/components/AnimatedSection";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — nine packages, transparent rates",
  description:
    "Nine packages from $250. Prices are listed openly, with an option to own the design files and source outright, plus a live estimator.",
  alternates: { canonical: "/pricing" },
};

/**
 * Structured data for the package list.
 *
 * The full spec now lives in a dialog, so it is no longer part of the initial
 * HTML. JSON-LD is the correct way to keep that detail machine-readable —
 * unlike hidden markup, which search engines treat as cloaking.
 */
function pricingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OrigonLab packages",
    itemListElement: packages.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: p.name,
        serviceType: p.discipline,
        description:
          `${p.scope}. ${p.audience} ` +
          `Listed price is a licence — OrigonLab retains the source files. ` +
          `Full ownership of design files and code is ${OWNERSHIP_MULTIPLIER}x the listed price.`,
        provider: { "@type": "Organization", name: "OrigonLab" },
        offers: {
          "@type": "Offer",
          ...(p.price === "Custom"
            ? { priceSpecification: { "@type": "PriceSpecification", price: "Custom" } }
            : { price: p.price.replace(/,/g, ""), priceCurrency: "USD" }),
          availability: "https://schema.org/InStock",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${p.name} deliverables`,
          itemListElement: p.deliverables.map((d) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: d.label, description: d.detail },
          })),
        },
      },
    })),
  };
}

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-content px-6 pb-32 pt-36 md:px-10 md:pt-48">
      <script
        type="application/ld+json"
        // Data is authored in-repo, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd()) }}
      />
      <section className="mb-20 max-w-2xl md:mb-28">
        <AnimatedSection delay={0.1} y={16}>
          <span className="type-label text-dim">Pricing</span>
        </AnimatedSection>

        <AnimatedText
          as="h1"
          text="Nine ways to start"
          delay={0.2}
          className="type-display-xl mt-7 text-ink"
        />

        <AnimatedSection delay={0.55} y={16}>
          <p className="type-body-lg mt-8 max-w-md text-dim">
            Scoped by feature and reach, not by discipline. Listed prices keep
            the design files and code with us — take full ownership of both for{" "}
            {OWNERSHIP_MULTIPLIER}× the price, or stay on the listed rate and get{" "}
            {FEATURE_DISCOUNT_LABEL} off every feature you add later.
          </p>
        </AnimatedSection>
      </section>

      {/* ── Packages ──────────────────────────────────────────────── */}
      <AnimatedSection>
        <PackageGrid packages={packages} />
      </AnimatedSection>

      {/* ── Estimator ─────────────────────────────────────────────── */}
      <AnimatedSection className="hairline mt-28 pt-14 lg:mt-36 lg:pt-16">
        <span className="type-label text-dim">Estimate</span>
        <AnimatedText
          as="h2"
          text="Price it out yourself"
          className="type-display-md mt-4 max-w-lg text-ink"
        />
        <p className="type-body mt-5 max-w-md text-dim">
          Choose a track, set the scope, and get a live number — before you ever
          have to ask.
        </p>
        <div className="mt-12">
          <PricingWizardSection />
        </div>
      </AnimatedSection>
    </main>
  );
}
