import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, Handshake, ClipboardCheck, Layers, Package, Tag, FileText, Ship,
  Route as RouteIcon, ArrowRight, Phone, ShieldCheck, Globe2, Users,
  Sprout, Boxes, CheckCircle2, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import imgExportServices from "@/assets/photos/export-services.jpg";
import imgExportServices2 from "@/assets/photos/export-services-2.jpg";

const heroImg = imgExportServices;
const packhouseImg = imgExportServices2;

export const Route = createFileRoute("/corporate-contracts")({
  head: () => ({
    meta: [
      { title: "Corporate Contracts | Robu Cleaning Services" },
      {
        name: "description",
        content:
          "Coordinated corporate cleaning contracts. Site assessment, crew scheduling, daily inspections, documentation and ongoing facility maintenance for organizations across Kenya.",
      },
      { property: "og:title", content: "Corporate Contracts | Robu Cleaning Services" },
      {
        property: "og:description",
        content:
          "From site survey to sign off. Scheduling, staffing and quality support designed around the requirements of corporate clients.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/corporate-contracts" },
    ],
    links: [{ rel: "canonical", href: "/corporate-contracts" }],
  }),
  component: Services,
});

const pillars = [
  {
    tag: "Site Assessment & Planning",
    icon: Sprout,
    services: [
      { icon: Handshake, title: "Client Coordination", body: "Working with your team to understand site layout, access requirements and service priorities." },
      { icon: Search, title: "Site Survey", body: "On site assessment to scope the job and confirm what equipment and crew size is needed." },
      { icon: ClipboardCheck, title: "Scope Confirmation", body: "Agreeing the service scope and standards floor cleaning, dusting, windows, grounds and more before work begins." },
      { icon: Layers, title: "Crew Scheduling", body: "Scheduling trained crews according to your site's operating hours and frequency requirements." },
    ],
  },
  {
    tag: "Delivery & Quality Control",
    icon: Boxes,
    services: [
      { icon: Package, title: "Equipment & Supplies", body: "Supplying appropriate equipment and materials sourced from licensed, reputable suppliers for the job." },
      { icon: Tag, title: "Job Sign off", body: "Clear sign off procedures coordinated with your on site contact after each visit." },
      { icon: ShieldCheck, title: "Daily Inspections", body: "Team leaders and area supervisors inspect work on site and brief our Operations Manager by phone every day." },
      { icon: FileText, title: "Service Documentation", body: "Job reports and relevant documentation coordinated for each visit or contract period." },
    ],
  },
  {
    tag: "Ongoing Contract Management",
    icon: Ship,
    services: [
      { icon: RouteIcon, title: "Contract Coordination", body: "Coordinating recurring visits, staffing and any schedule changes for your site." },
      { icon: Ship, title: "Multi Branch Support", body: "Supporting organizations with multiple sites from our Eldoret head office and Nairobi branch." },
      { icon: FileText, title: "Invoicing & Records", body: "Preparing and coordinating invoicing and service records for each billing period." },
      { icon: MessageSquare, title: "Client Communication", body: "Keeping clients informed at each stage from scheduling through to job completion." },
    ],
  },
];

const timeline = [
  { step: "01", title: "Client Enquiry", body: "Client submits site, service type and frequency requirements through our quote form." },
  { step: "02", title: "Requirements Review", body: "Our team reviews the request and any site specific requirements." },
  { step: "03", title: "Site Survey", body: "A site visit is arranged to confirm scope, access and equipment needs." },
  { step: "04", title: "Quotation & Agreement", body: "A quote and service agreement are prepared based on the confirmed scope." },
  { step: "05", title: "Scheduling & Delivery", body: "Crews are scheduled and the service is delivered to the agreed standard." },
  { step: "06", title: "Reporting & Follow up", body: "Job reports and any relevant documentation are shared with you directly by our team." },
];

const assurances = [
  "Trained, vetted service crews with C.I.D. certificates of good conduct",
  "Fumigation & pest control by trained technicians",
  "Documentation coordinated per contract",
  "One coordination team for client communication",
  "Equipment and products suited to the site",
  "Daily inspection and supervisor follow up on every job",
];

function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover motion-safe:animate-in motion-safe:zoom-in-105 motion-safe:duration-[1600ms]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>
        <div className="container-page relative py-20 md:py-32">
          <div className="max-w-3xl text-white">
            <Reveal>
              <span className="eyebrow text-white/80">Corporate Contracts</span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="heading-hero mt-5 text-white">
                From <span className="text-[#F5D061]">site survey to sign off.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
                Coordinated scheduling, staffing and quality support designed around
                the requirements of corporate and institutional clients.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl px-6 font-display font-semibold transition-transform hover:-translate-y-0.5">
                  <Link to="/contact">
                    Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-white/40 bg-white/10 px-6 font-display font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white hover:text-foreground"
                >
                  <a href={site.whatsappHref} target="_blank" rel="noreferrer">
                    <Users className="mr-2 h-4 w-4" /> Talk to Our Team
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative border-t border-white/15 bg-black/40 backdrop-blur-sm">
          <div className="container-page grid grid-cols-2 divide-white/10 py-6 sm:grid-cols-4 sm:divide-x">
            {[
              { icon: Sprout, label: "Trained Crews" },
              { icon: Boxes, label: "Approved Equipment" },
              { icon: Globe2, label: "Regional Coverage" },
              { icon: Users, label: "Client Support" },
            ].map(({ icon: Icon, label }, i) => (
              <Reveal key={label} delay={i * 90} className="flex items-center gap-3 px-2 py-3 text-white sm:justify-center">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#F5D061]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 text-[11px] uppercase tracking-wider text-white/70">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service pillars */}
      <section className="border-b border-border">
        <div className="container-page py-20 md:py-28">
          <div className="space-y-16">
            {pillars.map((pillar, pi) => {
              const PillarIcon = pillar.icon;
              return (
                <div key={pillar.tag}>
                  <Reveal className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <PillarIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Stage {pi + 1}
                      </div>
                      <h3 className="font-display text-xl font-bold sm:text-2xl">{pillar.tag}</h3>
                    </div>
                    <span className="ml-2 hidden h-px flex-1 bg-border sm:block" />
                  </Reveal>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {pillar.services.map(({ icon: Icon, title, body }, i) => (
                      <Reveal
                        key={title}
                        delay={i * 90}
                        className="group rounded-2xl border border-border bg-card p-6 lift-hover shine-hover hover:border-primary/40"
                      >
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="mt-5 font-display text-base font-semibold">{title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="border-b border-border">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow="How it works"
                  title="From first enquiry to job sign off"
                  description="A repeatable six step process. You always know what happens next."
                />
              </Reveal>
              <Reveal delay={150} variant="scale" className="mt-8 overflow-hidden rounded-3xl border border-border">
                <img
                  src={packhouseImg}
                  alt="Robu Cleaning Services crew at a client site"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                />
              </Reveal>
              <Reveal delay={200} className="mt-8 rounded-2xl border border-border bg-accent/60 p-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm leading-relaxed text-accent-foreground">
                  Documentation relevant to each contract is coordinated by our team and shared
                  with you directly as it is issued.
                </p>
              </Reveal>
            </div>

            <ol className="relative space-y-6 before:absolute before:left-[22px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {timeline.map((t, i) => (
                <Reveal
                  key={t.step}
                  as="li"
                  delay={i * 80}
                  variant="right"
                  className="group relative flex gap-5 rounded-2xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50"
                >
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card font-display text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {t.step}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display text-base font-semibold sm:text-lg">{t.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Contact / enquiry form */}
      <section id="quote" className="border-b border-border scroll-mt-24">
        <div className="container-page py-20 md:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Start here"
              title="Tell us about your site"
              description="Share your site, service type and frequency, and our team will follow up within one working day with pricing and next steps."
            />
          </Reveal>
          <Reveal delay={120} className="mx-auto mt-12 max-w-3xl">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Assurances */}
      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-20 md:py-24">
          <Reveal>
            <SectionHeading align="center" eyebrow="Why clients stay" title="Built on coordination, not promises" />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assurances.map((a, i) => (
              <Reveal
                key={a}
                delay={i * 70}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 lift-hover hover:border-primary/40"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium leading-relaxed">{a}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.38_0.18_256)] to-[oklch(0.5_0.22_258)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#F5D061]/20 blur-3xl float-slow" />
        <div className="container-page relative py-20 text-center md:py-24">
          <Reveal>
            <span className="eyebrow text-white/75">Let&apos;s talk</span>
            <h2 className="heading-section mt-4 text-white">Ready to schedule your first service?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Tell us your site, service type and frequency. Our team will follow up with
              next steps.
            </p>
          </Reveal>
          <Reveal delay={140} className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="h-12 rounded-xl px-7 font-display font-semibold transition-transform hover:-translate-y-0.5">
              <Link to="/contact">
                Request a Quote <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/40 bg-white/10 px-7 font-display font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white hover:text-foreground"
            >
              <a href={site.phoneHref}>
                <Phone className="mr-2 h-4 w-4" /> {site.phone}
              </a>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}