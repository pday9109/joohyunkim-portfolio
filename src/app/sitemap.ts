import type { MetadataRoute } from "next";

import { getSiteConfig } from "@/lib/data/getSiteConfig";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joohyunkim.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteConfig();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/work`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/work/exhibition`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const yearPages: MetadataRoute.Sitemap = site.workYears.map((year) => ({
    url: `${siteUrl}/work?year=${year}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...yearPages];
}
