import Image from "next/image";

import { assetPath } from "@/lib/utils/assetPath";

interface ProfileImageProps {
  src: string;
  alt: string;
}

export function ProfileImage({ src, alt }: ProfileImageProps) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-white/50">
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 384px"
      />
    </div>
  );
}
