import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ListChecks, Plus, Pencil, Trash2, Check, CalendarDays, X } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/os/ui";
import { cn } from "@/lib/utils";
import { formatDue, taskStore, todayISO, uid, validateTask, type Priority, type Task, type TaskInput } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Planner — EVERYDAY OS" },
      { name: "description", content: "Plan your tasks and daily schedule in EVERYDAY OS." },
      { property: "og:title", content: "Planner — EVERYDAY OS" },
      { property: "og:description", content: "Plan your tasks and daily schedule in EVERYDAY OS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Planner,
});

type Filter = "all" | "pending" | "completed";
const empty: TaskInput = { title: "", description: "", due: "", priority: "medium" };
const prioStyle: Record<Priority, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-accent text-accent-foreground",
  low: "bg-secondary text-secondary-foreground",
};
const field = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function TaskForm({ initial, onSave, onCancel }: { initial: TaskInput; onSave: (t: TaskInput) => void; onCancel: () => void }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form className="flex flex-col gap-3 rounded-xl border bg-secondary/40 p-4" onSubmit={(e) => {
      e.preventDefault();
      const v = validateTask(f);
      if (v) return setErr(v);
      onSave({ ...f, title: f.title.trim(), description: f.description.trim() });
    }}>
      <input autoFocus aria-label="Task title" placeholder="Task title" maxLength={120} value={f.title} onChange={(e) => { setF({ ...f, title: e.target.value }); setErr(null); }} className={field} />
      <textarea aria-label="Description" placeholder="Description (optional)" maxLength={1000} rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={cn(field, "resize-none")} />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-muted-foreground">Due date
          <input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} className={cn(field, "mt-1")} />
        </label>
        <label className="text-xs text-muted-foreground">Priority
          <select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })} className={cn(field, "mt-1")}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
      </div>
      {err && <p role="alert" className="text-xs font-medium text-destructive">{err}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">Cancel</button>
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Save task</button>
      </div>
    </form>
  );
}

function Planner() {
  const tasks = taskStore.use();
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [days, setDays] = useState<Date[]>([]);
  const [today, setToday] = useState("");
  useEffect(() => {
    const t = new Date();
    setToday(todayISO());
    setDays(Array.from({ length: 7 }, (_, i) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + i)));
  }, []);

  const shown = useMemo(() => tasks
    .filter((t) => filter === "all" || (filter === "completed" ? t.done : !t.done))
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.due || "9999").localeCompare(b.due || "9999") || b.createdAt - a.createdAt), [tasks, filter]);
  const counts = { all: tasks.length, pending: tasks.filter((t) => !t.done).length, completed: tasks.filter((t) => t.done).length };

  const save = (input: TaskInput) => {
    if (editing === "new") taskStore.update((p) => [{ ...input, id: uid(), done: false, createdAt: Date.now() }, ...p]);
    else taskStore.update((p) => p.map((t) => (t.id === editing ? { ...t, ...input } : t)));
    setEditing(null);
  };
  const toggle = (id: string) => taskStore.update((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (t: Task) => { if (confirm(`Delete “${t.title}”?`)) taskStore.update((p) => p.filter((x) => x.id !== t.id)); };

  const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const scheduled = tasks.filter((t) => t.due && !t.done && t.due >= today).sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div>
      <PageHeader eyebrow="Planner" title="Your week" description="Create tasks with due dates and priorities. Everything is saved on this device.">
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="size-4" />Add task
        </button>
      </PageHeader>
      <div className="fade-up -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-7 md:px-0">
        {days.map((d, i) => {
          const n = tasks.filter((t) => !t.done && t.due === dayKey(d)).length;
          return (
            <div key={i} className={`min-w-[64px] rounded-2xl border px-3 py-3 text-center ${i === 0 ? "border-primary bg-accent text-accent-foreground" : "bg-card"}`}>
              <p className="text-[11px] uppercase tracking-wider opacity-70">{d.toLocaleDateString(undefined, { weekday: "short" })}</p>
              <p className="font-display text-xl font-semibold">{d.getDate()}</p>
              <p className="text-[10px] opacity-70">{n ? `${n} task${n > 1 ? "s" : ""}` : "\u00a0"}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-5 md:grid-cols-[3fr_2fr]">
        <Panel title="Tasks">
          <div role="tablist" className="mb-4 flex gap-1 rounded-xl bg-secondary p-1">
            {(["all", "pending", "completed"] as Filter[]).map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} type="button" onClick={() => setFilter(f)}
                className={cn("flex-1 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors", filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
                {f} · {counts[f]}
              </button>
            ))}
          </div>
          {editing === "new" && <div className="mb-3"><TaskForm initial={empty} onSave={save} onCancel={() => setEditing(null)} /></div>}
          {shown.length ? (
            <ul className="flex flex-col gap-2">
              {shown.map((t) => editing === t.id ? (
                <li key={t.id}><TaskForm initial={t} onSave={save} onCancel={() => setEditing(null)} /></li>
              ) : (
                <li key={t.id} className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3">
                  <button type="button" aria-label={t.done ? `Mark ${t.title} as not done` : `Mark ${t.title} as done`} onClick={() => toggle(t.id)}
                    className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors", t.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
                    {t.done && <Check className="size-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn("break-words text-sm font-medium", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                    {t.description && <p className="mt-0.5 whitespace-pre-wrap break-words text-xs text-muted-foreground">{t.description}</p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className={cn("rounded-full px-2 py-0.5 font-medium capitalize", prioStyle[t.priority])}>{t.priority}</span>
                      {t.due && <span className={cn("flex items-center gap-1 text-muted-foreground", !t.done && today && t.due < today && "text-destructive")}><CalendarDays className="size-3" />{formatDue(t.due)}{!t.done && today && t.due < today && " · overdue"}</span>}
                    </div>
                  </div>
                  <button type="button" aria-label={`Edit ${t.title}`} onClick={() => setEditing(t.id)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="size-4" /></button>
                  <button type="button" aria-label={`Delete ${t.title}`} onClick={() => remove(t)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="size-4" /></button>
                </li>
              ))}
            </ul>
          ) : editing !== "new" && (
            <EmptyState icon={filter === "completed" ? Check : ListChecks}
              title={tasks.length ? `No ${filter} tasks` : "A clear list"}
              description={tasks.length ? "Try another filter." : "You have no tasks yet. Use “Add task” to create one."} />
          )}
        </Panel>
        <Panel title="Upcoming">
          {scheduled.length ? (
            <ul className="flex flex-col gap-2">
              {scheduled.slice(0, 8).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-3 py-2.5 text-sm">
                  <span className="truncate">{t.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{t.due === today ? "Today" : formatDue(t.due)}</span>
                </li>
              ))}
            </ul>
          ) : <EmptyState icon={X} title="Nothing scheduled" description="Pending tasks with a due date appear here." />}
        </Panel>
      </div>
    </div>
  );
}
