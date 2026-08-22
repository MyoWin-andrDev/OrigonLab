import type { Metadata } from "next";
import HomeIndex from "@/components/HomeIndex";

/**
 * Server shell so the homepage can export metadata — a "use client" module
 * cannot, and this is the page that matters most in search.
 */
export const metadata: Metadata = {
  // Absolute: skips the "%s — OrigonLab" template, which would otherwise
  // duplicate the brand name already in this title.
  title: {
    absolute: "OrigonLab — Design, apps and infrastructure from one lab",
  },
  description:
    "A software development lab in Pattaya, Thailand. Brand identity, UI/UX, websites and mobile apps — designed, built and hosted by one team.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomeIndex />;
}
