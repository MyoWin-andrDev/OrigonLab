import type { Config } from "tailwindcss";

/**
 * Colours are CSS variables (see app/globals.css) so the whole palette
 * swaps on `<html data-theme="light">` without any class churn.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "var(--bg)",
        elevated:  "var(--bg-elevated)",
        card:      "var(--card)",
        line:      "var(--line)",
        lineStrong:"var(--line-strong)",
        ink:       "var(--ink)",
        inkMuted:  "var(--ink-muted)",
        dim:       "var(--dim)",
        faint:     "var(--faint)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card:  "14px",
        panel: "10px",
        pill:  "999px",
      },
      maxWidth: {
        content: "1600px",
      },
      transitionTimingFunction: {
        // Lusion's easing curve
        lusion: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
