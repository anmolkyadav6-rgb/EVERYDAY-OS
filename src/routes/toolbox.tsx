import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Ruler, Type, Timer, QrCode, Percent } from "lucide-react";
import { PageHeader, SoonBadge } from "@/components/os/ui";

export const Route = createFileRoute("/toolbox")({
  head: () => ({
    meta: [
      { title: "Toolbox — EVERYDAY OS" },
      { name: "description", content: "Everyday utilities like a calculator, unit converter and text tools." },
      { property: "og:title", content: "Toolbox — EVERYDAY OS" },
      { property: "og:description", content: "Everyday utilities like a calculator, unit converter and text tools." },
    ],
  }),
  component: Toolbox,
});

const groups = [
  { name: "Math", tools: [
    { icon: Calculator, name: "Calculator", desc: "Quick everyday calculations" },
    { icon: Percent, name: "Percentage", desc: "Discounts, tips and changes" },
  ] },
  { name: "Convert", tools: [
    { icon: Ruler, name: "Unit Converter", desc: "Length, weight, temperature and more" },
    { icon: QrCode, name: "QR Generator", desc: "Turn text or links into QR codes" },
  ] },
  { name: "Write & time", tools: [
    { icon: Type, name: "Text Tools", desc: "Word count, case change, cleanup" },
    { icon: Timer, name: "Timer", desc: "Countdown and stopwatch" },
  ] },
];

function Toolbox() {
  return (
    <div>
      <PageHeader eyebrow="Toolbox" title="Everyday tools" description="Small, focused utilities. These tools are being built and will unlock in upcoming phases." />
      <div className="flex flex-col gap-6">
        {groups.map((g) => (
          <section key={g.name} className="fade-up">
            <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.tools.map(({ icon: Icon, name, desc }) => (
                <div key={name} aria-disabled className="flex items-center gap-4 rounded-2xl border bg-card p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"><Icon className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <SoonBadge />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
