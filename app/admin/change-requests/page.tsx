import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Change requests · Admin" };

const VARIANT: Record<string, BadgeProps["variant"]> = { open: "warning", in_review: "info", accepted: "success", declined: "danger", done: "success" };

export default async function AdminChangeRequests() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("change_requests")
    .select("*, project:projects(id, name)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Change requests" description="Everything clients have asked for, across all projects." />
      <div className="space-y-3">
        {(items ?? []).map((cr) => {
          const proj = (cr as { project?: { id: string; name: string } }).project;
          return (
            <div key={cr.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-medium">{cr.title}</div>
                  <div className="text-xs text-ink-subtle mt-0.5">
                    {proj && <Link href={`/admin/projects/${proj.id}`} className="hover:text-neon-cyan">{proj.name}</Link>} · {formatRelativeTime(cr.created_at)} · {cr.urgency}
                  </div>
                </div>
                <Badge variant={VARIANT[cr.status]}>{cr.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{cr.body}</p>
              {proj && <Link href={`/admin/projects/${proj.id}`} className="mt-3 inline-block text-xs text-neon-cyan">Respond in project →</Link>}
            </div>
          );
        })}
        {(items ?? []).length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Inbox className="h-9 w-9 mx-auto text-ink-subtle opacity-40 mb-3" />
            <p className="text-sm text-ink-muted">No change requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
