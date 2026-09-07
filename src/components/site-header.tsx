import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { nav, aboutDropdown, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); setAboutOpen(false); setMobileAboutOpen(false); }, [pathname]);

  // Close the desktop About dropdown on outside click.
  useEffect(() => {
    if (!aboutOpen) return;
    function onClick(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [aboutOpen]);

  const aboutActive = pathname.startsWith("/about") || aboutDropdown.some((d) => pathname.startsWith(d.to));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
            : "bg-background",
        )}
      >
        <div className="container-page flex h-18 items-center justify-between py-4">
          <Link to="/" aria-label="Robu Cleaning Services home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

              if (item.to === "/about") {
                return (
                  <div key={item.to} ref={aboutRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAboutOpen((v) => !v)}
                      aria-expanded={aboutOpen}
                      aria-haspopup="true"
                      className={cn(
                        "relative flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors font-display",
                        aboutActive ? "text-primary" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", aboutOpen && "rotate-180")} />
                      {aboutActive && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                      )}
                    </button>

                    <div
                      className={cn(
                        "absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-background p-1.5 shadow-lg transition-all duration-150",
                        aboutOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                      )}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setAboutOpen(false)}
                        className={cn(
                          "block rounded-lg px-3.5 py-2.5 text-sm font-medium font-display transition-colors",
                          pathname === item.to ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                        )}
                      >
                        {item.label}
                      </Link>
                      <div className="my-1 h-px bg-border" />
                      {aboutDropdown.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setAboutOpen(false)}
                          className={cn(
                            "block rounded-lg px-3.5 py-2.5 text-sm font-medium font-display transition-colors",
                            pathname.startsWith(sub.to) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                          )}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-md px-4 py-2 text-sm font-medium transition-colors font-display",
                    active ? "text-primary" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              className="hidden lg:inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-display font-medium text-foreground hover:bg-accent"
            >
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
            <Button asChild size="sm" className="hidden lg:inline-flex font-display font-semibold h-10 px-5 rounded-xl">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[80%] max-w-[350px] flex-col bg-background shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <div className="min-w-0 flex-1">
              <Logo />
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
            <ul className="space-y-1">
              {nav.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

                if (item.to === "/about") {
                  return (
                    <li key={item.to}>
                      <button
                        type="button"
                        onClick={() => setMobileAboutOpen((v) => !v)}
                        aria-expanded={mobileAboutOpen}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium font-display transition-colors",
                          aboutActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent",
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", mobileAboutOpen && "rotate-180")} />
                      </button>

                      {mobileAboutOpen && (
                        <ul className="mt-1 space-y-1 pl-4">
                          <li>
                            <Link
                              to={item.to}
                              className={cn(
                                "flex items-center rounded-xl px-4 py-3 text-sm font-medium font-display transition-colors",
                                pathname === item.to ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-accent",
                              )}
                            >
                              Overview
                            </Link>
                          </li>
                          {aboutDropdown.map((sub) => (
                            <li key={sub.to}>
                              <Link
                                to={sub.to}
                                className={cn(
                                  "flex items-center rounded-xl px-4 py-3 text-sm font-medium font-display transition-colors",
                                  pathname.startsWith(sub.to) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-accent",
                                )}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3.5 text-[15px] font-medium font-display transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-5 space-y-3">
            <Button asChild className="w-full h-11 rounded-xl font-display font-semibold">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <a href={site.phoneHref} className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4 text-primary" /> {site.phone}
              </a>
              <a href={site.emailHref} className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground truncate">
                <Mail className="h-4 w-4 text-primary" /> {site.email}
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp us
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}