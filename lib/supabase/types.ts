// Hand-rolled types mirroring supabase/migrations. Regenerate later with
// `supabase gen types typescript` once the project is live.

export type UserRole = "admin" | "client";
export type ProjectStatus = "lead" | "discovery" | "design" | "build" | "review" | "launched" | "paused" | "archived";
export type MilestoneStatus = "pending" | "in_progress" | "done";
export type FeatureStatus = "requested" | "planned" | "in_progress" | "review" | "done" | "wont_do";
export type CRStatus = "open" | "in_review" | "accepted" | "declined" | "done";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export type ContractStatus = "draft" | "sent" | "signed" | "declined";
export type AssetKind = "prototype" | "mockup" | "figma" | "image" | "video" | "loom" | "doc" | "other";
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
  budget_total: number | null;
  currency: string;
  progress_override: number | null;
  start_date: string | null;
  target_date: string | null;
  staging_url: string | null;
  live_url: string | null;
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

export interface Feature {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  status: FeatureStatus;
  requested_by_client: boolean;
  order_index: number;
  is_published: boolean;
  published_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface BudgetItem {
  id: string;
  project_id: string;
  label: string;
  description: string | null;
  category: string | null;
  amount: number;
  currency: string;
  order_index: number;
  is_published: boolean;
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
  line_items: { label: string; amount: number }[];
  issued_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Contract {
  id: string;
  project_id: string;
  client_id: string | null;
  title: string;
  body: string | null;
  file_url: string | null;
  status: ContractStatus;
  is_published: boolean;
  sent_at: string | null;
  signed_at: string | null;
  signed_name: string | null;
  signed_ip: string | null;
  created_at: string;
}

export interface DesignAsset {
  id: string;
  project_id: string;
  kind: AssetKind;
  title: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  order_index: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface PreviewLink {
  id: string;
  project_id: string;
  label: string;
  url: string;
  kind: PreviewKind;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  is_published: boolean;
  created_at: string;
}

export interface ChangeRequest {
  id: string;
  project_id: string;
  feature_id: string | null;
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

export interface ActivityLog {
  id: string;
  actor_id: string | null;
  entity_type: string;
  entity_id: string | null;
  project_id: string | null;
  action: string;
  meta: unknown;
  created_at: string;
}

// Minimal Database type so @supabase/ssr can be generic-instantiated.
type Tbl<Row, Ins> = { Row: Row; Insert: Ins; Update: Partial<Row> };

export type Database = {
  public: {
    Tables: {
      profiles: Tbl<Profile, Partial<Profile> & { id: string; email: string }>;
      clients: Tbl<Client, Partial<Client> & { name: string }>;
      client_users: Tbl<{ client_id: string; profile_id: string; role_at_client: string | null; created_at: string }, { client_id: string; profile_id: string; role_at_client?: string }>;
      projects: Tbl<Project, Partial<Project> & { client_id: string; name: string; slug: string }>;
      milestones: Tbl<Milestone, Partial<Milestone> & { project_id: string; title: string }>;
      features: Tbl<Feature, Partial<Feature> & { project_id: string; title: string }>;
      budget_items: Tbl<BudgetItem, Partial<BudgetItem> & { project_id: string; label: string; amount: number }>;
      invoices: Tbl<Invoice, Partial<Invoice> & { client_id: string; number: string; amount: number }>;
      contracts: Tbl<Contract, Partial<Contract> & { project_id: string; title: string }>;
      design_assets: Tbl<DesignAsset, Partial<DesignAsset> & { project_id: string; title: string; url: string }>;
      preview_links: Tbl<PreviewLink, Partial<PreviewLink> & { project_id: string; label: string; url: string }>;
      deliverables: Tbl<Deliverable, Partial<Deliverable> & { project_id: string; file_path: string; file_name: string }>;
      change_requests: Tbl<ChangeRequest, Partial<ChangeRequest> & { project_id: string; title: string; body: string }>;
      messages: Tbl<Message, Partial<Message> & { project_id: string; body: string }>;
      notifications: Tbl<Notification, Partial<Notification> & { recipient_id: string; type: string; title: string }>;
      activity_log: Tbl<ActivityLog, { actor_id?: string | null; entity_type: string; action: string; entity_id?: string | null; project_id?: string | null; meta?: unknown }>;
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
};
