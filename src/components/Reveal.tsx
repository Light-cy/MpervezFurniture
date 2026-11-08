import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade-up reveal when the section scrolls into view.
 *
 * Visitors who ask for reduced motion get the content immediately, with no
 * fade, no offset and no animation machinery, so nothing is ever hidden behind
 * an animation.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
