"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Monitor, Tablet, Smartphone, Plus, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import type { PreviewLink } from "@/lib/supabase/types";
import { addPreviewLink, deleteRow } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEVICE = {
  desktop: { w: 1280, h: 800, icon: Monitor },
  tablet: { w: 768, h: 1024, icon: Tablet },
  mobile: { w: 375, h: 667, icon: Smartphone },
};

export function PreviewPanel({
  links,
  projectId,
  canManage,
}: {
  links: PreviewLink[];
  projectId: string;
  canManage: boolean;
}) {
  const [active, setActive] = useState<PreviewLink | null>(links.find((l) => l.is_pinned) ?? links[0] ?? null);
  const [device, setDevice] = useState<keyof typeof DEVICE>("desktop");
  const [adding, setAdding] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l)}
            className={cn(
              "glass rounded-xl p-4 text-left flex items-center gap-3 transition-colors",
              active?.id === l.id && "border-neon-violet/40",
              canManage && !l.is_published && "opacity-60",
            )}
          >
            <div className="h-9 w-9 rounded-lg glass grid place-items-center text-[10px] uppercase iridescent-text shrink-0">{l.kind.slice(0, 3)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="text-sm font-medium truncate">{l.label}</span><Badge variant="outline" className="text-[9px]">{l.kind}</Badge></div>
              <div className="text-xs text-ink-subtle truncate">{l.url}</div>
            </div>
          </button>
        ))}
      </div>

      {canManage && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <div key={l.id} className="flex items-center gap-2 glass rounded-full pl-3 pr-1 py-1">
              <span className="text-xs text-ink-muted truncate max-w-[120px]">{l.label}</span>
              <PublishToggle table="preview_links" id={l.id} projectId={projectId} published={l.is_published} size="sm" />
              <button onClick={() => start(async () => { await deleteRow("preview_links", l.id, projectId); })} className="text-ink-subtle hover:text-danger px-1"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {active ? (
        <div className="glass rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-xl">{active.label}</h3>
              <div className="text-xs text-ink-subtle truncate max-w-md">{active.url}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg glass p-0.5">
                {(Object.keys(DEVICE) as Array<keyof typeof DEVICE>).map((d) => {
                  const Icon = DEVICE[d].icon;
                  return (
                    <button key={d} onClick={() => setDevice(d)} className={cn("h-7 w-9 grid place-items-center rounded-md transition-colors", device === d ? "bg-white/10 text-neon-cyan" : "text-ink-subtle hover:text-ink")} aria-label={d}>
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
              <Button asChild size="sm" variant="outline"><a href={active.url} target="_blank" rel="noopener noreferrer">Open <ExternalLink className="h-3.5 w-3.5" /></a></Button>
            </div>
          </div>
          <div className="bg-bg-subtle rounded-xl border border-white/10 p-4 flex justify-center overflow-auto">
            <div className="bg-bg-elevated rounded-lg overflow-hidden border border-white/10 max-w-full transition-all duration-500" style={{ width: DEVICE[device].w, height: Math.min(DEVICE[device].h, 700) }}>
              <iframe src={active.url} title={active.label} className="w-full h-full" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-16 text-center">
          <Eye className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <h3 className="font-serif text-2xl">No previews yet</h3>
          <p className="mt-2 text-sm text-ink-muted">Once there&apos;s something to show, it lands here.</p>
        </div>
      )}

      {canManage && (!adding ? (
        <Button variant="secondary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add preview link</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await addPreviewLink(fd); if (r?.error) toast.error(r.error); else { toast.success("Added"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <div className="flex gap-3 flex-wrap">
            <input name="label" required placeholder="Label" className="flex-1 min-w-[140px] bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
            <select name="kind" defaultValue="staging" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              {["staging", "live", "figma", "loom", "other"].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <input name="url" required placeholder="https://…" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" /> Visible to client</label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
