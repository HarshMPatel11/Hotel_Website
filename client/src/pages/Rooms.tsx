import { useState } from "react";
import { useListRooms } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Rooms() {
  const { data: rooms, isLoading } = useListRooms();
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(rooms?.map((r) => r.category) ?? []))];
  const filtered = filter === "All" ? rooms : rooms?.filter((r) => r.category === filter);

  return (
    <div>
      <PageHero
        eyebrow="Rooms & Suites"
        title="48 rooms. 48 different views of the sea."
        description="From garden-view classics to the cliffside Aurelia Suite, every room is its own private vantage on the Tyrrhenian."
        image="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {categories.map((c) => (
              <Button
                key={c}
                variant={filter === c ? "default" : "outline"}
                size="sm"
                className={cn("rounded-full px-5", filter === c && "bg-primary text-primary-foreground")}
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          )}

          {filtered && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((room) => <RoomCard key={room.id} room={room} />)}
            </div>
          )}

          {filtered?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No rooms in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
}
