import type { Metadata } from "next";
import Cat from "@/components/Cat";
import Markdown from "@/components/Markdown";
import { getAllPapers } from "@/lib/papers";
import { formatDate } from "@/lib/posts";

export const metadata: Metadata = { title: "Papers" };

export default function PapersPage() {
  const papers = getAllPapers();

  return (
    <>
      <div className="cat-row">
        <Cat index={2} />
      </div>
      <h1>Papers</h1>
      <p className="muted">Things I&apos;ve written that came out as PDFs.</p>
      {papers.length === 0 ? (
        <p className="muted">No papers yet.</p>
      ) : (
        <ul className="entry-list">
          {papers.map((paper) => (
            <li key={paper.slug} className="entry">
              <div className="entry__title">
                <a href={paper.pdf} target="_blank" rel="noopener">
                  {paper.title}
                </a>
              </div>
              <div className="entry__meta">
                {[paper.authors, paper.venue, formatDate(paper.date)].filter(Boolean).join(" · ")}
              </div>
              {paper.abstract && <Markdown>{paper.abstract}</Markdown>}
              <div className="entry__actions">
                <a className="button" href={paper.pdf} target="_blank" rel="noopener">
                  Read PDF
                </a>
                <a className="button" href={paper.pdf} download>
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
