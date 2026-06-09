"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { FeatureStatus, InvoiceStatus } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
  revalidatePath("/admin");
  revalidatePath("/client");
}

async function log(actorId: string | undefined, projectId: string, entity: string, action: string) {
  const supabase = await createClient();
  await supabase.from("activity_log").insert({
    actor_id: actorId ?? null,
    entity_type: entity,
    project_id: projectId,
    action,
  });
}

const PUBLISHABLE = new Set([
  "features",
  "budget_items",
  "design_assets",
  "preview_links",
  "invoices",
  "contracts",
  "deliverables",
]);
const HAS_PUBLISHED_AT = new Set(["features", "design_assets"]);

// ---------------------------------------------------------------------------
// Publish gate — the heart of "admin controls what the client sees, and when"
// ---------------------------------------------------------------------------
export async function setPublished(table: string, id: string, projectId: string, value: boolean) {
  if (!PUBLISHABLE.has(table)) return { error: "Not publishable" };
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };

  const patch: Record<string, unknown> = { is_published: value };
  if (HAS_PUBLISHED_AT.has(table)) patch.published_at = value ? new Date().toISOString() : null;

  const { error } = await supabase.from(table).update(patch).eq("id", id);
  if (error) return { error: error.message };

  await log(user.id, projectId, table, `${value ? "Published" : "Hid"} a ${table.replace(/_/g, " ")} item`);
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Features (the checklist)
// ---------------------------------------------------------------------------
export async function updateFeatureStatus(featureId: string, status: FeatureStatus, projectId: string) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase
    .from("features")
    .update({ status, completed_at: status === "done" ? new Date().toISOString() : null })
    .eq("id", featureId);
  if (error) return { error: error.message };
  await log(user.id, projectId, "feature", `Set a feature to ${status.replace(/_/g, " ")}`);
  revalidateProject(projectId);
  return { ok: true };
}

export async function addFeature(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!title || !projectId) return { error: "Title required" };
  const { error } = await supabase.from("features").insert({
    project_id: projectId,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? "General").trim() || "General",
    status: (String(formData.get("status") ?? "planned") as FeatureStatus),
    requested_by_client: formData.get("requested_by_client") === "on",
    is_published: formData.get("is_published") === "on",
    published_at: formData.get("is_published") === "on" ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };
  await log(user.id, projectId, "feature", `Added feature "${title}"`);
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Generic delete (admin)
// ---------------------------------------------------------------------------
const DELETABLE = new Set(["features", "budget_items", "design_assets", "preview_links", "invoices", "contracts"]);
export async function deleteRow(table: string, id: string, projectId: string) {
  if (!DELETABLE.has(table)) return { error: "Not deletable" };
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------
export async function addBudgetItem(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const label = String(formData.get("label") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  if (!label || !projectId) return { error: "Label required" };
  const { error } = await supabase.from("budget_items").insert({
    project_id: projectId,
    label,
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? "General").trim() || "General",
    amount: isNaN(amount) ? 0 : amount,
    currency: String(formData.get("currency") ?? "AED"),
    is_published: formData.get("is_published") === "on",
  });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Design assets (prototype gallery)
// ---------------------------------------------------------------------------
export async function addDesignAsset(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!title || !url || !projectId) return { error: "Title and URL required" };
  if (!/^https?:\/\//.test(url)) return { error: "URL must start with http(s)" };
  const published = formData.get("is_published") === "on";
  const { error } = await supabase.from("design_assets").insert({
    project_id: projectId,
    title,
    url,
    kind: (String(formData.get("kind") ?? "mockup") as never),
    caption: String(formData.get("caption") ?? "").trim() || null,
    is_published: published,
    published_at: published ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Preview links
// ---------------------------------------------------------------------------
export async function addPreviewLink(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!projectId || !label || !url) return { error: "Missing fields" };
  if (!/^https?:\/\//.test(url)) return { error: "URL must start with http(s)" };
  const { error } = await supabase.from("preview_links").insert({
    project_id: projectId,
    label,
    url,
    kind: (String(formData.get("kind") ?? "staging") as never),
    is_published: formData.get("is_published") === "on",
  });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------
export async function createInvoice(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const clientId = String(formData.get("client_id"));
  const amount = Number(formData.get("amount") ?? 0);
  const number = String(formData.get("number") ?? "").trim() || `AUR-${Date.now().toString().slice(-6)}`;
  if (!clientId) return { error: "Client required" };
  const { error } = await supabase.from("invoices").insert({
    client_id: clientId,
    project_id: projectId || null,
    number,
    amount: isNaN(amount) ? 0 : amount,
    currency: String(formData.get("currency") ?? "AED"),
    status: (String(formData.get("status") ?? "draft") as InvoiceStatus),
    due_at: String(formData.get("due_at") ?? "") || null,
    issued_at: new Date().toISOString().slice(0, 10),
    is_published: formData.get("is_published") === "on",
  });
  if (error) return { error: error.message };
  if (projectId) revalidateProject(projectId);
  revalidatePath("/admin/invoices");
  return { ok: true };
}

export async function setInvoiceStatus(id: string, status: InvoiceStatus, projectId: string) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase
    .from("invoices")
    .update({ status, paid_at: status === "paid" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { error: error.message };
  if (projectId) revalidateProject(projectId);
  revalidatePath("/admin/invoices");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Contracts
// ---------------------------------------------------------------------------
export async function createContract(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!projectId || !title) return { error: "Title required" };
  const published = formData.get("is_published") === "on";
  const { error } = await supabase.from("contracts").insert({
    project_id: projectId,
    client_id: String(formData.get("client_id") ?? "") || null,
    title,
    body: String(formData.get("body") ?? "").trim() || null,
    status: "sent",
    is_published: published,
    sent_at: published ? new Date().toISOString() : null,
  });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

/** Client e-signs a contract. */
export async function signContract(contractId: string, name: string, projectId: string) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  if (!name.trim()) return { error: "Type your full name to sign" };
  const { error } = await supabase
    .from("contracts")
    .update({ status: "signed", signed_at: new Date().toISOString(), signed_name: name.trim() })
    .eq("id", contractId);
  if (error) return { error: error.message };
  await log(user.id, projectId, "contract", `Contract signed by ${name.trim()}`);
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Project meta (admin)
// ---------------------------------------------------------------------------
export async function updateProject(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const id = String(formData.get("id"));
  const patch: Record<string, unknown> = {};
  for (const k of ["name", "description", "status", "staging_url", "live_url"]) {
    const v = formData.get(k);
    if (v !== null) patch[k] = String(v).trim() || null;
  }
  const budget = formData.get("budget_total");
  if (budget !== null) patch.budget_total = Number(budget) || 0;
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateProject(id);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export async function sendMessage(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body || !projectId) return { error: "Empty message" };
  const { error } = await supabase.from("messages").insert({ project_id: projectId, sender_id: user.id, body });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Change requests
// ---------------------------------------------------------------------------
export async function createChangeRequest(formData: FormData) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const projectId = String(formData.get("project_id"));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return { error: "Title and details required" };
  const { error } = await supabase.from("change_requests").insert({
    project_id: projectId,
    feature_id: String(formData.get("feature_id") ?? "") || null,
    requested_by: user.id,
    title,
    body,
    urgency: String(formData.get("urgency") ?? "normal"),
    status: "open",
  });
  if (error) return { error: error.message };
  await log(user.id, projectId, "change_request", `Requested changes: "${title}"`);
  revalidateProject(projectId);
  revalidatePath("/admin/change-requests");
  return { ok: true };
}

export async function respondToChangeRequest(
  id: string,
  response: string,
  status: "accepted" | "declined" | "done",
  projectId: string,
) {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const { error } = await supabase
    .from("change_requests")
    .update({ admin_response: response, status, resolved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  revalidatePath("/admin/change-requests");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Add-client wizard (admin) — needs the service role key to create auth users
// ---------------------------------------------------------------------------
export type NewClientFormState = { error?: string; ok?: boolean };

export async function createClientAction(_prev: NewClientFormState, formData: FormData): Promise<NewClientFormState> {
  const { supabase, user } = await getUser();
  if (!user) return { error: "Not authenticated" };
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return { error: "Only admins can add clients" };

  let admin;
  try {
    admin = createServiceClient();
  } catch {
    return { error: "SUPABASE_SERVICE_ROLE_KEY is not set — add it to .env.local to provision client logins." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim().toLowerCase();
  const tempPassword = String(formData.get("temp_password") ?? "").trim();
  const projectName = String(formData.get("project_name") ?? "").trim();

  if (!name) return { error: "Client name required" };
  if (!contactEmail) return { error: "Contact email required" };
  if (tempPassword.length < 8) return { error: "Password must be at least 8 characters" };

  const { data: newUser, error: userErr } = await admin.auth.admin.createUser({
    email: contactEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: contactName, role: "client" },
  });
  if (userErr || !newUser?.user) return { error: userErr?.message ?? "Could not create user" };

  await admin.from("profiles").update({ full_name: contactName, role: "client" }).eq("id", newUser.user.id);

  const { data: client, error: clientErr } = await admin
    .from("clients")
    .insert({ name, company, primary_contact_id: newUser.user.id, status: "active" })
    .select()
    .single();
  if (clientErr || !client) return { error: clientErr?.message ?? "Could not create client" };

  await admin.from("client_users").insert({ client_id: client.id, profile_id: newUser.user.id, role_at_client: "owner" });

  if (projectName) {
    const { data: project } = await admin
      .from("projects")
      .insert({
        client_id: client.id,
        name: projectName,
        slug: slugify(projectName),
        status: "discovery",
        start_date: new Date().toISOString().slice(0, 10),
        description: `${projectName} engagement for ${name}.`,
      })
      .select()
      .single();

    if (project) {
      const milestones = [
        { title: "Discovery", order_index: 0 },
        { title: "Design", order_index: 1 },
        { title: "Build", order_index: 2 },
        { title: "Launch", order_index: 3 },
      ];
      await admin.from("milestones").insert(milestones.map((m) => ({ ...m, project_id: project.id })));
      await admin.from("features").insert([
        { project_id: project.id, title: "Kickoff call", category: "Discovery", status: "planned", is_published: true, published_at: new Date().toISOString() },
        { project_id: project.id, title: "Brand audit", category: "Discovery", status: "planned", is_published: true, published_at: new Date().toISOString() },
        { project_id: project.id, title: "Scope document", category: "Discovery", status: "planned", is_published: true, published_at: new Date().toISOString() },
      ]);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${client.id}`);
}
