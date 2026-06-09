import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectWorkspace } from "@/components/portal/project-workspace";
import { updateProject } from "@/app/actions";

export const metadata = { title: "Project · Admin" };

const STATUSES = ["lead", "discovery", "design", "build", "review", "launched", "paused", "archived"];

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("*, client:clients(name)").eq("id", id).single();
  if (!project) notFound();

  const [
    { data: features },
    { data: budget },
    { data: assets },
    { data: previews },
    { data: invoices },
    { data: contracts },
    { data: changeRequests },
    { data: messages },
  ] = await Promise.all([
    supabase.from("features").select("*").eq("project_id", id).order("order_index"),
    supabase.from("budget_items").select("*").eq("project_id", id).order("order_index"),
    supabase.from("design_assets").select("*").eq("project_id", id).order("order_index"),
    supabase.from("preview_links").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("contracts").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("change_requests").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*, sender:profiles(full_name, email, role)")
      .eq("project_id", id)
      .order("created_at", { ascending: true })
      .limit(100),
  ]);

  const clientName = (project as { client?: { name?: string } }).client?.name ?? "Client";

  return (
    <div className="container-wide py-10">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-neon-cyan transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <PageHeader
        title={project.name}
        description={`${clientName} · use the eye toggles to control what the client sees`}
        actions={<Badge variant="default">{project.status}</Badge>}
      />

      <details className="glass rounded-2xl mb-6">
        <summary className="flex items-center gap-2 p-5 cursor-pointer text-sm text-ink-muted hover:text-ink">
          <Settings2 className="h-4 w-4" /> Project settings
        </summary>
        <form action={async (fd) => { "use server"; await updateProject(fd); }} className="p-5 pt-0 space-y-3">
          <input type="hidden" name="id" value={project.id} />
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="name" defaultValue={project.name} placeholder="Name" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <select name="status" defaultValue={project.status} className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input name="staging_url" defaultValue={project.staging_url ?? ""} placeholder="Staging URL" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="live_url" defaultValue={project.live_url ?? ""} placeholder="Live URL" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="budget_total" type="number" defaultValue={project.budget_total ?? 0} placeholder="Budget total" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <textarea name="description" defaultValue={project.description ?? ""} rows={2} placeholder="Description" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-y" />
          <Button type="submit" size="sm">Save</Button>
        </form>
      </details>

      <ProjectWorkspace
        project={project}
        features={features ?? []}
        budget={budget ?? []}
        assets={assets ?? []}
        previews={previews ?? []}
        invoices={invoices ?? []}
        contracts={contracts ?? []}
        changeRequests={changeRequests ?? []}
        messages={(messages ?? []) as never}
        currentUserId={user.id}
        canManage={true}
      />
    </div>
  );
}
