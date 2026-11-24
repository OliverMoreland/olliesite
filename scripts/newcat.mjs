#!/usr/bin/env node
// Add one or more ASCII cats to content/cats.txt.
//
//   npm run newcat -- path/to/cat.txt [another.txt ...]
//   npm run newcat -- --dry-run path/to/cat.txt
//
// Each file is trimmed (blank lines above/below, trailing spaces, and the
// common left indent) so a cat drawn in the middle of a big empty canvas
// comes out flush-left. Tabs are expanded to spaces. Duplicates of cats
// already in the file are skipped.

import fs from "node:fs";
import path from "node:path";

const CATS_FILE = path.resolve(process.cwd(), "content", "cats.txt");

function usage(code = 1) {
  console.error("usage: npm run newcat -- [--dry-run] <cat.txt> [more.txt ...]");
  process.exit(code);
}

function expandTabs(line, width = 8) {
  let out = "";
  for (const ch of line) {
    if (ch === "\t") out += " ".repeat(width - (out.length % width));
    else out += ch;
  }
  return out;
}

export function trimCat(raw) {
  let lines = raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => expandTabs(l).replace(/\s+$/, ""));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (lines.length === 0) return "";
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}

function parseCats(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/^---$/m)
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((line) => !line.startsWith("#"))
        .join("\n")
        .replace(/^\n+/, "")
        .replace(/\s+$/, ""),
    )
    .filter((c) => c.trim().length > 0);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const files = args.filter((a) => !a.startsWith("--"));
if (files.length === 0) usage();

if (!fs.existsSync(CATS_FILE)) {
  console.error(`cannot find ${CATS_FILE}; run this from the project root`);
  process.exit(1);
}

const existingText = fs.readFileSync(CATS_FILE, "utf8");
const existing = parseCats(existingText);
let appended = "";
let count = existing.length;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`skip: ${file} does not exist`);
    continue;
  }
  const cat = trimCat(fs.readFileSync(file, "utf8"));
  if (!cat) {
    console.error(`skip: ${file} is empty`);
    continue;
  }
  if (cat.includes("---")) {
    console.error(`skip: ${file} contains "---", which is the cat separator`);
    continue;
  }
  if (existing.includes(cat)) {
    console.error(`skip: ${file} is already in cats.txt`);
    continue;
  }
  const width = Math.max(...cat.split("\n").map((l) => l.length));
  const rows = cat.split("\n").length;
  console.log(`\n${cat}\n`);
  console.log(`${path.basename(file)}: ${rows} rows x ${width} cols -> index ${count}`);
  appended += `---\n# from ${path.basename(file)}\n${cat}\n`;
  existing.push(cat);
  count++;
}

if (!appended) {
  console.error("nothing added");
  process.exit(1);
}

if (dryRun) {
  console.log("\n(dry run, cats.txt not changed)");
} else {
  const sep = existingText.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(CATS_FILE, sep + appended);
  console.log(`\nadded to content/cats.txt (${count} cats total)`);
}
