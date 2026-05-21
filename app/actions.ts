"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type NewClientFormState = { error?: string; ok?: boolean };

export async function createClientAction(_prev: NewClientFormState, formData: FormData): Promise<NewClientFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return { error: "Only admins can add clients" };

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim().toLowerCase();
  const tempPassword = String(formData.get("temp_password") ?? "").trim();
  const projectName = String(formData.get("project_name") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) return { error: "Client name required" };
  if (!contactEmail) return { error: "Contact email required" };
  if (!tempPassword || tempPassword.length < 8) return { error: "Password must be at least 8 characters" };

  const admin = createServiceClient();

  // 1) Create auth user
  const { data: newUser, error: userErr } = await admin.auth.admin.createUser({
    email: contactEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: contactName, role: "client" },
  });

  if (userErr || !newUser?.user) {
    return { error: userErr?.message ?? "Could not create user" };
  }

  // 2) Patch profile (trigger created it as 'client' from metadata)
  await admin
    .from("profiles")
    .update({ full_name: contactName, role: "client" })
    .eq("id", newUser.user.id);

  // 3) Create the client org
  const { data: client, error: clientErr } = await admin
    .from("clients")
    .insert({
      name,
      company,
      primary_contact_id: newUser.user.id,
      status: "active",
      notes,
    })
    .select()
    .single();

  if (clientErr || !client) return { error: clientErr?.message ?? "Could not create client" };

  // 4) Link contact to client
  await admin.from("client_users").insert({
    client_id: client.id,
    profile_id: newUser.user.id,
    role_at_client: "owner",
  });

  // 5) Optionally seed a starter project
  if (projectName) {
    const { data: project } = await admin
      .from("projects")
      .insert({
        client_id: client.id,
        name: projectName,
        slug: slugify(projectName),
        status: "active",
        start_date: new Date().toISOString().slice(0, 10),
        description: `${projectName} engagement for ${name}.`,
      })
      .select()
      .single();

    if (project) {
      // Seed default milestones
      const milestones = [
        { title: "Discovery", order_index: 0 },
        { title: "Design", order_index: 1 },
        { title: "Build", order_index: 2 },
        { title: "Launch", order_index: 3 },
      ];
      const { data: createdMilestones } = await admin
        .from("milestones")
        .insert(milestones.map((m) => ({ ...m, project_id: project.id })))
        .select();

      // Seed sample tasks for the first milestone
      if (createdMilestones?.[0]) {
        await admin.from("tasks").insert([
          {
            milestone_id: createdMilestones[0].id,
            project_id: project.id,
            title: "Kickoff call",
            description: "60-minute discovery and goals review.",
            order_index: 0,
            status: "todo",
          },
          {
            milestone_id: createdMilestones[0].id,
            project_id: project.id,
            title: "Brand audit",
            description: "Review existing assets, competitive landscape.",
            order_index: 1,
            status: "todo",
          },
          {
            milestone_id: createdMilestones[0].id,
            project_id: project.id,
            title: "Scope document",
            description: "Written scope, deliverables, timeline.",
            order_index: 2,
            status: "todo",
          },
        ]);
      }

      // Log activity
      await admin.from("activity_log").insert({
        actor_id: user.id,
        entity_type: "project",
        entity_id: project.id,
        project_id: project.id,
        action: `Created project "${projectName}"`,
      });
    }
  }

  // Log client creation
  await admin.from("activity_log").insert({
    actor_id: user.id,
    entity_type: "client",
    entity_id: client.id,
    action: `Added client "${name}"`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${client.id}`);
}

// ---------------------------------------------------------------------------
// Task actions
// ---------------------------------------------------------------------------

export async function updateTaskStatus(taskId: string, status: "todo" | "in_progress" | "review" | "done" | "blocked") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: task } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .select("project_id, title")
    .single<{ project_id: string; title: string }>();

  if (task) {
    await supabase.from("activity_log").insert({
      actor_id: user.id,
      entity_type: "task",
      entity_id: taskId,
      project_id: task.project_id,
      action: status === "done" ? `Marked "${task.title}" done` : `Moved "${task.title}" to ${status.replace("_", " ")}`,
    });
  }

  revalidatePath(`/admin/projects/${task?.project_id ?? ""}`);
  revalidatePath(`/client/projects/${task?.project_id ?? ""}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Preview link actions
// ---------------------------------------------------------------------------

export async function addPreviewLink(formData: FormData) {
  const supabase = await createClient();
  const projectId = String(formData.get("project_id"));
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const kind = String(formData.get("kind") ?? "staging") as "figma" | "staging" | "live" | "loom" | "other";

  if (!projectId || !label || !url) return { error: "Missing fields" };
  if (!/^https?:\/\//.test(url)) return { error: "URL must start with http(s)" };

  await supabase.from("preview_links").insert({ project_id: projectId, label, url, kind });
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
  return { ok: true };
}

export async function deletePreviewLink(id: string, projectId: string) {
  const supabase = await createClient();
  await supabase.from("preview_links").delete().eq("id", id);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
}

// ---------------------------------------------------------------------------
// Change request actions
// ---------------------------------------------------------------------------

export async function createChangeRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const projectId = String(formData.get("project_id"));
  const taskId = String(formData.get("task_id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const urgency = String(formData.get("urgency") ?? "normal");

  if (!title || !body) return { error: "Title and details required" };

  const { data: cr } = await supabase
    .from("change_requests")
    .insert({
      project_id: projectId,
      task_id: taskId,
      requested_by: user.id,
      title,
      body,
      urgency,
      status: "open",
    })
    .select()
    .single();

  if (cr) {
    await supabase.from("activity_log").insert({
      actor_id: user.id,
      entity_type: "change_request",
      entity_id: cr.id,
      project_id: projectId,
      action: `Requested changes: "${title}"`,
    });
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
  revalidatePath("/admin/change-requests");
  return { ok: true };
}

export async function respondToChangeRequest(id: string, response: string, status: "accepted" | "declined" | "done") {
  const supabase = await createClient();
  const { data: cr } = await supabase
    .from("change_requests")
    .update({
      admin_response: response,
      status,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("project_id, title")
    .single<{ project_id: string; title: string }>();

  revalidatePath("/admin/change-requests");
  revalidatePath(`/admin/projects/${cr?.project_id ?? ""}`);
  revalidatePath(`/client/projects/${cr?.project_id ?? ""}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const projectId = String(formData.get("project_id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body || !projectId) return { error: "Empty message" };

  await supabase.from("messages").insert({
    project_id: projectId,
    sender_id: user.id,
    body,
  });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
  return { ok: true };
}
