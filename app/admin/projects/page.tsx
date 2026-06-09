import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Projects · Admin" };

export default async function AdminProjects() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, currency, budget_total, client:clients(name), features(status)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Projects" description="Every engagement across the studio." />
      <div className="grid md:grid-cols-2 gap-4">
        {(projects ?? []).map((p) => {
          const feats = ((p as { features?: { status: string }[] }).features ?? []);
          const done = feats.filter((f) => f.status === "done").length;
          const total = feats.filter((f) => f.status !== "wont_do").length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const clientName = (p as { client?: { name?: string } }).client?.name ?? "—";
          return (
            <Link key={p.id} href={`/admin/projects/${p.id}`} className="glass rounded-2xl p-6 hover:border-white/20 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif text-xl">{p.name}</div>
                  <div className="text-xs text-ink-subtle mt-0.5">{clientName}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-subtle group-hover:text-neon-cyan transition-colors" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">{p.status}</Badge>
                <span className="text-xs text-ink-subtle">{pct}% complete</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-iridescent" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}
        {(projects ?? []).length === 0 && <p className="text-sm text-ink-subtle">No projects yet.</p>}
      </div>
    </div>
  );
}
