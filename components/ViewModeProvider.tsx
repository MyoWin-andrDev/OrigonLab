"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ViewMode = "grid" | "list";

interface ViewModeCtx {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const STORAGE_KEY = "origon-view-mode";

/* labs.lusion.co opens on LIST — the LIST half of the pill is filled. */
const DEFAULT_MODE: ViewMode = "list";

/* Default value means useViewMode() is safe outside the provider
   (Nav renders in the root layout) — it no-ops instead of throwing. */
const Ctx = createContext<ViewModeCtx>({
  mode: DEFAULT_MODE,
  setMode: () => {},
});

export const useViewMode = () => useContext(Ctx);

export default function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(DEFAULT_MODE);

  // Restore after mount only — reading localStorage during render would
  // desync the server HTML and trip a hydration mismatch.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "grid" || stored === "list") setModeState(stored);
  }, []);

  const setMode = (m: ViewMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}
