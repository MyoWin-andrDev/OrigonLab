"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

/**
 * Footer email capture. The visitor leaves an address and OrigonLab follows up —
 * this is a lead, not a subscription, so the copy promises contact.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

type Status = "idle" | "sending" | "done" | "error";

export default function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const value = email.trim();
    if (!EMAIL.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("done");
      setMessage("Thanks — we'll be in touch shortly.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Please try again.");
    }
  }

  const disabled = status === "sending" || status === "done";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div
        className="
          flex items-center gap-3 rounded-pill bg-card px-6 py-4
          transition-colors duration-300 ease-lusion focus-within:bg-elevated
        "
      >
        <label htmlFor="enquiry-email" className="sr-only">
          Your email
        </label>
        <input
          id="enquiry-email"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          disabled={disabled}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          aria-invalid={status === "error"}
          aria-describedby={message ? "enquiry-status" : undefined}
          className="
            type-body min-w-0 flex-1 bg-transparent text-ink outline-none
            placeholder:text-dim disabled:opacity-60
          "
        />

        <button
          type="submit"
          disabled={disabled}
          data-cursor-grow
          aria-label="Send my email"
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            text-ink transition-all duration-300 ease-lusion
            hover:translate-x-0.5 disabled:opacity-40
          "
        >
          {status === "sending" ? (
            <motion.span
              aria-hidden
              className="block h-4 w-4 rounded-full border-2 border-ink/30 border-t-ink"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 12h15M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Status line — reserved space so the layout never jumps.
          Deliberately not AnimatePresence mode="wait": that queues the new
          message behind the old one's exit animation, so a dropped frame can
          leave a stale error on screen. */}
      <div className="mt-3 min-h-[1.25rem]">
        <motion.p
          id="enquiry-status"
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
          initial={false}
          animate={{ opacity: message ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`type-body-sm ${status === "error" ? "text-ink" : "text-dim"}`}
        >
          {message}
        </motion.p>
      </div>
    </form>
  );
}
