import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Marquee } from "@/components/marketing/marquee";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Code, Sparkles, Palette, TrendingUp, ArrowRight, Check } from "lucide-react";
import { SERVICES, PROCESS_STEPS, TEAM, SITE, PRICING_TIERS } from "@/lib/config";

const ICON = { Code, Sparkles, Palette, TrendingUp };

export default function Home() {
  return (
    <>
      <Hero />

      {/* Trusted-by marquee */}
      <section className="py-12 border-y border-line/40">
        <div className="container-wide mb-8">
          <FadeIn>
            <p className="text-center text-xs uppercase tracking-[0.22em] text-ink-subtle">
              Trusted by founders who don&apos;t settle
            </p>
          </FadeIn>
        </div>
        <Marquee
          speed={40}
          items={[
            "Nexora Labs",
            "Helios Capital",
            "Atlas Voyage",
            "Mandara Studio",
            "Verita Health",
            "Forge Robotics",
            "Linden & Co.",
            "Soraya Couture",
          ].map((name) => (
            <span
              key={name}
              className="font-serif text-2xl lg:text-3xl text-ink-subtle hover:text-ink transition-colors tracking-wide"
            >
              {name}
            </span>
          ))}
        />
      </section>

      {/* Services */}
      <section className="py-32 lg:py-40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Four disciplines. <span className="gold-text">One studio.</span>
              </>
            }
            description="Every engagement is shaped around what you actually need — never padded with line items."
          />

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((service) => {
              const Icon = ICON[service.icon as keyof typeof ICON];
              return (
                <StaggerItem key={service.slug}>
                  <Link
                    href={service.slug === "ai-products" ? "/ai-services" : "/services"}
                    className="group block h-full rounded-2xl border border-line bg-bg-elevated/40 backdrop-blur-sm p-8 lg:p-10 hover:border-gold/40 hover:bg-bg-elevated/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_hsl(var(--gold)/0.18)] relative overflow-hidden"
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                         style={{
                           background:
                             "radial-gradient(circle at 0% 0%, hsl(43 55% 54% / 0.08), transparent 40%)",
                         }}
                    />

                    <div className="flex items-start justify-between relative">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 grid place-items-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-ink-subtle group-hover:text-gold group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="mt-8 font-serif text-2xl lg:text-3xl tracking-tight">{service.title}</h3>
                    <p className="mt-3 text-ink-muted text-sm leading-relaxed">{service.short}</p>

                    <ul className="mt-6 grid grid-cols-2 gap-2 text-xs text-ink-subtle">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Process — vertical timeline */}
      <section className="py-32 lg:py-40 relative">
        <div className="container-wide">
          <SectionHeading
            eyebrow="How we work"
            title={
              <>
                21 days. Six checkpoints. <br className="hidden lg:inline" />
                One thing <span className="gold-text">finished beautifully.</span>
              </>
            }
            description="A repeatable process that respects your time and ends with something you're proud to show off."
          />

          <div className="relative max-w-3xl mx-auto">
            {/* Spine */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

            <div className="space-y-12">
              {PROCESS_STEPS.map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.05} direction="up" distance={20}>
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-bg border border-gold/40 grid place-items-center">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    </div>
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-gold">{step.day}</span>
                      <h3 className="font-serif text-2xl lg:text-3xl text-ink">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-ink-muted leading-relaxed">{step.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn>
            <div className="mt-16 text-center">
              <Button asChild variant="outline">
                <Link href="/how-we-work">
                  Read the full process <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Founders */}
      <section className="py-32 lg:py-40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="The studio"
            title={
              <>
                Three founders. <span className="gold-text">Every project.</span>
              </>
            }
            description="You'll never work with a junior account manager. You work directly with the people building it."
          />

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <StaggerItem key={member.slug}>
                <div className="group relative rounded-2xl border border-line bg-bg-elevated/40 backdrop-blur-sm overflow-hidden hover:border-gold/30 transition-all duration-500">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url(${member.image})` }}
                      role="img"
                      aria-label={member.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-2xl">{member.name}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-gold">{member.role.split(" & ")[0]}</span>
                    </div>
                    <p className="mt-3 text-sm text-ink-muted line-clamp-3">{member.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-line text-ink-subtle"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-32 lg:py-40">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Investment"
            title={
              <>
                Honest pricing. <span className="gold-text">No surprises.</span>
              </>
            }
            description="Fixed scopes, fixed prices, fixed timelines. Custom builds get a proper proposal — never an estimate."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <FadeIn key={tier.slug} delay={i * 0.08}>
                <div
                  className={`relative rounded-2xl border p-8 h-full flex flex-col ${
                    tier.featured ? "border-gold/40 bg-gradient-to-br from-bg-elevated to-bg-subtle glow-soft" : "border-line bg-bg-elevated/40"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-bg text-[10px] uppercase tracking-wider font-medium">
                      Most popular
                    </div>
                  )}
                  <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">{tier.name}</div>
                  <div className="mt-3 font-serif text-4xl">
                    {tier.price ? (
                      <>
                        <span className="text-ink-subtle text-base align-top mr-1">{tier.currency}</span>
                        {tier.price.toLocaleString()}
                      </>
                    ) : (
                      "Custom"
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{tier.headline}</p>

                  <ul className="mt-6 space-y-3 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-ink-muted">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={tier.featured ? "default" : "outline"}
                    className="mt-8 w-full"
                  >
                    <Link href="/contact">Get started</Link>
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 lg:py-40">
        <div className="container-wide">
          <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-br from-bg-elevated via-bg-subtle to-bg overflow-hidden p-12 lg:p-20 text-center glow-soft">
            <div className="absolute inset-0 opacity-50 bg-mesh-gold pointer-events-none" />
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                {SITE.business.spotsRemaining} spots open this quarter
              </p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl text-balance leading-[1.05] tracking-tight max-w-3xl mx-auto">
                We work with <span className="gold-text">five brands</span> at a time.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-5 text-ink-muted max-w-xl mx-auto">
                It&apos;s not a marketing line — it&apos;s how we deliver work we&apos;re proud of. Talk to us
                before the next quarter fills up.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="xl">
                  <Link href="/contact">
                    Book a discovery call <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="ghost">
                  <Link href="/projects">See our work</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
