import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Paper = {
  slug: string;
  title: string;
  date: string;
  authors?: string;
  venue?: string;
  /** Public URL of the PDF, e.g. /papers/my-paper.pdf */
  pdf: string;
  /** Markdown body: abstract or notes. */
  abstract: string;
};

const PAPERS_DIR = path.join(process.cwd(), "content", "papers");

export function getAllPapers(): Paper[] {
  if (!fs.existsSync(PAPERS_DIR)) return [];
  return fs
    .readdirSync(PAPERS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(PAPERS_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.md$/, "");
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? "1970-01-01");
      return {
        slug,
        title: String(data.title ?? slug),
        date,
        authors: data.authors ? String(data.authors) : undefined,
        venue: data.venue ? String(data.venue) : undefined,
        pdf: String(data.pdf ?? `/papers/${slug}.pdf`),
        abstract: content.trim(),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
