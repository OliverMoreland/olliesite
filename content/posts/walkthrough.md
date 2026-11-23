---
title: Hello, world
date: 2026-11-04
description: The first post on the new site, and a quick tour of how it works.
draft: true
tags: [meta]
---

This site is a pile of markdown files, a few React components, and a canvas
full of procedurally generated cloud wisps. There is no backend. Every push to
the main branch rebuilds the whole thing as static HTML and Vercel serves it.

## Writing a post

Drop a file into `content/posts/` with some frontmatter at the top:

```markdown
---
title: My next post
date: 2026-11-12
description: One sentence that shows up in the post list.
tags: [thoughts]
---

Body goes here. **Bold**, _italics_, lists, tables, and code all work.
```

Then:

```bash
git add content/posts/my-next-post.md
git commit -m "Add post"
git push
```

A minute or so later it is live.

## Things that work

- GitHub-flavoured markdown, including tables and ~~strikethrough~~
- Fenced code blocks
- Headings get anchor ids, so you can link to `#things-that-work`
- Set `draft: true` in the frontmatter to hide a post from production builds

| Thing | Status |
| ----- | ------ |
| Clouds | drifting |
| Cats | present |

> Any sufficiently advanced cat is indistinguishable from a cloud.
