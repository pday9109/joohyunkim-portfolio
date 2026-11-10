interface ContactLinksProps {
  email: string;
  instagram: string;
  variant?: "default" | "onImage";
}

export function ContactLinks({
  email,
  instagram,
  variant = "default",
}: ContactLinksProps) {
  const onImage = variant === "onImage";

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p
          className={
            onImage
              ? "text-xs tracking-[0.2em] text-white/55 uppercase"
              : "text-xs tracking-[0.2em] text-text-muted uppercase"
          }
        >
          Email
        </p>
        <a
          href={`mailto:${email}`}
          className={
            onImage
              ? "font-[family-name:var(--font-display)] text-xl tracking-wide text-white/85 transition-opacity hover:text-white"
              : "font-[family-name:var(--font-display)] text-xl tracking-wide transition-opacity hover:opacity-60"
          }
        >
          {email}
        </a>
      </div>

      <div className="space-y-2">
        <p
          className={
            onImage
              ? "text-xs tracking-[0.2em] text-white/55 uppercase"
              : "text-xs tracking-[0.2em] text-text-muted uppercase"
          }
        >
          Instagram
        </p>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={
            onImage
              ? "font-[family-name:var(--font-display)] text-xl tracking-wide text-white/85 transition-opacity hover:text-white"
              : "font-[family-name:var(--font-display)] text-xl tracking-wide transition-opacity hover:opacity-60"
          }
        >
          {instagram.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      </div>
    </div>
  );
}
