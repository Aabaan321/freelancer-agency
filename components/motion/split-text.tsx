"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitText({
  text,
  className,
  staggerChildren = 0.025,
  delayChildren = 0.1,
  once = true,
  as = "h1",
}: SplitTextProps) {
  const words = text.split(" ");
  const Tag = motion[as];

  return (
    <Tag
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren } },
      }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]" aria-hidden>
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: "50%", rotateZ: 6 },
                show: {
                  opacity: 1,
                  y: 0,
                  rotateZ: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {char === "\n" ? <br /> : char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
