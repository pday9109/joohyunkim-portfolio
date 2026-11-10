import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default async function NotFound() {
  return (
    <SiteLayout>
      <main className="page-enter">
        <PageContainer narrow>
          <div className="py-24 text-center">
            <p className="mb-4 font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-text-muted uppercase">
              404
            </p>
            <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Page not found
            </h1>
            <p className="mb-10 text-text-muted">
              요청하신 페이지를 찾을 수 없습니다.
            </p>
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-60"
            >
              Home
            </Link>
          </div>
        </PageContainer>
      </main>
    </SiteLayout>
  );
}
