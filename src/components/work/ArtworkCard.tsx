import Image from "next/image";

import type { Artwork } from "@/lib/types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left"
      aria-label={`${artwork.title} 상세 보기`}
    >
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
        <p className="text-xs text-text-muted md:text-sm">{artwork.material}</p>
        <p className="text-xs text-text-muted md:text-sm">
          {artwork.size} · {artwork.year}
        </p>
      </div>
    </button>
  );
}
