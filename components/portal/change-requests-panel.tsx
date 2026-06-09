"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import type { ChangeRequest } from "@/lib/supabase/types";
import { createChangeRequest, respondToChangeRequest } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  open: "warning", in_review: "info", accepted: "success", declined: "danger", done: "success",
};

export function ChangeRequestsPanel({
  items,
  projectId,
  canManage,
}: {
  items: ChangeRequest[];
  projectId: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  return (
    <div className="space-y-5">
      {!canManage && (!adding ? (
        <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Request a change</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await createChangeRequest(fd); if (r?.error) toast.error(r.error); else { toast.success("Request sent"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <input name="title" required placeholder="What would you like changed?" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <textarea name="body" required rows={4} placeholder="Add detail…" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-y" />
          <div className="flex items-center gap-3">
            <select name="urgency" defaultValue="normal" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              {["low", "normal", "high", "urgent"].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send request"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}

      <div className="space-y-3">
        {items.map((cr) => (
          <div key={cr.id} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-medium">{cr.title}</div>
                <div className="text-xs text-ink-subtle mt-0.5">{formatRelativeTime(cr.created_at)} · {cr.urgency}</div>
              </div>
              <Badge variant={STATUS_VARIANT[cr.status]}>{cr.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{cr.body}</p>
            {cr.admin_response && (
              <div className="mt-3 glass rounded-lg p-3 text-sm">
                <div className="text-[10px] uppercase tracking-wider iridescent-text mb-1">Studio response</div>
                {cr.admin_response}
              </div>
            )}
            {canManage && cr.status !== "done" && cr.status !== "declined" && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={responses[cr.id] ?? ""}
                  onChange={(e) => setResponses((r) => ({ ...r, [cr.id]: e.target.value }))}
                  rows={2}
                  placeholder="Respond…"
                  className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-y"
                />
                <div className="flex gap-2">
                  {(["accepted", "done", "declined"] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={s === "declined" ? "ghost" : "secondary"}
                      disabled={pending}
                      onClick={() => start(async () => { const r = await respondToChangeRequest(cr.id, responses[cr.id] ?? "", s, projectId); if (r?.error) toast.error(r.error); else toast.success(`Marked ${s}`); })}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <MessagesSquare className="h-9 w-9 mx-auto text-ink-subtle opacity-40 mb-3" />
            <p className="text-sm text-ink-muted">No change requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
