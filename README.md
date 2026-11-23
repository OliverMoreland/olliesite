# olliesite

Ollie Moreland's personal site. Static Next.js, sky-blue background with
procedurally generated cloud wisps, a markdown blog, a papers page, and a
healthy number of ASCII cats.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## Write a blog post

Add a markdown file to `content/posts/`. The filename becomes the URL slug
(`content/posts/my-post.md` -> `/blog/my-post/`).

```markdown
---
title: My post
date: 2026-11-12
description: Shows up in the post list and in the page's meta description.
tags: [thoughts, cats]
draft: false
---

Markdown body. GitHub-flavoured markdown is supported.
```

Posts with `draft: true` are hidden in production builds but visible in `npm run dev`.

## Add a paper

1. Put the PDF in `public/papers/`, e.g. `public/papers/my-paper.pdf`.
2. Add `content/papers/my-paper.md`:

```markdown
---
title: My Paper Title
date: 2026-03-01
authors: Ollie Moreland, A. Coauthor
venue: Where it appeared (optional)
pdf: /papers/my-paper.pdf
---

Abstract or notes, in markdown.
```

If `pdf` is omitted it defaults to `/papers/<filename>.pdf`.

## Add a cat

Append a cat to `content/cats.txt`, separated from the previous one by a line
containing only `---`. Cats are picked by index (`<Cat index={3} />`) or
deterministically from a seed (`<Cat seed={post.slug} />`).

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" and import the repo. The Next.js preset is
   detected automatically; no settings need changing. `output: "export"` in
   `next.config.ts` makes the build fully static.
3. Every push to `main` triggers a rebuild and deploy. Pushes to other
   branches get preview URLs.

## Layout

```
content/
  cats.txt          ASCII cats
  posts/*.md        blog posts
  papers/*.md       paper metadata + abstracts
public/papers/*.pdf the PDFs themselves
src/
  app/              routes (/, /blog, /blog/[slug], /papers, 404)
  components/       Clouds (canvas), Cat, Header, Footer, Markdown
  lib/              post/paper/cat loaders (build-time filesystem reads)
```
