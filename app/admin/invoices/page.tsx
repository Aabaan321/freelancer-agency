import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices · Admin" };

export default async function AdminInvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Invoices" description="Track every invoice across all clients." />

      {(invoices?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <Receipt className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <h3 className="font-serif text-2xl">No invoices yet</h3>
          <p className="mt-2 text-sm text-ink-muted">Invoice creation UI shipping in the next iteration.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {invoices!.map((inv) => {
            const client = (inv as typeof inv & { clients: { name: string } | { name: string }[] | null }).clients;
            const clientName = Array.isArray(client) ? client[0]?.name : client?.name;
            return (
              <div key={inv.id} className="p-4 grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                <div className="font-mono text-sm">#{inv.number}</div>
                <div className="text-sm">{clientName ?? "—"}</div>
                <div className="font-mono text-sm">{inv.currency} {Number(inv.amount).toLocaleString()}</div>
                <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning"}>
                  {inv.status}
                </Badge>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
