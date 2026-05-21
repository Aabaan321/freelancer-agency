import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects · Admin" };

export default async function ProjectsListPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader
        title="Projects"
        description={`${projects?.length ?? 0} project${(projects?.length ?? 0) === 1 ? "" : "s"} across all clients.`}
      />

      {(projects?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-ink-subtle opacity-40 mb-4" />
          <h3 className="font-serif text-2xl">No projects yet</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Add a client first — you can spin up their starter project at the same time.
          </p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {projects!.map((p) => {
            const client = (p as typeof p & { clients: { name: string } | { name: string }[] | null }).clients;
            const clientName = Array.isArray(client) ? client[0]?.name : client?.name;
            return (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="group">
                <Card className="p-6 hover:border-gold/40 transition-all hover:-translate-y-0.5 h-full">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">{clientName ?? "Client"}</p>
                      <h3 className="mt-1 font-serif text-2xl truncate">{p.name}</h3>
                    </div>
                    <Badge variant={p.status === "done" ? "success" : "default"}>{p.status}</Badge>
                  </div>
                  {p.description && (
                    <p className="mt-4 text-sm text-ink-muted line-clamp-2">{p.description}</p>
                  )}
                  <div className="mt-6 flex items-center justify-between text-xs text-ink-subtle">
                    <span>Started {formatDate(p.start_date ?? p.created_at)}</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:text-gold transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
