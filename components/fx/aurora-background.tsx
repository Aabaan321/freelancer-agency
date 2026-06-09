"use client";

/**
 * Fixed, full-viewport animated background. Sits behind everything (-z-10).
 * Layers: aurora blobs (drifting) + faint grid + vignette. GPU-friendly.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* drifting aurora blobs */}
      <div className="absolute -left-1/4 -top-1/4 h-[60vmax] w-[60vmax] rounded-full bg-neon-violet/20 blur-[120px] animate-aurora-drift" />
      <div className="absolute right-[-15%] top-[-10%] h-[50vmax] w-[50vmax] rounded-full bg-neon-cyan/15 blur-[120px] animate-aurora-drift [animation-delay:-6s]" />
      <div className="absolute bottom-[-20%] left-[20%] h-[55vmax] w-[55vmax] rounded-full bg-gold/15 blur-[130px] animate-aurora-drift [animation-delay:-12s]" />
      <div className="absolute bottom-[-10%] right-[5%] h-[40vmax] w-[40vmax] rounded-full bg-neon-magenta/12 blur-[120px] animate-aurora-drift [animation-delay:-3s]" />

      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--bg))_100%)]" />
    </div>
  );
}
