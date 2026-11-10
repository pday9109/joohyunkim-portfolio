import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Artwork } from "@/lib/types/artwork";

interface FeaturedWorksProps {
  artworks: Artwork[];
}

export function FeaturedWorks({ artworks }: FeaturedWorksProps) {
  if (artworks.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 border-t border-border pt-14">
      <ScrollReveal>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs tracking-[0.2em] text-text-muted uppercase">
              Selected Works
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Recent Works
            </h2>
          </div>
          <Link
            href="/work"
            className="font-[family-name:var(--font-display)] text-sm tracking-[0.15em] text-text-muted uppercase transition-colors hover:text-text"
          >
            View Works →
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-3 md:gap-10">
        {artworks.map((artwork, index) => (
          <ScrollReveal key={`${artwork.year}-${artwork.id}`} delay={index * 100}>
            <Link href="/work" className="group block">
              <div className="overflow-hidden bg-white/40">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  width={0}
                  height={0}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-[family-name:var(--font-display)] text-sm tracking-wide md:text-base">
                  {artwork.title}
                </h3>
                <p className="text-xs text-text-muted md:text-sm">
                  {artwork.year}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
