"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";

import type { Artwork } from "@/lib/types/artwork";
import { assetPath } from "@/lib/utils/assetPath";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface ArtworkLightboxProps {
  artworks: Artwork[];
  open: boolean;
  index: number;
  onClose: () => void;
}

export function ArtworkLightbox({
  artworks,
  open,
  index,
  onClose,
}: ArtworkLightboxProps) {
  const slides = artworks.map((artwork) => ({
    src: assetPath(artwork.imageFull ?? artwork.image),
    title: artwork.title,
    description: `${artwork.material} · ${artwork.size} · ${artwork.year}`,
  }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Captions]}
      captions={{ showToggle: false, descriptionTextAlign: "center" }}
      styles={{
        container: { backgroundColor: "rgba(30, 30, 30, 0.96)" },
        button: { filter: "none" },
      }}
    />
  );
}
