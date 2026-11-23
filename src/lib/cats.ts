// A clowder of ASCII cats, loaded from content/cats.txt at build time.
// This module uses the filesystem, so only import it from server components.
import fs from "node:fs";
import path from "node:path";

function loadCats(): string[] {
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

export const cats: string[] = loadCats();

/** Deterministic string hash so server and client pick the same cat. */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function catAt(index: number): string {
  return cats[((index % cats.length) + cats.length) % cats.length];
}

export function pickCat(seed: string): string {
  return catAt(hashSeed(seed));
}
