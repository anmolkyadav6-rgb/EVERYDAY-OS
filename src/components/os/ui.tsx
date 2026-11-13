import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import dayLandscape from "@/assets/mountain-day.jpg";
import nightLandscape from "@/assets/mountain-night.jpg";

export function LandscapeBanner({ title, description, className }: { title: string; description?: string; className?: string }) {
  const { resolved } = useTheme();
  return (
    <section className={cn("relative isolate mb-5 min-h-36 overflow-hidden rounded-2xl border bg-card sm:min-h-40", className)}>
      <img src={resolved === "dark" ? nightLandscape : dayLandscape} alt="" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
      <div className="landscape-wash absolute inset-0" />
      <div className="relative flex min-h-36 max-w-[70%] flex-col justify-center p-5 sm:min-h-40 sm:p-6">
        <h2 className="text-lg font-semibold leading-snug sm:text-xl">{title}</h2>
        {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      </div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="fade-up mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </header>
  );
}

export function Panel({ title, action, className, children }: { title?: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("fade-up rounded-2xl border bg-card p-5 text-card-foreground shadow-[0_1px_2px_oklch(0_0_0/4%)]", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ icon: Icon, title, description, className }: { icon: LucideIcon; title: string; description: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center", className)}>
      <div className="mb-3 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function SoonBadge({ label = "Coming soon" }: { label?: string }) {
  return <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{label}</span>;
}
