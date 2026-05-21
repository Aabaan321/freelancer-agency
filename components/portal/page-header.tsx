import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
