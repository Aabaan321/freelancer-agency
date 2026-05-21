"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";

const FAQS = [
  {
    q: "Why only five clients per year?",
    a: "We hand-build every project. Each founder is personally engaged, every single day. The cap is what keeps that promise real.",
  },
  {
    q: "What's your typical turnaround?",
    a: "21 days for a Growth-tier website, 14 days for a Starter, 6–12 weeks for an AI product. We commit to a date upfront and hit it.",
  },
  {
    q: "Do you do retainers?",
    a: "Only for ongoing AI products that genuinely need it. We don't sell padding. If you don't need monthly hours, we won't invent them.",
  },
  {
    q: "What's included in pricing?",
    a: "Discovery, design, build, deploy, and a written + recorded handoff. No hidden line items. Quoted at signing — never changes mid-project.",
  },
  {
    q: "Can you work with my existing brand?",
    a: "Yes. We work with what you have, audit it honestly, and either extend it or recommend a refresh. We won't force a rebrand to inflate scope.",
  },
  {
    q: "Do you offer SEO + paid marketing?",
    a: "Yes — Abhay leads our growth practice. We can wire that in from launch, or as a follow-on engagement.",
  },
  {
    q: "What does the client portal include?",
    a: "Real-time task checklist, milestone timeline, preview links, deliverable files, in-app messaging, change requests, and invoices. You see exactly what we see.",
  },
  {
    q: "What if I want changes during the build?",
    a: "Use the 'Request changes' button on any task in your portal. We'll review, respond, and either fold them in or scope them as a follow-on.",
  },
  {
    q: "What if it doesn't work out?",
    a: "We're upfront about fit during the discovery call. If a project derails (rare), we refund unworked stages. We've never had a true non-completion.",
  },
  {
    q: "How do payments work?",
    a: "50% on signing, 50% on launch for fixed-scope projects. AI products and custom builds get a milestone schedule. We accept cards, wire, and Stripe payment links.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="FAQ"
            align="center"
            title={
              <>
                The questions we <span className="gold-text">hear most.</span>
              </>
            }
            description="And our honest answers. If yours isn't here, contact us — we'll add it."
          />
        </div>
      </section>

      <section className="pb-32">
        <div className="container-wide max-w-3xl">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <div
                  className={`rounded-xl border transition-colors ${
                    open === i ? "border-gold/40 bg-bg-elevated/60" : "border-line bg-bg-elevated/30"
                  }`}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left"
                  >
                    <span className={`font-serif text-lg lg:text-xl ${open === i ? "text-gold" : "text-ink"}`}>
                      {faq.q}
                    </span>
                    <span
                      className={`h-7 w-7 shrink-0 rounded-full border grid place-items-center transition-colors ${
                        open === i ? "border-gold text-gold" : "border-line text-ink-muted"
                      }`}
                    >
                      {open === i ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 lg:px-6 pb-6 text-ink-muted leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
