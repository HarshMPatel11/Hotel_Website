import { useGetHotelInfo, useListTestimonials } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import { Star } from "lucide-react";

const TIMELINE = [
  { year: "1924", title: "The first stone", text: "Cesare Aurelia builds nine rooms above the Marina Grande for travelling friends." },
  { year: "1962", title: "A second floor", text: "The hotel doubles in size; the saltwater pool is carved into the cliffside." },
  { year: "1989", title: "The Limonaia", text: "Our flagship restaurant opens, set inside the original lemon grove." },
  { year: "2012", title: "The Spa Marina", text: "A wellness retreat is built into the rock, with treatment rooms facing the sea." },
  { year: "Today", title: "Three generations on", text: "The Aurelia family still greets each guest by name. Some traditions don't need updating." },
];

export default function About() {
  const { data: hotel } = useGetHotelInfo();
  const { data: testimonials } = useListTestimonials();
  const years = new Date().getFullYear() - (hotel?.foundedYear ?? 1924);

  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title="A century in one place."
        description="Three generations of one family, one stretch of coastline, and the simple belief that hospitality is a craft."
        image="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <p className="font-eyebrow text-accent mb-5">Our story</p>
          <p className="font-display text-3xl sm:text-4xl leading-snug text-foreground">
            "We never set out to build a grand hotel. We built a home with rooms enough for friends. The rest happened slowly."
          </p>
          <p className="mt-6 text-muted-foreground">— Lucia Aurelia, third-generation custodian</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-3 gap-12">
          <div>
            <p className="font-eyebrow text-accent mb-4">A timeline</p>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">{years}+ years, told briefly.</h2>
          </div>
          <ol className="lg:col-span-2 space-y-10">
            {TIMELINE.map((item) => (
              <li key={item.year} className="grid grid-cols-[80px_1fr] gap-6 pb-10 border-b border-border last:border-0 last:pb-0">
                <p className="font-display text-3xl text-accent">{item.year}</p>
                <div>
                  <h3 className="font-display text-2xl mb-1.5">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80"
            alt="The Aurelia family"
            className="rounded-md shadow-xl w-full aspect-[4/5] object-cover"
          />
          <div>
            <p className="font-eyebrow text-accent mb-5">Our philosophy</p>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">Slowness, craft, and an unwavering sense of place.</h2>
            <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <p>We pour wine from the village above us, fish from the boats below, and cook with lemons from a grove that's been ours for four generations.</p>
              <p>Our staff stay for decades; many were born in Positano. They will remember your coffee, your daughter's birthday, the wine you asked for last August.</p>
              <p>This is a small hotel by design. We will never be the largest, the loudest, or the newest. We mean to be, simply, the place you return to.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            <Stat n={`${years}+`} label="Years of hospitality" />
            <Stat n={48} label="Rooms & suites" />
            <Stat n="2" label="Restaurants" />
            <Stat n={`${hotel?.starRating ?? 5}★`} label="Forbes-rated" />
          </div>
        </div>
      </section>

      {testimonials && testimonials.length > 0 && (
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <p className="font-eyebrow text-accent text-center mb-4">In their words</p>
            <h2 className="font-display text-4xl sm:text-5xl text-center mb-16">What guests remember.</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.slice(0, 4).map((t) => (
                <figure key={t.id} className="bg-card border border-card-border p-8 rounded-md">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-accent text-accent" />)}
                  </div>
                  <blockquote className="font-display text-xl leading-snug">"{t.body}"</blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-border text-sm">
                    <p className="font-medium">{t.guestName}</p>
                    {t.guestLocation && <p className="text-muted-foreground text-xs">{t.guestLocation}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: string | number; label: string }) {
  return (
    <div>
      <p className="font-display text-5xl sm:text-6xl text-primary">{n}</p>
      <p className="font-eyebrow text-muted-foreground mt-2">{label}</p>
    </div>
  );
}
