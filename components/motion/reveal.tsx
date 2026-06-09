"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "down" | "left" | "right" | "none";

const offset: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 44 },
  down: { y: -44 },
  left: { x: 44 },
  right: { x: -44 },
  none: {},
};

export function Reveal({
  children,
  dir = "up",
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  dir?: Dir;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[dir], filter: "blur(8px)" },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children should be <Reveal> or motion items with `item` variants. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
