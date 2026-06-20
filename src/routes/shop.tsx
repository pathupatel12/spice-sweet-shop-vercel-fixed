import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/products.functions";

const q = queryOptions({
  queryKey: ["products", "all"],
  queryFn: () => listProducts({ data: {} }),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({ meta: [{ title: "All Products — Grevora" }, { name: "description", content: "Browse all Grevora makhana, spices and seeds." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  errorComponent: ({ error }) => <SiteLayout><div className="container mx-auto p-10 text-destructive">{error.message}</div></SiteLayout>,
  notFoundComponent: () => <SiteLayout><div className="container mx-auto p-10">Not found</div></SiteLayout>,
  component: Shop,
});

function Shop() {
  const { data } = useSuspenseQuery(q);
  const { q: query } = Route.useSearch();
  const filtered = query
    ? data.filter((p) =>
        [p.name, p.short_description ?? "", p.slug].join(" ").toLowerCase().includes(query.toLowerCase()),
      )
    : data;
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-semibold">{query ? `Search: "${query}"` : "All Products"}</h1>
        <p className="mt-2 text-muted-foreground">{filtered.length} premium products</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No products match "{query}". Try a different keyword.
          </div>
        )}
      </div>
    </SiteLayout>
  );
}