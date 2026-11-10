"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ContactAnimatedContentProps {
  email: string;
  instagram: string;
}

interface AnimatedBlockProps {
  visible: boolean;
  delay: number;
  className?: string;
  children: ReactNode;
}

function AnimatedBlock({
  visible,
  delay,
  className,
  children,
}: AnimatedBlockProps) {
  return (
    <div
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ContactAnimatedContent({
  email,
  instagram,
}: ContactAnimatedContentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const instagramLabel = instagram.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <>
      <AnimatedBlock visible={visible} delay={150} className="mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white md:text-4xl">
          Contact
        </h1>
      </AnimatedBlock>

      <div className="space-y-10">
        <AnimatedBlock visible={visible} delay={350} className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-white/55 uppercase">
            Email
          </p>
          <a
            href={`mailto:${email}`}
            className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white/85 transition-opacity hover:text-white"
          >
            {email}
          </a>
        </AnimatedBlock>

        <AnimatedBlock visible={visible} delay={550} className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-white/55 uppercase">
            Instagram
          </p>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white/85 transition-opacity hover:text-white"
          >
            {instagramLabel}
          </a>
        </AnimatedBlock>
      </div>
    </>
  );
}
