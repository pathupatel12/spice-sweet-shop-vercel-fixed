import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { listCategories, listProducts } from "@/lib/products.functions";

const catQ = (slug: string) => queryOptions({
  queryKey: ["category", slug],
  queryFn: async () => {
    const [cats, prods] = await Promise.all([
      listCategories(),
      listProducts({ data: { categorySlug: slug } }),
    ]);
    const cat = cats.find((c) => c.slug === slug);
    if (!cat) throw notFound();
    return { cat, prods };
  },
});

export const Route = createFileRoute("/category/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(catQ(params.slug)),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug[0].toUpperCase() + params.slug.slice(1)} — Grevora` },
      { name: "description", content: `Shop premium ${params.slug} at Grevora.` },
    ],
  }),
  errorComponent: ({ error }) => <SiteLayout><div className="container mx-auto p-10 text-destructive">{error.message}</div></SiteLayout>,
  notFoundComponent: () => <SiteLayout><div className="container mx-auto p-10 text-center">Category not found</div></SiteLayout>,
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(catQ(slug));
  return (
    <SiteLayout>
      <div className="bg-secondary/40 border-b border-border">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Collection</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">{data.cat.name}</h1>
          {data.cat.description && (
            <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">{data.cat.description}</p>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.prods.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </SiteLayout>
  );
}