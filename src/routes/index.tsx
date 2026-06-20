import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Leaf, Truck, ShieldCheck, Sprout } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ProductCard } from "@/components/site/ProductCard";
import { Reviews, StickyReviewBadge } from "@/components/site/Reviews";
import { listCategories, listProducts } from "@/lib/products.functions";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => ({
    categories: await listCategories(),
    bestsellers: await listProducts({ data: { bestsellerOnly: true } }),
  }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grevora — Premium Makhana, Spices & Seeds" },
      { name: "description", content: "Grevora — Savor the Goodness. Premium phool makhana, hand-picked Indian spices and superfood seeds. Free shipping above ₹499." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  errorComponent: ({ error }) => <SiteLayout><div className="container mx-auto p-10 text-center text-destructive">{error.message}</div></SiteLayout>,
  notFoundComponent: () => <SiteLayout><div className="container mx-auto p-10 text-center">Not found</div></SiteLayout>,
  component: Home,
});

const CAT_IMAGES: Record<string, string> = {
  makhana: "/__l5e/assets-v1/6093ee13-0bc1-47a3-b5ee-8df041e262ab/raw-makhana.png",
  spices: "/__l5e/assets-v1/92e76f89-f479-4fc1-a43c-f3f90bd28495/cardamom.jpeg",
  seeds: "/__l5e/assets-v1/bccbc7f5-8fc3-489e-9ef6-6a7ae8aa0651/chia-seeds.png",
};

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  return (
    <SiteLayout>
      <HeroSlider />

      {/* Trust strip */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { icon: Leaf, t: "100% Natural", s: "No preservatives" },
            { icon: Truck, t: "Free Shipping", s: "On orders above ₹499" },
            { icon: ShieldCheck, t: "Authentic", s: "Direct from farms" },
            { icon: Sprout, t: "Superfoods", s: "Nutrient dense" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <f.icon className="h-7 w-7 text-leaf" />
              <div>
                <div className="text-sm font-semibold">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Explore</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Shop by Category</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {data.categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary"
            >
              <img src={CAT_IMAGES[c.slug]} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-white/80 line-clamp-2">{c.description}</p>
                <span className="mt-3 inline-block text-xs uppercase tracking-widest text-accent">Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent">Customer Favourites</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Best Sellers</h2>
            </div>
            <Link to="/shop" className="hidden sm:block text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.bestsellers.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-primary p-10 md:p-16 text-primary-foreground">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent">Our Promise</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">From Trusted Farms, Straight to Your Kitchen</h2>
              <p className="mt-4 text-primary-foreground/85">
                Every batch is hand-picked, lab-tested and packed in small quantities to lock in freshness. No artificial colours, no preservatives — just pure, honest goodness.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {["Hand-picked", "Lab tested", "Small batches", "Eco packaging"].map((x) => (
                <li key={x} className="rounded-xl bg-primary-foreground/10 p-4 backdrop-blur">
                  <div className="text-2xl font-display text-accent">✓</div>
                  <div className="mt-1 font-semibold">{x}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Reviews />
      <StickyReviewBadge />
    </SiteLayout>
  );
}
