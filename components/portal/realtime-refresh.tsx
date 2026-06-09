"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to realtime changes on a project's tables and refreshes the
 * server components when anything changes — so a client watching their portal
 * sees the checklist tick over the instant the admin publishes / completes it.
 */
export function RealtimeRefresh({ projectId }: { projectId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const tables = ["features", "budget_items", "design_assets", "preview_links", "invoices", "contracts", "messages", "change_requests"];

    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 250);
    };

    const channel = supabase.channel(`project-${projectId}`);
    for (const table of tables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `project_id=eq.${projectId}` },
        refresh,
      );
    }
    channel.subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [projectId, router]);

  return null;
}
