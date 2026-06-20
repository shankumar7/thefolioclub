# Contributing a portfolio

Thanks for adding your work to the gallery. There are two ways in — pick
whichever you're comfortable with.

| Path | Best for |
|---|---|
| Pull request | Anyone comfortable with git/GitHub |
| Issue form | Anyone who isn't, or just wants it fast |

Both paths end up at the same place: a folder under `f1/` plus a pull
request that an automated check validates and a maintainer reviews.

---

## Before you start: how your portfolio gets shown

Read this part first — it decides what you submit.

Portfolios in this repo come from many different stacks (plain HTML, React,
Vue, whatever you used), but **the site's build never runs `npm install` or
any build command inside your submitted folder.** That's a deliberate
security boundary: nobody wants a stranger's `postinstall` script running
during a deploy. Because of that, your `portfolio.json` declares one of
three types:

- **`static`** — Plain HTML/CSS/JS, no build step, no `package.json`. This
  gets embedded live on your portfolio's detail page inside a sandboxed
  iframe. This is the easiest option and the one we recommend by default.
- **`prebuilt`** — You built your portfolio with React/Vue/whatever and ran
  your own `npm run build` locally. You commit only the production
  output (e.g. the contents of `dist/` or `build/`) into your folder. If
  you want to share your source for transparency, put it in a `source/`
  subfolder — it will never be installed or executed by this repo, it's
  just there for people to read.
- **`external`** — Your portfolio lives somewhere you already host it
  (Vercel, Netlify, GitHub Pages, your own domain). You submit just the
  metadata and a screenshot; your card links out to your `demo_url`.

If you're not sure, pick `static` for a basic portfolio or `external` if
you've already got a framework-based site deployed somewhere.

**Never commit `node_modules`.** A submission containing one will fail
validation automatically.

---

## Folder naming

Your folder must be named `your-github-username-short-slug`, lowercase,
hyphen-separated. Examples: `jane-doe-minimalist`, `arjun-r-darkmode`. This
keeps every submission's slug unique without anyone needing to coordinate.

## Path A: pull request (recommended)

1. Fork this repository.
2. Copy `f1/_template/` to `f1/your-username-short-slug/`.
3. Fill in `portfolio.json` (see schema below).
4. Add your files:
   - `static` -> your `index.html`, CSS, JS, directly in the folder.
   - `prebuilt` -> your built output directly in the folder, optionally a
     `source/` subfolder.
   - `external` -> just `portfolio.json` and `preview.png`.
5. Add a `preview.png` (or `.jpg`/`.svg`) screenshot of your portfolio,
   roughly 1200x800.
6. Open a pull request. A GitHub Action validates your submission
   automatically and comments with any problems. Fix and push again if it
   fails — no need to open a new PR.
7. A maintainer reviews and merges. The live site rebuilds automatically.

## Path B: issue form (no git required)

1. Open a new issue using the Portfolio submission template.
2. Fill in the form fields (name, links, tech stack, description).
3. Attach your screenshot and either a zipped static site or a link to
   where your portfolio is already hosted.
4. A maintainer (or the submission bot) turns this into a draft PR for you,
   which then goes through the same automated check and review as Path A.

This path is slower since a maintainer has to do the folder/file setup on
your behalf — use it only if you genuinely can't use git.

---

## portfolio.json schema

```json
{
  "name": "Jane Doe",
  "title": "Minimalist developer portfolio",
  "slug": "jane-doe-minimalist",
  "description": "A clean one-page portfolio with a dark mode toggle.",
  "type": "static",
  "tech": ["HTML", "CSS", "JavaScript"],
  "tags": ["minimalist", "dark-mode"],
  "github": "https://github.com/janedoe",
  "demo_url": "",
  "screenshot": "preview.png"
}
```

| Field | Required | Notes |
|---|---|---|
| name | yes | Your display name |
| title | yes | Short headline for your card |
| slug | yes | Must exactly match your folder name |
| description | yes | 1-2 sentences, shown on your card |
| type | yes | static, prebuilt, or external |
| tech | yes | Array of technologies used |
| tags | no | Array of style/category tags for filtering |
| github | yes | Link to your GitHub profile |
| demo_url | required if type is external | Where your live site is hosted |
| screenshot | yes | Filename of your preview image, in the same folder |

## What the automated check looks at

- portfolio.json exists, is valid JSON, and has every required field.
- slug matches the folder name exactly, and is unique across f1/.
- type is one of the three allowed values, and demo_url is present
  when type is external.
- No node_modules directory anywhere in the submission.
- If type is static, there's no package.json sitting in the folder
  (that would mean it's not actually dependency-free).
- A screenshot file matching screenshot exists.
- Total folder size stays under 15 MB.

It does not check code quality, design taste, or originality — that's
left to human review and to you.

## Reviewing as a maintainer

See a PR with a green check from validate-portfolio? Skim the diff for
anything that shouldn't be there (suspicious scripts, content unrelated to
a portfolio, oversized binaries), then merge. The site rebuilds and
redeploys automatically afterward.
