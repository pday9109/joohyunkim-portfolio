"use client";

import { useRouter } from "next/navigation";

import { Tab } from "@/components/ui/Tab";

interface YearFilterProps {
  years: number[];
  activeYear: number;
}

export function YearFilter({ years, activeYear }: YearFilterProps) {
  const router = useRouter();
  const handleSelect = (year: number) => {
    router.push(`/work/?year=${year}`);
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
