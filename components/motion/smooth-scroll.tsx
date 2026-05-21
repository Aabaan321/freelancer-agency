"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Skip on touch devices for native feel
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}
