// A clowder of ASCII cats, loaded from content/cats.txt.
// This module uses the filesystem, so only import it from server components.
//
// The file is re-read on every call rather than cached at module load, so
// `npm run dev` picks up new cats without a restart. It is a few KB, and in
// production every page is prerendered once at build time anyway.
import fs from "node:fs";
import path from "node:path";

export function getCats(): string[] {
  const file = path.join(process.cwd(), "content", "cats.txt");
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  return raw
    .split(/^---$/m)
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((line) => !line.startsWith("#"))
        .join("\n")
        .replace(/^\n+/, "")
        .replace(/\s+$/, ""),
    )
    .filter((cat) => cat.trim().length > 0);
}

/** Deterministic string hash so server and client pick the same cat. */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Cat by 0-based index in file order; indices past the end wrap around. */
export function catAt(index: number): string {
  const cats = getCats();
  return cats[((index % cats.length) + cats.length) % cats.length];
}

export function pickCat(seed: string): string {
  return catAt(hashSeed(seed));
}
