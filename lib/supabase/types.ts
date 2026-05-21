// Auto-generatable later via `supabase gen types`. Hand-rolled minimal types now.
export type UserRole = "admin" | "client";
export type ProjectStatus = "lead" | "active" | "review" | "done" | "paused";
export type MilestoneStatus = "pending" | "in_progress" | "done";
export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "blocked";
export type CRStatus = "open" | "in_review" | "accepted" | "declined" | "done";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type PreviewKind = "figma" | "staging" | "live" | "loom" | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  locale: string | null;
  currency: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  primary_contact_id: string | null;
  logo_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  target_date: string | null;
  cover_url: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: MilestoneStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  milestone_id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  order_index: number;
  due_date: string | null;
  client_visible: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  task_id: string | null;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  client_visible: boolean;
  created_at: string;
}

export interface PreviewLink {
  id: string;
  project_id: string;
  label: string;
  url: string;
  kind: PreviewKind;
  is_pinned: boolean;
  created_at: string;
}

export interface ChangeRequest {
  id: string;
  project_id: string;
  task_id: string | null;
  deliverable_id: string | null;
  requested_by: string | null;
  title: string;
  body: string;
  urgency: string | null;
  status: CRStatus;
  admin_response: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string | null;
  body: string;
  attachments: unknown;
  read_at: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id: string | null;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  line_items: unknown;
  issued_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

// Minimal Database type so @supabase/ssr can be generic-instantiated.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string }; Update: Partial<Profile> };
      clients: { Row: Client; Insert: Partial<Client> & { name: string }; Update: Partial<Client> };
      projects: { Row: Project; Insert: Partial<Project> & { client_id: string; name: string; slug: string }; Update: Partial<Project> };
      milestones: { Row: Milestone; Insert: Partial<Milestone> & { project_id: string; title: string }; Update: Partial<Milestone> };
      tasks: { Row: Task; Insert: Partial<Task> & { milestone_id: string; project_id: string; title: string }; Update: Partial<Task> };
      deliverables: { Row: Deliverable; Insert: Partial<Deliverable> & { project_id: string; file_path: string; file_name: string }; Update: Partial<Deliverable> };
      preview_links: { Row: PreviewLink; Insert: Partial<PreviewLink> & { project_id: string; label: string; url: string }; Update: Partial<PreviewLink> };
      change_requests: { Row: ChangeRequest; Insert: Partial<ChangeRequest> & { project_id: string; title: string; body: string }; Update: Partial<ChangeRequest> };
      messages: { Row: Message; Insert: Partial<Message> & { project_id: string; body: string }; Update: Partial<Message> };
      invoices: { Row: Invoice; Insert: Partial<Invoice> & { client_id: string; number: string; amount: number }; Update: Partial<Invoice> };
      notifications: { Row: Notification; Insert: Partial<Notification> & { recipient_id: string; type: string; title: string }; Update: Partial<Notification> };
      client_users: { Row: { client_id: string; profile_id: string; role_at_client: string | null; created_at: string }; Insert: { client_id: string; profile_id: string; role_at_client?: string }; Update: { role_at_client?: string } };
      activity_log: { Row: { id: string; actor_id: string | null; entity_type: string; entity_id: string | null; project_id: string | null; action: string; meta: unknown; created_at: string }; Insert: { actor_id?: string | null; entity_type: string; action: string; entity_id?: string | null; project_id?: string | null; meta?: unknown }; Update: never };
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
};
