import Link from "next/link";
import { ArrowUpRight, Activity, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard · Client" };

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id ?? "").single();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, features(status)")
    .order("created_at", { ascending: false });
  const { data: activity } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8);

  const firstName = (profile?.full_name ?? "there").split(" ")[0];

  return (
    <div className="container-wide py-10">
      <PageHeader
        title={<span>Welcome back, <span className="iridescent-text">{firstName}</span></span>}
        description="Here's where your work stands."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-xl">Your projects</h2>
          {(projects ?? []).map((p) => {
            const feats = ((p as { features?: { status: string }[] }).features ?? []);
            const done = feats.filter((f) => f.status === "done").length;
            const total = feats.filter((f) => f.status !== "wont_do").length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return (
              <Link key={p.id} href={`/client/projects/${p.id}`} className="glass rounded-2xl p-6 block hover:border-white/20 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-serif text-xl">{p.name}</div>
                    <Badge variant="secondary" className="mt-2">{p.status}</Badge>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-ink-subtle group-hover:text-neon-cyan transition-colors" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-ink-subtle">{done} of {total} done</span>
                  <span className="iridescent-text font-medium">{pct}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-iridescent transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
          {(projects ?? []).length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <Sparkles className="h-9 w-9 mx-auto text-ink-subtle opacity-40 mb-3" />
              <p className="text-sm text-ink-muted">No projects yet — your studio will set things up shortly.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-serif text-xl mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-neon-cyan" /> Recent activity</h2>
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
            {(activity ?? []).length === 0 && <p className="text-sm text-ink-subtle">Nothing yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
