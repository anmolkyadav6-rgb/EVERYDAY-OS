import { Home, Sparkles, CalendarCheck, NotebookPen, Wrench, Settings, type LucideIcon } from "lucide-react";

export type NavItem = { to: "/" | "/assistant" | "/planner" | "/notes" | "/toolbox" | "/settings"; label: string; icon: LucideIcon; description: string };

export const mainNav: NavItem[] = [
  { to: "/", label: "Home", icon: Home, description: "Your daily overview" },
  { to: "/assistant", label: "Assistant", icon: Sparkles, description: "Chat with your assistant" },
  { to: "/planner", label: "Planner", icon: CalendarCheck, description: "Tasks and schedule" },
  { to: "/notes", label: "Notes", icon: NotebookPen, description: "Capture ideas" },
  { to: "/toolbox", label: "Toolbox", icon: Wrench, description: "Everyday utilities" },
];

export const settingsNav: NavItem = { to: "/settings", label: "Settings", icon: Settings, description: "Theme, preferences and app info" };
