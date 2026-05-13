import { useListFacilities } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import { Clock } from "lucide-react";

export default function Facilities() {
  const { data: facilities, isLoading } = useListFacilities();

  const grouped = facilities?.reduce<Record<string, typeof facilities>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {}) ?? {};

  return (
    <div>
      <PageHero
        eyebrow="Facilities & Amenities"
        title="A hotel that holds you, gently."
        description="A spa carved into the cliff. A pool above the sea. Quiet corners and considered details, end to end."
        image="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-20 last:mb-0">
              <p className="font-eyebrow text-accent mb-3">{category}</p>
              <h2 className="font-display text-3xl sm:text-4xl mb-10 max-w-2xl">
                {category === "Wellness" ? "Restore, the Mediterranean way." :
                 category === "Recreation" ? "Pools, beach, and the view that started it all." :
                 category === "Family" ? "For our smallest guests." :
                 category === "Business" ? "When you must work, do it well." :
                 category === "Dining" ? "Eat where the day takes you." :
                 `Our ${category.toLowerCase()}`}
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((f) => (
                  <article key={f.id} className="bg-card border border-card-border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl mb-2">{f.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.description}</p>
                      {f.hours && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2 pt-3 border-t border-border">
                          <Clock size={12} className="text-accent" /> {f.hours}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
