import { useState } from "react";
import { useListEventPackages, useCreateEventInquiry } from "@/lib/api-client-react";
import { useForm } from "react-hook-form";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { getErrorMessage } from "@/lib/api-error";

interface Form {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message?: string;
}

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

export default function Events() {
  const { data: packages } = useListEventPackages();
  const createInquiry = useCreateEventInquiry();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    defaultValues: { eventType: "Wedding", guestCount: 80 },
  });

  const onSubmit = (data: Form) => {
    createInquiry.mutate(
      {
        data: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          eventType: data.eventType,
          eventDate: data.eventDate,
          guestCount: Number(data.guestCount),
          message: data.message || undefined,
        },
      },
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
        eyebrow="Events & Weddings"
        title="A coastline made for the most important days."
        description="Vineyard ceremonies, terrace receptions, intimate dinners under the lemon trees — held with the care of a family that's hosted them for a hundred years."
        image="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Packages"
            title="Curated experiences."
            description="Every event is bespoke. Our packages are starting points; our planners will shape them around you."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages?.map((pkg) => {
              const symbol = CURRENCY_SYMBOL[pkg.currency] ?? pkg.currency;
              return (
                <article key={pkg.id} className="bg-card border border-card-border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
                  {pkg.image && (
                    <div className="aspect-[5/4] overflow-hidden bg-muted">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-7 flex-1 flex flex-col">
                    <p className="font-eyebrow text-accent mb-2">{pkg.type}</p>
                    <h3 className="font-display text-2xl mb-3">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{pkg.description}</p>
                    {pkg.inclusions?.length > 0 && (
                      <ul className="space-y-2 mb-6 text-sm">
                        {pkg.inclusions.slice(0, 5).map((inc: string) => (
                          <li key={inc} className="flex items-start gap-2">
                            <Check size={14} className="text-accent mt-1 shrink-0" /> {inc}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-5 border-t border-border">
                      <p className="font-eyebrow text-muted-foreground">Starting from</p>
                      <p className="font-display text-3xl text-primary">
                        {symbol}{pkg.startingPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 bg-muted/40">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Plan your event"
            title="Tell us what you have in mind."
            description="Our event team will reply within 24 hours with availability, ideas, and a no-obligation proposal."
          />

          {submitted ? (
            <div className="mt-12 bg-card border border-card-border p-10 rounded-md text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-accent/15 grid place-items-center">
                <Check size={26} className="text-accent" />
              </div>
              <h3 className="font-display text-2xl mb-2">Thank you</h3>
              <p className="text-muted-foreground">We've received your enquiry and will be in touch within a day.</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12 bg-card border border-card-border p-8 sm:p-10 rounded-md space-y-5 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name" error={errors.fullName?.message}>
                  <Input {...register("fullName", { required: "Required" })} className="h-11" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" {...register("email", { required: "Required" })} className="h-11" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone" error={errors.phone?.message}>
                  <Input type="tel" {...register("phone", { required: "Required" })} className="h-11" />
                </Field>
                <Field label="Event type" error={errors.eventType?.message}>
                  <select {...register("eventType", { required: "Required" })} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option>Wedding</option>
                    <option>Corporate Retreat</option>
                    <option>Anniversary</option>
                    <option>Private Dinner</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Event date" error={errors.eventDate?.message}>
                  <Input type="date" {...register("eventDate", { required: "Required" })} className="h-11" />
                </Field>
                <Field label="Guests" error={errors.guestCount?.message}>
                  <Input type="number" min={1} {...register("guestCount", { required: "Required", valueAsNumber: true })} className="h-11" />
                </Field>
              </div>
              <Field label="Tell us about your vision (optional)">
                <Textarea {...register("message")} rows={4} className="resize-none" />
              </Field>
              {createInquiry.isError && (
                <p className="text-sm text-destructive">{getErrorMessage(createInquiry.error)}</p>
              )}
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={createInquiry.isPending}>
                {createInquiry.isPending ? "Sending…" : "Send enquiry"}
              </Button>
            </form>
          )}
        </div>
      </section>
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
