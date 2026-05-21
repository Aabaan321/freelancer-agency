"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { SITE, TEAM } from "@/lib/config";

const PROJECT_TYPES = ["New Website", "AI Project", "Brand & Design", "Growth & Marketing", "Other"];
const BUDGETS = ["Under 5K AED", "5–10K AED", "10–25K AED", "25K+ AED", "Not sure yet"];
const TIMELINES = ["ASAP", "Within 30 days", "Within 90 days", "Just exploring"];

const ROUTING: Record<string, string> = {
  "AI Project": "aabaan",
  "New Website": "abhay",
  "Brand & Design": "shubhan",
  "Growth & Marketing": "abhay",
  Other: "shubhan",
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const recommendedSlug = ROUTING[form.projectType] || "shubhan";
  const team = [...TEAM].sort((a, b) => (a.slug === recommendedSlug ? -1 : b.slug === recommendedSlug ? 1 : 0));

  function buildWaUrl(memberPhone: string) {
    const summary = `Hi ${TEAM.find((t) => t.slug === recommendedSlug)?.name} — I just filled in the contact form on aureon.studio.

Name: ${form.name}
Email: ${form.email}
Company: ${form.company}
Project: ${form.projectType}
Budget: ${form.budget}
Timeline: ${form.timeline}

${form.message}`;
    return `https://wa.me/${SITE.whatsapp.replace("+", "")}?text=${encodeURIComponent(summary)}`;
  }

  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Contact"
            title={
              <>
                Let&apos;s talk about <span className="gold-text">your project.</span>
              </>
            }
            description="Tell us about what you're building. We'll respond within one business day with a fit assessment."
          />
        </div>
      </section>

      <section className="pb-32">
        <div className="container-wide grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="rounded-2xl border border-line bg-bg-elevated/40 backdrop-blur-sm p-8 lg:p-10 space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="block mb-2">Your name</Label>
                      <Input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="block mb-2">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="block mb-2">Company</Label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="block mb-2">Project type</Label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setForm({ ...form, projectType: p })}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                            form.projectType === p
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-line text-ink-muted hover:border-gold/40"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-2">Budget</Label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map((b) => (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setForm({ ...form, budget: b })}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                              form.budget === b
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-line text-ink-muted hover:border-gold/40"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="block mb-2">Timeline</Label>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setForm({ ...form, timeline: t })}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                              form.timeline === t
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-line text-ink-muted hover:border-gold/40"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="block mb-2">Tell us about your project</Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Goals, deadlines, audience — anything you'd like us to know."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!form.name || !form.email || !form.message || !form.projectType}
                  >
                    Continue <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-gold/40 bg-gradient-to-br from-bg-elevated to-bg-subtle p-8 lg:p-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/40 grid place-items-center">
                      <Check className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold">Got it</p>
                      <h3 className="font-serif text-2xl">Pick who to chat with</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink-muted mb-6">
                    Based on your {form.projectType.toLowerCase()} project, we&apos;d recommend starting with{" "}
                    <span className="text-ink">{TEAM.find((t) => t.slug === recommendedSlug)?.name}</span>. Or pick
                    anyone — you&apos;ll work with all three of us anyway.
                  </p>
                  <div className="space-y-3">
                    {team.map((m) => (
                      <a
                        key={m.slug}
                        href={buildWaUrl(SITE.whatsapp)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                          m.slug === recommendedSlug
                            ? "border-gold/40 bg-gold/5 hover:bg-gold/10"
                            : "border-line bg-bg-elevated/40 hover:border-gold/30"
                        }`}
                      >
                        <div
                          className="h-12 w-12 rounded-full bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url(${m.image})` }}
                        />
                        <div className="flex-1">
                          <div className="font-serif text-lg flex items-center gap-2">
                            {m.name}
                            {m.slug === recommendedSlug && (
                              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold/20 text-gold">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-ink-muted">{m.role}</div>
                        </div>
                        <MessageCircle className="h-5 w-5 text-gold" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <FadeIn>
              <div className="rounded-2xl border border-line bg-bg-elevated/40 p-6">
                <h3 className="font-serif text-xl">Or reach us directly</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 hover:text-gold transition-colors group">
                      <div className="h-10 w-10 rounded-lg border border-line grid place-items-center group-hover:border-gold/40">
                        <Mail className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink-subtle">Email</div>
                        <div className="text-sm">{SITE.email}</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`} className="flex items-center gap-3 hover:text-gold transition-colors group">
                      <div className="h-10 w-10 rounded-lg border border-line grid place-items-center group-hover:border-gold/40">
                        <MessageCircle className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink-subtle">WhatsApp</div>
                        <div className="text-sm">{SITE.phone}</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors group">
                      <div className="h-10 w-10 rounded-lg border border-line grid place-items-center group-hover:border-gold/40">
                        <Phone className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink-subtle">Call</div>
                        <div className="text-sm">{SITE.phone}</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-bg-elevated to-bg p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">Already a client?</p>
                <h3 className="mt-2 font-serif text-xl">Head to your portal</h3>
                <p className="mt-2 text-sm text-ink-muted">See live project status, request changes, download files.</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </FadeIn>
          </aside>
        </div>
      </section>
    </>
  );
}
