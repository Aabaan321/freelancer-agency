"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Message } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendMessage } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { cn, formatRelativeTime, initials } from "@/lib/utils";

type MessageWithSender = Message & {
  sender?: { full_name: string | null; email: string; role: string } | { full_name: string | null; email: string; role: string }[] | null;
};

export function MessagesPanel({
  messages: initialMessages,
  projectId,
  currentUserId,
}: {
  messages: MessageWithSender[];
  projectId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${projectId}` },
        async (payload) => {
          const newMsg = payload.new as Message;
          // Avoid duplicates from optimistic adds
          setMessages((cur) => {
            if (cur.find((m) => m.id === newMsg.id)) return cur;
            return [...cur, newMsg as MessageWithSender];
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const txt = body;
    setBody("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("project_id", projectId);
      fd.set("body", txt);
      await sendMessage(fd);
    });
  }

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full grid place-items-center text-sm text-ink-subtle">No messages yet — say hi.</div>
        )}
        {messages.map((m) => {
          const sender = Array.isArray(m.sender) ? m.sender[0] : m.sender;
          const isMine = m.sender_id === currentUserId;
          const name = sender?.full_name ?? sender?.email ?? "Unknown";

          return (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", isMine && "flex-row-reverse")}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={cn(isMine && "bg-gold/10 text-gold")}>{initials(name)}</AvatarFallback>
              </Avatar>
              <div className={cn("max-w-[70%]", isMine && "text-right")}>
                <div className="text-xs text-ink-subtle mb-1">
                  {isMine ? "You" : name} · {formatRelativeTime(m.created_at)}
                </div>
                <div
                  className={cn(
                    "inline-block rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    isMine ? "bg-gold text-bg rounded-br-sm" : "bg-bg-subtle text-ink border border-line rounded-bl-sm",
                  )}
                >
                  {m.body}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <form onSubmit={send} className="p-4 border-t border-line flex gap-2 bg-bg-elevated/40">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-bg-subtle border border-line rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/30"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !body.trim()}
          className="h-10 w-10 rounded-full bg-gold text-bg grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </Card>
  );
}
