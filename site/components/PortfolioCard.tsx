import Image from "next/image";
import Link from "next/link";
import type { Portfolio } from "@/lib/types";

const typeLabel: Record<Portfolio["type"], string> = {
  static: "embedded",
  prebuilt: "embedded",
  external: "external link",
};

export default function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <article className="folder-tab">
      <Link
        href={`/portfolio/${portfolio.slug}`}
        className="group block rounded-lg border border-line bg-card transition-colors hover:border-amber"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg border-b border-line bg-paper">
          {portfolio.screenshotUrl ? (
            <Image
              src={portfolio.screenshotUrl}
              alt={`Screenshot of ${portfolio.title}`}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-ink-soft">
              no preview
            </div>
          )}
          <span className="absolute left-3 top-3 rounded bg-ink/85 px-1.5 py-0.5 font-mono text-[11px] text-paper">
            f1/{portfolio.accession}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[15px] font-medium leading-snug text-ink">
              {portfolio.title}
            </h3>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-soft">{portfolio.name}</p>
          <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{portfolio.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {portfolio.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink-soft"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto font-mono text-[11px] text-amber">
              {typeLabel[portfolio.type]}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
