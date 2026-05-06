import { useState } from "react";
import { useListGallery } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const { data: items, isLoading } = useListGallery();
  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(items?.map((i) => i.category) ?? []))];
  const filtered = filter === "All" ? items : items?.filter((i) => i.category === filter);

  return (
    <div>
      <PageHero
        eyebrow="Gallery"
        title="A hotel told in pictures."
        description="A hundred years of mornings, evenings, weddings, and quiet afternoons — captured along the way."
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered?.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightbox(img.image)}
                className={cn(
                  "group relative overflow-hidden rounded-md bg-muted",
                  i % 7 === 0 ? "aspect-square md:col-span-2 md:row-span-2 md:aspect-auto" : "aspect-square",
                )}
              >
                <img
                  src={img.image}
                  alt={img.title ?? img.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-eyebrow text-[hsl(36_55%_72%)] mb-1">{img.category}</p>
                    <p className="font-display text-lg">{img.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] grid place-items-center p-6 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white p-2" aria-label="Close">
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-[min(86vw,1100px)] max-h-[78vh] object-contain rounded-md shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
