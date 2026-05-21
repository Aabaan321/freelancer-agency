import Link from "next/link";
import { ArrowUpRight, Code, Sparkles, Palette, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { SERVICES } from "@/lib/config";

const ICON = { Code, Sparkles, Palette, TrendingUp };

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Services"
            align="center"
            title={
              <>
                Built end-to-end. <span className="gold-text">By people who care.</span>
              </>
            }
            description="A full-stack studio: research, design, code, ship, grow. One team, one accountability."
          />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container-wide space-y-24 lg:space-y-32">
          {SERVICES.map((service, idx) => {
            const Icon = ICON[service.icon as keyof typeof ICON];
            const reverse = idx % 2 === 1;
            return (
              <FadeIn key={service.slug}>
                <div
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 grid place-items-center">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <h2 className="mt-6 font-serif text-4xl lg:text-5xl tracking-tight leading-[1.05]">{service.title}</h2>
                    <p className="mt-5 text-ink-muted leading-relaxed">{service.description}</p>
                    <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-ink-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href="/contact">
                          Discuss this <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost">
                        <Link href="/projects">
                          See examples <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="relative aspect-square rounded-3xl border border-line bg-gradient-to-br from-bg-elevated to-bg-subtle overflow-hidden group">
                    <div className="absolute inset-0 bg-mesh-gold opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="font-serif text-[12rem] leading-none text-gold/10 select-none">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Service {idx + 1} of {SERVICES.length}</div>
                        <div className="mt-1 font-serif text-2xl">{service.title}</div>
                      </div>
                      <Icon className="h-8 w-8 text-gold/40" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
