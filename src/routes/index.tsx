import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Globe2, Sprout, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { useProducts } from "@/hooks/use-products";
import { useSiteContent } from "@/hooks/use-site-content";
import { FaqSection } from "@/components/faq-section";
import { site } from "@/lib/site";
import imgHomeAbout from "@/assets/photos/robu-restroom-tile-cleaning.png";
import imgHomeHero from "@/assets/photos/robu-vehicles-messenger.jpg";

const aboutAsset =
  imgHomeAbout;
const heroAsset =
  imgHomeHero;

const reasons = [
  {
    icon: ShieldCheck,
    title: "Vetted crews",
    body: "Every cleaner and technician has a verified ID, confirmed reference letters and a certificate of good conduct from the C.I.D. before they're sent to a site.",
  },
  {
    icon: Truck,
    title: "Eldoret HQ, Nairobi branch",
    body: "A head office in Eldoret and a branch office in Nairobi let us staff jobs across North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza.",
  },
  {
    icon: Globe2,
    title: "Trained pest control technicians",
    body: "Fumigation is carried out by trained technicians using materials sourced from licensed, reputable suppliers, not a generic spray-and-go.",
  },
  {
    icon: Sprout,
    title: "Growing with our clients since 1997",
    body: "From 3 employees to over 415, serving major banks, hospitals and institutions with schedules and standards agreed per site.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Robu Cleaning Services | Cleaning, Sanitation & Pest Control in Kenya" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const products = useProducts();
  const featured = products.slice(0, 4);
  const { text, image } = useSiteContent();
  const aboutImg = image("home_intro", "image", aboutAsset) ?? aboutAsset;
  const heroImg = image("home_hero", "background_image", heroAsset) ?? heroAsset;
  const heroVideo = image("home_hero", "background_video");
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1F3A]">
        <div className="absolute inset-0">
          {heroVideo ? (
            <video
              key={heroVideo}
              src={heroVideo}
              poster={heroImg}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={heroImg}
              alt="Robu Cleaning Services crew at work"
              className="h-full w-full object-cover"
              width={1600}
              height={900}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/75 to-[#0B1F3A]/20" />
        </div>

        <div className="container-page relative flex min-h-[100svh] sm:min-h-[92vh] flex-col justify-end pb-10 pt-24 sm:pt-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-none border-l-2 border-[color:var(--gold)] pl-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/70">
              {text("home_hero", "eyebrow", "Cleaning · Sanitation · Pest Control")}
            </span>
            <h1 className="mt-4 sm:mt-6 font-display text-[2.1rem] leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem] font-bold">
              {text(
                "home_hero",
                "title",
                "Cleaning and pest control Kenyan facility managers actually rely on.",
              )}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-white/75">
              {text(
                "home_hero",
                "subtitle",
                "Robu Cleaning Services Ltd handles commercial, industrial, institutional and residential cleaning, sanitation, fumigation and pest control across Kenya, from a single site visit to a standing contract.",
              )}
            </p>
            <div className="mt-7 sm:mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 sm:h-12 px-5 sm:px-7 rounded-none bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90 font-display font-semibold tracking-wide"
              >
                <Link to="/services">
                  Our Services <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 sm:h-12 px-5 sm:px-7 rounded-none border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-[#0B1F3A] font-display font-semibold tracking-wide"
              >
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>

          <dl className="relative mt-9 sm:mt-14 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-y-3 border-t border-white/15 pt-4 sm:pt-0">
            {[
              ["Eldoret", "Head office"],
              ["Nairobi", "Branch office"],
              ["1997", "Serving Kenya since"],
            ].map(([k, v], i) => (
              <div
                key={v}
                className={`py-2 sm:py-5 px-1 sm:px-2 ${i !== 0 ? "sm:border-l border-white/15" : ""}`}
              >
                <dt className="font-display text-base sm:text-xl md:text-2xl font-bold text-white">
                  {k}
                </dt>
                <dd className="mt-0.5 font-mono text-[8px] sm:text-[8px] uppercase tracking-[0.2em] text-white/50">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-page py-14 sm:py-20 md:py-28 grid gap-10 sm:gap-14 lg:grid-cols-2 items-center">
          <Reveal
            variant="left"
            className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl order-2 lg:order-1"
          >
            <img
              src={aboutImg}
              alt="Robu Cleaning Services team at work"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal variant="right" delay={120} className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Robu Cleaning Services"
              title="Started in Eldoret in 1997. Now working sites across Kenya."
              description="We handle commercial, industrial, institutional and residential cleaning, sanitation, fumigation and pest control, the kind of work that keeps a facility running without anyone noticing it's happening."
            />
            <ul className="mt-7 sm:mt-8 space-y-3">
              {[
                "Staff vetted with verified ID, references and a C.I.D. certificate of good conduct",
                "Trained pest control and fumigation technicians",
                "Scheduled contracts and one-off jobs, both",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-7 sm:mt-8 h-11 rounded-xl border-2 font-display font-semibold"
            >
              <Link to="/about">
                Learn more <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="border-t border-border">
        <div className="container-page py-14 sm:py-20 md:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
            <SectionHeading
              eyebrow="Our Services"
              title="A few of the things we get called for."
              description="Scoped, staffed and quoted against what your site actually needs, not a fixed package."
            />
            <Button
              asChild
              variant="ghost"
              className="self-start sm:self-auto font-display font-semibold"
            >
              <Link to="/services">
                View all services <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 90}>
                <Link
                  to="/services/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card hover:border-primary/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="font-display text-sm sm:text-lg font-semibold">{p.name}</h3>
                    <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                    <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Learn more{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-page py-14 sm:py-20 md:py-28">
          <SectionHeading
            align="center"
            eyebrow="Why Clients Stay"
            title="What actually matters once the contract starts."
          />
          <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 90}
                className="rounded-2xl border border-border bg-card p-6 sm:p-7 hover:border-primary/40"
              >
                <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 sm:mt-5 font-display text-base sm:text-lg font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="border-t border-border">
        <div className="container-page py-14 sm:py-20 md:py-28 grid gap-10 sm:gap-16 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <SectionHeading
              eyebrow="Where We Work"
              title="Head office in Eldoret. Branch in Nairobi."
              description="We serve clients across North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions. Tell us your site location and we'll confirm scheduling."
            />
            <div className="mt-7 sm:mt-8 grid grid-cols-2 gap-3 max-w-md">
              {["Eldoret (HQ)", "Nairobi", "Mombasa", "Enquire about your area"].map((m) => (
                <div
                  key={m}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-primary/40"
                >
                  <Globe2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-display font-semibold text-sm">{m}</span>
                </div>
              ))}
            </div>
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4" /> Call the office to check your area
            </a>
          </div>

          <Reveal
            variant="scale"
            delay={120}
            className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-[var(--shadow-elevated)] aspect-[4/3] sm:aspect-[16/11]"
          >
            <iframe
              title="Robu Cleaning Services"
              src="https://www.google.com/maps?q=Eldoret,Kenya&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-page py-12 sm:py-16 md:py-20">
          <div className="rounded-2xl sm:rounded-3xl bg-[oklch(0.24_0.06_256)] px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20 text-center">
            <span className="inline-block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/50">
              Robu Cleaning Services
            </span>
            <h2 className="heading-section mt-3 text-white">Need a quote for your site?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-white/75">
              Tell us the size of the site, how often you need us there, and what you're dealing
              with. We'll get back to you with a number, not a sales call.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 sm:mt-8 h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90 font-display font-semibold"
            >
              <Link to="/contact">
                Request a Quote <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}