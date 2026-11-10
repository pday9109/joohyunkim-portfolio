"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Scroll deeper into view before animating */
  trigger?: "default" | "deep";
  /** Motion distance and duration presets */
  intensity?: "subtle" | "noticeable";
}

const triggerOptions = {
  default: { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  deep: { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
} as const;

const intensityClasses = {
  subtle: {
    hidden: "translate-y-5 opacity-0",
    visible: "translate-y-0 opacity-100",
    duration: "duration-700",
  },
  noticeable: {
    hidden: "translate-y-8 opacity-0",
    visible: "translate-y-0 opacity-100",
    duration: "duration-1000",
  },
} as const;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  trigger = "default",
  intensity = "subtle",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const motion = intensityClasses[intensity];

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      triggerOptions[trigger],
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        motion.duration,
        visible ? motion.visible : motion.hidden,
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
