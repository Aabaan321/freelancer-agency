"use client";

import { useState, useEffect } from "react";
import { Inbox } from "lucide-react";
import type { ChangeRequest } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { ChangeRequestDialog } from "@/components/client/change-request-dialog";

export function ChangeRequestsClientList({ items: initial, projectId }: { items: ChangeRequest[]; projectId: string }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);

  // Realtime: pick up admin responses immediately
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel(`cr:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "change_requests", filter: `project_id=eq.${projectId}` },
        (payload) => {
          setItems((cur) => {
            if (payload.eventType === "INSERT") {
              if (cur.find((c) => c.id === (payload.new as ChangeRequest).id)) return cur;
              return [payload.new as ChangeRequest, ...cur];
            }
            if (payload.eventType === "UPDATE")
              return cur.map((c) => (c.id === (payload.new as ChangeRequest).id ? (payload.new as ChangeRequest) : c));
            if (payload.eventType === "DELETE") return cur.filter((c) => c.id !== (payload.old as ChangeRequest).id);
            return cur;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [projectId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>New request</Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-16 text-center">
          <Inbox className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
          <h3 className="font-serif text-2xl">No change requests yet</h3>
          <p className="mt-2 text-sm text-ink-muted max-w-sm mx-auto">
            See something you&apos;d like adjusted? Hit &ldquo;Request changes&rdquo; on any task — or use the button above.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((cr) => (
            <Card key={cr.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg">{cr.title}</h3>
                    <Badge
                      variant={
                        cr.status === "done" || cr.status === "accepted"
                          ? "success"
                          : cr.status === "declined"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {cr.status.replace("_", " ")}
                    </Badge>
                    {cr.urgency === "high" && <Badge variant="danger">urgent</Badge>}
                  </div>
                  <div className="mt-1 text-xs text-ink-subtle">{formatRelativeTime(cr.created_at)}</div>
                </div>
              </div>

              <p className="mt-3 text-sm text-ink-muted whitespace-pre-wrap">{cr.body}</p>

              {cr.admin_response && (
                <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/30">
                  <div className="text-[10px] uppercase tracking-wider text-gold mb-1">Team response</div>
                  <p className="text-sm text-ink whitespace-pre-wrap">{cr.admin_response}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <ChangeRequestDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </div>
  );
}
