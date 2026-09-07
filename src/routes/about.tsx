import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import imgUseProducts from "@/assets/photos/use-products.jpg";
import imgExportServices2 from "@/assets/photos/export-services-2.jpg";

const aboutAsset = imgExportServices2;
const heroImg = imgUseProducts;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Robu Cleaning Services" },
      { name: "description", content: "Robu Cleaning Services Ltd, registered in 1997, delivers professional cleaning, sanitation, fumigation and pest control services to clients across Kenya through trained crews and dependable service standards." },
      { property: "og:title", content: "About — Robu Cleaning Services" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Why we exist", body: "Facilities get inspected, audited, and complained about when cleaning and pest control fall short. Our job is to make sure that's never the reason a client has a bad week." },
  { icon: Eye, title: "Where we're headed", body: "Continued growth of our branch network and standing contracts, and a name that comes up first when a facility manager in Kenya needs someone reliable — not just available." },
  { icon: Heart, title: "How we operate", body: "Crews show up on schedule and do the job the way it was scoped with the client — floor cleaning, dusting, windows, grounds and more, in that order." },
  { icon: Sprout, title: "What we've built", body: "Over 415 trained staff, a dedicated in-house training unit at our Eldoret head office, and enough structure behind the scenes to hold up contracts with major banks, hospitals and institutions, not just one-off jobs." },
];

function About() {
  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20" />
        </div>
        <div className="relative container-page py-16 sm:py-20 md:py-28 max-w-3xl text-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          <span className="eyebrow text-white/80">About us</span>
          <h1 className="heading-hero mt-4 sm:mt-5 text-white">
            Started in Eldoret in 1997.<br />
            <span className="text-[#F5D061]">Still answering our own phones.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
            <strong>Robu Cleaning Services Ltd</strong> handles commercial, industrial, institutional and
            residential cleaning, sanitation, fumigation and pest control across Kenya — from a single
            site visit to a multi-year facility contract.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-14 sm:py-20 md:py-24 grid gap-10 lg:gap-14 lg:grid-cols-[1.1fr_1fr] items-center">
          <Reveal variant="left">
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">Not the biggest name in cleaning. Just one that doesn't cut corners.</h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We run this from a head office in Eldoret with a branch team in Nairobi — close enough
              to a site to actually turn up when something goes wrong, not just when it's convenient.
              Every job gets a survey, a scope, trained crews, and a sign-off, in that order.
            </p>
          </Reveal>
          <Reveal variant="right" delay={100} className="aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl">
            <img src={aboutAsset} alt="Robu Cleaning Services team at work" loading="lazy" width={1400} height={1000} className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-14 sm:py-20 md:py-28">
          <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1fr_1.5fr]">
            <Reveal variant="left">
              <SectionHeading eyebrow="Our story" title="From three employees in Eldoret to a regional footprint." />
            </Reveal>
            <Reveal variant="right" delay={100} className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                Robu Cleaning Services was registered in February 1997 and incorporated in 2009. We
                started with a workforce of three people — today we're over 415 strong, serving major
                banks, commercial buildings, learning institutions, public and private hospitals,
                religious institutions and private homes across North Rift, South Rift, Central Rift,
                Western, Nairobi, Mombasa and Nyanza.
              </p>
              <p>
                What hasn't changed is the structure underneath it: careful staff vetting, documented
                job schedules agreed with each client, and continuous in-house training run from a
                fully equipped unit at our Eldoret head office.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-16 sm:py-20 md:py-28">
          <SectionHeading align="center" eyebrow="What we stand for" title="The short version of how we run this." />
          <div className="mt-12 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100} className="rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="grid h-11 w-11 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-16 sm:py-20 md:py-24 text-center">
          <Reveal variant="scale">
            <SectionHeading align="center" eyebrow="Work with us" title="Got a site that needs sorting out?" />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-7 rounded-xl font-display font-semibold">
                <Link to="/contact">Request a quote <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 rounded-xl font-display font-semibold">
                <Link to="/export-services">Corporate contracts <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}