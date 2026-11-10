import Link from "next/link";

import { MainNav } from "@/components/layout/MainNav";
import { getSiteConfig } from "@/lib/data/getSiteConfig";

export async function SiteHeader() {
  const site = await getSiteConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm tracking-[0.15em] transition-opacity hover:opacity-60"
        >
          {site.artistNameEn}
        </Link>
        <MainNav variant="default" />
      </div>
    </header>
  );
}
