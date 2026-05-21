"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/lib/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createChangeRequest } from "@/app/actions";

export function ChangeRequestDialog({
  open,
  onOpenChange,
  projectId,
  task,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  projectId: string;
  task?: Task | null;
}) {
  const [title, setTitle] = useState(task ? `Changes to: ${task.title}` : "");
  const [body, setBody] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set("project_id", projectId);
      if (task?.id) fd.set("task_id", task.id);
      fd.set("title", title);
      fd.set("body", body);
      fd.set("urgency", urgency);
      const res = await createChangeRequest(fd);
      if ("error" in res) {
        toast.error(res.error ?? "Could not submit");
      } else {
        toast.success("Change request submitted");
        onOpenChange(false);
        setTitle(task ? `Changes to: ${task.title}` : "");
        setBody("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Request changes</DialogTitle>
          <DialogDescription>
            Tell us what you&apos;d like adjusted. We&apos;ll respond within one business day.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="cr-title" className="block mb-2">Title</Label>
            <Input id="cr-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="cr-body" className="block mb-2">What needs changing</Label>
            <Textarea
              id="cr-body"
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Be as specific as you'd like — screenshots, examples, or just a few sentences."
            />
          </div>

          <div>
            <Label className="block mb-2">Urgency</Label>
            <div className="flex gap-2">
              {["low", "normal", "high"].map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={`px-3 py-1.5 rounded-full text-xs border capitalize transition-colors ${
                    urgency === u
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-line text-ink-muted hover:border-gold/40"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
