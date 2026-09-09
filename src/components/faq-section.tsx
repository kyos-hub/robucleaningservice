import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export type FaqItem = { q: string; a: string };

export const homeFaqs: FaqItem[] = [
  {
    q: "Which areas do you serve?",
    a: "We operate from our head office in Eldoret with a branch office in Nairobi, and serve clients across North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions. Get in touch with your location and we'll confirm coverage.",
  },
  {
    q: "What cleaning and pest control services do you offer?",
    a: "Comprehensive cleaning services, pest control & fumigation, ground and garden maintenance, sanitary services, messenger and tea-making services, garbage collection and disposal, car wash (interior and exterior), and supply of cleaning materials and detergents.",
  },
  {
    q: "How experienced is Robu Cleaning Services?",
    a: "We were registered in 1997 and incorporated in 2009, growing from an initial team of 3 employees to over 415 staff today, serving major banks, commercial buildings, learning institutions, hospitals, religious institutions and private homes.",
  },
  {
    q: "How can I request a quote?",
    a: "Use the Request a Quote form on this site, or reach us directly by phone or email. Our team responds to enquiries within one working day and follows up with pricing and scheduling.",
  },
  {
    q: "Do you offer recurring service contracts?",
    a: "Yes, we run scheduled cleaning, sanitary and ground maintenance programs for offices, institutions and multi-branch organizations, with standards and procedures agreed with each client. Tell us your requirements when requesting a quote.",
  },
  {
    q: "How do you ensure staff are trustworthy and well trained?",
    a: "All staff are recruited with verified ID, academic testimonials and confirmed reference letters, and must hold a certificate of good conduct from the C.I.D. before joining. We also run continuous in-house training from our fully equipped Eldoret training unit.",
  },
];

export function FaqSection({ items = homeFaqs }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <SectionHeading align="center" eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="font-display text-sm font-semibold sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300 ease-out",
                    isOpen ? "-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0 px-5 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-6">
                    {item.a}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}