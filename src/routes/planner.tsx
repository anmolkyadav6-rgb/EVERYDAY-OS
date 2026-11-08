import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListChecks, CalendarDays } from "lucide-react";
import { EmptyState, PageHeader, Panel } from "@/components/os/ui";
import { TaskList, type Task } from "@/components/os/TaskItem";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Planner — EVERYDAY OS" },
      { name: "description", content: "Plan your tasks and daily schedule in EVERYDAY OS." },
      { property: "og:title", content: "Planner — EVERYDAY OS" },
      { property: "og:description", content: "Plan your tasks and daily schedule in EVERYDAY OS." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const tasks: Task[] = [];
  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const t = new Date();
    setDays(Array.from({ length: 7 }, (_, i) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + i)));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Planner" title="Your week" description="Tasks and schedule, side by side. Task creation arrives in the next phase." />
      <div className="fade-up -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-7 md:px-0">
        {days.map((d, i) => (
          <div key={i} className={`min-w-[64px] rounded-2xl border px-3 py-3 text-center ${i === 0 ? "border-primary bg-accent text-accent-foreground" : "bg-card"}`}>
            <p className="text-[11px] uppercase tracking-wider opacity-70">{d.toLocaleDateString(undefined, { weekday: "short" })}</p>
            <p className="font-display text-xl font-semibold">{d.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="Tasks">
          {tasks.length ? <TaskList tasks={tasks} /> : <EmptyState icon={ListChecks} title="A clear list" description="You have no tasks. Adding tasks will be available soon." />}
        </Panel>
        <Panel title="Schedule">
          <EmptyState icon={CalendarDays} title="Free day" description="No events scheduled. Your timeline will appear here." />
        </Panel>
      </div>
    </div>
  );
}
