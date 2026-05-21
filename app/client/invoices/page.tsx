import { Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices · Client" };

export default async function ClientInvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10">
      <PageHeader title="Invoices" description="All invoices issued for your account." />

      {(invoices?.length ?? 0) === 0 ? (
        <Card className="p-16 text-center">
          <Receipt className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <p className="text-sm text-ink-muted">No invoices yet.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {invoices!.map((inv) => (
            <div key={inv.id} className="p-4 grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center">
              <div className="font-mono text-sm">#{inv.number}</div>
              <div className="text-sm text-ink-muted">{inv.issued_at ? formatDate(inv.issued_at) : "—"}</div>
              <div className="font-mono text-sm">{inv.currency} {Number(inv.amount).toLocaleString()}</div>
              <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning"}>
                {inv.status}
              </Badge>
              {inv.status !== "paid" ? (
                <Button size="sm">Pay now</Button>
              ) : (
                <Button size="sm" variant="ghost" disabled>Paid</Button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
