import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, SendHorizonal, Info } from "lucide-react";
import { PageHeader } from "@/components/os/ui";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant — EVERYDAY OS" },
      { name: "description", content: "The EVERYDAY OS assistant chat. AI features arrive in a future update." },
      { property: "og:title", content: "Assistant — EVERYDAY OS" },
      { property: "og:description", content: "The EVERYDAY OS assistant chat. AI features arrive in a future update." },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  return (
    <div className="flex flex-col">
      <PageHeader eyebrow="Assistant" title="Ask anything" description="Your personal assistant for everyday questions and planning." />
      <div className="fade-up flex min-h-[60vh] flex-col overflow-hidden rounded-3xl border bg-card">
        <div className="flex items-center gap-2 border-b bg-secondary/60 px-5 py-3 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0" />
          AI functionality will be added in a later phase. Messaging is not active yet.
        </div>
        <div className="glow flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><Sparkles className="size-6" /></div>
          <h2 className="mt-4 text-lg font-semibold">Your assistant is on the way</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Soon you'll be able to ask questions, summarize notes and plan your day here.</p>
        </div>
        <form className="border-t p-3" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2 rounded-2xl border bg-background p-1.5 pl-4">
            <input disabled placeholder="Messaging available in a future update" aria-label="Message"
              className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed" />
            <button type="submit" disabled aria-label="Send" className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground opacity-40">
              <SendHorizonal className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
