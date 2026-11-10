import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide transition-colors duration-200",
        variant === "primary" &&
          "border border-text/20 bg-transparent text-text hover:border-text/40 hover:bg-text/5",
        variant === "ghost" && "text-text-muted hover:text-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
