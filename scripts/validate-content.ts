import { access } from "fs/promises";
import { readFile } from "fs/promises";
import path from "path";

import type { AboutData } from "../src/lib/types/about";
import type { WorkYearData } from "../src/lib/types/artwork";
import type { ContactData } from "../src/lib/types/contact";
import type { ExhibitionData } from "../src/lib/types/exhibition";
import type { SiteConfig } from "../src/lib/types/site";

const root = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];

async function fileExists(relativePath: string): Promise<boolean> {
  try {
    await access(path.join(root, "public", relativePath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(relativePath: string): Promise<T> {
  const filePath = path.join(root, relativePath);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function validateImagePaths(label: string, paths: string[]) {
  for (const imagePath of paths) {
    const exists = await fileExists(imagePath);
    if (!exists) {
      errors.push(`[${label}] Missing image: ${imagePath}`);
    }
  }
}

async function main() {
  const site = await readJson<SiteConfig>("content/site.json");

  if (!site.artistName) {
    errors.push("[site.json] artistName is required");
  }

  if (!site.mainBackgroundImage) {
    errors.push("[site.json] mainBackgroundImage is required");
  } else {
    await validateImagePaths("site.json", [site.mainBackgroundImage]);
  }

  const about = await readJson<AboutData>("content/about.json");
  if (about.cvFile) {
    const cvExists = await fileExists(about.cvFile);
    if (!cvExists) {
      warnings.push(`[about.json] CV file not found: ${about.cvFile}`);
    }
  }
  if (about.profileImage) {
    await validateImagePaths("about.json", [about.profileImage]);
  }

  const contact = await readJson<ContactData>("content/contact.json");
  if (!contact.email) {
    errors.push("[contact.json] email is required");
  }
  if (!contact.instagram) {
    errors.push("[contact.json] instagram is required");
  }

  for (const year of site.workYears) {
    const workPath = `content/works/${year}.json`;
    try {
      const work = await readJson<WorkYearData>(workPath);
      for (const artwork of work.artworks) {
        if (!artwork.title || !artwork.image) {
          errors.push(`[${workPath}] artwork ${artwork.id} is missing title or image`);
        }
        await validateImagePaths(workPath, [artwork.image]);
      }
    } catch {
      errors.push(`[works] Missing file: ${workPath}`);
    }
  }

  for (const type of ["solo", "group"] as const) {
    const exhibitionPath = `content/exhibitions/${type}.json`;
    const exhibition = await readJson<ExhibitionData>(exhibitionPath);
    for (const item of exhibition.exhibitions) {
      if (!item.title) {
        errors.push(`[${exhibitionPath}] exhibition ${item.id} is missing title`);
      }
      await validateImagePaths(exhibitionPath, item.images);
    }
  }

  const mainBackground = await fileExists(site.mainBackgroundImage);
  if (!mainBackground) {
    const jpgFallback = site.mainBackgroundImage.replace(/\.(svg|png)$/i, ".jpg");
    const jpgExists =
      jpgFallback !== site.mainBackgroundImage &&
      (await fileExists(jpgFallback));
    if (!jpgExists) {
      warnings.push(`[site.json] main background not found: ${site.mainBackgroundImage}`);
    }
  }

  const legacyMainSvg = await fileExists("/images/main/main_background.svg");
  const legacyMainJpg = await fileExists("/images/main/main_background.jpg");
  if (!legacyMainSvg && !legacyMainJpg && !mainBackground) {
    warnings.push("[main] main_background image not found");
  }

  if (warnings.length > 0) {
    console.warn("Warnings:");
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  if (errors.length > 0) {
    console.error("Validation failed:");
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log("Content validation passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
