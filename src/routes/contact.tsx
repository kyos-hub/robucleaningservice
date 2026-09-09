import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck, Clock3, Globe2, PackageCheck, Building2 } from "lucide-react";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import imgContactHero from "@/assets/photos/robu-hospital-hallway.jpg";
const heroImg = imgContactHero;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact, Robu Cleaning Services" },
      { name: "description", content: "Get in touch with Robu Cleaning Services, professional cleaning, sanitation, fumigation and pest control across Kenya." },
      { property: "og:title", content: "Contact, Robu Cleaning Services" },
      { property: "og:description", content: "Send us a message and our team will follow up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const assurances = [
  { icon: Clock3, title: "Prompt response", body: "Our team aims to respond to every enquiry within one working day." },
  { icon: PackageCheck, title: "Direct follow-up", body: "We'll reach out by email or phone with next steps." },
  { icon: ShieldCheck, title: "Quality-focused", body: "Site assessment, crew scheduling and documentation coordinated for each contract." },
  { icon: Globe2, title: "Coverage flexible", body: "Tell us your site location and service frequency, we'll confirm feasibility." },
];

const branches = [
  {
    name: "Eldoret Branch (Head Office)",
    address: "Elgeyo Road, next to Wells Fargo, P.O Box 7843-30100 GPO, Eldoret, Kenya",
    phone: "053 2060334 / 0722 762 198",
  },
  {
    name: "Nairobi Office",
    address: "Verdic House, 3rd Floor, Room 315",
    phone: "0722 762 198",
  },
];

function Contact() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
        </div>
        <div className="container-page relative max-w-3xl py-16 text-white md:py-24">
          <span className="eyebrow text-white/80">Contact</span>
          <h1 className="heading-hero mt-5 text-white">Let&apos;s talk about your next service.</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            Tell us what you need, where your site is and when you need it done. Our team
            will follow up with pricing, scheduling and next steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 font-semibold backdrop-blur transition-colors hover:bg-white hover:text-foreground">
              <Phone className="h-4 w-4" /> {site.phone}
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* assurances */}
      <section className="border-b border-border bg-muted/40">
        <div className="container-page grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80} className="rounded-2xl border border-border bg-card p-4 lift-hover hover:border-primary/40">
              <Icon className="h-4 w-4 text-primary" />
              <p className="mt-2.5 font-display text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
              <p className="mt-2 text-muted-foreground">Reach us directly through any of the channels below.</p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {[
                { Icon: Phone, label: "Phone", value: site.phone, href: site.phoneHref },
                { Icon: Mail, label: "Email", value: site.email, href: site.emailHref },
                { Icon: MapPin, label: "Address", value: site.address },
                { Icon: Clock, label: "Business hours", value: site.hours },
              ].map(({ Icon, label, value, href }, i) => (
                <Reveal
                  as="li"
                  key={label}
                  delay={i * 70}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 lift-hover hover:border-primary/40"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="mt-0.5 block break-words font-medium text-foreground hover:text-primary">{value}</a>
                    ) : (
                      <p className="mt-0.5 font-medium text-foreground">{value}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ul>

            {/* Branch network, sourced from company profile */}
            <Reveal delay={90} className="mt-8">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Our branches</h3>
              <div className="mt-3 space-y-3">
                {branches.map((branch) => (
                  <div key={branch.name} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 lift-hover hover:border-primary/40">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{branch.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{branch.address}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{branch.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-8 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
              <iframe
                title="Robu Cleaning Services location"
                src="https://www.google.com/maps?q=Eldoret,Kenya&output=embed"
                loading="lazy"
                className="aspect-[4/3] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>

          <div id="quote" className="scroll-mt-24">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}