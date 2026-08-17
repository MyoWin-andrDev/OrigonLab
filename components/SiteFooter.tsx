"use client";

import { useEffect, useState } from "react";
import EmailCaptureForm from "./EmailCaptureForm";

/**
 * Contact footer, laid out like the Lusion reference:
 *
 *   ADDRESS          SOCIAL / ENQUIRIES          EMAIL CAPTURE
 *
 * followed by a bottom rule with the tagline, a live clock and a
 * time-of-day greeting.
 */

/* TODO: replace with the real registered address before launch. */
const address = [
  "Unit 12, 3rd Floor",
  "Soi Buakhao, Nong Prue",
  "Bang Lamung, Chonburi 20150",
  "Pattaya, Thailand",
];

const socials = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const enquiries = [
  { label: "General enquiries", email: "hello@origon.dev" },
  { label: "New business", email: "business@origon.dev" },
];

function greetingFor(hour: number) {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
}

export default function SiteFooter() {
  // Rendered only after mount so server and client markup can't disagree.
  const [clock, setClock] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      setGreeting(greetingFor(d.getHours()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mx-auto max-w-content px-6 pb-12 pt-28 md:px-10 md:pt-36">
      <div className="hairline pt-14 md:pt-20">
        {/* The capture column is widest — it's the only thing here that asks
            the reader to do something. */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr] lg:gap-16">
          {/* ── Address ─────────────────────────────────────────── */}
          <address className="not-italic">
            <span className="type-label-sm text-faint">Studio</span>
            <div className="mt-4 space-y-1">
              {address.map((line) => (
                <p key={line} className="type-body text-ink">
                  {line}
                </p>
              ))}
            </div>
          </address>

          {/* ── Social + enquiries ──────────────────────────────── */}
          <div>
            <ul className="space-y-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    data-cursor-grow
                    className="type-body text-ink transition-opacity duration-300 hover:opacity-60"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-8">
              {enquiries.map((e) => (
                <div key={e.email}>
                  <span className="type-body block text-dim">{e.label}</span>
                  <a
                    href={`mailto:${e.email}`}
                    data-cursor-grow
                    className="type-body block text-ink transition-opacity duration-300 hover:opacity-60"
                  >
                    {e.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* ── Email capture ───────────────────────────────────── */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="type-display-md max-w-sm text-ink">
              Leave your email and we&apos;ll be in touch
            </h2>
            <p className="type-body-sm mt-4 max-w-sm text-dim">
              Tell us where to reach you and we&apos;ll follow up — no
              newsletter, no list.
            </p>
            <div className="mt-7 max-w-md">
              <EmailCaptureForm />
            </div>
          </div>
        </div>

        {/* ── Bottom rule ───────────────────────────────────────── */}
        <div className="hairline mt-20 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <span className="type-label-sm text-faint">OrigonLab © 2026</span>

          <span className="type-label-sm text-faint">A software development lab</span>

          <span className="type-label-sm flex items-center gap-3 text-faint">
            {/* suppressHydrationWarning: clock is intentionally client-only */}
            <span className="tabular-nums text-dim" suppressHydrationWarning>
              {clock ?? "--:--:--"}
            </span>
            <span>{greeting ?? ""}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
