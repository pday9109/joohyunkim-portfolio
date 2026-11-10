"use client";

import { useState } from "react";

import { ArtworkCard } from "@/components/work/ArtworkCard";
import { ArtworkLightbox } from "@/components/work/ArtworkLightbox";
import type { Artwork } from "@/lib/types/artwork";

interface ArtworkGridProps {
  artworks: Artwork[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-text-muted">
        해당 연도의 작품이 아직 등록되지 않았습니다.
      </p>
    );
  }

  return (
    <>
      <div className="mx-auto grid max-w-4xl grid-cols-2 items-start gap-5 md:gap-x-8 md:gap-y-12">
        {artworks.map((artwork, artworkIndex) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onClick={() => {
              setIndex(artworkIndex);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <ArtworkLightbox
        artworks={artworks}
        open={open}
        index={index}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
