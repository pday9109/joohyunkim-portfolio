import { readFile } from "fs/promises";
import path from "path";

import type { AboutData } from "@/lib/types/about";

export async function getAbout(): Promise<AboutData> {
  const filePath = path.join(process.cwd(), "content", "about.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as AboutData;
}
