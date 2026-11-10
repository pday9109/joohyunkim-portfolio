import { readFile } from "fs/promises";
import path from "path";

import type { Exhibition, ExhibitionData, ExhibitionType } from "@/lib/types/exhibition";

function parseExhibitionYear(exhibition: Exhibition): number {
  if (exhibition.year) return exhibition.year;

  const titleMatch = exhibition.title.match(/\((\d{4})\)/);
  if (titleMatch) return Number(titleMatch[1]);

  const prefixMatch = exhibition.title.match(/^(\d{4})/);
  if (prefixMatch) return Number(prefixMatch[1]);

  const idMatch = exhibition.id.match(/(\d{4})/);
  if (idMatch) return Number(idMatch[1]);

  return 0;
}

function sortExhibitions(exhibitions: Exhibition[]): Exhibition[] {
  return [...exhibitions].sort((a, b) => {
    const yearDiff = parseExhibitionYear(b) - parseExhibitionYear(a);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title, "ko");
  });
}

export async function getExhibitions(
  type: ExhibitionType,
): Promise<ExhibitionData> {
  const filePath = path.join(process.cwd(), "content", "exhibitions", `${type}.json`);
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as ExhibitionData;

  return {
    ...data,
    exhibitions: sortExhibitions(data.exhibitions),
  };
}
