import Link from "next/link";
import { Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/config";

const FOOTER_NAV = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Process", href: "/how-we-work" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Web Development", href: "/services" },
    { label: "AI Studio", href: "/ai-services" },
    { label: "Brand & Design", href: "/services" },
    { label: "Growth Marketing", href: "/services" },
  ],
  Resources: [
    { label: "Case Studies", href: "/projects" },
    { label: "FAQ", href: "/faq" },
    { label: "Client Login", href: "/login" },
    { label: "Privacy", href: "/legal/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-line/60 mt-32">
      <div className="container-wide pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 lg:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-gold via-gold-muted to-gold/60 grid place-items-center">
                <span className="font-serif text-bg text-base font-bold">A</span>
              </div>
              <span className="font-serif text-xl">{SITE.name}</span>
            </Link>
            <p className="mt-4 text-sm text-ink-muted max-w-sm">
              A boutique digital studio building premium websites, AI products, and brand systems for ambitious brands.
            </p>
            <div className="mt-6 space-y-2 text-sm text-ink-muted">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="h-3.5 w-3.5" /> {SITE.email}
              </a>
              <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="h-3.5 w-3.5" /> {SITE.phone}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {SITE.location}
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_NAV).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-ink-subtle mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-muted hover:text-gold transition-colors inline-flex items-center gap-1 group"
                    >
                      {item.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-line/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[
              { href: SITE.social.instagram, icon: Instagram, label: "Instagram" },
              { href: SITE.social.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: SITE.social.twitter, icon: Twitter, label: "Twitter" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted hover:border-gold hover:text-gold transition-colors"
                aria-label={s.label}
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Giant brand mark */}
      <div className="overflow-hidden border-t border-line/30">
        <h2
          className="font-serif text-[16vw] leading-none tracking-tight text-center py-8 bg-clip-text text-transparent select-none"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(43 55% 54% / 0.18) 0%, hsl(43 55% 54% / 0.04) 60%, transparent 100%)",
          }}
        >
          AUREON
        </h2>
      </div>
    </footer>
  );
}
