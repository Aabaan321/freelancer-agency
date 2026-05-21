import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBoard } from "@/components/admin/task-board";
import { PreviewLinksManager } from "@/components/admin/preview-links-manager";
import { ChangeRequestsList } from "@/components/admin/change-requests-list";
import { MessagesPanel } from "@/components/portal/messages-panel";

export const metadata = { title: "Project · Admin" };

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, clients(id, name, company)")
    .eq("id", id)
    .single();
  if (!project) notFound();

  const [
    { data: milestones },
    { data: tasks },
    { data: previewLinks },
    { data: changeRequests },
    { data: messages },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase.from("milestones").select("*").eq("project_id", id).order("order_index"),
    supabase.from("tasks").select("*").eq("project_id", id).order("order_index"),
    supabase.from("preview_links").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("change_requests")
      .select("*, requested_by_profile:profiles!change_requests_requested_by_fkey(full_name, email)")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*, sender:profiles(full_name, email, role)")
      .eq("project_id", id)
      .order("created_at", { ascending: true })
      .limit(50),
    supabase.auth.getUser(),
  ]);

  if (!user) redirect("/login");

  const client = (project as typeof project & { clients: { id: string; name: string; company: string | null } | null }).clients;
  const doneCount = tasks?.filter((t) => t.status === "done").length ?? 0;
  const totalCount = tasks?.length ?? 0;
  const openCRs = changeRequests?.filter((cr) => cr.status === "open").length ?? 0;

  return (
    <div className="container-wide py-10">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <PageHeader
        title={project.name}
        description={
          client ? (
            <Link href={`/admin/clients/${client.id}`} className="hover:text-gold">
              {client.name}
            </Link>
          ) : (
            "Project"
          )
        }
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={project.status === "done" ? "success" : "default"}>{project.status}</Badge>
            <Badge variant="outline">
              {doneCount}/{totalCount} tasks
            </Badge>
          </div>
        }
      />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="previews">Previews</TabsTrigger>
          <TabsTrigger value="change-requests">
            Change requests{openCRs > 0 && <span className="ml-1.5 px-1.5 py-0 rounded-full bg-gold/20 text-gold text-[10px]">{openCRs}</span>}
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskBoard milestones={milestones ?? []} tasks={tasks ?? []} projectId={project.id} canManage />
        </TabsContent>

        <TabsContent value="previews">
          <PreviewLinksManager links={previewLinks ?? []} projectId={project.id} />
        </TabsContent>

        <TabsContent value="change-requests">
          <ChangeRequestsList items={changeRequests ?? []} />
        </TabsContent>

        <TabsContent value="messages">
          <MessagesPanel
            messages={messages ?? []}
            projectId={project.id}
            currentUserId={user.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
