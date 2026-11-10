import { ExhibitionItem } from "@/components/exhibition/ExhibitionItem";
import type { Exhibition } from "@/lib/types/exhibition";

interface ExhibitionListProps {
  exhibitions: Exhibition[];
}

export function ExhibitionList({ exhibitions }: ExhibitionListProps) {
  if (exhibitions.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-text-muted">
        등록된 전시 정보가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {exhibitions.map((exhibition) => (
        <ExhibitionItem key={exhibition.id} exhibition={exhibition} />
      ))}
    </div>
  );
}
