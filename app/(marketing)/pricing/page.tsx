import Link from "next/link";
import { Check, ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { PRICING_TIERS } from "@/lib/config";

export const metadata = { title: "Pricing" };

const COMPARE = [
  { feature: "Pages / screens", starter: "Up to 5", growth: "Up to 12", premium: "Unlimited" },
  { feature: "Custom design system", starter: false, growth: true, premium: true },
  { feature: "CMS integration", starter: false, growth: true, premium: true },
  { feature: "Multi-language", starter: false, growth: true, premium: true },
  { feature: "AI features", starter: false, growth: false, premium: true },
  { feature: "Custom backend", starter: false, growth: false, premium: true },
  { feature: "Performance + SEO tuning", starter: "Basic", growth: "Advanced", premium: "Enterprise" },
  { feature: "Post-launch support", starter: "7 days", growth: "30 days", premium: "Ongoing" },
  { feature: "Launch window", starter: "7 days", growth: "21 days", premium: "Custom" },
];

export default function PricingPage() {
  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Pricing"
            align="center"
            title={
              <>
                Honest pricing. <span className="gold-text">No surprises.</span>
              </>
            }
            description="Fixed scope, fixed price, fixed timeline. Bigger builds get a proper proposal — never an estimate."
          />

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {PRICING_TIERS.map((tier, i) => (
              <FadeIn key={tier.slug} delay={i * 0.08}>
                <div
                  className={`relative rounded-2xl border p-8 lg:p-10 h-full flex flex-col ${
                    tier.featured
                      ? "border-gold/40 bg-gradient-to-br from-bg-elevated to-bg-subtle glow-soft"
                      : "border-line bg-bg-elevated/40"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-bg text-[10px] uppercase tracking-wider font-medium">
                      Most popular
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">{tier.name}</div>
                  <div className="mt-4 font-serif text-5xl">
                    {tier.price ? (
                      <>
                        <span className="text-ink-subtle text-base align-top mr-1">{tier.currency}</span>
                        {tier.price.toLocaleString()}
                      </>
                    ) : (
                      "Custom"
                    )}
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{tier.headline}</p>

                  <ul className="mt-8 space-y-3 text-sm flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-ink-muted">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild variant={tier.featured ? "default" : "outline"} className="mt-10 w-full">
                    <Link href="/contact">
                      Get started <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24">
        <div className="container-wide max-w-5xl">
          <SectionHeading
            eyebrow="Compare"
            align="center"
            title={<>Find your fit</>}
          />
          <FadeIn>
            <div className="rounded-2xl border border-line bg-bg-elevated/40 overflow-hidden">
              <div className="grid grid-cols-4 border-b border-line bg-bg-subtle/50">
                <div className="p-4 lg:p-6 text-xs uppercase tracking-[0.18em] text-ink-subtle">Feature</div>
                {PRICING_TIERS.map((t) => (
                  <div key={t.slug} className="p-4 lg:p-6 text-xs uppercase tracking-[0.18em] text-ink">
                    {t.name}
                  </div>
                ))}
              </div>
              {COMPARE.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-4 ${i % 2 === 1 ? "bg-bg-subtle/20" : ""}`}>
                  <div className="p-4 lg:p-6 text-sm text-ink-muted">{row.feature}</div>
                  {[row.starter, row.growth, row.premium].map((val, j) => (
                    <div key={j} className="p-4 lg:p-6 text-sm">
                      {typeof val === "boolean" ? (
                        val ? <Check className="h-4 w-4 text-gold" /> : <X className="h-4 w-4 text-ink-subtle" />
                      ) : (
                        <span className="text-ink">{val}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
