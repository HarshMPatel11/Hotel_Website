import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/facilities", label: "Facilities" },
  { href: "/dining", label: "Dining" },
  { href: "/events", label: "Events & Weddings" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-md border-b border-border shadow-xs",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-2xl tracking-tight transition-colors",
              transparent ? "text-white" : "text-foreground",
            )}
          >
            Aurelia Grand
          </span>
          <span
            className={cn(
              "font-eyebrow mt-1 transition-colors",
              transparent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            Positano · Est. 1924
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.slice(1).map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:opacity-100",
                  transparent ? "text-white/85 hover:text-white" : "text-foreground/80 hover:text-foreground",
                  active && (transparent ? "text-white" : "text-foreground"),
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/book" className="hidden sm:block">
            <Button
              size="sm"
              className={cn(
                "rounded-full px-5 h-10 font-medium",
                transparent
                  ? "bg-white text-[hsl(200_45%_22%)] hover:bg-white/90"
                  : "bg-primary text-primary-foreground",
              )}
            >
              Book Now
            </Button>
          </Link>
          <button
            className={cn(
              "lg:hidden p-2 rounded-md",
              transparent ? "text-white" : "text-foreground",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base text-foreground/85 hover:text-foreground border-b border-border/50 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="mt-3">
              <Button className="w-full rounded-full">Book Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
