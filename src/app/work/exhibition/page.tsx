import { Suspense } from "react";

import { ExhibitionList } from "@/components/exhibition/ExhibitionList";
import { ExhibitionTabs } from "@/components/exhibition/ExhibitionTabs";
import { getExhibitions } from "@/lib/data/getExhibitions";
import { getSiteConfig } from "@/lib/data/getSiteConfig";
import type { ExhibitionType } from "@/lib/types/exhibition";

interface ExhibitionPageProps {
  searchParams: Promise<{ tab?: string }>;
}

function resolveExhibitionTab(
  tab: string | undefined,
  defaultTab: ExhibitionType,
): ExhibitionType {
  if (tab === "group") return "group";
  if (tab === "solo") return "solo";
  return defaultTab;
}

export default async function ExhibitionPage({
  searchParams,
}: ExhibitionPageProps) {
  const [site, params] = await Promise.all([getSiteConfig(), searchParams]);
  const activeTab = resolveExhibitionTab(params.tab, site.defaultExhibitionTab);

  const exhibitionData = await getExhibitions(activeTab);

  return (
    <>
      <Suspense fallback={<div className="mb-12 h-8" />}>
        <ExhibitionTabs activeTab={activeTab} />
      </Suspense>
      <ExhibitionList exhibitions={exhibitionData.exhibitions} />
    </>
  );
}
