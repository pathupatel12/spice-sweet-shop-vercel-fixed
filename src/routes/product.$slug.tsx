import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShoppingCart, ShieldCheck, Truck, Leaf } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { getProduct } from "@/lib/products.functions";
import { useCart, formatINR } from "@/lib/cart-context";
import { toast } from "sonner";

const q = (slug: string) => queryOptions({
  queryKey: ["product", slug],
  queryFn: async () => {
    const p = await getProduct({ data: { slug } });
    if (!p) throw notFound();
    return p;
  },
});

export const Route = createFileRoute("/product/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(q(params.slug)),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Product"} — Grevora` },
      { name: "description", content: loaderData?.short_description ?? "Premium product" },
      { property: "og:image", content: loaderData?.image_url ?? "" },
    ],
  }),
  errorComponent: ({ error }) => <SiteLayout><div className="container mx-auto p-10 text-destructive">{error.message}</div></SiteLayout>,
  notFoundComponent: () => <SiteLayout><div className="container mx-auto p-10 text-center">Product not found.<div className="mt-4"><Link to="/shop" className="text-primary underline">Back to shop</Link></div></div></SiteLayout>,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(q(slug));
  const { add } = useCart();
  const [vIdx, setVIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const v = p.variants[vIdx];

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link>
          {p.category && <> / <Link to="/category/$slug" params={{ slug: p.category.slug }} className="hover:text-primary">{p.category.name}</Link></>}
          {" / "}<span>{p.name}</span>
        </nav>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-secondary aspect-square">
            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-accent">{p.category?.name}</div>
            <h1 className="mt-2 font-display text-4xl font-semibold">{p.name}</h1>
            <p className="mt-3 text-muted-foreground">{p.short_description}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" /> Do Not Change Product · Authentic Grevora
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold">Select weight</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.variants.map((vv, i) => (
                  <button
                    key={vv.id}
                    onClick={() => setVIdx(i)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      i === vIdx ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    }`}
                  >
                    {vv.weight_label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">{formatINR(v.price_inr)}</span>
              {v.compare_at_price_inr && v.compare_at_price_inr > v.price_inr && (
                <span className="text-base text-muted-foreground line-through">{formatINR(v.compare_at_price_inr)}</span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
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
                  }, qty);
                  toast.success(`${p.name} (${v.weight_label}) × ${qty} added to cart`);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-xs">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-leaf" /> Free shipping ₹499+</div>
              <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-leaf" /> 100% Natural</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-leaf" /> Quality assured</div>
            </div>

            {p.long_description && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold">About this product</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.long_description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}