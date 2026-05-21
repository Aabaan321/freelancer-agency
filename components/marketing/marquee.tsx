"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  speed = 40,
  pauseOnHover = true,
}: {
  items: React.ReactNode[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden marquee-mask", className)}>
      <div
        className={cn(
          "flex w-max gap-12 will-change-transform animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="shrink-0 flex items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
