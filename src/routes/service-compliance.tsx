import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, Globe2, FileText, ShieldOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/service-compliance")({
  head: () => ({
    meta: [
      { title: "Service Compliance, Robu Cleaning Services" },
      {
        name: "description",
        content:
          "Chemical use, safety and compliance information for clients working with Robu Cleaning Services, including site-access and occupational safety responsibilities.",
      },
      { property: "og:title", content: "Service Compliance, Robu Cleaning Services" },
      { property: "og:url", content: "/service-compliance" },
    ],
    links: [{ rel: "canonical", href: "/service-compliance" }],
  }),
  component: ExportCompliance,
});

const points = [
  {
    icon: Globe2,
    title: "Chemical use follows approved standards",
    body: "Fumigation and pest control treatments use chemicals and application methods approved for use in Kenya, in line with PEMAK guidance.",
  },
  {
    icon: Scale,
    title: "Clients are responsible for site access & safety",
    body: "Clients are responsible for confirming safe site access, vacating treated areas where required, and informing occupants of any temporary restrictions.",
  },
  {
    icon: FileText,
    title: "Contracts are subject to applicable regulations",
    body: "All services are delivered subject to applicable Kenyan health, safety and environmental regulations relevant to the service provided.",
  },
  {
    icon: FileText,
    title: "Documentation depends on the service and site",
    body: "The specific safety data sheets, certificates or reports required for a job depend on the service type and site, and are coordinated on a per-contract basis.",
  },
  {
    icon: ShieldOff,
    title: "We do not use unapproved chemicals or methods",
    body: "We do not knowingly use chemicals, equipment or methods that fall outside approved standards, and we do not provide guidance on bypassing safety or regulatory requirements.",
  },
];

function ExportCompliance() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-16 md:py-24 max-w-3xl">
          <span className="eyebrow">Service Compliance</span>
          <h1 className="heading-hero mt-5">Client responsibilities & service terms</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            All services offered by Robu Cleaning Services Ltd are subject to applicable Kenyan
            health, safety and environmental regulations. Clients are responsible for ensuring safe
            site access and informing occupants of any service-related restrictions.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page py-16 md:py-24">
          <SectionHeading
            align="center"
            eyebrow="Please read before booking"
            title="What clients need to know"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 80}
                className="rounded-2xl border border-border bg-card p-7 lift-hover hover:border-primary/40"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-16 md:py-20 text-center">
          <SectionHeading
            align="center"
            eyebrow="Have questions?"
            title="Talk to our team before you book."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 rounded-xl font-display font-semibold">
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 rounded-xl font-display font-semibold"
            >
              <Link to="/quality-compliance">
                Quality & Compliance <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
