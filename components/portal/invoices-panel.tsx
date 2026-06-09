"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import type { Invoice, InvoiceStatus } from "@/lib/supabase/types";
import { createInvoice, setInvoiceStatus } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate, cn } from "@/lib/utils";

const STATUS_VARIANT: Record<InvoiceStatus, BadgeProps["variant"]> = {
  draft: "secondary",
  sent: "info",
  paid: "success",
  overdue: "danger",
  void: "outline",
};
const STATUSES: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "void"];

export function InvoicesPanel({
  invoices,
  projectId,
  clientId,
  currency,
  canManage,
}: {
  invoices: Invoice[];
  projectId: string;
  clientId: string;
  currency: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [pending, start] = useTransition();

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalDue = invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-ink-subtle">Paid</div><div className="font-serif text-2xl mt-1 text-success">{formatCurrency(totalPaid, currency)}</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs uppercase tracking-wider text-ink-subtle">Outstanding</div><div className="font-serif text-2xl mt-1 text-warning">{formatCurrency(totalDue, currency)}</div></div>
      </div>

      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className={cn("glass rounded-xl p-4 flex items-center gap-4 flex-wrap", canManage && !inv.is_published && "opacity-60")}>
            <div className="h-10 w-10 rounded-lg glass grid place-items-center"><Receipt className="h-4 w-4 text-ink-muted" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium font-mono text-sm">{inv.number}</div>
              <div className="text-xs text-ink-subtle">{inv.due_at ? `Due ${formatDate(inv.due_at)}` : "No due date"}</div>
            </div>
            <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
            <div className="font-mono text-sm w-28 text-right">{formatCurrency(Number(inv.amount), inv.currency)}</div>
            {canManage && (
              <div className="flex items-center gap-2">
                <select defaultValue={inv.status} onChange={(e) => start(async () => { const r = await setInvoiceStatus(inv.id, e.target.value as InvoiceStatus, projectId); if (r?.error) toast.error(r.error); })} className="rounded-lg bg-bg-elevated border border-white/10 px-2 py-1 text-xs outline-none">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <PublishToggle table="invoices" id={inv.id} projectId={projectId} published={inv.is_published} size="sm" />
              </div>
            )}
          </div>
        ))}
        {invoices.length === 0 && <p className="text-center text-sm text-ink-subtle py-8">No invoices yet.</p>}
      </div>

      {canManage && (!adding ? (
        <Button variant="secondary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New invoice</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await createInvoice(fd); if (r?.error) toast.error(r.error); else { toast.success("Invoice created"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="client_id" value={clientId} />
          <div className="flex gap-3 flex-wrap">
            <input name="number" placeholder="Invoice #" className="flex-1 min-w-[140px] bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="amount" type="number" step="0.01" placeholder="Amount" className="w-32 bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="currency" defaultValue={currency} className="w-24 bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <input name="due_at" type="date" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <select name="status" defaultValue="sent" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" defaultChecked /> Visible to client</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
