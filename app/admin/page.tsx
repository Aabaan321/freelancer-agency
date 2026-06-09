import Link from "next/link";
import { Users, FolderKanban, Inbox, Receipt, ArrowUpRight, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

export const metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: clients }, { count: projects }, { count: openCRs }, { data: invoices }, { data: recentProjects }, { data: activity }] =
    await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("change_requests").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("invoices").select("amount, status"),
      supabase.from("projects").select("id, name, status, client:clients(name)").order("created_at", { ascending: false }).limit(6),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8),
    ]);

  const outstanding = (invoices ?? []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  const stats = [
    { label: "Clients", value: String(clients ?? 0), icon: Users, href: "/admin/clients" },
    { label: "Projects", value: String(projects ?? 0), icon: FolderKanban, href: "/admin/projects" },
    { label: "Open requests", value: String(openCRs ?? 0), icon: Inbox, href: "/admin/change-requests" },
    { label: "Outstanding", value: formatCurrency(outstanding, "AED"), icon: Receipt, href: "/admin/invoices" },
  ];

  return (
    <div className="container-wide py-10">
      <PageHeader title="Control center" description="Everything across the studio, at a glance." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="glass rounded-2xl p-5 hover:border-white/20 transition-colors group">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-ink-muted" />
              <ArrowUpRight className="h-4 w-4 text-ink-subtle group-hover:text-neon-cyan transition-colors" />
            </div>
            <div className="mt-4 font-serif text-3xl">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-ink-subtle mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-serif text-xl mb-3">Recent projects</h2>
          <div className="space-y-2">
            {(recentProjects ?? []).map((p) => {
              const cn = (p as { client?: { name?: string } }).client?.name ?? "—";
              return (
                <Link key={p.id} href={`/admin/projects/${p.id}`} className="glass rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-ink-subtle">{cn}</div>
                  </div>
                  <Badge variant="secondary">{p.status}</Badge>
                </Link>
              );
            })}
            {(recentProjects ?? []).length === 0 && <p className="text-sm text-ink-subtle">No projects yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-neon-cyan" /> Activity</h2>
          <div className="glass rounded-2xl p-5 space-y-3">
            {(activity ?? []).map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-iridescent mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-ink-muted">{a.action}</span>
                  <span className="text-ink-subtle text-xs block">{formatRelativeTime(a.created_at)}</span>
                </div>
              </div>
            ))}
            {(activity ?? []).length === 0 && <p className="text-sm text-ink-subtle">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
