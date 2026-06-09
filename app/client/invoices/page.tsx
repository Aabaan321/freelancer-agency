import Link from "next/link";
import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices · Client" };

const VARIANT: Record<string, BadgeProps["variant"]> = { draft: "secondary", sent: "info", paid: "success", overdue: "danger", void: "outline" };

export default async function ClientInvoices() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, project:projects(id, name)")
    .order("created_at", { ascending: false });

  const due = (invoices ?? []).filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="container-wide py-10">
      <PageHeader title="Invoices" description="Your billing history with the studio." />
      {due > 0 && (
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="text-xs uppercase tracking-wider text-ink-subtle">Outstanding balance</div>
          <div className="font-serif text-3xl mt-1 text-warning">{formatCurrency(due, "AED")}</div>
        </div>
      )}
      <div className="space-y-2">
        {(invoices ?? []).map((inv) => {
          const proj = (inv as { project?: { id: string; name: string } }).project;
          return (
            <div key={inv.id} className="glass rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="h-10 w-10 rounded-lg glass grid place-items-center"><Receipt className="h-4 w-4 text-ink-muted" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm">{inv.number}</div>
                {proj && <Link href={`/client/projects/${proj.id}`} className="text-xs text-ink-subtle hover:text-neon-cyan">{proj.name}</Link>}
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
