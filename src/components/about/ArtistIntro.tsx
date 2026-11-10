interface ArtistIntroProps {
  intro: string;
}

export function ArtistIntro({ intro }: ArtistIntroProps) {
  const paragraphs = intro.split("\n\n").filter(Boolean);
  const [lead, ...rest] = paragraphs;

  if (!lead) {
    return null;
  }

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-14 md:items-start">
      <p className="border-l-2 border-border pl-5 text-base leading-8 font-medium text-text md:pl-6 md:text-lg md:leading-8">
        {lead}
      </p>
      <div className="space-y-6 text-base leading-8 text-text-muted md:text-lg md:leading-8">
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
