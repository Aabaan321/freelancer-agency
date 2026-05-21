import Link from "next/link";
import { Users, FolderKanban, Inbox, CheckCircle2, ArrowUpRight, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: clientCount },
    { count: projectCount },
    { count: openChangeRequests },
    { count: completedTasks },
    { data: recentActivity },
    { data: upcomingMilestones },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).neq("status", "done"),
    supabase.from("change_requests").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8),
    supabase
      .from("milestones")
      .select("id, title, due_date, project_id, projects(name)")
      .neq("status", "done")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Active clients", value: clientCount ?? 0, icon: Users, href: "/admin/clients" },
    { label: "Active projects", value: projectCount ?? 0, icon: FolderKanban, href: "/admin/projects" },
    { label: "Open requests", value: openChangeRequests ?? 0, icon: Inbox, href: "/admin/change-requests" },
    { label: "Tasks completed", value: completedTasks ?? 0, icon: CheckCircle2, href: "/admin/projects" },
  ];

  return (
    <div className="container-wide py-10">
      <PageHeader
        title="Dashboard"
        description="The view across every client and every project."
        actions={
          <Button asChild>
            <Link href="/admin/clients/new">
              Add client <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="p-5 hover:border-gold/40 transition-colors h-full">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.18em] text-ink-subtle">{s.label}</div>
                <s.icon className="h-4 w-4 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3 font-serif text-4xl">{s.value}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl">Recent activity</h2>
            <Badge variant="secondary">Live</Badge>
          </div>
          {(recentActivity?.length ?? 0) === 0 ? (
            <div className="py-10 text-center text-sm text-ink-subtle">
              <Activity className="h-8 w-8 mx-auto mb-3 opacity-40" />
              No activity yet. Once you create a client and project, this feed will fill up.
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivity?.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <div className="flex-1">
                    <span className="text-ink">{a.action}</span>
                    <span className="text-ink-subtle"> · {a.entity_type}</span>
                  </div>
                  <span className="text-xs text-ink-subtle shrink-0">{formatRelativeTime(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-xl mb-5">Upcoming milestones</h2>
          {(upcomingMilestones?.length ?? 0) === 0 ? (
            <div className="py-10 text-center text-sm text-ink-subtle">No upcoming milestones.</div>
          ) : (
            <ul className="space-y-3">
              {upcomingMilestones?.map((m) => {
                const proj = (m as { projects: { name: string } | { name: string }[] | null }).projects;
                const projName = Array.isArray(proj) ? proj[0]?.name : proj?.name;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-3">
                    <Link
                      href={`/admin/projects/${m.project_id}`}
                      className="flex-1 min-w-0 hover:text-gold transition-colors"
                    >
                      <div className="text-sm truncate">{m.title}</div>
                      <div className="text-xs text-ink-subtle truncate">{projName ?? "Project"}</div>
                    </Link>
                    {m.due_date && (
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
