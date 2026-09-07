import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product } from "@/lib/products";
import imgUseProducts from "@/assets/photos/use-products.jpg";

type DbProduct = {
  slug: string;
  name: string;
  description: string | null;
  seasonality: string | null;
  images: string[] | null;
  status: string;
  product_categories: { name: string; slug: string } | null;
};

type DbProductDetail = DbProduct & {
  origin: string | null;
  moq: string | null;
};

export type ProductDetail = Product & {
  origin: string;
  moq: string | null;
  status: string;
  images: string[];
};

function normalizeCategory(name?: string | null): Product["category"] {
  const n = (name ?? "").toLowerCase();
  if (n.includes("fumigation") || n.includes("pest")) return "Pest Control & Fumigation";
  if (n.includes("ground") || n.includes("waste")) return "Grounds & Waste";
  if (n.includes("support") || n.includes("staff")) return "Support Staffing";
  if (n.includes("supply") || n.includes("material")) return "Supplies";
  return "Cleaning";
}

function normalizeAvailability(s?: string | null): Product["availability"] {
  return (s ?? "").toLowerCase().includes("season") ? "Seasonal" : "Year-round";
}

/**
 * Combines the hand-written static catalog with whatever is in Supabase.
 *
 * Previously this hook REPLACED the static list with the DB list once the
 * query resolved. If the `products` table didn't have a row for every
 * static service (or wasn't fully seeded yet), services would visibly
 * disappear a moment after page load — 10 shown while loading, then only
 * however many rows existed in the DB (e.g. 4).
 *
 * Now: DB rows take precedence for any slug they define (so edits made in
 * Supabase still show up), but any static service NOT present in the DB
 * is kept rather than dropped. Nothing disappears.
 */
function mergeProducts(dbProducts: Product[]): Product[] {
  const bySlug = new Map<string, Product>();

  // Start with the static catalog as the baseline.
  for (const p of staticProducts) {
    bySlug.set(p.slug, p);
  }

  // Overlay/extend with DB data — DB wins on conflicts, adds anything new.
  for (const p of dbProducts) {
    bySlug.set(p.slug, p);
  }

  return Array.from(bySlug.values());
}

export function useProducts(): Product[] {
  const { data, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "slug, name, description, seasonality, images, status, product_categories(name, slug)",
        )
        .neq("status", "hidden")
        .order("name");
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
    },
    staleTime: 60_000,
  });

  if (isLoading || !data) return staticProducts;

  const FALLBACK_IMAGE =
    imgUseProducts;

  const dbProducts: Product[] = data.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: normalizeCategory(p.product_categories?.name),
    description: p.description ?? "",
    availability: normalizeAvailability(p.seasonality),
    image:
      p.images?.[0] ||
      staticProducts.find((s) => s.slug === p.slug)?.image ||
      FALLBACK_IMAGE,
  }));

  return mergeProducts(dbProducts);
}

/** Single product for the public detail page. Falls back to the static catalog. */
export function useProductDetail(slug: string) {
  const query = useQuery({
    queryKey: ["public-product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "slug, name, description, origin, moq, seasonality, images, status, product_categories(name, slug)",
        )
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as DbProductDetail | null;
    },
    staleTime: 60_000,
  });

  const fallback = staticProducts.find((p) => p.slug === slug);
  const db = query.data;

  const product: ProductDetail | null = db
    ? {
        slug: db.slug,
        name: db.name,
        category: normalizeCategory(db.product_categories?.name),
        description: db.description ?? fallback?.description ?? "",
        availability: normalizeAvailability(db.seasonality),
        image: db.images?.[0] || fallback?.image || "",
        images: (db.images ?? []).filter(Boolean),
        origin: db.origin ?? "Kenya",
        moq: db.moq,
        status: db.status,
      }
    : fallback
      ? {
          ...fallback,
          images: [fallback.image],
          origin: "Kenya",
          moq: null,
          status: "available",
        }
      : null;

  return { product, isLoading: query.isLoading };
}