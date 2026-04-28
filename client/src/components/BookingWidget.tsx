import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  variant?: "hero" | "inline";
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingWidget({ variant = "hero" }: Props) {
  const [, setLocation] = useLocation();
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(10));
  const [guests, setGuests] = useState(2);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    setLocation(`/book?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={
        isHero
          ? "bg-white/95 backdrop-blur-md border border-white/40 shadow-xl rounded-md p-6 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
          : "bg-card border border-card-border shadow-sm rounded-md p-6 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
      }
    >
      <div>
        <Label htmlFor="ci" className="font-eyebrow text-muted-foreground">Check in</Label>
        <Input
          id="ci"
          type="date"
          value={checkIn}
          min={todayPlus(0)}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-2 h-12 text-base"
          required
        />
      </div>
      <div>
        <Label htmlFor="co" className="font-eyebrow text-muted-foreground">Check out</Label>
        <Input
          id="co"
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-2 h-12 text-base"
          required
        />
      </div>
      <div>
        <Label htmlFor="g" className="font-eyebrow text-muted-foreground">Guests</Label>
        <Input
          id="g"
          type="number"
          min={1}
          max={6}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-2 h-12 text-base"
          required
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-8 rounded-md font-medium">
        Check Availability
      </Button>
    </form>
  );
}
