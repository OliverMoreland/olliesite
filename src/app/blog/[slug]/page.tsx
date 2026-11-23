import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cat from "@/components/Cat";
import Markdown from "@/components/Markdown";
import { getAllPosts, getPost, formatDate } from "@/lib/posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.description } : {};
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div className="meta">
        {formatDate(post.date)}
        {post.tags.length > 0 && <> &middot; {post.tags.join(", ")}</>}
      </div>
      <Markdown>{post.content}</Markdown>
      <hr />
      <div className="cat-row">
        <Cat seed={post.slug} />
      </div>
      <p>
        <Link href="/blog/">&larr; All posts</Link>
      </p>
    </article>
  );
}
