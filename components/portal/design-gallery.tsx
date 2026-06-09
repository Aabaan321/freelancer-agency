"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, ExternalLink, Figma, Film, FileText, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import type { DesignAsset } from "@/lib/supabase/types";
import { addDesignAsset, deleteRow } from "@/app/actions";
import { PublishToggle } from "./publish-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const IMG_KINDS = new Set(["image", "mockup", "prototype"]);
const KIND_ICON: Record<string, typeof ImageIcon> = { figma: Figma, loom: Film, video: Film, doc: FileText };

export function DesignGallery({
  assets,
  projectId,
  canManage,
}: {
  assets: DesignAsset[];
  projectId: string;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [lightbox, setLightbox] = useState<DesignAsset | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((a) => {
          const isImg = IMG_KINDS.has(a.kind);
          const Icon = KIND_ICON[a.kind] ?? ImageIcon;
          return (
            <div key={a.id} className={cn("group glass rounded-2xl overflow-hidden", canManage && !a.is_published && "opacity-60")}>
              <button
                onClick={() => (isImg ? setLightbox(a) : window.open(a.url, "_blank"))}
                className="block w-full aspect-[4/3] relative bg-bg-subtle overflow-hidden"
              >
                {isImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full grid place-items-center"><Icon className="h-10 w-10 text-ink-subtle" /></div>
                )}
                <div className="absolute top-2 right-2"><Badge variant="secondary" className="text-[9px]">{a.kind}</Badge></div>
              </button>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm">{a.title}</div>
                  {!isImg && <ExternalLink className="h-3.5 w-3.5 text-ink-subtle shrink-0" />}
                </div>
                {a.caption && <p className="mt-1 text-xs text-ink-muted line-clamp-2">{a.caption}</p>}
                {canManage && (
                  <div className="mt-3 flex items-center justify-between">
                    <PublishToggle table="design_assets" id={a.id} projectId={projectId} published={a.is_published} size="sm" />
                    <button onClick={() => start(async () => { await deleteRow("design_assets", a.id, projectId); })} className="text-ink-subtle hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {assets.length === 0 && <p className="text-center text-sm text-ink-subtle py-10">No designs shared yet.</p>}

      {canManage && (!adding ? (
        <Button variant="secondary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add design / prototype</Button>
      ) : (
        <form
          action={(fd) => start(async () => { const r = await addDesignAsset(fd); if (r?.error) toast.error(r.error); else { toast.success("Added"); setAdding(false); } })}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <input name="title" required placeholder="Title" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <input name="url" required placeholder="Image URL or Figma/Loom link" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <input name="caption" placeholder="Caption (optional)" className="w-full bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
          <div className="flex items-center gap-3 flex-wrap">
            <select name="kind" defaultValue="mockup" className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm outline-none">
              {["mockup", "prototype", "image", "figma", "loom", "video", "doc", "other"].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="is_published" /> Visible to client</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ))}

      {lightbox && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-bg/90 backdrop-blur-xl p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-ink-muted hover:text-ink"><X className="h-6 w-6" /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.url} alt={lightbox.title} className="max-h-[85vh] max-w-full rounded-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
