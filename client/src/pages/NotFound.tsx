import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 grid place-items-center px-6 text-center">
      <div>
        <p className="font-eyebrow text-accent mb-4">Error 404</p>
        <h1 className="font-display text-6xl sm:text-8xl mb-5">Lost on the coast.</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for has slipped away. Let us guide you back.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">Return home</Button>
        </Link>
      </div>
    </div>
  );
}
