import Link from "next/link";
import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices · Admin" };

const VARIANT: Record<string, BadgeProps["variant"]> = { draft: "secondary", sent: "info", paid: "success", overdue: "danger", void: "outline" };

export default async function AdminInvoices() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, client:clients(name), project:projects(id, name)")
    .order("created_at", { ascending: false });

  const paid = (invoices ?? []).filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const due = (invoices ?? []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="container-wide py-10">
      <PageHeader title="Invoices" description="Create and manage invoices inside each project; this is the overview." />
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-ink-subtle">Collected</div><div className="font-serif text-2xl mt-1 text-success">{formatCurrency(paid, "AED")}</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-ink-subtle">Outstanding</div><div className="font-serif text-2xl mt-1 text-warning">{formatCurrency(due, "AED")}</div></div>
      </div>
      <div className="space-y-2">
        {(invoices ?? []).map((inv) => {
          const proj = (inv as { project?: { id: string; name: string } }).project;
          const clientName = (inv as { client?: { name?: string } }).client?.name ?? "—";
          return (
            <div key={inv.id} className="glass rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="h-10 w-10 rounded-lg glass grid place-items-center"><Receipt className="h-4 w-4 text-ink-muted" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm">{inv.number}</div>
                <div className="text-xs text-ink-subtle">{clientName}{proj && <> · <Link href={`/admin/projects/${proj.id}`} className="hover:text-neon-cyan">{proj.name}</Link></>}</div>
              </div>
              {inv.due_at && <span className="text-xs text-ink-subtle">Due {formatDate(inv.due_at)}</span>}
              <Badge variant={VARIANT[inv.status]}>{inv.status}</Badge>
              <div className="font-mono text-sm w-28 text-right">{formatCurrency(Number(inv.amount), inv.currency)}</div>
            </div>
          );
        })}
        {(invoices ?? []).length === 0 && <p className="text-sm text-ink-subtle">No invoices yet.</p>}
      </div>
    </div>
  );
}
