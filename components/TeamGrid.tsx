"use client";

import { useState } from "react";
import { TeamMember } from "@/lib/types";
import TeamCard from "./TeamCard";
import TeamDialog from "./TeamDialog";
import AnimatedSection from "./AnimatedSection";

/**
 * Team grid plus the single dialog every card opens, so showing a profile
 * never reflows the cards behind it.
 */
export default function TeamGrid({ team }: { team: TeamMember[] }) {
  // Index travels with the member so the dialog shows the same T01–T04 badge
  // the card carries.
  const [active, setActive] = useState<{ member: TeamMember; index: number } | null>(
    null
  );

  return (
    <>
      {/* Four across at full width, halving down to two then one. */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {team.map((m, i) => (
          <AnimatedSection key={m.slug} delay={i * 0.08} y={26}>
            <TeamCard
              member={m}
              index={i}
              onOpen={(member, index) => setActive({ member, index })}
            />
          </AnimatedSection>
        ))}
      </div>

      <TeamDialog
        member={active?.member ?? null}
        index={active?.index ?? 0}
        onClose={() => setActive(null)}
      />
    </>
  );
}
