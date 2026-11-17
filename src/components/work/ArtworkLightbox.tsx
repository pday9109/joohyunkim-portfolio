"use client";

import { ImageZoomLightbox } from "@/components/ui/ImageZoomLightbox";
import type { Artwork } from "@/lib/types/artwork";
import { assetPath } from "@/lib/utils/assetPath";

interface ArtworkLightboxProps {
  artworks: Artwork[];
  open: boolean;
  index: number;
  onClose: () => void;
}

export function ArtworkLightbox({ artworks, open, index, onClose }: ArtworkLightboxProps) {
  const artwork = artworks[index];

  return (
    <ImageZoomLightbox
      open={open && Boolean(artwork)}
      src={artwork ? assetPath(artwork.imageFull ?? artwork.image) : ""}
      alt={artwork?.title ?? ""}
      onClose={onClose}
    />
  );
}
