import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Projects · Client" };

export default async function ClientProjects() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, status, features(status)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Your projects" description="Track everything we're building for you." />
      <div className="grid md:grid-cols-2 gap-4">
        {(projects ?? []).map((p) => {
          const feats = ((p as { features?: { status: string }[] }).features ?? []);
          const done = feats.filter((f) => f.status === "done").length;
          const total = feats.filter((f) => f.status !== "wont_do").length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <Link key={p.id} href={`/client/projects/${p.id}`} className="glass rounded-2xl p-6 hover:border-white/20 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif text-xl">{p.name}</div>
                  {p.description && <p className="text-sm text-ink-muted mt-1 line-clamp-2">{p.description}</p>}
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-subtle group-hover:text-neon-cyan transition-colors shrink-0" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">{p.status}</Badge>
                <span className="text-xs iridescent-text">{pct}% complete</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
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
