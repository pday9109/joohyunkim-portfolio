import { Suspense } from "react";

import {
  ExhibitionBrowser,
  ExhibitionTabView,
} from "@/components/exhibition/ExhibitionBrowser";
import { getExhibitions } from "@/lib/data/getExhibitions";
import { getSiteConfig } from "@/lib/data/getSiteConfig";

export default async function ExhibitionPage() {
  const [site, solo, group] = await Promise.all([
    getSiteConfig(),
    getExhibitions("solo"),
    getExhibitions("group"),
  ]);

  const exhibitionsByType = {
    solo: solo.exhibitions,
    group: group.exhibitions,
  };

  return (
    <Suspense
      fallback={
        <ExhibitionTabView
          activeTab={site.defaultExhibitionTab}
          exhibitionsByType={exhibitionsByType}
        />
      }
    >
      <ExhibitionBrowser
        defaultTab={site.defaultExhibitionTab}
        exhibitionsByType={exhibitionsByType}
      />
    </Suspense>
  );
}
