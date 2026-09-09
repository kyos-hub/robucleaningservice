import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck, Layers, Package, FileText, Route as RouteIcon, Globe2,
  Handshake, ArrowRight, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import imgQualityHero from "@/assets/photos/robu-vehicles-messenger.jpg";
const heroImg = imgQualityHero;

export const Route = createFileRoute("/quality-compliance")({
  head: () => ({
    meta: [
      { title: "Quality & Compliance, Robu Cleaning Services" },
      {
        name: "description",
        content:
          "How Robu Cleaning Services approaches service quality, crew training, staff vetting, daily inspections and workplace safety.",
      },
      { property: "og:title", content: "Quality & Compliance, Robu Cleaning Services" },
      { property: "og:url", content: "/quality-compliance" },
    ],
    links: [{ rel: "canonical", href: "/quality-compliance" }],
  }),
  component: QualityCompliance,
});

const sections = [
  { icon: ShieldCheck, title: "Staff Vetting", body: "Every employee is hired only after verified National ID, academic testimonials, confirmed reference letters and a certificate of good conduct from the C.I.D." },
  { icon: Layers, title: "Site-Customized Schedules", body: "Standards and procedures are discussed and agreed with each client, covering floor cleaning, dusting, window cleaning, external areas, grounds and upholstery." },
  { icon: Package, title: "Equipment & Materials", body: "We use modern equipment such as floor cleaning machines and brush cutters, and source cleaning materials only from licensed, reputable suppliers." },
  { icon: FileText, title: "In-House Training", body: "Our Training & Quality Control Manager oversees continuous training from a fully equipped training unit at our Eldoret head office." },
  { icon: RouteIcon, title: "Daily Inspections", body: "Team leaders and area supervisors inspect work on site and brief the Operations Manager by phone every day, capturing and resolving complaints as they arise." },
  { icon: Globe2, title: "Regional Reach", body: "We coordinate delivery across North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions." },
  { icon: Handshake, title: "Health, Safety & Environment", body: "Our safety policy covers signage on wet floors, proper PPE for staff, safe storage and disposal of cleaning materials, and compliance with local authority and NEMA waste regulations." },
];

function QualityCompliance() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        </div>
        <div className="container-page relative max-w-3xl py-16 text-white md:py-24">
          <span className="eyebrow text-white/80">Quality & Compliance</span>
          <h1 className="heading-hero mt-5 text-white">Responsible service delivery.</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            Since 1997, Robu Cleaning Services has built its quality process around staff vetting,
            in-house training, daily site inspections and a documented safety, health and
            environmental policy that applies at every location we work.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-16 md:py-24">
          <SectionHeading align="center" eyebrow="How we work" title="Quality and compliance, stage by stage" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 80}
                className="group rounded-2xl border border-border bg-card p-7 lift-hover hover:border-primary/40"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-14 md:py-20">
          <Reveal className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-amber-300/50 bg-amber-50 p-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-relaxed">
              Service scope and requirements vary by site. Contracts are delivered subject to
              applicable Kenyan health, safety and environmental regulations, including NEMA
              waste-disposal guidance. Get in touch to discuss the specific requirements of your site.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-page py-16 md:py-20 text-center">
          <SectionHeading align="center" eyebrow="Questions?" title="Talk to our team about your requirements." />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 rounded-xl font-display font-semibold">
              <Link to="/contact">Request a Quote <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}