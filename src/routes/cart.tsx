import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useCart, formatINR } from "@/lib/cart-context";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Grevora" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove, subtotal } = useCart();
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">Your Cart</h1>
        {lines.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Continue Shopping</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {lines.map((l) => (
                <div key={l.variantId} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <img src={l.image} alt={l.productName} className="h-24 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <Link to="/product/$slug" params={{ slug: l.productSlug }} className="font-semibold hover:text-primary">{l.productName}</Link>
                    <div className="text-xs text-muted-foreground">{l.weightLabel}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(l.variantId, l.qty - 1)} className="px-3 py-1">−</button>
                        <span className="w-8 text-center text-sm">{l.qty}</span>
                        <button onClick={() => setQty(l.variantId, l.qty + 1)} className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => remove(l.variantId)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{formatINR(l.unitPrice * l.qty)}</div>
                    <div className="text-xs text-muted-foreground">{formatINR(l.unitPrice)} each</div>
                  </div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
                {subtotal < 499 && <div className="text-xs text-muted-foreground">Add {formatINR(499 - subtotal)} more for free shipping</div>}
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span className="text-primary">{formatINR(total)}</span></div>
              </div>
              <Link to="/checkout" className="mt-5 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}