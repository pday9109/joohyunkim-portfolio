"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

interface ExhibitionGalleryProps {
  title: string;
  images: string[];
}

export function ExhibitionGallery({ title, images }: ExhibitionGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src, imageIndex) => ({
    src,
    alt: `${title} installation ${imageIndex + 1}`,
  }));

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
              src={image}
              alt={`${title} installation ${imageIndex + 1}`}
              width={0}
              height={0}
              className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 50vw, 480px"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(30, 30, 30, 0.96)" },
          button: { filter: "none" },
        }}
      />
    </>
  );
}
