import { Settings } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { SITE, TEAM } from "@/lib/config";

export const metadata = { title: "Settings · Admin" };

export default function AdminSettings() {
  return (
    <div className="container-wide py-10">
      <PageHeader title="Settings" description="Studio configuration." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-serif text-lg mb-4 flex items-center gap-2"><Settings className="h-4 w-4 text-gold" /> Studio</h3>
          <dl className="space-y-3 text-sm">
            {[["Name", SITE.name], ["Email", SITE.email], ["WhatsApp", SITE.whatsapp], ["Location", SITE.location], ["Roster cap", String(SITE.business.clientsCap)]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 pb-2"><dt className="text-ink-subtle">{k}</dt><dd className="text-ink">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-ink-subtle">Edit these in <code className="text-ink-muted">lib/config.ts</code> — single source of truth across the whole site.</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-serif text-lg mb-4">Team</h3>
          <div className="space-y-3">
            {TEAM.map((t) => (
              <div key={t.slug} className="flex items-center justify-between text-sm">
                <span>{t.name}</span>
                <span className="text-ink-subtle">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
