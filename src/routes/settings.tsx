import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Sun, Moon, Check, User } from "lucide-react";
import { PageHeader, Panel, SoonBadge } from "@/components/os/ui";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — EVERYDAY OS" },
      { name: "description", content: "Theme preferences, app settings and information for EVERYDAY OS." },
      { property: "og:title", content: "Profile & Settings — EVERYDAY OS" },
      { property: "og:description", content: "Theme preferences, app settings and information for EVERYDAY OS." },
    ],
  }),
  component: SettingsPage,
});

const themes: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function SettingsPage() {
  const { preference, setPreference } = useTheme();
  return (
    <div>
      <PageHeader eyebrow="Profile" title="Profile & settings" />
      <div className="flex flex-col gap-5">
        <Panel>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><User className="size-6" /></span>
            <div>
              <p className="font-semibold">Local profile</p>
              <p className="text-sm text-muted-foreground">Everything stays on this device. No account needed.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Appearance">
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => {
              const active = preference === value;
              return (
                <button key={value} type="button" role="radio" aria-checked={active} onClick={() => setPreference(value)}
                  className={cn("relative flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors", active ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary")}>
                  {active && <Check className="absolute right-2 top-2 size-3.5" />}
                  <Icon className="size-5" />{label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">System follows your device. Your choice is saved on this device.</p>
        </Panel>

        <Panel title="App settings">
          <ul className="divide-y">
            {["Language", "Start of week", "Notifications"].map((s) => (
              <li key={s} className="flex items-center justify-between py-3 text-sm"><span>{s}</span><SoonBadge /></li>
            ))}
          </ul>
        </Panel>

        <Panel title="About">
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">App</dt><dd>EVERYDAY OS</dd>
            <dt className="text-muted-foreground">Version</dt><dd>0.1.0 · Phase 1</dd>
            <dt className="text-muted-foreground">Data</dt><dd>Stored locally only</dd>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
