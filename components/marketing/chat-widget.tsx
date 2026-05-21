"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "What's your pricing?",
  "Can you do AI agents?",
  "How long does a build take?",
  "Show me your work",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Aureon's AI concierge. Tell me about your project, or ask anything about pricing, process, or our work.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  async function send(text?: string) {
    const content = (text ?? input).trim().slice(0, 500);
    if (!content || sending) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "Sorry — let me grab a teammate for that one. Email hello@aureon.studio.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Connection hiccup. Try again, or reach us on WhatsApp." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gold text-bg shadow-[0_8px_30px_-8px_hsl(var(--gold)/0.7)] grid place-items-center"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <span className="absolute inset-0 rounded-full bg-gold animate-pulse-ring" />
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-40 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-8rem))] rounded-2xl bg-bg-elevated border border-line shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-3 p-4 border-b border-line bg-gradient-to-br from-bg-elevated to-bg-subtle">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold to-gold-muted grid place-items-center">
                <Sparkles className="h-4 w-4 text-bg" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Aureon Concierge</div>
                <div className="text-xs text-ink-subtle flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  AI assistant · replies instantly
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-gold text-bg rounded-br-sm"
                        : "bg-bg-subtle text-ink rounded-bl-sm border border-line/60",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-bg-subtle border border-line/60 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-bg-subtle border border-line text-ink-muted hover:border-gold hover:text-gold transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-line bg-bg-elevated flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                placeholder="Ask anything…"
                className="flex-1 bg-bg-subtle border border-line rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/30"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="h-10 w-10 rounded-full bg-gold text-bg grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
