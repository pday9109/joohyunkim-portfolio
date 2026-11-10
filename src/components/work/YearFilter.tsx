"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tab } from "@/components/ui/Tab";

interface YearFilterProps {
  years: number[];
  activeYear: number;
}

export function YearFilter({ years, activeYear }: YearFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (year: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(year));
    router.push(`/work?${params.toString()}`);
  };

  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {years.map((year) => (
        <Tab
          key={year}
          label={String(year)}
          isActive={year === activeYear}
          onClick={() => handleSelect(year)}
        />
      ))}
    </div>
  );
}
