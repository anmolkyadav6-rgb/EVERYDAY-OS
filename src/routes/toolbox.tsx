import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, Timer, QrCode, Percent, ArrowLeftRight, Copy } from "lucide-react";
import { PageHeader, Panel, SoonBadge } from "@/components/os/ui";
import { cn } from "@/lib/utils";
import { calculate, caseFns, convert, textStats, units, type Category } from "@/lib/tools";

export const Route = createFileRoute("/toolbox")({
  head: () => ({
    meta: [
      { title: "Toolbox — EVERYDAY OS" },
      { name: "description", content: "Everyday utilities: a calculator, unit converter and text tools." },
      { property: "og:title", content: "Toolbox — EVERYDAY OS" },
      { property: "og:description", content: "Everyday utilities: a calculator, unit converter and text tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Toolbox,
});

const field = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function CalculatorTool() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState<string>("");
  const [err, setErr] = useState(false);
  const keys = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "⌫", "="];
  const press = (k: string) => {
    setErr(false);
    if (k === "C") { setExpr(""); setOut(""); return; }
    if (k === "⌫") return setExpr((e) => e.slice(0, -1));
    if (k === "=") {
      if (!expr) return;
      try { const r = String(calculate(expr)); setOut(r); setExpr(r); }
      catch (e) { setErr(true); setOut(e instanceof Error && e.message.includes("zero") ? "Cannot divide by zero" : "Invalid expression"); }
      return;
    }
    setExpr((e) => (e + k).slice(0, 60));
  };
  return (
    <Panel title="Calculator">
      <div className="mb-3 rounded-xl bg-secondary px-4 py-3 text-right">
        <p aria-label="Expression" className="min-h-5 break-all text-sm text-muted-foreground">{expr || "0"}</p>
        <p aria-live="polite" data-testid="calc-result" className={cn("font-display text-2xl font-semibold", err && "text-base text-destructive")}>{out || "\u00a0"}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button key={k} type="button" onClick={() => press(k)} aria-label={k === "⌫" ? "Backspace" : k === "C" ? "Clear" : k}
            className={cn("h-11 rounded-xl border text-sm font-semibold transition-colors", k === "=" ? "bg-primary text-primary-foreground hover:opacity-90" : /[÷×+\-()]/.test(k) ? "bg-accent text-accent-foreground hover:opacity-90" : "bg-card hover:bg-secondary")}>{k}</button>
        ))}
      </div>
    </Panel>
  );
}

const defaults: Record<Category, [string, string]> = { length: ["km", "mi"], weight: ["kg", "lb"], temperature: ["C", "F"] };
function ConverterTool() {
  const [cat, setCat] = useState<Category>("length");
  const [[from, to], setPair] = useState(defaults.length);
  const [val, setVal] = useState("1");
  const n = Number(val);
  const valid = val.trim() !== "" && Number.isFinite(n);
  const opts = Object.keys(units[cat]);
  const label = (u: string) => (cat === "temperature" ? `°${u}`.replace("°K", "K") : u);
  return (
    <Panel title="Unit converter">
      <div className="mb-3 flex gap-1 rounded-xl bg-secondary p-1">
        {(Object.keys(units) as Category[]).map((c) => (
          <button key={c} type="button" onClick={() => { setCat(c); setPair(defaults[c]); }} aria-pressed={cat === c}
            className={cn("flex-1 rounded-lg px-2 py-1.5 text-xs font-medium capitalize", cat === c ? "bg-card shadow-sm" : "text-muted-foreground")}>{c}</button>
        ))}
      </div>
      <input inputMode="decimal" aria-label="Value to convert" value={val} onChange={(e) => setVal(e.target.value)} className={field} />
      {!valid && <p role="alert" className="mt-1 text-xs text-destructive">Enter a valid number.</p>}
      <div className="mt-3 flex items-center gap-2">
        <select aria-label="From unit" value={from} onChange={(e) => setPair([e.target.value, to])} className={field}>{opts.map((u) => <option key={u} value={u}>{label(u)}</option>)}</select>
        <button type="button" aria-label="Swap units" onClick={() => setPair([to, from])} className="grid size-10 shrink-0 place-items-center rounded-xl border hover:bg-secondary"><ArrowLeftRight className="size-4" /></button>
        <select aria-label="To unit" value={to} onChange={(e) => setPair([from, e.target.value])} className={field}>{opts.map((u) => <option key={u} value={u}>{label(u)}</option>)}</select>
      </div>
      <p data-testid="convert-result" className="mt-4 rounded-xl bg-secondary px-4 py-3 font-display text-xl font-semibold">
        {valid ? `${convert(cat, n, from, to).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${label(to)}` : "—"}
      </p>
    </Panel>
  );
}

function TextTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const s = textStats(text);
  return (
    <Panel title="Text tools" className="md:col-span-2">
      <textarea aria-label="Text to analyse" rows={5} value={text} onChange={(e) => { setText(e.target.value); setCopied(false); }} placeholder="Type or paste text here…" className={cn(field, "resize-y")} />
      <dl className="mt-3 grid grid-cols-3 gap-3">
        {([["Characters", s.characters], ["No spaces", s.noSpaces], ["Words", s.words]] as const).map(([k, v]) => (
          <div key={k} className="rounded-xl bg-secondary p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-display text-xl font-semibold">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(caseFns) as (keyof typeof caseFns)[]).map((k) => (
          <button key={k} type="button" disabled={!text} onClick={() => setText(caseFns[k](text))} className="rounded-xl border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-50">{k}</button>
        ))}
        <button type="button" disabled={!text} onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})} className="ml-auto inline-flex items-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-50"><Copy className="size-3.5" />{copied ? "Copied" : "Copy"}</button>
        <button type="button" disabled={!text} onClick={() => setText("")} className="rounded-xl border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-50">Clear</button>
      </div>
    </Panel>
  );
}

const soon = [
  { icon: Percent, name: "Percentage", desc: "Discounts, tips and changes" },
  { icon: QrCode, name: "QR Generator", desc: "Turn text or links into QR codes" },
  { icon: Timer, name: "Timer", desc: "Countdown and stopwatch" },
];

function Toolbox() {
  return (
    <div>
      <PageHeader eyebrow="Toolbox" title="Everyday tools" description="Small, focused utilities that work right in your browser." />
      <div className="grid gap-5 md:grid-cols-2">
        <CalculatorTool />
        <ConverterTool />
        <TextTool />
      </div>
      <section className="fade-up mt-8">
        <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">More tools later</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {soon.map(({ icon: Icon, name, desc }) => (
            <div key={name} aria-disabled className="flex items-center gap-4 rounded-2xl border bg-card p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"><Icon className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{name}</p><p className="truncate text-xs text-muted-foreground">{desc}</p></div>
              <SoonBadge />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
