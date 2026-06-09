import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";

export const metadata = { title: "Messages · Admin" };

export default async function AdminMessages() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, client:clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Messages" description="Conversations live inside each project. Jump in." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(projects ?? []).map((p) => {
          const clientName = (p as { client?: { name?: string } }).client?.name ?? "—";
          return (
            <Link key={p.id} href={`/admin/projects/${p.id}`} className="glass rounded-2xl p-5 hover:border-white/20 transition-colors flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl glass grid place-items-center"><MessageCircle className="h-4 w-4 text-neon-cyan" /></div>
              <div className="min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-ink-subtle truncate">{clientName}</div>
              </div>
            </Link>
          );
        })}
        {(projects ?? []).length === 0 && <p className="text-sm text-ink-subtle">No projects yet.</p>}
      </div>
    </div>
  );
}
