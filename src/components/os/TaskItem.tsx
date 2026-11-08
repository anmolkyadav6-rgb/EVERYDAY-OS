import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Task = { id: string; title: string; time?: string; done?: boolean; tag?: string };

/** Reusable task row. Phase 1 has no task storage yet; this renders whatever tasks are passed in. */
export function TaskItem({ task, onToggle }: { task: Task; onToggle?: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
      <button
        type="button"
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
        onClick={() => onToggle?.(task.id)}
        disabled={!onToggle}
        className={cn("grid size-5 place-items-center rounded-full border-2 transition-colors", task.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}
      >
        {task.done && <Check className="size-3" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", task.done && "text-muted-foreground line-through")}>{task.title}</p>
        {task.time && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{task.time}</p>
        )}
      </div>
      {task.tag && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">{task.tag}</span>}
    </div>
  );
}

export function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle?: (id: string) => void }) {
  return <div className="flex flex-col gap-2">{tasks.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} />)}</div>;
}
