import Link from "next/link";
import { ArrowUpRight, Bot, Phone, Workflow, Plug, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TEAM, SITE } from "@/lib/config";

export const metadata = { title: "AI Studio" };

const AI_SERVICES = [
  {
    icon: Bot,
    title: "Custom Chatbots",
    body: "Branded, trained-on-your-data assistants embedded in your site, product, or WhatsApp. RAG-powered, source-cited.",
    bullets: ["Vector knowledge base", "Multi-channel deploy", "Analytics + handoff"],
  },
  {
    icon: Phone,
    title: "Voice Agents",
    body: "Inbound + outbound voice agents that handle reservations, qualification, support — in any language.",
    bullets: ["24/7 phone coverage", "CRM-integrated", "Multilingual"],
  },
  {
    icon: Workflow,
    title: "Agentic Automation",
    body: "Autonomous workflows that read email, parse docs, post to Slack, update sheets — fully unattended.",
    bullets: ["Tool-using agents", "Long-horizon tasks", "Audit logging"],
  },
  {
    icon: Plug,
    title: "API + LLM Integration",
    body: "Drop intelligence into existing software — summarization, classification, semantic search, generation.",
    bullets: ["OpenAI / Anthropic / Open-weight", "Cost-tuned", "Eval suite included"],
  },
];

export default function AIServicesPage() {
  const aabaan = TEAM.find((t) => t.slug === "aabaan")!;
  return (
    <>
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 -z-10 bg-mesh-gold opacity-30" />
        <div className="container-wide">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-xs text-gold mb-6">
              <Sparkles className="h-3 w-3" />
              AI Studio
            </div>
          </FadeIn>
          <SectionHeading
            title={
              <>
                AI products that <span className="gold-text">actually ship.</span>
              </>
            }
            description="We build production AI — not demos. Chatbots, voice agents, autonomous workflows, RAG systems, and bespoke LLM integrations. From spec to deployed in weeks."
          />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container-wide">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {AI_SERVICES.map((s) => (
              <StaggerItem key={s.title}>
                <div className="group rounded-2xl border border-line bg-bg-elevated/40 p-8 lg:p-10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 h-full">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 grid place-items-center group-hover:scale-110 transition-transform">
                    <s.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl lg:text-3xl">{s.title}</h3>
                  <p className="mt-3 text-ink-muted text-sm leading-relaxed">{s.body}</p>
                  <ul className="mt-5 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="text-xs text-ink-subtle flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Aabaan / lead */}
      <section className="pb-32">
        <div className="container-wide">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-bg-elevated to-bg-subtle overflow-hidden grid lg:grid-cols-[1fr_1.4fr] gap-0">
            <div className="aspect-[4/5] lg:aspect-auto relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${aabaan.image})` }}
                role="img"
                aria-label={aabaan.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-subtle via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">AI lead</p>
              <h2 className="mt-3 font-serif text-4xl lg:text-5xl tracking-tight">{aabaan.name}</h2>
              <p className="mt-2 text-ink-muted">{aabaan.role}</p>
              <p className="mt-6 text-ink-muted leading-relaxed">{aabaan.bio}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <a href={`https://wa.me/${SITE.whatsapp.replace("+", "")}?text=Hi%20Aabaan%2C%20I%27d%20like%20to%20talk%20about%20an%20AI%20project`}>
                    Book a 30-min AI consult <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">
                    Send a brief <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
