import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

const DEFAULT_MESSAGE = "Hello, I would like to enquire about your cleaning, fumigation or facility maintenance services.";

export function WhatsAppButton() {
  const href = `${site.whatsappHref}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-elevated)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
