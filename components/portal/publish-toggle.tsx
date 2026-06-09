"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { setPublished } from "@/app/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Admin-only switch that flips an item's visibility to the client. */
export function PublishToggle({
  table,
  id,
  projectId,
  published,
  size = "default",
}: {
  table: string;
  id: string;
  projectId: string;
  published: boolean;
  size?: "default" | "sm";
}) {
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const res = await setPublished(table, id, projectId, !published);
      if (res?.error) toast.error(res.error);
      else toast.success(!published ? "Now visible to client" : "Hidden from client");
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors disabled:opacity-50",
        published
          ? "border-success/40 bg-success/10 text-success hover:bg-success/20"
          : "border-white/15 bg-white/5 text-ink-subtle hover:text-ink",
        size === "sm" && "px-2 py-0.5",
      )}
      title={published ? "Visible to client — click to hide" : "Hidden — click to publish to client"}
    >
      {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {published ? "Published" : "Hidden"}
    </button>
  );
}
