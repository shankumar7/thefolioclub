import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CodeBlock from "@/components/CodeBlock";
import { REPO_URL } from "@/lib/config";

export const metadata = {
  title: "Submit — Portfolio Hub",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <Breadcrumb trail={[{ label: "portfolio-hub", href: "/" }, { label: "submit" }]} />
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink">
        Add your portfolio
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Two ways in. Pick whichever you&apos;re comfortable with — both end up as a
        pull request that gets validated automatically, then reviewed by a
        maintainer.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Path A */}
        <div className="folder-tab rounded-lg border border-line bg-card p-6">
          <p className="font-mono text-xs text-amber">path a</p>
          <h2 className="mt-1 font-display text-lg font-medium text-ink">
            Pull request
          </h2>
          <p className="mt-1 text-sm text-ink-soft">For anyone comfortable with git.</p>

          <ol className="mt-5 space-y-3 text-sm text-ink">
            <li>
              <span className="font-mono text-amber">1.</span> Fork{" "}
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">
                the repo
              </a>
              .
            </li>
            <li>
              <span className="font-mono text-amber">2.</span> Copy{" "}
              <code className="rounded bg-paper px-1 py-0.5 font-mono text-xs">f1/_template/</code>{" "}
              to <code className="rounded bg-paper px-1 py-0.5 font-mono text-xs">f1/your-username-short-slug/</code>.
            </li>
            <li>
              <span className="font-mono text-amber">3.</span> Fill in{" "}
              <code className="rounded bg-paper px-1 py-0.5 font-mono text-xs">portfolio.json</code> and add
              your files.
            </li>
            <li>
              <span className="font-mono text-amber">4.</span> Open a pull request. The validator comments
              automatically.
            </li>
          </ol>

          <div className="mt-5">
            <CodeBlock>
              git clone {REPO_URL}.git{"\n"}
              cd {REPO_URL.split("/").pop()}{"\n"}
              cp -r f1/_template f1/your-username-short-slug
            </CodeBlock>
          </div>
        </div>

        {/* Path B */}
        <div className="folder-tab rounded-lg border border-line bg-card p-6">
          <p className="font-mono text-xs text-amber">path b</p>
          <h2 className="mt-1 font-display text-lg font-medium text-ink">Issue form</h2>
          <p className="mt-1 text-sm text-ink-soft">No git required.</p>

          <ol className="mt-5 space-y-3 text-sm text-ink">
            <li>
              <span className="font-mono text-amber">1.</span> Open a new issue using the{" "}
              <span className="font-mono text-xs">Portfolio submission</span> template.
            </li>
            <li>
              <span className="font-mono text-amber">2.</span> Fill in the form: name, tech, description,
              links.
            </li>
            <li>
              <span className="font-mono text-amber">3.</span> Attach a screenshot and your files (zip, repo,
              or drive link).
            </li>
            <li>
              <span className="font-mono text-amber">4.</span> A maintainer turns it into a draft PR and
              takes it from there.
            </li>
          </ol>

          <a
            href={`${REPO_URL}/issues/new?template=portfolio-submission.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-md border border-ink bg-ink px-4 py-2 font-display text-sm text-paper transition-opacity hover:opacity-85"
          >
            Open the issue form ↗
          </a>
        </div>
      </div>

      {/* Schema reference */}
      <div className="mt-12">
        <h2 className="font-display text-lg font-medium text-ink">portfolio.json reference</h2>
        <p className="mt-1.5 max-w-lg text-sm text-ink-soft">
          Every folder needs one of these. <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">type</code>{" "}
          decides how your portfolio gets shown — see below.
        </p>
        <div className="mt-4">
          <CodeBlock label="portfolio.json">
{`{
  "name": "Jane Doe",
  "title": "Minimalist developer portfolio",
  "slug": "jane-doe-minimalist",
  "type": "static",
  "description": "A clean one-page portfolio with a dark mode toggle.",
  "tech": ["HTML", "CSS", "JavaScript"],
  "tags": ["minimalist", "dark-mode"],
  "github": "https://github.com/janedoe",
  "demo_url": "",
  "screenshot": "preview.png"
}`}
          </CodeBlock>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              type: "static",
              body: "Plain HTML/CSS/JS, zero dependencies. Embedded live in a sandboxed frame. The easiest option.",
            },
            {
              type: "prebuilt",
              body: "Built it with React/Vue/whatever? Run your own build and commit only the output (dist/).",
            },
            {
              type: "external",
              body: "Already hosted somewhere (Vercel, Netlify, your own domain)? Just link to it.",
            },
          ].map((t) => (
            <div key={t.type} className="rounded-lg border border-line bg-card p-4">
              <p className="font-mono text-sm text-amber">{t.type}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          Full schema, validation rules, and the reasoning behind the dependency boundary live in{" "}
          <a
            href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal hover:underline"
          >
            CONTRIBUTING.md
          </a>
          .
        </p>
      </div>

      <div className="mt-12 rounded-lg border border-line bg-paper p-6 text-center">
        <p className="text-sm text-ink-soft">
          Want to see what a finished submission looks like first?
        </p>
        <Link href="/gallery" className="mt-2 inline-block font-mono text-sm text-signal hover:underline">
          browse the gallery →
        </Link>
      </div>
    </div>
  );
}
