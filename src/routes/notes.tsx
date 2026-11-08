import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, FileText } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/os/ui";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — EVERYDAY OS" },
      { name: "description", content: "Capture ideas and keep simple notes in EVERYDAY OS." },
      { property: "og:title", content: "Notes — EVERYDAY OS" },
      { property: "og:description", content: "Capture ideas and keep simple notes in EVERYDAY OS." },
    ],
  }),
  component: Notes,
});

function Notes() {
  return (
    <div>
      <PageHeader eyebrow="Notes" title="Notes" description="A quiet place for thoughts, lists and ideas. Writing notes arrives in the next phase." />
      <div className="fade-up grid min-h-[55vh] overflow-hidden rounded-3xl border bg-card md:grid-cols-[260px_1fr]">
        <aside className="border-b p-4 md:border-b-0 md:border-r">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">All notes · 0</p>
          <EmptyState icon={FileText} title="No notes" description="Your notes list lives here." className="py-8" />
        </aside>
        <div className="flex items-center justify-center p-6">
          <EmptyState icon={NotebookPen} title="Nothing open" description="Select or create a note to start writing. Coming in the next phase." className="w-full max-w-md border-none" />
        </div>
      </div>
    </div>
  );
}
