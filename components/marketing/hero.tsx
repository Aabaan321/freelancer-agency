"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
import { CountUp } from "@/components/motion/count-up";
import { SITE } from "@/lib/config";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden">
      {/* Animated gradient mesh */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 -z-10 opacity-80"
        aria-hidden
      >
        <div className="absolute inset-0 bg-mesh-gold animate-gradient-x" />
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full"
             style={{
               background:
                 "radial-gradient(circle, hsl(43 55% 54% / 0.18) 0%, hsl(43 55% 54% / 0.06) 30%, transparent 60%)",
             }}
        />
      </motion.div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {[...Array(40)].map((_, i) => {
          const delay = (i * 0.31) % 4;
          const dur = 4 + (i % 5);
          const left = (i * 53) % 100;
          const top = (i * 37) % 100;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0], y: [-10, -60] }}
              transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-1 w-1 rounded-full bg-gold/60"
              style={{ left: `${left}%`, top: `${top}%` }}
            />
          );
        })}
      </div>

      <motion.div style={{ y, opacity }} className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-ink-muted"
        >
          <Sparkles className="h-3 w-3 text-gold" />
          <span>Boutique digital studio · Est. {SITE.business.foundedYear}</span>
        </motion.div>

        <h1 className="mt-6 font-serif text-balance tracking-[-0.02em] leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem]">
          <SplitText text="Design with intent." as="span" />
          <br />
          <SplitText text="Build with care." as="span" delayChildren={0.4} className="iridescent-text" />
          <br />
          <SplitText text="Ship without compromise." as="span" delayChildren={0.8} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="mt-8 max-w-2xl text-pretty text-base sm:text-lg text-ink-muted leading-relaxed"
        >
          We partner with a handful of ambitious brands each quarter to design, build, and grow
          premium digital products — websites, AI agents, and brand systems engineered for the long game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Button asChild size="xl">
              <Link href="/contact">
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild size="xl" variant="outline">
              <Link href="/projects">See our work</Link>
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 2.0 }}
          className="mt-20 grid grid-cols-3 gap-6 lg:gap-12 max-w-2xl"
        >
          {[
            { value: 5, suffix: "/yr", label: "Roster cap" },
            { value: 21, suffix: " days", label: "Average build" },
            { value: 100, suffix: "%", label: "Senior-built" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-3xl lg:text-5xl text-ink">
                <CountUp to={stat.value} suffix={stat.suffix} duration={1.4} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-subtle">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-ink-subtle tracking-[0.25em] uppercase"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
