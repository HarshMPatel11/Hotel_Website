import { Link, useRoute } from "wouter";
import { useListRooms } from "@/lib/api-client-react";
import { Users, Maximize, Bed, Eye, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

export default function RoomDetail() {
  const [, params] = useRoute("/rooms/:slug");
  const slug = params?.slug ?? "";
  const { data: rooms, isLoading } = useListRooms();
  const room = rooms?.find((r) => r.slug === slug);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return <div className="min-h-screen pt-32 px-6"><div className="mx-auto max-w-7xl"><div className="aspect-[16/9] bg-muted animate-pulse rounded-md" /></div></div>;
  }
  if (!room) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="font-display text-4xl mb-4">Room not found</h1>
        <Link href="/rooms"><Button variant="outline">Back to rooms</Button></Link>
      </div>
    );
  }

  const symbol = CURRENCY_SYMBOL[room.currency] ?? room.currency;
  const images = room.images.length > 0 ? room.images : ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80"];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-8">
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> All rooms
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-8 grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
            <img src={images[activeImage]} alt={room.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/3] overflow-hidden rounded-md border-2 transition ${i === activeImage ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-eyebrow text-accent">{room.category}</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-3">{room.name}</h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">{room.description}</p>

          <div className="grid grid-cols-2 gap-4 my-8 py-6 border-y border-border">
            <div className="flex items-center gap-3">
              <Maximize size={18} className="text-accent" />
              <div><p className="text-xs text-muted-foreground">Size</p><p className="font-medium">{room.sizeSqm} m²</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Users size={18} className="text-accent" />
              <div><p className="text-xs text-muted-foreground">Guests</p><p className="font-medium">Up to {room.capacity}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Bed size={18} className="text-accent" />
              <div><p className="text-xs text-muted-foreground">Bed</p><p className="font-medium">{room.bedType}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-accent" />
              <div><p className="text-xs text-muted-foreground">View</p><p className="font-medium">{room.view}</p></div>
            </div>
          </div>

          {room.amenities?.length > 0 && (
            <div>
              <p className="font-eyebrow text-muted-foreground mb-3">In your room</p>
              <ul className="grid grid-cols-2 gap-y-2 text-sm">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-foreground/85">
                    <Check size={14} className="text-accent" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto pt-8 flex items-end justify-between">
            <div>
              <p className="font-eyebrow text-muted-foreground">From</p>
              <p className="font-display text-4xl text-primary">
                {symbol}{room.pricePerNight.toLocaleString()}
                <span className="font-sans text-sm text-muted-foreground font-normal ml-2">/ night</span>
              </p>
            </div>
            <Link href={`/book?roomId=${room.id}`}>
              <Button size="lg" className="rounded-full px-8">Reserve</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
