"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StaggerContainer({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  distance = 24,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
