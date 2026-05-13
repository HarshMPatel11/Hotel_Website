import { Link } from "wouter";
import { useGetHotelInfo } from "@/lib/api-client-react";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const { data: hotel } = useGetHotelInfo();

  return (
    <footer className="bg-[hsl(200_38%_12%)] text-[hsl(36_28%_88%)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 sm:py-14 grid gap-10 text-center md:text-left md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl text-white mb-2">Aurelia Grand</h3>
          <p className="font-eyebrow text-white/60 mb-5">{hotel?.starRating ?? 5}-Star · Since {hotel?.foundedYear ?? 1924}</p>
          <p className="mx-auto md:mx-0 text-sm leading-relaxed text-white/75 max-w-xs">
            {hotel?.tagline ?? "A timeless seaside escape on the Amalfi coast."}
          </p>
          <div className="flex justify-center md:justify-start gap-3 mt-6">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center hover:bg-white/10 transition">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center hover:bg-white/10 transition">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-eyebrow text-[hsl(36_55%_60%)] mb-4">Visit</p>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex justify-center md:justify-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[hsl(36_55%_60%)]" />
              <span>{hotel?.address ?? "Via del Mare 18"}<br/>{hotel?.city ?? "Positano"}, {hotel?.country ?? "Italy"}</span>
            </li>
            <li className="flex justify-center md:justify-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-[hsl(36_55%_60%)]" />
              <span>{hotel?.phone ?? "+39 089 555 1924"}</span>
            </li>
            <li className="flex justify-center md:justify-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-[hsl(36_55%_60%)]" />
              <a href={`mailto:${hotel?.email ?? "reservations@aureliagrand.com"}`} className="hover:text-white">
                {hotel?.email ?? "reservations@aureliagrand.com"}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-eyebrow text-[hsl(36_55%_60%)] mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/rooms" className="text-white/80 hover:text-white">Rooms & Suites</Link></li>
            <li><Link href="/facilities" className="text-white/80 hover:text-white">Facilities</Link></li>
            <li><Link href="/dining" className="text-white/80 hover:text-white">Dining</Link></li>
            <li><Link href="/gallery" className="text-white/80 hover:text-white">Gallery</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-eyebrow text-[hsl(36_55%_60%)] mb-4">Plan</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/book" className="text-white/80 hover:text-white">Book a Stay</Link></li>
            <li><Link href="/events" className="text-white/80 hover:text-white">Weddings & Events</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white">Contact & Directions</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/55">
          <p>© {new Date().getFullYear()} Aurelia Grand. All rights reserved.</p>
          <p>Reception open 24 hours · Concierge 7:00 — 23:00</p>
        </div>
      </div>
    </footer>
  );
}
