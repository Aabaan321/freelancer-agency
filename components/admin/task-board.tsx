"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Clock, Loader2, AlertCircle, ChevronDown, ChevronRight, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import type { Milestone, Task, TaskStatus } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { updateTaskStatus } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { ChangeRequestDialog } from "@/components/client/change-request-dialog";

const STATUS_META: Record<TaskStatus, { label: string; icon: typeof Check; color: string }> = {
  todo: { label: "Todo", icon: Circle, color: "text-ink-subtle" },
  in_progress: { label: "In progress", icon: Loader2, color: "text-info" },
  review: { label: "Review", icon: Clock, color: "text-warning" },
  done: { label: "Done", icon: Check, color: "text-success" },
  blocked: { label: "Blocked", icon: AlertCircle, color: "text-danger" },
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "review",
  review: "done",
  done: "todo",
  blocked: "in_progress",
};

export function TaskBoard({
  milestones: initialMilestones,
  tasks: initialTasks,
  projectId,
  canManage = false,
}: {
  milestones: Milestone[];
  tasks: Task[];
  projectId: string;
  canManage?: boolean;
}) {
  const [milestones] = useState(initialMilestones);
  const [tasks, setTasks] = useState(initialTasks);
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(initialMilestones.map((m) => [m.id, true])),
  );
  const [crTask, setCrTask] = useState<Task | null>(null);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`tasks:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `project_id=eq.${projectId}` },
        (payload) => {
          setTasks((current) => {
            if (payload.eventType === "INSERT") return [...current, payload.new as Task];
            if (payload.eventType === "UPDATE")
              return current.map((t) => (t.id === (payload.new as Task).id ? (payload.new as Task) : t));
            if (payload.eventType === "DELETE")
              return current.filter((t) => t.id !== (payload.old as Task).id);
            return current;
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  function cycleStatus(task: Task) {
    if (!canManage) return;
    const next = NEXT_STATUS[task.status];
    // optimistic
    setTasks((cur) => cur.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    startTransition(async () => {
      const res = await updateTaskStatus(task.id, next);
      if ("error" in res) {
        toast.error(res.error ?? "Could not update");
        setTasks((cur) => cur.map((t) => (t.id === task.id ? task : t)));
      } else if (next === "done") {
        toast.success(`Marked "${task.title}" done`);
      }
    });
  }

  const totalDone = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((totalDone / total) * 100);

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Project progress</div>
            <div className="font-serif text-3xl mt-1">
              {pct}% <span className="text-base text-ink-muted">complete</span>
            </div>
          </div>
          <div className="text-right text-sm text-ink-muted">
            {totalDone} of {total} tasks done
          </div>
        </div>
        <Progress value={pct} />
      </Card>

      {/* Milestones with tasks */}
      {milestones.length === 0 ? (
        <Card className="p-12 text-center text-sm text-ink-muted">No milestones yet.</Card>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone, mi) => {
            const milestoneTasks = tasks.filter((t) => t.milestone_id === milestone.id).sort((a, b) => a.order_index - b.order_index);
            const doneInMs = milestoneTasks.filter((t) => t.status === "done").length;
            const msComplete = milestoneTasks.length > 0 && doneInMs === milestoneTasks.length;
            const isOpen = expanded[milestone.id] ?? true;

            return (
              <Card key={milestone.id} className={cn("overflow-hidden", msComplete && "border-success/30")}>
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [milestone.id]: !isOpen }))}
                  className="w-full flex items-center gap-4 p-5 hover:bg-bg-subtle/40 transition-colors text-left"
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full grid place-items-center font-mono text-xs shrink-0 transition-colors",
                      msComplete
                        ? "bg-success/15 border border-success/40 text-success"
                        : "bg-bg-subtle border border-line text-ink-muted",
                    )}
                  >
                    {msComplete ? <Check className="h-4 w-4" /> : mi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl">{milestone.title}</h3>
                      {milestone.due_date && (
                        <Badge variant="outline" className="text-[10px]">
                          {formatDate(milestone.due_date)}
                        </Badge>
                      )}
                    </div>
                    {milestone.description && <p className="text-xs text-ink-subtle mt-0.5">{milestone.description}</p>}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {doneInMs}/{milestoneTasks.length}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-ink-subtle" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink-subtle" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <Separator />
                      <ul className="divide-y divide-line">
                        {milestoneTasks.length === 0 && (
                          <li className="p-5 text-sm text-ink-subtle text-center">No tasks in this milestone.</li>
                        )}
                        {milestoneTasks.map((task) => {
                          const meta = STATUS_META[task.status];
                          return (
                            <motion.li
                              key={task.id}
                              layout
                              className="p-4 flex items-start gap-3 hover:bg-bg-subtle/30 transition-colors group"
                            >
                              <button
                                onClick={() => cycleStatus(task)}
                                disabled={!canManage || pending}
                                className={cn(
                                  "shrink-0 mt-0.5 h-6 w-6 rounded-full border-2 grid place-items-center transition-all",
                                  task.status === "done"
                                    ? "bg-success/20 border-success text-success"
                                    : task.status === "in_progress"
                                    ? "border-info text-info"
                                    : task.status === "blocked"
                                    ? "border-danger text-danger"
                                    : "border-line text-ink-subtle group-hover:border-gold/60",
                                  canManage && "cursor-pointer hover:scale-110",
                                  !canManage && "cursor-default",
                                )}
                                title={canManage ? `Click to mark ${NEXT_STATUS[task.status]}` : meta.label}
                              >
                                <AnimatePresence mode="wait">
                                  <motion.span
                                    key={task.status}
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {task.status === "done" && <Check className="h-3.5 w-3.5" />}
                                    {task.status === "in_progress" && <Loader2 className="h-3 w-3 animate-spin" />}
                                    {task.status === "blocked" && <AlertCircle className="h-3 w-3" />}
                                    {task.status === "review" && <Clock className="h-3 w-3" />}
                                  </motion.span>
                                </AnimatePresence>
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div
                                      className={cn(
                                        "text-sm leading-snug",
                                        task.status === "done" && "line-through text-ink-subtle",
                                      )}
                                    >
                                      {task.title}
                                    </div>
                                    {task.description && (
                                      <p className="text-xs text-ink-subtle mt-1 line-clamp-2">{task.description}</p>
                                    )}
                                  </div>
                                  <div className="shrink-0 flex items-center gap-2">
                                    <Badge
                                      variant={
                                        task.status === "done"
                                          ? "success"
                                          : task.status === "blocked"
                                          ? "danger"
                                          : task.status === "in_progress"
                                          ? "info"
                                          : task.status === "review"
                                          ? "warning"
                                          : "outline"
                                      }
                                      className="text-[10px]"
                                    >
                                      {meta.label}
                                    </Badge>
                                  </div>
                                </div>

                                {!canManage && task.status !== "done" && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCrTask(task)}
                                    className="mt-2 h-7 text-[11px] px-2"
                                  >
                                    <MessageSquarePlus className="h-3 w-3" /> Request changes
                                  </Button>
                                )}
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}

      {crTask && (
        <ChangeRequestDialog
          open={!!crTask}
          onOpenChange={(o) => !o && setCrTask(null)}
          projectId={projectId}
          task={crTask}
        />
      )}
    </div>
  );
}
