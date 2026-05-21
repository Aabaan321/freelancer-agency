import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto max-w-3xl", "mb-14", className)}>
      {eyebrow && (
        <FadeIn>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink-subtle mb-4">
            <span className="h-px w-8 bg-gold/60" />
            {eyebrow}
            <span className="h-px w-8 bg-gold/60" />
          </div>
        </FadeIn>
      )}
      <FadeIn delay={0.05}>
        <h2 className="font-serif text-balance text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
          {title}
        </h2>
      </FadeIn>
      {description && (
        <FadeIn delay={0.1}>
          <p
            className={cn(
              "mt-5 text-base sm:text-lg text-ink-muted max-w-2xl text-pretty",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
