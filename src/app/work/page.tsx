import { Suspense } from "react";

import { WorkBrowser, WorkYearView } from "@/components/work/WorkBrowser";
import { getSiteConfig } from "@/lib/data/getSiteConfig";
import { getWorksByYear } from "@/lib/data/getWorksByYear";
import type { Artwork } from "@/lib/types/artwork";

export default async function WorkPage() {
  const site = await getSiteConfig();

  const worksByYear: Record<number, Artwork[]> = {};
  for (const year of site.workYears) {
    const workData = await getWorksByYear(year);
    worksByYear[year] = [...workData.artworks].sort((a, b) => a.order - b.order);
  }

  return (
    <Suspense
      fallback={
        <WorkYearView
          years={site.workYears}
          activeYear={site.defaultWorkYear}
          worksByYear={worksByYear}
        />
      }
    >
      <WorkBrowser
        years={site.workYears}
        defaultYear={site.defaultWorkYear}
        worksByYear={worksByYear}
      />
    </Suspense>
  );
}
