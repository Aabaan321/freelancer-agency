import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Messages · Admin" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Messages" description="Conversations are scoped per project. Pick one to chat." />

      {(projects?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <MessageCircle className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <p className="text-sm text-ink-muted">No projects yet.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {(projects as Array<{ id: string; name: string; clients?: { name: string } | { name: string }[] | null }>).map((p) => {
            const client = p.clients;
            const clientName = Array.isArray(client) ? client[0]?.name : client?.name;
            return (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="group">
                <Card className="p-4 flex items-center gap-3 hover:border-gold/40 transition-colors">
                  <div className="h-10 w-10 rounded-lg border border-line bg-bg-subtle grid place-items-center">
                    <MessageCircle className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{p.name}</div>
                    <div className="text-xs text-ink-subtle">{clientName ?? "—"}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-subtle group-hover:text-gold transition-colors" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
