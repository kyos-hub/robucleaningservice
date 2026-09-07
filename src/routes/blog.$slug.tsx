import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Megaphone, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Robu Cleaning Services` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: `${loaderData.title} — Robu Cleaning Services` },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:image", content: loaderData.image },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: BlogPost,
});

const categoryIcon = { News: Megaphone, Tips: Lightbulb } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

function BlogPost() {
  const post = Route.useLoaderData();
  const related = getRelatedPosts(post.slug);
  const CatIcon = categoryIcon[post.category];

  return (
    <>
      {/* Cinematic article hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
        </div>
        <div className="container-page relative flex min-h-[420px] flex-col justify-end py-14 md:min-h-[520px] md:py-20">
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog & News
            </Link>
          </Reveal>
          <Reveal delay={80} className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              <CatIcon className="h-3 w-3" /> {post.category}
            </span>
            <h1 className="heading-hero mt-4 text-white">{post.title}</h1>
          </Reveal>
          <Reveal delay={150} className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readMinutes} min read
            </span>
          </Reveal>
        </div>
      </section>

      {/* Article body */}
      <section className="border-b border-border">
        <div className="container-page py-16 md:py-20">
          <div className="mx-auto max-w-2xl">
            <Reveal className="text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </Reveal>
            <div className="mt-8 space-y-6">
              {post.body.map((paragraph, i) => (
                <Reveal key={i} delay={i * 60} as="p" className="leading-relaxed text-foreground/90">
                  {paragraph}
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="mt-12 rounded-2xl border border-border bg-muted/40 p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Have a question about your own site, or want a quote for a similar service?{" "}
                <Link to="/contact" className="font-semibold text-primary hover:underline">
                  Get in touch with our team
                </Link>{" "}
                — we're happy to help.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-b border-border bg-muted/40">
          <div className="container-page py-16 md:py-20">
            <Reveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Keep reading
              </span>
            </Reveal>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((r, i) => {
                const RCatIcon = categoryIcon[r.category];
                return (
                  <Reveal
                    key={r.slug}
                    delay={i * 90}
                    className="group flex overflow-hidden rounded-2xl border border-border bg-card lift-hover hover:border-primary/40"
                  >
                    <div className="relative w-36 shrink-0 overflow-hidden sm:w-44">
                      <img
                        src={r.image}
                        alt={r.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5">
                      <span className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        <RCatIcon className="h-3 w-3" /> {r.category}
                      </span>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: r.slug }}
                        className="mt-1.5 font-display text-sm font-semibold leading-snug hover:text-primary"
                      >
                        {r.title}
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.38_0.18_256)] to-[oklch(0.5_0.22_258)]">
        <div className="container-page relative py-16 text-center text-white md:py-20">
          <Reveal>
            <h2 className="heading-section text-white">Ready to schedule a service?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Tell us your site, service type and frequency — our team will follow up with
              next steps.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <Button asChild size="lg" variant="secondary" className="h-12 rounded-xl px-7 font-display font-semibold transition-transform hover:-translate-y-0.5">
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
