import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetHotelInfo, useCreateContactMessage } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { getErrorMessage } from "@/lib/api-error";

interface Form {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { data: hotel } = useGetHotelInfo();
  const createMsg = useCreateContactMessage();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>();

  const onSubmit = (data: Form) => {
    createMsg.mutate(
      { data: { name: data.fullName, email: data.email, phone: data.phone || undefined, subject: data.subject, message: data.message } },
      {
        onSuccess: () => {
          setSubmitted(true);
          reset();
        },
      },
    );
  };

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="We're here, around the clock."
        description="Reception is open 24 hours. Concierge from seven in the morning to eleven at night. Write or call — we'd be glad to hear from you."
        image="https://images.unsplash.com/photo-1444459094717-a39f1e3e0903?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title="A note, a call, or simply drop by."
              align="left"
            />
            <div className="mt-10 space-y-6">
              <ContactItem icon={<MapPin />} label="Address">
                {hotel?.address ?? "Via del Mare 18"}<br/>{hotel?.city ?? "Positano"}, {hotel?.country ?? "Italy"}
              </ContactItem>
              <ContactItem icon={<Phone />} label="Telephone">
                <a href={`tel:${hotel?.phone ?? ""}`} className="hover:text-primary">{hotel?.phone ?? "+39 089 555 1924"}</a>
              </ContactItem>
              <ContactItem icon={<Mail />} label="Email">
                <a href={`mailto:${hotel?.email ?? ""}`} className="hover:text-primary">{hotel?.email ?? "reservations@aureliagrand.com"}</a>
              </ContactItem>
              <ContactItem icon={<Clock />} label="Hours">
                Reception · 24 hours<br/>Concierge · 07:00 — 23:00
              </ContactItem>
            </div>

          </div>

          {submitted ? (
            <div className="bg-card border border-card-border p-10 rounded-md text-center self-start shadow-sm">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-accent/15 grid place-items-center">
                <Check size={26} className="text-accent" />
              </div>
              <h3 className="font-display text-2xl mb-2">Message received</h3>
              <p className="text-muted-foreground">Thank you. We'll be back to you within 24 hours.</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-card-border p-8 sm:p-10 rounded-md space-y-5 self-start shadow-sm">
              <h3 className="font-display text-3xl mb-2">Send us a message</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name" error={errors.fullName?.message}>
                  <Input {...register("fullName", { required: "Required" })} className="h-11" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" {...register("email", { required: "Required" })} className="h-11" />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <Input type="tel" {...register("phone")} className="h-11" />
              </Field>
              <Field label="Subject" error={errors.subject?.message}>
                <Input {...register("subject", { required: "Required" })} className="h-11" />
              </Field>
              <Field label="Message" error={errors.message?.message}>
                <Textarea rows={5} {...register("message", { required: "Required" })} className="resize-none" />
              </Field>
              {createMsg.isError && <p className="text-sm text-destructive">{getErrorMessage(createMsg.error)}</p>}
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={createMsg.isPending}>
                {createMsg.isPending ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="h-[360px] overflow-hidden border-y border-border sm:h-[420px]">
        <iframe
          title="Hotel location"
          className="h-full w-full"
          loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=14.4795%2C40.6233%2C14.5045%2C40.6383&layer=mapnik&marker=40.6308%2C14.4920"
        />
      </section>
    </div>
  );
}

function ContactItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 shrink-0 rounded-full bg-accent/15 grid place-items-center text-accent">{icon}</div>
      <div>
        <p className="font-eyebrow text-muted-foreground mb-1">{label}</p>
        <p className="text-foreground/90 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-eyebrow text-muted-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
