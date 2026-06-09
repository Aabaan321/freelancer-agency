"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Signature loading screen.
 * - Morphing chrome orb + letter-by-letter wordmark reveal
 * - Live progress counter with an iridescent fill line
 * - Exits with an upward clip-path "wipe" that reveals the page beneath
 * - Shows once per browser session
 */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // session-aware: only the first load of the session shows the full loader
    if (typeof window !== "undefined" && sessionStorage.getItem("aureon_loaded")) {
      setMounted(false);
      return;
    }
    setMounted(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalMs = reduce ? 600 : 2200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / totalMs, 1);
      // ease-out with a tiny bit of stall near the end for drama
      const eased = 1 - Math.pow(1 - p, 2.4);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("aureon_loaded", "1");
        setTimeout(() => setDone(true), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  const word = "AUREON".split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-bg aurora-field"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex flex-col items-center gap-8 px-6">
            {/* morphing chrome orb */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-28 w-28"
            >
              <div className="absolute inset-0 animate-blob bg-iridescent opacity-90 blur-[2px]" />
              <div className="absolute inset-2 animate-blob chrome [animation-delay:-3s] mix-blend-screen opacity-70" />
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-white/20" />
            </motion.div>

            {/* wordmark */}
            <div className="flex items-end gap-[2px] overflow-hidden">
              {word.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-5xl tracking-[0.2em] text-ink sm:text-6xl"
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs uppercase tracking-[0.4em] text-ink-subtle"
            >
              Boutique digital studio
            </motion.p>

            {/* progress */}
            <div className="mt-2 w-64 max-w-[70vw]">
              <div className="mb-2 flex justify-between font-mono text-[11px] text-ink-subtle">
                <span>LOADING</span>
                <span>{progress}%</span>
              </div>
              <div className="h-px w-full overflow-hidden bg-white/10">
                <div
                  className="h-full bg-iridescent transition-[width] duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
