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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String((Number(adults) || 1) + (Number(children) || 0)),
      adults: adults || "1",
      children: children || "0",
    });
    setLocation(`/book?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={
        isHero
          ? "bg-white/95 backdrop-blur-md border border-white/40 shadow-xl rounded-md p-6 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto] gap-4 items-end"
          : "bg-card border border-card-border shadow-sm rounded-md p-6 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto] gap-4 items-end"
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
          min={checkIn || todayPlus(1)}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-2 h-12 text-base"
          required
        />
      </div>
      <div>
        <Label htmlFor="adults" className="font-eyebrow text-muted-foreground">Adults</Label>
        <Input
          id="adults"
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          className="mt-2 h-12 text-base"
          required
        />
      </div>
      <div>
        <Label htmlFor="children" className="font-eyebrow text-muted-foreground">Children</Label>
        <Input
          id="children"
          type="number"
          min={0}
          value={children}
          onChange={(e) => setChildren(e.target.value)}
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
