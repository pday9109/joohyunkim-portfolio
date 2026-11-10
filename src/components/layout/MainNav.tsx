"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

interface MainNavProps {
  className?: string;
  variant?: "intro" | "default";
}

function isNavActive(pathname: string, href: string) {
  if (href === "/work") {
    return pathname === "/work" || pathname.startsWith("/work/");
  }
  return pathname === href;
}

export function MainNav({ className, variant = "default" }: MainNavProps) {
  const pathname = usePathname();

  if (variant === "intro") {
    return (
      <nav
        className={cn(
          "grid w-[min(100%,22rem)] grid-cols-3 items-center md:w-[min(100%,28rem)]",
          className,
        )}
        aria-label="Main"
      >
        {mainNavItems.map((item, index) => (
          <div
            key={item.href}
            className="relative flex items-center justify-center"
          >
            {index > 0 && (
              <span
                aria-hidden
                className="absolute top-1/2 left-0 h-2 w-px -translate-y-1/2 bg-white/30"
              />
            )}
            <Link
              href={item.href}
              className="intro-nav-link group relative inline-block px-2 py-1 text-center font-[family-name:var(--font-body)] text-sm tracking-[0.22em] text-white/65 uppercase transition-colors duration-300 hover:text-white md:px-3 md:text-base"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-0.5 h-px origin-center scale-x-0 bg-white/70 transition-transform duration-300 ease-out group-hover:scale-x-100 md:inset-x-3"
              />
            </Link>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("flex items-center justify-center gap-6 md:gap-10", className)}>
      {mainNavItems.map((item) => {
        const isActive = isNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-text uppercase transition-opacity duration-200 hover:opacity-60",
              isActive && "opacity-100 underline decoration-border underline-offset-8",
              !isActive && "opacity-70",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
