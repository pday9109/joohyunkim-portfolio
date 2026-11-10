import { SiteHeader } from "@/components/layout/SiteHeader";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export async function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
