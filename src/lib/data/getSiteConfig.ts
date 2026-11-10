import { readFile } from "fs/promises";
import path from "path";

import type { SiteConfig } from "@/lib/types/site";

export async function getSiteConfig(): Promise<SiteConfig> {
  const filePath = path.join(process.cwd(), "content", "site.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as SiteConfig;
}
