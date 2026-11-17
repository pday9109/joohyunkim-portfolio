"use client";

import { useState } from "react";
import Image from "next/image";

import { ImageZoomLightbox } from "@/components/ui/ImageZoomLightbox";
import { assetPath } from "@/lib/utils/assetPath";

interface ExhibitionGalleryProps {
  title: string;
  images: string[];
}

export function ExhibitionGallery({ title, images }: ExhibitionGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const currentImage = images[index];

  return (
    <>
      <div className="grid grid-cols-2 items-start gap-4 md:gap-6">
        {images.map((image, imageIndex) => (
          <button
            key={`${title}-${imageIndex}`}
            type="button"
            onClick={() => {
              setIndex(imageIndex);
              setOpen(true);
            }}
            className="group block w-full overflow-hidden bg-white/40 text-left"
            aria-label={`${title} 전시 전경 ${imageIndex + 1} 확대`}
          >
            <Image
              src={assetPath(image)}
              alt={`${title} installation ${imageIndex + 1}`}
              width={0}
              height={0}
              className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 50vw, 480px"
            />
          </button>
        ))}
      </div>

      <ImageZoomLightbox
        open={open && Boolean(currentImage)}
        src={currentImage ? assetPath(currentImage) : ""}
        alt={currentImage ? `${title} installation ${index + 1}` : title}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
