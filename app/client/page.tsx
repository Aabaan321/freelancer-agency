import Link from "next/link";
import { ArrowUpRight, FolderKanban, Inbox, MessageCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard · Client" };

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).single();

  const [{ data: projects }, { data: tasks }, { data: openCRs }, { data: recentActivity }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("tasks").select("id, status, project_id"),
    supabase.from("change_requests").select("id").eq("status", "open"),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  const totalTasks = tasks?.length ?? 0;
  const doneTasks = tasks?.filter((t) => t.status === "done").length ?? 0;
  const activeProjects = projects?.filter((p) => p.status !== "done").length ?? 0;

  return (
    <div className="container-wide py-10">
      <PageHeader
        title={`Welcome${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
        description="Here&apos;s the live state of everything we&apos;re building for you."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Active projects</div>
            <FolderKanban className="h-4 w-4 text-gold opacity-50" />
          </div>
          <div className="mt-3 font-serif text-4xl">{activeProjects}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Tasks done</div>
            <CheckCircle2 className="h-4 w-4 text-gold opacity-50" />
          </div>
          <div className="mt-3 font-serif text-4xl">{doneTasks}<span className="text-ink-subtle text-lg">/{totalTasks}</span></div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Open requests</div>
            <Inbox className="h-4 w-4 text-gold opacity-50" />
          </div>
          <div className="mt-3 font-serif text-4xl">{openCRs?.length ?? 0}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Messages</div>
            <MessageCircle className="h-4 w-4 text-gold opacity-50" />
          </div>
          <div className="mt-3 font-serif text-4xl">—</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6">
          <h2 className="font-serif text-xl mb-5">Your projects</h2>
          {(projects?.length ?? 0) === 0 ? (
            <div className="py-12 text-center text-sm text-ink-subtle">
              No projects yet — your team will set you up shortly.
            </div>
          ) : (
            <div className="space-y-3">
              {projects!.map((p) => {
                const projTasks = tasks?.filter((t) => t.project_id === p.id) ?? [];
                const projDone = projTasks.filter((t) => t.status === "done").length;
                const pct = projTasks.length === 0 ? 0 : Math.round((projDone / projTasks.length) * 100);
                return (
                  <Link key={p.id} href={`/client/projects/${p.id}`} className="group block">
                    <div className="p-4 rounded-xl border border-line bg-bg-elevated/40 hover:border-gold/40 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg">{p.name}</h3>
                          {p.description && (
                            <p className="mt-1 text-xs text-ink-subtle line-clamp-2">{p.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={p.status === "done" ? "success" : "default"}>{p.status}</Badge>
                          <ArrowUpRight className="h-4 w-4 text-ink-subtle group-hover:text-gold transition-colors" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <Progress value={pct} className="flex-1" />
                        <span className="text-xs text-ink-muted shrink-0 font-mono">{pct}%</span>
                      </div>
                      <div className="mt-2 text-[10px] uppercase tracking-wider text-ink-subtle">
                        {projDone} of {projTasks.length} tasks done
                        {p.target_date && ` · target ${formatDate(p.target_date)}`}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-xl mb-5">Recent activity</h2>
          {(recentActivity?.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-ink-subtle">No activity yet</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentActivity!.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-ink truncate">{a.action}</div>
                    <div className="text-xs text-ink-subtle">{formatRelativeTime(a.created_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
