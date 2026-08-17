"use client";

import { useState } from "react";
import { Package } from "@/lib/types";
import { OwnershipMode } from "@/data/packages";
import PackageCard from "./PackageCard";
import PackageDialog from "./PackageDialog";
import OwnershipToggle from "./OwnershipToggle";

/**
 * Owns the two pieces of state the whole pricing block shares: which
 * ownership model prices are quoted against, and which package's full spec
 * is open. The dialog is rendered once here rather than per card, so opening
 * a spec never shifts the grid.
 */
export default function PackageGrid({ packages }: { packages: Package[] }) {
  const [mode, setMode] = useState<OwnershipMode>("licence");
  const [active, setActive] = useState<Package | null>(null);

  return (
    <>
      <OwnershipToggle mode={mode} onChange={setMode} />

      {/* No items-start: cards stretch to fill their row so the grid's gap
          colour is never left showing behind a shorter card. */}
      <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p, i) => (
          <PackageCard
            key={p.slug}
            pkg={p}
            index={i}
            mode={mode}
            onOpen={setActive}
          />
        ))}
      </div>

      <PackageDialog pkg={active} mode={mode} onClose={() => setActive(null)} />
    </>
  );
}
