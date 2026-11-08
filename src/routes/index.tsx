import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, CalendarClock, ListChecks, ArrowUpRight, CornerDownLeft } from "lucide-react";
import { mainNav, settingsNav } from "@/lib/nav";
import { EmptyState, Panel } from "@/components/os/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EVERYDAY OS — Your daily operating system" },
      { name: "description", content: "An all-in-one daily assistant: plan tasks, write notes and use handy tools in one calm place." },
      { property: "og:title", content: "EVERYDAY OS — Your daily operating system" },
      { property: "og:description", content: "An all-in-one daily assistant: plan tasks, write notes and use handy tools in one calm place." },
    ],
  }),
  component: Home,
});

function greeting(h: number) {
  return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Home() {
  const [now, setNow] = useState<Date | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => setNow(new Date()), []);

  const destinations = [...mainNav.slice(1), settingsNav];
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return [...mainNav, settingsNav].filter((d) => (d.label + " " + d.description).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="flex flex-col gap-5">
      <section className="fade-up glow relative overflow-hidden rounded-3xl border bg-card px-5 py-7 md:px-8 md:py-10">
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          {now ? now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "\u00a0"}
        </p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{now ? greeting(now.getHours()) : "Welcome"}.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Here's your space for today.</p>

        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to Planner, Notes, Toolbox…" aria-label="Search EVERYDAY OS"
            className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
          {q && (
            <div className="absolute inset-x-0 top-14 z-10 overflow-hidden rounded-2xl border bg-popover shadow-lg">
              {results.length ? results.map(({ to, label, icon: Icon, description }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{label}</span>
                  <span className="truncate text-muted-foreground">{description}</span>
                  <CornerDownLeft className="ml-auto size-3.5 text-muted-foreground" />
                </Link>
              )) : <p className="px-4 py-3 text-sm text-muted-foreground">No matches for “{q}”.</p>}
            </div>
          )}
        </div>
      </section>

      <section className="fade-up">
        <h2 className="mb-3 px-1 text-sm font-semibold">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {destinations.slice(0, 4).map(({ to, label, icon: Icon, description }) => (
            <Link key={to} to={to} className="group rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="size-5" /></span>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-5">
        <Panel title="Today's overview" className="md:col-span-2">
          <dl className="grid grid-cols-2 gap-3">
            {[["Tasks", "0"], ["Done", "0"], ["Events", "0"], ["Notes", "0"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-display text-2xl font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Tasks & upcoming" className="md:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks you plan will show up here." className="py-8" />
            <EmptyState icon={CalendarClock} title="Nothing scheduled" description="Upcoming activities will appear here." className="py-8" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
