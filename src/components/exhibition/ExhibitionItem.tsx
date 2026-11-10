import { ExhibitionGallery } from "@/components/exhibition/ExhibitionGallery";
import type { Exhibition } from "@/lib/types/exhibition";

interface ExhibitionItemProps {
  exhibition: Exhibition;
}

export function ExhibitionItem({ exhibition }: ExhibitionItemProps) {
  return (
    <article className="space-y-8 border-b border-border pb-16 last:border-b-0 last:pb-0">
      <header className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
          {exhibition.title}
        </h2>
        {exhibition.text ? (
          <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-text-muted">
            {exhibition.text}
          </p>
        ) : null}
      </header>

      <ExhibitionGallery title={exhibition.title} images={exhibition.images} />
    </article>
  );
}
