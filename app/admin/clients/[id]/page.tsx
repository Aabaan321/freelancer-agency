import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Phone, Plus, FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Client · Admin" };

export default async function AdminClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const [{ data: projects }, { data: contact }, { data: invoices }] = await Promise.all([
    supabase.from("projects").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    client.primary_contact_id
      ? supabase.from("profiles").select("full_name, email, phone").eq("id", client.primary_contact_id).single()
      : Promise.resolve({ data: null }),
    supabase.from("invoices").select("*").eq("client_id", id).order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="container-wide py-10">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-gold transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All clients
      </Link>

      <PageHeader
        title={client.name}
        description={client.company ?? "Client"}
        actions={<Badge variant={client.status === "active" ? "success" : "secondary"}>{client.status}</Badge>}
      />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl">Projects</h2>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/clients/new">
                  <Plus className="h-4 w-4" /> New project
                </Link>
              </Button>
            </div>
            {(projects?.length ?? 0) === 0 ? (
              <div className="py-12 text-center text-sm text-ink-subtle">
                <FolderKanban className="h-8 w-8 mx-auto opacity-40 mb-2" />
                No projects yet
              </div>
            ) : (
              <ul className="space-y-2">
                {projects!.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-bg-subtle transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm">{p.name}</div>
                        {p.description && <div className="text-xs text-ink-subtle truncate">{p.description}</div>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={p.status === "done" ? "success" : "default"}>{p.status}</Badge>
                        <ArrowUpRight className="h-4 w-4 text-ink-subtle group-hover:text-gold transition-colors" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {client.notes && (
            <Card className="p-6">
              <h2 className="font-serif text-xl mb-4">Notes</h2>
              <p className="text-sm text-ink-muted whitespace-pre-wrap">{client.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Primary contact</h3>
            {contact ? (
              <>
                <h4 className="mt-3 font-serif text-xl">{contact.full_name ?? "—"}</h4>
                <Separator className="my-4" />
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-ink-muted hover:text-gold transition-colors">
                      <Mail className="h-3.5 w-3.5" /> {contact.email}
                    </a>
                  </li>
                  {contact.phone && (
                    <li>
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-ink-muted hover:text-gold transition-colors">
                        <Phone className="h-3.5 w-3.5" /> {contact.phone}
                      </a>
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink-subtle">No contact set</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Recent invoices</h3>
            {(invoices?.length ?? 0) === 0 ? (
              <p className="mt-3 text-sm text-ink-subtle">No invoices yet</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {invoices!.map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">#{inv.number}</span>
                    <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning"}>
                      {inv.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6 text-xs text-ink-subtle">
            <div>Client since {formatDate(client.created_at)}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
