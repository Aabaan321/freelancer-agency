"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/config";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-line/60 bg-gradient-to-r from-bg via-bg-elevated to-bg"
        >
          <div className="container-wide flex items-center justify-between gap-4 py-2.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </div>
              <span className="text-ink-muted hidden sm:inline">
                {SITE.business.spotsRemaining} client spots open for this quarter
              </span>
              <span className="text-ink-muted sm:hidden">{SITE.business.spotsRemaining} spots open</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-gold hover:text-gold-muted transition-colors"
              >
                Reserve yours <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-subtle hover:text-ink-muted"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
