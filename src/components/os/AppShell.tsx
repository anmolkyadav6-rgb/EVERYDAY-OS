import { Link } from "@tanstack/react-router";
import { Moon, Sun, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { mainNav } from "@/lib/nav";
import { useTheme } from "@/lib/theme";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-foreground text-background">
        <span className="font-display text-sm font-bold">E</span>
      </span>
      <span className="font-display text-[13px] font-semibold tracking-[0.14em]">EVERYDAY<span className="text-primary"> OS</span></span>
    </Link>
  );
}

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
      className="grid size-9 place-items-center rounded-xl border bg-card text-foreground transition-colors hover:bg-secondary">
      {resolved === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-sidebar px-4 py-5 md:flex">
        <div className="px-2"><Logo /></div>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
          {mainNav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground">
              <Icon className="size-[18px]" />{label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto px-3 text-xs text-muted-foreground">Phase 1 · v0.1.0</p>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-8">
          <div className="md:hidden"><Logo /></div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/settings" aria-label="Profile and settings"
              className="grid size-9 place-items-center rounded-xl border bg-card transition-colors hover:bg-secondary data-[status=active]:border-primary data-[status=active]:text-primary">
              <Settings className="size-4" />
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5">
          {mainNav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="group flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-foreground">
              <span className="grid h-7 w-12 place-items-center rounded-full transition-colors group-data-[status=active]:bg-accent group-data-[status=active]:text-accent-foreground">
                <Icon className="size-[18px]" />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
