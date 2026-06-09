"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  Sparkles,
  XCircle,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Feature, FeatureStatus } from "@/lib/supabase/types";
import { updateFeatureStatus, addFeature, deleteRow } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_META: Record<FeatureStatus, { label: string; icon: typeof Circle; cls: string }> = {
  requested: { label: "Requested", icon: Sparkles, cls: "text-neon-violet" },
  planned: { label: "Planned", icon: Circle, cls: "text-ink-subtle" },
  in_progress: { label: "In progress", icon: Clock, cls: "text-neon-cyan" },
  review: { label: "In review", icon: Eye, cls: "text-warning" },
  done: { label: "Done", icon: CheckCircle2, cls: "text-success" },
  wont_do: { label: "Won't do", icon: XCircle, cls: "text-danger" },
};
const ORDER: FeatureStatus[] = ["requested", "planned", "in_progress", "review", "done", "wont_do"];

export function FeatureChecklist({
  features,
  projectId,
  canManage,
}: {
  features: Feature[];
  projectId: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [pending, start] = useTransition();

  const done = features.filter((f) => f.status === "done").length;
  const total = features.filter((f) => f.status !== "wont_do").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // group by category
  const groups = features.reduce<Record<string, Feature[]>>((acc, f) => {
    const k = f.category ?? "General";
    (acc[k] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* progress header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Feature checklist</div>
            <div className="font-serif text-3xl mt-1">
              {done} <span className="text-ink-subtle text-xl">/ {total} complete</span>
            </div>
          </div>
          <div className="text-right">
            <div className="iridescent-text font-serif text-4xl">{pct}%</div>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-iridescent transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat}>
          <div className="mb-2 flex items-center gap-2 px-1">
            <h3 className="text-sm font-medium text-ink-muted">{cat}</h3>
            <span className="text-xs text-ink-subtle">{items.length}</span>
          </div>
          <div className="space-y-2">
            {items
              .sort((a, b) => a.order_index - b.order_index)
              .map((f) => {
                const meta = STATUS_META[f.status];
                const Icon = meta.icon;
                return (
                  <div
                    key={f.id}
                    className={cn(
                      "glass rounded-xl p-4 flex items-start gap-3 transition-opacity",
                      canManage && !f.is_published && "opacity-60",
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", meta.cls)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("font-medium", f.status === "done" && "line-through text-ink-muted")}>
                          {f.title}
                        </span>
                        {f.requested_by_client && (
                          <Badge variant="outline" className="text-[9px]">Requested</Badge>
                        )}
                      </div>
                      {f.description && <p className="mt-1 text-sm text-ink-muted">{f.description}</p>}
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[11px] uppercase tracking-wider", meta.cls)}>{meta.label}</span>
                        {canManage && (
                          <PublishToggle table="features" id={f.id} projectId={projectId} published={f.is_published} size="sm" />
                        )}
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          defaultValue={f.status}
                          onChange={(e) =>
                            start(async () => {
                              const res = await updateFeatureStatus(f.id, e.target.value as FeatureStatus, projectId);
                              if (res?.error) toast.error(res.error);
                            })
                          }
                          className="rounded-lg bg-bg-elevated border border-white/10 px-2 py-1 text-xs outline-none"
                        >
                          {ORDER.map((s) => (
                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            start(async () => {
                              await deleteRow("features", f.id, projectId);
                            })
                          }
                          className="text-ink-subtle hover:text-danger transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {features.length === 0 && (
        <p className="text-center text-sm text-ink-subtle py-10">No features yet.</p>
      )}

      {/* admin add */}
      {canManage && (
        <div>
          {!adding ? (
            <Button variant="secondary" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" /> Add feature
            </Button>
          ) : (
            <form
              action={(fd) =>
                start(async () => {
                  const res = await addFeature(fd);
                  if (res?.error) toast.error(res.error);
                  else { toast.success("Feature added"); setAdding(false); }
                })
              }
              className="glass rounded-2xl p-5 space-y-3"
            >
              <input type="hidden" name="project_id" value={projectId} />
              <input name="title" required placeholder="Feature title" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
              <input name="description" placeholder="Short description" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
              <div className="flex gap-3 flex-wrap">
                <input name="category" placeholder="Category" defaultValue="General" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                <select name="status" defaultValue="planned" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
                  {ORDER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="requested_by_client" /> Client-requested</label>
                <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" defaultChecked /> Visible to client</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
