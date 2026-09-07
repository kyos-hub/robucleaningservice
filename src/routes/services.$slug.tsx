import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Phone,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, getRelatedServices, type Service } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import imgUseProducts from "@/assets/photos/use-products.jpg";

/**
 * Builds a full Service object from a Supabase products row for slugs that
 * only exist in the DB (i.e. not in the static services[] array in
 * lib/products.ts). This is what was missing before: the loader used to
 * ONLY check the static array, so any DB only product 404'd when clicked.
 */
function serviceFromDbRow(row: {
  slug: string;
  name: string;
  description: string | null;
  origin: string | null;
  moq: string | null;
  seasonality: string | null;
  images: string[] | null;
  status: string;
  product_categories: { name: string; slug: string } | null;
}): Service {
  const categoryName = row.product_categories?.name ?? "Cleaning";
  const image = row.images?.[0] || imgUseProducts;

  const category = normalizeCategory(categoryName);

  return {
    slug: row.slug,
    name: row.name,
    category,
    tagline: row.description
      ? row.description.slice(0, 140)
      : "Delivered by Robu Cleaning Services Ltd.",
    description: row.description ?? "Details for this service are being finalised.",
    image,
    includes: [],
    idealFor: [],
    process: [],
    schedule: "Contact us for scheduling details",
    coverage: "North Rift, South Rift, Central Rift, Western, Nyanza, Nairobi and Mombasa regions",
    availability: (row.seasonality ?? "").toLowerCase().includes("season")
      ? "Seasonal"
      : "Year-round",
  };
}

function normalizeCategory(name?: string | null): Service["category"] {
  const n = (name ?? "").toLowerCase();
  if (n.includes("fumigation") || n.includes("pest")) return "Pest Control & Fumigation";
  if (n.includes("ground") || n.includes("waste")) return "Grounds & Waste";
  if (n.includes("support") || n.includes("staff")) return "Support Staffing";
  if (n.includes("supply") || n.includes("material")) return "Supplies";
  return "Cleaning";
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    // 1. Try the static, hand-written catalog first (richest content).
    const staticService = getServiceBySlug(params.slug);

    // 2. Always check the DB too, for status ("hidden") and as a fallback
    //    source of truth when the slug only exists in Supabase.
    const { data: product, error } = await supabase
      .from("products")
      .select(
        "slug, name, description, origin, moq, seasonality, images, status, product_categories(name, slug)",
      )
      .eq("slug", params.slug)
      .maybeSingle();

    if (error) throw error;
    if (product?.status === "hidden") throw notFound();

    if (staticService) {
      return staticService;
    }

    if (product) {
      // DB only product: build a Service object from it instead of 404ing.
      return serviceFromDbRow(product as any);
    }

    // Not found in either source.
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found | Robu Cleaning Services Ltd" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} | Robu Cleaning Services Ltd`;
    const description = loaderData.tagline;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServiceDetailPage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Service not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This service may have been renamed or removed.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/services">Back to services</Link>
      </Button>
    </div>
  );
}

function ServiceDetailPage() {
  const service = Route.useLoaderData();
  const related = getRelatedServices(service.slug);

  const specs = [
    { icon: MapPin, label: "Coverage", value: service.coverage },
    { icon: CalendarDays, label: "Schedule", value: service.schedule },
    { icon: Sparkles, label: "Category", value: service.category },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
        <div className="container-page flex items-center gap-2 py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/services" className="hover:text-primary">
            Services
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-foreground">{service.name}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={service.image} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/25" />
        </div>
        <div className="container-page relative flex min-h-[380px] flex-col justify-end py-14 text-white md:min-h-[460px]">
          <Reveal>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All
              services
            </Link>
            <span className="eyebrow mt-5 block text-white/75">{service.category}</span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {service.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <p className="leading-relaxed text-muted-foreground">{service.description}</p>
            </Reveal>

            {service.includes.length > 0 && (
              <Reveal delay={80} className="mt-10">
                <h2 className="font-display text-xl font-bold">What the service includes</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-2xl border border-border bg-card p-4 text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {service.process.length > 0 && (
              <Reveal delay={120} className="mt-10">
                <h2 className="font-display text-xl font-bold">How we run the job</h2>
                <ol className="mt-5 space-y-4">
                  {service.process.map((step, i) => (
                    <li
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            {service.idealFor.length > 0 && (
              <Reveal delay={160} className="mt-10">
                <h2 className="font-display text-xl font-bold">Ideal for</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.idealFor.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-2 text-xs font-medium text-muted-foreground"
                    >
                      <Building2 className="h-3.5 w-3.5 text-primary" /> {f}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal
              variant="right"
              className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-soft)]"
            >
              <dl className="grid gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border p-4">
                    <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 font-display text-lg font-bold text-primary">
                Price: request a quote
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We survey the site first, then price against what it actually needs.
              </p>

              <div className="mt-5 grid gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl font-display font-semibold">
                  <Link
                    to="/contact"
                    search={{ service: service.name, category: service.category }}
                    hash="quote"
                  >
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl font-display font-semibold"
                >
                  <a href={site.phoneHref}>
                    <Phone className="mr-2 h-4 w-4" /> {site.phone}
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Delivered by <strong className="text-foreground">{site.legalName}</strong>
              </p>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="container-page py-14">
            <h2 className="font-display text-xl font-bold">Other services</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((s, i) => (
                <Reveal key={s.slug} delay={i * 80}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card lift-hover hover:border-primary/40"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={s.image}
                        alt={s.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="truncate font-display text-sm font-semibold">{s.name}</h3>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{s.category}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}