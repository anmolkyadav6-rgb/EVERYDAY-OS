import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ListChecks, NotebookPen, ArrowUpRight, CornerDownLeft, CalendarDays, CheckCircle2, Circle, Sparkles } from "lucide-react";
import dayLandscape from "@/assets/mountain-day.jpg";
import nightLandscape from "@/assets/mountain-night.jpg";
import { mainNav, settingsNav } from "@/lib/nav";
import { formatDue, noteStore, taskStore, todayISO } from "@/lib/store";
import { EmptyState } from "@/components/os/ui";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EVERYDAY OS — Your daily operating system" },
      { name: "description", content: "An all-in-one daily assistant: plan tasks, write notes and use handy tools in one calm place." },
      { property: "og:title", content: "EVERYDAY OS — Your daily operating system" },
      { property: "og:description", content: "An all-in-one daily assistant: plan tasks, write notes and use handy tools in one calm place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  const { resolved } = useTheme();
  useEffect(() => setNow(new Date()), []);
  const tasks = taskStore.use();
  const notes = noteStore.use();
  const today = now ? todayISO() : "";
  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.length - pending.length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const upcoming = [...pending].sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999") || (a.dueTime || "99:99").localeCompare(b.dueTime || "99:99")).slice(0, 4);
  const recent = [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  const dueToday = pending.filter((t) => t.due === today).length;
  const destinations = [...mainNav.slice(1), settingsNav];
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return [...mainNav, settingsNav].filter((d) => (d.label + " " + d.description).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="flex flex-col gap-7">
      <section className="fade-up relative isolate min-h-[250px] overflow-hidden rounded-2xl border bg-card sm:min-h-[275px]">
        <img src={resolved === "dark" ? nightLandscape : dayLandscape} alt="" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
        <div className="landscape-wash absolute inset-0" />
        <div className="relative flex min-h-[250px] max-w-[78%] flex-col justify-center px-5 py-6 sm:min-h-[275px] sm:px-8">
          <p className="text-xs font-semibold uppercase text-primary" suppressHydrationWarning>
            {now ? now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "Your daily overview"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{now ? greeting(now.getHours()) : "Welcome"}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Make today amazing <span aria-hidden="true">✦</span></p>
        </div>
      </section>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search anything..." aria-label="Search EVERYDAY OS"
          className="h-12 w-full rounded-xl border bg-card pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
        {q && (
          <div className="absolute inset-x-0 top-14 z-10 overflow-hidden rounded-xl border bg-popover shadow-lg">
            {results.length ? results.map(({ to, label, icon: Icon, description }) => (
              <Link key={to} to={to} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm hover:bg-secondary">
                <Icon className="size-4 text-muted-foreground" />
                <span className="min-w-0"><span className="font-medium">{label}</span><span className="ml-2 hidden truncate text-muted-foreground sm:inline">{description}</span></span>
                <CornerDownLeft className="size-3.5 text-muted-foreground" />
              </Link>
            )) : <p className="px-4 py-3 text-sm text-muted-foreground">No matches for “{q}”.</p>}
          </div>
        )}
      </div>

      <section className="fade-up">
        <div className="mb-3 flex items-center gap-2 px-1"><Sparkles className="size-4 text-primary" /><h2 className="text-sm font-semibold">Your workspace</h2></div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {destinations.slice(0, 4).map(({ to, label, icon: Icon, description }) => (
            <Link key={to} to={to} className={`group min-h-32 rounded-xl border p-4 transition-all active:scale-[0.98] hover:-translate-y-0.5 hover:border-primary/40 ${label === "Assistant" ? "bg-lavender text-lavender-foreground" : label === "Planner" ? "bg-mint text-mint-foreground" : label === "Notes" ? "bg-peach text-peach-foreground" : "bg-sky text-sky-foreground"}`}>
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-card/70"><Icon className="size-5" /></span>
                <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </div>
              <p className="mt-3 text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs opacity-80">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-up">
        <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">Today's progress</h2><span className="text-sm font-semibold text-primary">{progress}%</span></div>
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div><p className="font-display text-xl font-semibold">{completed} of {tasks.length} tasks</p><p className="mt-1 text-xs text-muted-foreground">{pending.length} remaining · {dueToday} due today</p></div>
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-mint-foreground"><CheckCircle2 className="size-5" /></div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[["Total", tasks.length], ["Completed", completed], ["Remaining", pending.length]].map(([label, value]) => <div key={label}><dd className="text-sm font-semibold">{value}</dd><dt className="text-[11px] text-muted-foreground">{label}</dt></div>)}
          </dl>
        </div>
      </section>

      <section className="fade-up grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">Upcoming tasks</h2><Link to="/planner" className="text-xs font-semibold text-primary">Open planner</Link></div>
          {upcoming.length ? <ul className="divide-y overflow-hidden rounded-xl border bg-card">{upcoming.map((t) => <li key={t.id}><Link to="/planner" className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 hover:bg-secondary"><Circle className="size-4 text-primary" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{t.title}</span><span className="text-xs capitalize text-muted-foreground">{t.priority} priority</span></span><span className="shrink-0 text-right text-xs text-muted-foreground"><CalendarDays className="mb-0.5 inline size-3" /> {t.due ? t.due === today ? "Today" : formatDue(t.due) : "No date"}{t.dueTime && <span className="block">{t.dueTime}</span>}</span></Link></li>)}</ul> : <EmptyState icon={ListChecks} title="No pending tasks" description="Tasks you add in Planner will appear here." className="py-8" />}
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">Recent notes</h2><Link to="/notes" className="text-xs font-semibold text-primary">Open notes</Link></div>
          {recent.length ? <ul className="grid gap-2 sm:grid-cols-2">{recent.map((n) => <li key={n.id}><Link to="/notes" className="block min-h-24 rounded-xl border bg-card p-3 transition-colors hover:bg-secondary"><p className="truncate text-sm font-semibold">{n.title.trim() || "Untitled"}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.content.trim().slice(0, 100) || "No content"}</p><p className="mt-2 text-[11px] text-muted-foreground">{n.category || "Uncategorized"}</p></Link></li>)}</ul> : <EmptyState icon={NotebookPen} title="No notes yet" description="Your recent notes will appear here." className="py-8" />}
        </div>
      </section>
    </div>
  );
}