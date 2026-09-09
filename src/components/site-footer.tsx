import { Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Logo } from "./logo";
import { nav, site } from "@/lib/site";

const serviceLinks = [
  { label: "Our Services", to: "/services" as const },
  { label: "Request a Quote", to: "/contact" as const },
  { label: "Corporate Contracts", to: "/export-services" as const },
  { label: "Quality & Compliance", to: "/quality-compliance" as const },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[oklch(0.98_0.005_150)]">
      {/* CTA strip */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-7 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-primary-foreground sm:text-xl">
              Ready to book a cleaning or pest control service?
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Send us your specifications and we'll respond within one business day.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold font-display text-primary transition-colors hover:bg-background/90"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Kenyan cleaning and hygiene services company offering professional cleaning,
            sanitation, fumigation and pest control since 1997.
          </p>
          <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
            <div className="flex gap-1.5">
              <dt className="font-semibold text-foreground/80">Cert. No.</dt>
              <dd>{site.registrationNo}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-foreground/80">Hours</dt>
              <dd className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> {site.hours}
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social profile"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
            Services
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {serviceLinks.map((b) => (
              <li key={b.label}>
                <Link
                  to={b.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li className="flex items-start gap-2.5 text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <a href={site.phoneHref} className="block hover:text-foreground">
                  {site.phone}
                </a>
                <a href={site.phoneAltHref} className="block hover:text-foreground">
                  {site.phoneAlt}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <a href={site.emailHref} className="block break-all hover:text-foreground">
                  {site.email}
                </a>
                <a href={site.emailAltHref} className="block break-all hover:text-foreground">
                  {site.emailAlt}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block font-medium text-foreground/90">Head Office</span>
                {site.address}
                <span className="mt-0.5 block text-xs">{site.postal}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </a>
            <a href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="terms" className="hover:text-foreground">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
