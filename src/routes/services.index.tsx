import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { serviceCategories } from "@/lib/products";
import { useProducts } from "@/hooks/use-products";
import { useSiteContent } from "@/hooks/use-site-content";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

const heroImg =
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our Services — Robu Cleaning Services Ltd" },
      {
        name: "description",
        content:
          "Cleaning, pest control & fumigation, sanitary services, ground maintenance, garbage collection, messengerial and tea making services across Kenya.",
      },
      { property: "og:title", content: "Our Services — Robu Cleaning Services Ltd" },
      {
        property: "og:description",
        content:
          "The full range of services Robu Cleaning Services Ltd delivers to banks, hospitals, institutions and homes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Products,
});

function Products() {
  const products = useProducts();
  const { text } = useSiteContent();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof serviceCategories)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchQ =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat, products]);

  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
        </div>
        <div className="relative container-page py-20 md:py-28 text-white">
          <div className="max-w-3xl">
            <span className="eyebrow text-white/80">
              {text("products_hero", "eyebrow", "Range of Services")}
            </span>
            <h1 className="heading-hero mt-5 text-white">
              {text(
                "products_hero",
                "title",
                "Trained crews. Written standards. Daily supervision.",
              )}
            </h1>
            <p className="mt-5 text-lg text-white/90 leading-relaxed">
              {text(
                "products_hero",
                "subtitle",
                "From daily contract cleaning to fumigation, sanitary services, grounds and support staffing — every job is surveyed, scoped and priced against what your site actually needs, the same way we've worked since 1997.",
              )}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 rounded-xl font-display font-semibold">
                <Link to="/contact" hash="quote">
                  Request a Quote
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-6 rounded-xl font-display font-semibold bg-white/10 text-white border-white/40 hover:bg-white hover:text-foreground"
              >
                <Link to="/export-services">Corporate contracts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-8 md:py-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
              className="pl-10 h-11 rounded-xl bg-background"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium font-display transition-colors border",
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/70 border-border hover:text-foreground hover:border-primary/40",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-16 md:py-20">
          <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
            {filtered.length === products.length
              ? `${products.length} services`
              : `${filtered.length} of ${products.length} services match`}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
              <p>
                No services match "{query}" in {cat === "All" ? "any category" : cat}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCat("All");
                }}
                className="mt-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {filtered.map((p, i) => (
                <Reveal
                  key={p.slug}
                  as="article"
                  delay={(i % 4) * 90}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card lift-hover shine-hover hover:border-primary/40"
                >
                  <Link
                    to="/services/$slug"
                    params={{ slug: p.slug }}
                    className="relative block aspect-[4/3] overflow-hidden bg-muted"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                      {p.category}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-gradient-to-t from-black/80 to-transparent py-3 text-xs font-semibold text-white transition-transform duration-500 group-hover:translate-y-0">
                      View details
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h2 className="font-display text-base font-bold leading-tight sm:text-lg">
                      <Link
                        to="/services/$slug"
                        params={{ slug: p.slug }}
                        className="underline-grow hover:text-primary"
                      >
                        {p.name}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {p.description}
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        asChild
                        size="sm"
                        className="h-9 rounded-lg font-display text-xs font-semibold px-2 transition-transform hover:-translate-y-0.5"
                      >
                        <Link to="/services/$slug" params={{ slug: p.slug }}>
                          <Eye className="mr-1.5 h-3.5 w-3.5 shrink-0" /> View Details
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-lg font-display text-xs font-semibold px-2 transition-transform hover:-translate-y-0.5"
                      >
                        <Link
                          to="/contact"
                          search={{
                            product: p.name,
                            category: p.category,
                          }}
                          hash="quote"
                        >
                          Get a Quote <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}