import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { ProjectWorkspace } from "@/components/portal/project-workspace";

export const metadata = { title: "Project · Client" };

export default async function ClientProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
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

  const done = (features ?? []).filter((f) => f.status === "done").length;
  const total = (features ?? []).filter((f) => f.status !== "wont_do").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="container-wide py-10">
      <Link href="/client/projects" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-neon-cyan transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <PageHeader
        title={project.name}
        description={project.description ?? "Your project"}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{project.status}</Badge>
            <Badge variant="default">{pct}% complete</Badge>
          </div>
        }
      />
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
        canManage={false}
      />
    </div>
  );
}
