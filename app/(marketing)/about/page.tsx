import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TEAM, SITE } from "@/lib/config";

export const metadata = { title: "About" };

const VALUES = [
  {
    title: "Quality over quantity",
    body: "Five clients per year. Every detail considered. No assembly-line agency work.",
  },
  {
    title: "Senior-only",
    body: "Founders execute. No junior account managers, no offshore handoffs, no surprises.",
  },
  {
    title: "Transparency by default",
    body: "Real-time client portal. You always know exactly what's done and what's next.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="About"
            title={
              <>
                Three founders. <br />
                <span className="gold-text">One opinion of done.</span>
              </>
            }
            description={`We started ${SITE.name} because most agencies optimize for billable hours — not finished work. We don't bill hours. We finish things.`}
          />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container-wide">
          <StaggerContainer className="grid lg:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <StaggerItem key={member.slug}>
                <div className="rounded-2xl border border-line bg-bg-elevated/40 overflow-hidden">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url(${member.image})` }}
                      role="img"
                      aria-label={member.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/20 to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="text-xs uppercase tracking-[0.2em] text-gold">{member.role}</div>
                    <h3 className="mt-2 font-serif text-3xl">{member.name}</h3>
                    <p className="mt-4 text-sm text-ink-muted leading-relaxed">{member.bio}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {member.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-line text-ink-subtle"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-muted transition-colors"
                      >
                        LinkedIn <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What we believe"
            title="A short list. We hold to it."
          />
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="rounded-2xl border border-line bg-bg-elevated/40 p-8 h-full">
                  <h3 className="font-serif text-2xl text-gold">{v.title}</h3>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{v.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-wide">
          <FadeIn>
            <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-bg-elevated to-bg p-12 lg:p-16 text-center">
              <h2 className="font-serif text-4xl lg:text-5xl tracking-tight">
                Want to be one of <span className="gold-text">five</span>?
              </h2>
              <Button asChild className="mt-8" size="xl">
                <Link href="/contact">
                  Start a conversation <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
