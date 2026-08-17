"use client";

import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
}

/**
 * Word-by-word slide-up reveal (labs.lusion.co headline motion).
 *
 * Each word sits inside an overflow-hidden mask (.word-wrap) and rises from
 * below it, so the letters appear to be wiped in rather than faded.
 *
 * The visible words are aria-hidden and the real string is exposed once via
 * aria-label, so screen readers read a sentence instead of loose words.
 */
export default function AnimatedText({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
  stagger = 0.06,
}: AnimatedTextProps) {
  const { ref, shown } = useReveal<HTMLHeadingElement>();

  const words = text.split(" ");
  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.h1;

  return (
    <MotionTag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        // A real space sits between the masks (not a margin) so selecting or
        // copying the heading yields "Play ground", not "Playground".
        <span key={i} aria-hidden>
          <span className="word-wrap">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={shown ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}
