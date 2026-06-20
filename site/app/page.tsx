import Link from "next/link";
import { getAllPortfolios } from "@/lib/portfolios";
import PortfolioCard from "@/components/PortfolioCard";
import CodeBlock from "@/components/CodeBlock";
import { SITE_TAGLINE } from "@/lib/config";

export default function HomePage() {
  const portfolios = getAllPortfolios();
  const preview = portfolios.slice(0, 5);
  const remaining = Math.max(portfolios.length - preview.length, 0);

  const steps = [
    {
      n: "01",
      title: "Copy the template",
      body: "Fork the repo, or just open the issue form if you'd rather skip git.",
    },
    {
      n: "02",
      title: "Drop in your folder",
      body: "Your portfolio, plus a portfolio.json describing it, under f1/.",
    },
    {
      n: "03",
      title: "Automated check runs",
      body: "Validates structure, naming, and size — no install, no build, just a read.",
    },
    {
      n: "04",
      title: "Live after review",
      body: "A maintainer merges, the site rebuilds, your folder shows up in the gallery.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-content px-6 pb-16 pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-sm text-amber">f1/ — an open folder</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
              A directory of portfolios, built in public.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              {SITE_TAGLINE} Every entry is a real folder, contributed by the
              person who built it, reviewed in the open, and browsable by
              anyone looking for ideas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/gallery"
                className="rounded-md border border-ink bg-ink px-4 py-2.5 font-display text-sm text-paper transition-opacity hover:opacity-85"
              >
                Browse the gallery
              </Link>
              <Link
                href="/submit"
                className="rounded-md border border-line bg-card px-4 py-2.5 font-display text-sm text-ink transition-colors hover:border-amber"
              >
                Add your portfolio
              </Link>
            </div>
          </div>

          <CodeBlock label="f1/">
            <span className="text-ink-soft">$ tree f1/ -L 1</span>
            {"\n"}
            f1/{"\n"}
            {preview.map((p, i) => {
              const isLast = i === preview.length - 1 && remaining === 0;
              return (
                <span key={p.slug}>
                  <span className="text-amber-tint">{isLast ? "└── " : "├── "}</span>
                  {p.slug}/{"\n"}
                </span>
              );
            })}
            {remaining > 0 && (
              <span>
                <span className="text-amber-tint">└── </span>
                <span className="text-ink-soft">+{remaining} more</span>
                {"\n"}
              </span>
            )}
          </CodeBlock>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-content px-6 py-16">
          <h2 className="font-display text-xl font-medium text-ink">How a submission goes live</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="font-display text-sm text-amber">{step.n}</span>
                <h3 className="mt-2 font-display text-[15px] font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser grid */}
      {preview.length > 0 && (
        <section className="mx-auto max-w-content px-6 py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-medium text-ink">Recently added</h2>
            <Link
              href="/gallery"
              className="font-mono text-sm text-signal hover:underline"
            >
              view all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preview.slice(0, 3).map((p) => (
              <PortfolioCard key={p.slug} portfolio={p} />
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-content px-6 py-16 text-center">
          <h2 className="font-display text-xl font-medium text-ink">
            f1/{String(portfolios.length + 1).padStart(3, "0")}/ is open.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            That&apos;s the next accession number. It could be your folder.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-block rounded-md border border-ink bg-ink px-5 py-2.5 font-display text-sm text-paper transition-opacity hover:opacity-85"
          >
            Add your portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}
