"use client";

import { useState, useTransition } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ChangeRequest } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { respondToChangeRequest } from "@/app/actions";
import { formatRelativeTime } from "@/lib/utils";

type CRWithProfile = ChangeRequest & {
  requested_by_profile?: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
  projects?: { name: string } | null;
};

export function ChangeRequestsList({ items, showProject = false }: { items: CRWithProfile[]; showProject?: boolean }) {
  const [responding, setResponding] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function reply(id: string, status: "accepted" | "declined" | "done") {
    startTransition(async () => {
      await respondToChangeRequest(id, text || "(no response)", status);
      toast.success("Reply sent");
      setResponding(null);
      setText("");
    });
  }

  if (items.length === 0) {
    return (
      <Card className="p-16 text-center">
        <Inbox className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
        <h3 className="font-serif text-2xl">No change requests</h3>
        <p className="mt-2 text-sm text-ink-muted">Your client&apos;s asks will land here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((cr) => {
        const profile = Array.isArray(cr.requested_by_profile) ? cr.requested_by_profile[0] : cr.requested_by_profile;
        const isOpen = cr.status === "open" || cr.status === "in_review";
        return (
          <Card key={cr.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg">{cr.title}</h3>
                  <Badge variant={cr.status === "done" || cr.status === "accepted" ? "success" : cr.status === "declined" ? "danger" : "warning"}>
                    {cr.status.replace("_", " ")}
                  </Badge>
                  {cr.urgency === "high" && <Badge variant="danger">urgent</Badge>}
                </div>
                <div className="mt-1 text-xs text-ink-subtle">
                  {profile?.full_name ?? profile?.email ?? "Client"} · {formatRelativeTime(cr.created_at)}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-muted whitespace-pre-wrap">{cr.body}</p>

            {cr.admin_response && (
              <div className="mt-4 p-3 rounded-lg bg-bg-subtle border border-line">
                <div className="text-[10px] uppercase tracking-wider text-gold mb-1">Your response</div>
                <p className="text-sm text-ink whitespace-pre-wrap">{cr.admin_response}</p>
              </div>
            )}

            {isOpen && (
              <div className="mt-4">
                {responding === cr.id ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Reply to the client…"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => reply(cr.id, "accepted")} disabled={pending}>
                        {pending && <Loader2 className="h-3 w-3 animate-spin" />} Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => reply(cr.id, "done")} disabled={pending}>
                        Mark done
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => reply(cr.id, "declined")} disabled={pending}>
                        Decline
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setResponding(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setResponding(cr.id)}>
                    Respond
                  </Button>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
