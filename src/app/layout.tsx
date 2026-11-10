import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";

import "@/styles/globals.css";
import { getBaseMetadata } from "@/lib/metadata";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-typewriter",
});

export async function generateMetadata(): Promise<Metadata> {
  return getBaseMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${courierPrime.variable} h-full`}>
      <body className="min-h-full bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
