interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
}

export default function PageHero({ eyebrow, title, description, image }: Props) {
  return (
    <section className="relative h-[64vh] min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col items-center lg:items-start justify-end pb-12 sm:pb-16 pt-40 text-center lg:text-left text-white">
        <p className="font-eyebrow text-[hsl(36_55%_72%)] mb-4">{eyebrow}</p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">{title}</h1>
        {description && (
          <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
