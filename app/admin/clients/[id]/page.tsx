import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Client · Admin" };

export default async function AdminClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*, contact:profiles!clients_primary_contact_id_fkey(full_name, email)")
    .eq("id", id)
    .single();
  if (!client) notFound();

  const { data: projects } = await supabase.from("projects").select("id, name, status").eq("client_id", id).order("created_at", { ascending: false });
  const contact = (client as { contact?: { full_name?: string; email?: string } }).contact;

  return (
    <div className="container-wide py-10">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-neon-cyan transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> All clients
      </Link>
      <PageHeader title={client.name} description={client.company ?? undefined} actions={<Badge variant="secondary">{client.status}</Badge>} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 space-y-3">
          <h3 className="font-serif text-lg">Contact</h3>
          {contact?.full_name && <div className="text-sm">{contact.full_name}</div>}
          {contact?.email && <div className="text-sm text-ink-muted flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {contact.email}</div>}
          {client.company && <div className="text-sm text-ink-muted flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {client.company}</div>}
          {client.notes && <p className="text-sm text-ink-subtle pt-2 border-t border-white/10">{client.notes}</p>}
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-serif text-lg mb-3">Projects</h3>
          <div className="space-y-2">
            {(projects ?? []).map((p) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="glass rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors">
                <span className="font-medium">{p.name}</span>
                <Badge variant="secondary">{p.status}</Badge>
              </Link>
            ))}
            {(projects ?? []).length === 0 && <p className="text-sm text-ink-subtle">No projects yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
