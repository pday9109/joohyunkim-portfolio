"use client";

import { useSearchParams } from "next/navigation";

import { ExhibitionList } from "@/components/exhibition/ExhibitionList";
import { ExhibitionTabs } from "@/components/exhibition/ExhibitionTabs";
import type { Exhibition, ExhibitionType } from "@/lib/types/exhibition";

interface ExhibitionTabViewProps {
  activeTab: ExhibitionType;
  exhibitionsByType: Record<ExhibitionType, Exhibition[]>;
}

export function ExhibitionTabView({ activeTab, exhibitionsByType }: ExhibitionTabViewProps) {
  return (
    <>
      <ExhibitionTabs activeTab={activeTab} />
      <ExhibitionList exhibitions={exhibitionsByType[activeTab]} />
    </>
  );
}

interface ExhibitionBrowserProps {
  defaultTab: ExhibitionType;
  exhibitionsByType: Record<ExhibitionType, Exhibition[]>;
}

export function ExhibitionBrowser({ defaultTab, exhibitionsByType }: ExhibitionBrowserProps) {
  const tab = useSearchParams().get("tab");
  const activeTab: ExhibitionType = tab === "solo" || tab === "group" ? tab : defaultTab;

  return <ExhibitionTabView activeTab={activeTab} exhibitionsByType={exhibitionsByType} />;
}
