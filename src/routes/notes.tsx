import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NotebookPen, FileText, Plus, Search, Trash2, ArrowLeft } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/os/ui";
import { cn } from "@/lib/utils";
import { noteStore, uid, type Note } from "@/lib/store";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — EVERYDAY OS" },
      { name: "description", content: "Capture ideas and keep simple notes in EVERYDAY OS." },
      { property: "og:title", content: "Notes — EVERYDAY OS" },
      { property: "og:description", content: "Capture ideas and keep simple notes in EVERYDAY OS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notes,
});

const when = (t: number) => new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Notes() {
  const notes = noteStore.use();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = useMemo(() => [...notes].sort((a, b) => b.updatedAt - a.updatedAt), [notes]);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? sorted.filter((n) => (n.title + " " + n.content).toLowerCase().includes(s)) : sorted;
  }, [sorted, q]);
  const open = notes.find((n) => n.id === openId) ?? null;

  const create = () => {
    const n: Note = { id: uid(), title: "", content: "", updatedAt: Date.now() };
    noteStore.update((p) => [n, ...p]);
    setOpenId(n.id);
    setQ("");
  };
  const patch = (id: string, ch: Partial<Note>) => noteStore.update((p) => p.map((n) => (n.id === id ? { ...n, ...ch, updatedAt: Date.now() } : n)));
  const remove = (n: Note) => {
    if (!confirm(`Delete “${n.title || "Untitled"}”?`)) return;
    noteStore.update((p) => p.filter((x) => x.id !== n.id));
    setOpenId(null);
  };

  return (
    <div>
      <PageHeader eyebrow="Notes" title="Notes" description="A quiet place for thoughts, lists and ideas. Changes save automatically on this device.">
        <button type="button" onClick={create} className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="size-4" />New note
        </button>
      </PageHeader>
      <div className="fade-up grid min-h-[55vh] overflow-hidden rounded-3xl border bg-card md:grid-cols-[260px_1fr]">
        <aside className={cn("border-b p-4 md:block md:border-b-0 md:border-r", open && "hidden")}>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes" aria-label="Search notes"
              className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{q ? `Results · ${shown.length}` : `All notes · ${notes.length}`}</p>
          {shown.length ? (
            <ul className="flex flex-col gap-1">
              {shown.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => setOpenId(n.id)} className={cn("w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary", n.id === openId && "bg-accent text-accent-foreground")}>
                    <p className="truncate text-sm font-medium">{n.title.trim() || "Untitled"}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.content.trim().slice(0, 80) || "No content"}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : q ? <p className="px-1 py-6 text-center text-sm text-muted-foreground">No notes match “{q}”.</p>
            : <EmptyState icon={FileText} title="No notes" description="Use “New note” to write your first one." className="py-8" />}
        </aside>
        <div className={cn("flex flex-col p-4 md:p-6", !open && "hidden md:flex")}>
          {open ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <button type="button" onClick={() => setOpenId(null)} aria-label="Back to notes" className="grid size-8 place-items-center rounded-lg hover:bg-secondary md:hidden"><ArrowLeft className="size-4" /></button>
                <p className="flex-1 text-xs text-muted-foreground">Saved · {when(open.updatedAt)}</p>
                <button type="button" onClick={() => remove(open)} aria-label="Delete note" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
              <input autoFocus={!open.title} value={open.title} maxLength={150} onChange={(e) => patch(open.id, { title: e.target.value })} placeholder="Untitled" aria-label="Note title"
                className="bg-transparent font-display text-2xl font-semibold outline-none placeholder:text-muted-foreground/60" />
              <textarea value={open.content} maxLength={50000} onChange={(e) => patch(open.id, { content: e.target.value })} placeholder="Start writing…" aria-label="Note content"
                className="mt-3 min-h-[40vh] flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60" />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={NotebookPen} title="Nothing open" description="Select a note from the list or create a new one." className="w-full max-w-md border-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
