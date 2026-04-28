import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, description, align = "center", className, light }: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("font-eyebrow mb-4", light ? "text-[hsl(36_55%_60%)]" : "text-accent")}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("font-display text-4xl sm:text-5xl leading-[1.1]", light ? "text-white" : "text-foreground")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base sm:text-lg leading-relaxed", light ? "text-white/75" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
