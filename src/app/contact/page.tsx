import type { Metadata } from "next";
import Image from "next/image";

import { ContactAnimatedContent } from "@/components/contact/ContactAnimatedContent";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { getContact } from "@/lib/data/getContact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "김주현 작가 연락처",
);

export default async function ContactPage() {
  const contact = await getContact();
  const backgroundImage =
    contact.backgroundImage ?? "/images/works/2023/work_01_main.webp";

  return (
    <SiteLayout>
      <main className="relative flex min-h-[calc(100vh-4.5rem)] flex-col overflow-hidden">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bg-dark/45" />

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 md:px-10 md:py-24">
          <ContactAnimatedContent
            email={contact.email}
            instagram={contact.instagram}
          />
        </div>
      </main>
    </SiteLayout>
  );
}
