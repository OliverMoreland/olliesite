import type { Metadata } from "next";
import Link from "next/link";
import Cat from "@/components/Cat";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <div className="cat-row">
        <Cat index={0} />
      </div>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : (
        <ul className="entry-list">
          {posts.map((post) => (
            <li key={post.slug} className="entry">
              <div className="entry__title">
                <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
              </div>
              <div className="entry__meta">
                {formatDate(post.date)}
                {post.tags.length > 0 && <> &middot; {post.tags.join(", ")}</>}
              </div>
              {post.description && <p className="entry__desc">{post.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
