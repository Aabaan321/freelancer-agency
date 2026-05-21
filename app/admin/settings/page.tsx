import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE, PRICING_TIERS, TEAM } from "@/lib/config";

export const metadata = { title: "Settings · Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="container-wide py-10 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Business constants live in code at lib/config.ts — change there and they propagate everywhere."
      />

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-serif text-xl">Studio</h2>
          <p className="text-sm text-ink-muted">Public-facing brand info.</p>
          <Separator className="my-4" />
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink-subtle">Name</dt><dd>{SITE.name}</dd>
            <dt className="text-ink-subtle">Email</dt><dd>{SITE.email}</dd>
            <dt className="text-ink-subtle">WhatsApp</dt><dd>{SITE.whatsapp}</dd>
            <dt className="text-ink-subtle">Location</dt><dd>{SITE.location}</dd>
            <dt className="text-ink-subtle">Roster cap</dt><dd>{SITE.business.clientsCap}</dd>
            <dt className="text-ink-subtle">Spots open</dt><dd>{SITE.business.spotsRemaining}</dd>
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-xl">Pricing tiers</h2>
          <Separator className="my-4" />
          <div className="grid sm:grid-cols-3 gap-3">
            {PRICING_TIERS.map((t) => (
              <div key={t.slug} className="rounded-lg border border-line p-4">
                <div className="text-xs uppercase tracking-wider text-gold">{t.name}</div>
                <div className="font-serif text-2xl mt-1">{t.price ? `${t.currency} ${t.price.toLocaleString()}` : "Custom"}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-xl">Team</h2>
          <Separator className="my-4" />
          <ul className="space-y-2">
            {TEAM.map((m) => (
              <li key={m.slug} className="flex items-center gap-3 text-sm">
                <div className="h-9 w-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${m.image})` }} />
                <div className="flex-1">
                  <div>{m.name}</div>
                  <div className="text-xs text-ink-subtle">{m.role}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
