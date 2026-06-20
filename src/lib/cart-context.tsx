import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  variantId: string;
  productSlug: string;
  productName: string;
  weightLabel: string;
  unitPrice: number;
  image: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "gfd_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartCtx>(() => ({
    lines,
    add: (line, qty = 1) =>
      setLines((prev) => {
        const i = prev.findIndex((p) => p.variantId === line.variantId);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { ...line, qty }];
      }),
    remove: (id) => setLines((p) => p.filter((l) => l.variantId !== id)),
    setQty: (id, qty) =>
      setLines((p) => (qty <= 0 ? p.filter((l) => l.variantId !== id) : p.map((l) => (l.variantId === id ? { ...l, qty } : l)))),
    clear: () => setLines([]),
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.qty * l.unitPrice, 0),
  }), [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}