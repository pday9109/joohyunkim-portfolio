import { readFile } from "fs/promises";
import path from "path";

import type { ContactData } from "@/lib/types/contact";

export async function getContact(): Promise<ContactData> {
  const filePath = path.join(process.cwd(), "content", "contact.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as ContactData;
}
