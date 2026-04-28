import { useListDining } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import { Clock, MapPin, Award } from "lucide-react";

export default function Dining() {
  const { data: venues, isLoading } = useListDining();

  return (
    <div>
      <PageHero
        eyebrow="Dining"
        title="Eat where the morning catch lands."
        description="Two restaurants and a poolside grill, all built around what came in from the boats and what's ripe in the gardens above."
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {isLoading && <div className="h-96 bg-muted rounded-md animate-pulse" />}
          <div className="space-y-24">
            {venues?.map((v, idx) => (
              <article key={v.id} className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${idx % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                <div className="lg:[direction:ltr]">
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted shadow-lg">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="lg:[direction:ltr]">
                  <p className="font-eyebrow text-accent mb-3">{v.cuisine}</p>
                  <h2 className="font-display text-4xl sm:text-5xl mb-4">{v.name}</h2>
                  {v.priceRange && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Award size={14} className="text-accent" /> {v.priceRange}
                    </p>
                  )}
                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">{v.description}</p>

                  <div className="mt-8 grid sm:grid-cols-2 gap-5 pt-6 border-t border-border">
                    {v.hours && (
                      <div>
                        <p className="font-eyebrow text-muted-foreground mb-1.5">Hours</p>
                        <p className="text-sm flex items-start gap-2"><Clock size={14} className="mt-0.5 text-accent" /> {v.hours}</p>
                      </div>
                    )}
                    {v.dressCode && (
                      <div>
                        <p className="font-eyebrow text-muted-foreground mb-1.5">Dress code</p>
                        <p className="text-sm">{v.dressCode}</p>
                      </div>
                    )}
                    {v.signatureDishes && v.signatureDishes.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="font-eyebrow text-muted-foreground mb-1.5">Signature dishes</p>
                        <p className="text-sm flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-accent" /> {v.signatureDishes.join(" · ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(200_38%_12%)] text-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-eyebrow text-[hsl(36_55%_60%)] mb-4">Reservations</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4">Tables fill quickly in season.</h2>
          <p className="text-white/75 leading-relaxed">
            Our concierge will hold a table for you, in any of our venues. Please call or write — we'll respond within the hour.
          </p>
          <p className="mt-6 font-display text-2xl text-[hsl(36_55%_72%)]">+39 089 555 1924</p>
        </div>
      </section>
    </div>
  );
}
