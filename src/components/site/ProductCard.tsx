import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { useCart, formatINR } from "@/lib/cart-context";
import type { ProductRow } from "@/lib/products.functions";
import { toast } from "sonner";

export function ProductCard({ p }: { p: ProductRow }) {
  const { add } = useCart();
  const [vIdx, setVIdx] = useState(0);
  const v = p.variants[vIdx];
  if (!v) return null;
  const off = v.compare_at_price_inr && v.compare_at_price_inr > v.price_inr
    ? Math.round(((v.compare_at_price_inr - v.price_inr) / v.compare_at_price_inr) * 100)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="relative block aspect-square overflow-hidden bg-white p-4">
        <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        {off > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-accent px-2 py-1 text-[10px] font-bold uppercase text-accent-foreground">
            {off}% off
          </span>
        )}
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-semibold text-primary-foreground">
          <ShieldCheck className="h-3 w-3" /> Do Not Change Product
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to="/product/$slug" params={{ slug: p.slug }}>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground line-clamp-2 hover:text-primary">
            {p.name}
          </h3>
        </Link>
        {p.short_description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.short_description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1">
          {p.variants.map((vv, i) => (
            <button
              key={vv.id}
              onClick={() => setVIdx(i)}
              className={`rounded-md border px-2 py-1 text-[11px] font-medium transition ${
                i === vIdx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary"
              }`}
            >
              {vv.weight_label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatINR(v.price_inr)}</span>
          {v.compare_at_price_inr && v.compare_at_price_inr > v.price_inr && (
            <span className="text-xs text-muted-foreground line-through">{formatINR(v.compare_at_price_inr)}</span>
          )}
        </div>
        <button
          onClick={() => {
            add({
              variantId: v.id,
              productSlug: p.slug,
              productName: p.name,
              weightLabel: v.weight_label,
              unitPrice: Number(v.price_inr),
              image: p.image_url,
            });
            toast.success(`${p.name} (${v.weight_label}) added to cart`);
          }}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}