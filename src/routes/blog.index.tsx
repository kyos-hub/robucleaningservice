import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CalendarDays,
  ArrowRight,
  Newspaper,
  Sparkles,
  Lightbulb,
  Megaphone,
  Search,
  X,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { posts, categories, type PostCategory } from "@/lib/blog-posts";
import imgExportServices from "@/assets/photos/export-services.jpg";

const heroImg =
  imgExportServices;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & News — Robu Cleaning Services" },
      {
        name: "description",
        content: "Updates, cleaning tips and company news from Robu Cleaning Services.",
      },
      { property: "og:title", content: "Blog & News — Robu Cleaning Services" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const categoryIcon = { News: Megaphone, Tips: Lightbulb } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Filter = "All" | PostCategory;

function Blog() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const featured = posts.find((p) => p.featured);
  const nonFeatured = posts.filter((p) => !p.featured);

  const visible = useMemo(() => {
    let list = filter === "All" ? nonFeatured : nonFeatured.filter((p) => p.category === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, query, nonFeatured]);

  const hasActiveQuery = query.trim().length > 0;

  return (
    <>
      {/* Cinematic hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="h-full w-full object-cover motion-safe:animate-in motion-safe:zoom-in-105 motion-safe:duration-[1600ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="container-page relative py-24 md:py-36">
          <div className="max-w-3xl text-white">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2 text-white/80">
                <Sparkles className="h-3.5 w-3.5" /> Blog & News
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="heading-hero mt-5 text-white">
                Updates from <span className="text-[#F5D061]">Robu Cleaning Services.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
                Company news, service updates, and practical cleaning and hygiene tips from
                our team on the ground.
              </p>
            </Reveal>

            {/* Hero search bar */}
            <Reveal delay={280} className="mt-8 max-w-xl">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/60" />
                <input
                  id="blog-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, e.g. “fumigation tips”"
                  className="h-13 w-full rounded-xl border border-white/20 bg-white/10 py-3.5 pl-11 pr-11 text-sm text-white placeholder:text-white/50 backdrop-blur-md transition-colors focus:border-[#F5D061]/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#F5D061]/30"
                />
                {hasActiveQuery && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured article — hidden while actively searching so results stay focused */}
      {featured && !hasActiveQuery && (
        <section className="border-b border-border">
          <div className="container-page py-16 md:py-24">
            <Reveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Featured
              </span>
            </Reveal>
            <Reveal
              delay={80}
              className="mt-4 grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] lg:grid-cols-2"
            >
              <div className="group relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold leading-snug sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                  </span>
                </div>
                <Link
                  to="/blog/$slug"
                  params={{ slug: featured.slug }}
                  className="group/link mt-6 inline-flex w-fit items-center gap-1.5 font-display text-sm font-semibold text-primary"
                >
                  Read the full story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Visual info cards — hidden while actively searching */}
      {!hasActiveQuery && (
        <section className="border-b border-border bg-muted/40">
          <div className="container-page py-16 md:py-20">
            <SectionHeading
              align="center"
              eyebrow="What you'll find here"
              title="News, tips and behind-the-scenes updates"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Megaphone,
                  title: "Company News",
                  body: "Announcements, milestones and updates on how we operate.",
                },
                {
                  icon: Lightbulb,
                  title: "Practical Tips",
                  body: "Guidance on cleaning, hygiene and safety for your workplace.",
                },
                {
                  icon: Sparkles,
                  title: "Behind the Scenes",
                  body: "How our crews train, prepare and deliver on site.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <Reveal
                  key={title}
                  delay={i * 90}
                  className="rounded-2xl border border-border bg-card p-6 text-center lift-hover hover:border-primary/40"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category filter bar + search results / article grid */}
      <section className="border-b border-border">
        <div className="container-page py-16 md:py-24">
          <SectionHeading
            align="center"
            eyebrow={hasActiveQuery ? "Search results" : "Latest"}
            title={hasActiveQuery ? `Results for “${query.trim()}”` : "More from the blog"}
          />

          {/* Filter pills + inline search (visible once scrolled past hero too) */}
          <Reveal className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Filter
              </span>
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-card p-1.5">
                {(["All", ...categories] as Filter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium font-display transition-colors",
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                className="h-11 w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {hasActiveQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </Reveal>

          {visible.length === 0 ? (
            <Reveal className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {hasActiveQuery
                  ? "No articles match your search. Try a different keyword."
                  : "No posts in this category yet — check back soon."}
              </p>
              {hasActiveQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 rounded-full"
                  onClick={() => setQuery("")}
                >
                  Clear search
                </Button>
              )}
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, i) => {
                const CatIcon = categoryIcon[post.category];
                return (
                  <Reveal
                    key={post.slug}
                    delay={i * 90}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card lift-hover hover:border-primary/40"
                  >
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="relative block aspect-[16/10] overflow-hidden"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                        <CatIcon className="h-3 w-3" /> {post.category}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.date)}
                        </span>
                        <Link
                          to="/blog/$slug"
                          params={{ slug: post.slug }}
                          className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary"
                        >
                          Read more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dark premium CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.2_0.02_256)] to-[oklch(0.32_0.05_258)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#F5D061]/15 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl float-slow" />
        <div className="container-page relative py-20 text-center text-white md:py-24">
          <Reveal>
            <span className="eyebrow text-white/70">Stay in the loop</span>
            <h2 className="heading-section mt-4 text-white">Have a question about your site?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Our team is happy to talk through your cleaning, sanitation or pest control
              needs — no obligation.
            </p>
          </Reveal>
          <Reveal delay={140} className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl px-7 font-display font-semibold transition-transform hover:-translate-y-0.5"
            >
              <Link to="/contact">
                Request a Quote <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
