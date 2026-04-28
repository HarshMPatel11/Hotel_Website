import { Link } from "wouter";
import { Users, Maximize, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  sizeSqm: number;
  capacity: number;
  bedType: string;
  view: string;
  pricePerNight: number;
  currency: string;
  images: string[];
}

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

export default function RoomCard({ room }: { room: Room }) {
  const symbol = CURRENCY_SYMBOL[room.currency] ?? room.currency;
  const image = room.images[0] ?? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="group bg-card border border-card-border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col">
      <Link href={`/rooms/${room.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 font-eyebrow text-foreground rounded-sm">
          {room.category}
        </div>
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-2xl mb-1">{room.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{room.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5"><Maximize size={13} />{room.sizeSqm} m²</span>
          <span className="flex items-center gap-1.5"><Users size={13} />{room.capacity} guests</span>
          <span className="flex items-center gap-1.5"><Bed size={13} />{room.bedType}</span>
        </div>
        <div className="flex items-end justify-between border-t border-border pt-4 mt-auto">
          <div>
            <p className="font-eyebrow text-muted-foreground">From</p>
            <p className="font-display text-2xl text-primary">
              {symbol}{room.pricePerNight.toLocaleString()}
              <span className="font-sans text-xs text-muted-foreground font-normal ml-1">/ night</span>
            </p>
          </div>
          <Link href={`/book?roomId=${room.id}`}>
            <Button size="sm" className="rounded-full px-5">Book</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
