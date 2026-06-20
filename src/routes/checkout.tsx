import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useCart, formatINR } from "@/lib/cart-context";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Grevora" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">Checkout</h1>
        {lines.length === 0 ? (
          <p className="mt-6 text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-primary underline">Continue shopping</Link></p>
        ) : (
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Razorpay payment integration is ready to wire. To activate live checkout, add your Razorpay <b>Key ID</b> and <b>Key Secret</b> from your Razorpay dashboard. Once added, this page will open the Razorpay checkout pop-up.
            </p>
            <div className="mt-6 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
              <div className="mt-2 flex justify-between text-lg font-semibold"><span>Total</span><span className="text-primary">{formatINR(total)}</span></div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}