"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const dotX = useSpring(cx, { stiffness: 500, damping: 30, mass: 0.3 });
  const dotY = useSpring(cy, { stiffness: 500, damping: 30, mass: 0.3 });
  const ringX = useSpring(cx, { stiffness: 150, damping: 18, mass: 0.6 });
  const ringY = useSpring(cy, { stiffness: 150, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };
    const enter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor=hover], input, textarea, select, [role=button]")) {
        setHovering(true);
      }
    };
    const leave = () => setHovering(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, [cx, cy]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[200] pointer-events-none rounded-full bg-gold"
        style={{
          x: dotX,
          y: dotY,
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[200] pointer-events-none rounded-full border border-gold/50 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
