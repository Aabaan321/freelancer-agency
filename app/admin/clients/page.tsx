import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export const metadata = { title: "Clients · Admin" };

export default async function AdminClients() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company, status, projects(id)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader
        title="Clients"
        description="Your hand-picked roster."
        actions={<Button asChild><Link href="/admin/clients/new"><Plus className="h-4 w-4" /> Add client</Link></Button>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(clients ?? []).map((c) => {
          const count = ((c as { projects?: unknown[] }).projects ?? []).length;
          return (
            <Link key={c.id} href={`/admin/clients/${c.id}`} className="glass rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-iridescent grid place-items-center text-sm font-semibold text-bg">{initials(c.name)}</div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  {c.company && <div className="text-xs text-ink-subtle truncate flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.company}</div>}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{c.status}</Badge>
                <span className="text-xs text-ink-subtle">{count} project{count === 1 ? "" : "s"}</span>
              </div>
            </Link>
          );
        })}
        {(clients ?? []).length === 0 && <p className="text-sm text-ink-subtle">No clients yet.</p>}
      </div>
    </div>
  );
}
