"use client";

import { useState, useTransition } from "react";
import { Plus, ExternalLink, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import type { PreviewLink, PreviewKind } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { addPreviewLink, deletePreviewLink } from "@/app/actions";

const KIND_LABELS: Record<PreviewKind, string> = {
  staging: "Staging",
  live: "Live",
  figma: "Figma",
  loom: "Loom",
  other: "Other",
};

export function PreviewLinksManager({ links, projectId }: { links: PreviewLink[]; projectId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ label: "", url: "", kind: "staging" as PreviewKind });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("project_id", projectId);
      fd.set("label", form.label);
      fd.set("url", form.url);
      fd.set("kind", form.kind);
      const res = await addPreviewLink(fd);
      if ("error" in res) {
        toast.error(res.error ?? "Could not add");
      } else {
        toast.success("Preview link added");
        setOpen(false);
        setForm({ label: "", url: "", kind: "staging" });
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Remove this preview link?")) return;
    startTransition(async () => {
      await deletePreviewLink(id, projectId);
      toast.success("Removed");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Share Figma, staging URLs, Loom walkthroughs — visible to your client in their portal.
        </p>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="h-4 w-4" /> Add link
        </Button>
      </div>

      {links.length === 0 ? (
        <Card className="p-16 text-center">
          <Eye className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <p className="text-sm text-ink-muted">No preview links yet.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {links.map((l) => (
            <Card key={l.id} className="p-4 flex items-center gap-3 group hover:border-gold/40 transition-colors">
              <div className="h-10 w-10 rounded-lg border border-line bg-bg-subtle grid place-items-center text-xs uppercase tracking-wider text-gold shrink-0">
                {l.kind.slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium truncate">{l.label}</div>
                  <Badge variant="outline" className="text-[10px]">{KIND_LABELS[l.kind]}</Badge>
                </div>
                <div className="text-xs text-ink-subtle truncate">{l.url}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg grid place-items-center text-ink-muted hover:text-gold hover:bg-bg-subtle transition-colors"
                  aria-label="Open"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => remove(l.id)}
                  className="h-8 w-8 rounded-lg grid place-items-center text-ink-muted hover:text-danger hover:bg-bg-subtle transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a preview link</DialogTitle>
            <DialogDescription>This will be visible to the client in their portal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="block mb-2">Label</Label>
              <Input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Staging preview" />
            </div>
            <div>
              <Label className="block mb-2">URL</Label>
              <Input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://staging.example.com" />
            </div>
            <div>
              <Label className="block mb-2">Type</Label>
              <div className="flex flex-wrap gap-2">
                {(["staging", "live", "figma", "loom", "other"] as PreviewKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setForm({ ...form, kind: k })}
                    className={`px-3 py-1.5 rounded-full text-xs border capitalize transition-colors ${
                      form.kind === k ? "border-gold bg-gold/10 text-gold" : "border-line text-ink-muted hover:border-gold/40"
                    }`}
                  >
                    {KIND_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
