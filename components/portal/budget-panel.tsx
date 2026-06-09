"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { BudgetItem } from "@/lib/supabase/types";
import { addBudgetItem, deleteRow } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function BudgetPanel({
  items,
  projectId,
  currency,
  canManage,
}: {
  items: BudgetItem[];
  projectId: string;
  currency: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [pending, start] = useTransition();

  const visible = items.filter((i) => canManage || i.is_published);
  const total = visible.filter((i) => canManage ? i.is_published : true).reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-5">
      <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl glass grid place-items-center"><Wallet className="h-5 w-5 text-gold" /></div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Project investment</div>
            <div className="font-serif text-3xl mt-0.5 gold-text">{formatCurrency(total, currency)}</div>
          </div>
        </div>
        <div className="text-xs text-ink-subtle">{visible.filter((i) => i.is_published).length} line items</div>
      </div>

      <div className="space-y-2">
        {visible.map((i) => (
          <div key={i.id} className={cn("glass rounded-xl p-4 flex items-center gap-4", canManage && !i.is_published && "opacity-60")}>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{i.label}</div>
              {i.description && <div className="text-sm text-ink-muted">{i.description}</div>}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-ink-subtle">{i.category}</span>
                {canManage && <PublishToggle table="budget_items" id={i.id} projectId={projectId} published={i.is_published} size="sm" />}
              </div>
            </div>
            <div className="font-mono text-sm">{formatCurrency(Number(i.amount), i.currency)}</div>
            {canManage && (
              <button onClick={() => start(async () => { await deleteRow("budget_items", i.id, projectId); })} className="text-ink-subtle hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {visible.length === 0 && <p className="text-center text-sm text-ink-subtle py-8">No budget shared yet.</p>}
      </div>

      {canManage && (!adding ? (
        <Button variant="secondary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add line item</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await addBudgetItem(fd); if (r?.error) toast.error(r.error); else { toast.success("Added"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <div className="flex gap-3 flex-wrap">
            <input name="label" required placeholder="Line item" className="flex-1 min-w-[160px] bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="amount" type="number" step="0.01" placeholder="Amount" className="w-32 bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <input name="currency" defaultValue={currency} className="w-24 bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <input name="description" placeholder="Description (optional)" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <div className="flex items-center gap-3 flex-wrap">
            <input name="category" defaultValue="General" placeholder="Category" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" /> Visible to client</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
