import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Comprehensive cleaning",
  "Pest control and fumigation",
  "Ground maintenance",
  "Sanitary services",
  "Garbage collection and disposal",
  "Messengerial services",
  "Car wash (interior and exterior)",
  "Supply of cleaning materials and detergents",
  "Other",
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^[+0-9()\s-]{7,40}$/.test(v), "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  service: z.enum(SERVICES, { errorMap: () => ({ message: "Select a service" }) }),
  message: z
    .string()
    .trim()
    .min(10, "Please give us at least 10 characters of detail")
    .max(1500, "Keep it under 1500 characters"),
});

export type ContactFormValues = z.infer<typeof schema>;

export function ContactForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", service: undefined, message: "" },
  });

  const message = watch("message") ?? "";

  const onSubmit = async (data: ContactFormValues) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(16)}-0000-4000-8000-000000000000`;

    const { error } = await supabase.from("contact_requests").insert({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service: data.service,
      message: data.message,
      status: "new",
    });

    if (error) {
      toast.error(error.message || "Could not send your message. Please try again.");
      return;
    }

    reset();
    setSubmitted(true);
    toast.success("Your message has been sent.");
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-[var(--shadow-soft)]",
          className,
        )}
      >
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold">Message sent</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Thank you for reaching out. Our team will get back to you shortly at the email or
          phone number you provided.
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-6 h-11 rounded-xl px-6 font-display font-semibold"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)]", className)}
    >
      <h2 className="font-display text-2xl font-semibold">Contact us</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what you need and we'll get back to you as soon as possible.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Full name *</Label>
          <Input id="c-name" {...register("name")} className="mt-1.5 h-11" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="c-email">Email *</Label>
          <Input id="c-email" type="email" {...register("email")} className="mt-1.5 h-11" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="c-phone">Phone / WhatsApp</Label>
          <Input id="c-phone" {...register("phone")} className="mt-1.5 h-11" placeholder="+254 …" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="c-service">Service needed *</Label>
          <select
            id="c-service"
            {...register("service")}
            defaultValue=""
            className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            aria-invalid={!!errors.service}
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="c-message">Message *</Label>
            <span className={cn("text-[11px]", message.length > 1500 ? "text-destructive" : "text-muted-foreground")}>
              {message.length}/1500
            </span>
          </div>
          <Textarea
            id="c-message"
            rows={5}
            {...register("message")}
            className="mt-1.5"
            placeholder="Tell us about your site, location and when you need this"
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </div>

      <div className="mt-7">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="h-12 rounded-xl px-7 font-display font-semibold transition-transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
