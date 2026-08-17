"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useViewMode } from "@/components/ViewModeProvider";

/* Lusion easing — cubic-bezier(0.16, 1, 0.3, 1) */
const EASE = [0.16, 1, 0.3, 1] as const;

type NavLink = { href: string; label: string };

const LINKS: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const VIEW_MODES = ["grid", "list"] as const;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { mode, setMode } = useViewMode();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isLight = theme === "light";

  /* Close the mobile panel whenever the route changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Escape closes the mobile panel */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <motion.header
      className="pointer-events-none fixed left-0 top-0 z-50 w-full"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
    >
      <div className="relative mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-6 md:px-10">
        {/* ── LEFT — logo mark + wordmark ───────────────────────── */}
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        >
          <Link
            href="/"
            data-cursor-grow
            aria-label="OrigonLab — home"
            className="group flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-panel bg-ink transition-transform duration-500 ease-lusion group-hover:scale-[0.92]">
              <span className="type-label-sm text-bg">O</span>
            </span>
            <span className="type-label-sm hidden text-ink/70 transition-colors duration-300 group-hover:text-ink sm:block">
              OrigonLab
            </span>
          </Link>
        </motion.div>

        {/* ── CENTRE — primary links ────────────────────────────── */}
        <nav
          aria-label="Primary"
          className="pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <ul className="flex items-center gap-8 lg:gap-10">
            {LINKS.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.36 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    data-cursor-grow
                    aria-current={active ? "page" : undefined}
                    className={`type-nav transition-colors duration-300 ${
                      active ? "text-ink" : "text-dim hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* ── RIGHT — view toggle, menu button, theme control ───── */}
        <motion.div
          className="pointer-events-auto flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
        >
          {/* Segmented GRID / LIST pill — home route only, desktop only */}
          {isHome && (
            <div
              role="group"
              aria-label="Project view mode"
              className="hidden items-center rounded-full border border-line p-1 md:flex"
            >
              {VIEW_MODES.map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    data-cursor-grow
                    aria-pressed={active}
                    className="relative rounded-full px-4 py-2"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-view-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span
                      className={`type-label-sm relative z-10 transition-colors duration-300 ${
                        active ? "text-bg" : "text-dim"
                      }`}
                    >
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            data-cursor-grow
            aria-expanded={menuOpen}
            aria-controls="origon-mobile-menu"
            className="type-label-sm rounded-full border border-line px-4 py-2.5 text-dim transition-colors duration-300 hover:border-lineStrong hover:text-ink md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          {/* Theme control — letter + ring that fills in light mode */}
          <button
            type="button"
            onClick={toggle}
            data-cursor-grow
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            className="group flex items-center gap-2 rounded-full border border-line px-3 py-2.5 transition-colors duration-300 hover:border-lineStrong"
          >
            {/* labs.lusion.co labels this B / W (black / white) */}
            <span className="type-label-sm text-dim transition-colors duration-300 group-hover:text-ink">
              {isLight ? "W" : "B"}
            </span>
            <span
              aria-hidden
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-lineStrong"
            >
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-ink"
                animate={{ scale: isLight ? 1.9 : 1, opacity: isLight ? 1 : 0.5 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </span>
          </button>
        </motion.div>

        {/* ── MOBILE PANEL ─────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="origon-mobile-menu"
              aria-label="Mobile"
              className="pointer-events-auto absolute left-0 right-0 top-full mx-6 rounded-panel border border-line bg-elevated/95 p-2 backdrop-blur-md md:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ul className="flex flex-col">
                {LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-cursor-grow
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`type-nav block rounded-panel px-4 py-4 transition-colors duration-300 ${
                          active ? "bg-card text-ink" : "text-dim hover:text-ink"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
