interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-12">
      {subtitle ? (
        <p className="mb-2 text-xs tracking-[0.2em] text-text-muted uppercase">
          {subtitle}
        </p>
      ) : null}
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide md:text-4xl">
        {title}
      </h1>
    </div>
  );
}
