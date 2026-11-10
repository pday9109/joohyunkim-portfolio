"use client";

import { useSearchParams } from "next/navigation";

import { ArtworkGrid } from "@/components/work/ArtworkGrid";
import { YearFilter } from "@/components/work/YearFilter";
import type { Artwork } from "@/lib/types/artwork";

interface WorkYearViewProps {
  years: number[];
  activeYear: number;
  worksByYear: Record<number, Artwork[]>;
}

export function WorkYearView({ years, activeYear, worksByYear }: WorkYearViewProps) {
  return (
    <>
      <YearFilter years={years} activeYear={activeYear} />
      <ArtworkGrid key={activeYear} artworks={worksByYear[activeYear] ?? []} />
    </>
  );
}

interface WorkBrowserProps {
  years: number[];
  defaultYear: number;
  worksByYear: Record<number, Artwork[]>;
}

export function WorkBrowser({ years, defaultYear, worksByYear }: WorkBrowserProps) {
  const searchParams = useSearchParams();
  const requestedYear = Number(searchParams.get("year"));
  const activeYear = years.includes(requestedYear) ? requestedYear : defaultYear;

  return <WorkYearView years={years} activeYear={activeYear} worksByYear={worksByYear} />;
}
