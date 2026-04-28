import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetHotelInfo, useListFeaturedRooms, useListTestimonials, useListFacilities, useListDining } from "@/lib/api-client-react";
import { ArrowRight, Star, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingWidget from "@/components/BookingWidget";
import RoomCard from "@/components/RoomCard";
import SectionHeading from "@/components/SectionHeading";

export default function Home() {
  const { data: hotel } = useGetHotelInfo();
  const { data: rooms } = useListFeaturedRooms();
  const { data: testimonials } = useListTestimonials();
  const { data: facilities } = useListFacilities();
  const { data: dining } = useListDining();

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/65" />

        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <p className="font-eyebrow text-[hsl(36_55%_72%)] mb-5">A century on the Amalfi coast</p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.02] tracking-tight">
              A Mediterranean escape<br/>waiting to be discovered.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-xl leading-relaxed">
              {hotel?.tagline ?? "A 5-star seaside retreat above the cliffs of Positano — quiet, family-run, and unhurried since 1924."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="mt-10"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-card border-y border-border py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-wrap items-center justify-around gap-x-10 gap-y-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star size={16} className="fill-accent text-accent" />
            <span className="font-eyebrow text-foreground">{hotel?.starRating ?? 5}-Star Heritage</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-accent" />
            <span className="font-eyebrow text-foreground">{hotel?.city ?? "Positano"}, {hotel?.country ?? "Italy"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-accent" />
            <span className="font-eyebrow text-foreground">Forbes Travel Guide 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-accent" />
            <span className="font-eyebrow text-foreground">Condé Nast Gold List</span>
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80"
              alt="Aurelia Grand façade"
              className="rounded-md shadow-xl w-full aspect-[4/5] object-cover"
            />
            <div className="hidden md:block absolute -bottom-8 -right-8 bg-accent text-accent-foreground p-8 rounded-md shadow-xl max-w-xs">
              <p className="font-display text-5xl leading-none">{new Date().getFullYear() - (hotel?.foundedYear ?? 1924)}</p>
              <p className="font-eyebrow mt-2">Years of hospitality</p>
            </div>
          </div>
          <div>
            <p className="font-eyebrow text-accent mb-5">Welcome to Aurelia Grand</p>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.1]">
              A family-run grand hotel, written into Positano's coastline.
            </h2>
            <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <p>
                Three generations of the Aurelia family have welcomed travellers, writers and statesmen to these terraces. The rhythm is unhurried; the rituals — espresso at sunrise, an aperitivo as the cliffs glow rose — are the same ones our grandparents kept.
              </p>
              <p>
                Forty-eight rooms and suites, two restaurants, a Mediterranean spa, and a saltwater pool carved into the rock. Nothing more, nothing less.
              </p>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 mt-8 font-medium text-primary hover:gap-3 transition-all">
              Our story <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-20 sm:py-28 bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Rooms & Suites"
            title="Quiet rooms, framed by the sea."
            description="Each room is unique. Hand-painted Vietri tiles, linen curtains, French doors that open onto a private terrace and the Tyrrhenian below."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms?.slice(0, 3).map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href="/rooms">
              <Button size="lg" variant="outline" className="rounded-full px-8">View all rooms</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DINING */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Dining"
            title="Two kitchens. One coastline."
            description="From cliffside fine dining to barefoot lunches by the pool — guided by the morning's catch and the gardens above."
            align="left"
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {dining?.slice(0, 2).map((venue) => (
              <Link key={venue.id} href="/dining" className="group block">
                <div className="aspect-[5/4] overflow-hidden rounded-md mb-5 bg-muted">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="font-eyebrow text-accent mb-2">{venue.cuisine}</p>
                <h3 className="font-display text-3xl mb-2 group-hover:text-primary transition-colors">{venue.name}</h3>
                <p className="text-muted-foreground line-clamp-2">{venue.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-[hsl(200_38%_12%)] text-white">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2400&q=80)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Facilities"
            title="Spaces designed to slow down in."
            description="A spa carved from the cliffside, a saltwater infinity pool, terraced gardens and a private beach club at sea level."
            light
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities?.slice(0, 6).map((f) => (
              <div key={f.id} className="border border-white/15 rounded-md p-7 hover:bg-white/5 transition-colors">
                <p className="font-eyebrow text-[hsl(36_55%_60%)] mb-3">{f.category}</p>
                <h3 className="font-display text-2xl text-white mb-2">{f.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{f.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/facilities">
              <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-white/30 text-white hover:bg-white hover:text-foreground">
                Explore the hotel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Guest voices" title="Words from those who've stayed." />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials?.map((t) => (
              <figure key={t.id} className="bg-card border border-card-border rounded-md p-8 shadow-sm">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="font-display text-xl leading-snug text-foreground">"{t.body}"</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <p className="font-medium text-foreground">{t.guestName}</p>
                  {t.guestLocation && <p className="text-xs text-muted-foreground mt-0.5">{t.guestLocation}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1559599189-4c5b3b1e8e80?auto=format&fit=crop&w=2400&q=80)" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <p className="font-eyebrow text-[hsl(36_55%_72%)] mb-5">A standing invitation</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Stay with us this season.
          </h2>
          <p className="mt-6 text-lg text-white/85 leading-relaxed">
            Direct bookings include a welcome aperitif, daily breakfast on the terrace, and our concierge at your side.
          </p>
          <Link href="/book" className="inline-block mt-10">
            <Button size="lg" className="rounded-full px-10 h-14 text-base bg-accent text-accent-foreground hover:bg-accent/90">
              Reserve your stay
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
