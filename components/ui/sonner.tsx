"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-bg-elevated group-[.toaster]:text-ink group-[.toaster]:border-line group-[.toaster]:shadow-2xl",
          description: "group-[.toast]:text-ink-muted",
          actionButton: "group-[.toast]:bg-gold group-[.toast]:text-bg",
          cancelButton: "group-[.toast]:bg-bg-subtle group-[.toast]:text-ink-muted",
        },
      }}
      {...props}
    />
  );
}
