import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBoard } from "@/components/admin/task-board";
import { PreviewLinksClient } from "@/components/client/preview-links-client";
import { ChangeRequestsClientList } from "@/components/client/change-requests-client-list";
import { MessagesPanel } from "@/components/portal/messages-panel";
import { RequestChangesButton } from "@/components/client/request-changes-button";

export const metadata = { title: "Project · Client" };

export default async function ClientProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
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
    supabase.from("change_requests").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*, sender:profiles(full_name, email, role)")
      .eq("project_id", id)
      .order("created_at", { ascending: true })
      .limit(100),
    supabase.auth.getUser(),
  ]);

  if (!user) redirect("/login");

  const doneCount = tasks?.filter((t) => t.status === "done").length ?? 0;
  const totalCount = tasks?.length ?? 0;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return (
    <div className="container-wide py-10">
      <Link
        href="/client/projects"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <PageHeader
        title={project.name}
        description={project.description ?? "Project"}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={project.status === "done" ? "success" : "default"}>{project.status}</Badge>
            <Badge variant="outline">{pct}% complete</Badge>
            <RequestChangesButton projectId={project.id} />
          </div>
        }
      />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="tasks">Checklist</TabsTrigger>
          <TabsTrigger value="previews">Previews</TabsTrigger>
          <TabsTrigger value="change-requests">Change requests</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskBoard milestones={milestones ?? []} tasks={tasks ?? []} projectId={project.id} canManage={false} />
        </TabsContent>

        <TabsContent value="previews">
          <PreviewLinksClient links={previewLinks ?? []} />
        </TabsContent>

        <TabsContent value="change-requests">
          <ChangeRequestsClientList items={changeRequests ?? []} projectId={project.id} />
        </TabsContent>

        <TabsContent value="messages">
          <MessagesPanel messages={messages ?? []} projectId={project.id} currentUserId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
