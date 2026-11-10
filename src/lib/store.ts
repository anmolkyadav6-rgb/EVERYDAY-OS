import { useSyncExternalStore } from "react";

/** Tiny localStorage-backed collection store shared across pages (SSR-safe). */
function createStore<T>(key: string) {
  let cache: T[] | null = null;
  const listeners = new Set<() => void>();
  const EMPTY: T[] = [];
  const read = (): T[] => {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      cache = Array.isArray(parsed) ? parsed : [];
    } catch {
      cache = [];
    }
    return cache;
  };
  const set = (next: T[]) => {
    cache = next;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage full or blocked */ }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => { if (e.key === key) { cache = null; l(); } };
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
  };
  return {
    get: read,
    set,
    update: (fn: (prev: T[]) => T[]) => set(fn(read())),
    use: () => useSyncExternalStore(subscribe, read, () => EMPTY),
    reset: () => { cache = null; },
  };
}

export type Priority = "low" | "medium" | "high";
export type Task = { id: string; title: string; description: string; due: string; priority: Priority; done: boolean; createdAt: number };
export type Note = { id: string; title: string; content: string; updatedAt: number };

export const taskStore = createStore<Task>("everyday-os:tasks");
export const noteStore = createStore<Note>("everyday-os:notes");

export const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

export type TaskInput = { title: string; description: string; due: string; priority: Priority };
export function validateTask(t: TaskInput): string | null {
  if (!t.title.trim()) return "Title is required.";
  if (t.title.trim().length > 120) return "Title must be 120 characters or fewer.";
  if (t.description.length > 1000) return "Description must be 1000 characters or fewer.";
  if (t.due && !/^\d{4}-\d{2}-\d{2}$/.test(t.due)) return "Due date is invalid.";
  if (!["low", "medium", "high"].includes(t.priority)) return "Choose a priority.";
  return null;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDue(due: string) {
  if (!due) return "";
  const [y, m, d] = due.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
