"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { workSubNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

export function WorkSubNav() {
  const activePath = usePathname();

  return (
    <nav className="mb-12 flex items-center justify-center gap-8 border-b border-border pb-4">
      {workSubNavItems.map((item) => {
        const isActive =
          item.href === "/work"
            ? activePath === "/work"
            : activePath.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-[family-name:var(--font-display)] text-sm tracking-[0.15em] uppercase transition-colors duration-200",
              isActive ? "text-text" : "text-text-muted hover:text-text",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
