"use client";

import { useState } from "react";
import { ExternalLink, Eye, Monitor, Tablet, Smartphone } from "lucide-react";
import type { PreviewLink } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  staging: "Staging",
  live: "Live",
  figma: "Figma",
  loom: "Loom",
  other: "Other",
};

const DEVICE: Record<string, { w: number; h: number }> = {
  desktop: { w: 1280, h: 800 },
  tablet: { w: 768, h: 1024 },
  mobile: { w: 375, h: 667 },
};

export function PreviewLinksClient({ links }: { links: PreviewLink[] }) {
  const pinned = links.find((l) => l.is_pinned) ?? links[0];
  const [active, setActive] = useState<PreviewLink | null>(pinned ?? null);
  const [device, setDevice] = useState<keyof typeof DEVICE>("desktop");

  if (links.length === 0) {
    return (
      <Card className="p-16 text-center">
        <Eye className="h-10 w-10 mx-auto text-ink-subtle opacity-40 mb-3" />
        <h3 className="font-serif text-2xl">No previews yet</h3>
        <p className="mt-2 text-sm text-ink-muted">Once we have something to show, links will land here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-3">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l)}
            className={cn(
              "p-4 rounded-xl border text-left transition-colors flex items-center gap-3",
              active?.id === l.id ? "border-gold/40 bg-gold/5" : "border-line bg-bg-elevated/40 hover:border-gold/30",
            )}
          >
            <div className="h-9 w-9 rounded-lg border border-line bg-bg-subtle grid place-items-center text-xs uppercase text-gold shrink-0">
              {l.kind.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium truncate">{l.label}</div>
                <Badge variant="outline" className="text-[10px]">{KIND_LABEL[l.kind] ?? l.kind}</Badge>
              </div>
              <div className="text-xs text-ink-subtle truncate">{l.url}</div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <Card className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-serif text-xl">{active.label}</h3>
              <div className="text-xs text-ink-subtle truncate max-w-md">{active.url}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-line p-0.5">
                {(Object.keys(DEVICE) as Array<keyof typeof DEVICE>).map((d) => {
                  const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={cn(
                        "h-7 w-9 grid place-items-center rounded-md transition-colors",
                        device === d ? "bg-gold/10 text-gold" : "text-ink-subtle hover:text-ink",
                      )}
                      aria-label={d}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={active.url} target="_blank" rel="noopener noreferrer">
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-bg-subtle rounded-xl border border-line p-4 flex justify-center">
            <div
              className="bg-bg-elevated rounded-lg overflow-hidden border border-line max-w-full transition-all duration-500"
              style={{ width: DEVICE[device].w, height: Math.min(DEVICE[device].h, 720) }}
            >
              <iframe
                src={active.url}
                title={active.label}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
