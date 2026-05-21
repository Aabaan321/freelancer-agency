import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Badge } from "@/components/ui/badge";
import { CASE_STUDIES, CASE_CATEGORIES } from "@/lib/case-studies";

export const metadata = { title: "Work" };

export default function ProjectsPage() {
  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Selected work"
            align="center"
            title={
              <>
                Work we&apos;re <span className="gold-text">proud to show.</span>
              </>
            }
            description="A curated selection from the last 24 months. Each one shipped by the same three founders."
          />

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CASE_CATEGORIES.map((c) => (
              <button
                key={c}
                className="px-4 py-2 rounded-full text-sm border border-line text-ink-muted hover:border-gold hover:text-gold transition-colors"
              >
                {c}
              </button>
            ))}
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((cs) => (
              <StaggerItem key={cs.slug}>
                <Link
                  href={`/projects/${cs.slug}`}
                  className="group block rounded-2xl border border-line bg-bg-elevated/40 overflow-hidden hover:border-gold/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_hsl(var(--gold)/0.2)]"
                >
                  <div className={`aspect-[16/10] relative overflow-hidden bg-gradient-to-br ${cs.gradient}`}>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="font-serif text-6xl text-ink/15 select-none group-hover:scale-110 transition-transform duration-700">
                        {cs.title.split(" ")[0]}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge variant="outline">{cs.year}</Badge>
                      <Badge>{cs.category}</Badge>
                    </div>
                    <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-ink opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <div className="p-8">
                    <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">{cs.client}</div>
                    <h3 className="mt-2 font-serif text-2xl lg:text-3xl">{cs.title}</h3>
                    <p className="mt-3 text-sm text-ink-muted line-clamp-2">{cs.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {cs.tags.map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-line text-ink-subtle">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
