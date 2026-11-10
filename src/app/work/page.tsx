import { Suspense } from "react";

import { ArtworkGrid } from "@/components/work/ArtworkGrid";
import { YearFilter } from "@/components/work/YearFilter";
import { getSiteConfig } from "@/lib/data/getSiteConfig";
import { getWorksByYear } from "@/lib/data/getWorksByYear";

interface WorkPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const site = await getSiteConfig();
  const params = await searchParams;
  const requestedYear = Number(params.year);
  const activeYear = site.workYears.includes(requestedYear)
    ? requestedYear
    : site.defaultWorkYear;

  const workData = await getWorksByYear(activeYear);
  const sortedArtworks = [...workData.artworks].sort((a, b) => a.order - b.order);

  return (
    <>
      <Suspense fallback={<div className="mb-12 h-8" />}>
        <YearFilter years={site.workYears} activeYear={activeYear} />
      </Suspense>
      <ArtworkGrid artworks={sortedArtworks} />
    </>
  );
}
