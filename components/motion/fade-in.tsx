"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const variantsFor = (direction: Direction, distance: number): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
  },
  show: { opacity: 1, x: 0, y: 0 },
});

interface FadeInProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

export function FadeIn({
  children,
  direction = "up",
  distance = 30,
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  margin = "-80px",
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: margin as `${number}px` }}
      variants={variantsFor(direction, distance)}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
