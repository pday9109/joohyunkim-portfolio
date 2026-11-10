import { access, constants, copyFile, mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const CONTENT = path.join(ROOT, "content");

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg|tiff?)$/i;

const SIZES = {
  grid: { width: 1200, quality: 85 },
  full: { width: 2000, quality: 88 },
  hero: { width: 2400, quality: 88 },
  exhibition: { width: 1920, quality: 85 },
  profile: { width: 800, quality: 85 },
} as const;

async function exists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveMaterialsRoot(): Promise<string> {
  if (process.env.MATERIALS_DIR) {
    return path.resolve(process.env.MATERIALS_DIR);
  }

  const candidates = [
    "/Users/dayoungpark/Documents/김주현작가/extracted/Artist_Website_Materials",
    path.join(ROOT, "_materials", "from-user", "Artist_Website_Materials"),
    path.join(ROOT, "_materials", "Artist_Website_Materials"),
    "/Users/dayoungpark/Documents/김주현작가/Artist_Website_Materials",
    path.join(ROOT, "_materials"),
  ];

  for (const candidate of candidates) {
    if (
      (await exists(path.join(candidate, "03_work"))) ||
      (await exists(path.join(candidate, "01_main")))
    ) {
      return candidate;
    }
  }

  return path.join(ROOT, "_materials");
}

async function optimizeToWebp(
  src: string,
  destRelative: string,
  maxWidth: number,
  quality: number,
) {
  const dest = path.join(PUBLIC, destRelative.replace(/\.[^.]+$/i, ".webp"));
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(src)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  return `/${path.relative(PUBLIC, dest).replace(/\\/g, "/")}`;
}

async function copyBinaryToPublic(src: string, destRelative: string) {
  const dest = path.join(PUBLIC, destRelative);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(src, dest);
  return `/${destRelative.replace(/\\/g, "/")}`;
}

function parseInfoLine(raw: string) {
  const line = raw
    .split("\n")
    .map((part) => part.trim())
    .find(Boolean);

  if (!line) return null;

  const parts = line.split(",").map((part) => part.trim());
  if (parts.length < 4) return null;

  const year = Number(parts[parts.length - 1]);
  const size = parts[parts.length - 2];
  const material = parts[parts.length - 3];
  const title = parts.slice(0, parts.length - 3).join(", ");

  return { title, material, size, year };
}

async function findInfoFile(dir: string) {
  const entries = await readdir(dir);
  const infoFile =
    entries.find((entry) => /^info/i.test(entry) && /\.txt/i.test(entry)) ??
    entries.find((entry) => /\.txt$/i.test(entry));
  return infoFile ? path.join(dir, infoFile) : null;
}

async function findMainImage(dir: string) {
  const entries = await readdir(dir);
  const candidates = entries.filter(
    (entry) =>
      IMAGE_EXT.test(entry) &&
      !/detail/i.test(entry) &&
      /^main/i.test(entry),
  );

  const preferred =
    candidates.find((entry) => /^main\.jpe?g$/i.test(entry)) ??
    candidates.find((entry) => /^main\.(jpe?g|tiff?)$/i.test(entry)) ??
    candidates.find((entry) => /^main/i.test(entry));

  if (preferred) return path.join(dir, preferred);

  const fallback = entries
    .filter((entry) => IMAGE_EXT.test(entry) && !/detail/i.test(entry))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];

  return fallback ? path.join(dir, fallback) : null;
}

async function collectExhibitionImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && IMAGE_EXT.test(entry.name)) {
      images.push(fullPath);
      continue;
    }
    if (
      entry.isDirectory() &&
      /(전시전경|installation)/i.test(entry.name)
    ) {
      images.push(...(await collectExhibitionImages(fullPath)));
    }
  }

  return images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function importMain(materials: string) {
  const mainDir = path.join(materials, "01_main");
  if (!(await exists(mainDir))) return;

  const files = await readdir(mainDir);
  const background = files.find(
    (file) => /main_background/i.test(file) && IMAGE_EXT.test(file),
  );
  if (!background) return;

  const publicPath = await optimizeToWebp(
    path.join(mainDir, background),
    "images/main/main_background.webp",
    SIZES.hero.width,
    SIZES.hero.quality,
  );

  const sitePath = path.join(CONTENT, "site.json");
  const site = JSON.parse(await readFile(sitePath, "utf-8"));
  site.mainBackgroundImage = publicPath;
  await writeFile(sitePath, `${JSON.stringify(site, null, 2)}\n`);
}

async function importAbout(materials: string) {
  const aboutDir = path.join(materials, "02_About");
  if (!(await exists(aboutDir))) return;

  const files = await readdir(aboutDir);
  const introFile = files.find(
    (file) => /artist_intro/i.test(file) && file.endsWith(".txt"),
  );
  const cvFile = files.find((file) => /cv/i.test(file) && /\.pdf$/i.test(file));

  const about = JSON.parse(await readFile(path.join(CONTENT, "about.json"), "utf-8"));

  if (introFile) {
    about.intro = (await readFile(path.join(aboutDir, introFile), "utf-8"))
      .replace(/\r\n/g, "\n")
      .trim();
  }

  if (cvFile) {
    await copyBinaryToPublic(path.join(aboutDir, cvFile), "files/cv.pdf");
    about.cvFile = "/files/cv.pdf";
  }

  const profile = files.find((file) => /profile/i.test(file) && IMAGE_EXT.test(file));
  if (profile) {
    about.profileImage = await optimizeToWebp(
      path.join(aboutDir, profile),
      "images/about/profile.webp",
      SIZES.profile.width,
      SIZES.profile.quality,
    );
  } else {
    delete about.profileImage;
  }

  await writeFile(path.join(CONTENT, "about.json"), `${JSON.stringify(about, null, 2)}\n`);
}

async function importContact(materials: string) {
  const contactDir = path.join(materials, "05_Contact");
  if (!(await exists(contactDir))) return;

  const files = await readdir(contactDir);
  const contactFile = files.find((file) => /contact/i.test(file) && file.endsWith(".txt"));
  if (!contactFile) return;

  const raw = await readFile(path.join(contactDir, contactFile), "utf-8");
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const contact = {
    email: lines.find((line) => line.includes("@")) ?? "",
    instagram: lines.find((line) => line.includes("instagram")) ?? "",
  };

  if (contact.email || contact.instagram) {
    await writeFile(
      path.join(CONTENT, "contact.json"),
      `${JSON.stringify(contact, null, 2)}\n`,
    );
  }
}

async function importWorks(materials: string) {
  const workRoot = path.join(materials, "03_work");
  if (!(await exists(workRoot))) return;

  const years = (await readdir(workRoot, { withFileTypes: true }))
    .filter(
      (entry) =>
        entry.isDirectory() &&
        /^\d{4}$/.test(entry.name) &&
        entry.name !== "04_exhibition",
    )
    .map((entry) => entry.name)
    .sort((a, b) => Number(b) - Number(a));

  for (const year of years) {
    const yearDir = path.join(workRoot, year);
    const workDirs = (await readdir(yearDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && /^work_/i.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const artworks = [];

    for (const workDirName of workDirs) {
      const workDir = path.join(yearDir, workDirName);
      const infoPath = await findInfoFile(workDir);
      const imagePath = await findMainImage(workDir);
      if (!infoPath || !imagePath) {
        console.warn(`[skip] ${year}/${workDirName} missing info or image`);
        continue;
      }

      const parsed = parseInfoLine(await readFile(infoPath, "utf-8"));
      if (!parsed) {
        console.warn(`[skip] ${year}/${workDirName} could not parse info`);
        continue;
      }

      const workId = workDirName.toLowerCase();
      const gridPath = `images/works/${year}/${workId}_main.webp`;
      const fullPath = `images/works/${year}/${workId}_full.webp`;

      const image = await optimizeToWebp(
        imagePath,
        gridPath,
        SIZES.grid.width,
        SIZES.grid.quality,
      );
      const imageFull = await optimizeToWebp(
        imagePath,
        fullPath,
        SIZES.full.width,
        SIZES.full.quality,
      );

      artworks.push({
        id: workId,
        order: Number(workDirName.replace(/\D/g, "")) || artworks.length + 1,
        title: parsed.title,
        material: parsed.material,
        size: parsed.size,
        year: parsed.year,
        image,
        imageFull,
      });
    }

    await mkdir(path.join(CONTENT, "works"), { recursive: true });
    await writeFile(
      path.join(CONTENT, "works", `${year}.json`),
      `${JSON.stringify(
        { year: Number(year), artworks: artworks.sort((a, b) => a.order - b.order) },
        null,
        2,
      )}\n`,
    );
    console.log(`[works] ${year}: ${artworks.length} artworks`);
  }
}

function extractExhibitionYear(dirName: string): number {
  const prefixMatch = dirName.match(/^\((\d{4})\)/);
  if (prefixMatch) return Number(prefixMatch[1]);

  const suffixMatch = dirName.match(/\((\d{4})\)\s*$/);
  if (suffixMatch) return Number(suffixMatch[1]);

  return 0;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^\w가-힣]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "exhibition"
  );
}

async function importExhibitions(materials: string) {
  const exhibitionRoot = path.join(materials, "04_exhibition");
  if (!(await exists(exhibitionRoot))) return;

  for (const type of ["solo", "group"] as const) {
    const typeDir = path.join(exhibitionRoot, type);
    if (!(await exists(typeDir))) continue;

    const exhibitionDirs = (await readdir(typeDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    const exhibitions = [];

    for (const dirName of exhibitionDirs) {
      const dir = path.join(typeDir, dirName);
      const files = await readdir(dir);
      const infoFile = files.find((file) => /^info\.txt/i.test(file));
      const images = await collectExhibitionImages(dir);

      if (images.length === 0) {
        console.warn(`[skip] exhibition ${type}/${dirName} (no images)`);
        continue;
      }

      let title = dirName.replace(/^\(\d{4}\)\s*/, "").trim();
      let text = "";

      if (infoFile) {
        const infoRaw = await readFile(path.join(dir, infoFile), "utf-8");
        const lines = infoRaw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        title = lines[0] ?? title;
        text = lines.slice(1).join("\n\n") || "";
      }

      const exhibitionId = slugify(dirName);
      const publicImages = [];

      for (const [index, image] of images.entries()) {
        const numbered = `installation_${String(index + 1).padStart(2, "0")}.webp`;
        const dest = `images/exhibitions/${type}/${exhibitionId}/${numbered}`;
        publicImages.push(
          await optimizeToWebp(
            image,
            dest,
            SIZES.exhibition.width,
            SIZES.exhibition.quality,
          ),
        );
      }

      exhibitions.push({
        id: exhibitionId,
        title,
        text,
        images: publicImages,
        year: extractExhibitionYear(dirName),
      });
    }

    exhibitions.sort((a, b) => {
      const yearDiff = (b.year ?? 0) - (a.year ?? 0);
      if (yearDiff !== 0) return yearDiff;
      return a.title.localeCompare(b.title, "ko");
    });

    if (exhibitions.length > 0) {
      await mkdir(path.join(CONTENT, "exhibitions"), { recursive: true });
      await writeFile(
        path.join(CONTENT, "exhibitions", `${type}.json`),
        `${JSON.stringify({ type, exhibitions }, null, 2)}\n`,
      );
      console.log(`[exhibitions] ${type}: ${exhibitions.length}`);
    }
  }
}

async function main() {
  const materials = await resolveMaterialsRoot();
  console.log(`Using materials: ${materials}`);

  await importMain(materials);
  await importAbout(materials);
  await importContact(materials);
  await importWorks(materials);
  await importExhibitions(materials);

  console.log("Materials imported with WebP optimization.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
