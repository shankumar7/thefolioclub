import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPortfolios, getPortfolioBySlug } from "@/lib/portfolios";
import Breadcrumb from "@/components/Breadcrumb";

export function generateStaticParams() {
  return getAllPortfolios().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const portfolio = getPortfolioBySlug(params.slug);
  if (!portfolio) return {};
  return {
    title: `${portfolio.title} — Portfolio Hub`,
    description: portfolio.description,
  };
}

const typeNote: Record<string, string> = {
  static: "Plain HTML/CSS/JS, embedded directly below in a sandboxed frame.",
  prebuilt: "Built with a framework, submitted as compiled output, embedded below.",
  external: "Hosted by the author. Opens in a new tab.",
};

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const portfolio = getPortfolioBySlug(params.slug);
  if (!portfolio) notFound();

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <Breadcrumb
        trail={[
          { label: "portfolio-hub", href: "/" },
          { label: "f1", href: "/gallery" },
          { label: portfolio.slug },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-amber">f1/{portfolio.accession}</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">
            {portfolio.title}
          </h1>
          <p className="mt-1 font-mono text-sm text-ink-soft">by {portfolio.name}</p>
        </div>
        {portfolio.demoUrl && (
          <a
            href={portfolio.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-ink bg-ink px-4 py-2 font-display text-sm text-paper transition-opacity hover:opacity-85"
          >
            Open live site ↗
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="overflow-hidden rounded-lg border border-line bg-card">
            {portfolio.embeddable && portfolio.embedUrl ? (
              <iframe
                src={portfolio.embedUrl}
                title={`Live preview of ${portfolio.title}`}
                sandbox="allow-scripts"
                loading="lazy"
                className="h-[600px] w-full bg-white"
              />
            ) : portfolio.screenshotUrl ? (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={portfolio.screenshotUrl}
                  alt={`Screenshot of ${portfolio.title}`}
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center font-mono text-sm text-ink-soft">
                no preview available
              </div>
            )}
          </div>
          <p className="mt-3 font-mono text-xs text-ink-soft">{typeNote[portfolio.type]}</p>

          <h2 className="mt-8 font-display text-base font-medium text-ink">About this portfolio</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {portfolio.description}
          </p>
        </div>

        <aside className="folder-tab h-fit rounded-lg border border-line bg-card p-5">
          <dl className="space-y-4">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                Type
              </dt>
              <dd className="mt-0.5 font-mono text-sm text-ink">{portfolio.type}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                Tech
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {portfolio.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </dd>
            </div>
            {portfolio.tags.length > 0 && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                  Tags
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {portfolio.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink-soft"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {portfolio.github && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                  Author
                </dt>
                <dd className="mt-0.5">
                  <a
                    href={portfolio.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-signal hover:underline"
                  >
                    {portfolio.github.replace("https://", "")}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                Added
              </dt>
              <dd className="mt-0.5 font-mono text-sm text-ink">
                {new Date(portfolio.addedAt).toISOString().slice(0, 10)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
