import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { WorkSubNav } from "@/components/layout/WorkSubNav";
import { getSiteConfig } from "@/lib/data/getSiteConfig";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Work",
  "김주현 작가 작품 아카이브",
);

export default async function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();

  return (
    <SiteLayout>
      <main className="page-enter">
        <PageContainer>
          <PageHeader title="Work" subtitle={site.artistNameEn} />
          <WorkSubNav />
          {children}
        </PageContainer>
      </main>
    </SiteLayout>
  );
}
