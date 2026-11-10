/** Safe arithmetic evaluator (no eval): supports + - * / % parentheses and decimals. */
export function calculate(expr: string): number {
  const tokens = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "").match(/\d*\.?\d+|[-+*/%()]/g);
  if (!tokens || tokens.join("") !== expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "")) throw new Error("Invalid expression");
  let i = 0;
  const peek = () => tokens[i];
  const expression = (): number => {
    let v = term();
    while (peek() === "+" || peek() === "-") v = tokens[i++] === "+" ? v + term() : v - term();
    return v;
  };
  const term = (): number => {
    let v = factor();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = tokens[i++];
      const r = factor();
      if (op === "*") v *= r;
      else if (op === "/") { if (r === 0) throw new Error("Cannot divide by zero"); v /= r; }
      else v %= r;
    }
    return v;
  };
  const factor = (): number => {
    const t = tokens[i++];
    if (t === "-") return -factor();
    if (t === "+") return factor();
    if (t === "(") { const v = expression(); if (tokens[i++] !== ")") throw new Error("Missing )"); return v; }
    if (t !== undefined && /^\d*\.?\d+$/.test(t)) return parseFloat(t);
    throw new Error("Invalid expression");
  };
  const result = expression();
  if (i !== tokens.length || !Number.isFinite(result)) throw new Error("Invalid expression");
  return Math.round(result * 1e10) / 1e10;
}

export const units = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, t: 1000 },
  temperature: { C: 1, F: 1, K: 1 },
} as const;
export type Category = keyof typeof units;

export function convert(cat: Category, value: number, from: string, to: string): number {
  let r: number;
  if (cat === "temperature") {
    const c = from === "C" ? value : from === "F" ? (value - 32) * 5 / 9 : value - 273.15;
    r = to === "C" ? c : to === "F" ? c * 9 / 5 + 32 : c + 273.15;
  } else {
    const table = units[cat] as Record<string, number>;
    r = (value * table[from]!) / table[to]!;
  }
  return Math.round(r * 1e8) / 1e8;
}

export function textStats(s: string) {
  return { characters: s.length, noSpaces: s.replace(/\s/g, "").length, words: s.trim() ? s.trim().split(/\s+/).length : 0 };
}

export const caseFns = {
  UPPERCASE: (s: string) => s.toUpperCase(),
  lowercase: (s: string) => s.toLowerCase(),
  "Title Case": (s: string) => s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()),
  "Sentence case": (s: string) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (c) => c.toUpperCase()),
};
