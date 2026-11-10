"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tab } from "@/components/ui/Tab";
import type { ExhibitionType } from "@/lib/types/exhibition";

interface ExhibitionTabsProps {
  activeTab: ExhibitionType;
}

const tabs: { id: ExhibitionType; label: string; subLabel: string }[] = [
  { id: "solo", label: "Solo Exhibition", subLabel: "개인전" },
  { id: "group", label: "Group Exhibition", subLabel: "그룹전" },
];

export function ExhibitionTabs({ activeTab }: ExhibitionTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (tab: ExhibitionType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/work/exhibition?${params.toString()}`);
  };

  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-b border-border pb-4">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          subLabel={tab.subLabel}
          isActive={activeTab === tab.id}
          onClick={() => handleSelect(tab.id)}
        />
      ))}
    </div>
  );
}
