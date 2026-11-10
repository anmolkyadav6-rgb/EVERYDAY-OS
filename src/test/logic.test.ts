import { describe, expect, it } from "vitest";
import { calculate, convert, textStats, caseFns } from "@/lib/tools";
import { validateTask } from "@/lib/store";

describe("tools", () => {
  it("calculates with precedence", () => expect(calculate("2+3*4")).toBe(14));
  it("handles decimals and parens", () => expect(calculate("(0.1+0.2)*10")).toBe(3));
  it("rejects divide by zero", () => expect(() => calculate("5/0")).toThrow());
  it("rejects garbage", () => expect(() => calculate("2+abc")).toThrow());
  it("converts km to mi", () => expect(convert("length", 1, "km", "mi")).toBeCloseTo(0.62137, 4));
  it("converts lb to kg", () => expect(convert("weight", 1, "lb", "kg")).toBeCloseTo(0.45359, 4));
  it("converts 100C to 212F", () => expect(convert("temperature", 100, "C", "F")).toBe(212));
  it("converts 0K to C", () => expect(convert("temperature", 0, "K", "C")).toBe(-273.15));
  it("counts words", () => expect(textStats("  hello   big world ").words).toBe(3));
  it("title cases", () => expect(caseFns["Title Case"]("hello WORLD")).toBe("Hello World"));
});

describe("task validation", () => {
  const base = { title: "Buy milk", description: "", due: "", priority: "medium" as const };
  it("requires a title", () => expect(validateTask({ ...base, title: "   " })).not.toBeNull());
  it("accepts a valid task", () => expect(validateTask(base)).toBeNull());
});
