import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects · Client" };

export default async function ClientProjectsList() {
  const supabase = await createClient();
  const [{ data: projects }, { data: tasks }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("tasks").select("id, status, project_id"),
  ]);

  return (
    <div className="container-wide py-10">
      <PageHeader title="Projects" description="Every engagement we&apos;re running for you." />

      {(projects?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <FolderKanban className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <p className="text-sm text-ink-muted">No projects yet.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {projects!.map((p) => {
            const projTasks = tasks?.filter((t) => t.project_id === p.id) ?? [];
            const projDone = projTasks.filter((t) => t.status === "done").length;
            const pct = projTasks.length === 0 ? 0 : Math.round((projDone / projTasks.length) * 100);
            return (
              <Link key={p.id} href={`/client/projects/${p.id}`} className="group">
                <Card className="p-6 hover:border-gold/40 transition-colors h-full">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-2xl">{p.name}</h3>
                    <Badge variant={p.status === "done" ? "success" : "default"}>{p.status}</Badge>
                  </div>
                  {p.description && <p className="mt-3 text-sm text-ink-muted line-clamp-2">{p.description}</p>}
                  <div className="mt-6 flex items-center gap-3">
                    <Progress value={pct} className="flex-1" />
                    <span className="text-xs font-mono">{pct}%</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink-subtle">
                    <span>Started {formatDate(p.start_date ?? p.created_at)}</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:text-gold transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
