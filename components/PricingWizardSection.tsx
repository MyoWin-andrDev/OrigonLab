"use client";

import { useState } from "react";
import { wizardTracks } from "@/data/wizard";
import PricingWizard from "./PricingWizard";

export default function PricingWizardSection() {
  const [trackKey, setTrackKey] = useState("web");
  const allTracks = Object.values(wizardTracks);
  const track = wizardTracks[trackKey];

  return <PricingWizard track={track} allTracks={allTracks} onTrackChange={setTrackKey} />;
}
