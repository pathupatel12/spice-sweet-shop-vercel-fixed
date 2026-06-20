import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type VariantRow = {
  id: string;
  weight_label: string;
  weight_grams: number;
  price_inr: number;
  compare_at_price_inr: number | null;
  stock: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  image_url: string;
  is_bestseller: boolean;
  category: { slug: string; name: string } | null;
  variants: VariantRow[];
};

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("categories")
    .select("id, slug, name, description")
    .order("display_order");
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { categorySlug?: string; bestsellerOnly?: boolean } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb
      .from("products")
      .select(
        "id, slug, name, short_description, long_description, image_url, is_bestseller, category:categories(slug,name), variants:product_variants(id,weight_label,weight_grams,price_inr,compare_at_price_inr,stock)",
      )
      .eq("is_active", true)
      .order("display_order");
    if (data.bestsellerOnly) q = q.eq("is_bestseller", true);
    const { data: rows, error } = await q;
    if (error) throw error;
    let products = (rows ?? []) as unknown as ProductRow[];
    if (data.categorySlug) {
      products = products.filter((p) => p.category?.slug === data.categorySlug);
    }
    products.forEach((p) => {
      p.variants.sort((a, b) => a.weight_grams - b.weight_grams);
    });
    return products;
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("products")
      .select(
        "id, slug, name, short_description, long_description, image_url, is_bestseller, category:categories(slug,name), variants:product_variants(id,weight_label,weight_grams,price_inr,compare_at_price_inr,stock)",
      )
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    const p = row as unknown as ProductRow;
    p.variants.sort((a, b) => a.weight_grams - b.weight_grams);
    return p;
  });