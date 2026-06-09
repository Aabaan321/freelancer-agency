"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, FileSignature, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Contract } from "@/lib/supabase/types";
import { createContract, signContract } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatDate, cn } from "@/lib/utils";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = { draft: "secondary", sent: "info", signed: "success", declined: "danger" };

export function ContractPanel({
  contracts,
  projectId,
  clientId,
  canManage,
}: {
  contracts: Contract[];
  projectId: string;
  clientId: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [signName, setSignName] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="space-y-5">
      {contracts.map((c) => (
        <div key={c.id} className={cn("glass-strong rounded-2xl overflow-hidden", canManage && !c.is_published && "opacity-70")}>
          <div className="flex items-center justify-between gap-3 p-5 border-b border-white/10 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl glass grid place-items-center"><FileSignature className="h-5 w-5 text-gold" /></div>
              <div>
                <div className="font-serif text-xl">{c.title}</div>
                <div className="text-xs text-ink-subtle">{c.sent_at ? `Sent ${formatDate(c.sent_at)}` : "Draft"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
              {canManage && <PublishToggle table="contracts" id={c.id} projectId={projectId} published={c.is_published} size="sm" />}
            </div>
          </div>

          {c.body && (
            <div className="p-6 max-h-80 overflow-y-auto scroll-bar-hidden">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-muted">{c.body}</pre>
            </div>
          )}

          <div className="p-5 border-t border-white/10">
            {c.status === "signed" ? (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 className="h-4 w-4" /> Signed by {c.signed_name} on {formatDate(c.signed_at)}
              </div>
            ) : canManage ? (
              <div className="flex items-center gap-2 text-sm text-ink-subtle"><ShieldCheck className="h-4 w-4" /> Awaiting client signature</div>
            ) : (
              <div className="flex items-end gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-ink-subtle">Type your full name to sign</label>
                  <input value={signName} onChange={(e) => setSignName(e.target.value)} placeholder="Your full name" className="mt-1 w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <Button
                  onClick={() => start(async () => { const r = await signContract(c.id, signName, projectId); if (r?.error) toast.error(r.error); else toast.success("Signed — thank you!"); })}
                  disabled={pending || !signName.trim()}
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />} Sign agreement
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {contracts.length === 0 && <p className="text-center text-sm text-ink-subtle py-10">No contract shared yet.</p>}

      {canManage && (!adding ? (
        <Button variant="secondary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New contract</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await createContract(fd); if (r?.error) toast.error(r.error); else { toast.success("Contract created"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="client_id" value={clientId} />
          <input name="title" required placeholder="Contract title" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <textarea name="body" rows={6} placeholder="Contract body (markdown supported)" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-y" />
          <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" defaultChecked /> Send to client now</label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
