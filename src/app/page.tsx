import Link from "next/link";
import Cat from "@/components/Cat";
import { getAllPosts, formatDate } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <div className="cat-row">
        <Cat index={14} size="large" />
      </div>

      <h1>Hi! I&apos;m Ollie.</h1>
      <p>
        I write things here now and then, and I keep
        copies of papers I&apos;ve written over on the <Link href="/papers/">papers</Link> page.
      </p>
      <p>
        The clouds are procedurally generated. The cats are hand-typed.
      </p>

      <h2>Recent writing</h2>
      {posts.length === 0 ? (
        <p className="muted">Nothing yet. Check back soon.</p>
      ) : (
        <ul className="entry-list">
          {posts.map((post) => (
            <li key={post.slug} className="entry">
              <div className="entry__title">
                <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
              </div>
              <div className="entry__meta">{formatDate(post.date)}</div>
              {post.description && <p className="entry__desc">{post.description}</p>}
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link href="/blog/">All posts &rarr;</Link>
      </p>

      <hr />
      <div className="cat-row">
        <Cat index={13} />
        <Cat index={2} />
      </div>
    </>
  );
}
