import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { PROCESS_STEPS } from "@/lib/config";

export const metadata = { title: "Process" };

export default function HowWeWorkPage() {
  return (
    <>
      <section className="py-24 lg:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="The process"
            align="center"
            title={
              <>
                Six checkpoints. <span className="gold-text">Twenty-one days.</span>
              </>
            }
            description="Discovery to launch — a sequence we run for every brand, transparent end-to-end via your client portal."
          />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container-wide max-w-4xl">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
            <div className="space-y-12 lg:space-y-16">
              {PROCESS_STEPS.map((s, i) => (
                <FadeIn key={s.title} direction="up">
                  <div className="relative pl-20">
                    <div className="absolute left-0 top-0 h-12 w-12 rounded-full border border-gold/40 bg-bg-elevated grid place-items-center font-serif text-lg text-gold">
                      {i + 1}
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-gold">{s.day}</div>
                    <h3 className="mt-2 font-serif text-3xl lg:text-4xl tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-ink-muted leading-relaxed max-w-2xl">{s.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn>
            <div className="mt-24 rounded-2xl border border-line bg-bg-elevated/40 p-10 text-center">
              <h3 className="font-serif text-3xl">Every step lives in your client portal.</h3>
              <p className="mt-3 text-ink-muted max-w-xl mx-auto">
                Real-time task checklist, preview links, file deliverables, change requests — all in one place.
                Sign in any time to see exactly where we are.
              </p>
              <Button asChild className="mt-6">
                <Link href="/contact">
                  Start your project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
