"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (isInView) motionValue.set(to);
  }, [isInView, motionValue, to]);

  useEffect(() => {
    const u = spring.on("change", (v) => setDisplay(v));
    return () => u();
  }, [spring]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
