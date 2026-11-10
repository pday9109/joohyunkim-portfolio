import { readFile } from "fs/promises";
import path from "path";

import type { WorkYearData } from "@/lib/types/artwork";

export async function getWorksByYear(year: number): Promise<WorkYearData> {
  const filePath = path.join(process.cwd(), "content", "works", `${year}.json`);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as WorkYearData;
}
