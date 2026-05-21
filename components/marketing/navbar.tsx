"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Work", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "AI Studio", href: "/ai-services" },
  { label: "Process", href: "/how-we-work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "container-wide flex items-center justify-between rounded-full transition-all duration-500",
            scrolled
              ? "bg-bg-elevated/80 backdrop-blur-2xl border border-line/60 px-4 py-2 shadow-[0_8px_40px_-20px_rgba(0,0,0,0.6)]"
              : "px-4 py-1",
          )}
        >
          <Link href="/" className="flex items-center gap-2 group" aria-label={SITE.name}>
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-gold via-gold-muted to-gold/60 grid place-items-center">
              <span className="font-serif text-bg text-base font-bold">A</span>
              <span className="absolute inset-0 rounded-full ring-1 ring-gold/40 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-serif text-lg tracking-tight">{SITE.name.split(" ")[0]}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm transition-colors",
                    active ? "text-gold" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gold/10 border border-gold/20"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Client Login</Link>
            </Button>
            <Magnetic>
              <Button asChild size="sm">
                <Link href="/contact">
                  Start a project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl lg:hidden pt-24"
          >
            <div className="container-wide flex flex-col gap-6 py-12">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className="block font-serif text-4xl text-ink hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Client Login</Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/contact">
                    Start a project <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
