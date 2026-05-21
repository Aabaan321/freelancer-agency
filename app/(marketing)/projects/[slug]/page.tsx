import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { CASE_STUDIES } from "@/lib/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  return { title: cs?.title ?? "Case study" };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-wide">
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline">{cs.year}</Badge>
              <Badge>{cs.category}</Badge>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-subtle">{cs.client}</p>
            <h1 className="mt-3 font-serif text-5xl lg:text-7xl tracking-tight leading-[1.05] max-w-4xl">{cs.title}</h1>
            <p className="mt-6 text-lg text-ink-muted max-w-2xl">{cs.summary}</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="container-wide">
          <FadeIn>
            <div className={`aspect-[16/9] rounded-3xl overflow-hidden border border-line bg-gradient-to-br ${cs.gradient} relative`}>
              <div className="absolute inset-0 grid place-items-center">
                <div className="font-serif text-[10rem] text-ink/15 select-none">{cs.title.split(" ")[0]}</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {cs.challenge && (
        <section className="py-24">
          <div className="container-wide grid lg:grid-cols-2 gap-16">
            <FadeIn>
              <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Challenge</h2>
              <p className="mt-4 font-serif text-3xl lg:text-4xl leading-tight">{cs.challenge}</p>
            </FadeIn>
            {cs.approach && (
              <FadeIn delay={0.1}>
                <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Approach</h2>
                <p className="mt-4 text-lg text-ink-muted leading-relaxed">{cs.approach}</p>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {cs.results && (
        <section className="py-12">
          <div className="container-wide">
            <FadeIn>
              <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-bg-elevated to-bg-subtle p-12 lg:p-16">
                <h2 className="text-xs uppercase tracking-[0.22em] text-gold mb-10">Results</h2>
                <div className="grid md:grid-cols-3 gap-10">
                  {cs.results.map((r) => (
                    <div key={r.label}>
                      <div className="font-serif text-5xl lg:text-6xl gold-text">{r.value}</div>
                      <div className="mt-2 text-sm uppercase tracking-[0.18em] text-ink-subtle">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {cs.testimonial && (
        <section className="py-24">
          <div className="container-wide max-w-4xl">
            <FadeIn>
              <Quote className="h-10 w-10 text-gold/50" />
              <p className="mt-6 font-serif text-3xl lg:text-4xl leading-tight">&ldquo;{cs.testimonial.quote}&rdquo;</p>
              <p className="mt-6 text-sm text-ink-muted">
                <span className="text-ink">{cs.testimonial.author}</span> · {cs.testimonial.role}
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {cs.techStack && (
        <section className="py-12">
          <div className="container-wide">
            <FadeIn>
              <h2 className="text-xs uppercase tracking-[0.22em] text-ink-subtle mb-6">Tech stack</h2>
              <div className="flex flex-wrap gap-2">
                {cs.techStack.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-24">
        <div className="container-wide">
          <FadeIn>
            <div className="rounded-3xl border border-line bg-bg-elevated/40 p-12 lg:p-16 text-center">
              <h3 className="font-serif text-3xl lg:text-4xl">Like what you see?</h3>
              <p className="mt-3 text-ink-muted">We&apos;re open to new client conversations this quarter.</p>
              <Button asChild className="mt-6" size="xl">
                <Link href="/contact">
                  Start a project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
