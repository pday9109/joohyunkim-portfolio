import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { CvData } from "@/lib/types/about";

interface CvSectionProps {
  cvFile: string;
  cv?: CvData;
}

export function CvSection({ cvFile, cv }: CvSectionProps) {
  return (
    <section className="mt-20 border-t border-border pt-14">
      <ScrollReveal trigger="deep" intensity="noticeable">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
            CV
          </h2>
          <Link href={cvFile} download>
            <Button>CV Download</Button>
          </Link>
        </div>
      </ScrollReveal>

      {cv ? (
        <div className="max-w-3xl space-y-12">
          {cv.summary ? (
            <ScrollReveal trigger="deep" intensity="noticeable" delay={120}>
              <p className="whitespace-pre-line text-base leading-8 text-text">
                {cv.summary}
              </p>
            </ScrollReveal>
          ) : null}

          {cv.sections.map((section, index) => (
            <ScrollReveal
              key={section.title}
              trigger="deep"
              intensity="noticeable"
              delay={240 + index * 160}
            >
              <div>
                <h3 className="mb-5 font-[family-name:var(--font-display)] text-lg tracking-wide text-text md:text-xl">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm leading-7 text-text md:text-base">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal trigger="deep" intensity="noticeable" delay={120}>
          <p className="max-w-2xl text-sm leading-7 text-text-muted">
            학력, 전시 등 작가 이력은 PDF 파일로 제공됩니다.
          </p>
        </ScrollReveal>
      )}
    </section>
  );
}
