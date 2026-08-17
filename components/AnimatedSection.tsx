"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReveal } from "./useReveal";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  y = 28,
}: AnimatedSectionProps) {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
