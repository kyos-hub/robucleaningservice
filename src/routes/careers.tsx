import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, ShieldCheck, GraduationCap, HeartHandshake, ArrowRight,
  Sprout, Bug, ClipboardList, Sparkles, TrendingUp, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";
import imgCareersHero from "@/assets/photos/robu-office-mopping.jpg";
import imgCareersStory from "@/assets/photos/robu-pest-control-garden.jpg";
import imgCareersTraining from "@/assets/photos/robu-shower-cleaning.jpg";

const heroImg = imgCareersHero;
const storyImg = imgCareersStory;
const trainingImg = imgCareersTraining;

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers, Robu Cleaning Services" },
      {
        name: "description",
        content:
          "Join Robu Cleaning Services. We hire and train cleaners, supervisors, pest control technicians and support staff across our Eldoret and Nairobi operations.",
      },
      { property: "og:title", content: "Careers, Robu Cleaning Services" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: Careers,
});

const stats = [
  { value: "1997", label: "Founded" },
  { value: "415+", label: "Employees Today" },
  { value: "7", label: "Regions Covered" },
  { value: "25+", label: "Corporate Clients" },
];

const roles = [
  { icon: Sparkles, title: "Cleaners", body: "Site-based cleaning staff working under a Team Leader, delivering day-to-day floor care, dusting and general upkeep." },
  { icon: ClipboardList, title: "Team Leaders / Area Supervisors", body: "Oversee crews on site, inspect work quality and brief the Operations Manager daily." },
  { icon: Bug, title: "Pest Control Technicians", body: "Carry out fumigation and pest management work under the Head of Pest Control." },
  { icon: Sprout, title: "Groundsmen", body: "Handle garden and grounds maintenance across client sites, reporting to the Head of Ground Maintenance." },
  { icon: Users, title: "Sanitary Attendants", body: "Maintain sanitary services and supplies to hygiene standards under the Head of Sanitary Services." },
  { icon: HeartHandshake, title: "Messengers & Tea Girls", body: "Provide messengerial and tea-making support at client premises." },
];

function Careers() {
  return (
    <>
      {/* Cinematic recruitment hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="h-full w-full object-cover motion-safe:animate-in motion-safe:zoom-in-105 motion-safe:duration-[1600ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        <div className="container-page relative py-24 md:py-36">
          <div className="max-w-3xl text-white">
            <Reveal>
              <span className="eyebrow text-white/80">Careers</span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="heading-hero mt-5 text-white">
                Grow with <span className="text-[#F5D061]">Robu Cleaning Services.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
                From three employees in 1997 to over 415 today, our team has grown through
                hard work, in-house training and clear standards. We're always interested in
                hearing from disciplined, reliable people who want to build a career with us.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl px-6 font-display font-semibold transition-transform hover:-translate-y-0.5">
                  <a href={site.emailHref}>
                    Email Your CV <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Animated company statistics */}
        <div className="relative border-t border-white/15 bg-black/40 backdrop-blur-sm">
          <div className="container-page grid grid-cols-2 divide-white/10 py-6 sm:grid-cols-4 sm:divide-x">
            {stats.map(({ value, label }, i) => (
              <Reveal
                key={label}
                delay={i * 90}
                variant="scale"
                className="flex flex-col items-center gap-1 px-2 py-3 text-center text-white"
              >
                <span className="font-display text-2xl font-bold text-[#F5D061] sm:text-3xl">{value}</span>
                <span className="text-[11px] uppercase tracking-wider text-white/70">{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team / company story */}
      <section className="border-b border-border">
        <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="scale" className="overflow-hidden rounded-3xl border border-border">
            <img
              src={storyImg}
              alt="Robu Cleaning Services crew on site"
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
            />
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">Our story</span>
              <h2 className="heading-section mt-4">Built by people who started on the ground</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Robu Cleaning Services was registered in 1997 with just three employees. Since
                then the company has grown into one of the leading service providers across
                North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza, today employing over 415 people.
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-6 flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Many of our supervisors and department heads began as cleaners, groundsmen or
                technicians and grew into their roles through hands-on experience and
                continuous in-house training.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Six visual career paths */}
      <section className="border-b border-border bg-muted/40">
        <div className="container-page py-16 md:py-24">
          <SectionHeading align="center" eyebrow="Where you could fit" title="Six career paths at Robu" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map(({ icon: Icon, title, body }, i) => (
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

      {/* Training & development image section */}
      <section className="border-b border-border">
        <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="eyebrow">Training & development</span>
              <h2 className="heading-section mt-4">You'll never stop learning here</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Every new hire trains at our fully equipped in-house training unit at the
                Eldoret head office. Our dedicated Training & Quality Control Manager runs
                continuous refresher programmes so standards stay consistent as the company
                grows.
              </p>
            </Reveal>
            <ul className="mt-6 space-y-3">
              {[
                "Hands-on training before deployment to any site",
                "Ongoing refresher courses for existing staff",
                "Health, safety and environmental practice built into every module",
              ].map((item) => (
                <Reveal as="li" key={item} delay={150} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal variant="scale" className="order-1 overflow-hidden rounded-3xl border border-border lg:order-2">
            <img
              src={trainingImg}
              alt="Robu Cleaning Services in-house training"
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
            />
          </Reveal>
        </div>
      </section>

      {/* Dark "Why Robu" section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.2_0.02_256)] to-[oklch(0.32_0.05_258)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#F5D061]/15 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl float-slow" />
        <div className="container-page relative py-20 md:py-24">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Why Robu"
              title="What working here looks like"
              className="[&_span]:!text-white/80 [&_h2]:!text-white [&_p]:!text-white/70"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Structured, fair hiring", body: "Every hire is verified through ID checks, academic testimonials, reference confirmation and a Certificate of Good Conduct from the C.I.D." },
              { icon: GraduationCap, title: "Continuous training", body: "New and existing staff train at our fully equipped in-house training unit at the Eldoret head office." },
              { icon: TrendingUp, title: "Room to grow", body: "Since 1997 we've grown from 3 employees to over 415, many of our supervisors and heads of department started on the ground." },
            ].map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 90}
                className="rounded-2xl border border-white/15 bg-white/5 p-7 text-center backdrop-blur-sm transition-colors hover:border-[#F5D061]/40"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-[#F5D061]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CV submission CTA */}
      <section>
        <div className="container-page py-16 text-center md:py-24">
          <SectionHeading
            align="center"
            eyebrow="Interested?"
            title="Send us your CV"
            description="Email your CV, ID copy and academic certificates to our recruitment team, or drop them off at our Eldoret head office."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 rounded-xl font-display font-semibold transition-transform hover:-translate-y-0.5">
              <a href={site.emailHref}>
                Email Your CV <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 rounded-xl font-display font-semibold transition-transform hover:-translate-y-0.5">
              <Link to="/contact">Contact Us <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}