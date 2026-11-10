import type { Metadata } from "next";

import { ArtistIntro } from "@/components/about/ArtistIntro";
import { CvSection } from "@/components/about/CvSection";
import { FeaturedWorks } from "@/components/about/FeaturedWorks";
import { ProfileImage } from "@/components/about/ProfileImage";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getAbout } from "@/lib/data/getAbout";
import { getWorksByYear } from "@/lib/data/getWorksByYear";
import { getSiteConfig } from "@/lib/data/getSiteConfig";
import { pageMetadata } from "@/lib/metadata";
import type { Artwork } from "@/lib/types/artwork";

export const metadata: Metadata = pageMetadata(
  "About",
  "김주현 작가 소개 및 CV",
);

async function resolveFeaturedWorks(
  refs: { year: number; id: string }[] | undefined,
): Promise<Artwork[]> {
  if (!refs?.length) {
    return [];
  }

  const years = [...new Set(refs.map((ref) => ref.year))];
  const yearData = await Promise.all(years.map((year) => getWorksByYear(year)));
  const byYear = new Map(yearData.map((data) => [data.year, data.artworks]));

  return refs.flatMap((ref) => {
    const artwork = byYear.get(ref.year)?.find((item) => item.id === ref.id);
    return artwork ? [artwork] : [];
  });
}

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAbout(), getSiteConfig()]);
  const featuredArtworks = await resolveFeaturedWorks(about.featuredWorks);

  return (
    <SiteLayout>
      <main>
        <PageContainer>
          <ScrollReveal>
            <PageHeader title="About" subtitle={site.artistNameEn} />
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="grid gap-12 md:grid-cols-[280px_1fr] md:items-start">
              {about.profileImage ? (
                <ProfileImage src={about.profileImage} alt={site.artistName} />
              ) : null}
              <div className={about.profileImage ? "" : "md:col-span-2"}>
                <ArtistIntro intro={about.intro} />
              </div>
            </div>
          </ScrollReveal>

          <CvSection cvFile={about.cvFile} cv={about.cv} />

          <FeaturedWorks artworks={featuredArtworks} />
        </PageContainer>
      </main>
    </SiteLayout>
  );
}
