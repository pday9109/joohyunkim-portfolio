import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/data/getSiteConfig";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joohyunkim.com";

export async function getBaseMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${site.artistName} | ${site.artistNameEn}`,
      template: `%s | ${site.artistName}`,
    },
    description: `${site.artistName} 작가 포트폴리오 — 작품 아카이브 및 전시 기록`,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: site.artistName,
      title: `${site.artistName} | ${site.artistNameEn}`,
      description: `${site.artistName} 작가 포트폴리오`,
      images: [
        {
          url: site.mainBackgroundImage,
          width: 2400,
          height: 1600,
          alt: `${site.artistName} 대표 작품`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.artistName} | ${site.artistNameEn}`,
      description: `${site.artistName} 작가 포트폴리오`,
      images: [site.mainBackgroundImage],
    },
  };
}

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}
