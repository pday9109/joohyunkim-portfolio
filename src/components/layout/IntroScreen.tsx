import Image from "next/image";

import { MainNav } from "@/components/layout/MainNav";

interface IntroScreenProps {
  artistNameEn: string;
  backgroundImage: string;
}

export function IntroScreen({ artistNameEn, backgroundImage }: IntroScreenProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-bg-dark/35" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center md:gap-12">
        <div className="intro-name flex flex-col items-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.12em] text-white md:text-5xl">
            {artistNameEn}
          </h1>
        </div>

        <MainNav variant="intro" className="intro-nav" />
      </div>
    </section>
  );
}
