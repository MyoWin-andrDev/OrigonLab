"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WizardOption, WizardTrack } from "@/lib/types";
import PillButton from "./PillButton";
import OwnershipToggle from "./OwnershipToggle";
import {
  OwnershipMode,
  OWNERSHIP_MULTIPLIER,
  FEATURE_DISCOUNT_LABEL,
} from "@/data/packages";

interface PricingWizardProps {
  track: WizardTrack;
  // if true, shows a track switcher (used on the general /pricing page)
  allTracks?: WizardTrack[];
  onTrackChange?: (key: string) => void;
}

type Answers = Record<string, WizardOption>;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Matches an estimate to a package tier. Takes the LICENCE subtotal, not the
 * final total — the tier thresholds are licence-priced, so passing an
 * ownership-inflated figure would wrongly promote every quote a tier.
 */
function suggestionFor(subtotal: number): string {
  const total = subtotal;
  if (total < 500) return "Starter tier — close to our Static Launch or Identity Basic package.";
  if (total < 1500) return "Growth tier — similar to our Dynamic Platform or Dual Platform App package.";
  if (total < 4000) return "Scale tier — in range with our Commerce Build package.";
  return "Full Stack tier — this fits our Product Launch package or above.";
}

export default function PricingWizard({ track, allTracks, onTrackChange }: PricingWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  // Whether the client takes the source. Mirrors the pricing page toggle.
  const [mode, setMode] = useState<OwnershipMode>("licence");

  const step = track.steps[stepIndex];
  const selected = answers[step?.key];

  /** Licence-price subtotal, before any ownership uplift. */
  const subtotal = useMemo(() => {
    return track.base + Object.values(answers).reduce((sum, o) => sum + o.cost, 0);
  }, [answers, track.base]);

  /** What the ownership choice adds on top — shown as its own line. */
  const ownershipUplift = useMemo(
    () => (mode === "owned" ? Math.round(subtotal * OWNERSHIP_MULTIPLIER) - subtotal : 0),
    [subtotal, mode]
  );

  const total = subtotal + ownershipUplift;

  function selectOption(opt: WizardOption) {
    setAnswers((prev) => ({ ...prev, [step.key]: opt }));
  }

  function goNext() {
    if (!selected) return;
    if (stepIndex < track.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  }

  function restart() {
    setStepIndex(0);
    setAnswers({});
    setShowResult(false);
  }

  function switchTrack(key: string) {
    restart();
    onTrackChange?.(key);
  }

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-elevated">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-line bg-card px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="type-label-sm ml-3 text-dim">quote.sh — origon estimator</span>
      </div>

      <div className="min-h-[420px] px-6 py-9 md:px-10 md:py-11">
        {/* Track switcher */}
        {allTracks && (
          <div className="mb-8 flex flex-wrap gap-2">
            {allTracks.map((t) => (
              <button
                key={t.key}
                onClick={() => switchTrack(t.key)}
                data-cursor-grow
                className={`type-label-sm rounded-pill border px-4 py-2 transition-colors duration-300 ease-lusion ${
                  t.key === track.key
                    ? "border-ink bg-ink text-bg"
                    : "border-line text-dim hover:border-lineStrong hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`${track.key}-${stepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="type-body-sm mb-1 text-dim">
                <span className="mr-2 text-ink/70">$</span>
                track: {track.label}
              </div>
              <div className="type-label-sm mb-5 text-dim">
                Step {stepIndex + 1} / {track.steps.length}
              </div>
              <h3 className="type-title mb-7 text-ink">{step.question}</h3>

              <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {step.options.map((o) => {
                  const isSelected = selected?.id === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => selectOption(o)}
                      data-cursor-grow
                      className={`rounded-md border px-5 py-4 text-left transition-colors duration-300 ease-lusion ${
                        isSelected
                          ? "border-ink bg-ink/[0.06]"
                          : "border-line hover:border-lineStrong"
                      }`}
                    >
                      <div className="type-title-sm text-ink">{o.title}</div>
                      {(o.desc || o.cost > 0) && (
                        <div className="type-body-sm mt-1 text-dim">
                          {o.desc}
                          {o.cost > 0 && (o.desc ? " · " : "") + `+$${o.cost}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-9 flex items-center justify-between gap-4">
                <button
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  data-cursor-grow
                  className="type-label-sm text-dim transition-colors duration-300 hover:text-ink disabled:pointer-events-none disabled:opacity-20"
                >
                  ← Back
                </button>
                <span className="type-label-sm hidden text-faint sm:block">
                  {stepIndex + 1} of {track.steps.length}
                </span>
                <PillButton onClick={goNext} disabled={!selected}>
                  {stepIndex === track.steps.length - 1 ? "See estimate" : "Next"} →
                </PillButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <h3 className="type-title mb-6 text-ink">Your estimate</h3>

              <div className="mb-7 max-h-56 overflow-y-auto">
                <div className="flex justify-between gap-4 border-b border-dashed border-line py-2.5">
                  <span className="type-body-sm text-dim">Base — {track.label}</span>
                  <span className="type-body-sm shrink-0 text-ink">${track.base}</span>
                </div>
                {track.steps.map((s) => {
                  const a = answers[s.key];
                  if (!a) return null;
                  return (
                    <div
                      key={s.key}
                      className="flex justify-between gap-4 border-b border-dashed border-line py-2.5"
                    >
                      <span className="type-body-sm text-dim">
                        {s.question} → {a.title}
                      </span>
                      <span className="type-body-sm shrink-0 text-ink">
                        {a.cost > 0 ? `+$${a.cost}` : "—"}
                      </span>
                    </div>
                  );
                })}
                {/* Ownership uplift as its own line, so the cost of taking
                    the source is never buried inside the total. */}
                {ownershipUplift > 0 && (
                  <div className="flex justify-between gap-4 border-b border-dashed border-line py-2.5">
                    <span className="type-body-sm text-dim">
                      Full source ownership ({OWNERSHIP_MULTIPLIER}×)
                    </span>
                    <span className="type-body-sm shrink-0 text-ink">
                      +${ownershipUplift.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Ownership choice — flips the total live */}
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-panel border border-line p-4">
                <div className="min-w-0">
                  <span className="type-label-sm block text-faint">
                    Who owns the design files &amp; code
                  </span>
                  <span className="type-body-sm mt-1 block text-dim">
                    {mode === "owned"
                      ? "Everything is assigned to you at handover."
                      : `We keep and maintain it — later features ${FEATURE_DISCOUNT_LABEL} off.`}
                  </span>
                </div>
                <OwnershipToggle mode={mode} onChange={setMode} variant="inline" />
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-6">
                <span className="type-label-sm text-dim">Estimated total</span>
                <span className="type-display-md text-ink">${total.toLocaleString()}</span>
              </div>

              <p className="type-body-sm mt-4 text-dim">
                This is a starting estimate based on typical scope — final pricing is
                confirmed after a short call. No payment or commitment required yet.
              </p>

              <div className="mt-6 rounded-md border border-line bg-card px-5 py-4">
                <div className="type-title-sm mb-1 text-ink">Closest package</div>
                <p className="type-body-sm text-dim">{suggestionFor(subtotal)}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={restart}
                  data-cursor-grow
                  className="type-label-sm text-dim transition-colors duration-300 hover:text-ink"
                >
                  ↺ Start over
                </button>
                <PillButton href="/contact">Talk to Origon →</PillButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
