import Link from "next/link";
import { Plus, ArrowUpRight, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Clients · Admin" };

export default async function ClientsListPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*, projects(id, name, status)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader
        title="Clients"
        description={`${clients?.length ?? 0} client${(clients?.length ?? 0) === 1 ? "" : "s"} on the roster.`}
        actions={
          <Button asChild>
            <Link href="/admin/clients/new">
              <Plus className="h-4 w-4" /> Add client
            </Link>
          </Button>
        }
      />

      {(clients?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <Building2 className="h-12 w-12 mx-auto text-ink-subtle opacity-40 mb-4" />
          <h3 className="font-serif text-2xl">No clients yet</h3>
          <p className="mt-2 text-sm text-ink-muted max-w-sm mx-auto">
            Add your first client to get started. They&apos;ll receive login credentials and access to their portal.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin/clients/new">
              <Plus className="h-4 w-4" /> Add your first client
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {clients!.map((c) => {
            const projects = ((c as { projects?: Array<{ id: string; name: string; status: string }> }).projects ?? []) as Array<{ id: string; name: string; status: string }>;
            const active = projects.filter((p) => p.status !== "done").length;
            return (
              <Link key={c.id} href={`/admin/clients/${c.id}`} className="group">
                <Card className="p-6 hover:border-gold/40 transition-all hover:-translate-y-0.5 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-serif text-2xl truncate">{c.name}</h3>
                      {c.company && (
                        <p className="text-sm text-ink-muted truncate">{c.company}</p>
                      )}
                    </div>
                    <Badge variant={c.status === "active" ? "success" : "secondary"}>{c.status}</Badge>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-ink-subtle">
                    <div>
                      <span className="text-ink">{active}</span> active project{active === 1 ? "" : "s"}
                      <span className="mx-2">·</span>
                      Joined {formatDate(c.created_at)}
                    </div>
                    <ArrowUpRight className="h-4 w-4 group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
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
