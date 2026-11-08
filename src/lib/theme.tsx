import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePreference = "system" | "light" | "dark";
const KEY = "everyday-os-theme";

/** Runs before paint (inlined in <head>) so the saved/system theme never flashes. */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

type Ctx = { preference: ThemePreference; resolved: "light" | "dark"; setPreference: (p: ThemePreference) => void; toggle: () => void };
const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as ThemePreference | null;
    if (saved === "light" || saved === "dark" || saved === "system") setPref(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const r = preference === "system" ? (mq.matches ? "dark" : "light") : preference;
      document.documentElement.classList.toggle("dark", r === "dark");
      setResolved(r);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [preference]);

  const setPreference = useCallback((p: ThemePreference) => {
    localStorage.setItem(KEY, p);
    setPref(p);
  }, []);
  const toggle = useCallback(() => setPreference(resolved === "dark" ? "light" : "dark"), [resolved, setPreference]);

  return <ThemeContext.Provider value={{ preference, resolved, setPreference, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
